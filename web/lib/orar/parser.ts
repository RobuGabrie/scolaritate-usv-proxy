import { parse } from "node-html-parser";
import type { OrarGroup, ClassEntry, ClassType, Timetable, WeekPattern } from "./types";

const ORAR_BASE = "https://orar.usv.ro/orar/vizualizare";

export function parseGroups(html: string, facultyId: number): OrarGroup[] {
  const root = parse(html);
  const select = root.querySelector("select[name='grupeL']");
  if (!select) return [];

  return select
    .querySelectorAll("option")
    .map((opt): OrarGroup | null => {
      const value = opt.getAttribute("value") ?? "";
      const text = opt.text.trim();
      if (!text || !value) return null;

      const idMatch = value.match(/[?&]ID=(\d+)/i);
      if (!idMatch) return null;
      const id = idMatch[1];

      // Text format: "C an 3   3133a" — split on " an "
      const anIdx = text.toLowerCase().indexOf(" an ");
      if (anIdx === -1) return null;
      const program = text.slice(0, anIdx).trim();
      const rest = text.slice(anIdx + 4).trim();
      // Separator between year and group code can be spaces OR underscores (e.g. "3___3133a")
      const parts = rest.split(/[\s_]+/).filter(Boolean);
      const year = parseInt(parts[0]);
      const groupCode = parts.slice(1).join("").toLowerCase();
      if (isNaN(year) || !groupCode) return null;

      return { id, program, year, groupCode, facultyId };
    })
    .filter((g): g is OrarGroup => g !== null);
}

function bgcolorToType(bgcolor: string): ClassType {
  const map: Record<string, ClassType> = {
    "#ccddcc": "laborator",
    "#ccbbbb": "seminar",
    "#9999aa": "curs",
    "#eeeeee": "other",
  };
  return map[bgcolor.toLowerCase()] ?? "other";
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "")
    .trim();
}

function parseTooltip(raw: string): {
  fullName: string;
  fullRoom: string;
  fullInstructor: string;
  weekPattern: WeekPattern;
} {
  const tipMatch = raw.match(/Tip\s*\(\s*'([\s\S]+?)'\s*\)/);
  const content = tipMatch?.[1] ?? "";

  const liRe = /<li>([^<]*)/gi;
  const items: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(content)) !== null) {
    items.push(decodeHtmlEntities(m[1]));
  }

  let fullName = "", fullRoom = "", fullInstructor = "";
  let weekPattern: WeekPattern = { kind: "all" };

  for (const item of items) {
    const lower = item.toLowerCase();
    if (lower.startsWith("disciplina:")) {
      fullName = item.slice("disciplina:".length).trim();
    } else if (lower.startsWith("sala:")) {
      fullRoom = item.slice("sala:".length).trim();
    } else if (lower.startsWith("cadru didactic:")) {
      fullInstructor = item.slice("cadru didactic:".length).trim();
    } else if (lower.includes("saptamanile pare")) {
      weekPattern = { kind: "even" };
    } else if (lower.includes("saptamanile impare")) {
      weekPattern = { kind: "odd" };
    } else if (lower.startsWith("sapt.")) {
      const nums = [...item.matchAll(/\d+/g)].map((n) => parseInt(n[0]));
      if (nums.length > 0) weekPattern = { kind: "specific", weeks: nums };
    }
  }

  return { fullName, fullRoom, fullInstructor, weekPattern };
}

