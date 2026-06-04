"use client";

import { useState, useEffect } from "react";
import type { Grade } from "@/lib/usv/types";
import type { YearOption } from "@/lib/usv/grades";
import { GradeTable } from "./GradeTable";
import { calcStats, simulateWithHypotheticals } from "@/lib/usv/gradeCalculator";

interface Props {
  grades: Grade[];
  academicYear: string;
  currentStrm: string;
}

type Tab = "toate" | "sem1" | "sem2" | "restante" | "calculator";

const FILTER_TABS: { id: Exclude<Tab, "calculator">; short: string }[] = [
  { id: "toate", short: "Toate" },
  { id: "sem1", short: "Sem. I" },
  { id: "sem2", short: "Sem. II" },
  { id: "restante", short: "Restanțe" },
];

function parseN(s: string) {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}



export function GradesView({ grades: initialGrades, academicYear: initialYear, currentStrm }: Props) {
  const [tab, setTab] = useState<Tab>("toate");
  const [calcTarget, setCalcTarget] = useState(7);
  const [hypotheticals, setHypotheticals] = useState<Record<string, number>>({});

  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [academicYear, setAcademicYear] = useState(initialYear);
  const [selectedStrm, setSelectedStrm] = useState(currentStrm);

  const [years, setYears] = useState<YearOption[]>(
    currentStrm ? [{ strm: currentStrm, label: initialYear || currentStrm }] : []
  );
  const [yearsLoading, setYearsLoading] = useState(false);
  const [yearSwitchLoading, setYearSwitchLoading] = useState(false);
  const [yearError, setYearError] = useState<string | null>(null);

  // Discover all available years in the background after mount
  useEffect(() => {
    if (!currentStrm) return;
    setYearsLoading(true);
    fetch("/api/usv/note/years")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.years) && data.years.length > 0) {
          setYears(data.years);
        }
      })
      .catch(() => {/* silently ignore — selector stays with current year only */})
      .finally(() => setYearsLoading(false));
  }, [currentStrm]);

  async function loadGrades(strm: string) {
    setYearSwitchLoading(true);
    setYearError(null);
    try {
      const res = await fetch(`/api/usv/note?strm=${encodeURIComponent(strm)}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGrades(data.grades ?? []);
      setAcademicYear(data.academicYear ?? "");
      setSelectedStrm(strm);
      setTab("toate");
      setHypotheticals({});
    } catch (err) {
      setYearError(err instanceof Error ? err.message : "Eroare necunoscută");
    } finally {
      setYearSwitchLoading(false);
    }
  }

  async function handleYearChange(strm: string) {
    if (strm === selectedStrm) return;
    await loadGrades(strm);
  }

  const filteredGrades = grades.filter((g) => {
    if (tab === "sem1") return g.filterCategory === "SEM 1";
    if (tab === "sem2") return g.filterCategory === "SEM 2";
    if (tab === "restante") {
      const n = parseN(g.notaFinala);
      return g.filterCategory === "OTHER" || (n !== null && n < 5);
    }
    return true;
  });

  const stats = calcStats(filteredGrades);

  const crediteAsteptate = filteredGrades.reduce(
    (acc, g) => acc + (parseN(g.credite) ?? 0),
    0
  );

  const simResult = tab === "calculator"
    ? simulateWithHypotheticals(grades, hypotheticals, calcTarget)
    : null;

  const countFor = (t: Exclude<Tab, "calculator">) =>
    t === "toate"
      ? grades.length
      : grades.filter((g) => {
          if (t === "sem1") return g.filterCategory === "SEM 1";
          if (t === "sem2") return g.filterCategory === "SEM 2";
          const n = parseN(g.notaFinala);
          return g.filterCategory === "OTHER" || (n !== null && n < 5);
        }).length;

  const currentMedia = calcStats(grades).mediaEcts;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-4 sm:px-6 pt-14 sm:pt-6 pb-4 border-b border-border">

        {/* Title + year */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Note</h1>
          {years.length > 1 ? (
            <select
              value={selectedStrm}
              onChange={(e) => handleYearChange(e.target.value)}
              disabled={yearSwitchLoading}
              className="h-7 text-[13px] text-muted-foreground bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              {years.map((y) => (
                <option key={y.strm} value={y.strm}>{y.label}</option>
              ))}
            </select>
          ) : (
            <span className={`text-[13px] text-muted-foreground ${yearsLoading || yearSwitchLoading ? "animate-pulse" : ""}`}>
              {academicYear}
            </span>
          )}
          <button
            onClick={() => loadGrades(selectedStrm)}
            disabled={yearSwitchLoading}
            title="Reîncarcă notele"
            className="ml-1 h-6 w-6 flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-30 transition-colors"
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={yearSwitchLoading ? "animate-spin" : ""}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
        </div>

        {yearError && <p className="text-[13px] text-destructive mb-3">{yearError}</p>}

        {/* Stats */}
        {grades.length > 0 && tab !== "calculator" && (
          <div className="flex items-end gap-6 mb-4">
            {stats.mediaEcts > 0 && (
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Media ECTS</p>
                <p className="text-3xl font-bold tabular-nums leading-none text-foreground">
                  {stats.mediaEcts.toFixed(2)}
                </p>
              </div>
            )}
            {(stats.creditePromovate > 0 || crediteAsteptate > 0) && (
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Credite</p>
                <p className="text-xl font-bold tabular-nums leading-none text-foreground">
                  {stats.creditePromovate}
                  <span className="text-muted-foreground font-normal text-sm"> / {crediteAsteptate}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Filter row */}
        <div className="flex items-center gap-2">
          <select
            value={tab === "calculator" ? "toate" : tab}
            onChange={(e) => setTab(e.target.value as Tab)}
            className="h-7 text-[13px] text-muted-foreground bg-transparent border-none cursor-pointer focus:outline-none"
          >
            {FILTER_TABS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.short} ({countFor(t.id)})
              </option>
            ))}
          </select>

          {/* Calculator tab — icon only, pushed to the right */}
          <button
            onClick={() => setTab(tab === "calculator" ? "toate" : "calculator")}
            title="Calculator medie"
            className={`ml-auto h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
              tab === "calculator"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="8" y1="10" x2="8" y2="10" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="10" x2="12" y2="10" strokeWidth="3" strokeLinecap="round" />
              <line x1="16" y1="10" x2="16" y2="10" strokeWidth="3" strokeLinecap="round" />
              <line x1="8" y1="14" x2="8" y2="14" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="14" x2="12" y2="14" strokeWidth="3" strokeLinecap="round" />
              <line x1="16" y1="14" x2="16" y2="14" strokeWidth="3" strokeLinecap="round" />
              <line x1="8" y1="18" x2="8" y2="18" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" strokeLinecap="round" />
              <line x1="16" y1="18" x2="16" y2="18" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {yearSwitchLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-muted-foreground animate-pulse">Se încarcă notele…</p>
          </div>

        ) : tab === "calculator" ? (
          <div className="px-4 sm:px-6 py-5 max-w-lg space-y-5">

            {/* Target slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] text-muted-foreground">Media țintă</label>
                <div className="flex items-center gap-3">
                  {currentMedia > 0 && (
                    <span className="text-[13px] text-muted-foreground">
                      Curentă: <span className="font-semibold text-foreground">{currentMedia.toFixed(2)}</span>
                    </span>
                  )}
                  <span className="text-2xl font-bold tabular-nums leading-none text-foreground">
                    {calcTarget.toFixed(1)}
                  </span>
                </div>
              </div>
              <input
                type="range" min="5" max="10" step="0.1"
                value={calcTarget}
                onChange={(e) => setCalcTarget(parseFloat(e.target.value))}
                className="w-full h-1.5 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground/40 select-none">
                <span>5.0</span><span>6.0</span><span>7.0</span><span>8.0</span><span>9.0</span><span>10.0</span>
              </div>
            </div>

            {/* Per-subject selectors */}
            {simResult && simResult.pendingSubjects.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    Materii fără notă
                  </p>
                  {Object.keys(hypotheticals).length > 0 && (
                    <button
                      onClick={() => setHypotheticals({})}
                      className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    >
                      Resetează tot
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {simResult.pendingSubjects.map((s) => {
                    const hasHypo = s.hypothetical !== null;
                    const min = s.notaNecesara;
                    const impossible = !simResult.possible && !hasHypo;
                    return (
                      <div
                        key={s.titlu}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          hasHypo ? "border-primary/30 bg-primary/5"
                            : impossible ? "border-destructive/20 bg-destructive/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <span className="flex-1 text-[12.5px] text-foreground truncate min-w-0 leading-snug">{s.titlu}</span>
                        <span className="text-[11px] text-muted-foreground/50 shrink-0 tabular-nums">{s.credite}cr</span>
                        <select
                          value={s.hypothetical ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "") {
                              setHypotheticals((prev) => { const next = { ...prev }; delete next[s.titlu]; return next; });
                            } else {
                              setHypotheticals((prev) => ({ ...prev, [s.titlu]: Number(v) }));
                            }
                          }}
                          className="h-7 text-[12px] bg-background border border-border rounded-lg px-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0"
                        >
                          <option value="">—</option>
                          {[5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <span className={`shrink-0 w-14 text-right text-[13px] font-bold tabular-nums ${
                          impossible ? "text-destructive"
                            : min !== null || hasHypo ? "text-foreground"
                            : "text-muted-foreground/30"
                        }`}>
                          {hasHypo ? s.hypothetical : min !== null ? `≥${min.toFixed(1)}` : "×"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {simResult && (
              <p className={`text-[13px] font-medium ${simResult.possible ? "text-foreground" : "text-destructive"}`}>
                {simResult.message}
              </p>
            )}

            {grades.length > 0 && simResult?.pendingSubjects.length === 0 && (
              <p className="text-[13px] text-muted-foreground">
                Nu există materii fără notă în acest an.
              </p>
            )}
          </div>

        ) : grades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
            <p className="text-[13px] text-muted-foreground">Nu s-au putut încărca notele sau nu există note înregistrate.</p>
            <p className="text-[13px] text-muted-foreground/50 mt-1.5">Verifică că ești conectat la rețeaua USV (VPN sau campus).</p>
          </div>

        ) : filteredGrades.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-center px-6">
            <p className="text-[13px] text-muted-foreground">Nicio materie în această categorie.</p>
          </div>

        ) : (
          <GradeTable grades={filteredGrades} />
        )}
      </div>

    </div>
  );
}
