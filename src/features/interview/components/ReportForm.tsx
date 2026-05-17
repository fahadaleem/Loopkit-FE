"use client";

import { FormEvent, useState } from "react";
import { useGenerateReport } from "@/features/interview/hooks/useGenerateReport";
import { ResumeDropzone } from "./ResumeDropzone";
import { JobDescriptionField } from "./JobDescriptionField";
import { SelfDescriptionField } from "./SelfDescriptionField";

type SectionCardProps = {
  step: number;
  title: string;
  hint: string;
  children: React.ReactNode;
};

function SectionCard({ step, title, hint, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <header className="mb-4 flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

type ReportFormProps = {
  disabled?: boolean;
  disabledReason?: string | null;
};

export function ReportForm({ disabled = false, disabledReason }: ReportFormProps = {}) {
  const { submit, isLoading, error } = useGenerateReport();

  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const isValid =
    resume !== null &&
    jobDescription.trim().length >= 30 &&
    selfDescription.trim().length >= 20;

  const submitDisabled = !isValid || isLoading || disabled;
  const tooltipId = "report-form-submit-tooltip";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || !resume || disabled) return;
    submit({
      resume,
      jobDescription: jobDescription.trim(),
      selfDescription: selfDescription.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SectionCard
        step={1}
        title="Resume (PDF)"
        hint="Upload your latest resume. We'll extract the text on the server — the file itself stays private to your account."
      >
        <ResumeDropzone file={resume} onChange={setResume} />
      </SectionCard>

      <SectionCard
        step={2}
        title="Job description"
        hint="Paste the full job posting. Include responsibilities, requirements, and any preferred skills."
      >
        <JobDescriptionField
          value={jobDescription}
          onChange={setJobDescription}
        />
      </SectionCard>

      <SectionCard
        step={3}
        title="About you"
        hint="A short self-description helps the AI tailor questions to your level and goals."
      >
        <SelfDescriptionField
          value={selfDescription}
          onChange={setSelfDescription}
        />
      </SectionCard>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="group relative">
          <button
            type="submit"
            disabled={submitDisabled}
            aria-disabled={submitDisabled}
            aria-describedby={
              disabled && disabledReason ? tooltipId : undefined
            }
            title={disabled && disabledReason ? disabledReason : undefined}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Submitting…" : "Generate report"}
          </button>
          {disabled && disabledReason ? (
            <span
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-xs -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1.5 text-center text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {disabledReason}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-full -mt-px size-2 -translate-x-1/2 rotate-45 bg-foreground"
              />
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isLoading
            ? "Queuing your report — you'll be redirected in a moment."
            : disabled && disabledReason
              ? disabledReason
              : "We'll queue your report and take you to the status page so you don't have to wait here."}
        </p>
      </div>
    </form>
  );
}
