"use client";

import { useEffect, useState, useCallback } from "react";
import type { Timetable, SavedGroup, OrarGroup } from "@/lib/orar/types";
import { semesterFromDate, isSameAcademicYear } from "@/lib/orar/academicYear";
import { TimetableGrid } from "./TimetableGrid";
import { MobileDayView } from "./MobileDayView";
import { GroupPicker } from "./GroupPicker";
import { InstructorModal } from "./InstructorModal";

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

  const dayClasses = timetable?.classes.filter((c) => c.day === activeDay) ?? [];

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-14 sm:pt-8 pb-4 border-b border-border space-y-4 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-foreground shrink-0">Orar</h1>
            {savedGroup && (
              <span className="text-[13px] text-muted-foreground truncate hidden sm:block">
                {savedGroup.groupLabel}
              </span>
            )}
          </div>
          {savedGroup && (
            <button
              onClick={() => setShowPicker(true)}
              className="shrink-0 h-9 px-4 rounded-3xl border border-border text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-[0.97]"
            >
              Schimbă grupa
            </button>
          )}
        </div>

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
            {/* Desktop grid */}
            <div className="hidden md:block flex-1 overflow-y-auto">
              <TimetableGrid timetable={timetable} onInstructorClick={setSelectedInstructor} />
            </div>

            {/* Mobile day view */}
            <div className="md:hidden flex-1 flex flex-col overflow-hidden">
              <MobileDayView
                classes={dayClasses}
                allClasses={timetable.classes}
                activeDay={activeDay}
                onDayChange={setActiveDay}
                activeDays={timetable.activeDays}
                onInstructorClick={setSelectedInstructor}
              />
            </div>
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
