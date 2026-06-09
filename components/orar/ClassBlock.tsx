import { memo } from "react";
import type { ClassEntry, ClassType, WeekPattern } from "@/lib/orar/types";
import { cn } from "@/lib/utils";

export const TYPE_TOKENS: Record<ClassType, { bg: string; text: string; border: string; label: string; dot: string }> = {
  curs:      { bg: "bg-primary/10",  text: "text-primary",          border: "border-primary/20",  label: "Curs",      dot: "bg-primary" },
  laborator: { bg: "bg-chart-2/10",  text: "text-chart-2",          border: "border-chart-2/20",  label: "Laborator", dot: "bg-chart-2" },
  seminar:   { bg: "bg-chart-3/10",  text: "text-chart-3",          border: "border-chart-3/20",  label: "Seminar",   dot: "bg-chart-3" },
  other:     { bg: "bg-muted/40",    text: "text-muted-foreground", border: "border-border",       label: "Altul",     dot: "bg-border"  },
};

function weekLabel(pattern: WeekPattern): string | null {
  if (pattern.kind === "all") return null;
  if (pattern.kind === "even") return "Săpt. pare";
  if (pattern.kind === "odd") return "Săpt. impare";
  return `Săpt. ${pattern.weeks.slice(0, 3).join(",")}`;
}

interface Props {
  entry: ClassEntry;
  compact?: boolean;
  onInstructorClick?: (name: string) => void;
}

export const ClassBlock = memo(function ClassBlock({ entry, compact, onInstructorClick }: Props) {
  const t = TYPE_TOKENS[entry.type];
  const name = entry.fullName || entry.shortName;
  const endHour = entry.startHour + entry.rowspan;
  const timeLabel = `${String(entry.startHour).padStart(2, "0")}:00 – ${String(endHour).padStart(2, "0")}:00`;
  const instructor = entry.fullInstructor || entry.instructor;
  const room = entry.fullRoom || entry.room;
  const week = weekLabel(entry.weekPattern);

  if (compact) {
    return (
      <div className={cn("h-full rounded-md border flex flex-col gap-0.5 overflow-hidden p-1.5", t.bg, t.border)}>
        <span className="text-[9px] text-muted-foreground tabular-nums leading-none">{timeLabel}</span>
        <p className="text-[10px] font-semibold leading-tight line-clamp-2 text-foreground">{name}</p>
        {instructor && (
          onInstructorClick ? (
            <button
              onClick={(e) => { e.stopPropagation(); onInstructorClick(instructor); }}
              className="mt-auto self-start flex items-center gap-0.5 max-w-full text-left group/btn"
            >
              <span className="text-[9px] text-muted-foreground underline underline-offset-2 decoration-muted-foreground/40 group-hover/btn:decoration-muted-foreground truncate leading-none transition-colors">{instructor}</span>
              <svg className="shrink-0 text-muted-foreground/40" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ) : (
            <p className="text-[9px] text-muted-foreground truncate leading-none mt-auto">{instructor}</p>
          )
        )}
      </div>
    );
  }

  return (
    <div className={cn("h-full rounded-lg border flex flex-col gap-1 overflow-hidden p-2", t.bg, t.border)}>
      <span className="text-[11px] font-medium text-muted-foreground tabular-nums leading-none">{timeLabel}</span>

      {/* Subject name */}
      <p className="text-[13px] font-bold leading-tight line-clamp-2 text-foreground">{name}</p>

      {/* Instructor + room */}
      <div className="mt-auto flex flex-col gap-1">
        {instructor && (
          onInstructorClick ? (
            <button
              onClick={(e) => { e.stopPropagation(); onInstructorClick(instructor); }}
              className="self-start flex items-center gap-0.5 max-w-full text-left group/btn"
            >
              <span className="text-[11px] text-muted-foreground underline underline-offset-2 decoration-muted-foreground/40 group-hover/btn:decoration-muted-foreground truncate leading-none transition-colors">{instructor}</span>
              <svg className="shrink-0 text-muted-foreground/40" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ) : (
            <p className="text-[11px] text-muted-foreground truncate leading-none">{instructor}</p>
          )
        )}
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          {room && (
            <p className="text-[11px] text-muted-foreground/70 truncate leading-none">{room}</p>
          )}
          {entry.groupCode && (
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase leading-none">{entry.groupCode}</span>
          )}
          {week && (
            <span className="text-[10px] font-medium text-muted-foreground/60 leading-none">{week}</span>
          )}
        </div>
      </div>
    </div>
  );
});
