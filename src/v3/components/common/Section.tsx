import type { ReactNode } from "react";

/**
 * A titled content section.
 *
 * On the home page sections are `h2` under the page `h1`. On a standalone
 * route the page head already owns the `h1`, so the section takes `level={2}`
 * with its own `h2` rather than being left with a heading gap.
 *
 * `tabIndex={-1}` makes the section programmatically focusable, which is what
 * lets an in-page `#anchor` link hand focus to its target instead of leaving a
 * keyboard user stranded at the top of the document.
 */
export const Section = ({
  id,
  title,
  level = 2,
  className = "chapter",
  children,
  labelledBy,
  label,
}: {
  id: string;
  title?: string;
  level?: 1 | 2 | 3;
  className?: string;
  children: ReactNode;
  /** Id of the visible heading, when the section is labelled by one. */
  labelledBy?: string;
  /** Accessible name for sections with no visible heading of their own. */
  label?: string;
}) => {
  const headingId = `${id}-heading`;
  const Heading = `h${level}` as "h1" | "h2" | "h3";

  return (
    <section
      className={className}
      id={id}
      tabIndex={-1}
      aria-labelledby={title ? headingId : labelledBy}
      aria-label={title ? undefined : label}
    >
      {title && <Heading id={headingId}>{title}</Heading>}
      {children}
    </section>
  );
};
