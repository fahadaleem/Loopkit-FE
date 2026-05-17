"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { InterviewReportSummary } from "@/features/interview/services/interview.service";
import { formatAbsoluteDate, formatRelativeDate } from "@/lib/formatDate";
import { ScoreBadge } from "./ScoreBadge";
import { DeleteReportButton } from "./DeleteReportButton";

type ReportsTableProps = {
  reports: InterviewReportSummary[];
  onDeleted?: (id: string) => void;
};

const REMOVE_TRANSITION_MS = 280;

export function ReportsTable({ reports, onDeleted }: ReportsTableProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const map = timeouts.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const handleDeletingChange = useCallback((id: string, deleting: boolean) => {
    setDeletingIds((prev) => {
      const has = prev.has(id);
      if (deleting === has) return prev;
      const next = new Set(prev);
      if (deleting) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleRowDeleted = useCallback(
    (id: string) => {
      setDeletingIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setRemovingIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      const existing = timeouts.current.get(id);
      if (existing) clearTimeout(existing);
      const t = setTimeout(() => {
        timeouts.current.delete(id);
        onDeleted?.(id);
      }, REMOVE_TRANSITION_MS);
      timeouts.current.set(id, t);
    },
    [onDeleted],
  );

  return (
    <>
      {/* Desktop / tablet — table layout */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface sm:block">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Match score</th>
              <th className="px-5 py-3 font-semibold">Created</th>
              <th className="px-5 py-3" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report) => {
              const isDeleting = deletingIds.has(report.id);
              const isRemoving = removingIds.has(report.id);
              const dimmed = isDeleting || isRemoving;
              return (
                <tr
                  key={report.id}
                  aria-busy={isDeleting || undefined}
                  className={[
                    "group transition-all duration-300 ease-out",
                    isRemoving
                      ? "pointer-events-none -translate-x-1 bg-surface-muted/40 opacity-0"
                      : dimmed
                        ? "pointer-events-none bg-surface-muted/30 opacity-50"
                        : "hover:bg-surface-muted/40",
                  ].join(" ")}
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/reports/${report.id}`}
                      className="font-medium text-foreground transition group-hover:text-primary"
                    >
                      {report.title || "Untitled report"}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <ScoreBadge score={report.matchScore} size="sm" />
                  </td>
                  <td
                    className="px-5 py-4 text-muted-foreground"
                    title={formatAbsoluteDate(report.createdAt)}
                  >
                    {formatRelativeDate(report.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/reports/${report.id}`}
                        className="hidden text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100 sm:inline-flex"
                      >
                        Open →
                      </Link>
                      <DeleteReportButton
                        reportId={report.id}
                        reportTitle={report.title}
                        onDeletingChange={handleDeletingChange}
                        onDeleted={handleRowDeleted}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile — stacked cards */}
      <ul className="space-y-3 sm:hidden">
        {reports.map((report) => {
          const isDeleting = deletingIds.has(report.id);
          const isRemoving = removingIds.has(report.id);
          const dimmed = isDeleting || isRemoving;
          return (
            <li
              key={report.id}
              aria-busy={isDeleting || undefined}
              className={[
                "overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all duration-300 ease-out",
                isRemoving
                  ? "pointer-events-none -translate-y-1 scale-[0.99] opacity-0"
                  : dimmed
                    ? "pointer-events-none bg-surface-muted/30 opacity-50"
                    : "hover:border-primary/40",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/reports/${report.id}`}
                  className="flex-1 font-medium text-foreground"
                >
                  {report.title || "Untitled report"}
                </Link>
                <ScoreBadge score={report.matchScore} size="sm" />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p
                  className="text-xs text-muted-foreground"
                  title={formatAbsoluteDate(report.createdAt)}
                >
                  Created {formatRelativeDate(report.createdAt)}
                </p>
                <DeleteReportButton
                  reportId={report.id}
                  reportTitle={report.title}
                  onDeletingChange={handleDeletingChange}
                  onDeleted={handleRowDeleted}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
