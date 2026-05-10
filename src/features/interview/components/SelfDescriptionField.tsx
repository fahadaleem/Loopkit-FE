"use client";

type SelfDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

const DEFAULT_MAX = 1500;

const EXAMPLE_CHIPS: { label: string; text: string }[] = [
  {
    label: "Senior full-stack",
    text: "Senior full-stack engineer with 5+ years of React and Node.js experience. Comfortable across the stack — frontend, APIs, databases, and deployment. Looking for a role with more architecture and mentoring scope.",
  },
  {
    label: "Junior data engineer",
    text: "Recent CS grad looking for my first full-time data engineering role. Strong Python and SQL fundamentals, internship experience building ETL pipelines on Airflow + Snowflake.",
  },
  {
    label: "Frontend specialist",
    text: "Frontend engineer with 3 years of focused React/TypeScript work. Care deeply about accessibility, performance, and design-system thinking. Open to senior IC roles.",
  },
];

export function SelfDescriptionField({
  value,
  onChange,
  maxLength = DEFAULT_MAX,
}: SelfDescriptionFieldProps) {
  return (
    <div>
      <textarea
        id="selfDescription"
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder="A few sentences about your experience, strengths, and what you're aiming for. The AI uses this to tailor questions."
        className="w-full resize-y rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none"
        required
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center mr-1">
          Need a starting point?
        </span>
        {EXAMPLE_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChange(chip.text)}
            className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="mt-1.5 text-right text-xs text-muted-foreground">
        {value.length.toLocaleString()} / {maxLength.toLocaleString()}
      </div>
    </div>
  );
}
