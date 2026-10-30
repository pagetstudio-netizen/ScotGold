export const PENDING_REFERRAL_STORAGE_KEY = "scotgold-pending-referral-code";

export function buildReferralLink(origin: string, referralCode: string) {
  return `${origin.replace(/\/$/, "")}/#/pages/index/scotgold?invite=${encodeURIComponent(referralCode)}`;
}

export function getReferralCodeFromHash(hash: string) {
  const queryStart = hash.indexOf("?");
  if (queryStart < 0) return "";
  return new URLSearchParams(hash.slice(queryStart + 1)).get("invite")?.trim() || "";
}
