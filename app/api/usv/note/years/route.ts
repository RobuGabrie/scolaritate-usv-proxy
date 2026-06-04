import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { discoverYears } from "@/lib/usv/grades";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  try {
    const years = await discoverYears(session.cookies);
    return NextResponse.json({ years });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
