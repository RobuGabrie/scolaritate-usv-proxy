"use client";

import { useState, useEffect } from "react";
import type { Grade } from "@/lib/usv/types";
import type { YearOption } from "@/lib/usv/grades";
import { GradeTable } from "./GradeTable";
import { calcStats, simulateGrades } from "@/lib/gradeCalculator";

interface Props {
  grades: Grade[];
  academicYear: string;
  currentStrm: string;
}

type Tab = "toate" | "sem1" | "sem2" | "restante";

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: "toate", label: "Toate", short: "Toate" },
  { id: "sem1", label: "Semestrul I", short: "Sem. I" },
  { id: "sem2", label: "Semestrul II", short: "Sem. II" },
  { id: "restante", label: "Restanțe", short: "Restanțe" },
];

function parseN(s: string) {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function mediaColor(m: number): string {
  if (m >= 9) return "text-chart-2";
  if (m >= 7) return "text-primary";
  if (m >= 5) return "text-chart-3";
  return "text-destructive";
}

function gradeResultColor(n: number) {
  if (n >= 9) return "text-chart-2";
  if (n >= 7) return "text-primary";
  return "text-chart-3";
}

export function GradesView({ grades: initialGrades, academicYear: initialYear, currentStrm }: Props) {
  const [tab, setTab] = useState<Tab>("toate");
  const [calcTarget, setCalcTarget] = useState(7);
  const [showCalc, setShowCalc] = useState(false);

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

  async function handleYearChange(strm: string) {
    if (strm === selectedStrm) return;
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
    } catch (err) {
      setYearError(err instanceof Error ? err.message : "Eroare necunoscută");
    } finally {
      setYearSwitchLoading(false);
    }
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

  const simResult = showCalc
    ? simulateGrades(grades, calcTarget)
    : null;

  const countFor = (t: Tab) =>
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
      <div className="px-4 sm:px-6 pt-14 sm:pt-8 pb-5 sm:pb-6 border-b border-border space-y-5">
        {/* Title row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight text-foreground shrink-0">Note</h1>

            {years.length > 1 ? (
              <>
                <select
                  value={selectedStrm}
                  onChange={(e) => handleYearChange(e.target.value)}
                  disabled={yearSwitchLoading}
                  className="h-8 text-[13px] text-muted-foreground bg-background border border-border rounded-xl px-3 cursor-pointer hover:border-foreground/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {years.map((y) => (
                    <option key={y.strm} value={y.strm}>
                      {y.label}
                    </option>
                  ))}
                </select>
                {yearSwitchLoading && (
                  <span className="text-[13px] text-muted-foreground animate-pulse">Se încarcă…</span>
                )}
              </>
            ) : (
              <span className="text-[13px] text-muted-foreground">
                {yearsLoading ? (
                  <span className="animate-pulse">{academicYear}</span>
                ) : (
                  academicYear
                )}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowCalc((v) => !v)}
            className={`shrink-0 h-9 px-4 rounded-3xl border text-[13px] font-medium transition-all active:scale-[0.97] ${
              showCalc
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            Calculator
          </button>
        </div>

        {yearError && (
          <p className="text-[13px] text-destructive">{yearError}</p>
        )}

        {/* Stats */}
        {grades.length > 0 && (
          <div className="flex items-end gap-5 sm:gap-7 flex-wrap">
            {stats.mediaEcts > 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Media ECTS</span>
                <span className="text-3xl font-bold tabular-nums leading-none text-foreground">
                  {stats.mediaEcts.toFixed(2)}
                </span>
              </div>
            )}
            {(stats.creditePromovate > 0 || crediteAsteptate > 0) && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Credite</span>
                <span className="text-xl font-bold tabular-nums leading-none text-foreground">
                  {stats.creditePromovate}
                  <span className="text-muted-foreground font-normal text-sm"> / {crediteAsteptate}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map((t) => {
            const count = countFor(t.id);
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`h-8 text-xs px-2.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {t.short}
                <span className={`text-[11px] px-1 rounded-full font-medium tabular-nums ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/60 text-muted-foreground/70"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator panel */}
      {showCalc && (
        <div className="border-b border-border bg-muted/5 px-4 sm:px-6 py-6">
          <div className="max-w-lg space-y-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Calculator medie</h3>
              <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                Nota minimă e aceeași la toate materiile — e singura valoare consistentă care garantează media dorită. Materiile cu mai multe credite sunt afișate primele.
              </p>
            </div>

            {/* Slider input */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] text-muted-foreground">Media țintă</label>
                <div className="flex items-center gap-3">
                  {currentMedia > 0 && (
                    <span className="text-[13px] text-muted-foreground">
                      Curentă:{" "}
                      <span className={`font-semibold ${mediaColor(currentMedia)}`}>
                        {currentMedia.toFixed(2)}
                      </span>
                    </span>
                  )}
                  <span className={`text-2xl font-bold tabular-nums leading-none ${mediaColor(calcTarget)}`}>
                    {calcTarget.toFixed(1)}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="0.1"
                value={calcTarget}
                onChange={(e) => setCalcTarget(parseFloat(e.target.value))}
                className="w-full h-1.5 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground/40 select-none">
                <span>5.0</span>
                <span>6.0</span>
                <span>7.0</span>
                <span>8.0</span>
                <span>9.0</span>
                <span>10.0</span>
              </div>
            </div>

            {/* Results */}
            {simResult && (
              <div className="space-y-3">
                <p className={`text-[13px] font-medium ${simResult.possible ? "text-foreground" : "text-destructive"}`}>
                  {simResult.message}
                </p>
                {simResult.remainingSubjects.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {simResult.remainingSubjects.map((s, i) => {
                      const impossible = s.notaNecesara > 10;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 gap-3"
                        >
                          <span className="text-[13px] text-muted-foreground leading-snug min-w-0 truncate">
                            {s.titlu}
                          </span>
                          <div className="shrink-0 text-right">
                            <span className={`text-lg font-bold tabular-nums ${
                              impossible ? "text-destructive" : gradeResultColor(s.notaNecesara)
                            }`}>
                              ≥{s.notaNecesara.toFixed(1)}
                            </span>
                            <p className="text-[11px] text-muted-foreground/50 mt-0.5">{s.credite} cr</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {yearSwitchLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
            <p className="text-[13px] text-muted-foreground animate-pulse">Se încarcă notele…</p>
          </div>
        ) : grades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
            <p className="text-[13px] text-muted-foreground">
              Nu s-au putut încărca notele sau nu există note înregistrate.
            </p>
            <p className="text-[13px] text-muted-foreground/50 mt-1.5">
              Verifică că ești conectat la rețeaua USV (VPN sau campus).
            </p>
          </div>
        ) : filteredGrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-6">
            <p className="text-[13px] text-muted-foreground">
              Nicio materie în această categorie.
            </p>
          </div>
        ) : (
          <GradeTable grades={filteredGrades} />
        )}
      </div>
    </div>
  );
}
