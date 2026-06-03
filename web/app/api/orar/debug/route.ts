import { NextRequest, NextResponse } from "next/server";
import { parseTimetable, parseInstructors, matchInstructor } from "@/lib/orar/parser";
import { currentAcademicYearParam } from "@/lib/orar/academicYear";

const ORAR_BASE = "https://orar.usv.ro/orar/vizualizare";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  const format = searchParams.get("format") ?? "parsed";

  // --- Instructor list debug ---
  if (format === "instructors") {
    const facultyId = parseInt(searchParams.get("facultyId") ?? "1");
    const sem = parseInt(searchParams.get("sem") ?? "2");
    const an = currentAcademicYearParam();
    const url = `${ORAR_BASE}/orarUp2.php?facultateID=${facultyId}&an=${an}&sem=${sem}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ro-RO,ro;q=0.9" },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ error: `orarUp2 status ${res.status}` }, { status: 502 });
    const html = await res.text();
    const instructors = parseInstructors(html, facultyId);
    const name = searchParams.get("name");
    const match = name ? matchInstructor(name, instructors) : null;
    const cadreMatch = html.match(/name=['"]cadreL['"][^>]*>([\s\S]*?)<\/select>/i);
    return NextResponse.json({
      url,
      instructorCount: instructors.length,
      first10: instructors.slice(0, 10),
      matchFor: name ?? null,
      match,
      cadreSelectFound: !!cadreMatch,
      cadreSelectSnippet: cadreMatch?.[0]?.slice(0, 500) ?? null,
    });
  }

  // --- Instructor timetable debug ---
  if (format === "instructor-timetable") {
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sem = parseInt(searchParams.get("sem") ?? "2");
    const url = `${ORAR_BASE}/orarSPG.php?ID=${id}&mod=cadru&mod2=vizual&print=nu&back=`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ro-RO,ro;q=0.9" },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ error: `status ${res.status}` }, { status: 502 });
    const html = await res.text();
    const timetable = parseTimetable(html, id, sem);
    const hasOre = /class=['"]ore['"]/i.test(html);
    const hasDayAttr = /\bday=['"]/i.test(html);
    return NextResponse.json({ diagnostics: { hasOre, hasDayAttr, htmlLength: html.length }, timetable });
  }

  // --- Group timetable debug (original) ---
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const url = `${ORAR_BASE}/orarSPG.php?ID=${id}&mod=grupa&mod2=vizual&print=nu&back=`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ro-RO,ro;q=0.9" },
    cache: "no-store",
  });

  if (!res.ok) return NextResponse.json({ error: `Status ${res.status}` }, { status: 502 });

  const html = await res.text();

  if (format === "raw") {
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  if (format === "snippet") {
    const idx = html.toLowerCase().indexOf("ore");
    const start = Math.max(0, idx - 200);
    return new Response(html.slice(start, start + 5000), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  if (format === "rows") {
    const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    const relevant: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = trRe.exec(html)) !== null) {
      const row = m[1];
      if (/class=['"]ore['"]/i.test(row) || /\bday=['"]/i.test(row)) {
        relevant.push(row.slice(0, 500));
      }
    }
    return NextResponse.json({ count: relevant.length, rows: relevant });
  }

  const timetable = parseTimetable(html, id, 2);
  const hasOre = /class=['"]ore['"]/i.test(html);
  const hasDayAttr = /\bday=['"]/i.test(html);

  return NextResponse.json({
    diagnostics: { hasOre, hasDayAttr, htmlLength: html.length },
    timetable,
  });
}
