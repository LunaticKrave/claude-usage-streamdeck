export function formatTimeUntil(isoTimestamp: string | null): string | null {
  if (!isoTimestamp) return null;

  const now = Date.now();
  const target = new Date(isoTimestamp).getTime();
  const diffMs = target - now;

  if (diffMs <= 0) return null;

  const totalMinutes = Math.floor(diffMs / 60_000);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  if (totalMinutes < 1) return "<1m";
  if (totalHours < 1) return `${totalMinutes}m`;
  if (totalDays < 1) return `${totalHours}h ${totalMinutes % 60}m`;
  return `${totalDays}d ${totalHours % 24}h`;
}

export function getNearestReset(
  resetA: string | null,
  resetB: string | null
): string | null {
  if (!resetA) return resetB;
  if (!resetB) return resetA;

  const timeA = new Date(resetA).getTime();
  const timeB = new Date(resetB).getTime();
  return timeA <= timeB ? resetA : resetB;
}
