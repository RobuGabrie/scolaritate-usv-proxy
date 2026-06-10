import { NextResponse } from "next/server";
import { fetchGroups } from "@/lib/orar/parser";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/ratelimit";

export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`orar:${ip}`, LIMITS.orar)) {
    return NextResponse.json({ error: "Prea multe cereri. Încearcă din nou în câteva minute." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const facultyId = parseInt(searchParams.get("facultyId") ?? "1");
  const sem = parseInt(searchParams.get("sem") ?? "2");

  try {
    const groups = await fetchGroups(facultyId, sem);
    return NextResponse.json({ groups });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
