"use client";

type InputsAccordionProps = {
  id: string;
  jobDescription: string;
  selfDescription?: string;
  resume?: string;
};

function Block({ label, content }: { label: string; content?: string }) {
  if (!content) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface-muted/50 px-3 py-2.5 text-sm leading-relaxed text-foreground">
        {content}
      </div>
    </div>
  );
}

export function InputsAccordion({
  id,
  jobDescription,
  selfDescription,
  resume,
}: InputsAccordionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <details className="group rounded-xl border border-border bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between p-4 sm:p-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Inputs used for this report
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              The job description, self-description, and resume text the AI saw.
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0 text-muted-foreground transition group-open:rotate-180"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </summary>

        <div className="space-y-4 border-t border-border px-4 py-4 sm:px-5">
          <Block label="Job description" content={jobDescription} />
          <Block label="Self-description" content={selfDescription} />
          <Block label="Resume (extracted text)" content={resume} />
        </div>
      </details>
    </section>
  );
}
