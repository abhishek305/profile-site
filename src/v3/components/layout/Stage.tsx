import type { ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

const DEFAULT_FALLBACK =
  "This demo needs JavaScript. Its text and controls are shown here as a static fallback.";

interface StageProps {
  /** The one-line prompt shown in the stage bar, e.g. "Try it: break the call". */
  hint: string;
  disclaimer: string;
  children: ReactNode;
  /** Controls rendered in the stage bar, such as Run and Reset. */
  actions?: ReactNode;
  className?: string;
  /** Shown inside `noscript`, describing what the stage would have done. */
  fallback?: string;
}

/**
 * The frame around a playable demo: an animated hint bar, the demo body, a
 * no-JavaScript fallback and a standing disclaimer.
 *
 * The hint bar animates in the first time the stage scrolls into view, so the
 * reveal is driven by `useInView` rather than a hand-rolled observer.
 */
export const Stage = ({
  hint,
  disclaimer,
  children,
  actions,
  className = "",
  fallback = DEFAULT_FALLBACK,
}: StageProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.6 });

  return (
    <div ref={ref} className={`stage ${inView ? "seen" : ""} ${className}`.trim()}>
      <div className="stage-bar">
        <span className="hint">{hint}</span>
        {actions}
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
