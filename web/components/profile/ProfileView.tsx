"use client";

import { useEffect, useState } from "react";
import type { ProfileData } from "@/lib/usv/profile";

interface Props {
  displayName: string;
  userId: string;
  expiresAt: number;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function parseEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  const domain = email.split("@")[1] ?? "";
  return { local, domain };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest px-1 mb-1.5">
      {children}
    </p>
  );
}

function InfoRow({
  label,
  value,
  mono,
  skeleton,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  skeleton?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <span className="w-32 shrink-0 text-[13px] text-muted-foreground">{label}</span>
      {skeleton ? (
        <span className="h-4 w-36 rounded-md bg-muted animate-pulse" />
      ) : value ? (
        <span
          className={`text-[13px] text-foreground min-w-0 truncate ${
            mono ? "font-mono text-[12px] tracking-tight" : ""
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="text-[13px] text-muted-foreground/40">—</span>
      )}
    </div>
  );
}

function StatusRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <span className="w-32 shrink-0 text-[13px] text-muted-foreground">Status</span>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-chart-2 shrink-0" />
        <span className="text-[13px] text-foreground">Autentificat</span>
      </div>
    </div>
  );
}

export function ProfileView({ displayName, userId, expiresAt }: Props) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/usv/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setProfileData(data);
      })
      .catch(() => setError("Eroare conexiune"))
      .finally(() => setLoading(false));
  }, []);

  const { local, domain } = parseEmail(userId);
  const avatarInitials = initials(displayName);

  const expiryStr = new Date(expiresAt).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl px-4 sm:px-6 py-8 space-y-8">

        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 select-none">
            <span className="text-lg font-bold text-primary tracking-tight">
              {avatarInitials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground leading-tight">{displayName}</p>
            <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{userId}</p>
          </div>
        </div>

        {/* Academic info */}
        <div>
          <SectionLabel>Informații academice</SectionLabel>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            <InfoRow
              label="ID student"
              value={profileData?.emplid}
              mono
              skeleton={loading}
            />
            <InfoRow
              label="Facultate"
              value={profileData?.faculty}
              skeleton={loading}
            />
            <InfoRow
              label="Clasă"
              value={profileData?.group}
              mono
              skeleton={loading}
            />
            <InfoRow
              label="An de studiu"
              value={profileData?.studyYear}
              skeleton={loading}
            />
          </div>
          {error && !loading && (
            <p className="text-[12px] text-muted-foreground/50 mt-2 px-1">
              Nu s-au putut încărca datele academice — verifică conexiunea la rețeaua USV.
            </p>
          )}
        </div>

        {/* Account info */}
        <div>
          <SectionLabel>Cont</SectionLabel>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            <InfoRow label="Nume complet" value={displayName} />
            <InfoRow label="Email" value={userId} mono />
            <InfoRow label="Username" value={local} mono />
            <InfoRow label="Domeniu" value={domain} mono />
          </div>
        </div>

        {/* Session info */}
        <div>
          <SectionLabel>Sesiune</SectionLabel>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            <StatusRow />
            <InfoRow label="Expiră" value={expiryStr} />
          </div>
        </div>

      </div>
    </div>
  );
}
