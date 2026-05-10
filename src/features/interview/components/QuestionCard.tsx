"use client";

type QuestionCardProps = {
  index: number;
  question: string;
  intention: string;
  answer: string;
};

export function QuestionCard({
  index,
  question,
  intention,
  answer,
}: QuestionCardProps) {
  return (
    <details className="group rounded-xl border border-border bg-surface transition open:border-primary/40">
      <summary className="flex cursor-pointer list-none items-start gap-3 p-4 sm:p-5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {index}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">
          {question}
        </span>
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
          className="mt-0.5 shrink-0 text-muted-foreground transition group-open:rotate-180"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>

      <div className="space-y-4 border-t border-border px-4 py-4 sm:px-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-foreground">
            Why they ask
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {intention}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-foreground">
            How to answer
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
            {answer}
          </p>
        </div>
      </div>
    </details>
  );
}
