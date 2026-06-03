"use client";

import { useState } from "react";
import type { Grade } from "@/lib/usv/types";
import { GradeTable } from "./GradeTable";
import { calcStats, simulateGrades } from "@/lib/gradeCalculator";

interface Props {
  grades: Grade[];
  academicYear: string;
}

type Tab = "toate" | "sem1" | "sem2" | "restante";

const TABS: { id: Tab; label: string }[] = [
  { id: "toate", label: "Toate" },
  { id: "sem1", label: "Semestrul I" },
  { id: "sem2", label: "Semestrul II" },
  { id: "restante", label: "Restanțe" },
];

function parseN(s: string) {
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function mediaColor(m: number): string {
  if (m >= 9) return "text-emerald-500 dark:text-emerald-400";
  if (m >= 7) return "text-sky-500 dark:text-sky-400";
  if (m >= 5) return "text-amber-500 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

interface StatCardProps {
  label: string;
  value: string;
  valueClass?: string;
  sub: string;
  accent?: boolean;
}

function StatCard({ label, value, valueClass, sub, accent }: StatCardProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 flex flex-col gap-1 ${accent ? "border-primary/20 bg-primary/5" : "border-border bg-card"}`}>
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-semibold tabular-nums leading-none ${valueClass ?? "text-foreground"}`}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </div>
  );
}

