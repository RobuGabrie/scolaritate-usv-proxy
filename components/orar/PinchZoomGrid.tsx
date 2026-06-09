import type { Timetable } from "@/lib/orar/types";
import { TimetableGrid } from "./TimetableGrid";

interface Props {
  timetable: Timetable;
  onInstructorClick?: (name: string) => void;
}

export function PinchZoomGrid({ timetable, onInstructorClick }: Props) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <TimetableGrid timetable={timetable} onInstructorClick={onInstructorClick} />
    </div>
  );
}
