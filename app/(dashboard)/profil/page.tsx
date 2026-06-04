import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function ProfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 sm:px-6 pt-14 sm:pt-8 pb-5 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Profil</h1>
      </div>
      <ProfileView
        displayName={session.displayName}
        userId={session.userId}
        expiresAt={session.expiresAt}
      />
    </main>
  );
}
