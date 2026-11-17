import { describe, it, expect } from "vitest";
import { generateDesignDNA } from "../src/generate.js";
import { CORE_VERSION } from "../src/version.js";
import { DESIGN_PRESETS } from "../src/presets.js";
import { SPACING_SYSTEMS } from "../src/spacing.js";
import { MOTION_SYSTEMS } from "../src/motion.js";
import type { DesignBrief } from "../src/types.js";

const baseBrief: DesignBrief = {
  name: "Acme",
  industry: "fintech",
  audience: "solo founders",
  mood: ["trustworthy", "modern"],
};

describe("generateDesignDNA", () => {
  it("is fully deterministic for an identical brief", () => {
    const a = generateDesignDNA(baseBrief);
    const b = generateDesignDNA({ ...baseBrief, mood: [...baseBrief.mood] });
    expect(a).toEqual(b);
  });

  it("stamps the current core version", () => {
    const dna = generateDesignDNA(baseBrief);
    expect(dna.coreVersion).toBe(CORE_VERSION);
  });

  it("is case-insensitive on brief fields that feed the seed", () => {
    const a = generateDesignDNA(baseBrief);
    const b = generateDesignDNA({ ...baseBrief, name: "ACME", industry: "FinTech" });
    expect(a.seed).toBe(b.seed);
  });

  it("produces a different DNA for a different brief", () => {
    const a = generateDesignDNA(baseBrief);
    const b = generateDesignDNA({ ...baseBrief, name: "Zenith" });
    expect(a.seed).not.toBe(b.seed);
  });

  it("always builds the DNA from a known preset", () => {
    const dna = generateDesignDNA(baseBrief);
    const preset = DESIGN_PRESETS.find((p) => p.id === dna.preset.id);
    expect(preset).toBeDefined();
    expect(dna.typography).toEqual(preset!.typography);
    expect(dna.colors).toEqual(preset!.colors);
    expect(dna.rationale.length).toBeGreaterThan(10);
  });

  it("matches presets to the brief's industry and mood", () => {
    const dna = generateDesignDNA({ name: "Roast", industry: "coffee", audience: "commuters", mood: ["warm", "minimal"] });
    const preset = DESIGN_PRESETS.find((p) => p.id === dna.preset.id)!;
    expect(preset.industries.some((i) => ["coffee", "cafe", "food"].includes(i)) || preset.moods.includes("warm")).toBe(true);
  });

  it("honours dark-leaning briefs with dark presets sometimes and light presets other times", () => {
    const modes = new Set<string>();
    for (let i = 0; i < 80; i++) modes.add(generateDesignDNA({ name: `P${i}`, industry: "x", audience: "y", mood: [] }).colors.mode);
    expect(modes.size).toBe(2);
  });

  it("always returns a spacing system from the known pool", () => {
    const dna = generateDesignDNA(baseBrief);
    expect(SPACING_SYSTEMS.map((s) => s.name)).toContain(dna.spacing.name);
  });

  it("always returns a motion system from the known pool", () => {
    const dna = generateDesignDNA(baseBrief);
    expect(MOTION_SYSTEMS.map((m) => m.name)).toContain(dna.motion.name);
  });

  it("hands out exactly 5 unique signature details", () => {
    const dna = generateDesignDNA(baseBrief);
    expect(dna.signatureDetails).toHaveLength(5);
    expect(new Set(dna.signatureDetails).size).toBe(5);
  });

  it("always includes the full fixed anti-pattern list", () => {
    const dna = generateDesignDNA(baseBrief);
    expect(dna.forbidden.length).toBeGreaterThan(0);
  });

  it("spreads unconstrained briefs across most of the preset library", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      seen.add(generateDesignDNA({ name: `Project ${i}`, industry: "x", audience: "y", mood: [] }).preset.id);
    }
    expect(seen.size).toBeGreaterThan(85);
  });

  it("gives briefs with the same industry and mood a varied, relevant set of presets", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) {
      seen.add(generateDesignDNA({ name: `Shop ${i}`, industry: "fintech", audience: "founders", mood: ["trustworthy"] }).preset.id);
    }
    expect(seen.size).toBeGreaterThanOrEqual(4);
  });
});
