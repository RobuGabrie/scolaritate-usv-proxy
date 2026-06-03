import { NextResponse } from "next/server";
import { fetchTimetable } from "@/lib/orar/parser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const sem = parseInt(searchParams.get("sem") ?? "2");

  if (!id) return NextResponse.json({ error: "id lipsă" }, { status: 400 });

  try {
    const timetable = await fetchTimetable(id, sem);
    return NextResponse.json(timetable);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Eroare server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
