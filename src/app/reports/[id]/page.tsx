"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useReport } from "@/features/interview/hooks/useReport";
import { ReportHeader } from "@/features/interview/components/ReportHeader";
import { QuestionList } from "@/features/interview/components/QuestionList";
import { PreparationTimeline } from "@/features/interview/components/PreparationTimeline";
import { InputsAccordion } from "@/features/interview/components/InputsAccordion";
import { DeleteReportButton } from "@/features/interview/components/DeleteReportButton";
import { DownloadAtsResumeCard } from "@/features/interview/components/DownloadAtsResumeCard";

const TOC_ITEMS: { id: string; label: string }[] = [
  { id: "technical-questions", label: "Technical questions" },
  { id: "behavioral-questions", label: "Behavioral questions" },
  { id: "preparation-plan", label: "Preparation plan" },
  { id: "inputs-used", label: "Inputs used" },
];

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : null;

  const user = useUserStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  const { report, isLoading, error, notFound, forbidden, refetch } = useReport(
    hydrated && user ? id : null,
  );

  if (!hydrated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              LK
            </span>
            LoopKit
          </Link>
          <div className="flex items-center gap-3">
            {report ? (
              <DeleteReportButton
                reportId={report.id}
                reportTitle={report.title}
                variant="button"
                onDeleted={() => router.push("/reports")}
              />
            ) : null}
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        {isLoading ? <ReportSkeleton /> : null}

        {!isLoading && (notFound || forbidden) ? (
          <EmptyState
            title={notFound ? "Report not found" : "You don't have access"}
            body={
              notFound
                ? "This report doesn't exist, or it may have been deleted."
                : "This report belongs to a different account."
            }
          />
        ) : null}

        {!isLoading && error && !notFound && !forbidden ? (
          <EmptyState
            title="Couldn't load the report"
            body={error}
          />
        ) : null}

        {report ? (
          <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
            <div className="space-y-8">
              <ReportHeader report={report} />

              {/* Mobile / tablet — inline ATS card (right rail is hidden below lg) */}
              <div className="lg:hidden">
                <DownloadAtsResumeCard
                  reportId={report.id}
                  reportTitle={report.title}
                  atsResume={report.atsResume}
                  onDownloaded={refetch}
                />
              </div>

              <QuestionList
                id="technical-questions"
                title="Technical questions"
                questions={report.technicalQuestions ?? []}
              />

              <QuestionList
                id="behavioral-questions"
                title="Behavioral questions"
                questions={report.behavioralQuestions ?? []}
              />

              <PreparationTimeline
                id="preparation-plan"
                plan={report.preparationPlan ?? []}
              />

              <InputsAccordion
                id="inputs-used"
                jobDescription={report.jobDescription}
                selfDescription={report.selfDescription}
                resume={report.resume}
              />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-6 space-y-4">
                <nav className="rounded-xl border border-border bg-surface p-4">
                  <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    On this page
                  </p>
                  <ul className="mt-2 space-y-1">
                    {TOC_ITEMS.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <DownloadAtsResumeCard
                  reportId={report.id}
                  reportTitle={report.title}
                  atsResume={report.atsResume}
                  onDownloaded={refetch}
                />
              </div>
            </aside>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 rounded-2xl bg-surface" />
      <div className="space-y-3">
        <div className="h-16 rounded-xl bg-surface" />
        <div className="h-16 rounded-xl bg-surface" />
        <div className="h-16 rounded-xl bg-surface" />
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
