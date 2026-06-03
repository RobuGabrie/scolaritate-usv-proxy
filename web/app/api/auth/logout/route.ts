import { NextResponse } from "next/server";
import { getSession, deleteSessionCookie } from "@/lib/session";
import { logoutFromUSV } from "@/lib/usv/auth";

export async function POST() {
  const session = await getSession();
  if (session) {
    await logoutFromUSV(session.cookies);
  }
  await deleteSessionCookie();
  return NextResponse.json({ ok: true });
}
