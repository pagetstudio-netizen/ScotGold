import test from "node:test";
import assert from "node:assert/strict";
import { buildReferralLink, getReferralCodeFromHash } from "../client/src/lib/referral-link";

test("referral links use the Scotgold hash route and invite parameter", () => {
  assert.equal(
    buildReferralLink("https://scotgold.example", "15859178"),
    "https://scotgold.example/#/pages/index/scotgold?invite=15859178",
  );
});

test("the invite code is read from the hash route query", () => {
  assert.equal(
    getReferralCodeFromHash("#/pages/index/scotgold?invite=15859178"),
    "15859178",
  );
  assert.equal(getReferralCodeFromHash("#/pages/index/scotgold"), "");
});
