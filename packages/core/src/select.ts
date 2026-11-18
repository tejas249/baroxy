import { DESIGN_PRESETS } from "./presets.js";
import type { DesignBrief, DesignPreset } from "./types.js";

const MOOD_ALIASES: Record<string, string> = {
  luxury: "premium",
  luxurious: "premium",
  elegant: "premium",
  upscale: "premium",
  clean: "minimal",
  simple: "minimal",
  friendly: "warm",
  cozy: "warm",
  fun: "playful",
  whimsical: "playful",
  vibrant: "energetic",
  dynamic: "energetic",
  fast: "energetic",
  edgy: "bold",
  loud: "bold",
  professional: "trustworthy",
  reliable: "trustworthy",
  secure: "trustworthy",
  serious: "trustworthy",
  peaceful: "calm",
  relaxed: "calm",
  soothing: "calm",
  futuristic: "modern",
  sleek: "modern",
  geeky: "technical",
  nerdy: "technical",
};

function normalizeMoods(mood: string[]): string[] {
  return mood
    .flatMap((m) => m.toLowerCase().split(/[\s/]+/))
    .map((m) => m.trim())
    .filter(Boolean)
    .map((m) => MOOD_ALIASES[m] ?? m);
}

// Words people type that map onto the short tags used by presets.
const TAG_SYNONYMS: Record<string, string> = {
  developer: "dev",
  developers: "dev",
  devtools: "dev",
  software: "saas",
  "artificial intelligence": "ai",
  "machine learning": "ai",
  llm: "ai",
  "web3": "crypto",
  blockchain: "crypto",
  "e-commerce": "ecommerce",
  "online store": "ecommerce",
  shop: "ecommerce",
  restaurants: "restaurant",
  "mental health": "mental health",
};

/** Lower-case, expand synonyms, so "developer tools" also reads as "dev". */
function expandText(text: string): string {
  let out = ` ${text.toLowerCase().replace(/[^a-z0-9+&\- ]+/g, " ")} `;
  for (const [from, to] of Object.entries(TAG_SYNONYMS)) {
    if (out.includes(` ${from} `) || out.includes(` ${from}s `)) out += ` ${to} `;
  }
  return out;
}

/**
 * Whole-word tag match. Short tags (<= 3 chars, e.g. "ai", "bi", "ev", "hr") must be an exact
 * word so they never fire inside "retail", "mobile" or "development". Longer tags must start a
 * word, so "health" matches "healthcare" but "tech" does not match "fintech".
 */
export function tagMatches(text: string, tag: string): boolean {
  const hay = expandText(text);
  const needle = tag.toLowerCase();
  if (needle.length <= 3) return hay.includes(` ${needle} `) || hay.includes(` ${needle}s `);
  return hay.includes(` ${needle}`);
}

export interface PresetMatch {
  preset: DesignPreset;
  score: number;
  reasons: string[];
}

/** Score every preset against the brief. Higher = a better fit. */
export function scorePresets(brief: DesignBrief): PresetMatch[] {
  const moods = normalizeMoods(brief.mood);
  const space = `${brief.industry} ${brief.name}`;
  const people = `${brief.audience} ${(brief.references ?? []).join(" ")}`;

  return DESIGN_PRESETS.map((preset) => {
    let score = 0;
    const reasons: string[] = [];

    const moodHits = preset.moods.filter((m) => moods.includes(m));
    if (moodHits.length) {
      score += moodHits.length * 3;
      reasons.push(`its ${moodHits.join(" + ")} mood matches your vibe`);
    }

    const spaceHits = preset.industries.filter((tag) => tagMatches(space, tag));
    if (spaceHits.length) {
      score += 8 + (spaceHits.length - 1);
      reasons.push(`it was drawn for ${spaceHits[0]}`);
    }

    const peopleHits = preset.industries.filter((tag) => tagMatches(people, tag));
    if (peopleHits.length) {
      score += 1;
      reasons.push(`it speaks to ${peopleHits[0]} audiences`);
    }

    return { preset, score, reasons };
  });
}

/**
 * Pick a preset: take the best-fitting handful and let the brief's seed choose
 * among them, so similar briefs still get different, but relevant, identities.
 */
export function choosePreset(rng: () => number, brief: DesignBrief): PresetMatch {
  const scored = scorePresets(brief);
  const ranked = [...scored].sort((a, b) => b.score - a.score || a.preset.id.localeCompare(b.preset.id));
  const top = ranked[0].score;
  if (top === 0) {
    const m = scored[Math.floor(rng() * scored.length)];
    return { ...m, reasons: ["it was selected from across the full preset library to give your brief a distinctive starting point"] };
  }
  const pool = ranked.filter((m) => m.score >= Math.max(1, top * 0.5)).slice(0, 8);
  return pool[Math.floor(rng() * pool.length)];
}

export function describeFit(match: PresetMatch): string {
  const { preset, reasons } = match;
  const why = reasons.length ? reasons.join(", and ") : "it fits";
  return `${preset.name} (${preset.inspiredBy}) was chosen because ${why}.`;
}
