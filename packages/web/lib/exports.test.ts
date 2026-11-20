import { describe, expect, it } from "vitest";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";
import {
  buildZip,
  contrastRatio,
  crc32,
  deriveAlternateColors,
  exportFiles,
  hexToHslTriplet,
  toAgentRules,
  toFigmaTokens,
  toShadcnTheme,
} from "./exports";

const dna = generateDesignDNA({ name: "Acme", industry: "fintech", audience: "founders", mood: ["bold"], references: [] });
const result = { dna, markdown: toStyleContractMarkdown(dna), css: toCSSVariables(dna), tailwind: toTailwindTokens(dna) };

describe("colour helpers", () => {
  it("converts hex to an HSL triplet", () => {
    expect(hexToHslTriplet("#ff0000")).toBe("0 100% 50%");
    expect(hexToHslTriplet("#ffffff")).toBe("0 0% 100%");
  });
  it("computes WCAG contrast", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });
  it("derives the opposite canvas", () => {
    const alt = deriveAlternateColors(dna.colors);
    expect(alt.mode).not.toBe(dna.colors.mode);
    expect(alt.primary).toBe(dna.colors.primary);
  });
});

describe("exports", () => {
  it("builds a shadcn theme with light and dark blocks", () => {
    const css = toShadcnTheme(dna);
    expect(css).toContain(":root");
    expect(css).toContain(".dark");
    expect(css).toContain("--primary:");
  });
  it("emits valid figma tokens JSON", () => {
    const tokens = JSON.parse(toFigmaTokens(dna));
    expect(tokens.color.primary.$value).toBe(dna.colors.primary);
  });
  it("includes the fonts and forbidden list in agent rules", () => {
    const rules = toAgentRules(dna);
    expect(rules).toContain(dna.typography.heading.family);
    expect(rules).toContain(dna.forbidden[0]);
  });
  it("lists every file once", () => {
    const names = exportFiles(result).map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("design-dna/shadcn-theme.css");
  });
});

describe("zip", () => {
  it("computes a known CRC-32", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
  });
  it("writes a well-formed archive", () => {
    const zip = buildZip([{ name: "a.txt", content: "hello" }, { name: "b/c.txt", content: "world" }]);
    const view = new DataView(zip.buffer);
    expect(view.getUint32(0, true)).toBe(0x04034b50);
    expect(view.getUint32(zip.length - 22, true)).toBe(0x06054b50);
    expect(view.getUint16(zip.length - 22 + 10, true)).toBe(2);
  });
});
