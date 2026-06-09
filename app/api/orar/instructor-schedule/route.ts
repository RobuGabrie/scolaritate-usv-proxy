import { NextRequest, NextResponse } from "next/server";
import { fetchInstructorSchedule, fetchInstructorScheduleById } from "@/lib/orar/parser";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`orar:${ip}`, LIMITS.orar)) {
    return NextResponse.json({ error: "Prea multe cereri. Încearcă din nou în câteva minute." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const facultyId = parseInt(searchParams.get("facultyId") ?? "0");
  const sem = parseInt(searchParams.get("sem") ?? "2");

  try {
    if (id) {
      const professorId = parseInt(id);
      if (isNaN(professorId)) return NextResponse.json({ error: "id invalid" }, { status: 400 });
      const timetable = await fetchInstructorScheduleById(professorId);
      return NextResponse.json(timetable);
    }

    if (!name) return NextResponse.json({ error: "name sau id lipsă" }, { status: 400 });
    const timetable = await fetchInstructorSchedule(name, facultyId, sem);
    return NextResponse.json(timetable);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
