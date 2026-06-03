"use client";

import { useEffect, useState } from "react";
import type { Timetable } from "@/lib/orar/types";
import { TimetableGrid } from "./TimetableGrid";
import { MobileDayView } from "./MobileDayView";

interface Props {
  instructorName: string;
  facultyId: number;
  semester: number;
  onClose: () => void;
}

function todayDayIndex(): number {
  const d = new Date().getDay();
  return d === 0 || d === 6 ? 1 : d;
}

export function InstructorModal({ instructorName, facultyId, semester, onClose }: Props) {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(todayDayIndex());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTimetable(null);

    fetch(
      `/api/orar/instructor-schedule?name=${encodeURIComponent(instructorName)}&facultyId=${facultyId}&sem=${semester}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setTimetable(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Eroare necunoscută");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [instructorName, facultyId, semester]);

  const dayClasses = timetable?.classes.filter((c) => c.day === activeDay) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-5xl bg-background border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[90vh] mt-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide leading-none mb-1">Orar profesor</p>
            <h2 className="text-base font-semibold text-foreground truncate">{instructorName}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 ml-4 h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Închide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-[13px] text-muted-foreground animate-pulse">Se agreg orarul din toate grupele…</p>
              <p className="text-[11px] text-muted-foreground/50">Poate dura câteva secunde</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-2">
              <p className="text-sm font-medium text-foreground">Nu s-a putut încărca orarul</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : !timetable || timetable.classes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-16 text-center px-6">
              <p className="text-[13px] text-muted-foreground">
                Nu au fost găsite ore pentru <span className="font-medium text-foreground">{instructorName}</span>.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block flex-1 overflow-y-auto">
                <TimetableGrid timetable={timetable} />
              </div>
              <div className="md:hidden flex-1 flex flex-col overflow-hidden">
                <MobileDayView
                  classes={dayClasses}
                  allClasses={timetable.classes}
                  activeDay={activeDay}
                  onDayChange={setActiveDay}
                  activeDays={timetable.activeDays}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
