import { curlGet, isUsvLoginPage } from "./client";
import { parsePsContext } from "./gradeParser";

const GRADES_URL =
  "/psc/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_GRADE.GBL";

export interface ProfileData {
  emplid: string | null;
  faculty: string | null;
  group: string | null;
  studyYear: string | null;
}

// CLS_LINK values look like "FIESC_N 1", "FIESC_N 2", "FIESC_N 10379OBL3"
// Faculty = part before "_", group = part between "_" and " " or end
function parseClassLinks(html: string): { faculty: string | null; group: string | null; studyYear: string | null } {
  const re = /id='CLS_LINK\$\d+'[^>]*>([^<]+)</g;
  const values: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const v = m[1].trim();
    if (v) values.push(v);
  }

  if (values.length === 0) {
    return { faculty: null, group: null, studyYear: null };
  }

  // e.g. "FIESC_N 1" → base = "FIESC_N", faculty = "FIESC", group = "N"
  const base = values[0].split(" ")[0]; // "FIESC_N"
  const underscoreIdx = base.indexOf("_");
  const faculty = underscoreIdx > 0 ? base.slice(0, underscoreIdx) : base;
  // Full class code (e.g. "FIESC_N") — physical group (e.g. "3133A") is not in PeopleSoft
  const group = base;

  // Year is encoded in entries like "FIESC_N 10379OBL3" or "FIESC_N 15895OPT3"
  // The trailing digit(s) after OBL/OPT/NR are the study year
  let studyYear: string | null = null;
  for (const v of values) {
    const yearMatch = v.match(/(?:OBL|OPT|NR)(\d+)\s*$/i);
    if (yearMatch) {
      studyYear = `Anul ${yearMatch[1]}`;
      break;
    }
  }

  return { faculty, group, studyYear };
}

export async function fetchProfile(cookies: string): Promise<ProfileData> {
  const res = await curlGet(GRADES_URL, cookies);
  if (!res.ok) throw new Error(`USV a răspuns cu status ${res.status}`);
  if (isUsvLoginPage(res.body)) throw new Error("SESSION_EXPIRED");

  const html = res.body;
  const ctx = parsePsContext(html);
  const { faculty, group, studyYear } = parseClassLinks(html);

  return {
    emplid: ctx?.emplid ?? null,
    faculty,
    group,
    studyYear,
  };
}
