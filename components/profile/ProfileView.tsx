"use client";

import { useEffect, useState } from "react";
import type { ProfileData } from "@/lib/usv/profile";

interface Props {
  displayName: string;
  userId: string;
  expiresAt: number;
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
      <span className="w-28 shrink-0 text-[13px] text-muted-foreground">{label}</span>
      {skeleton ? (
        <span className="h-3.5 w-40 rounded bg-muted animate-pulse" />
      ) : value ? (
        <span className={`text-[13px] text-foreground min-w-0 truncate ${mono ? "font-mono text-[12px]" : ""}`}>
          {value}
        </span>
      ) : (
        <span className="text-[13px] text-muted-foreground/30">—</span>
      )}
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

  const expiryStr = new Date(expiresAt).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-lg px-4 sm:px-6 py-6 space-y-6">

        {/* Identity */}
        <div>
          <p className="text-base font-semibold text-foreground leading-snug">{displayName}</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">{userId}</p>
        </div>

        {/* Academic */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest px-1 mb-1.5">
            Academic
          </p>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            <InfoRow label="Facultate" value={profileData?.faculty} skeleton={loading} />
            <InfoRow label="An de studiu" value={profileData?.studyYear} skeleton={loading} />
            <InfoRow label="Grupă" value={profileData?.group} mono skeleton={loading} />
            <InfoRow label="ID student" value={profileData?.emplid} mono skeleton={loading} />
          </div>
          {error && !loading && (
            <p className="text-[12px] text-muted-foreground/40 mt-2 px-1">
              Nu s-au putut încărca datele — verifică conexiunea la rețeaua USV.
            </p>
          )}
        </div>

        {/* Session */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[12px] text-muted-foreground/50">Sesiune activă până la</span>
          <span className="text-[12px] text-muted-foreground tabular-nums">{expiryStr}</span>
        </div>

      </div>
    </div>
  );
}
