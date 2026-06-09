import { curlGet, isUsvLoginPage } from "./client";
import { parseGrades, parsePsContext } from "./gradeParser";
import type { PsContext } from "./gradeParser";
import type { Grade } from "./types";

export type { PsContext };

const GRADES_URL =
  "/psc/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_GRADE.GBL";

export interface GradesFetchResult {
  grades: Grade[];
  academicYear: string;
  psContext: PsContext | null;
}

export interface YearOption {
  strm: string;
  label: string;
}

export function strmToLabel(strm: string): string {
  const y = parseInt(strm, 10);
  return isNaN(y) ? strm : `${y}-${y + 1}`;
}

function buildGradeUrl(ctx: PsContext, strm: string): string {
  return (
    GRADES_URL +
    `?ACAD_CAREER=${encodeURIComponent(ctx.acadCareer)}` +
    `&EMPLID=${encodeURIComponent(ctx.emplid)}` +
    `&INSTITUTION=${encodeURIComponent(ctx.institution)}` +
    `&STRM=${encodeURIComponent(strm)}` +
    `&PAGE=SSR_SSENRL_GRADE`
  );
}

function extractResult(html: string): GradesFetchResult {
  const psContext = parsePsContext(html);
  const yearMatch = html.match(/20\d\d[-–]20\d\d/);
  const academicYear =
    yearMatch?.[0] ??
    (psContext ? strmToLabel(psContext.currentStrm) : "");
  const grades = parseGrades(html);
  return { grades, academicYear, psContext };
}

export async function fetchGrades(cookies: string): Promise<GradesFetchResult> {
  const res = await curlGet(GRADES_URL, cookies);
  if (!res.ok) throw new Error(`USV a răspuns cu status ${res.status}`);
  if (isUsvLoginPage(res.body)) throw new Error("SESSION_EXPIRED");
  return extractResult(res.body);
}

export async function fetchGradesForStrm(
  cookies: string,
  strm: string
): Promise<GradesFetchResult> {
  // Get current page first to extract psContext (EMPLID, ACAD_CAREER, etc.)
  const ctxRes = await curlGet(GRADES_URL, cookies);
  if (!ctxRes.ok) throw new Error(`USV a răspuns cu status ${ctxRes.status}`);
  if (isUsvLoginPage(ctxRes.body)) throw new Error("SESSION_EXPIRED");

  const ctx = parsePsContext(ctxRes.body);
  if (!ctx) throw new Error("Nu s-a putut determina contextul PeopleSoft");

  // Short-circuit: already on this strm
  if (ctx.currentStrm === strm) return extractResult(ctxRes.body);

  const url = buildGradeUrl(ctx, strm);
  const res = await curlGet(url, cookies);
  if (!res.ok) throw new Error(`USV a răspuns cu status ${res.status}`);

  const result = extractResult(res.body);

  // PeopleSoft may redirect to a different strm — detect mismatch
  if (result.psContext && result.psContext.currentStrm !== strm) {
    return { grades: [], academicYear: strmToLabel(strm), psContext: result.psContext };
  }

  return result;
}

export async function discoverYears(cookies: string): Promise<YearOption[]> {
  const base = await fetchGrades(cookies);
  if (!base.psContext) return [];

  const ctx = base.psContext;
  const current = parseInt(ctx.currentStrm, 10);
  if (isNaN(current)) return [];

  const years: YearOption[] = [{ strm: ctx.currentStrm, label: strmToLabel(ctx.currentStrm) }];
  const candidates = Array.from({ length: 7 }, (_, i) => current - 1 - i);

  // Fire in batches of 3 to avoid overwhelming a single PeopleSoft session
  for (let i = 0; i < candidates.length; i += 3) {
    const chunk = candidates.slice(i, i + 3);
    const results = await Promise.allSettled(
      chunk.map(async (s) => {
        const res = await curlGet(buildGradeUrl(ctx, String(s)), cookies);
        return { s, res };
      })
    );

    let consecutiveEmpty = 0;
    for (const r of results) {
      if (r.status === "rejected") { consecutiveEmpty++; continue; }
      const { s, res } = r.value;
      if (!res.ok) { consecutiveEmpty++; if (consecutiveEmpty >= 2) return years; continue; }
      const result = extractResult(res.body);
      const returnedStrm = result.psContext?.currentStrm;
      if (returnedStrm && returnedStrm !== String(s)) {
        consecutiveEmpty++;
      } else if (result.grades.length > 0) {
        consecutiveEmpty = 0;
        years.push({ strm: String(s), label: strmToLabel(String(s)) });
      } else {
        consecutiveEmpty++;
      }
      if (consecutiveEmpty >= 2) return years;
    }
  }

  return years;
}
