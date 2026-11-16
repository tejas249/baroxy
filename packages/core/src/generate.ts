import { hashString, mulberry32, pick, pickMany } from "./hash.js";
import { FONT_PAIRINGS } from "./fonts.js";
import { generateColorSystem } from "./colors.js";
import { pickSpacingSystem } from "./spacing.js";
import { pickMotionSystem } from "./motion.js";
import { SIGNATURE_DETAILS } from "./signatureDetails.js";
import { ANTI_PATTERNS } from "./antiPatterns.js";
import type { DesignBrief, DesignDNA } from "./types.js";

function briefKey(brief: DesignBrief): string {
  return [brief.name, brief.industry, brief.audience, brief.mood.join(","), (brief.references ?? []).join(",")]
    .join("|")
    .toLowerCase();
}

/**
 * Same brief in -> same Design DNA out, every time. Different briefs spread
 * across the whole space of fonts/colors/spacing/motion/details.
 */
export function generateDesignDNA(brief: DesignBrief): DesignDNA {
  const seed = hashString(briefKey(brief)) % 2 ** 31;
  const rng = mulberry32(seed);

  const typography = pick(rng, FONT_PAIRINGS);
  const colors = generateColorSystem(rng, brief.mood);
  const spacing = pickSpacingSystem(rng);
  const motion = pickMotionSystem(rng, brief.mood);
  const signatureDetails = pickMany(rng, SIGNATURE_DETAILS, 5);

  return {
    brief,
    seed,
    typography,
    colors,
    spacing,
    motion,
    signatureDetails,
    forbidden: [...ANTI_PATTERNS],
  };
}
