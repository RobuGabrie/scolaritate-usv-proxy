import { parse } from "node-html-parser";
import type { OrarGroup, ClassEntry, ClassType, Timetable, WeekPattern } from "./types";

const ORAR_BASE = "https://orar.usv.ro/orar/vizualizare";
const ORAR_DATA = "https://orar.usv.ro/orar/vizualizare/data";

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
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
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
    } else if (lower.includes("săptămânile pare") || lower.includes("saptamanile pare")) {
      weekPattern = { kind: "even" };
    } else if (lower.includes("săptămânile impare") || lower.includes("saptamanile impare")) {
      weekPattern = { kind: "odd" };
    } else if (lower.startsWith("săpt.") || lower.startsWith("sapt.")) {
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
            .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
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

// Require at least 2 words to match — single common first names like "Elena" or "Cristina"
// would otherwise cause false positives against completely unrelated professors.
function nameMatches(query: string, candidate: string): boolean {
  const q = normalizeName(query);
  const c = normalizeName(candidate);
  if (q.length === 0 || c.length === 0) return false;
  // Short candidate (e.g. abbreviated "Turcu C.") — just require the first word (surname)
  if (c.length === 1) return c.includes(q[0]);
  const matchCount = q.filter((w) => c.includes(w)).length;
  return matchCount >= Math.min(q.length, 2);
}

interface ProfessorInfo {
  id: string;
  lastName: string;
  firstName: string;
}

export async function fetchProfessors(): Promise<ProfessorInfo[]> {
  const res = await fetch(`${ORAR_DATA}/cadre.php?json`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`cadre.php status ${res.status}`);
  const data = await res.json() as Array<{ id: string; lastName: string | null; firstName: string | null }>;
  return data
    .filter((p) => p.id && p.lastName)
    .map((p) => ({
      id: p.id,
      lastName: (p.lastName ?? "").trim(),
      firstName: (p.firstName ?? "").trim(),
    }));
}

function parseProfessorHtml(html: string): ClassEntry[] {
  // Response starts with a stray "[" — strip it
  const root = parse(html.replace(/^\[/, ""));
  const rows = root.querySelectorAll("tr");
  const classes: ClassEntry[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const tds = rows[i].querySelectorAll("td");
    if (tds.length < 21) continue;

    const get = (idx: number) => tds[idx].text.trim();

    const topicLong = decodeHtmlEntities(get(12));
    const topicShort = decodeHtmlEntities(get(13));
    const roomLong = get(10);
    const roomShort = get(11);
    const weekDay = parseInt(get(14));
    const startMin = parseInt(get(15));
    const duration = parseInt(get(16));
    const parity = get(17);
    const otherInfo = get(18);
    const typeLong = get(20);

    if (isNaN(weekDay) || isNaN(startMin) || !topicShort) continue;

    const startHour = startMin / 60;
    const rowspan = Math.max(1, Math.round(duration / 120));

    let weekPattern: WeekPattern;
    if (parity === "i") weekPattern = { kind: "odd" };
    else if (parity === "p") weekPattern = { kind: "even" };
    else if (otherInfo) {
      const nums = [...otherInfo.matchAll(/\d+/g)].map((n) => parseInt(n[0]));
      weekPattern = nums.length > 0 ? { kind: "specific", weeks: nums } : { kind: "all" };
    } else {
      weekPattern = { kind: "all" };
    }

    const type: ClassType =
      typeLong === "curs" ? "curs" :
      typeLong === "laborator" ? "laborator" :
      typeLong === "seminar" ? "seminar" :
      "other";

    // Deduplicate: same slot + parity + type + subject = same class for different groups
    const key = `${weekDay}-${startMin}-${parity}-${typeLong}-${topicShort}`;
    if (seen.has(key)) continue;
    seen.add(key);

    classes.push({
      day: weekDay,
      startHour,
      rowspan,
      type,
      shortName: topicShort,
      room: roomShort,
      instructor: "",
      fullName: topicLong,
      fullRoom: roomLong,
      fullInstructor: "",
      weekPattern,
    });
  }

  return classes;
}

export async function fetchInstructorScheduleById(professorId: number): Promise<Timetable> {
  const url = `${ORAR_DATA}/orarSPG.php?mod=prof&ID=${professorId}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ro-RO,ro;q=0.9" },
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`orarSPG.php status ${res.status}`);
  const html = await res.text();

  const classes = parseProfessorHtml(html);
  const hourSlots = [...new Set(classes.map((c) => c.startHour))].sort((a, b) => a - b);
  const activeDays = [...new Set(classes.map((c) => c.day))].sort((a, b) => a - b);

  return {
    groupId: `instructor:${professorId}`,
    semester: 0,
    classes,
    hourSlots,
    activeDays,
  };
}

export async function fetchInstructorSchedule(
  instructorName: string,
  _facultyId: number,
  _sem: number,
): Promise<Timetable> {
  const professors = await fetchProfessors();

  const match = professors.find((p) => {
    const fullName = `${p.lastName} ${p.firstName}`;
    const fullNameRev = `${p.firstName} ${p.lastName}`;
    return nameMatches(instructorName, fullName) || nameMatches(instructorName, fullNameRev);
  });

  if (!match) throw new Error(`Profesorul nu a fost găsit în lista de cadre.`);

  return fetchInstructorScheduleById(parseInt(match.id));
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
  const url = `${ORAR_BASE}/orarSPG.php?ID=${encodeURIComponent(groupId)}&mod=grupa&mod2=vizual&print=nu&back=`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ro-RO,ro;q=0.9" },
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`orar.usv.ro status ${res.status}`);
  const html = await res.text();
  return parseTimetable(html, groupId, sem);
}
