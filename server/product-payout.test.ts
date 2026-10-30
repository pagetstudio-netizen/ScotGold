import assert from "node:assert/strict";
import test from "node:test";
import { calculateDailyPayout, calculateMaturityPayout } from "./product-payout";

test("daily payout credits each elapsed 24-hour cycle", () => {
  assert.equal(calculateDailyPayout(1500, 400, 100, 2), 200);
});

test("daily payout never exceeds the remaining product return", () => {
  assert.equal(calculateDailyPayout(1500, 1450, 100, 2), 50);
});

test("daily payout treats invalid and negative amounts as zero", () => {
  assert.equal(calculateDailyPayout(1500, 1500, 100, 2), 0);
  assert.equal(calculateDailyPayout(1500, 0, Number.NaN, 2), 0);
  assert.equal(calculateDailyPayout(1500, 0, 100, -2), 0);
});

test("maturity payout deducts earnings already paid before the policy change", () => {
  assert.equal(calculateMaturityPayout(1500, 500), 1000);
});

test("maturity payout pays the full return when nothing was previously paid", () => {
  assert.equal(calculateMaturityPayout(1500, 0), 1500);
});

test("maturity payout never becomes negative when prior payments exceed the return", () => {
  assert.equal(calculateMaturityPayout(1500, 1800), 0);
});
