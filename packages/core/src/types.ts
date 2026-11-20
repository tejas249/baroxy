export interface DesignBrief {
  name: string;
  industry: string;
  audience: string;
  mood: string[];
  references?: string[];
  /** Optional "take" number. 0/undefined is the default result; higher values deterministically give a different preset for the same brief. */
  variant?: number;
}

export interface FontPairing {
  name: string;
  heading: { family: string; weights: number[]; googleFontUrl: string };
  body: { family: string; weights: number[]; googleFontUrl: string };
  personality: string;
}

export type ColorHarmony = "complementary" | "analogous" | "triadic" | "monochrome-accent" | "preset";

export interface ColorSystem {
  baseHue: number;
  harmony: ColorHarmony;
  /** Whether the palette is designed for a light or a dark canvas. */
  mode: "light" | "dark";
  /** Page canvas colour. */
  background: string;
  /** Raised surface (cards, panels, inputs). */
  surface: string;
  /** Primary body text. */
  text: string;
  /** Secondary / muted text. */
  muted: string;
  /** Hairlines and component borders. */
  border: string;
  primary: string;
  /** Readable text colour to place on top of `primary`. */
  onPrimary: string;
  secondary: string;
  accent: string;
  /** 10 steps, lightest to darkest, tinted toward baseHue instead of pure gray. */
  neutral: string[];
  success: string;
  warning: string;
  danger: string;
}

export interface SpacingSystem {
  name: string;
  /** rem values */
  scale: number[];
  radius: { sm: string; md: string; lg: string; full: string };
}

export interface MotionSystem {
  name: string;
  easing: string;
  durations: { fast: string; base: string; slow: string };
}

/** A complete, curated design identity the generator can start from. */
export interface DesignPreset {
  id: string;
  name: string;
  /** The design language this preset is inspired by (never a verbatim copy). */
  inspiredBy: string;
  moods: string[];
  industries: string[];
  colors: ColorSystem;
  typography: FontPairing;
  spacing: SpacingSystem;
  motion: MotionSystem;
}

export interface DesignDNA {
  brief: DesignBrief;
  /** Deterministic seed derived from the brief — same brief always reproduces the same DNA. */
  seed: number;
  /**
   * The @baroxy/core version that produced this DNA. Determinism is guaranteed *within* a
   * version — a later version may expand the font/spacing/motion/signature-detail pools and
   * shift the output for the same brief. Pin this exact core version if you need to reproduce
   * this DNA again later. See CHANGELOG.md.
   */
  coreVersion: string;
  /** The curated preset this DNA was built from. */
  preset: { id: string; name: string; inspiredBy: string };
  /** Plain-language reason this preset fits the brief. */
  rationale: string;
  typography: FontPairing;
  colors: ColorSystem;
  spacing: SpacingSystem;
  motion: MotionSystem;
  signatureDetails: string[];
  forbidden: string[];
}
