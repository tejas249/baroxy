import type { ColorSystem, ColorHarmony } from "./types.js";

// The hue band almost every AI-default hero gradient lives in (blue -> indigo -> violet -> purple).
// We steer away from it unless the brief's mood explicitly wants that "corporate/trustworthy" register.
const OVERUSED_HUE_BAND: [number, number] = [215, 280];

const HARMONY_BY_MOOD: Record<string, ColorHarmony> = {
  energetic: "triadic",
  bold: "complementary",
  playful: "triadic",
  calm: "analogous",
  minimal: "monochrome-accent",
  luxury: "monochrome-accent",
  trustworthy: "analogous",
  warm: "analogous",
  technical: "complementary",
};

const HARMONY_OPTIONS: readonly ColorHarmony[] = ["complementary", "analogous", "triadic"];

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function escapeOverusedBand(hue: number): number {
  const [lo, hi] = OVERUSED_HUE_BAND;
  if (hue >= lo && hue <= hi) {
    return (hue + (hi - lo) + 20) % 360;
  }
  return hue;
}

export function generateColorSystem(rng: () => number, mood: string[]): ColorSystem {
  const rawHue = Math.floor(rng() * 360);
  const moodKeys = mood.map((m) => m.toLowerCase());
  const moodKey = moodKeys.find((m) => HARMONY_BY_MOOD[m]);

  // "trustworthy"/"technical" are the only moods allowed to keep the blue/indigo band —
  // everyone else gets steered out of it.
  const allowOverusedBand = moodKey === "trustworthy" || moodKey === "technical";
  const baseHue = allowOverusedBand ? rawHue : escapeOverusedBand(rawHue);

  const harmony: ColorHarmony = moodKey ? HARMONY_BY_MOOD[moodKey] : HARMONY_OPTIONS[Math.floor(rng() * HARMONY_OPTIONS.length)];

  const saturation = 55 + Math.floor(rng() * 30); // 55-85
  const lightness = 45 + Math.floor(rng() * 10); // 45-55

  let secondaryHue: number;
  let accentHue: number;
  switch (harmony) {
    case "complementary":
      secondaryHue = (baseHue + 150) % 360;
      accentHue = (baseHue + 180) % 360;
      break;
    case "triadic":
      secondaryHue = (baseHue + 120) % 360;
      accentHue = (baseHue + 240) % 360;
      break;
    case "monochrome-accent":
      secondaryHue = baseHue;
      accentHue = (baseHue + 40) % 360;
      break;
    default: // analogous
      secondaryHue = (baseHue + 30) % 360;
      accentHue = (baseHue - 30 + 360) % 360;
  }

  // Neutral scale is tinted toward baseHue at low saturation, instead of pure gray —
  // a small detail that makes the whole palette feel designed rather than default.
  const neutral = Array.from({ length: 10 }, (_, i) => {
    const step = i / 9; // 0 (lightest) -> 1 (darkest)
    const l = 97 - step * 92;
    return hslToHex(baseHue, 8, l);
  });

  const background = neutral[0];
  const text = neutral[9];
  return {
    baseHue,
    harmony,
    mode: "light",
    background,
    surface: "#ffffff",
    text,
    muted: neutral[5],
    border: neutral[2],
    onPrimary: "#ffffff",
    primary: hslToHex(baseHue, saturation, lightness),
    secondary: hslToHex(secondaryHue, saturation - 10, lightness + 5),
    accent: hslToHex(accentHue, Math.min(saturation + 10, 90), lightness),
    neutral,
    success: hslToHex(142, 45, 42),
    warning: hslToHex(38, 80, 50),
    danger: hslToHex(4, 70, 50),
  };
}
