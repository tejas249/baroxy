import type { ColorSystem, DesignDNA } from "@baroxy/core";

// Extra export formats built from a Design DNA, plus a dependency-free zip writer. Everything
// here is pure so it can run in the browser and be unit tested.

// ---------------------------------------------------------------- colour helpers

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** "H S% L%" triplet, the format shadcn/ui's CSS variables expect. */
export function hexToHslTriplet(hex: string): string {
  const [r8, g8, b8] = hexToRgb(hex);
  const r = r8 / 255;
  const g = g8 / 255;
  const b = b8 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function readableOn(bg: string): string {
  return contrastRatio(bg, "#ffffff") >= contrastRatio(bg, "#0b0b0b") ? "#ffffff" : "#0b0b0b";
}

/**
 * The same palette on the opposite canvas, derived from the tinted neutral scale. The generator
 * designs one canvas per preset; this is a sensible starting point for a dark/light counterpart,
 * not a second hand-tuned palette, and is labelled "derived" wherever it is shown.
 */
export function deriveAlternateColors(colors: ColorSystem): ColorSystem {
  const n = colors.neutral;
  if (n.length < 10) return colors;
  const toDark = colors.mode === "light";
  const pick = (i: number) => n[toDark ? n.length - 1 - i : i];
  const background = toDark ? n[n.length - 1] : n[0];
  return {
    ...colors,
    mode: toDark ? "dark" : "light",
    background,
    surface: pick(1) === background ? pick(2) : pick(1),
    text: toDark ? n[0] : n[n.length - 1],
    muted: toDark ? n[3] : n[6],
    border: pick(2),
    onPrimary: readableOn(colors.primary),
  };
}

// ---------------------------------------------------------------- shadcn/ui

function shadcnBlock(c: ColorSystem, radius: string): string {
  const t = hexToHslTriplet;
  return [
    `--background: ${t(c.background)};`,
    `--foreground: ${t(c.text)};`,
    `--card: ${t(c.surface)};`,
    `--card-foreground: ${t(c.text)};`,
    `--popover: ${t(c.surface)};`,
    `--popover-foreground: ${t(c.text)};`,
    `--primary: ${t(c.primary)};`,
    `--primary-foreground: ${t(c.onPrimary)};`,
    `--secondary: ${t(c.secondary)};`,
    `--secondary-foreground: ${t(readableOn(c.secondary))};`,
    `--muted: ${t(c.surface)};`,
    `--muted-foreground: ${t(c.muted)};`,
    `--accent: ${t(c.accent)};`,
    `--accent-foreground: ${t(readableOn(c.accent))};`,
    `--destructive: ${t(c.danger)};`,
    `--destructive-foreground: ${t(readableOn(c.danger))};`,
    `--border: ${t(c.border)};`,
    `--input: ${t(c.border)};`,
    `--ring: ${t(c.primary)};`,
    `--radius: ${radius};`,
  ]
    .map((l) => `    ${l}`)
    .join("\n");
}

/** Drop-in `globals.css` theme variables for shadcn/ui (HSL triplets), with a derived `.dark` block. */
export function toShadcnTheme(dna: DesignDNA): string {
  const alt = deriveAlternateColors(dna.colors);
  const light = dna.colors.mode === "light" ? dna.colors : alt;
  const dark = dna.colors.mode === "dark" ? dna.colors : alt;
  return `/* Baroxy Design DNA for "${dna.brief.name}" — shadcn/ui theme (preset: ${dna.preset.name}, @baroxy/core@${dna.coreVersion}).
   The ${dna.colors.mode} theme is the designed canvas; the ${alt.mode} theme is derived from the same neutral scale. */
@layer base {
  :root {
${shadcnBlock(light, dna.spacing.radius.md)}
  }

  .dark {
${shadcnBlock(dark, dna.spacing.radius.md)}
  }
}
`;
}

// ---------------------------------------------------------------- Figma / design tokens

/** W3C design-tokens style JSON, importable by Tokens Studio and similar Figma plugins. */
export function toFigmaTokens(dna: DesignDNA): string {
  const c = dna.colors;
  const color = (value: string) => ({ $type: "color", $value: value });
  const tokens = {
    color: {
      background: color(c.background),
      surface: color(c.surface),
      text: color(c.text),
      muted: color(c.muted),
      border: color(c.border),
      primary: color(c.primary),
      "on-primary": color(c.onPrimary),
      secondary: color(c.secondary),
      accent: color(c.accent),
      success: color(c.success),
      warning: color(c.warning),
      danger: color(c.danger),
      neutral: Object.fromEntries(c.neutral.map((v, i) => [String((i + 1) * 100), color(v)])),
    },
    typography: {
      heading: { $type: "fontFamily", $value: dna.typography.heading.family },
      body: { $type: "fontFamily", $value: dna.typography.body.family },
    },
    radius: Object.fromEntries(
      Object.entries(dna.spacing.radius).map(([k, v]) => [k, { $type: "dimension", $value: v }])
    ),
    spacing: Object.fromEntries(
      dna.spacing.scale.map((v, i) => [String(i + 1), { $type: "dimension", $value: `${v}rem` }])
    ),
    motion: {
      easing: { $type: "cubicBezier", $value: dna.motion.easing },
      fast: { $type: "duration", $value: dna.motion.durations.fast },
      base: { $type: "duration", $value: dna.motion.durations.base },
      slow: { $type: "duration", $value: dna.motion.durations.slow },
    },
  };
  return JSON.stringify(tokens, null, 2);
}

// ---------------------------------------------------------------- agent rules

/** A short block to paste into CLAUDE.md, AGENTS.md or .cursorrules so every session follows the contract. */
export function toAgentRules(dna: DesignDNA): string {
  const c = dna.colors;
  return `## Design rules (Baroxy Design DNA for ${dna.brief.name})

Follow \`design-dna/STYLE_CONTRACT.md\` for every UI change. It is binding, not a suggestion.

- Fonts: ${dna.typography.heading.family} for headings, ${dna.typography.body.family} for body. No other typefaces.
- Canvas: ${c.mode} mode by default (background ${c.background}, surface ${c.surface}, text ${c.text}).
- Brand colors: primary ${c.primary}, secondary ${c.secondary}, accent ${c.accent}. Use tokens from \`design-dna/tokens.css\`, never hard-coded colors.
- Radius: ${dna.spacing.name} (sm ${dna.spacing.radius.sm}, md ${dna.spacing.radius.md}, lg ${dna.spacing.radius.lg}).
- Motion: ${dna.motion.name}, easing ${dna.motion.easing}, base duration ${dna.motion.durations.base}.
- Include these signature details:
${dna.signatureDetails.map((d) => `  - ${d}`).join("\n")}
- Never do:
${dna.forbidden.map((f) => `  - ${f}`).join("\n")}
`;
}

// ---------------------------------------------------------------- zip (store only)

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Builds an uncompressed .zip from text files. Enough for a handful of small config files. */
export function buildZip(files: { name: string; content: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  const u16 = (v: number) => [v & 255, (v >>> 8) & 255];
  const u32 = (v: number) => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];

  for (const file of files) {
    const name = enc.encode(file.name);
    const data = enc.encode(file.content);
    const crc = crc32(data);
    // 0x0800 = UTF-8 file names; time/date fixed at 1980-01-01 so output is reproducible.
    const common = [...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0)];
    chunks.push(new Uint8Array([...u32(0x04034b50), ...common]), name, data);
    central.push(
      new Uint8Array([...u32(0x02014b50), ...u16(20), ...common, ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset)]),
      name
    );
    offset += 30 + name.length + data.length;
  }

  const centralSize = central.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(centralSize), ...u32(offset), ...u16(0)]);
  const all = [...chunks, ...central, end];
  const out = new Uint8Array(all.reduce((n, c) => n + c.length, 0));
  let pos = 0;
  for (const c of all) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

export interface ExportFile {
  name: string;
  content: string;
}

/** Every file a user gets, in one place, so the individual buttons and the zip never drift apart. */
export function exportFiles(result: { dna: DesignDNA; markdown: string; css: string; tailwind: string }): ExportFile[] {
  return [
    { name: "design-dna/STYLE_CONTRACT.md", content: result.markdown },
    { name: "design-dna/tokens.css", content: result.css },
    { name: "design-dna/tailwind.tokens.js", content: result.tailwind },
    { name: "design-dna/shadcn-theme.css", content: toShadcnTheme(result.dna) },
    { name: "design-dna/figma-tokens.json", content: toFigmaTokens(result.dna) },
    { name: "design-dna/AGENT_RULES.md", content: toAgentRules(result.dna) },
    { name: "design-dna/design-dna.json", content: JSON.stringify(result.dna, null, 2) },
  ];
}
