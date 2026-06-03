import { NextResponse } from "next/server";
import { fetchInstructors, matchInstructor } from "@/lib/orar/parser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const facultyId = parseInt(searchParams.get("facultyId") ?? "");
  const sem = parseInt(searchParams.get("sem") ?? "2");
  const name = searchParams.get("name");

  if (isNaN(facultyId)) return NextResponse.json({ error: "facultyId lipsă" }, { status: 400 });

  try {
    const instructors = await fetchInstructors(facultyId, sem);
    if (name) {
      const match = matchInstructor(name, instructors);
      return NextResponse.json({ instructor: match ?? null });
    }
    return NextResponse.json({ instructors });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
