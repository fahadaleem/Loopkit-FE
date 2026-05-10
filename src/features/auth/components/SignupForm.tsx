"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FormField } from "./FormField";

export function SignupForm() {
  const { register, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }
    setConfirmError(null);
    register({ name: name.trim(), email: email.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        type="text"
        label="Full name"
        autoComplete="name"
        placeholder="Ada Lovelace"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
      />
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
        autoComplete="new-password"
        placeholder="At least 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        hint="Use 6+ characters with a mix of letters and numbers."
      />
      <FormField
        id="confirmPassword"
        type="password"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (confirmError) setConfirmError(null);
        }}
        required
        minLength={6}
        aria-invalid={confirmError ? true : undefined}
      />

      {confirmError ? (
        <p
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {confirmError}
        </p>
      ) : null}

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
        {isLoading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
