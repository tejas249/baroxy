import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function req(body: unknown, ip = "203.0.113.1", contentType = "application/json") {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": contentType, "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const brief = { name: "Acme", industry: "fintech", audience: "founders", mood: "bold" };

describe("POST /api/generate", () => {
  beforeEach(() => vi.useRealTimers());

  it("returns a design DNA and export files", async () => {
    const res = await POST(req(brief, "198.51.100.1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.dna.brief.name).toBe("Acme");
    expect(data.markdown).toContain("Design DNA");
    expect(data.css).toContain("--");
  });

  it("is deterministic for the same brief", async () => {
    const a = await (await POST(req(brief, "198.51.100.2"))).json();
    const b = await (await POST(req(brief, "198.51.100.3"))).json();
    expect(a.dna).toEqual(b.dna);
  });

  it("gives a different result for another take", async () => {
    const a = await (await POST(req(brief, "198.51.100.4"))).json();
    const b = await (await POST(req({ ...brief, variant: 1 }, "198.51.100.5"))).json();
    expect(b.dna.seed).not.toBe(a.dna.seed);
  });

  it("rejects malformed JSON", async () => {
    const res = await POST(req("{not json", "198.51.100.6"));
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("rejects a brief containing a link", async () => {
    const res = await POST(req({ ...brief, name: "visit http://spam.example" }, "198.51.100.7"));
    expect(res.status).toBe(400);
  });

  it("rate limits a single client", async () => {
    let last = 200;
    for (let i = 0; i < 25; i++) last = (await POST(req(brief, "198.51.100.99"))).status;
    expect(last).toBe(429);
  });
});
