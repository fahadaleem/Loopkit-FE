"use client";

import { useCallback, useEffect, useState } from "react";
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
  notFound: boolean;
  forbidden: boolean;
  refetch: () => void;
};

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function useReport(id: string | null): ReportLoadState {
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setStatus("loading");
    setError(null);
    setErrorStatus(null);

    interviewService
      .getReport(id)
      .then(({ interviewReport }) => {
        if (cancelled) return;
        setReport(interviewReport);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
        setErrorStatus(err instanceof ApiError ? err.status : null);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return {
    report,
    status,
    error,
    errorStatus,
    isLoading: status === "loading",
    notFound: status === "error" && errorStatus === 404,
    forbidden: status === "error" && errorStatus === 403,
    refetch,
  };
}
