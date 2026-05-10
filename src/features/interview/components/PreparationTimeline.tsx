"use client";

import type { PreparationDay } from "@/features/interview/services/interview.service";

type PreparationTimelineProps = {
  id: string;
  plan: PreparationDay[];
};

export function PreparationTimeline({ id, plan }: PreparationTimelineProps) {
  const sorted = [...plan].sort((a, b) => a.day - b.day);

  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Preparation plan{" "}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            · {sorted.length} day{sorted.length === 1 ? "" : "s"}
          </span>
        </h2>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-sm text-muted-foreground">
          No preparation plan was generated for this report.
        </p>
      ) : (
        <ol className="relative space-y-4">
          {sorted.map((day, idx) => {
            const isLast = idx === sorted.length - 1;
            return (
              <li key={`${day.day}-${idx}`} className="relative pl-12">
                <span className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
                  D{day.day}
                </span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[17px] top-9 bottom-[-1rem] w-px bg-border"
                  />
                ) : null}

                <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Day {day.day} · Focus
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    {day.focus}
                  </h3>

                  {day.tasks?.length ? (
                    <ul className="mt-3 space-y-1.5">
                      {day.tasks.map((task, tIdx) => (
                        <li
                          key={tIdx}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1 flex size-1.5 shrink-0 rounded-full bg-primary"
                          />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
