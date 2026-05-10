"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { ReportForm } from "@/features/interview/components/ReportForm";

export default function NewReportPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

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
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            New interview report
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload your resume, paste the job description, and tell us a bit
            about yourself. We'll generate tailored prep questions, a gap
            analysis, and a day-by-day plan.
          </p>
        </div>

        <ReportForm />
      </section>
    </main>
  );
}
