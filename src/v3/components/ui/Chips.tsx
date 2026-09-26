import type { Choice } from "./Segmented";

interface ChipsProps<T extends string> {
  label: string;
  value: T;
  options: Choice<T>[];
  onChange: (value: T) => void;
}

/**
 * A row of toggle buttons for switching views or presets.
 *
 * Uses `aria-pressed` rather than a radio group: the buttons sit alongside
 * other stage controls in the stage bar, and toggle buttons read correctly
 * there where a `radiogroup` would imply a self-contained widget.
 */
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
