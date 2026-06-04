"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Grade } from "@/lib/usv/types";

function gradeColor(nota: string): string {
  const n = parseFloat(nota);
  if (isNaN(n) || nota === "") return "text-muted-foreground/30";
  return "text-foreground";
}

export function GradeTable({ grades }: { grades: Grade[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (grades.length === 0)
    return (
      <div className="py-16 text-center text-muted-foreground text-sm">
        Nicio materie găsită.
      </div>
    );

  return (
    <div className="divide-y divide-border/50">
      {grades.map((g, i) => {
        const isOpen = openIndex === i;
        const hasDetails = g.sesiune || g.credite || g.puncte;
        const hasSubGrades = g.notaCurs || g.notaSeminar;

        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-3 px-4 md:px-6 py-4 md:py-5 transition-colors hover:bg-muted/20 text-left"
            >
              {/* Subject name + sub-grades */}
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium text-foreground leading-snug truncate block">
                  {g.titlu}
                </span>
                {hasSubGrades && (
                  <span className="text-xs text-muted-foreground/60 mt-1 block tabular-nums">
                    {[
                      g.notaCurs ? `Curs ${g.notaCurs}` : null,
                      g.notaSeminar ? `Lab ${g.notaSeminar}` : null,
                    ]
                      .filter(Boolean)
                      .join("  ·  ")}
                  </span>
                )}
              </div>

              {/* Chevron */}
              {hasDetails && (
                <ChevronRight
                  size={14}
                  className={`shrink-0 text-muted-foreground/30 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                />
              )}

              {/* Final grade */}
              <span className={`shrink-0 w-12 text-right text-2xl font-bold tabular-nums leading-none ${gradeColor(g.notaFinala)}`}>
                {g.notaFinala || "—"}
              </span>
            </button>

            {/* Expandable detail row */}
            {isOpen && hasDetails && (
              <div className="px-4 md:px-6 py-3.5 border-t border-border/30 flex flex-wrap gap-x-6 gap-y-2">
                {g.sesiune && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground/50">Sesiune</span>
                    <span className="text-sm font-medium text-foreground">{g.sesiune}</span>
                  </div>
                )}
                {g.credite && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground/50">Credite</span>
                    <span className="text-sm font-medium text-foreground">{g.credite}</span>
                  </div>
                )}
                {g.puncte && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground/50">Puncte</span>
                    <span className="text-sm font-medium text-foreground">{g.puncte}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
