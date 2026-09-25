/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type FlowState = "idle" | "active" | "done" | "fail" | "queued" | "skipped";

export interface FlowStep {
  index: number;
  state: Exclude<FlowState, "idle">;
  message: string;
}

interface StageProps {
  hint: string;
  children: ReactNode;
  disclaimer: string;
  className?: string;
  barContent?: ReactNode;
  fallback?: string;
}

const ToastContext = createContext<(message: string) => void>(() => undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 1800);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div id="toast" role="status" aria-live="polite" className={visible ? "show" : ""}>
        {message}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export const Hint = ({ children }: { children: ReactNode }) => <span className="hint">{children}</span>;

export const Stage = ({ hint, children, disclaimer, className = "", barContent, fallback = "This demo needs JavaScript. Its text and controls are shown here as a static fallback." }: StageProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = stageRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    const hintTarget = element.querySelector(".stage-bar") ?? element;
    observer.observe(hintTarget);

    // The scroll listener is a small fallback for embedded/headless browsers
    // where IntersectionObserver updates can be throttled.
    const revealWhenVisible = () => {
      const rect = hintTarget.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        setSeen(true);
        observer.disconnect();
        window.removeEventListener("scroll", revealWhenVisible);
      }
    };
    revealWhenVisible();
    window.addEventListener("scroll", revealWhenVisible, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealWhenVisible);
    };
  }, []);

  return (
    <div ref={stageRef} className={`stage ${seen ? "seen" : ""} ${className}`.trim()} data-stage>
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
    <div className="seg" role="radiogroup" aria-label={legend}>
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

interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipsProps<T extends string> {
  label: string;
  value: T;
  options: ChipOption<T>[];
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

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
