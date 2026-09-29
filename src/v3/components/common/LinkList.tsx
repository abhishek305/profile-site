import type { ProjectLink } from "../../types";
import { ExternalLink } from "./ExternalLink";

/**
 * A row of outbound links separated by a middot.
 *
 * The separator is drawn with CSS rather than interleaved into the JSX, which
 * keeps the links contiguous in the accessibility tree instead of reading as
 * "label, separator, label".
 */
export const LinkList = ({ links }: { links: readonly ProjectLink[] }) => (
  <span className="linklist">
    {links.map((link) => (
      <ExternalLink key={link.href} href={link.href}>
        {link.label}
      </ExternalLink>
    ))}
  </span>
);
