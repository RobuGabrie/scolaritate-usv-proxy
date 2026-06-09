import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fetchGrades, fetchGradesForStrm } from "@/lib/usv/grades";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`usv:${ip}`, LIMITS.usv)) {
    return NextResponse.json({ error: "Prea multe cereri. Încearcă din nou în câteva minute." }, { status: 429 });
  }

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
    if (message === "SESSION_EXPIRED") {
      return NextResponse.json({ error: "SESSION_EXPIRED" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
