import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getSession } from "@/lib/auth";
import { getUserPhotoBytes } from "@/lib/msgraph/client";

export async function GET() {
  const cookieStore = await cookies();
  const session = getSession(cookieStore.get(AUTH_COOKIE)?.value);
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    const photo = await getUserPhotoBytes(session.email);
    if (!photo) {
      return new NextResponse(null, { status: 404 });
    }
    return new NextResponse(photo.bytes, {
      headers: {
        "Content-Type": photo.contentType,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
