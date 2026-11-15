export interface DesignBrief {
  name: string;
  industry: string;
  audience: string;
  mood: string[];
  references?: string[];
}

export interface FontPairing {
  name: string;
  heading: { family: string; weights: number[]; googleFontUrl: string };
  body: { family: string; weights: number[]; googleFontUrl: string };
  personality: string;
}

export type ColorHarmony = "complementary" | "analogous" | "triadic" | "monochrome-accent";

export interface ColorSystem {
  baseHue: number;
  harmony: ColorHarmony;
  primary: string;
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

export interface DesignDNA {
  brief: DesignBrief;
  /** Deterministic seed derived from the brief — same brief always reproduces the same DNA. */
  seed: number;
  typography: FontPairing;
  colors: ColorSystem;
  spacing: SpacingSystem;
  motion: MotionSystem;
  signatureDetails: string[];
  forbidden: string[];
}
