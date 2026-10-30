export const DAILY_CHECKIN_BONUS = 50;

export function getLocalDayStart(now: Date = new Date()): Date {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function isDailyCheckinAlreadyClaimedToday(
  lastClaim: Date | string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!lastClaim) return false;

  const claimedAt = lastClaim instanceof Date ? lastClaim : new Date(lastClaim);
  return !Number.isNaN(claimedAt.getTime()) && claimedAt >= getLocalDayStart(now);
}
