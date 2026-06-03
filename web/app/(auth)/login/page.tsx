"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [userid, setUserid] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"start" | "email" | "password">("start");
  const [displayStep, setDisplayStep] = useState(step);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (step === displayStep) return;
    setPhase("out");
    const timeout = setTimeout(() => {
      setDisplayStep(step);
      setPhase("in");
    }, 240);
    return () => clearTimeout(timeout);
  }, [step, displayStep]);

  const headline =
    displayStep === "start"
      ? "Intră în cont"
      : displayStep === "email"
        ? "Email"
        : "Parolă";

  const subline =
    displayStep === "start"
      ? "Arată note, examene și orar. Folosește emailul USV. Nu stocăm parola."
      : displayStep === "email"
        ? "Introdu adresa de email."
        : "Introdu parola.";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (step === "start") {
      setStep("email");
      return;
    }
    if (step === "email") {
      if (!userid) {
        setError("Introdu adresa de email.");
        return;
      }
      setStep("password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, pwd }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Autentificare eșuată.");
        return;
      }
      router.push("/note");
    } catch {
      setError("Eroare de rețea. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground"
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% -10%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 70%), var(--background)",
      }}
    >
      <div className="w-full flex flex-col items-center" style={{ maxWidth: 360 }}>
        <div className="flex items-center justify-center gap-2 w-full">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span className="text-[14px] font-medium tracking-tight text-foreground">Școlaritate</span>
        </div>

        <div className="mt-6 space-y-2 login-swap text-center" data-phase={phase}>
          <h1 className="text-[18px] font-medium text-foreground text-center">{headline}</h1>
          <p className="text-[13px] text-muted-foreground">
            {subline} {displayStep === "start" && (
              <a className="underline underline-offset-4" href="/disclaimer">Disclaimer</a>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          {displayStep !== "start" && (
            <div className="flex flex-col gap-2 login-swap" data-phase={phase}>
              <label htmlFor="userid" className="text-[12px] font-medium text-foreground">
                Email USV
              </label>
              <input
                id="userid"
                type="email"
                placeholder="prenume.nume@student.usv.ro"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                autoComplete="username"
                autoFocus={displayStep === "email"}
                disabled={loading || displayStep === "password" || phase === "out"}
                style={{
                  height: 44,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--foreground)",
                  fontSize: 13,
                  padding: 12,
                  outline: "none",
                }}
                className="w-full transition focus:border-ring focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ring)_16%,transparent)] disabled:opacity-60"
              />
            </div>
          )}

          {displayStep === "password" && (
            <div className="flex flex-col gap-2 login-swap" data-phase={phase}>
              <label htmlFor="pwd" className="text-[12px] font-medium text-foreground">
                Parolă
              </label>
              <div className="relative">
                <input
                  id="pwd"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading || phase === "out"}
                  autoFocus
                  style={{
                    height: 44,
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    fontSize: 13,
                    padding: "12px 40px 12px 12px",
                    outline: "none",
                  }}
                  className="w-full transition focus:border-ring focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ring)_16%,transparent)] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPwd ? "Ascunde parola" : "Arată parola"}
                  className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-[12px] text-destructive">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={phase === "out" || loading || (step === "password" && (!userid || !pwd))}
            style={{
              height: 44,
              borderRadius: 9999,
              background: "#fefeff",
              color: "#2f2f31",
              fontSize: 13,
              fontWeight: 500,
              padding: "0 18px",
            }}
            className="w-full transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <svg className="mr-2 inline-block animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            )}
            {displayStep === "start" && "Continuă cu email"}
            {displayStep === "email" && "Continuă"}
            {displayStep === "password" && (loading ? "Se conectează…" : "Intră în cont")}
          </button>
        </form>

        <p className="mt-6 text-[12px] text-muted-foreground text-center">
          Credențialele nu sunt stocate.
        </p>
      </div>
    </div>
  );
}
