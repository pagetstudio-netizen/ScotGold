import assert from "node:assert/strict";
import test from "node:test";
import {
  DAILY_CHECKIN_BONUS,
  getLocalDayStart,
  isDailyCheckinAlreadyClaimedToday,
} from "./daily-checkin-policy";

test("daily check-in bonus is 50 FCFA", () => {
  assert.equal(DAILY_CHECKIN_BONUS, 50);
});

test("a user who has not claimed can collect today's bonus", () => {
  const now = new Date(2026, 9, 28, 14, 30);

  assert.equal(isDailyCheckinAlreadyClaimedToday(null, now), false);
  assert.equal(isDailyCheckinAlreadyClaimedToday(undefined, now), false);
});

test("a claim blocks another claim on the same local calendar day", () => {
  const now = new Date(2026, 9, 28, 14, 30);
  const claimedToday = new Date(2026, 9, 28, 0, 0);

  assert.equal(isDailyCheckinAlreadyClaimedToday(claimedToday, now), true);
  assert.equal(isDailyCheckinAlreadyClaimedToday(claimedToday.toISOString(), now), true);
});

test("the daily check-in becomes available again after local midnight", () => {
  const yesterday = new Date(2026, 9, 27, 23, 59);
  const today = new Date(2026, 9, 28, 0, 0);

  assert.equal(isDailyCheckinAlreadyClaimedToday(yesterday, today), false);
  assert.equal(getLocalDayStart(today).getTime(), today.getTime());
});
