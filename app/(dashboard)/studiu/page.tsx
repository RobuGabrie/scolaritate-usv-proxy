import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listSubjects } from "@/lib/study/content";
import { fetchProfile } from "@/lib/usv/profile";
import { StudyList } from "@/components/study/StudyList";
import { RequestButton } from "@/components/study/RequestButton";

// Content is read from a volume-mounted dir at request time — never prerender.
export const dynamic = "force-dynamic";

export const metadata = { title: "Studiu" };

export default async function StudiuPage() {
  const session = await getSession();
  if (!session) redirect("/login");

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
        <Suspense fallback={<StudyListSkeleton />}>
          <StudyContent cookies={session.cookies} />
        </Suspense>
      </div>
    </main>
  );
}

async function StudyContent({ cookies }: { cookies: string }) {
  const subjects = await listSubjects();

  // Faculty only orders/badges the list — if USV is unreachable or the
  // upstream session died, degrade to the plain list instead of erroring.
  let studentFaculty: string | null = null;
  if (subjects.some((s) => s.faculty)) {
    try {
      const profile = await Promise.race([
        fetchProfile(cookies),
        new Promise<never>((_, reject) => setTimeout(() => reject(), 3000)),
      ]);
      studentFaculty = profile.faculty;
    } catch {
      studentFaculty = null;
    }
  }

  if (subjects.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium text-foreground mb-1">
          Încă nu există materiale de studiu.
        </p>
        <p className="text-[13px] text-muted-foreground">
          Poți cere o materie cu butonul de mai sus.
        </p>
      </div>
    );
  }

  return <StudyList subjects={subjects} studentFaculty={studentFaculty} />;
}

function StudyListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-muted" style={{ width: `${100 - (i % 3) * 8}%` }} />
      ))}
    </div>
  );
}
