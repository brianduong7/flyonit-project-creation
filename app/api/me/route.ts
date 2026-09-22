import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getSession } from "@/lib/auth";
import { getSignedInUserProfile } from "@/lib/msgraph/client";

export async function GET() {
  const cookieStore = await cookies();
  const session = getSession(cookieStore.get(AUTH_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getSignedInUserProfile(session.email);
    return NextResponse.json({
      email: session.email,
      displayName: profile?.displayName || session.displayName,
      givenName: profile?.givenName,
      surname: profile?.surname,
      jobTitle: profile?.jobTitle,
      officeLocation: profile?.officeLocation,
      mobilePhone: profile?.mobilePhone,
      userPrincipalName: profile?.userPrincipalName || session.email,
      photoUrl: "/api/me/photo",
    });
  } catch (err) {
    return NextResponse.json(
      {
        email: session.email,
        displayName: session.displayName,
        userPrincipalName: session.email,
        photoUrl: "/api/me/photo",
        warning: err instanceof Error ? err.message : "Could not load full profile",
      },
      { status: 200 }
    );
  }
}
