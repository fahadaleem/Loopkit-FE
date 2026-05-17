"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { ReportForm } from "@/features/interview/components/ReportForm";
import { UsageMeter } from "@/features/usage/components/UsageMeter";
import { useUsage } from "@/features/usage/hooks/useUsage";
import { formatResetIn } from "@/features/usage/lib/formatResetIn";

export default function NewReportPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  const { usage, isLoading: usageLoading } = useUsage({
    enabled: hydrated && !!user,
  });

  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const resetIn = useMemo(
    () => (usage && now !== null ? formatResetIn(usage.reset, now) : null),
    [usage, now],
  );

  const limitReached = !!usage && usage.remaining <= 0;
  const disabledReason = limitReached
    ? resetIn
      ? `Your daily limit is reached. Resets in ${resetIn}.`
      : `Your daily limit is reached.`
    : null;

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
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
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

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            New interview report
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload your resume, paste the job description, and tell us a bit
            about yourself. We'll generate tailored prep questions, a gap
            analysis, and a day-by-day plan.
          </p>
        </div>

        <UsageMeter
          usage={usage}
          isLoading={usageLoading}
          resetIn={resetIn}
          className="mb-6"
        />

        <ReportForm disabled={limitReached} disabledReason={disabledReason} />
      </section>
    </main>
  );
}
