import { NextResponse } from "next/server";
import { fetchTimetable } from "@/lib/orar/parser";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/ratelimit";

export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`orar:${ip}`, LIMITS.orar)) {
    return NextResponse.json({ error: "Prea multe cereri. Încearcă din nou în câteva minute." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const sem = parseInt(searchParams.get("sem") ?? "2");

  // The group ID is interpolated into the upstream orar.usv.ro URL — require it
  // to be a bare number so it can't inject extra query params.
  if (!id || !/^\d+$/.test(id)) return NextResponse.json({ error: "id invalid" }, { status: 400 });

  try {
    const timetable = await fetchTimetable(id, sem);
    return NextResponse.json(timetable);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
