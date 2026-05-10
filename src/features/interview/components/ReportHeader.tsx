"use client";

import type {
  InterviewReport,
  SkillSeverity,
} from "@/features/interview/services/interview.service";

type ReportHeaderProps = {
  report: InterviewReport;
};

const SEVERITY_ORDER: Record<SkillSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const SEVERITY_STYLES: Record<SkillSeverity, string> = {
  high: "border-danger/40 bg-danger/10 text-danger",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-border bg-surface-muted text-muted-foreground",
};

const SEVERITY_LABEL: Record<SkillSeverity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

function scoreTier(score: number) {
  if (score >= 70) return { label: "Strong match", barClass: "bg-emerald-500" };
  if (score >= 40) return { label: "Partial match", barClass: "bg-amber-500" };
  return { label: "Low match", barClass: "bg-danger" };
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const score = Math.max(0, Math.min(100, Math.round(report.matchScore ?? 0)));
  const tier = scoreTier(score);

  const sortedGaps = [...(report.skillGaps ?? [])].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Interview report
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {report.title || "Untitled report"}
          </h1>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Match score
          </p>
          <p className="mt-1 text-3xl font-semibold text-foreground">
            {score}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              / 100
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{tier.label}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={`h-full rounded-full transition-all ${tier.barClass}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {sortedGaps.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Skill gaps
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {sortedGaps.map((gap, idx) => (
              <li
                key={`${gap.skill}-${idx}`}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${SEVERITY_STYLES[gap.severity]}`}
              >
                <span>{gap.skill}</span>
                <span className="opacity-70">·</span>
                <span>{SEVERITY_LABEL[gap.severity]}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
