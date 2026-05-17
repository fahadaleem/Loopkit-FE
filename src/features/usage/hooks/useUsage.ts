"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { usageService, type Usage } from "@/features/usage/services/usage.service";

type Status = "idle" | "loading" | "success" | "error";

type UseUsageOptions = {
  enabled?: boolean;
};

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Couldn't load usage. Please try again.";
}

export function useUsage({ enabled = true }: UseUsageOptions = {}) {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setStatus("loading");
    setError(null);

    usageService
      .getUsage()
      .then((res) => {
        if (cancelled) return;
        setUsage(res.usage);
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
  }, [enabled, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return {
    usage,
    status,
    error,
    isLoading: status === "loading",
    refetch,
  };
}
