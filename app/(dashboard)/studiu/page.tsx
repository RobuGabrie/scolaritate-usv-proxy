import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listSubjects, type StudySubject } from "@/lib/study/content";
import { RequestButton } from "@/components/study/RequestButton";

// Content is read from a volume-mounted dir at request time — never prerender.
export const dynamic = "force-dynamic";

export const metadata = { title: "Studiu" };

function groupLabel(s: StudySubject): string {
  if (s.year && s.semester) return `Anul ${s.year} · Semestrul ${s.semester}`;
  if (s.year) return `Anul ${s.year}`;
  return "Materii";
}

export default async function StudiuPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const subjects = await listSubjects();

  const groups = new Map<string, StudySubject[]>();
  for (const s of subjects) {
    const label = groupLabel(s);
    groups.set(label, [...(groups.get(label) ?? []), s]);
  }

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-4 sm:px-6 pt-14 sm:pt-8 pb-5 border-b border-border flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Studiu</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Notițe și fișe de studiu pe materii.
          </p>
        </div>
        <RequestButton label="Cere o materie" defaultType="materie-noua" />
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl w-full">
        {subjects.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-foreground mb-1">
              Încă nu există materiale de studiu.
            </p>
            <p className="text-[13px] text-muted-foreground">
              Poți cere o materie cu butonul de mai sus.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {[...groups.entries()].map(([label, items]) => (
              <section key={label}>
                <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                  {label}
                </h2>
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
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
