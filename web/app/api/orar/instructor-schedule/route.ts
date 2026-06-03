import { NextResponse } from "next/server";
import { fetchInstructorSchedule } from "@/lib/orar/parser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const facultyId = parseInt(searchParams.get("facultyId") ?? "");
  const sem = parseInt(searchParams.get("sem") ?? "2");

  if (!name) return NextResponse.json({ error: "name lipsă" }, { status: 400 });
  if (isNaN(facultyId)) return NextResponse.json({ error: "facultyId lipsă" }, { status: 400 });

  try {
    const timetable = await fetchInstructorSchedule(name, facultyId, sem);
    return NextResponse.json(timetable);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
