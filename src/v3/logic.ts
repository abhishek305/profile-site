/**
 * Pure, typed logic for the V3 playable demos.
 *
 * The rules in this file are ports of the behaviour in the design prototype.
 * They deliberately have no React, DOM or network dependencies so a component
 * can render the result and a test can assert it without a browser.
 */

/* ------------------------------------------------------------------------- *
 * architect-agent: spec -> prioritised backlog + CSV
 * ------------------------------------------------------------------------- */

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

/** The two specs used by the demo's preset chips in the prototype. */
export const SAMPLE_SPECS = {
  notify:
    "Users must receive an email when an order ships. Users should be able to turn off marketing emails in settings. The API must expose a webhook for delivery status. Push notifications may be added later. The settings page needs a toggle for each channel.",
  checkout:
    "Customers must pay by card at checkout. The payment form should validate the card number before submitting. Refunds must be possible from the admin dashboard within 30 days. Checkout should complete in under two seconds. Saved cards may be offered to returning customers. Order confirmation appears on screen.",
} as const;

export const SPECS = SAMPLE_SPECS;

/** Aliases for consumers that prefer a shorter name. */
export type Ticket = BacklogItem;
export type Backlog = BacklogResult;

const PRIORITY_ORDER: Record<BacklogPriority, number> = {
  Must: 0,
  Should: 1,
  May: 2,
  "No priority": 3,
};

const JIRA_PRIORITY: Record<BacklogPriority, string> = {
  Must: "High",
  Should: "Medium",
  May: "Low",
  "No priority": "",
};

/* The order here is also the order in which labels are shown and exported. */
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
 * Turn each sentence in a spec into a ticket.
 *
 * Parsing intentionally follows the prototype, including its handling of
 * punctuation as sentence boundaries and its word-count thresholds. The
 * result is always CSV-shaped text, even when there are no tickets.
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

/* ------------------------------------------------------------------------- *
 * Crowdly: fictional, deterministic audience
 * ------------------------------------------------------------------------- */

export const INTEREST_OPTIONS = ["Music", "Comedy", "Tech talks", "Food"] as const;
export type Interest = (typeof INTEREST_OPTIONS)[number];

export const CITIES = ["Mumbai", "Pune", "Bengaluru", "Delhi", "London"] as const;
export type City = (typeof CITIES)[number];

export interface Person {
  name: string;
  initials: string;
  interest: string;
  city: string;
  /** Days since the person was last active. */
  activeDays: number;
  /** Number of events booked. */
  bookings: number;
}

export type FictionalPerson = Person;
export type AudiencePerson = Person;

/** The prototype's small mulberry32-style generator. */
export function rng(seed: number): () => number {
  let state = seed;
  return function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  "Asha",
  "Ben",
  "Chen",
  "Dara",
  "Elif",
  "Farah",
  "Gus",
  "Hana",
  "Ivan",
  "Jo",
  "Kai",
  "Lena",
  "Mo",
  "Nia",
  "Omar",
  "Priya",
  "Quinn",
  "Rui",
  "Sana",
  "Tomas",
] as const;

const LAST_NAMES = [
  "Reyes",
  "Iyer",
  "Novak",
  "Okafor",
  "Lindqvist",
  "Haddad",
  "Moreau",
  "Tanaka",
  "Silva",
  "Brandt",
] as const;

export const PEOPLE_SEED = 42;
export const PEOPLE_COUNT = 240;

/** Generate the stable 240-person audience used by the demo. */
export function generatePeople(): Person[] {
  const random = rng(PEOPLE_SEED);
  const people: Person[] = [];
  for (let i = 0; i < PEOPLE_COUNT; i += 1) {
    const interestRoll = random();
    const interest: Interest =
      interestRoll < 0.35
        ? "Music"
        : interestRoll < 0.6
          ? "Comedy"
          : interestRoll < 0.8
            ? "Tech talks"
            : "Food";
    const city = CITIES[Math.floor(random() * CITIES.length)];
    const activeDays = Math.floor(Math.pow(random(), 2) * 90) + 1;
    const bookings = Math.floor(Math.pow(random(), 1.5) * 7);
    const first = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    people.push({
      name: `${first} ${last}`,
      initials: `${first[0]}${last[0]}`,
      interest,
      city,
      activeDays,
      bookings,
    });
  }
  return people;
}

/** Function aliases kept for callers that used an earlier name. */
export const seededPeople = generatePeople;
export const makePeople = generatePeople;
export const createPeople = generatePeople;

/** A ready-made array for renderers that do not need to call the helper. */
export const people: Person[] = generatePeople();
export const fictionalPeople: Person[] = people;

export interface SegmentRules {
  /** Mutable and readonly string arrays are both accepted. */
  interests: readonly string[];
  city: string;
  days: number;
  buys: number;
}

export type AudienceRules = SegmentRules;

/**
 * Filter a fictional audience by interest, city, recency and bookings.
 * The input array is never mutated; the matching people stay in source order.
 */
