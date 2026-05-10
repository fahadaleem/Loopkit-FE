"use client";

import Link from "next/link";
import type { InterviewReportSummary } from "@/features/interview/services/interview.service";
import { formatAbsoluteDate, formatRelativeDate } from "@/lib/formatDate";
import { ScoreBadge } from "./ScoreBadge";
import { DeleteReportButton } from "./DeleteReportButton";

type ReportsTableProps = {
  reports: InterviewReportSummary[];
  onDeleted?: (id: string) => void;
};

export function ReportsTable({ reports, onDeleted }: ReportsTableProps) {
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
            {reports.map((report) => (
              <tr
                key={report.id}
                className="group transition hover:bg-surface-muted/40"
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
                      onDeleted={onDeleted}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — stacked cards */}
      <ul className="space-y-3 sm:hidden">
        {reports.map((report) => (
          <li
            key={report.id}
            className="rounded-xl border border-border bg-surface p-4 transition hover:border-primary/40"
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
                onDeleted={onDeleted}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
