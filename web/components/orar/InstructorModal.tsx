"use client";

import { useEffect, useState } from "react";
import type { Timetable } from "@/lib/orar/types";
import { PinchZoomGrid } from "./PinchZoomGrid";
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

const TITLE_RE = /\b(prof|conf|lect|asist|dr|univ|ing|dipl|sl|as|sef)\.?\s*/gi;

function stripTitles(name: string): string {
  return name.replace(TITLE_RE, "").replace(/\s+/g, " ").trim();
}


export function InstructorModal({ instructorName, facultyId, semester, onClose }: Props) {
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(todayDayIndex());
  const [viewMode, setViewMode] = useState<"day" | "week">(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "day" : "week"
  );

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
  const displayName = stripTitles(instructorName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-5xl bg-background border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
        style={{ height: "min(90vh, 700px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide leading-none mb-1">Orar profesor</p>
            <h2 className="text-base font-semibold text-foreground truncate">{displayName}</h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {timetable && timetable.classes.length > 0 && (
              <div className="flex h-8 rounded-lg border border-border bg-muted/30 p-0.5">
                <button
                  onClick={() => setViewMode("day")}
                  className={`px-3 rounded-md text-[12px] font-medium transition-colors ${
                    viewMode === "day" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Zi
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`px-3 rounded-md text-[12px] font-medium transition-colors ${
                    viewMode === "week" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Săptămână
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Închide"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <p className="text-[13px] text-muted-foreground animate-pulse">Se agreg orarul din toate grupele…</p>
              <p className="text-[11px] text-muted-foreground/50">Poate dura câteva secunde</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-2">
              <p className="text-sm font-medium text-foreground">Nu s-a putut încărca orarul</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : !timetable || timetable.classes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <p className="text-[13px] text-muted-foreground">
                Nu au fost găsite ore pentru <span className="font-medium text-foreground">{displayName}</span>.
              </p>
            </div>
          ) : viewMode === "week" ? (
            <PinchZoomGrid timetable={timetable} />
          ) : (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <MobileDayView
                classes={dayClasses}
                allClasses={timetable.classes}
                activeDay={activeDay}
                onDayChange={setActiveDay}
                activeDays={timetable.activeDays}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
