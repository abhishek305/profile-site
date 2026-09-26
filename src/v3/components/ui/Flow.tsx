import { FlowState, FlowStep, MCP_NODES, STATE_WORDS } from "../../demos/logic/mcp";

/**
 * The MCP request path, one item per node.
 *
 * The state is carried in a text label next to every node as well as in the
 * `data-state` attribute, so the sequence is legible without relying on the
 * colour treatment alone.
 */
export const Flow = ({ steps }: { steps: FlowStep[] }) => {
  const byIndex = new Map(steps.map((step) => [step.index, step]));
  const reached = new Set(steps.map((step) => step.index));

  return (
    <ol className="flow" aria-label="MCP request flow">
      {MCP_NODES.map((node, index) => {
        const step = byIndex.get(index);
        const state: FlowState = step?.state ?? (reached.size ? "skipped" : "idle");
        return (
          <li key={node} data-state={state}>
            <b>{node}</b>
            <em>{STATE_WORDS[state]}</em>
          </li>
        );
      })}
    </ol>
  );
};
