import { describe, it, expect } from "vitest";
import { DESIGN_PRESETS, contrast } from "../src/presets.js";
import { SPACING_SYSTEMS } from "../src/spacing.js";
import { MOTION_SYSTEMS } from "../src/motion.js";

const HEX = /^#[0-9a-f]{6}$/i;

describe("DESIGN_PRESETS", () => {
  it("ships at least 100 presets with unique ids and names", () => {
    expect(DESIGN_PRESETS.length).toBeGreaterThanOrEqual(100);
    expect(new Set(DESIGN_PRESETS.map((p) => p.id)).size).toBe(DESIGN_PRESETS.length);
    expect(new Set(DESIGN_PRESETS.map((p) => p.name)).size).toBe(DESIGN_PRESETS.length);
  });

  it("has no two presets with the same primary + background", () => {
    const keys = DESIGN_PRESETS.map((p) => `${p.colors.primary}|${p.colors.background}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("uses only valid hex colours everywhere", () => {
    for (const p of DESIGN_PRESETS) {
      const c = p.colors;
      for (const v of [c.background, c.surface, c.text, c.muted, c.border, c.primary, c.onPrimary, c.secondary, c.accent, ...c.neutral]) {
        expect(v, p.id).toMatch(HEX);
      }
      expect(c.neutral).toHaveLength(10);
    }
  });

  it("keeps body text, muted text and the primary colour readable on the canvas", () => {
    for (const p of DESIGN_PRESETS) {
      const c = p.colors;
      expect(contrast(c.text, c.background), `${p.id} text`).toBeGreaterThanOrEqual(7);
      expect(contrast(c.muted, c.background), `${p.id} muted`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.primary, c.background), `${p.id} primary`).toBeGreaterThanOrEqual(1.2);
      expect(contrast(c.onPrimary, c.primary), `${p.id} onPrimary`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("references real spacing and motion systems and Google font urls", () => {
    for (const p of DESIGN_PRESETS) {
      expect(SPACING_SYSTEMS.map((s) => s.name)).toContain(p.spacing.name);
      expect(MOTION_SYSTEMS.map((m) => m.name)).toContain(p.motion.name);
      expect(p.typography.heading.googleFontUrl).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?family=/);
      expect(p.typography.body.googleFontUrl).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?family=/);
      expect(p.moods.length).toBeGreaterThan(0);
      expect(p.industries.length).toBeGreaterThan(0);
    }
  });

  it("avoids the four default AI-UI typefaces", () => {
    const banned = ["Inter", "Roboto", "Open Sans", "Poppins"];
    for (const p of DESIGN_PRESETS) {
      expect(banned).not.toContain(p.typography.heading.family);
      expect(banned).not.toContain(p.typography.body.family);
    }
  });

  it("covers both light and dark canvases and many type families", () => {
    expect(DESIGN_PRESETS.filter((p) => p.colors.mode === "dark").length).toBeGreaterThan(20);
    expect(DESIGN_PRESETS.filter((p) => p.colors.mode === "light").length).toBeGreaterThan(40);
    const families = new Set(DESIGN_PRESETS.flatMap((p) => [p.typography.heading.family, p.typography.body.family]));
    expect(families.size).toBeGreaterThan(50);
  });
});
