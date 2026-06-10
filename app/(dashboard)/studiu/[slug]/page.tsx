import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getSubject } from "@/lib/study/content";
import { MarkdownContent } from "@/components/study/MarkdownContent";
import { RequestButton } from "@/components/study/RequestButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const subject = await getSubject(slug);
  return { title: subject ? subject.meta.title : "Studiu" };
}

export default async function SubjectPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { slug } = await params;
  const subject = await getSubject(slug);
  if (!subject) notFound();

  const { meta, body, sheets, files } = subject;

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-4 sm:px-6 pt-14 sm:pt-8 pb-5 border-b border-border">
        <Link
          href="/studiu"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Studiu
        </Link>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{meta.title}</h1>
            {meta.updated && (
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                Actualizat la {meta.updated}
              </p>
            )}
          </div>
          <RequestButton label="Semnalează / cere modificări" slug={meta.slug} defaultType="corectura" />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl w-full">
        {sheets.length > 0 && (
          <section className="mb-7">
            <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
              Fișe
            </h2>
            <div className="space-y-1.5">
              {sheets.map((sheet) => (
                <Link
                  key={sheet.slug}
                  href={`/studiu/${meta.slug}/${sheet.slug}`}
                  className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-border hover:bg-muted/40 transition-colors group"
                >
                  <span className="text-[13.5px] font-medium text-foreground">{sheet.title}</span>
                  <span className="flex items-center gap-2.5 shrink-0">
                    {sheet.updated && (
                      <span className="text-[11.5px] text-muted-foreground/70 hidden sm:inline">
                        Actualizat la {sheet.updated}
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
        )}

        <MarkdownContent>{body}</MarkdownContent>

        {files.length > 0 && (
          <section className="mt-8 pt-5 border-t border-border">
            <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
              Fișiere
            </h2>
            <div className="space-y-1.5">
              {files.map((name) => (
                <a
                  key={name}
                  href={`/api/study/files/${meta.slug}/${encodeURIComponent(name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border hover:bg-muted/40 transition-colors text-[13px] text-foreground"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0" aria-hidden>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {name}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
