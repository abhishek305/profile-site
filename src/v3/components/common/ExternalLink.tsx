import type { ReactNode } from "react";

/**
 * A link that opens in a new tab.
 *
 * `noopener noreferrer` is required for safety, and the visually hidden suffix
 * tells screen reader users the tab will change, which the visual design
 * otherwise gives no hint of.
 */
export const ExternalLink = ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
  <a href={href} className={className} target="_blank" rel="noopener noreferrer">
    {children}
    <span className="vh"> (opens in a new tab)</span>
  </a>
);