export function segmentMatch(peopleToMatch: readonly Person[], rules: SegmentRules): Person[] {
  return peopleToMatch.filter(
    (person) =>
      rules.interests.indexOf(person.interest) > -1 &&
      (!rules.city || person.city === rules.city) &&
      person.activeDays <= rules.days &&
      person.bookings >= rules.buys,
  );
}

/* ------------------------------------------------------------------------- *
 * MCP Profile Hub: illustrative call planning
 * ------------------------------------------------------------------------- */

export type CallProfile = "in" | "out";
export type CallScope = "write" | "read";
export type CallPayload = "ok" | "bad";
export type CallConsumer = "up" | "down";
export type CallErrors = "terse" | "helpful";

export interface CallConfig {
  profile: CallProfile;
  scope: CallScope;
  payload: CallPayload;
  consumer: CallConsumer;
  errs: CallErrors;
}

export type FlowState = "idle" | "active" | "done" | "fail" | "queued" | "skipped";
export type CallState = "done" | "fail" | "queued";

/** State words are part of the flow, not something conveyed by colour alone. */
export const STATE_WORD: Record<FlowState, string> = {
  idle: "Ready",
  active: "Working",
  done: "Done",
  fail: "Stopped",
  queued: "Waiting",
  skipped: "Not reached",
};
export const STATE_WORDS = STATE_WORD;

export const MCP_NODES = [
  "AI client",
  "MCP server",
  "OAuth check",
  "Tool catalog",
  "Platform API",
  "Event bus",
  "Consumer",
] as const;

export interface CallStep {
  /** Zero-based index into MCP_NODES, matching the prototype's flow. */
  index: number;
  state: CallState;
  message: string;
  /** Node name for the step log; the core step fields stay index/state/message. */
  node?: string;
}

export interface CallPlan {
  steps: CallStep[];
  message: string;
  next: string;
}

export type PlanCallResult = CallPlan;
export type McpCallConfig = CallConfig;

const planStep = (index: number, state: CallState, message: string): CallStep => ({
  index,
  state,
  message,
  node: MCP_NODES[index],
});

/**
 * Plan the illustrative posts.create call. This is a simulation, not a real
 * request: all tool names, profiles and ids are fictional.
 */
export function planCall(config: CallConfig): CallPlan {
  const steps: CallStep[] = [];
  const helpful = config.errs === "helpful";

  steps.push(
    planStep(
      0,
      "done",
      config.payload === "bad" ? "Sends posts.create with only a body." : "Sends posts.create with a title and a body.",
    ),
  );

  if (config.profile === "out") {
    steps.push(planStep(1, "fail", "The active profile does not include posts.create."));
    return {
      steps,
      message: helpful
        ? 'Tool not found\n"posts.create" is not in the "Reader" profile. This profile can list and read posts. Ask an admin for the "Editor" profile.'
        : "Tool not found",
      next: helpful
        ? "It tells the user which profile is needed instead of guessing."
        : "It assumes the tool does not exist and may improvise a workaround.",
    };
  }

  steps.push(planStep(1, "done", "Finds posts.create in the active profile."));

  if (config.scope === "read") {
    steps.push(planStep(2, "fail", "Token has read access. The tool needs write."));
    return {
      steps,
      message: helpful
        ? "403 Forbidden\nposts.create needs the write scope. This token only has read. Ask the user to reconnect and approve write access."
        : "403 Forbidden",
      next: helpful
        ? "It tells the user which permission is missing and asks them to reconnect."
        : "It cannot tell what to change, so it tends to retry the same call or give up.",
    };
  }

  steps.push(planStep(2, "done", "Token has write scope."));

  if (config.payload === "bad") {
    steps.push(planStep(3, "fail", "Arguments fail the schema. title is required."));
    return {
      steps,
      message: helpful
        ? '400 Bad Request\n"title" is required (string, 1 to 120 characters). Received only "body". Add a title and call again.'
        : "400 Bad Request",
      next: helpful
        ? "It adds a title and retries. One round trip instead of a guess."
        : "It cannot tell which argument is wrong, so it may repeat the same call.",
    };
  }

  steps.push(planStep(3, "done", "Arguments match the schema."));
  steps.push(planStep(4, "done", "Creates draft P-1042."));
  steps.push(planStep(5, "done", "Publishes a post.created event."));

  if (config.consumer === "down") {
    steps.push(
      planStep(6, "queued", "Consumer is down. The event waits on the bus and retries after 2, 4 and 8 seconds."),
    );
    return {
      steps,
      message: '201 Created\n{"id":"P-1042","status":"draft"}',
      next: "It confirms the draft to the user. The audit entry arrives late, not never.",
    };
  }

  steps.push(planStep(6, "done", "Audit entry written."));
  return {
    steps,
    message: '201 Created\n{"id":"P-1042","status":"draft"}',
    next: "It confirms the draft to the user.",
  };
}

/* ------------------------------------------------------------------------- *
 * LaTeX Live Editor: a small, safe stand-in renderer
 * ------------------------------------------------------------------------- */

