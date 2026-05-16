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

  const reportStatus = report?.status;
  const isFailed = reportStatus === "failed";
  const isCompleted = reportStatus === "completed";

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
            {report && isCompleted ? (
              <DeleteReportButton
                reportId={report.id}
                reportTitle={report.title}
                variant="button"
                onDeleted={() => router.push("/reports")}
              />
            ) : null}
            <Link
              href="/reports"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              My reports
            </Link>
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

        {reportStatus === "pending" || reportStatus === "processing" ? (
          <GeneratingState status={reportStatus} />
        ) : null}

        {report && isFailed ? (
          <FailedState
            errorMessage={report.error ?? null}
            onRetry={refetch}
          />
        ) : null}

        {report && isCompleted ? (
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

function GeneratingState({ status }: { status: "pending" | "processing" }) {
  const isQueued = status === "pending";
  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
        <span className="block size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-foreground sm:text-2xl">
        {isQueued ? "Your report is queued" : "Generating your report"}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        {isQueued
          ? "We've received your inputs and queued the job. It will start in a moment."
          : "Our AI is analysing your resume against the job description and preparing tailored questions. This usually takes 20–30 seconds."}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        You don't have to wait here — feel free to leave this page. We'll
        keep generating in the background and the report will be ready in your
        listing.
      </p>

      <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
        <Link
          href="/reports"
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover sm:w-auto"
        >
          Go to my reports
        </Link>
        <Link
          href="/reports/new"
          className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted sm:w-auto"
        >
          Start another report
        </Link>
      </div>

      <p
        className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground"
        aria-live="polite"
      >
        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
        Auto-refreshing every few seconds…
      </p>
    </div>
  );
}

function FailedState({
  errorMessage,
  onRetry,
}: {
  errorMessage: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-danger/40 bg-danger/5 px-6 py-12 text-center sm:px-10">
      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
        Report generation failed
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        {errorMessage ??
          "Something went wrong while generating this report. You can try generating it again."}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted sm:w-auto"
        >
          Refresh
        </button>
        <Link
          href="/reports/new"
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover sm:w-auto"
        >
          Start a new report
        </Link>
        <Link
          href="/reports"
          className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted sm:w-auto"
        >
          Back to my reports
        </Link>
      </div>
    </div>
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
