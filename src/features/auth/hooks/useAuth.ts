"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { useUserStore } from "@/store/userStore";
import { ApiError } from "@/lib/api";

type FormStatus = "idle" | "loading" | "error";

function getErrorMessage(err: unknown) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function useAuth() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: { email: string; password: string }) => {
    setStatus("loading");
    setError(null);
    try {
      const { user } = await authService.login(payload);
      setUser(user);
      router.push("/");
      router.refresh();
      setStatus("idle");
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("error");
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    setStatus("loading");
    setError(null);
    try {
      const { user } = await authService.register(payload);
      setUser(user);
      router.push("/");
      router.refresh();
      setStatus("idle");
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("error");
    }
  };

  const logout = async () => {
    setStatus("loading");
    setError(null);
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout — clear local state regardless
    } finally {
      clearUser();
      router.push("/login");
      router.refresh();
      setStatus("idle");
    }
  };

  return {
    login,
    register,
    logout,
    status,
    error,
    isLoading: status === "loading",
  };
}
