"use client";

import { useEffect, useRef, useState } from "react";
import type { Timetable } from "@/lib/orar/types";
import { TimetableGrid } from "./TimetableGrid";

interface Props {
  timetable: Timetable;
  onInstructorClick?: (name: string) => void;
}

export function PinchZoomGrid({ timetable, onInstructorClick }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const autoZoomRef = useRef(1);
  const lastDistRef = useRef<number | null>(null);

  // Auto-fit to container width on mount and timetable change
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    inner.style.zoom = "1";
    requestAnimationFrame(() => {
      const outerW = outer.clientWidth;
      const innerW = inner.scrollWidth;
      const fit = outerW > 0 && innerW > outerW ? outerW / innerW : 1;
      autoZoomRef.current = fit;
      zoomRef.current = fit;
      setZoom(fit);
    });
  }, [timetable]);

  // Pinch-zoom via touch events
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDistRef.current = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || lastDistRef.current === null) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / lastDistRef.current;
      lastDistRef.current = dist;
      const newZoom = Math.min(2, Math.max(0.15, zoomRef.current * ratio));
      zoomRef.current = newZoom;
      setZoom(newZoom);
    };

    const onTouchEnd = () => {
      lastDistRef.current = null;
    };

    outer.addEventListener("touchstart", onTouchStart, { passive: true });
    outer.addEventListener("touchmove", onTouchMove, { passive: false });
    outer.addEventListener("touchend", onTouchEnd);

    return () => {
      outer.removeEventListener("touchstart", onTouchStart);
      outer.removeEventListener("touchmove", onTouchMove);
      outer.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div ref={outerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <div ref={innerRef} style={{ zoom }}>
        <TimetableGrid timetable={timetable} onInstructorClick={onInstructorClick} />
      </div>
    </div>
  );
}
