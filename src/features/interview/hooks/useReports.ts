"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  interviewService,
  type InterviewReportSummary,
  type ReportsPagination,
} from "@/features/interview/services/interview.service";

type Status = "idle" | "loading" | "success" | "error";

type UseReportsOptions = {
  page: number;
  limit: number;
  enabled?: boolean;
};

export type ReportsState = {
  reports: InterviewReportSummary[];
  pagination: ReportsPagination | null;
  status: Status;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
};

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function useReports({
  page,
  limit,
  enabled = true,
}: UseReportsOptions): ReportsState {
  const [reports, setReports] = useState<InterviewReportSummary[]>([]);
  const [pagination, setPagination] = useState<ReportsPagination | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setStatus("loading");
    setError(null);

    interviewService
      .getReports({ page, limit })
      .then((res) => {
        if (cancelled) return;
        setReports(res.reports);
        setPagination(res.pagination);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [page, limit, enabled, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return {
    reports,
    pagination,
    status,
    error,
    isLoading: status === "loading",
    refetch,
  };
}
