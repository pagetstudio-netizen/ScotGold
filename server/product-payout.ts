export function calculateMaturityPayout(totalReturn: number, prepaidEarnings: number): number {
  const safeTotalReturn = Number.isFinite(totalReturn) ? Math.max(0, totalReturn) : 0;
  const safePrepaidEarnings = Number.isFinite(prepaidEarnings) ? Math.max(0, prepaidEarnings) : 0;
  return Math.max(0, safeTotalReturn - safePrepaidEarnings);
}

export function calculateDailyPayout(
  totalReturn: number,
  alreadyPaid: number,
  dailyEarnings: number,
  elapsedCycles: number,
): number {
  const safeTotalReturn = Number.isFinite(totalReturn) ? Math.max(0, totalReturn) : 0;
  const safeAlreadyPaid = Number.isFinite(alreadyPaid) ? Math.max(0, alreadyPaid) : 0;
  const safeDailyEarnings = Number.isFinite(dailyEarnings) ? Math.max(0, dailyEarnings) : 0;
  const safeElapsedCycles = Number.isFinite(elapsedCycles) ? Math.max(0, elapsedCycles) : 0;

  return Math.min(
    safeTotalReturn - Math.min(safeTotalReturn, safeAlreadyPaid),
    safeDailyEarnings * safeElapsedCycles,
  );
}
