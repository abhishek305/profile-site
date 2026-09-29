export interface Choice<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  name: string;
  legend: string;
  value: T;
  options: Choice<T>[];
  onChange: (value: T) => void;
}

/**
 * A single-choice control rendered as a segmented button row.
 *
 * The wrapping `fieldset` and its `legend` already provide the group and its
 * accessible name, so the inner container deliberately carries no `role` or
 * `aria-label` of its own; adding both made screen readers announce the group
 * name twice.
 */
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
