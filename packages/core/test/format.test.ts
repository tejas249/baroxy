import { describe, it, expect } from "vitest";
import { generateDesignDNA } from "../src/generate.js";
import { toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "../src/format.js";

const dna = generateDesignDNA({ name: "Acme", industry: "fintech", audience: "founders", mood: ["bold"] });

describe("toStyleContractMarkdown", () => {
  const md = toStyleContractMarkdown(dna);

  it("includes the brief name and core version", () => {
    expect(md).toContain("Acme");
    expect(md).toContain(dna.coreVersion);
  });

  it("includes every signature detail and forbidden rule", () => {
    for (const d of dna.signatureDetails) expect(md).toContain(d);
    for (const f of dna.forbidden) expect(md).toContain(f);
  });

  it("includes the typography and color values", () => {
    expect(md).toContain(dna.typography.heading.family);
    expect(md).toContain(dna.colors.primary);
  });
});

describe("toCSSVariables", () => {
  const css = toCSSVariables(dna);

  it("defines the core custom properties", () => {
    for (const name of ["--font-heading", "--font-body", "--color-primary", "--color-accent", "--radius-md", "--ease"]) {
      expect(css).toContain(name);
    }
  });

  it("defines all 10 neutral steps", () => {
    for (let i = 1; i <= 10; i++) expect(css).toContain(`--color-neutral-${i}:`);
  });
});

describe("toTailwindTokens", () => {
  const tw = toTailwindTokens(dna);

  it("is valid-looking JS exporting baroxyTokens", () => {
    expect(tw).toContain("export const baroxyTokens");
  });

  it("includes every neutral step keyed by 100-1000", () => {
    for (let i = 1; i <= 10; i++) expect(tw).toContain(`${i * 100}:`);
  });
});
