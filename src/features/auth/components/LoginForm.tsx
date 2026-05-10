"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FormField } from "./FormField";

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email: email.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormField
        id="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
