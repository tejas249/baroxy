import type { MotionSystem } from "./types.js";

export const MOTION_SYSTEMS: readonly MotionSystem[] = [
  { name: "Snappy", easing: "cubic-bezier(0.2, 0, 0, 1)", durations: { fast: "90ms", base: "150ms", slow: "220ms" } },
  { name: "Smooth", easing: "cubic-bezier(0.4, 0, 0.2, 1)", durations: { fast: "150ms", base: "250ms", slow: "400ms" } },
  { name: "Deliberate", easing: "cubic-bezier(0.65, 0, 0.35, 1)", durations: { fast: "220ms", base: "400ms", slow: "600ms" } },
  { name: "Bouncy", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", durations: { fast: "180ms", base: "320ms", slow: "480ms" } },
  { name: "Minimal", easing: "linear", durations: { fast: "60ms", base: "100ms", slow: "140ms" } },
];

const MOTION_BY_MOOD: Record<string, string> = {
  energetic: "Snappy",
  playful: "Bouncy",
  calm: "Smooth",
  luxury: "Deliberate",
  minimal: "Minimal",
  technical: "Snappy",
  bold: "Snappy",
};

export function pickMotionSystem(rng: () => number, mood: string[]): MotionSystem {
  const key = mood.map((m) => m.toLowerCase()).find((m) => MOTION_BY_MOOD[m]);
  if (key) {
    const match = MOTION_SYSTEMS.find((m) => m.name === MOTION_BY_MOOD[key]);
    if (match) return match;
  }
  return MOTION_SYSTEMS[Math.floor(rng() * MOTION_SYSTEMS.length)];
}
