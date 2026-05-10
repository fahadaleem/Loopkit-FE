"use client";

import { QuestionCard } from "./QuestionCard";

type QuestionItem = {
  question: string;
  intention: string;
  answer: string;
};

type QuestionListProps = {
  id: string;
  title: string;
  questions: QuestionItem[];
  emptyHint?: string;
};

export function QuestionList({
  id,
  title,
  questions,
  emptyHint,
}: QuestionListProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {title}{" "}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            · {questions.length}
          </span>
        </h2>
      </div>

      {questions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-sm text-muted-foreground">
          {emptyHint ?? "No questions in this section."}
        </p>
      ) : (
        <ul className="space-y-3">
          {questions.map((q, idx) => (
            <li key={`${title}-${idx}`}>
              <QuestionCard
                index={idx + 1}
                question={q.question}
                intention={q.intention}
                answer={q.answer}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
