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
  const lastDistRef = useRef<number | null>(null);
  const [outerWidth, setOuterWidth] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);

  // Track outer container width for layout width calculation
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const ro = new ResizeObserver(([e]) => setOuterWidth(e.contentRect.width));
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  // Recompute margin-bottom whenever zoom or timetable changes so scroll height is correct.
  // transform: scale doesn't affect layout, so we compensate with margin-bottom:
  //   total block height = offsetHeight + marginBottom = offsetHeight * zoom
  //   → marginBottom = offsetHeight * (zoom - 1)
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const h = inner.offsetHeight; // layout height, unaffected by transform
    setMarginBottom(h * (zoom - 1));
  }, [zoom, timetable]);

  // Auto-fit to container width when timetable changes
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    requestAnimationFrame(() => {
      const outerW = outer.clientWidth;
      setOuterWidth(outerW);
      // Grid has min-w-[600px]; fit it to the container
      const fit = outerW > 0 && 600 > outerW ? outerW / 600 : 1;
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

  // Width = outerWidth / zoom so that after scale(zoom) the element fills outerWidth exactly.
  // Floor at 600px (the grid's minimum) so columns don't collapse below their natural size.
  const layoutWidth = outerWidth > 0 ? Math.max(outerWidth / zoom, 600) : undefined;

  return (
    <div ref={outerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <div
        ref={innerRef}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          width: layoutWidth ? `${layoutWidth}px` : "100%",
          marginBottom: `${marginBottom}px`,
          willChange: "transform",
        }}
      >
        <TimetableGrid timetable={timetable} onInstructorClick={onInstructorClick} />
      </div>
    </div>
  );
}
