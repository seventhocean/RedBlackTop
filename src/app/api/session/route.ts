import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const existing = cookieStore.get("session_id")?.value;
  if (existing) {
    return NextResponse.json({ sessionId: existing });
  }

  const sessionId = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const response = NextResponse.json({ sessionId });
  response.cookies.set("session_id", sessionId, {
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}
