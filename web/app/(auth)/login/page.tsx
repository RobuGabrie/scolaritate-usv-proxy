"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ─── Icons ────────────────────────────────────────────────────────────────── */

function IconGitHub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconEye({ visible }: { visible: boolean }) {
  if (visible) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function IconError() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-px" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ─── Shared components ─────────────────────────────────────────────────────── */

const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={[
        "w-full h-11 rounded-xl border border-border bg-card text-foreground text-[13px] px-4",
        "outline-none transition-all duration-150",
        "placeholder:text-muted-foreground/40",
        "focus:border-ring focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ring)_12%,transparent)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    />
  )
);
TextInput.displayName = "TextInput";

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start justify-center gap-1.5 text-[12px] text-destructive mt-1">
      <IconError />
      {msg}
    </div>
  );
}

/* ─── Animated headline — word-by-word slide-up reveal ──────────────────────── */

function AnimatedHeadline({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {/* overflow-hidden clips the word as it slides up into view */}
          <span className="inline-block overflow-hidden align-bottom">
            <span
              className="inline-block animate-word-up"
              style={{ animationDelay: `${baseDelay + i * 65}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </>
  );
}

/* ─── Primary button ─────────────────────────────────────────────────────────── */

const primaryBtn =
  "group flex items-center justify-center gap-2 h-11 w-full rounded-3xl bg-foreground text-background text-[13px] font-medium px-6 hover:opacity-[0.88] disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150";

/* ─── Step: start ───────────────────────────────────────────────────────────── */

function StartStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col gap-6 text-center">
      {/* Headline + description */}
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.024em] leading-[1.1]">
          <span className="block">
            <AnimatedHeadline text="Note mai ușor," baseDelay={60} />
          </span>
          <span className="block login-grad-text">
            <AnimatedHeadline text="fără bătăi de cap." baseDelay={260} />
          </span>
        </h1>

        <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed animate-login-fade [animation-delay:460ms]">
          Note mai ușor accesibile pentru studenții USV.
          <br />
          Nu se salvează parola, doar se folosește și se șterge.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 animate-login-fade [animation-delay:520ms]">
        <button
          onClick={onContinue}
          className={primaryBtn}
        >
          <span className="opacity-60"><IconMail /></span>
          Intră cu emailul USV
        </button>

        <a
          href="https://github.com/RobuGabrie/scolaritate-usv-proxy"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-4"
        >
          <IconGitHub />
          Cod sursă pe GitHub
        </a>
      </div>
    </div>
  );
}

/* ─── Step: email ───────────────────────────────────────────────────────────── */

function EmailStep({
  userid,
  setUserid,
  error,
  onSubmit,
  onBack,
}: {
  userid: string;
  setUserid: (v: string) => void;
  error: string;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  onBack: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 text-center">
      <div className="animate-login-fade [animation-delay:30ms]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 mx-auto mb-4 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconChevronLeft />
          Înapoi
        </button>
        <h2 className="text-[20px] font-bold tracking-[-0.02em]">Intră în cont</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">Emailul tău de la USV.</p>
      </div>

      <div className="flex flex-col gap-1.5 animate-login-fade [animation-delay:80ms] text-left">
        <label htmlFor="userid" className="text-[12px] font-medium text-foreground/80">
          Email
        </label>
        <TextInput
          id="userid"
          type="email"
          placeholder="prenume.nume@student.usv.ro"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          autoComplete="username"
          autoFocus
        />
        {error && <ErrorMsg msg={error} />}
      </div>

      <button
        type="submit"
        disabled={!userid.trim()}
        className={`${primaryBtn} animate-login-fade [animation-delay:140ms]`}
      >
        Continuă
        <span className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5">
          <IconArrow />
        </span>
      </button>
    </form>
  );
}

/* ─── Step: password ────────────────────────────────────────────────────────── */

function PasswordStep({
  userid,
  pwd,
  setPwd,
  showPwd,
  setShowPwd,
  error,
  loading,
  onSubmit,
  onBack,
}: {
  userid: string;
  pwd: string;
  setPwd: (v: string) => void;
  showPwd: boolean;
  setShowPwd: (v: boolean) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  onBack: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 text-center">
      <div className="animate-login-fade [animation-delay:30ms]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 mx-auto mb-4 text-[12px] text-muted-foreground hover:text-foreground transition-colors max-w-full"
        >
          <IconChevronLeft />
          <span className="truncate">{userid}</span>
        </button>
        <h2 className="text-[20px] font-bold tracking-[-0.02em]">Parola</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">Parola de la contul USV.</p>
      </div>

      <div className="flex flex-col gap-1.5 animate-login-fade [animation-delay:80ms] text-left">
        <label htmlFor="pwd" className="text-[12px] font-medium text-foreground/80">
          Parolă
        </label>
        <div className="relative">
          <TextInput
            id="pwd"
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoComplete="current-password"
            autoFocus
            disabled={loading}
            className="pr-11"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd(!showPwd)}
            aria-label={showPwd ? "Ascunde parola" : "Arată parola"}
            className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconEye visible={showPwd} />
          </button>
        </div>
        {error && <ErrorMsg msg={error} />}
      </div>

      <button
        type="submit"
        disabled={loading || !pwd}
        className={`${primaryBtn} animate-login-fade [animation-delay:140ms]`}
      >
        {loading ? (
          <><IconSpinner /> Se conectează…</>
        ) : (
          <>
            Intră în cont
            <span className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5">
              <IconArrow />
            </span>
          </>
        )}
      </button>
    </form>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

type Step = "start" | "email" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("start");
  const [userid, setUserid] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const goTo = useCallback((next: Step) => {
    setIsExiting(true);
    setError("");
    setTimeout(() => {
      setStep(next);
      setIsExiting(false);
    }, 200);
  }, []);

  function handleEmailSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userid.trim()) { setError("Introdu adresa de email."); return; }
    goTo("password");
  }

  async function handlePasswordSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pwd || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, pwd }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Autentificare eșuată."); return; }
      router.push("/note");
    } catch {
      setError("Eroare de rețea. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background relative overflow-hidden">

      {/* Background orb — all styling lives in .login-orb (globals.css) */}
      <div aria-hidden className="login-orb" />

      <div className="w-full max-w-[300px] z-10 animate-login-fade">

        {/* Step content — Tailwind transition on exit */}
        <div className={[
          "transition-[opacity,transform] duration-200 ease-in-out",
          isExiting ? "opacity-0 translate-y-1.5" : "opacity-100 translate-y-0",
        ].join(" ")}>
          {step === "start" && <StartStep onContinue={() => goTo("email")} />}
          {step === "email" && (
            <EmailStep
              userid={userid}
              setUserid={setUserid}
              error={error}
              onSubmit={handleEmailSubmit}
              onBack={() => goTo("start")}
            />
          )}
          {step === "password" && (
            <PasswordStep
              userid={userid}
              pwd={pwd}
              setPwd={setPwd}
              showPwd={showPwd}
              setShowPwd={setShowPwd}
              error={error}
              loading={loading}
              onSubmit={handlePasswordSubmit}
              onBack={() => goTo("email")}
            />
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[11.5px] text-muted-foreground/40 animate-login-fade [animation-delay:750ms]">
          Credențialele nu sunt stocate ·{" "}
          <a href="/disclaimer" className="underline underline-offset-4 hover:text-muted-foreground/60 transition-colors">
            Disclaimer
          </a>
        </p>
      </div>
    </div>
  );
}