export const DEFAULT_TEX_SOURCE =
  "\\section{Notes on averages}\nLet $x_i$ be the $i$-th score. The mean is\n$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$\n\\textbf{Bold} and \\emph{emphasis} work, and so do lists:\n\\begin{itemize}\n\\item First idea\n\\item Second idea\n\\end{itemize}";

export const TEX_SOURCE = DEFAULT_TEX_SOURCE;
export const SAMPLE_TEX = DEFAULT_TEX_SOURCE;

const MATH_SYMBOLS: Record<string, string> = {
  "\\alpha": "α",
  "\\beta": "β",
  "\\gamma": "γ",
  "\\delta": "δ",
  "\\mu": "μ",
  "\\sigma": "σ",
  "\\pi": "π",
  "\\theta": "θ",
  "\\lambda": "λ",
  "\\sum": "∑",
  "\\int": "∫",
  "\\infty": "∞",
  "\\cdot": "·",
  "\\times": "×",
  "\\leq": "≤",
  "\\geq": "≥",
  "\\neq": "≠",
  "\\approx": "≈",
  "\\pm": "±",
};

export interface TexRenderResult {
  html: string;
  status: string;
  error: boolean;
}

export type TexResult = TexRenderResult;

/** Escape text before it is placed in the returned HTML fragment. */
export const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const renderMath = (source: string): string => {
  let rendered = source;
  let iterations = 0;
  while (/\\frac\{[^{}]*\}\{[^{}]*\}/.test(rendered) && iterations++ < 20) {
    rendered = rendered.replace(
      /\\frac\{([^{}]*)\}\{([^{}]*)\}/g,
      '<span class="frac"><span>$1</span><span>$2</span></span>',
    );
  }
  rendered = rendered
    .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
    .replace(/\\bar\{([^{}]*)\}/g, '<span class="over">$1</span>')
    .replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
    .replace(/\^([A-Za-z0-9])/g, "<sup>$1</sup>")
    .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
    .replace(/_([A-Za-z0-9])/g, "<sub>$1</sub>");

  rendered = rendered
    .replace(/\\[a-zA-Z]+/g, (command) => MATH_SYMBOLS[command] || "")
    .replace(/\\left|\\right/g, "");
  return rendered.replace(/[{}]/g, "");
};

const TEX_PLACEHOLDER = "\u0001";

/**
 * Render the small TeX subset used by the stage. The source is escaped before
 * any markup is generated, and no visitor text is evaluated as code.
 */
export function texRender(source: string): TexRenderResult {
  const opened = (source.match(/\{/g) ?? []).length;
  const closed = (source.match(/\}/g) ?? []).length;
  const hasUnbalancedBraces = opened !== closed;
  let text = escapeHtml(source);
  const stored: string[] = [];

  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, body: string) => {
    stored.push(`<div class="dmath math">${renderMath(body)}</div>`);
    return `\n\n${TEX_PLACEHOLDER}${stored.length - 1}${TEX_PLACEHOLDER}\n\n`;
  });
  text = text.replace(/\$([^$\n]+?)\$/g, (_match, body: string) => {
    stored.push(`<span class="math">${renderMath(body)}</span>`);
    return `${TEX_PLACEHOLDER}${stored.length - 1}${TEX_PLACEHOLDER}`;
  });

  text = text
    .replace(/\\section\{([^{}]*)\}/g, "\n\n<h3>$1</h3>\n\n")
    .replace(/\\subsection\{([^{}]*)\}/g, "\n\n<h3>$1</h3>\n\n")
    .replace(/\\textbf\{([^{}]*)\}/g, "<b>$1</b>")
    .replace(/\\emph\{([^{}]*)\}/g, "<i>$1</i>")
    .replace(/\\textit\{([^{}]*)\}/g, "<i>$1</i>");

  text = text.replace(/\\begin\{(itemize|enumerate)\}([\s\S]*?)\\end\{\1\}/g, (_match, kind: string, body: string) => {
    const tag = kind === "itemize" ? "ul" : "ol";
    const items = body
      .split(/\\item/)
      .slice(1)
      .map((item) => `<li>${item.trim()}</li>`)
      .join("");
    return `\n\n<${tag}>${items}</${tag}>\n\n`;
  });

  let html = text
    .split(/\n\s*\n/)
    .map((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return "";
      if (/^<(h3|ul|ol)/.test(trimmed) || new RegExp(`^${TEX_PLACEHOLDER}\\d+${TEX_PLACEHOLDER}$`).test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .join("");

  html = html.replace(new RegExp(`${TEX_PLACEHOLDER}(\\d+)${TEX_PLACEHOLDER}`, "g"), (_match, index: string) => stored[Number(index)]);

  if (!html) html = '<p class="empty">Start typing LaTeX on the left.</p>';

  const status = hasUnbalancedBraces
    ? `Braces don't match: ${opened} opened, ${closed} closed. Check the last \\textbf, \\emph or \\frac.`
    : "Rendered in 1 ms, in your browser.";

  return { html, status, error: hasUnbalancedBraces };
}

export const renderTex = texRender;
