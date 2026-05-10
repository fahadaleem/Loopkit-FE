import { apiFetch } from "@/lib/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  message: string;
  user: AuthUser;
};

type LogoutResponse = {
  message: string;
};

export const authService = {
  register(payload: { name: string; email: string; password: string }) {
    return apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: payload,
    });
  },

  login(payload: { email: string; password: string }) {
    return apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  logout() {
    return apiFetch<LogoutResponse>("/api/auth/logout", {
      method: "GET",
    });
  },
};
