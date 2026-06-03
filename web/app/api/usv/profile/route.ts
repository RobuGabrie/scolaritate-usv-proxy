import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fetchProfile } from "@/lib/usv/profile";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

  try {
    const data = await fetchProfile(session.cookies);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
