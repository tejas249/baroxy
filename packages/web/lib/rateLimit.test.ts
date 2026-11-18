import { describe, it, expect } from "vitest";
import { checkRateLimit, clientKey } from "./rateLimit";

describe("checkRateLimit", () => {
  it("allows up to the limit then blocks with a retry hint", () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true);
    const blocked = checkRateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("tracks keys independently", () => {
    const a = `a-${Math.random()}`;
    checkRateLimit(a, 1, 60_000);
    expect(checkRateLimit(a, 1, 60_000).allowed).toBe(false);
    expect(checkRateLimit(`b-${Math.random()}`, 1, 60_000).allowed).toBe(true);
  });
});

describe("clientKey", () => {
  const r = (h: Record<string, string>) => new Request("http://x", { headers: h });

  it("prefers platform-set headers over a spoofable X-Forwarded-For", () => {
    expect(clientKey(r({ "x-vercel-forwarded-for": "1.1.1.1", "x-forwarded-for": "9.9.9.9" }))).toBe("1.1.1.1");
    expect(clientKey(r({ "x-real-ip": "2.2.2.2", "x-forwarded-for": "9.9.9.9" }))).toBe("2.2.2.2");
  });

  it("falls back to X-Forwarded-For, then unknown", () => {
    expect(clientKey(r({ "x-forwarded-for": "3.3.3.3, 4.4.4.4" }))).toBe("3.3.3.3");
    expect(clientKey(r({}))).toBe("unknown");
  });
});
