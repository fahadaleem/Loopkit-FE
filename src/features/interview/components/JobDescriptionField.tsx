"use client";

type JobDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

const DEFAULT_MAX = 8000;

export function JobDescriptionField({
  value,
  onChange,
  maxLength = DEFAULT_MAX,
}: JobDescriptionFieldProps) {
  return (
    <div>
      <textarea
        id="jobDescription"
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={
          "Paste the full job posting — responsibilities, requirements, and any 'nice to have' items.\n\ne.g. 'We're looking for a senior backend engineer with 5+ years of experience in Node.js…'"
        }
        className="w-full resize-y rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none"
        required
      />
      <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
        <span>The more detail you paste, the better the questions.</span>
        <span>
          {value.length.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
