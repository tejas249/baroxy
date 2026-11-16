import { describe, it, expect } from "vitest";
import { generateColorSystem } from "../src/colors.js";
import { mulberry32 } from "../src/hash.js";

function isHex(s: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(s);
}

describe("generateColorSystem", () => {
  it("returns valid hex colors for every slot", () => {
    const rng = mulberry32(5);
    const colors = generateColorSystem(rng, ["bold"]);
    expect(isHex(colors.primary)).toBe(true);
    expect(isHex(colors.secondary)).toBe(true);
    expect(isHex(colors.accent)).toBe(true);
    expect(isHex(colors.success)).toBe(true);
    expect(isHex(colors.warning)).toBe(true);
    expect(isHex(colors.danger)).toBe(true);
    for (const n of colors.neutral) expect(isHex(n)).toBe(true);
  });

  it("produces a 10-step neutral scale", () => {
    const rng = mulberry32(5);
    const colors = generateColorSystem(rng, []);
    expect(colors.neutral).toHaveLength(10);
  });

  it("is deterministic for the same rng state and mood", () => {
    const a = generateColorSystem(mulberry32(123), ["calm"]);
    const b = generateColorSystem(mulberry32(123), ["calm"]);
    expect(a).toEqual(b);
  });

  it("keeps the overused indigo/violet band only for trustworthy/technical moods", () => {
    // Run many seeds; any base hue landing in [215,280] must only happen for the allowed moods.
    for (let seed = 1; seed < 200; seed++) {
      const playful = generateColorSystem(mulberry32(seed), ["playful"]);
      expect(playful.baseHue < 215 || playful.baseHue > 280).toBe(true);
    }
  });

  it("assigns a harmony from the known set", () => {
    const rng = mulberry32(5);
    const colors = generateColorSystem(rng, []);
    expect(["complementary", "analogous", "triadic", "monochrome-accent"]).toContain(colors.harmony);
  });
});
