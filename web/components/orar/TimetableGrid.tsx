import { Fragment } from "react";
import type { Timetable, ClassEntry } from "@/lib/orar/types";
import { ClassBlock } from "./ClassBlock";
import { cn } from "@/lib/utils";

const DAY_NAMES: Record<number, { short: string; long: string }> = {
  1: { short: "Lun", long: "Luni" },
  2: { short: "Mar", long: "Marți" },
  3: { short: "Mie", long: "Miercuri" },
  4: { short: "Joi", long: "Joi" },
  5: { short: "Vin", long: "Vineri" },
  6: { short: "Sâm", long: "Sâmbătă" },
};

function todayDayIndex(): number {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 7 : d; // 1=Mon … 6=Sat
}

interface Props {
  timetable: Timetable;
  onInstructorClick?: (name: string) => void;
}

export function TimetableGrid({ timetable, onInstructorClick }: Props) {
  const { classes, hourSlots, activeDays } = timetable;
  const today = todayDayIndex();

  // Always show Mon–Fri; add Sat only if there are Saturday classes
  const days = activeDays.includes(6)
    ? [1, 2, 3, 4, 5, 6]
    : [1, 2, 3, 4, 5];

  if (hourSlots.length === 0) return null;

  // Deduplicate: for same day+hour+rowspan, keep unique entries
  // (same entry can't appear twice, but even/odd week entries share same slot)
  const getClasses = (day: number, hour: number): ClassEntry[] =>
    classes.filter((c) => c.day === day && c.startHour === hour);

  // Check if this hour row should be hidden because it's covered by a rowspan above
  // We track which (day, hourIdx) cells are covered
  const covered = new Set<string>();
  for (const entry of classes) {
    const startIdx = hourSlots.indexOf(entry.startHour);
    for (let i = 1; i < entry.rowspan; i++) {
      covered.add(`${entry.day}-${startIdx + i}`);
    }
  }

  return (
    <div className="p-4 sm:p-6 overflow-x-auto">
      <div
        className="min-w-[600px]"
        style={{
          display: "grid",
          gridTemplateColumns: `2.5rem repeat(${days.length}, minmax(0, 1fr))`,
          gridTemplateRows: `2rem repeat(${hourSlots.length}, 4rem)`,
          gap: "2px",
        }}
      >
        {/* Header row: empty corner + day names */}
        <div /> {/* corner */}
        {days.map((day) => (
          <div
            key={day}
            className={cn(
              "flex items-center justify-center text-[12px] font-medium rounded-md",
              day === today
                ? "text-primary bg-primary/5"
                : "text-muted-foreground",
            )}
          >
            <span className="hidden lg:inline">{DAY_NAMES[day]?.long}</span>
            <span className="lg:hidden">{DAY_NAMES[day]?.short}</span>
          </div>
        ))}

        {/* Hour rows */}
        {hourSlots.map((hour, hIdx) => (
          <Fragment key={hIdx}>
            {/* Hour label */}
            <div
              className="flex items-start justify-end pr-2 pt-1"
              style={{ gridRow: hIdx + 2, gridColumn: 1 }}
            >
              <span className="text-[11px] text-muted-foreground/60 tabular-nums leading-none">
                {String(hour).padStart(2, "0")}
              </span>
            </div>

            {/* Day cells for this hour */}
            {days.map((day) => {
              const key = `${day}-${hIdx}`;
              if (covered.has(key)) return null;

              const dayClasses = getClasses(day, hour);

              // Find the max rowspan for this cell (determines grid span)
              const maxRowspan = dayClasses.length > 0
                ? Math.max(...dayClasses.map((c) => c.rowspan))
                : 1;

              return (
                <div
                  key={`cell-${day}-${hour}`}
                  style={{
                    gridRow: `${hIdx + 2} / span ${maxRowspan}`,
                    gridColumn: days.indexOf(day) + 2,
                  }}
                  className={cn(
                    "rounded-lg overflow-hidden",
                    dayClasses.length === 0
                      ? "bg-muted/20 border border-transparent"
                      : "flex flex-col gap-0.5",
                  )}
                >
                  {dayClasses.length === 0 ? null : dayClasses.length === 1 ? (
                    <ClassBlock entry={dayClasses[0]} onInstructorClick={onInstructorClick} />
                  ) : (
                    // Multiple entries (even/odd): stack them
                    dayClasses.map((entry, i) => (
                      <div key={i} className="flex-1 min-h-0">
                        <ClassBlock entry={entry} compact onInstructorClick={onInstructorClick} />
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
