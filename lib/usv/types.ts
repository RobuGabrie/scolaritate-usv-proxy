export interface Grade {
  titlu: string;
  sesiune: string;
  filterCategory: "SEM 1" | "SEM 2" | "OTHER";
  pondere: string;
  notaCurs: string;
  notaSeminar: string;
  notaFinala: string;
  credite: string;
  puncte: string;
  isEstimated?: boolean;
  isBackPaper?: boolean;
  originalIndex?: number;
}

export interface GradesResponse {
  grades: Grade[];
  academicYear: string;
  userId: string;
}

export interface SessionData {
  cookies: string;
  userId: string;
  displayName: string;
  expiresAt: number;
}
