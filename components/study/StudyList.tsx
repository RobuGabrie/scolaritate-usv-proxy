"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { StudySubject } from "@/lib/study/content";

const GENERAL = "GENERAL";

function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function yearLabel(s: StudySubject): string {
  if (s.year && s.semester) return `Anul ${s.year} · Semestrul ${s.semester}`;
  if (s.year) return `Anul ${s.year}`;
  return "Materii";
}

interface StudyListProps {
  subjects: StudySubject[];
  studentFaculty: string | null;
}

export function StudyList({ subjects, studentFaculty }: StudyListProps) {
  const [query, setQuery] = useState("");

  const facultySections = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = q
      ? subjects.filter(
          (s) =>
            normalize(s.title).includes(q) ||
            normalize(s.slug).includes(q) ||
            (s.faculty && normalize(s.faculty).includes(q))
        )
      : subjects;

    // faculty → year/semester label → subjects (insertion order preserved;
    // subjects arrive pre-sorted by order/title from listSubjects)
    const byFaculty = new Map<string, Map<string, StudySubject[]>>();
    for (const s of filtered) {
      const fac = s.faculty ?? GENERAL;
      const groups = byFaculty.get(fac) ?? new Map<string, StudySubject[]>();
      const label = yearLabel(s);
      groups.set(label, [...(groups.get(label) ?? []), s]);
      byFaculty.set(fac, groups);
    }

    // Student's own faculty first, then General, then the rest alphabetically
    return [...byFaculty.entries()].sort(([a], [b]) => {
      const rank = (f: string) =>
        f === studentFaculty ? 0 : f === GENERAL ? 1 : 2;
      return rank(a) - rank(b) || a.localeCompare(b, "ro");
    });
  }, [subjects, studentFaculty, query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută o materie..."
          className="h-10 w-full rounded-xl border border-input bg-transparent pl-9 pr-3 text-[13.5px] transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      {facultySections.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-foreground mb-1">Niciun rezultat.</p>
          <p className="text-[13px] text-muted-foreground">
            Nu am găsit nicio materie pentru „{query.trim()}”.
          </p>
        </div>
      ) : (
        facultySections.map(([faculty, groups]) => (
          <section key={faculty} className="space-y-5">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold tracking-tight text-foreground">
                {faculty === GENERAL ? "General" : faculty}
              </h2>
              {faculty === studentFaculty && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                  facultatea ta
                </span>
              )}
            </div>

            {[...groups.entries()].map(([label, items]) => (
              <div key={label}>
                <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                  {label}
                </h3>
                <div className="space-y-1.5">
                  {items.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/studiu/${s.slug}`}
                      className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-border hover:bg-muted/40 transition-colors group"
                    >
                      <span className="text-[14px] font-medium text-foreground">{s.title}</span>
                      <span className="flex items-center gap-2.5 shrink-0">
                        {s.updated && (
                          <span className="text-[11.5px] text-muted-foreground/70 hidden sm:inline">
                            Actualizat la {s.updated}
                          </span>
                        )}
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground group-hover:text-foreground transition-colors"
                          aria-hidden
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
