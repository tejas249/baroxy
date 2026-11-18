import { describe, it, expect } from "vitest";
import { scorePresets, tagMatches } from "../src/select.js";
import type { DesignBrief } from "../src/types.js";

function top(industry: string, n = 3): string[] {
  const brief: DesignBrief = { name: "Acme", industry, audience: "people", mood: [] };
  return scorePresets(brief)
    .sort((a, b) => b.score - a.score || a.preset.id.localeCompare(b.preset.id))
    .slice(0, n)
    .map((m) => m.preset.id);
}

describe("tagMatches", () => {
  it("never fires short tags inside longer words", () => {
    expect(tagMatches("retail", "ai")).toBe(false);
    expect(tagMatches("mobile app", "bi")).toBe(false);
    expect(tagMatches("development", "ev")).toBe(false);
    expect(tagMatches("three", "hr")).toBe(false);
  });

  it("matches short tags as whole words", () => {
    expect(tagMatches("ai tools", "ai")).toBe(true);
    expect(tagMatches("hr software", "hr")).toBe(true);
  });

  it("does not match a tag inside a compound word", () => {
    expect(tagMatches("fintech", "tech")).toBe(false);
  });

  it("matches longer tags at the start of a word", () => {
    expect(tagMatches("healthcare", "health")).toBe(true);
    expect(tagMatches("skincare brand", "skincare")).toBe(true);
  });

  it("maps common phrasings to preset tags", () => {
    expect(tagMatches("developer tools", "dev")).toBe(true);
    expect(tagMatches("machine learning", "ai")).toBe(true);
  });
});

describe("scorePresets industry fit", () => {
  it("does not send retail briefs to AI/dev presets", () => {
    const ids = top("retail");
    expect(ids).not.toContain("obsidian-terminal");
    expect(ids).not.toContain("aurora-glow");
  });

  it("sends fintech briefs to finance presets", () => {
    const ids = top("fintech", 5);
    expect(ids).toContain("ledger-green");
    expect(ids).not.toContain("aurora-glow");
  });

  it("still sends developer tools to dev presets", () => {
    const ids = top("developer tools", 12);
    expect(ids.some((id) => ["obsidian-terminal", "mono-edge", "zinc-ledger", "ember-command", "emerald-stack"].includes(id))).toBe(true);
  });

  it("does not match mobile apps to BI dashboards", () => {
    expect(top("mobile app")).not.toContain("data-atlas");
  });
});
