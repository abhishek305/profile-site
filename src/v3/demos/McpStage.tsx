import { useEffect, useReducer, useRef } from "react";
import { defaultCallConfig, planCall, type CallConfig, type CallPlan, type FlowStep } from "./logic/mcp";
import { Stage } from "../components/layout/Stage";
import { Flow } from "../components/ui/Flow";
import { Segmented } from "../components/ui/Segmented";

const STEP_MS = 520;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface State {
  config: CallConfig;
  hasRun: boolean;
  steps: FlowStep[];
  log: string[];
  message: string;
  next: string;
  /** Guards against a stale timer writing over a newer run. */
  runId: number;
}

type Action =
  | { type: "config"; config: CallConfig }
  | { type: "start"; runId: number }
  | { type: "reveal"; runId: number; index: number; step: FlowStep }
  | { type: "settle"; runId: number; index: number; step: FlowStep }
  | { type: "finish"; runId: number; plan: CallPlan }
  | { type: "reset" };

const initialState: State = {
  config: defaultCallConfig,
  hasRun: false,
  steps: [],
  log: [],
  message: 'Press "Run the call".',
  next: "",
  runId: 0,
};

const logLine = (step: FlowStep) => `${step.node ?? "Call"}: ${step.message}`;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "config":
      return { ...state, config: action.config };

    case "start":
      return { ...state, hasRun: true, steps: [], log: [], message: "Working...", next: "" };

    case "reveal": {
      if (state.runId !== action.runId) return state;
      const { index, step } = action;
      return {
        ...state,
        steps: [...state.steps.slice(0, index), { ...step, state: "active" }],
        log: [...state.log, logLine(step)],
      };
    }

    // A step that has been reached settles into its real state: Done, Stopped
    // or Waiting. Without this the node sits on "Working" until the whole run
    // finishes, and watching the flow progress is the point of the demo.
    case "settle": {
      if (state.runId !== action.runId) return state;
      return { ...state, steps: [...state.steps.slice(0, action.index), action.step] };
    }

    case "finish": {
      if (state.runId !== action.runId) return state;
      return {
        ...state,
        steps: action.plan.steps,
        log: action.plan.steps.map(logLine),
        message: action.plan.message,
        next: action.plan.next,
      };
    }

    case "reset":
      return { ...initialState, runId: state.runId + 1 };
  }
};

export const McpStage = ({
  disclaimer = "Illustrative simulation with a fictional tool and fictional profiles. Not production data.",
}: {
  disclaimer?: string;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const runIdRef = useRef(0);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const run = (config: CallConfig) => {
    clearTimers();
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    const plan = planCall(config);

    dispatch({ type: "start", runId });

    if (prefersReducedMotion()) {
      dispatch({ type: "finish", runId, plan });
      return;
    }

    const advance = (index: number) => {
      if (index >= plan.steps.length) {
        dispatch({ type: "finish", runId, plan });
        return;
      }
      const step = plan.steps[index];
      dispatch({ type: "reveal", runId, index, step });
      timers.current.push(
        setTimeout(() => {
          if (runIdRef.current !== runId) return;
          dispatch({ type: "settle", runId, index, step });
          advance(index + 1);
        }, STEP_MS),
      );
    };

    advance(0);
  };

  /** Changing a switch re-runs the call, so the effect of the change is visible. */
  const change = <K extends keyof CallConfig>(key: K, value: CallConfig[K]) => {
    const config = { ...state.config, [key]: value };
    dispatch({ type: "config", config });
    if (state.hasRun) run(config);
  };

  const reset = () => {
    runIdRef.current += 1;
    clearTimers();
    dispatch({ type: "reset" });
  };

  const { config } = state;

  return (
    <Stage
      hint="Try it: break the call"
      disclaimer={disclaimer}
      fallback="This simulation needs JavaScript. It shows how a tool call passes through a profile, auth, schema validation and an event bus."
      actions={
        <>
          <button className="btn small primary" type="button" onClick={() => run(config)}>
            Run the call
          </button>
          <button className="btn small" type="button" onClick={reset}>
            Reset
          </button>
        </>
      }
    >
      <div className="controls">
        <Segmented
          name="mcp-profile"
          legend="Profile"
          value={config.profile}
          onChange={(value) => change("profile", value)}
          options={[
            { value: "in", label: "Includes the tool" },
            { value: "out", label: "Excludes it" },
          ]}
        />
        <Segmented
          name="mcp-scope"
          legend="Token"
          value={config.scope}
          onChange={(value) => change("scope", value)}
          options={[
            { value: "write", label: "Can write" },
            { value: "read", label: "Read only" },
          ]}
        />
        <Segmented
          name="mcp-payload"
          legend="Arguments"
          value={config.payload}
          onChange={(value) => change("payload", value)}
          options={[
            { value: "ok", label: "Valid" },
            { value: "bad", label: "Title missing" },
          ]}
        />
        <Segmented
          name="mcp-consumer"
          legend="Consumer"
          value={config.consumer}
          onChange={(value) => change("consumer", value)}
          options={[
            { value: "up", label: "Healthy" },
            { value: "down", label: "Down" },
          ]}
        />
        <Segmented
          name="mcp-errors"
          legend="Error messages"
          value={config.errs}
          onChange={(value) => change("errs", value)}
          options={[
            { value: "terse", label: "Terse" },
            { value: "helpful", label: "Helpful" },
          ]}
        />
      </div>

      <Flow steps={state.steps} />

      <div className="out">
        <div className="pane">
          <h3>What the client receives</h3>
          {/*
            Assertive because it is the outcome of an explicit "Run the call"
            press, and polite would let it be queued behind the step log below.
          */}
          <pre className="msg" role="status" aria-live="assertive">
            {state.message}
          </pre>
          <h3>What the model can do next</h3>
          <p className="next">{state.next || "\u00a0"}</p>
        </div>
        <div className="pane">
          <h3>Step by step</h3>
          <ol className="log" aria-live="polite" aria-relevant="additions">
            {state.log.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ol>
        </div>
      </div>
    </Stage>
  );
};
