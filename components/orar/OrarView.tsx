"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { Timetable, SavedGroup, OrarGroup } from "@/lib/orar/types";
import { semesterFromDate, isSameAcademicYear } from "@/lib/orar/academicYear";
import { PinchZoomGrid } from "./PinchZoomGrid";
import { MobileDayView } from "./MobileDayView";
import { GroupPicker } from "./GroupPicker";
import { InstructorModal } from "./InstructorModal";
import { TYPE_TOKENS } from "./ClassBlock";

const LEGEND = (
  ["curs", "laborator", "seminar"] as const
).map((type) => ({ type, ...TYPE_TOKENS[type] }));

interface Props {
  facultyId: number;
  studyYear: number | null;
}

const STORAGE_KEY = "orar_group";

function todayDayIndex(): number {
  const d = new Date().getDay();
  return d === 0 || d === 6 ? 1 : d; // default to Mon on weekends
}

function readSavedGroup(): SavedGroup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedGroup;
    if (!isSameAcademicYear(parsed.savedAt)) {
      // New academic year — keep groupCode but clear cached IDs
      return { ...parsed, semIds: {}, savedAt: Date.now() };
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveSavedGroup(group: SavedGroup) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
}

export function OrarView({ facultyId, studyYear }: Props) {
  const [savedGroup, setSavedGroup] = useState<SavedGroup | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const semester = semesterFromDate();
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number>(todayDayIndex());
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"day" | "week">("week");

  const loadTimetable = useCallback(async (groupId: string, sem: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orar/timetable?id=${groupId}&sem=${sem}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTimetable(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare necunoscută");
    } finally {
      setLoading(false);
    }
  }, []);

  // Resolve group ID for a given semester (use cache or fetch groups)
  const resolveAndLoad = useCallback(async (group: SavedGroup, sem: number) => {
    const cached = group.semIds[String(sem)];
    if (cached) {
      await loadTimetable(cached, sem);
      return;
    }
    // Need to fetch groups to resolve ID for this semester
    setLoading(true);
    try {
      const res = await fetch(`/api/orar/groups?facultyId=${group.facultyId}&sem=${sem}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const groups: OrarGroup[] = data.groups ?? [];
      const match = groups.find((g) => g.groupCode === group.groupCode);
      if (!match) throw new Error(`Grupa ${group.groupCode} nu a fost găsită pentru semestrul ${sem}`);

      const updated: SavedGroup = {
        ...group,
        semIds: { ...group.semIds, [String(sem)]: match.id },
      };
      saveSavedGroup(updated);
      setSavedGroup(updated);
      await loadTimetable(match.id, sem);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare necunoscută");
      setLoading(false);
    }
  }, [loadTimetable]);

  // On mount: read saved group and load timetable
  useEffect(() => {
    const saved = readSavedGroup();
    if (saved) {
      setSavedGroup(saved);
      resolveAndLoad(saved, semester);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGroupSelect(group: OrarGroup) {
    const saved: SavedGroup = {
      groupCode: group.groupCode,
      groupLabel: `${group.program} · An ${group.year} · ${group.groupCode.toUpperCase()}`,
      facultyId: group.facultyId,
      semIds: { [String(semester)]: group.id },
      savedAt: Date.now(),
    };
    saveSavedGroup(saved);
    setSavedGroup(saved);
    setShowPicker(false);
    await loadTimetable(group.id, semester);
  }

  const dayClasses = useMemo(
    () => (timetable?.classes.filter((c) => c.day === activeDay) ?? [])
      .sort((a, b) => a.startHour - b.startHour),
    [timetable, activeDay]
  );

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-14 sm:pt-6 pb-4 border-b border-border shrink-0">
        <div className={`flex items-center gap-2 ${timetable && timetable.classes.length > 0 ? "mb-4" : ""}`}>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Orar</h1>
          {savedGroup && (
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors min-w-0 group"
            >
              <span className="truncate">{savedGroup.groupCode}</span>
              <svg className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          )}
        </div>

        {timetable && timetable.classes.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex h-8 rounded-lg border border-border bg-muted/30 p-0.5 shrink-0">
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

            <div className="flex items-center gap-3">
                {LEGEND.map(({ type, dot, label }) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${dot}`} />
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!savedGroup && !showPicker ? (
          // First visit — inline picker
          <div className="flex-1 overflow-y-auto">
            <GroupPicker
              facultyId={facultyId}
              studyYear={studyYear}
              defaultSemester={semester}
              onSelect={handleGroupSelect}
            />
          </div>
        ) : showPicker ? (
          // Overlay picker
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPicker(false); }}
          >
            <div className="w-full max-w-lg bg-background border border-border rounded-2xl m-4 shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
              <GroupPicker
                facultyId={facultyId}
                studyYear={studyYear}
                defaultSemester={semester}
                onSelect={handleGroupSelect}
                onClose={() => setShowPicker(false)}
              />
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px] text-muted-foreground animate-pulse">Se încarcă orarul…</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
            <p className="text-sm font-medium text-foreground">Eroare la încărcarea orarului</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <button
              onClick={() => savedGroup && resolveAndLoad(savedGroup, semester)}
              className="mt-2 text-[13px] text-primary hover:underline"
            >
              Încearcă din nou
            </button>
          </div>
        ) : !timetable || timetable.classes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <p className="text-[13px] text-muted-foreground">Nu există ore înregistrate pentru această grupă și semestru.</p>
            <p className="text-[13px] text-muted-foreground/50 mt-1.5">Orarul poate să nu fi fost publicat încă.</p>
          </div>
        ) : (
          <>
            {viewMode === "week" ? (
              <PinchZoomGrid timetable={timetable} onInstructorClick={setSelectedInstructor} />
            ) : (
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <MobileDayView
                  classes={dayClasses}
                  allClasses={timetable.classes}
                  activeDay={activeDay}
                  onDayChange={setActiveDay}
                  activeDays={timetable.activeDays}
                  onInstructorClick={setSelectedInstructor}
                />
              </div>
            )}
          </>
        )}
      </div>

      {selectedInstructor && savedGroup && (
        <InstructorModal
          instructorName={selectedInstructor}
          facultyId={savedGroup.facultyId}
          semester={semester}
          onClose={() => setSelectedInstructor(null)}
        />
      )}
    </>
  );
}
