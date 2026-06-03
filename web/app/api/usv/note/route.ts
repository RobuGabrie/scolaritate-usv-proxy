import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fetchGrades, fetchGradesForStrm } from "@/lib/usv/grades";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const strm = searchParams.get("strm");

  try {
    const result = strm
      ? await fetchGradesForStrm(session.cookies, strm)
      : await fetchGrades(session.cookies);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
