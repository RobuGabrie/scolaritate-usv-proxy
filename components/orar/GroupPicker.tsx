"use client";

import { useEffect, useState, useMemo } from "react";
import type { OrarGroup } from "@/lib/orar/types";

interface Props {
  facultyId: number;
  studyYear: number | null;
  defaultSemester: number;
  onSelect: (group: OrarGroup) => void;
  onClose?: () => void;
}

export function GroupPicker({ facultyId, studyYear, defaultSemester, onSelect, onClose }: Props) {
  const [groups, setGroups] = useState<OrarGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<number | null>(studyYear);

  useEffect(() => {
    fetch(`/api/orar/groups?facultyId=${facultyId}&sem=${defaultSemester}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setGroups(data.groups ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [facultyId, defaultSemester]);

  const years = useMemo(
    () => [...new Set(groups.map((g) => g.year))].sort((a, b) => a - b),
    [groups]
  );

  const filtered = useMemo(
    () => groups.filter((g) => {
      if (yearFilter !== null && g.year !== yearFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return g.groupCode.includes(s) || g.program.toLowerCase().includes(s);
    }),
    [groups, yearFilter, search]
  );

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Selectează grupa</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Alege grupa ta pentru a vedea orarul
          </p>
        </div>
        {onClose && (
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
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Caută grupă… (ex: 3133a)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="w-full h-9 pl-8 pr-3 text-[13px] bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/40 transition-colors"
        />
      </div>

      {/* Year filter chips */}
      {years.length > 1 && (
        <div className="flex gap-1 mb-4 flex-wrap">
          <button
            onClick={() => setYearFilter(null)}
            className={`text-[12px] px-2.5 py-1 rounded-xl transition-colors ${yearFilter === null ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
          >
            Toți
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYearFilter(yearFilter === y ? null : y)}
              className={`text-[12px] px-2.5 py-1 rounded-xl transition-colors ${yearFilter === y ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
            >
              An {y}
            </button>
          ))}
        </div>
      )}

      {/* Group list */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card divide-y divide-border">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-4 w-16 rounded bg-muted animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </div>
          ))
        ) : error ? (
          <div className="flex items-center justify-center py-8 px-4">
            <p className="text-[13px] text-muted-foreground text-center">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-8 px-4">
            <p className="text-[13px] text-muted-foreground">Nicio grupă găsită.</p>
          </div>
        ) : (
          filtered.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelect(group)}
              className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
            >
              <span className="text-[13px] font-semibold text-foreground w-16 shrink-0">
                {group.groupCode.toUpperCase()}
              </span>
              <span className="text-[13px] text-muted-foreground">
                {group.program} · An {group.year}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
