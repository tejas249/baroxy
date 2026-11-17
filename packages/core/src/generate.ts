import { hashString, mulberry32, pickMany } from "./hash.js";
import { choosePreset, describeFit } from "./select.js";
import { SIGNATURE_DETAILS } from "./signatureDetails.js";
import { ANTI_PATTERNS } from "./antiPatterns.js";
import { CORE_VERSION } from "./version.js";
import type { DesignBrief, DesignDNA } from "./types.js";

function briefKey(brief: DesignBrief): string {
  return [brief.name, brief.industry, brief.audience, brief.mood.join(","), (brief.references ?? []).join(",")]
    .join("|")
    .toLowerCase();
}

/**
 * Same brief in -> same Design DNA out, every time. Different briefs spread
 * across 100+ curated design presets, then get their own signature details.
 */
export function generateDesignDNA(brief: DesignBrief): DesignDNA {
  const seed = hashString(briefKey(brief)) % 2 ** 31;
  const rng = mulberry32(seed);

  const match = choosePreset(rng, brief);
  const { preset } = match;
  const signatureDetails = pickMany(rng, SIGNATURE_DETAILS, 5);

  return {
    brief,
    seed,
    coreVersion: CORE_VERSION,
    preset: { id: preset.id, name: preset.name, inspiredBy: preset.inspiredBy },
    rationale: describeFit(match),
    typography: preset.typography,
    colors: preset.colors,
    spacing: preset.spacing,
    motion: preset.motion,
    signatureDetails,
    forbidden: [...ANTI_PATTERNS],
  };
}
