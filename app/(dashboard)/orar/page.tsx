import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { fetchProfile } from "@/lib/usv/profile";
import { FACULTY_IDS, DEFAULT_FACULTY_ID } from "@/lib/orar/academicYear";
import { OrarView } from "@/components/orar/OrarView";
import { PageSkeleton } from "@/components/PageSkeleton";

export default async function OrarPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Suspense fallback={<PageSkeleton />}>
        <OrarContent cookies={session.cookies} />
      </Suspense>
    </main>
  );
}

async function OrarContent({ cookies }: { cookies: string }) {
  let facultyId = DEFAULT_FACULTY_ID;
  let studyYear: number | null = null;

  try {
    const profile = await Promise.race([
      fetchProfile(cookies),
      new Promise<null>((_, reject) => setTimeout(() => reject(), 3000)),
    ]);
    if (profile && profile.faculty && FACULTY_IDS[profile.faculty]) {
      facultyId = FACULTY_IDS[profile.faculty];
    }
    if (profile && profile.studyYear) {
      const m = profile.studyYear.match(/\d+/);
      if (m) studyYear = parseInt(m[0]);
    }
  } catch {
    // silently ignored — hints only
  }

  return <OrarView facultyId={facultyId} studyYear={studyYear} />;
}
