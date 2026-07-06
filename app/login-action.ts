"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, type LoginState } from "@/lib/auth";

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const code = String(formData.get("code") ?? "").trim();
  const expected = process.env.APP_PASSCODE;

  if (!expected) {
    return { status: "error", message: "Passcode is not configured." };
  }
  if (code !== expected) {
    return { status: "error", message: "Incorrect passcode." };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "granted", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/");
}
