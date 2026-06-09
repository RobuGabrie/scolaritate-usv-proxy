import type { ClassEntry } from "@/lib/orar/types";
import { ClassBlock } from "./ClassBlock";

interface Props {
  classes: ClassEntry[];
  allClasses: ClassEntry[];
  activeDay: number;
  onDayChange: (day: number) => void;
  activeDays: number[];
  onInstructorClick?: (name: string) => void;
}

const DAY_NAMES: Record<number, string> = {
  1: "Lun", 2: "Mar", 3: "Mie", 4: "Joi", 5: "Vin", 6: "Sâm",
};

const ALL_DAYS = [1, 2, 3, 4, 5, 6];

function todayDayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
}

export function MobileDayView({ classes, allClasses, activeDay, onDayChange, activeDays, onInstructorClick }: Props) {
  const today = todayDayIndex();
  const days = activeDays.includes(6) ? ALL_DAYS : ALL_DAYS.slice(0, 5);

  return (
    <div className="flex flex-col">
      {/* Day tabs */}
      <div className="flex gap-0.5 px-4 py-3 border-b border-border overflow-x-auto">
        {days.map((day) => {
          const hasClasses = activeDays.includes(day);
          const isActive = activeDay === day;
          const isToday = day === today;
          return (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={[
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-colors shrink-0",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              ].join(" ")}
            >
              <span>{DAY_NAMES[day]}</span>
              <span className={[
                "w-1 h-1 rounded-full",
                hasClasses
                  ? isToday ? "bg-primary" : "bg-muted-foreground/40"
                  : "bg-transparent",
              ].join(" ")} />
            </button>
          );
        })}
      </div>

      {/* Classes for active day */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[13px] text-muted-foreground">Nicio oră în această zi.</p>
          </div>
        ) : (
          classes.map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 shrink-0 pt-2 text-right">
                <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                  {String(entry.startHour).padStart(2, "0")}:00
                </span>
              </div>
              <div className="flex-1 min-h-0" style={{ height: `${entry.rowspan * 3.5}rem` }}>
                <ClassBlock entry={entry} onInstructorClick={onInstructorClick} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
