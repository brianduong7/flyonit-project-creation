import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return clearAuthCookie(NextResponse.redirect(new URL("/", url.origin)));
}

export async function POST() {
  return clearAuthCookie(new NextResponse(null, { status: 204 }));
}
