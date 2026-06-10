import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getSheet, getSubject } from "@/lib/study/content";
import { MarkdownContent } from "@/components/study/MarkdownContent";
import { RequestButton } from "@/components/study/RequestButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; sheet: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, sheet } = await params;
  const data = await getSheet(slug, sheet);
  return { title: data ? data.meta.title : "Studiu" };
}

export default async function SheetPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { slug, sheet } = await params;
  const [subject, data] = await Promise.all([getSubject(slug), getSheet(slug, sheet)]);
  if (!subject || !data) notFound();

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-4 sm:px-6 pt-14 sm:pt-8 pb-5 border-b border-border">
        <Link
          href={`/studiu/${slug}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {subject.meta.title}
        </Link>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{data.meta.title}</h1>
            {data.meta.updated && (
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                Actualizat la {data.meta.updated}
              </p>
            )}
          </div>
          <RequestButton label="Semnalează / cere modificări" slug={slug} defaultType="corectura" />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl w-full">
        <MarkdownContent>{data.body}</MarkdownContent>
      </div>
    </main>
  );
}
