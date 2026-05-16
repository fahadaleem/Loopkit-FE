"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  interviewService,
  type InterviewReport,
} from "@/features/interview/services/interview.service";

type Status = "idle" | "loading" | "success" | "error";

export type ReportLoadState = {
  report: InterviewReport | null;
  status: Status;
  error: string | null;
  errorStatus: number | null;
  isLoading: boolean;
  isPolling: boolean;
  notFound: boolean;
  forbidden: boolean;
  refetch: () => void;
};

const POLL_INTERVAL_MS = 3000;

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

function isTerminal(report: InterviewReport | null) {
  if (!report) return false;
  return report.status === "completed" || report.status === "failed";
}

export function useReport(id: string | null): ReportLoadState {
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [version, setVersion] = useState(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    let isInitial = true;

    const clearTimer = () => {
      if (pollTimer.current) {
        clearTimeout(pollTimer.current);
        pollTimer.current = null;
      }
    };

    const fetchOnce = async () => {
      if (isInitial) {
        setStatus("loading");
        setError(null);
        setErrorStatus(null);
      }

      try {
        const { interviewReport } = await interviewService.getReport(id);
        if (cancelled) return;
        setReport(interviewReport);
        setStatus("success");

        if (!isTerminal(interviewReport)) {
          pollTimer.current = setTimeout(fetchOnce, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err));
        setErrorStatus(err instanceof ApiError ? err.status : null);
        setStatus("error");
      } finally {
        isInitial = false;
      }
    };

    fetchOnce();

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [id, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const isPolling =
    status === "success" && report !== null && !isTerminal(report);

  return {
    report,
    status,
    error,
    errorStatus,
    isLoading: status === "loading",
    isPolling,
    notFound: status === "error" && errorStatus === 404,
    forbidden: status === "error" && errorStatus === 403,
    refetch,
  };
}
