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

export type SessionUser = {
  email: string;
  displayName: string;
};

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

export function createSession(user: SessionUser): string {
  const data = Buffer.from(
    JSON.stringify({
      email: user.email.trim().toLowerCase(),
      displayName: user.displayName.trim() || user.email.trim().toLowerCase(),
    })
  ).toString("base64url");
  const payload = `${data}.${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}`;
  return `${payload}.${sign(payload)}`;
}

export function getSession(value: string | undefined): SessionUser | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [data, expiry, signature] = parts;
  const expected = sign(`${data}.${expiry}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }
  if (Number(expiry) < Math.floor(Date.now() / 1000)) return null;

  try {
    // New format: JSON payload
    const parsed = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as {
      email?: string;
      displayName?: string;
    };
    if (parsed.email && isAllowedEmail(parsed.email)) {
      return {
        email: parsed.email.trim().toLowerCase(),
        displayName: (parsed.displayName || parsed.email).trim(),
      };
    }
  } catch {
    // Legacy format: email only
    const email = Buffer.from(data, "base64url").toString("utf8").trim().toLowerCase();
    if (isAllowedEmail(email)) {
      return { email, displayName: email };
    }
  }
  return null;
}

export function isValidSession(value: string | undefined): boolean {
  return getSession(value) != null;
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
