import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  AUTH_REDIRECT_COOKIE,
  AUTH_STATE_COOKIE,
  AUTH_VERIFIER_COOKIE,
  createSession,
  isAllowedEmail,
  resolveAuthRedirectUri,
} from "@/lib/auth";

type GraphUser = {
  mail?: string | null;
  userPrincipalName?: string | null;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const returnedState = requestUrl.searchParams.get("state");
  const oauthError = requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(AUTH_STATE_COOKIE)?.value;
  const verifier = cookieStore.get(AUTH_VERIFIER_COOKIE)?.value;
  const storedRedirectUri = cookieStore.get(AUTH_REDIRECT_COOKIE)?.value;

  cookieStore.delete(AUTH_STATE_COOKIE);
  cookieStore.delete(AUTH_VERIFIER_COOKIE);
  cookieStore.delete(AUTH_REDIRECT_COOKIE);

  if (oauthError || !code || !returnedState || !verifier || returnedState !== expectedState) {
    redirect("/?sso_error=Microsoft sign-in was cancelled or could not be verified.");
  }

  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const redirectUri = storedRedirectUri || resolveAuthRedirectUri(request);
  if (!tenantId || !clientId || !clientSecret || !redirectUri) {
    redirect("/?sso_error=Microsoft SSO is not configured.");
  }

  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
    }
  );
  const tokenBody = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !tokenBody?.access_token) {
    redirect("/?sso_error=Microsoft sign-in could not be completed.");
  }

  const userResponse = await fetch(
    "https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName",
    { headers: { Authorization: `Bearer ${tokenBody.access_token}` } }
  );
  const user = (await userResponse.json().catch(() => null)) as GraphUser | null;
  const email = (user?.mail || user?.userPrincipalName || "").trim().toLowerCase();

  if (!userResponse.ok || !isAllowedEmail(email)) {
    redirect("/?sso_error=Your Microsoft account is not allowed to use this app.");
  }

  cookieStore.set(AUTH_COOKIE, createSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  redirect("/");
}
