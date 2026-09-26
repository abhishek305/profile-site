/**
 * Illustrative planning for a single MCP tool call.
 *
 * This is a simulation, not a real request: every tool name, profile and id
 * here is fictional.
 */

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

export const defaultCallConfig: CallConfig = {
  profile: "in",
  scope: "write",
  payload: "ok",
  consumer: "up",
  errs: "terse",
};

export type FlowState = "idle" | "active" | "done" | "fail" | "queued" | "skipped";

/** A step that has actually been reached; the rest of the flow is inferred. */
export type CallState = Exclude<FlowState, "idle" | "skipped">;

export interface FlowStep {
  /** Zero-based index into MCP_NODES. */
  index: number;
  state: CallState;
  message: string;
  /** Node name for the step log. */
  node?: string;
}

export interface CallPlan {
  steps: FlowStep[];
  /** What the client receives back. */
  message: string;
  /** What the model is able to do next, given `message`. */
  next: string;
}

/**
 * State words are part of the flow rather than something conveyed by colour
 * alone, so they are part of the exported vocabulary the `Flow` component
 * renders.
 */
export const STATE_WORDS: Record<FlowState, string> = {
  idle: "Ready",
  active: "Working",
  done: "Done",
  fail: "Stopped",
  queued: "Waiting",
  skipped: "Not reached",
};

export const MCP_NODES = [
  "AI client",
  "MCP server",
  "OAuth check",
  "Tool catalog",
  "Platform API",
  "Event bus",
  "Consumer",
] as const;

const step = (index: number, state: CallState, message: string): FlowStep => ({
  index,
  state,
  message,
  node: MCP_NODES[index],
});

/**
 * Plan the illustrative posts.create call, stopping at the first thing that
 * would fail. Each failure has a terse and a helpful wording so the demo can
 * show what the model does differently when it is told which field or scope is
 * at fault.
 */
export function planCall(config: CallConfig): CallPlan {
  const steps: FlowStep[] = [];
  const helpful = config.errs === "helpful";

  steps.push(
    step(
      0,
      "done",
      config.payload === "bad" ? "Sends posts.create with only a body." : "Sends posts.create with a title and a body.",
    ),
  );

  if (config.profile === "out") {
    steps.push(step(1, "fail", "The active profile does not include posts.create."));
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

  steps.push(step(1, "done", "Finds posts.create in the active profile."));

  if (config.scope === "read") {
    steps.push(step(2, "fail", "Token has read access. The tool needs write."));
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

  steps.push(step(2, "done", "Token has write scope."));

  if (config.payload === "bad") {
    steps.push(step(3, "fail", "Arguments fail the schema. title is required."));
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

  steps.push(step(3, "done", "Arguments match the schema."));
  steps.push(step(4, "done", "Creates draft P-1042."));
  steps.push(step(5, "done", "Publishes a post.created event."));

  if (config.consumer === "down") {
    steps.push(
      step(6, "queued", "Consumer is down. The event waits on the bus and retries after 2, 4 and 8 seconds."),
    );
    return {
      steps,
      message: '201 Created\n{"id":"P-1042","status":"draft"}',
      next: "It confirms the draft to the user. The audit entry arrives late, not never.",
    };
  }

  steps.push(step(6, "done", "Audit entry written."));
  return {
    steps,
    message: '201 Created\n{"id":"P-1042","status":"draft"}',
    next: "It confirms the draft to the user.",
  };
}
