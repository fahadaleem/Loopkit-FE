"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { interviewService } from "@/features/interview/services/interview.service";

type Status = "idle" | "loading" | "error";

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Couldn't delete the report. Please try again.";
}

export function useDeleteReport() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const deleteReport = async (id: string): Promise<boolean> => {
    setStatus("loading");
    setError(null);
    try {
      await interviewService.deleteReport(id);
      setStatus("idle");
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("error");
      return false;
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  return {
    deleteReport,
    isDeleting: status === "loading",
    error,
    reset,
  };
}
