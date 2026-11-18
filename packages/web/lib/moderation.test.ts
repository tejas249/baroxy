import { describe, it, expect } from "vitest";
import { validateBrief, type BriefInput } from "./moderation";

const ok: BriefInput = { name: "Acme", industry: "fintech", audience: "founders", mood: ["calm"], references: ["stripe.com"] };
const with_ = (patch: Partial<BriefInput>): BriefInput => ({ ...ok, ...patch });

describe("validateBrief", () => {
  it("accepts a normal brief, including bare-domain references", () => {
    expect(validateBrief(ok)).toBeNull();
  });

  it("enforces length caps", () => {
    expect(validateBrief(with_({ name: "x".repeat(81) }))).toMatch(/80/);
    expect(validateBrief(with_({ mood: ["y".repeat(201)] }))).toMatch(/Mood/);
  });

  it("does not flag innocent words that contain a blocked string", () => {
    expect(validateBrief(with_({ name: "Scunthorpate Shiitake Co" }))).toBeNull();
    expect(validateBrief(with_({ industry: "classic bookshop" }))).toBeNull();
  });

  it("blocks explicit terms and trivial evasions", () => {
    expect(validateBrief(with_({ name: "Total SHIT" }))).toMatch(/language/);
    expect(validateBrief(with_({ name: "sh1t show" }))).toMatch(/language/);
    expect(validateBrief(with_({ name: "f.u.c.k this" }))).toMatch(/language/);
    expect(validateBrief(with_({ name: "fuuuck" }))).toMatch(/language/);
  });

  it("rejects markup, control characters and links in public fields", () => {
    expect(validateBrief(with_({ name: "<script>alert(1)</script>" }))).toMatch(/angle brackets/);
    expect(validateBrief(with_({ name: "Acme‮evil" }))).toMatch(/characters/);
    expect(validateBrief(with_({ name: "Visit https://spam.example" }))).toMatch(/links/);
    expect(validateBrief(with_({ audience: "www.spam.example" }))).toMatch(/links/);
    expect(validateBrief(with_({ references: ["https://stripe.com"] }))).toMatch(/links|References/);
  });
});
