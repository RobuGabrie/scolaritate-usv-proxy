"use client";

import type { Grade } from "@/lib/usv/types";

interface Props {
  grades: Grade[];
}

function gradeColor(nota: string): string {
  const n = parseFloat(nota);
  if (isNaN(n) || nota === "") return "text-muted-foreground";
  if (n >= 9) return "text-emerald-500 dark:text-emerald-400";
  if (n >= 7) return "text-sky-500 dark:text-sky-400";
  if (n >= 5) return "text-amber-500 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

function GradeBadge({ value, estimated }: { value: string; estimated?: boolean }) {
  if (!value)
    return <span className="text-muted-foreground/40">—</span>;
  return (
    <span className={`font-medium tabular-nums ${gradeColor(value)} ${estimated ? "opacity-60 italic" : ""}`}>
      {value}
      {estimated && <span className="text-[10px] ml-0.5">~</span>}
    </span>
  );
}

export function GradeTable({ grades }: Props) {
  if (grades.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground text-sm">
        Nicio materie găsită.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Materie
            </th>
            <th className="text-center py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Sesiune
            </th>
            <th className="text-center py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Pondere
            </th>
            <th className="text-center py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Curs
            </th>
            <th className="text-center py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Lab
            </th>
            <th className="text-center py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Finală
            </th>
            <th className="text-center py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Credite
            </th>
            <th className="text-center py-2.5 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
              Puncte
            </th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, i) => {
            const failed =
              g.notaFinala && parseFloat(g.notaFinala) < 5 && !g.isEstimated;
            return (
              <tr
                key={i}
                className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${
                  failed ? "bg-red-500/5" : ""
                }`}
              >
                <td className="py-3 px-3 font-medium text-foreground max-w-[280px]">
                  <span className="line-clamp-2 leading-snug">{g.titlu}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-xs text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5 whitespace-nowrap">
                    {g.sesiune || "—"}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-xs text-muted-foreground whitespace-nowrap">
                  {g.pondere || "—"}
                </td>
                <td className="py-3 px-3 text-center">
                  <GradeBadge value={g.notaCurs} />
                </td>
                <td className="py-3 px-3 text-center">
                  <GradeBadge value={g.notaSeminar} />
                </td>
                <td className="py-3 px-3 text-center">
                  <GradeBadge value={g.notaFinala} estimated={g.isEstimated} />
                </td>
                <td className="py-3 px-3 text-center text-muted-foreground">
                  {g.credite || "—"}
                </td>
                <td className="py-3 px-3 text-center text-muted-foreground">
                  {g.puncte || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
