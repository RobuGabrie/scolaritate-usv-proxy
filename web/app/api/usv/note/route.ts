import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fetchGrades } from "@/lib/usv/grades";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  try {
    const result = await fetchGrades(session.cookies);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
