import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_STATE_COOKIE,
  AUTH_VERIFIER_COOKIE,
  createPkceVerifier,
  createSsoState,
  pkceChallenge,
} from "@/lib/auth";

export async function GET() {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const redirectUri = process.env.MS_AUTH_REDIRECT_URI;

  if (!tenantId || !clientId || !redirectUri) {
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
