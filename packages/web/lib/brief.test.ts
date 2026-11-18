import { describe, it, expect } from "vitest";
import { parseBrief } from "./brief";

describe("parseBrief", () => {
  it("fills defaults for missing or wrongly typed fields", () => {
    const b = parseBrief({ name: 5, industry: null, mood: { a: 1 } });
    expect(b).toEqual({ name: "Untitled Project", industry: "general", audience: "general users", mood: [], references: [] });
  });

  it("accepts comma strings or arrays and trims", () => {
    expect(parseBrief({ mood: " bold , calm " }).mood).toEqual(["bold", "calm"]);
    expect(parseBrief({ mood: ["bold", 3, " calm "] }).mood).toEqual(["bold", "calm"]);
  });

  it("caps the number of list items", () => {
    expect(parseBrief({ mood: Array.from({ length: 50 }, (_, i) => `m${i}`) }).mood).toHaveLength(12);
  });
});
