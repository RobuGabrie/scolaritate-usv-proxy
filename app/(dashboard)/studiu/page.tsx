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

  const subjects = await listSubjects();

  // Faculty only orders/badges the list — if USV is unreachable or the
  // upstream session died, degrade to the plain list instead of erroring.
  let studentFaculty: string | null = null;
  if (subjects.some((s) => s.faculty)) {
    try {
      studentFaculty = (await fetchProfile(session.cookies)).faculty;
    } catch {
      studentFaculty = null;
    }
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
          <StudyList subjects={subjects} studentFaculty={studentFaculty} />
        )}
      </div>
    </main>
  );
}
