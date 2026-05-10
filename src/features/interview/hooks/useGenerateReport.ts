"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import {
  interviewService,
  type GenerateReportInput,
} from "@/features/interview/services/interview.service";

type Status = "idle" | "loading" | "error";

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function useGenerateReport() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (input: GenerateReportInput) => {
    setStatus("loading");
    setError(null);
    try {
      const { interviewReport } = await interviewService.generateReport(input);
      router.push(`/reports/${interviewReport.id}`);
      setStatus("idle");
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("error");
    }
  };

  return {
    submit,
    status,
    error,
    isLoading: status === "loading",
  };
}
