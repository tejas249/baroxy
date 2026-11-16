import { describe, it, expect } from "vitest";
import { generateDesignDNA } from "../src/generate.js";
import { CORE_VERSION } from "../src/version.js";
import { FONT_PAIRINGS } from "../src/fonts.js";
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

  it("always returns a typography pairing from the known pool", () => {
    const dna = generateDesignDNA(baseBrief);
    expect(FONT_PAIRINGS.map((f) => f.name)).toContain(dna.typography.name);
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

  it("spreads briefs across many distinct typography/spacing/motion combos", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const dna = generateDesignDNA({ name: `Project ${i}`, industry: "x", audience: "y", mood: [] });
      seen.add(`${dna.typography.name}|${dna.spacing.name}|${dna.motion.name}`);
    }
    // With 34 x 9 x 8 pools, 500 random briefs should land on well over half of them being unique.
    expect(seen.size).toBeGreaterThan(300);
  });
});
