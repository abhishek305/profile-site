import type { ResultClaim } from "../../types";

/**
 * A list of figures that each expand to explain what changed.
 *
 * Native `details`/`summary` keeps this keyboard accessible and searchable
 * without any script.
 */
export const Receipts = ({ items }: { items: readonly ResultClaim[] }) => (
  <div className="receipts">
    {items.map((item) => (
      <details key={item.value}>
        <summary>{item.value}</summary>
        <p>{item.explanation}</p>
      </details>
    ))}
  </div>
);
