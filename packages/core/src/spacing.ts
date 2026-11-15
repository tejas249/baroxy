import type { SpacingSystem } from "./types.js";

export const SPACING_SYSTEMS: readonly SpacingSystem[] = [
  { name: "Sharp & Dense", scale: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], radius: { sm: "2px", md: "4px", lg: "6px", full: "9999px" } },
  { name: "Soft & Airy", scale: [0.5, 1, 1.5, 2.5, 4, 6, 8, 12], radius: { sm: "10px", md: "18px", lg: "28px", full: "9999px" } },
  { name: "Boxy & Confident", scale: [0.5, 0.75, 1.25, 2, 3, 4.5, 6, 8], radius: { sm: "0px", md: "0px", lg: "2px", full: "2px" } },
  { name: "Round & Friendly", scale: [0.5, 1, 1.5, 2, 3, 4, 6, 9], radius: { sm: "12px", md: "20px", lg: "32px", full: "9999px" } },
  { name: "Tight & Technical", scale: [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4], radius: { sm: "3px", md: "6px", lg: "8px", full: "9999px" } },
];

export function pickSpacingSystem(rng: () => number): SpacingSystem {
  return SPACING_SYSTEMS[Math.floor(rng() * SPACING_SYSTEMS.length)];
}
