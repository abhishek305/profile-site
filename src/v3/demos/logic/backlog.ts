/**
 * Rule-based spec-to-backlog conversion.
 *
 * Each sentence in a spec becomes a ticket with a priority, a story-point
 * estimate and any matching labels. The real architect-agent toolkit does this
 * with LLM agents; this is the deterministic stand-in used on the page.
 */

export type BacklogPriority = "Must" | "Should" | "May" | "No priority";

export interface BacklogItem {
  text: string;
  priority: BacklogPriority;
  points: number;
  labels: string[];
}

export interface BacklogResult {
  items: BacklogItem[];
  csv: string;
  summary: string;
}

export type SpecKey = "notify" | "checkout";

/** The two specs offered as preset chips. */
export const SAMPLE_SPECS: Record<SpecKey, string> = {
  notify:
    "Users must receive an email when an order ships. Users should be able to turn off marketing emails in settings. The API must expose a webhook for delivery status. Push notifications may be added later. The settings page needs a toggle for each channel.",
  checkout:
    "Customers must pay by card at checkout. The payment form should validate the card number before submitting. Refunds must be possible from the admin dashboard within 30 days. Checkout should complete in under two seconds. Saved cards may be offered to returning customers. Order confirmation appears on screen.",
};

const PRIORITY_ORDER: Record<BacklogPriority, number> = {
  Must: 0,
  Should: 1,
  May: 2,
  "No priority": 3,
};

/** Maps the demo's priorities onto the values a Jira import expects. */
const JIRA_PRIORITY: Record<BacklogPriority, string> = {
  Must: "High",
  Should: "Medium",
  May: "Low",
  "No priority": "",
};

/** Order here is also the order labels are shown and exported in. */
const BACKLOG_LABELS: ReadonlyArray<readonly [string, RegExp]> = [
  ["notifications", /\b(email|sms|push|notification|message)s?\b/i],
  ["auth", /\b(log ?in|sign ?in|password|auth\w*|token|permission)s?\b/i],
  ["api", /\b(api|endpoint|webhook)s?\b/i],
  ["ui", /\b(page|screen|button|form|ui|dashboard|toggle|settings)\b/i],
  ["data", /\b(store|save[sd]?|database|record|data)\b/i],
  ["payments", /\b(pay|payment|card|cards|checkout|refund\w*)\b/i],
  ["performance", /\b(fast|seconds?|latency|performance|scale)\b/i],
];

const csvCell = (value: unknown): string => `"${String(value).replace(/"/g, '""')}"`;

const priorityFor = (sentence: string): BacklogPriority => {
  if (/\b(must|required|needs? to)\b/i.test(sentence)) return "Must";
  if (/\bshould\b/i.test(sentence)) return "Should";
  if (/\b(may|could|optional|nice to have)\b/i.test(sentence)) return "May";
  return "No priority";
};

const pointsFor = (sentence: string): number => {
  const words = sentence.split(/\s+/).length;
  if (words < 8) return 1;
  if (words < 14) return 2;
  if (words < 22) return 3;
  return 5;
};

const labelsFor = (sentence: string): string[] =>
  BACKLOG_LABELS.filter(([, pattern]) => pattern.test(sentence)).map(([label]) => label);

const sentencesFromSpec = (spec: string): string[] =>
  (spec.replace(/\s*\n+\s*/g, " ").match(/[^.!?]+[.!?]?/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 2);

const csvForItems = (items: readonly BacklogItem[]): string => {
  const rows = ["Summary,Issue Type,Priority,Story Points,Labels"];
  for (const item of items) {
    rows.push(
      [csvCell(item.text), "Story", JIRA_PRIORITY[item.priority], item.points, csvCell(item.labels.join(" "))].join(","),
    );
  }
  return rows.join("\n");
};

const summaryForItems = (items: readonly BacklogItem[]): string => {
  if (!items.length) return "";
  const total = items.reduce((sum, item) => sum + item.points, 0);
  const unprioritised = items.filter((item) => item.priority === "No priority").length;
  return (
    `${items.length}${items.length === 1 ? " ticket, " : " tickets, "}${total} points` +
    (unprioritised
      ? `, ${unprioritised} without a priority. Add "must", "should" or "may" to rate ${unprioritised === 1 ? "it." : "them."}`
      : ".")
  );
};

/**
 * Turn each sentence in a spec into a ticket, ordered by priority and then by
 * the order it appeared in the spec. Always returns CSV-shaped text, even when
 * there are no tickets.
 */
export function buildBacklog(spec: string): BacklogResult {
  const parsed = sentencesFromSpec(spec).map((text, index) => ({
    index,
    item: {
      text,
      priority: priorityFor(text),
      points: pointsFor(text),
      labels: labelsFor(text),
    },
  }));

  parsed.sort(
    (a, b) => PRIORITY_ORDER[a.item.priority] - PRIORITY_ORDER[b.item.priority] || a.index - b.index,
  );

  const items = parsed.map(({ item }) => item);
  return {
    items,
    csv: csvForItems(items),
    summary: summaryForItems(items),
  };
}
