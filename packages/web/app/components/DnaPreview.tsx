"use client";

import { useState, type ReactNode } from "react";
import { Type, Palette, Ruler, Zap, CheckSquare, Ban, Download } from "lucide-react";
import type { DesignDNA } from "@baroxy/core";

export interface GenerateResult {
  dna: DesignDNA;
  markdown: string;
  css: string;
  tailwind: string;
}

export function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function BlockTitle({ icon: Icon, children }: { icon: typeof Type; children: ReactNode }) {
  return (
    <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon size={17} strokeWidth={2} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
      {children}
    </h3>
  );
}

export function DnaPreview({ result, children }: { result: GenerateResult; children?: ReactNode }) {
  const { dna } = result;
  const fontLinks = Array.from(
    new Set([dna.typography.heading.googleFontUrl, dna.typography.body.googleFontUrl])
  );
  const semanticKeys = ["primary", "secondary", "accent", "success", "warning", "danger"] as const;

  return (
    <section className="preview">
      {fontLinks.map((href) => (
        <link rel="stylesheet" href={href} key={href} />
      ))}

      <h2>
        Design DNA — seed {dna.seed} <span className="version-tag">@baroxy/core@{dna.coreVersion}</span>
      </h2>

      <div className="block">
        <BlockTitle icon={Type}>Typography — {dna.typography.name}</BlockTitle>
        <p
          style={{
            fontFamily: `"${dna.typography.heading.family}", sans-serif`,
            fontSize: "2rem",
            fontWeight: dna.typography.heading.weights[dna.typography.heading.weights.length - 1],
            margin: "0 0 8px",
            overflowWrap: "anywhere",
          }}
        >
          {dna.brief.name || "Your heading, in this font"}
        </p>
        <p style={{ fontFamily: `"${dna.typography.body.family}", sans-serif`, margin: 0 }}>
          Body text set in {dna.typography.body.family}. {dna.typography.personality}.
        </p>
      </div>

      <div className="block">
        <BlockTitle icon={Palette}>Colors — {dna.colors.harmony}</BlockTitle>
        <div className="swatches">
          {semanticKeys.map((key) => (
            <div key={key} className="swatch">
              <div className="swatch-color" style={{ background: dna.colors[key] }} />
              <span>{key}</span>
              <code>{dna.colors[key]}</code>
            </div>
          ))}
        </div>
        <div className="neutral-row">
          {dna.colors.neutral.map((c, i) => (
            <div key={i} className="neutral-chip" style={{ background: c }} title={c} />
          ))}
        </div>
      </div>

      <div className="block">
        <BlockTitle icon={Ruler}>Spacing & radius — {dna.spacing.name}</BlockTitle>
        <div className="scale-row">
          {dna.spacing.scale.map((v, i) => (
            <div key={i} className="scale-box" style={{ width: `${v * 16}px`, borderRadius: dna.spacing.radius.sm }} />
          ))}
        </div>
      </div>

      <div className="block">
        <BlockTitle icon={Zap}>Motion — {dna.motion.name}</BlockTitle>
        <MotionDemo easing={dna.motion.easing} duration={dna.motion.durations.base} accent={dna.colors.accent} />
      </div>

      <div className="block">
        <BlockTitle icon={CheckSquare}>Signature details (mandatory)</BlockTitle>
        <ul>
          {dna.signatureDetails.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div className="block">
        <BlockTitle icon={Ban}>Forbidden</BlockTitle>
        <ul>
          {dna.forbidden.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="downloads">
        <button onClick={() => download("STYLE_CONTRACT.md", result.markdown)}>
          <Download size={15} strokeWidth={2} /> STYLE_CONTRACT.md
        </button>
        <button onClick={() => download("tokens.css", result.css)}>
          <Download size={15} strokeWidth={2} /> tokens.css
        </button>
        <button onClick={() => download("tailwind.tokens.js", result.tailwind)}>
          <Download size={15} strokeWidth={2} /> tailwind.tokens.js
        </button>
        <button onClick={() => download("design-dna.json", JSON.stringify(dna, null, 2))}>
          <Download size={15} strokeWidth={2} /> design-dna.json
        </button>
      </div>

      {children}
    </section>
  );
}

function MotionDemo({ easing, duration, accent }: { easing: string; duration: string; accent: string }) {
  const [moved, setMoved] = useState(false);
  return (
    <button
      className="motion-demo"
      onClick={() => setMoved((m) => !m)}
      style={{
        transform: moved ? "translateX(140px)" : "translateX(0)",
        transition: `transform ${duration} ${easing}`,
        background: accent,
      }}
    >
      click me
    </button>
  );
}
