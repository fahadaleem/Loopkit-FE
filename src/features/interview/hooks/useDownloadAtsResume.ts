"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api";
import { interviewService } from "@/features/interview/services/interview.service";

type Status = "idle" | "loading" | "success" | "error" | "queued";

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
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);

  const download = async ({
    id,
    title,
    onSuccess,
    onQueued,
  }: {
    id: string;
    title?: string;
    onSuccess?: () => void;
    onQueued?: () => void;
  }) => {
    setStatus("loading");
    setError(null);
    setQueuedMessage(null);
    try {
      const result = await interviewService.downloadAtsResume(id);

      if (result.status === "queued") {
        setQueuedMessage(result.message);
        setStatus("queued");
        onQueued?.();
        return;
      }

      const filename = `ats-resume-${slugify(title ?? "report")}.pdf`;
      triggerBrowserDownload(result.blob, filename);
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

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setQueuedMessage(null);
  }, []);

  return {
    download,
    reset,
    status,
    error,
    queuedMessage,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isQueued: status === "queued",
  };
}
