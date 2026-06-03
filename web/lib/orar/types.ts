export interface OrarGroup {
  id: string;
  program: string;
  year: number;
  groupCode: string;
  facultyId: number;
}

export type ClassType = "curs" | "laborator" | "seminar" | "other";

export type WeekPattern =
  | { kind: "all" }
  | { kind: "even" }
  | { kind: "odd" }
  | { kind: "specific"; weeks: number[] };

export interface ClassEntry {
  day: number;
  startHour: number;
  rowspan: number;
  type: ClassType;
  shortName: string;
  room: string;
  instructor: string;
  fullName: string;
  fullRoom: string;
  fullInstructor: string;
  weekPattern: WeekPattern;
}

export interface Timetable {
  groupId: string;
  semester: number;
  classes: ClassEntry[];
  hourSlots: number[];
  activeDays: number[];
}

export interface Instructor {
  id: string;
  name: string;
  facultyId: number;
}

export interface SavedGroup {
  groupCode: string;
  groupLabel: string;
  facultyId: number;
  semIds: Record<string, string>;
  savedAt: number;
}
