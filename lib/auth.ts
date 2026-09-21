import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export const AUTH_COOKIE = "foit_session";
export const AUTH_STATE_COOKIE = "foit_sso_state";
export const AUTH_VERIFIER_COOKIE = "foit_sso_verifier";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const DEFAULT_ALLOWED_EMAILS = [
  "mahesh@flyonit.com.au",
  "mahesh@flyonit.com",
  "rani@flyonit.com.au",
  "rani@flyonit.com",
  "purba@flyonit.com.au",
  "purba@flyonit.com",
  "brian@flyonit.com.au",
  "brian@flyonit.com",
  "tim@flyonit.com.au",
  "tim@flyonit.com",
];

export function allowedEmails(): string[] {
  return (process.env.SSO_ALLOWED_EMAILS
    ? process.env.SSO_ALLOWED_EMAILS.split(",")
    : DEFAULT_ALLOWED_EMAILS
  )
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedEmail(email: string): boolean {
  return allowedEmails().includes(email.trim().toLowerCase());
}

function sessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET || process.env.MS_CLIENT_SECRET;
  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is not configured.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function createSession(email: string): string {
  const emailPart = Buffer.from(email.trim().toLowerCase()).toString("base64url");
  const payload = `${emailPart}.${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [emailPart, expiry, signature] = parts;
  const email = Buffer.from(emailPart, "base64url").toString("utf8");
  if (!isAllowedEmail(email) || Number(expiry) < Math.floor(Date.now() / 1000)) {
    return false;
  }
  const expected = sign(`${emailPart}.${expiry}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function createSsoState(): string {
  return randomBytes(32).toString("base64url");
}

export function createPkceVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function pkceChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}
