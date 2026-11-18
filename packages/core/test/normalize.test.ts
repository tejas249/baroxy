import { describe, it, expect } from "vitest";
import { normalizeDesignDNA } from "../src/normalize.js";
import { generateDesignDNA } from "../src/generate.js";
import { toStyleContractMarkdown, toCSSVariables } from "../src/format.js";
import type { DesignDNA } from "../src/types.js";

// A record shaped like one saved by @baroxy/core 0.3.0 (no preset, rationale or colour roles).
function legacy(): DesignDNA {
  const n = Array.from({ length: 10 }, (_, i) => `#${(250 - i * 24).toString(16).padStart(2, "0").repeat(3)}`);
  return {
    brief: { name: "Old Co", industry: "fintech", audience: "founders", mood: ["calm"] },
    seed: 123,
    coreVersion: "0.3.0",
    typography: {
      name: "Editorial Serif",
      heading: { family: "Fraunces", weights: [500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Fraunces&display=swap" },
      body: { family: "Work Sans", weights: [400], googleFontUrl: "https://fonts.googleapis.com/css2?family=Work+Sans&display=swap" },
      personality: "literary",
    },
    colors: { baseHue: 120, harmony: "analogous", primary: "#2a7f3c", secondary: "#3a8f5c", accent: "#9f3a2a", neutral: n, success: "#1f8a4c", warning: "#b7791f", danger: "#c53030" },
    spacing: { name: "Soft & Airy", scale: [1, 2], radius: { sm: "4px", md: "8px", lg: "12px", full: "9999px" } },
    motion: { name: "Smooth", easing: "ease", durations: { fast: "1ms", base: "2ms", slow: "3ms" } },
    signatureDetails: [],
    forbidden: [],
  } as unknown as DesignDNA;
}

describe("normalizeDesignDNA", () => {
  it("fills in preset, rationale and colour roles on a pre-0.4 record", () => {
    const dna = normalizeDesignDNA(legacy());
    expect(dna.preset.id).toBe("legacy");
    expect(dna.rationale).toContain("0.3.0");
    expect(dna.colors.mode).toBe("light");
    expect(dna.colors.background).toMatch(/^#/);
    expect(dna.colors.onPrimary).toMatch(/^#/);
  });

  it("produces output the formatters can render without throwing", () => {
    const dna = normalizeDesignDNA(legacy());
    expect(() => toStyleContractMarkdown(dna)).not.toThrow();
    expect(toCSSVariables(dna)).toContain("--color-bg");
  });

  it("keeps the original brief, typography and seed", () => {
    const old = legacy();
    const dna = normalizeDesignDNA(old);
    expect(dna.brief).toEqual(old.brief);
    expect(dna.typography).toEqual(old.typography);
    expect(dna.seed).toBe(123);
    expect(dna.colors.primary).toBe("#2a7f3c");
  });

  it("returns a current record unchanged", () => {
    const fresh = generateDesignDNA({ name: "New", industry: "coffee", audience: "x", mood: [] });
    expect(normalizeDesignDNA(fresh)).toBe(fresh);
  });

  it("is idempotent", () => {
    const once = normalizeDesignDNA(legacy());
    expect(normalizeDesignDNA(once)).toBe(once);
  });
});
