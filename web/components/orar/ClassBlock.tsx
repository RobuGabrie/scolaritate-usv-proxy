import type { ClassEntry, ClassType, WeekPattern } from "@/lib/orar/types";
import { cn } from "@/lib/utils";

const TYPE_TOKENS: Record<ClassType, { bg: string; text: string; border: string; label: string }> = {
  curs:      { bg: "bg-primary/10",  text: "text-primary",          border: "border-primary/20",  label: "Curs" },
  laborator: { bg: "bg-chart-2/10",  text: "text-chart-2",          border: "border-chart-2/20",  label: "Laborator" },
  seminar:   { bg: "bg-chart-3/10",  text: "text-chart-3",          border: "border-chart-3/20",  label: "Seminar" },
  other:     { bg: "bg-muted/40",    text: "text-muted-foreground", border: "border-border",       label: "Altul" },
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

export function ClassBlock({ entry, compact, onInstructorClick }: Props) {
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
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] text-muted-foreground tabular-nums leading-none">{timeLabel}</span>
          <span className={cn("text-[9px] font-semibold px-1 py-0.5 rounded-sm leading-none shrink-0", t.text)}>{t.label}</span>
        </div>
        <p className="text-[10px] font-semibold leading-tight line-clamp-2 text-foreground">{name}</p>
        {instructor && (
          onInstructorClick ? (
            <button
              onClick={(e) => { e.stopPropagation(); onInstructorClick(instructor); }}
              className="flex items-center gap-0.5 mt-auto text-left group/btn"
            >
              <svg className="shrink-0 text-primary/60 group-hover/btn:text-primary transition-colors" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <span className="text-[9px] text-primary/70 group-hover/btn:text-primary truncate leading-none transition-colors">{instructor}</span>
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
      {/* Time + type row */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-medium text-muted-foreground tabular-nums leading-none">{timeLabel}</span>
        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-sm leading-none shrink-0 border", t.bg, t.text, t.border)}>
          {t.label}
        </span>
      </div>

      {/* Subject name */}
      <p className="text-[13px] font-bold leading-tight line-clamp-2 text-foreground">{name}</p>

      {/* Instructor + room */}
      <div className="mt-auto flex flex-col gap-0.5">
        {instructor && (
          onInstructorClick ? (
            <button
              onClick={(e) => { e.stopPropagation(); onInstructorClick(instructor); }}
              className="flex items-center gap-1 text-left group/btn w-full"
              title="Vezi orarul profesorului"
            >
              <svg className="shrink-0 text-primary/60 group-hover/btn:text-primary transition-colors" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              <span className="text-[11px] text-primary/80 group-hover/btn:text-primary group-hover/btn:underline truncate leading-none font-medium transition-colors">{instructor}</span>
            </button>
          ) : (
            <p className="text-[11px] text-muted-foreground truncate leading-none">{instructor}</p>
          )
        )}
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
  );
}
