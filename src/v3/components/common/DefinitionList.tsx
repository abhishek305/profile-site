import { Fragment } from "react";
import type { DefinitionItem } from "../../types";

/**
 * Renders a definition list.
 *
 * `dt` and `dd` are emitted as direct children of `dl` via a fragment rather
 * than a wrapper `div` with `display: contents`, which several screen readers
 * still expose as a stray group inside the list.
 */
export const DefinitionList = ({ id, items }: { id?: string; items: readonly DefinitionItem[] }) => (
  <dl className="defs" id={id}>
    {items.map((item) => (
      <Fragment key={item.label}>
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
      </Fragment>
    ))}
  </dl>
);
