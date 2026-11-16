import { describe, it, expect } from "vitest";
import { FONT_PAIRINGS } from "../src/fonts.js";
import { SPACING_SYSTEMS } from "../src/spacing.js";
import { MOTION_SYSTEMS } from "../src/motion.js";
import { SIGNATURE_DETAILS } from "../src/signatureDetails.js";
import { ANTI_PATTERNS } from "../src/antiPatterns.js";

describe("FONT_PAIRINGS", () => {
  it("has no duplicate names", () => {
    const names = FONT_PAIRINGS.map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every pairing has a well-formed Google Fonts URL and at least one weight per face", () => {
    for (const f of FONT_PAIRINGS) {
      expect(f.heading.googleFontUrl).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?family=/);
      expect(f.body.googleFontUrl).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?family=/);
      expect(f.heading.weights.length).toBeGreaterThan(0);
      expect(f.body.weights.length).toBeGreaterThan(0);
      expect(f.personality.length).toBeGreaterThan(0);
    }
  });

  it("has at least 30 pairings (variety floor)", () => {
    expect(FONT_PAIRINGS.length).toBeGreaterThanOrEqual(30);
  });
});

describe("SPACING_SYSTEMS", () => {
  it("has no duplicate names and a complete radius set per system", () => {
    const names = SPACING_SYSTEMS.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
    for (const s of SPACING_SYSTEMS) {
      expect(s.scale.length).toBeGreaterThan(0);
      expect(s.radius.sm).toBeTruthy();
      expect(s.radius.md).toBeTruthy();
      expect(s.radius.lg).toBeTruthy();
      expect(s.radius.full).toBeTruthy();
    }
  });
});

describe("MOTION_SYSTEMS", () => {
  it("has no duplicate names and valid easing/durations", () => {
    const names = MOTION_SYSTEMS.map((m) => m.name);
    expect(new Set(names).size).toBe(names.length);
    for (const m of MOTION_SYSTEMS) {
      expect(m.easing.length).toBeGreaterThan(0);
      expect(m.durations.fast).toMatch(/ms$/);
      expect(m.durations.base).toMatch(/ms$/);
      expect(m.durations.slow).toMatch(/ms$/);
    }
  });
});

describe("SIGNATURE_DETAILS", () => {
  it("has no duplicates and at least 25 entries", () => {
    expect(new Set(SIGNATURE_DETAILS).size).toBe(SIGNATURE_DETAILS.length);
    expect(SIGNATURE_DETAILS.length).toBeGreaterThanOrEqual(25);
  });
});

describe("ANTI_PATTERNS", () => {
  it("has no duplicates", () => {
    expect(new Set(ANTI_PATTERNS).size).toBe(ANTI_PATTERNS.length);
  });
});
