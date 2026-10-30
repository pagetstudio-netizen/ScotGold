import test from "node:test";
import assert from "node:assert/strict";
import { RegistrationCaptchaService } from "./registration-captcha";

test("registration captcha is session-bound and can only be used once", () => {
  const captcha = new RegistrationCaptchaService({
    now: () => 1_000,
    generateCode: () => "5236",
    generateId: () => "challenge-1",
  });
  const issued = captcha.issue("session-a", "ip-a");
  assert.equal(issued.ok, true);
  if (!issued.ok) return;

  assert.match(issued.svg, /<path/);
  assert.doesNotMatch(issued.svg, /<text/);
  assert.doesNotMatch(issued.svg, /5236/);
  assert.equal(captcha.verify(issued.challengeId, "session-b", "5236"), false);
  assert.equal(captcha.verify(issued.challengeId, "session-a", "5236"), true);
  assert.equal(captcha.verify(issued.challengeId, "session-a", "5236"), false);
});

test("registration captcha expires and limits incorrect attempts", () => {
  let now = 10_000;
  let id = 0;
  const captcha = new RegistrationCaptchaService({
    now: () => now,
    generateCode: () => "0042",
    generateId: () => `challenge-${++id}`,
  });
  const first = captcha.issue("session-a", "ip-a");
  assert.equal(first.ok, true);
  if (!first.ok) return;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    assert.equal(captcha.verify(first.challengeId, "session-a", "9999"), false);
  }
  assert.equal(captcha.verify(first.challengeId, "session-a", "0042"), false);

  const second = captcha.issue("session-a", "ip-a");
  assert.equal(second.ok, true);
  if (!second.ok) return;
  now += 5 * 60 * 1000;
  assert.equal(captcha.verify(second.challengeId, "session-a", "0042"), false);
});

test("registration captcha endpoints and submissions are rate-limited", () => {
  const captcha = new RegistrationCaptchaService({
    now: () => 20_000,
    generateCode: () => "1234",
    generateId: (() => {
      let id = 0;
      return () => `challenge-${++id}`;
    })(),
  });
  for (let index = 0; index < 20; index += 1) {
    assert.equal(captcha.issue("session-a", "ip-a").ok, true);
  }
  const issueLimit = captcha.issue("session-a", "ip-a");
  assert.equal(issueLimit.ok, false);

  for (let index = 0; index < 10; index += 1) {
    assert.equal(captcha.recordRegistrationSubmission("ip-b").allowed, true);
  }
  assert.equal(captcha.recordRegistrationSubmission("ip-b").allowed, false);
});

test("login captcha submissions are rate-limited and reset after the window", () => {
  let now = 30_000;
  const captcha = new RegistrationCaptchaService({ now: () => now });

  for (let index = 0; index < 10; index += 1) {
    assert.equal(captcha.recordLoginSubmission("ip-login").allowed, true);
  }
  const blocked = captcha.recordLoginSubmission("ip-login");
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);

  now += 10 * 60 * 1000;
  assert.equal(captcha.recordLoginSubmission("ip-login").allowed, true);
});