export function parseTimetable(html: string, groupId: string, semester: number): Timetable {
  const empty: Timetable = { groupId, semester, classes: [], hourSlots: [], activeDays: [] };

  // Bail early if there are no ore cells at all
  if (!/class=['"]ore['"]/i.test(html)) return empty;

  // Extract all <tr>...</tr> blocks (case-insensitive, non-nested)
  const rows: string[] = [];
  const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let trM: RegExpExecArray | null;
  while ((trM = trRe.exec(html)) !== null) {
    rows.push(trM[1]);
  }

  // Build rowIndex → startHour from <td class='ore'><nobr>08</nobr></td>
  const rowHourMap = new Map<number, number>();
  rows.forEach((rowHtml, i) => {
    if (!/class=['"]ore['"]/i.test(rowHtml)) return;
    const numM = rowHtml.match(/<nobr>(\d+)<\/nobr>/i)
      ?? rowHtml.match(/class=['"]ore['"][^>]*>\s*(\d+)\s*</i);
    if (!numM) return;
    const h = parseInt(numM[1]);
    if (h >= 8 && h <= 22) rowHourMap.set(i, h);
  });

  const classes: ClassEntry[] = [];

  rows.forEach((rowHtml, rowIdx) => {
    const currentHour = rowHourMap.get(rowIdx);
    if (currentHour === undefined) return;

    // Find class cells: <td ... day='N' ...>...</td>
    const cellRe = /<td\b([^>]*\bday=['"](\d+)['"][^>]*)>([\s\S]*?)<\/td>/gi;
    let cellM: RegExpExecArray | null;
    while ((cellM = cellRe.exec(rowHtml)) !== null) {
      const attrsStr = cellM[1];
      const day = parseInt(cellM[2]);
      const cellContent = cellM[3];
      if (isNaN(day)) continue;

      const rowspan = parseInt(attrsStr.match(/\browspan=['"]?(\d+)/i)?.[1] ?? "1") || 1;
      const bgcolor = attrsStr.match(/\bbgcolor=['"]([^'"]+)['"]/i)?.[1] ?? "#eeeeee";

      // onmouseover is on the inner <a> tag — match up to onmouseout as terminator
      const tooltipRaw =
        cellContent.match(/onmouseover\s*=\s*"([\s\S]*?)"\s*onmouseout/i)?.[1] ?? "";

      // Strip onmouseover/onmouseout attrs first — their HTML content breaks tag-stripping regex
      const cleanCellContent = cellContent
        .replace(/\s+onmouseover="[^"]*"/gi, "")
        .replace(/\s+onmouseout="[^"]*"/gi, "");

      // Parse text lines: split on <br>, strip tags
      const lines = cleanCellContent
        .split(/<br\s*\/?>/i)
        .map((l) =>
          l
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&#\d+;/g, "")
            .trim()
        )
        .filter((l) => l && !/^[-.\s]+$/.test(l));

      if (lines.length === 0) continue;

      const parts0 = lines[0].split(",");
      const shortName = parts0[0]?.trim() ?? "";
      if (!shortName) continue;

      const room = parts0[2]?.trim() ?? "";
      const instructor = lines[1] ?? "";

      const { fullName, fullRoom, fullInstructor, weekPattern } = parseTooltip(tooltipRaw);

      classes.push({
        day,
        startHour: currentHour,
        rowspan,
        type: bgcolorToType(bgcolor),
        shortName,
        room,
        instructor,
        fullName: fullName || shortName,
        fullRoom: fullRoom || room,
        fullInstructor: fullInstructor || instructor,
        weekPattern,
      });
    }
  });

  const hourSlots = [...new Set(rowHourMap.values())].sort((a, b) => a - b);
  const activeDays = [...new Set(classes.map((c) => c.day))].sort((a, b) => a - b);

  return { groupId, semester, classes, hourSlots, activeDays };
}

// Strips academic titles and punctuation, keeps only words >= 3 chars
const TITLE_RE = /\b(prof|conf|lect|asist|dr|univ|ing|dipl|stud|sl|as|sef)\.?\b/gi;

function normalizeName(s: string): string[] {
  return s
    .toLowerCase()
    .replace(TITLE_RE, "")
    .replace(/[^a-zăâîșț\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

// A match requires at least one substantive word in common (last names are usually unique enough)
function nameMatches(query: string, candidate: string): boolean {
  const q = normalizeName(query);
  const c = normalizeName(candidate);
  if (q.length === 0 || c.length === 0) return false;
  return q.some((w) => c.includes(w));
}

// Same physical class (same day/hour/room/subject) recorded across multiple groups → keep one
function deduplicateClasses(classes: ClassEntry[]): ClassEntry[] {
  const seen = new Map<string, ClassEntry>();
  for (const cls of classes) {
    const subject = cls.fullName || cls.shortName;
    const room = cls.fullRoom || cls.room;
    const weekKind = cls.weekPattern.kind;
    const key = `${cls.day}-${cls.startHour}-${cls.rowspan}-${cls.type}-${subject}-${room}-${weekKind}`;
    if (!seen.has(key)) {
      seen.set(key, cls);
    }
  }
  return [...seen.values()];
}

export async function fetchInstructorSchedule(
  instructorName: string,
  facultyId: number,
  sem: number,
): Promise<Timetable> {
  const groups = await fetchGroups(facultyId, sem);
  if (groups.length === 0) throw new Error("Nu s-au putut încărca grupele.");

  const BATCH = 10;
  const matchedClasses: ClassEntry[] = [];

  for (let i = 0; i < groups.length; i += BATCH) {
    const batch = groups.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map((g) => fetchTimetable(g.id, sem)),
    );
    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      if (r.status !== "fulfilled") continue;
      const group = batch[j];
      for (const cls of r.value.classes) {
        const name = cls.fullInstructor || cls.instructor;
        if (nameMatches(instructorName, name)) {
          matchedClasses.push({ ...cls, groupCode: group.groupCode });
        }
      }
    }
  }

  const deduplicated = deduplicateClasses(matchedClasses);

  const hourSlots = [...new Set(deduplicated.map((c) => c.startHour))].sort(
    (a, b) => a - b,
  );
  const activeDays = [...new Set(deduplicated.map((c) => c.day))].sort(
    (a, b) => a - b,
  );

  return {
    groupId: `instructor:${instructorName}`,
    semester: sem,
    classes: deduplicated,
    hourSlots,
    activeDays,
  };
}

export async function fetchGroups(facultyId: number, sem: number): Promise<OrarGroup[]> {
  const { currentAcademicYearParam } = await import("./academicYear");
  const an = currentAcademicYearParam();
  const url = `${ORAR_BASE}/orarUp2.php?facultateID=${facultyId}&an=${an}&sem=${sem}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ro-RO,ro;q=0.9" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`orar.usv.ro status ${res.status}`);
  const html = await res.text();
  return parseGroups(html, facultyId);
}

export async function fetchTimetable(groupId: string, sem: number): Promise<Timetable> {
  const url = `${ORAR_BASE}/orarSPG.php?ID=${groupId}&mod=grupa&mod2=vizual&print=nu&back=`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ro-RO,ro;q=0.9" },
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`orar.usv.ro status ${res.status}`);
  const html = await res.text();
  return parseTimetable(html, groupId, sem);
}