export function GradesView({ grades, academicYear }: Props) {
  const [tab, setTab] = useState<Tab>("toate");
  const [calcTarget, setCalcTarget] = useState("");
  const [showCalc, setShowCalc] = useState(false);

  // Filter grades for current tab
  const filteredGrades = grades.filter((g) => {
    if (tab === "sem1") return g.filterCategory === "SEM 1";
    if (tab === "sem2") return g.filterCategory === "SEM 2";
    if (tab === "restante") {
      const n = parseN(g.notaFinala);
      return g.filterCategory === "OTHER" || (n !== null && n < 5);
    }
    return true;
  });

  // Stats always reflect current tab
  const stats = calcStats(filteredGrades);

  // Total expected credits in current tab (including subjects without grade)
  const crediteAsteptate = filteredGrades.reduce(
    (acc, g) => acc + (parseN(g.credite) ?? 0),
    0
  );

  // Nota max/min for context card
  const noteFinale = filteredGrades
    .map((g) => parseN(g.notaFinala))
    .filter((n): n is number => n !== null && n >= 1);
  const notaMax = noteFinale.length > 0 ? Math.max(...noteFinale) : null;
  const notaMin = noteFinale.length > 0 ? Math.min(...noteFinale) : null;

  // Calculator: simulate across ALL grades (not just filtered tab)
  const simResult =
    showCalc && calcTarget
      ? simulateGrades(grades, parseFloat(calcTarget.replace(",", ".")))
      : null;

  // Tab counts
  const countFor = (t: Tab) =>
    t === "toate"
      ? grades.length
      : grades.filter((g) => {
          if (t === "sem1") return g.filterCategory === "SEM 1";
          if (t === "sem2") return g.filterCategory === "SEM 2";
          const n = parseN(g.notaFinala);
          return g.filterCategory === "OTHER" || (n !== null && n < 5);
        }).length;

  const tabLabel: Record<Tab, string> = {
    toate: "toate",
    sem1: "semestrul I",
    sem2: "semestrul II",
    restante: "restanțe",
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border space-y-4">
        {/* Title + calculator toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-foreground">Note</h1>
            {academicYear && (
              <p className="text-xs text-muted-foreground mt-0.5">
                An universitar {academicYear}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowCalc((v) => !v)}
            className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
              showCalc
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Calculator medie
          </button>
        </div>

        {/* Stat cards — reflect selected tab */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Media ECTS */}
          <StatCard
            label={`Media — ${tabLabel[tab]}`}
            value={stats.mediaEcts > 0 ? stats.mediaEcts.toFixed(2) : "—"}
            valueClass={stats.mediaEcts > 0 ? mediaColor(stats.mediaEcts) : "text-muted-foreground"}
            sub="medie ponderată ECTS"
            accent={stats.mediaEcts > 0}
          />

          {/* Credite */}
          <StatCard
            label="Credite ECTS"
            value={
              stats.creditePromovate > 0
                ? `${stats.creditePromovate} / ${crediteAsteptate}`
                : crediteAsteptate > 0
                ? `0 / ${crediteAsteptate}`
                : "—"
            }
            sub={
              stats.creditePromovate === crediteAsteptate && crediteAsteptate > 0
                ? "toate creditele acumulate ✓"
                : stats.creditePromovate > 0
                ? "credite acumulate"
                : "niciun credit acumulat încă"
            }
          />

          {/* Promovate */}
          <StatCard
            label="Promovate"
            value={
              filteredGrades.length > 0
                ? `${stats.promovate} / ${filteredGrades.length}`
                : "—"
            }
            sub={
              stats.nepromovate > 0
                ? `${stats.nepromovate} respins${stats.nepromovate === 1 ? "" : "e"}`
                : stats.inAsteptare > 0
                ? `${stats.inAsteptare} fără notă finală`
                : stats.promovate > 0
                ? "toate promovate ✓"
                : "nicio materie cu notă"
            }
          />

          {/* Context card: nota min/max sau examene rămase */}
          {stats.inAsteptare > 0 ? (
            <StatCard
              label="Examene rămase"
              value={stats.inAsteptare.toString()}
              sub={`${stats.inAsteptare === 1 ? "materie" : "materii"} fără notă finală`}
            />
          ) : notaMin !== null ? (
            <StatCard
              label="Interval note"
              value={`${notaMin} – ${notaMax}`}
              sub={`min – max în ${tabLabel[tab]}`}
            />
          ) : (
            <StatCard
              label="Examene rămase"
              value="0"
              sub="toate materiile notate ✓"
            />
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map((t) => {
            const count = countFor(t.id);
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`text-sm px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {t.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
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
        <div className="border-b border-border bg-muted/10 px-6 py-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Introdu media dorită — îți arăt nota minimă necesară la fiecare materie fără notă finală
            (presupunând că iei 10 la toate celelalte).
          </p>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Media țintă:
            </label>
            <input
              type="number"
              min="5"
              max="10"
              step="0.01"
              value={calcTarget}
              onChange={(e) => setCalcTarget(e.target.value)}
              placeholder="ex: 8.50"
              className="w-28 rounded-md border border-border bg-background text-sm px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary"
            />
            {calcTarget && (
              <span className="text-xs text-muted-foreground">
                Media curentă: {
                  calcStats(grades).mediaEcts > 0
                    ? calcStats(grades).mediaEcts.toFixed(2)
                    : "—"
                }
              </span>
            )}
          </div>

          {simResult && (
            <div>
              <p className={`text-sm font-medium mb-3 ${simResult.possible ? "text-foreground" : "text-red-500"}`}>
                {simResult.message}
              </p>
              {simResult.remainingSubjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {simResult.remainingSubjects.map((s, i) => {
                    const impossible = s.notaNecesara >= 10 && !simResult.possible;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 gap-2"
                      >
                        <span className="text-xs text-muted-foreground truncate">{s.titlu}</span>
                        <div className="shrink-0 text-right">
                          <span className={`text-sm font-semibold tabular-nums ${
                            impossible
                              ? "text-red-500"
                              : s.notaNecesara >= 9
                              ? "text-emerald-500"
                              : s.notaNecesara >= 7
                              ? "text-sky-500"
                              : "text-amber-500"
                          }`}>
                            ≥ {s.notaNecesara.toFixed(2)}
                          </span>
                          <p className="text-[10px] text-muted-foreground/60">{s.credite} cr.</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {grades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
            <p className="text-muted-foreground text-sm">
              Nu s-au putut încărca notele sau nu există note înregistrate.
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Verifică că ești conectat la rețeaua USV (VPN sau campus).
            </p>
          </div>
        ) : filteredGrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-6">
            <p className="text-muted-foreground text-sm">
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
