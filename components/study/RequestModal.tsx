"use client";

import { useState } from "react";

export type RequestType = "materie-noua" | "corectura" | "drept-editare";

const TYPE_OPTIONS: { value: RequestType; label: string }[] = [
  { value: "materie-noua", label: "Materie nouă" },
  { value: "corectura", label: "Corectură conținut" },
  { value: "drept-editare", label: "Drept de editare" },
];

interface RequestModalProps {
  onClose: () => void;
  slug?: string;
  defaultType?: RequestType;
}

export function RequestModal({ onClose, slug, defaultType = "materie-noua" }: RequestModalProps) {
  const [type, setType] = useState<RequestType>(defaultType);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (status === "sending") return;
    setError(null);

    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setError("Mesajul trebuie să aibă cel puțin 10 caractere.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/study/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          slug: type === "materie-noua" ? undefined : slug,
          message: trimmed,
          contact: contact.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Cererea nu a putut fi trimisă. Încearcă mai târziu.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Cererea nu a putut fi trimisă. Verifică conexiunea.");
      setStatus("idle");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 pb-20 sm:pb-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "sent" ? (
          <>
            <div className="text-3xl">✅</div>
            <div>
              <h2 className="text-[17px] font-bold text-foreground leading-snug">
                Cererea a fost trimisă. Mulțumesc!
              </h2>
              <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                O să mă uit peste ea cât de curând pot.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full h-11 flex items-center justify-center rounded-xl border border-border text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              Închide
            </button>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-[17px] font-bold text-foreground leading-snug">
                Trimite o cerere
              </h2>
              <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
                Cererea este anonimă — nu trimitem numele sau contul tău.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Tip cerere</label>
              <div className="flex flex-col gap-1.5">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`h-9 px-3 rounded-lg border text-[13px] text-left transition-colors ${
                      type === opt.value
                        ? "border-ring bg-muted/60 text-foreground font-medium"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    {opt.label}
                    {opt.value !== "materie-noua" && slug ? (
                      <span className="text-muted-foreground/70"> — {slug}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="request-message" className="text-[12px] font-medium text-muted-foreground">
                Mesaj
              </label>
              <textarea
                id="request-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                placeholder={
                  type === "materie-noua"
                    ? "Ce materie ai vrea adăugată și ce ar trebui să conțină?"
                    : "Ce e greșit sau ce ai modifica?"
                }
                className="w-full min-h-28 resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-[13px] transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="request-contact" className="text-[12px] font-medium text-muted-foreground">
                Contact (opțional — e-mail, Discord etc.)
              </label>
              <input
                id="request-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={200}
                placeholder="Doar dacă vrei un răspuns"
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-[13px] transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>

            {error && <p className="text-[12.5px] text-destructive leading-snug">{error}</p>}

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                className="w-full h-11 flex items-center justify-center rounded-xl bg-foreground text-background text-[13px] font-medium hover:opacity-90 active:opacity-75 transition-opacity disabled:opacity-50"
              >
                {status === "sending" ? "Se trimite..." : "Trimite cererea"}
              </button>
              <button
                onClick={onClose}
                className="w-full h-11 flex items-center justify-center rounded-xl border border-border text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                Renunță
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
