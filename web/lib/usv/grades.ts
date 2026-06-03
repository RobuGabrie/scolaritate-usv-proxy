import { curlGet } from "./client";
import { parseGrades } from "./gradeParser";
import type { Grade } from "./types";

const GRADES_URL =
  "/psc/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_GRADE.GBL";

export interface GradesFetchResult {
  grades: Grade[];
  academicYear: string;
}

export async function fetchGrades(cookies: string): Promise<GradesFetchResult> {
  const res = await curlGet(GRADES_URL, cookies);

  if (!res.ok) {
    throw new Error(`USV a răspuns cu status ${res.status}`);
  }

  const html = res.body;
  const yearMatch = html.match(/20\d\d[-–]20\d\d/);
  const academicYear = yearMatch ? yearMatch[0] : "";
  const grades = parseGrades(html);

  return { grades, academicYear };
}
