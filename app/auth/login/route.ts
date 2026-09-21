import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_REDIRECT_COOKIE,
  AUTH_STATE_COOKIE,
  AUTH_VERIFIER_COOKIE,
  createPkceVerifier,
  createSsoState,
  pkceChallenge,
  resolveAuthRedirectUri,
} from "@/lib/auth";

export async function GET(request: Request) {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;

  if (!tenantId || !clientId) {
    redirect("/?sso_error=Microsoft SSO is not configured.");
  }

  let redirectUri: string;
  try {
    redirectUri = resolveAuthRedirectUri(request);
  } catch {
    redirect("/?sso_error=Microsoft SSO is not configured.");
  }

  const state = createSsoState();
  const verifier = createPkceVerifier();
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };
  cookieStore.set(AUTH_STATE_COOKIE, state, cookieOptions);
  cookieStore.set(AUTH_VERIFIER_COOKIE, verifier, cookieOptions);
  cookieStore.set(AUTH_REDIRECT_COOKIE, redirectUri, cookieOptions);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    response_mode: "query",
    scope: "openid profile email User.Read",
    state,
    code_challenge: pkceChallenge(verifier),
    code_challenge_method: "S256",
  });

  redirect(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params}`
  );
}
