import { parse, HTMLElement } from "node-html-parser";
import type { Grade } from "./types";

export interface PsContext {
  emplid: string;
  acadCareer: string;
  institution: string;
  currentStrm: string;
}

export function parsePsContext(html: string): PsContext | null {
  try {
    const m = html.match(/strCurrUrl\s*=\s*['"]([^'"]+)['"]/i);
    if (!m) return null;
    const qs = (m[1].split("?")[1] ?? "").replace(/&amp;/g, "&");
    const p = new URLSearchParams(qs);
    const strm = p.get("STRM");
    const emplid = p.get("EMPLID");
    const acadCareer = p.get("ACAD_CAREER");
    const institution = p.get("INSTITUTION") ?? "USV";
    if (!emplid || !acadCareer || !strm) return null;
    return { emplid, acadCareer, institution, currentStrm: strm };
  } catch {
    return null;
  }
}

function clean(s: string): string {
  return s
    .replace(/&#037;/g, "%")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function txt(el: HTMLElement | null | undefined): string {
  if (!el) return "";
  return clean(el.text);
}

function classifySession(s: string): Grade["filterCategory"] {
  const u = s.toUpperCase();
  if (u.includes("REST") || u.includes("RESTAN")) return "OTHER";
  if (u.includes("SM1") || u.includes("SEM1") || u.includes("SEM 1")) return "SEM 1";
  if (u.includes("SM2") || u.includes("SEM2") || u.includes("SEM 2")) return "SEM 2";
  if (u === "1" || u.endsWith("1")) return "SEM 1";
  if (u === "2" || u.endsWith("2")) return "SEM 2";
  return "OTHER";
}

function estimateGrade(pondere: string, notaCurs: string, notaSeminar: string): string {
  const curs = parseFloat(notaCurs);
  const lab = parseFloat(notaSeminar);
  const m = pondere.replace(/&#037;/g, "").match(/(\d+)\s*[/\\]\s*(\d+)/);
  if (!m || isNaN(curs) || isNaN(lab)) return "";
  const pC = parseInt(m[1]);
  const pL = parseInt(m[2]);
  return ((curs * pC + lab * pL) / (pC + pL)).toFixed(2);
}

export function parseGrades(html: string): Grade[] {
  const root = parse(html);

  // USV PeopleSoft uses single-quoted IDs — build a lookup by ID
  // Field pattern: id='FIELDNAME$N' (single or double quotes, $N suffix)
  const idMap: Record<string, string> = {};
  for (const el of root.querySelectorAll("[id]")) {
    const id = el.getAttribute("id") ?? "";
    if (id) idMap[id] = txt(el);
  }

  // Also check spans that might use single quotes (node-html-parser normalizes them)
  // Find all IDs matching FIELDNAME$N pattern
  const byBase: Record<string, Record<number, string>> = {};
  for (const [id, value] of Object.entries(idMap)) {
    const m = id.match(/^(.+)\$(\d+)$/);
    if (!m) continue;
    const [, base, rowStr] = m;
    const row = parseInt(rowStr);
    if (!byBase[base]) byBase[base] = {};
    byBase[base][row] = value;
  }

  // Also extract raw HTML matches for single-quoted IDs that node-html-parser
  // might not catch cleanly (PeopleSoft uses non-standard HTML heavily)
  const rawPattern = /id='([^']+\$\d+)'[^>]*>([^<]*)</g;
  let rawMatch: RegExpExecArray | null;
  while ((rawMatch = rawPattern.exec(html)) !== null) {
    const id = rawMatch[1];
    const rawVal = clean(rawMatch[2]);
    const m = id.match(/^(.+)\$(\d+)$/);
    if (!m) continue;
    const [, base, rowStr] = m;
    const row = parseInt(rowStr);
    if (!byBase[base]) byBase[base] = {};
    if (!byBase[base][row]) byBase[base][row] = rawVal; // don't overwrite if already found
  }

  if (Object.keys(byBase).length === 0) return [];

  // USV-specific field mapping (discovered from actual grade page HTML):
  // STD_ENRL_SSV_TM_COURSE_TITLE_LONG  → Titlu lung curs
  // CLASS_TBL_VW_SESSION_CODE           → Sesiune (SM1/SM2)
  // STD_ENRL_SSV_TM_DESCRSHORT         → Ponderi Curs/Lab (e.g. "50% / 50%")
  // STD_ENRL_SSV_TM_STUDENT_GRADE      → Nota curs
  // STD_ENRL_SSV_TM_STUDENT_GRADE1     → Nota seminar/laborator
  // STDNT_ENRL_SSV1_CRSE_GRADE_OFF     → Nota finala
  // STDNT_ENRL_SSV1_UNT_TAKEN          → Credite
  // STDNT_ENRL_SSV1_GRADE_POINTS       → Puncte nota

  const find = (...kws: string[]) =>
    Object.keys(byBase).find((k) =>
      kws.every((kw) => k.toUpperCase().includes(kw.toUpperCase()))
    );

  const titleBase =
    find("COURSE_TITLE_LONG") ??
    find("CRSE_TITLE_LONG") ??
    find("TITLE_LONG") ??
    find("CRSE_TITLE");

  if (!titleBase) return [];

  const maxRow = Math.max(...Object.keys(byBase[titleBase]).map(Number));

  const sessionBase = find("SESSION_CODE") ?? find("SESSION");
  const ponderBase = find("DESCRSHORT") ?? find("PONDER") ?? find("WEIGHT");

  // Nota curs: STUDENT_GRADE but NOT STUDENT_GRADE1 and NOT GRADE_OFF and NOT GRADE_POINTS
  const notaCursBase = Object.keys(byBase).find(
    (k) =>
      k.toUpperCase().includes("STUDENT_GRADE") &&
      !k.toUpperCase().includes("GRADE1") &&
      !k.toUpperCase().includes("GRADE_OFF") &&
      !k.toUpperCase().includes("GRADE_POINTS")
  ) ?? find("CMPNT_GRADE") ?? find("COURSE_GRADE");

  // Nota lab: STUDENT_GRADE1
  const notaLabBase = Object.keys(byBase).find(
    (k) => k.toUpperCase().includes("STUDENT_GRADE1")
  ) ?? find("SEMINAR") ?? find("LAB_GRADE");

  const notaFinalBase =
    find("CRSE_GRADE_OFF") ??
    find("GRADE_FINAL") ??
    find("OVERALL_GRADE") ??
    find("FINAL_GRADE");

  const crediteBase = find("UNT_TAKEN") ?? find("CREDIT") ?? find("CREDITE");
  const puncteBase = find("GRADE_POINTS") ?? find("GRADE_PT") ?? find("PUNCTE");

  const grades: Grade[] = [];

  for (let i = 0; i <= maxRow; i++) {
    const titlu = byBase[titleBase]?.[i] ?? "";
    if (!titlu) continue;

    const sesiune = sessionBase ? (byBase[sessionBase]?.[i] ?? "") : "";
    const pondere = ponderBase ? (byBase[ponderBase]?.[i] ?? "") : "";
    const notaCurs = notaCursBase ? (byBase[notaCursBase]?.[i] ?? "") : "";
    const notaSeminar = notaLabBase ? (byBase[notaLabBase]?.[i] ?? "") : "";
    const notaFinalRaw = notaFinalBase ? (byBase[notaFinalBase]?.[i] ?? "") : "";
    const credite = crediteBase ? (byBase[crediteBase]?.[i] ?? "") : "";
    const puncte = puncteBase ? (byBase[puncteBase]?.[i] ?? "") : "";

    // If nota finala is missing but we have curs+lab+pondere, estimate it
    const isEstimated = !notaFinalRaw && !!(notaCurs && notaSeminar && pondere);
    const notaFinala = notaFinalRaw || (isEstimated ? estimateGrade(pondere, notaCurs, notaSeminar) : "");

    grades.push({
      titlu,
      sesiune,
      filterCategory: classifySession(sesiune),
      pondere,
      notaCurs,
      notaSeminar,
      notaFinala,
      credite,
      puncte,
      isEstimated,
      originalIndex: i,
    });
  }

  return grades;
}

export { classifySession };
