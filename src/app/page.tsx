"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useReports } from "@/features/interview/hooks/useReports";
import { ReportsTable } from "@/features/interview/components/ReportsTable";

const RECENT_LIMIT = 3;

export default function HomePage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { logout, isLoading: isLoggingOut } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  const { reports, pagination, isLoading, error, refetch } = useReports({
    page: 1,
    limit: RECENT_LIMIT,
    enabled: hydrated && !!user,
  });

  if (!hydrated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }

  const totalReports = pagination?.totalReports ?? 0;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              LK
            </span>
            LoopKit
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted disabled:opacity-60"
            >
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div
          className="rounded-2xl p-6 text-white shadow-sm sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #4338ca 100%)",
          }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Welcome back, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="mt-2 max-w-2xl text-white/85">
                Drop in a resume and a job description to generate your next
                interview prep report.
              </p>
            </div>
            <Link
              href="/reports/new"
              className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/25"
            >
              + New report
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Total reports"
            value={isLoading ? "…" : totalReports.toLocaleString()}
          />
          <StatCard
            label="Latest match score"
            value={
              isLoading
                ? "…"
                : reports[0]
                  ? `${Math.round(reports[0].matchScore)} / 100`
                  : "—"
            }
          />
          <StatCard
            label="Latest report"
            value={
              isLoading
                ? "…"
                : reports[0]
                  ? reports[0].title
                  : "Generate your first one"
            }
            subdued
            truncate
          />
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent reports
            </h2>
            {totalReports > 0 ? (
              <Link
                href="/reports"
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                View all →
              </Link>
            ) : null}
          </div>

          {isLoading ? <RecentSkeleton /> : null}

          {!isLoading && error ? (
            <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}

          {!isLoading && !error && reports.length === 0 ? (
            <EmptyRecent />
          ) : null}

          {!isLoading && !error && reports.length > 0 ? (
            <ReportsTable reports={reports} onDeleted={refetch} />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  subdued,
  truncate,
}: {
  label: string;
  value: string;
  subdued?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 ${subdued ? "text-base font-medium" : "text-2xl font-semibold"} text-foreground ${truncate ? "truncate" : ""}`}
        title={truncate ? value : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function RecentSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-12 rounded-xl bg-surface" />
      <div className="h-14 rounded-xl bg-surface" />
      <div className="h-14 rounded-xl bg-surface" />
    </div>
  );
}

function EmptyRecent() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-foreground">
        No reports yet
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Your generated reports will appear here.
      </p>
      <Link
        href="/reports/new"
        className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
      >
        Create your first report
      </Link>
    </div>
  );
}
