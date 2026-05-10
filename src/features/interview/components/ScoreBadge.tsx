type ScoreBadgeProps = {
  score: number;
  size?: "sm" | "md";
};

function tierClass(score: number) {
  if (score >= 70)
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (score >= 40)
    return "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  return "border-danger/40 bg-danger/10 text-danger";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const value = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${padding} ${tierClass(value)}`}
    >
      {value}
      <span className="opacity-60 font-normal">/ 100</span>
    </span>
  );
}
