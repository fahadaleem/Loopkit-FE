"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { interviewService } from "@/features/interview/services/interview.service";

type Status = "idle" | "loading" | "success" | "error";

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Couldn't generate the PDF. Please try again.";
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "report"
  );
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function useDownloadAtsResume() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const download = async ({
    id,
    title,
    onSuccess,
  }: {
    id: string;
    title?: string;
    onSuccess?: () => void;
  }) => {
    setStatus("loading");
    setError(null);
    try {
      const blob = await interviewService.downloadAtsResume(id);
      const filename = `ats-resume-${slugify(title ?? "report")}.pdf`;
      triggerBrowserDownload(blob, filename);
      setStatus("success");
      onSuccess?.();
      // Auto-revert the success state so the button returns to default after a moment.
      window.setTimeout(() => {
        setStatus((s) => (s === "success" ? "idle" : s));
      }, 2500);
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("error");
    }
  };

  return {
    download,
    status,
    error,
    isLoading: status === "loading",
    isSuccess: status === "success",
  };
}
