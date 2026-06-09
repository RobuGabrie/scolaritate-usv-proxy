"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SessionExpiredCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-medium text-foreground mb-1">Sesiunea a expirat</p>
        <p className="text-xs text-muted-foreground mb-4">
          Conexiunea cu USV a expirat. Reconectează-te pentru a vedea notele.
        </p>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="text-xs px-4 py-2 rounded-md bg-foreground text-background hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          {loading ? "Se deconectează..." : "Reconectează-te"}
        </button>
      </div>
    </main>
  );
}
