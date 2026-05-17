import { apiFetch } from "@/lib/api";

export type Usage = {
  limit: number;
  used: number;
  remaining: number;
  reset: string;
};

type GetUsageResponse = {
  message?: string;
  usage: Usage;
};

export const usageService = {
  getUsage() {
    return apiFetch<GetUsageResponse>("/api/usage/me", { method: "GET" });
  },
};
