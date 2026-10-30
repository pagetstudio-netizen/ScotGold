import {
  createHash,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const MAX_CHALLENGE_ATTEMPTS = 5;
const CHALLENGE_ISSUE_LIMIT = 20;
const CHALLENGE_ISSUE_WINDOW_MS = 10 * 60 * 1000;
const REGISTRATION_SUBMISSION_LIMIT = 10;
const REGISTRATION_SUBMISSION_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_SUBMISSION_LIMIT = 10;
const LOGIN_SUBMISSION_WINDOW_MS = 10 * 60 * 1000;

const digitPaths: Record<string, string> = {
  "0": "M14 3 C6 3 3 8 3 16 C3 24 6 29 14 29 C22 29 25 24 25 16 C25 8 22 3 14 3 Z M8 23 L20 9",
  "1": "M7 9 L15 3 L15 29 M8 29 L23 29",
  "2": "M4 9 C5 2 21 1 24 8 C28 16 13 20 4 29 L25 29",
  "3": "M5 5 L23 4 L14 14 C27 13 28 27 17 29 C12 30 8 28 5 25",
  "4": "M20 29 L20 3 L4 19 L27 19",
  "5": "M24 4 L7 4 L6 14 C18 10 26 17 24 24 C22 31 11 32 5 26",
  "6": "M21 5 C11 1 4 9 4 19 C4 30 18 33 24 25 C29 17 19 11 7 17",
  "7": "M4 4 L26 4 L11 29",
  "8": "M14 15 C3 15 4 3 14 3 C25 3 25 15 14 15 C2 15 2 29 14 29 C27 29 27 15 14 15 Z",
  "9": "M22 15 C18 22 4 20 4 11 C4 1 23 0 24 11 C25 21 18 28 8 30",
};

interface Challenge {
  sessionId: string;
  answerHash: Buffer;
  expiresAt: number;
  attempts: number;
}

interface RateWindow {
  startedAt: number;
  count: number;
}

interface RegistrationCaptchaOptions {
  now?: () => number;
  generateCode?: () => string;
  generateId?: () => string;
}

export type CaptchaIssueResult =
  | { ok: true; challengeId: string; svg: string }
  | { ok: false; retryAfterSeconds: number };

function answerHash(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function buildCaptchaSvg(code: string) {
  const width = 154;
  const height = 44;
  const palette = ["#fff9e9", "#fffdf4", "#f7edcd", "#fff"];
  const glyphs = Array.from(code).map((digit, index) => {
    const rotation = randomInt(-13, 14);
    const verticalOffset = randomInt(0, 5);
    const stroke = palette[randomInt(0, palette.length)];
    return `<path d="${digitPaths[digit]}" transform="translate(${index * 35 + 4},${verticalOffset}) rotate(${rotation} 14 16)" stroke="${stroke}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }).join("");

  const speckles = Array.from({ length: 32 }, () => {
    const cx = randomInt(2, width - 2);
    const cy = randomInt(2, height - 2);
    const radius = randomInt(1, 3) / 2;
    const opacity = randomInt(10, 31) / 100;
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#302514" opacity="${opacity}"/>`;
  }).join("");

  const interference = [
    "M-4 11 C28 2 47 37 79 22 S128 4 158 20",
    "M-4 34 C24 20 44 3 74 14 S123 36 158 8",
    "M-4 21 C26 38 48 7 82 27 S128 34 158 23",
  ].map((path, index) => (
    `<path d="${path}" stroke="${index === 1 ? "#b44e61" : "#314b72"}" stroke-width="1.1" opacity=".34" fill="none"/>`
  )).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
    <defs>
      <linearGradient id="captcha-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e2b637"/>
        <stop offset="1" stop-color="#ffdb77"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" rx="5" fill="url(#captcha-bg)"/>
    ${speckles}
    ${interference}
    ${glyphs}
  </svg>`;
}

export class RegistrationCaptchaService {
  private readonly challenges = new Map<string, Challenge>();
  private readonly issueWindows = new Map<string, RateWindow>();
  private readonly submissionWindows = new Map<string, RateWindow>();
  private readonly loginSubmissionWindows = new Map<string, RateWindow>();
  private readonly now: () => number;
  private readonly generateCode: () => string;
  private readonly generateId: () => string;

  constructor(options: RegistrationCaptchaOptions = {}) {
    this.now = options.now || Date.now;
    this.generateCode = options.generateCode
      || (() => randomInt(0, 10_000).toString().padStart(4, "0"));
    this.generateId = options.generateId || randomUUID;
  }

  issue(sessionId: string, clientKey: string): CaptchaIssueResult {
    const now = this.now();
    this.prune(now);
    const rateLimit = this.checkRate(
      this.issueWindows,
      clientKey,
      CHALLENGE_ISSUE_LIMIT,
      CHALLENGE_ISSUE_WINDOW_MS,
      now,
    );
    if (!rateLimit.allowed) {
      return { ok: false, retryAfterSeconds: rateLimit.retryAfterSeconds };
    }

    const challengeId = this.generateId();
    const code = this.generateCode();
    this.challenges.set(challengeId, {
      sessionId,
      answerHash: answerHash(code),
      expiresAt: now + CHALLENGE_TTL_MS,
      attempts: 0,
    });

    return { ok: true, challengeId, svg: buildCaptchaSvg(code) };
  }

  recordRegistrationSubmission(clientKey: string) {
    const now = this.now();
    this.prune(now);
    const rateLimit = this.checkRate(
      this.submissionWindows,
      clientKey,
      REGISTRATION_SUBMISSION_LIMIT,
      REGISTRATION_SUBMISSION_WINDOW_MS,
      now,
    );
    return rateLimit;
  }

  recordLoginSubmission(clientKey: string) {
    const now = this.now();
    this.prune(now);
    return this.checkRate(
      this.loginSubmissionWindows,
      clientKey,
      LOGIN_SUBMISSION_LIMIT,
      LOGIN_SUBMISSION_WINDOW_MS,
      now,
    );
  }

  verify(challengeId: string, sessionId: string, answer: string) {
    const challenge = this.challenges.get(challengeId);
    const now = this.now();
    if (!challenge) {
      return false;
    }
    if (challenge.expiresAt <= now) {
      this.challenges.delete(challengeId);
      return false;
    }
    if (challenge.sessionId !== sessionId) return false;

    const normalizedAnswer = answer.trim();
    const syntacticallyValid = /^\d{4}$/.test(normalizedAnswer);
    const suppliedHash = answerHash(syntacticallyValid ? normalizedAnswer : "invalid");
    const valid = syntacticallyValid && timingSafeEqual(challenge.answerHash, suppliedHash);

    if (valid) {
      this.challenges.delete(challengeId);
      return true;
    }

    challenge.attempts += 1;
    if (challenge.attempts >= MAX_CHALLENGE_ATTEMPTS) {
      this.challenges.delete(challengeId);
    }
    return false;
  }

  invalidate(challengeId: string | undefined) {
    if (challengeId) this.challenges.delete(challengeId);
  }

  private checkRate(
    windows: Map<string, RateWindow>,
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ) {
    const current = windows.get(key);
    if (!current || current.startedAt + windowMs <= now) {
      windows.set(key, { startedAt: now, count: 1 });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.count >= limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((current.startedAt + windowMs - now) / 1000)),
      };
    }

    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  private prune(now: number) {
    for (const [id, challenge] of Array.from(this.challenges.entries())) {
      if (challenge.expiresAt <= now) this.challenges.delete(id);
    }
    for (const [key, value] of Array.from(this.issueWindows.entries())) {
      if (value.startedAt + CHALLENGE_ISSUE_WINDOW_MS <= now) this.issueWindows.delete(key);
    }
    for (const [key, value] of Array.from(this.submissionWindows.entries())) {
      if (value.startedAt + REGISTRATION_SUBMISSION_WINDOW_MS <= now) {
        this.submissionWindows.delete(key);
      }
    }
    for (const [key, value] of Array.from(this.loginSubmissionWindows.entries())) {
      if (value.startedAt + LOGIN_SUBMISSION_WINDOW_MS <= now) {
        this.loginSubmissionWindows.delete(key);
      }
    }
  }
}

export const registrationCaptchaService = new RegistrationCaptchaService();
