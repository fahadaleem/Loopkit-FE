export function formatResetIn(resetIso: string, nowMs: number) {
  const resetMs = new Date(resetIso).getTime();
  if (!Number.isFinite(resetMs)) return null;
  const diff = resetMs - nowMs;
  if (diff <= 0) return "any moment";
  const totalMin = Math.ceil(diff / 60_000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
