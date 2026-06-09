import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { fetchGrades } from "@/lib/usv/grades";
import { GradesView } from "@/components/grades/GradesView";
import { GradesSkeleton } from "@/components/grades/GradesSkeleton";
import { SessionExpiredCard } from "@/components/SessionExpiredCard";

export default async function NotePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Suspense fallback={<GradesSkeleton />}>
        <GradesContent cookies={session.cookies} />
      </Suspense>
    </main>
  );
}

async function GradesContent({ cookies }: { cookies: string }) {
  let grades: Awaited<ReturnType<typeof fetchGrades>> | null = null;
  let error: string | null = null;
  let sessionExpired = false;

  try {
    grades = await fetchGrades(cookies);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Eroare necunoscută";
    if (msg === "SESSION_EXPIRED") {
      sessionExpired = true;
    } else {
      error = msg;
    }
  }

  if (sessionExpired) {
    return <SessionExpiredCard />;
  }

  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <p className="text-sm font-medium text-foreground mb-1">Eroare la încărcarea notelor</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <GradesView
      grades={grades?.grades ?? []}
      academicYear={grades?.academicYear ?? ""}
      currentStrm={grades?.psContext?.currentStrm ?? ""}
    />
  );
}
