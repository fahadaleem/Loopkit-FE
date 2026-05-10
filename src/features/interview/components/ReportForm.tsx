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

export function ReportForm() {
  const { submit, isLoading, error } = useGenerateReport();

  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const isValid =
    resume !== null &&
    jobDescription.trim().length >= 30 &&
    selfDescription.trim().length >= 20;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || !resume) return;
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
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Generating your report…" : "Generate report"}
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isLoading
            ? "This can take 20–30 seconds while the AI prepares tailored questions."
            : "We'll analyse your resume against the JD and produce a tailored prep report."}
        </p>
      </div>
    </form>
  );
}
