import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface StageProps {
  hint: string;
  children: ReactNode;
  disclaimer: string;
  className?: string;
  barContent?: ReactNode;
  fallback?: string;
}

export const Hint = ({ children }: { children: ReactNode }) => <span className="hint">{children}</span>;

export const Stage = ({
  hint,
  children,
  disclaimer,
  className = "",
  barContent,
  fallback = "This demo needs JavaScript. Its text and controls are shown here as a static fallback.",
}: StageProps) => {
  // The hint bar is what animates in, so that is the element worth watching.
  const { ref: stageRef, inView: seen } = useInView<HTMLDivElement>({ threshold: 0.6 });

  return (
    <div ref={stageRef} className={`stage ${seen ? "seen" : ""} ${className}`.trim()}>
      <div className="stage-bar">
        <Hint>{hint}</Hint>
        {barContent}
        <span className="spacer" />
      </div>
      {children}
      <noscript>
        <p>{fallback}</p>
      </noscript>
      <p className="disclaimer">{disclaimer}</p>
    </div>
  );
};

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  name: string;
  legend: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
}

export const Segmented = <T extends string>({ name, legend, value, options, onChange }: SegmentedProps<T>) => (
  <fieldset className="ctl">
    <legend>{legend}</legend>
    <div className="seg">
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

interface ChipsProps<T extends string> {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
}

export const Chips = <T extends string>({ label, value, options, onChange }: ChipsProps<T>) => (
  <div className="chips" role="group" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className="chip"
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export interface FlowStep {
  index: number;
  state: Exclude<FlowState, "idle">;
  message: string;
}

export type FlowState = "idle" | "active" | "done" | "fail" | "queued" | "skipped";

const flowLabels: Record<FlowState, string> = {
  idle: "Ready",
  active: "Working",
  done: "Done",
  fail: "Stopped",
  queued: "Waiting",
  skipped: "Not reached",
};

const flowNodes = ["AI client", "MCP server", "OAuth check", "Tool catalog", "Platform API", "Event bus", "Consumer"];

export const Flow = ({ steps }: { steps: FlowStep[] }) => {
  const byIndex = new Map(steps.map((step) => [step.index, step]));
  const reached = new Set(steps.map((step) => step.index));
  return (
    <ol className="flow" aria-label="MCP request flow">
      {flowNodes.map((node, index) => {
        const step = byIndex.get(index);
        const state: FlowState = step?.state ?? (reached.size ? "skipped" : "idle");
        return (
          <li key={node} data-state={state}>
            <b>{node}</b>
            <em>{flowLabels[state]}</em>
          </li>
        );
      })}
    </ol>
  );
};

export const Receipts = ({ items }: { items: Array<{ value: string; explanation: string }> }) => (
  <div className="receipts">
    {items.map((item) => (
      <details key={item.value}>
        <summary>{item.value}</summary>
        <p>{item.explanation}</p>
      </details>
    ))}
  </div>
);
