import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { fetchProfile } from "@/lib/usv/profile";
import { FACULTY_IDS, DEFAULT_FACULTY_ID } from "@/lib/orar/academicYear";
import { OrarView } from "@/components/orar/OrarView";

export default async function OrarPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let facultyId = DEFAULT_FACULTY_ID;
  let studyYear: number | null = null;

  try {
    const profile = await Promise.race([
      fetchProfile(session.cookies),
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

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <OrarView facultyId={facultyId} studyYear={studyYear} />
    </main>
  );
}
