import { describe, it, expect } from "vitest";
import { hashString, mulberry32, pick, pickMany } from "../src/hash.js";

describe("hashString", () => {
  it("is deterministic for the same input", () => {
    expect(hashString("acme|fintech")).toBe(hashString("acme|fintech"));
  });

  it("differs for different input", () => {
    expect(hashString("acme|fintech")).not.toBe(hashString("acme|devtools"));
  });

  it("returns a non-negative number", () => {
    for (const s of ["", "a", "a longer string with spaces", "🚀 emoji"]) {
      expect(hashString(s)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces values in [0, 1)", () => {
    const rng = mulberry32(12345);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(1)();
    const b = mulberry32(2)();
    expect(a).not.toBe(b);
  });
});

describe("pick", () => {
  it("always returns an item from the array", () => {
    const items = ["a", "b", "c"];
    const rng = mulberry32(7);
    for (let i = 0; i < 50; i++) {
      expect(items).toContain(pick(rng, items));
    }
  });
});

describe("pickMany", () => {
  it("returns the requested count with no duplicates", () => {
    const items = Array.from({ length: 20 }, (_, i) => `item-${i}`);
    const rng = mulberry32(99);
    const result = pickMany(rng, items, 5);
    expect(result).toHaveLength(5);
    expect(new Set(result).size).toBe(5);
    for (const r of result) expect(items).toContain(r);
  });

  it("caps at the pool size when count exceeds it", () => {
    const items = ["a", "b", "c"];
    const rng = mulberry32(1);
    expect(pickMany(rng, items, 10)).toHaveLength(3);
  });
});
