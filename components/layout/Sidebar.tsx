"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { label: "Note", href: "/note" },
  { label: "Orar", href: "/orar" },
  { label: "Profil", href: "/profil" },
];

const REVOLUT_LINK = "https://revolut.me/robugabi2004";

function IconHeart() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DonateModal({ onClose }: { onClose: () => void }) {
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
        <div className="text-3xl">☕</div>

        <div>
          <h2 className="text-[17px] font-bold text-foreground leading-snug">
            Bă, mă bucur că-ți e utilă!
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
            Am făcut asta ca să nu mai umbli cu VPN-ul ca în 2003.
            Dacă vrei să-mi mulțumești, poți să-mi dai o cafea. Nu e obligatoriu,
            dar e apreciată.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <a
            href={REVOLUT_LINK}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-foreground text-background text-[13px] font-medium hover:opacity-90 active:opacity-75 transition-opacity"
          >
            ☕ Fac eu cinste
          </a>
          <button
            onClick={onClose}
            className="w-full h-11 flex items-center justify-center rounded-xl border border-border text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            Lasă-mă în pace
          </button>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  displayName: string;
  userId: string;
}

export function Sidebar({ displayName, userId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const nav = (
    <>
      <div className="px-2 py-1 mb-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary-foreground">U</span>
        </div>
        <span className="text-base font-semibold tracking-tight">Scolaritate+</span>
      </div>

      <nav className="space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => { router.push(item.href); setMobileOpen(false); }}
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
              pathname.startsWith(item.href)
                ? "bg-sidebar-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          onClick={() => { setMobileOpen(false); setShowDonate(true); }}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-pink-500 hover:bg-pink-500/10 transition-colors group"
        >
          <span className="group-hover:scale-110 transition-transform duration-150">
            <IconHeart />
          </span>
          Susține proiectul
        </button>

        <Link
          href="/disclaimer"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Disclaimer
        </Link>

        <Separator />

        <div className="px-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground/70 truncate">{userId}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              aria-label="Deconectare"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border bg-sidebar flex-col px-3 py-4">
        {nav}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border flex flex-col px-3 py-4 transition-transform duration-200 md:hidden ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {nav}
      </aside>

      {/* Mobile hamburger */}
      <button
        id="mobile-menu-toggle"
        className="md:hidden fixed top-4 left-4 z-30 h-9 w-9 flex items-center justify-center rounded-xl bg-sidebar border border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent active:scale-95 transition-all"
        onClick={() => setMobileOpen(true)}
        aria-label="Deschide meniu"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Mobile donate — top right */}
      <button
        onClick={() => setShowDonate(true)}
        className="md:hidden fixed top-4 right-4 z-30 h-9 flex items-center gap-1.5 px-3 rounded-xl bg-sidebar border border-sidebar-border text-pink-500 hover:bg-pink-500/10 active:scale-95 transition-all text-[12px] font-medium"
      >
        <IconHeart />
        <span>Susține</span>
      </button>

      {/* Donate modal */}
      {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}
    </>
  );
}
