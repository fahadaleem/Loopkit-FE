"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useReports } from "@/features/interview/hooks/useReports";
import { ReportsTable } from "@/features/interview/components/ReportsTable";
import { Pagination } from "@/features/interview/components/Pagination";

const PAGE_SIZE = 10;

export default function ReportsPage() {
  return (
    <Suspense fallback={<PageShell><ListSkeleton /></PageShell>}>
      <ReportsPageInner />
    </Suspense>
  );
}

function ReportsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUserStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const { reports, pagination, isLoading, error, removeReport } = useReports({
    page,
    limit: PAGE_SIZE,
    enabled: hydrated && !!user,
  });

  const goToPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    const qs = params.toString();
    router.push(qs ? `/reports?${qs}` : "/reports");
  };

  const handleDeleted = (id: string) => {
    // If we just removed the last row on a page > 1, step back a page;
    // otherwise update local state in place so the list doesn't flash a skeleton.
    if (page > 1 && reports.length === 1) goToPage(page - 1);
    else removeReport(id);
  };

  if (!hydrated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Your reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pagination
              ? `${pagination.totalReports} report${pagination.totalReports === 1 ? "" : "s"} total`
              : "All the prep reports you've generated."}
          </p>
        </div>
        <Link
          href="/reports/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
        >
          + New report
        </Link>
      </div>

      {isLoading ? <ListSkeleton /> : null}

      {!isLoading && error ? (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && reports.length === 0 ? <EmptyState /> : null}

      {!isLoading && !error && reports.length > 0 ? (
        <div className="space-y-6">
          <ReportsTable reports={reports} onDeleted={handleDeleted} />
          {pagination ? (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={goToPage}
            />
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
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
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">{children}</section>
    </main>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-12 rounded-xl bg-surface" />
      <div className="h-14 rounded-xl bg-surface" />
      <div className="h-14 rounded-xl bg-surface" />
      <div className="h-14 rounded-xl bg-surface" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-foreground">No reports yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Generate your first interview prep report to see it here.
      </p>
      <Link
        href="/reports/new"
        className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
      >
        Create a report
      </Link>
    </div>
  );
}
