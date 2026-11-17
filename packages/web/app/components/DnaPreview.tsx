"use client";

import { useState, type ReactNode } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import type { DesignDNA } from "@baroxy/core";
import { DesignSample } from "./DesignSample";

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

function BlockTitle({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h3 className="block-title">
      <span>{n}</span>
      {children}
    </h3>
  );
}

export function DnaPreview({ result, children }: { result: GenerateResult; children?: ReactNode }) {
  const { dna } = result;
  const { colors } = dna;
  const roles: { label: string; value: string }[] = [
    { label: "Background", value: colors.background },
    { label: "Surface", value: colors.surface },
    { label: "Text", value: colors.text },
    { label: "Muted", value: colors.muted },
    { label: "Border", value: colors.border },
    { label: "Primary", value: colors.primary },
    { label: "Secondary", value: colors.secondary },
    { label: "Accent", value: colors.accent },
    { label: "Success", value: colors.success },
    { label: "Warning", value: colors.warning },
    { label: "Danger", value: colors.danger },
  ];
  const fontLinks = Array.from(new Set([dna.typography.heading.googleFontUrl, dna.typography.body.googleFontUrl]));

  return (
    <section className="preview">
      {fontLinks.map((href) => (
        <link rel="stylesheet" href={href} key={href} />
      ))}

      <div className="preview-head">
        <p className="eyebrow">
          Preset / {dna.preset.name} <span className="version-tag">@baroxy/core@{dna.coreVersion}</span>
        </p>
        <h2>{dna.brief.name}</h2>
        <p className="preview-why">{dna.rationale}</p>
      </div>

      <DesignSample
        size="full"
        name={dna.brief.name}
        colors={dna.colors}
        typography={dna.typography}
        spacing={dna.spacing}
        motion={dna.motion}
      />
      <p className="preview-caption">
        Live sample rendered with your tokens: {dna.typography.heading.family}, {dna.colors.mode} canvas, {dna.spacing.name.toLowerCase()} radius, {dna.motion.name.toLowerCase()} motion. Hover the buttons.
      </p>

      <div className="block">
        <BlockTitle n="01">Typography · {dna.typography.name}</BlockTitle>
        <p
          style={{
            fontFamily: `"${dna.typography.heading.family}", sans-serif`,
            fontSize: "2.4rem",
            lineHeight: 1.1,
            fontWeight: dna.typography.heading.weights[dna.typography.heading.weights.length - 1],
            margin: "0 0 10px",
            overflowWrap: "anywhere",
          }}
        >
          {dna.brief.name || "Your heading, in this font"}
        </p>
        <p style={{ fontFamily: `"${dna.typography.body.family}", sans-serif`, margin: 0 }}>
          Body set in {dna.typography.body.family}. {dna.typography.personality}.
        </p>
      </div>

      <div className="block">
        <BlockTitle n="02">Colour · {colors.mode} canvas</BlockTitle>
        <div className="swatches">
          {roles.map((r) => (
            <div key={r.label} className="swatch">
              <div className="swatch-color" style={{ background: r.value }} />
              <span>{r.label}</span>
              <code>{r.value}</code>
            </div>
          ))}
        </div>
        <div className="neutral-row">
          {colors.neutral.map((c, i) => (
            <div key={i} className="neutral-chip" style={{ background: c }} title={c} />
          ))}
        </div>
      </div>

      <div className="block">
        <BlockTitle n="03">Spacing &amp; radius · {dna.spacing.name}</BlockTitle>
        <div className="scale-row">
          {dna.spacing.scale.map((v, i) => (
            <div key={i} className="scale-box" style={{ width: `${v * 16}px`, borderRadius: dna.spacing.radius.sm }} />
          ))}
        </div>
      </div>

      <div className="block">
        <BlockTitle n="04">Motion · {dna.motion.name}</BlockTitle>
        <MotionDemo easing={dna.motion.easing} duration={dna.motion.durations.base} accent={dna.colors.accent} />
      </div>

      <div className="block">
        <BlockTitle n="05">Signature details (mandatory)</BlockTitle>
        <ul>
          {dna.signatureDetails.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div className="block">
        <BlockTitle n="06">Forbidden</BlockTitle>
        <ul>
          {dna.forbidden.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="downloads">
        <button onClick={() => download("STYLE_CONTRACT.md", result.markdown)}>
          <DownloadSimple size={16} weight="bold" /> STYLE_CONTRACT.md
        </button>
        <button onClick={() => download("tokens.css", result.css)}>
          <DownloadSimple size={16} weight="bold" /> tokens.css
        </button>
        <button onClick={() => download("tailwind.tokens.js", result.tailwind)}>
          <DownloadSimple size={16} weight="bold" /> tailwind.tokens.js
        </button>
        <button onClick={() => download("design-dna.json", JSON.stringify(dna, null, 2))}>
          <DownloadSimple size={16} weight="bold" /> design-dna.json
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
