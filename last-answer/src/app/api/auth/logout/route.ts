import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, clearSessionCookie, deleteSessionByToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      await deleteSessionByToken(token);
    }

    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("Logout failed", error);
    return NextResponse.json(
      { error: "Unable to log out right now." },
      { status: 500 },
    );
  }
}

