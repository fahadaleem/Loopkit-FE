"use client";

import type { Usage } from "@/features/usage/services/usage.service";

type Tone = {
  ring: string;
  bar: string;
  track: string;
  accent: string;
};

function getTone(remaining: number): Tone {
  if (remaining <= 0) {
    return {
      ring: "border-danger/40",
      bar: "bg-danger",
      track: "bg-danger/15",
      accent: "text-danger",
    };
  }
  if (remaining === 1) {
    return {
      ring: "border-amber-500/40",
      bar: "bg-amber-500",
      track: "bg-amber-500/15",
      accent: "text-amber-700 dark:text-amber-300",
    };
  }
  return {
    ring: "border-border",
    bar: "bg-primary",
    track: "bg-surface-muted",
    accent: "text-primary",
  };
}

type UsageMeterProps = {
  usage: Usage | null;
  isLoading: boolean;
  resetIn: string | null;
  className?: string;
};

export function UsageMeter({
  usage,
  isLoading,
  resetIn,
  className,
}: UsageMeterProps) {
  if (isLoading && !usage) {
    return (
      <div
        aria-hidden
        className={[
          "rounded-xl border border-border bg-surface px-4 py-3",
          className ?? "",
        ].join(" ")}
      >
        <div className="h-3 w-56 animate-pulse rounded bg-surface-muted" />
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted/60" />
      </div>
    );
  }

  if (!usage) return null;

  const limit = Math.max(0, usage.limit);
  const remaining = Math.max(0, Math.min(usage.remaining, limit));
  const used = Math.max(0, limit - remaining);
  const usedPct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = getTone(remaining);

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "rounded-xl border bg-surface px-4 py-3 transition-colors",
        tone.ring,
        className ?? "",
      ].join(" ")}
    >
      <p className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
        <span className={["font-semibold", tone.accent].join(" ")}>
          {remaining}
        </span>
        <span className="text-muted-foreground">
          {`of ${limit} free reports remaining today`}
        </span>
        {resetIn ? (
          <>
            <span aria-hidden="true" className="text-muted-foreground/70">
              ·
            </span>
            <span className="text-muted-foreground">
              Resets in{" "}
              <span className="font-medium text-foreground">{resetIn}</span>
            </span>
          </>
        ) : null}
      </p>

      <div
        className={["mt-2.5 h-1.5 w-full overflow-hidden rounded-full", tone.track].join(
          " ",
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={used}
      >
        <div
          className={[
            "h-full rounded-full transition-all duration-500 ease-out",
            tone.bar,
          ].join(" ")}
          style={{ width: `${usedPct}%` }}
        />
      </div>
    </div>
  );
}
