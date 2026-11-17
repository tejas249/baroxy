"use client";

import type { MouseEvent, ReactNode } from "react";

/** Glass card with a soft spotlight that follows the cursor (Aceternity-style). */
export default function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={`glass-card ${className}`} onMouseMove={onMove}>
      {children}
    </div>
  );
}
