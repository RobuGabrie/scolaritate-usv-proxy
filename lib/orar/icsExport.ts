import type { ClassEntry, Timetable } from "./types";

const DAY_NAMES: Record<number, string> = {
  1: "Luni", 2: "Marți", 3: "Miercuri", 4: "Joi", 5: "Vineri", 6: "Sâmbătă",
};

function firstMondayOnOrAfter(year: number, month: number, day: number): Date {
  const d = new Date(year, month, day);
  const dow = d.getDay(); // 0=Sun
  const daysToMon = dow === 0 ? 1 : dow === 1 ? 0 : 8 - dow;
  d.setDate(d.getDate() + daysToMon);
  return d;
}

// Returns the Monday that starts week 1 of the given semester.
function semesterStart(academicStartYear: number, semester: 1 | 2): Date {
  if (semester === 1) {
    return firstMondayOnOrAfter(academicStartYear, 9, 1); // Oct 1
  }
  return firstMondayOnOrAfter(academicStartYear + 1, 1, 15); // Feb 15
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDt(date: Date, hour: number): string {
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(hour);
  return `${y}${mo}${d}T${h}0000`;
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function uid(entry: ClassEntry, idx: number): string {
  return `scolaritate-${entry.day}-${entry.startHour}-${idx}@usv`;
}

export function generateIcs(timetable: Timetable, academicStartYear: number): string {
  const sem = timetable.semester as 1 | 2;
  const weekOne = semesterStart(academicStartYear, sem);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Scolaritate+//Orar USV//RO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  timetable.classes.forEach((entry, idx) => {
    // day: 1=Mon…6=Sat. Offset from Monday of week 1.
    const dayOffset = entry.day - 1;
    const firstOccurrence = new Date(weekOne);
    firstOccurrence.setDate(weekOne.getDate() + dayOffset);

    // For even/odd patterns, shift start by 1 week so INTERVAL=2 lands correctly.
    // Convention: week 1 (first week) = odd.
    const dtStart = new Date(firstOccurrence);
    if (entry.weekPattern.kind === "even") {
      dtStart.setDate(dtStart.getDate() + 7);
    }

    const dtEnd = new Date(dtStart);
    dtEnd.setHours(0, 0, 0, 0);

    const rrule = entry.weekPattern.kind === "all"
      ? "RRULE:FREQ=WEEKLY;COUNT=14"
      : entry.weekPattern.kind === "even" || entry.weekPattern.kind === "odd"
        ? "RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=7"
        : `RRULE:FREQ=WEEKLY;COUNT=${entry.weekPattern.weeks.length}`;

    const name = entry.fullName || entry.shortName;
    const instructor = entry.fullInstructor || entry.instructor;
    const room = entry.fullRoom || entry.room;
    const dayName = DAY_NAMES[entry.day] ?? "";
    const groupCode = entry.groupCode ? ` · ${entry.groupCode.toUpperCase()}` : "";

    const descParts = [
      entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
      instructor,
      dayName + groupCode,
    ].filter(Boolean);

    const eventLines = [
      "BEGIN:VEVENT",
      `UID:${uid(entry, idx)}`,
      `DTSTART:${formatDt(dtStart, entry.startHour)}`,
      `DTEND:${formatDt(dtStart, entry.startHour + entry.rowspan)}`,
      rrule,
      `SUMMARY:${escapeIcs(name)}`,
      room ? `LOCATION:${escapeIcs(room)}` : "",
      `DESCRIPTION:${escapeIcs(descParts.join(" · "))}`,
      "END:VEVENT",
    ].filter((l) => l !== "");
    lines.push(...eventLines);
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(timetable: Timetable, academicStartYear: number, filename = "orar.ics"): void {
  const content = generateIcs(timetable, academicStartYear);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
