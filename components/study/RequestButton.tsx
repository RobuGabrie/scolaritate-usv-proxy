"use client";

import { useState } from "react";
import { RequestModal, type RequestType } from "./RequestModal";

interface RequestButtonProps {
  label: string;
  slug?: string;
  defaultType?: RequestType;
}

export function RequestButton({ label, slug, defaultType }: RequestButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-border text-[12.5px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {label}
      </button>
      {open && <RequestModal onClose={() => setOpen(false)} slug={slug} defaultType={defaultType} />}
    </>
  );
}
