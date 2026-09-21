import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export const AUTH_COOKIE = "foit_session";
export const AUTH_STATE_COOKIE = "foit_sso_state";
export const AUTH_VERIFIER_COOKIE = "foit_sso_verifier";
export const AUTH_REDIRECT_COOKIE = "foit_sso_redirect";
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

/**
 * Build the OAuth redirect URI from the request host so custom domains
 * (forge.flyonit.com) and localhost stay on the same origin as the login click.
 * MS_AUTH_REDIRECT_URI is only a fallback when the host cannot be determined.
 */
export function resolveAuthRedirectUri(request: Request): string {
  const hostHeader =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protoHeader =
    request.headers.get("x-forwarded-proto") ??
    (hostHeader?.includes("localhost") ? "http" : "https");
  const host = hostHeader?.split(",")[0]?.trim();
  const proto = protoHeader.split(",")[0]?.trim();
  if (host && proto) {
    return `${proto}://${host}/auth/callback`;
  }
  if (process.env.MS_AUTH_REDIRECT_URI?.trim()) {
    return process.env.MS_AUTH_REDIRECT_URI.trim();
  }
  throw new Error("Could not determine auth redirect host.");
}
