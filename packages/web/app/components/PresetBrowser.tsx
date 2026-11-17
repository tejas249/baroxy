"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DesignPreset } from "@baroxy/core";
import { DesignSample } from "./DesignSample";

function LazyCard({ preset }: { preset: DesignPreset }) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const c = preset.colors;
  return (
    <article className="pcard" ref={ref}>
      <DesignSample name={preset.name} colors={c} typography={preset.typography} spacing={preset.spacing} motion={preset.motion} loadFonts={near} />
      <div className="pcard-meta">
        <div className="pcard-top">
          <h3>{preset.name}</h3>
          <span className="pcard-mode">{c.mode}</span>
        </div>
        <p className="pcard-insp">{preset.inspiredBy}</p>
        <div className="pcard-row">
          <span className="pcard-swatches" aria-label="Palette">
            {[c.background, c.surface, c.primary, c.secondary, c.accent, c.text].map((hex, i) => (
              <i key={i} style={{ background: hex }} title={hex} />
            ))}
          </span>
          <span className="pcard-fonts">
            {preset.typography.heading.family}
            {preset.typography.body.family !== preset.typography.heading.family ? ` + ${preset.typography.body.family}` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function PresetBrowser({ presets }: { presets: DesignPreset[] }) {
  const [mode, setMode] = useState<"all" | "light" | "dark">("all");
  const [mood, setMood] = useState<string>("all");
  const [q, setQ] = useState("");

  const moods = useMemo(() => {
    const counts = new Map<string, number>();
    presets.forEach((p) => p.moods.forEach((m) => counts.set(m, (counts.get(m) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m);
  }, [presets]);

  const shown = presets.filter((p) => {
    if (mode !== "all" && p.colors.mode !== mode) return false;
    if (mood !== "all" && !p.moods.includes(mood)) return false;
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return [p.name, p.inspiredBy, ...p.industries, ...p.moods, p.typography.heading.family, p.typography.body.family].join(" ").toLowerCase().includes(needle);
  });

  return (
    <>
      <div className="pfilters">
        <input className="psearch" type="search" placeholder="Search by name, industry, font…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search presets" />
        <div className="pseg" role="group" aria-label="Canvas">
          {(["all", "light", "dark"] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m}
            </button>
          ))}
        </div>
        <div className="pmoods" role="group" aria-label="Mood">
          {["all", ...moods].map((m) => (
            <button key={m} type="button" aria-pressed={mood === m} onClick={() => setMood(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <p className="pcount">
        {shown.length} of {presets.length} presets
      </p>
      <div className="pgrid">
        {shown.map((p) => (
          <LazyCard key={p.id} preset={p} />
        ))}
      </div>
      {shown.length === 0 && <p className="sub">No presets match. Try clearing a filter.</p>}
    </>
  );
}
