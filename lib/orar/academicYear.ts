export function currentAcademicYearParam(): string {
  const now = new Date();
  const year = now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
  const s = (y: number) => String(y).slice(-2);
  return `${s(year)}_${s(year + 1)}`;
}

export function semesterFromDate(): 1 | 2 {
  const m = new Date().getMonth();
  return m >= 9 || m === 0 ? 1 : 2;
}

export function isSameAcademicYear(ts: number): boolean {
  const academicStart = (d: Date) =>
    d.getMonth() >= 9 ? d.getFullYear() : d.getFullYear() - 1;
  return academicStart(new Date(ts)) === academicStart(new Date());
}

export const FACULTY_IDS: Record<string, number> = { FIESC: 1 };
export const DEFAULT_FACULTY_ID = 1;
