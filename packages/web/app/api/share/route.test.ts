import { describe, expect, it, vi } from "vitest";

vi.mock("../../../lib/share", () => ({
  generateShareId: () => "testid123456",
  saveShare: vi.fn(async (record: { public: boolean }) => ({ listed: record.public })),
}));

import { POST } from "./route";

function req(body: unknown, ip: string) {
  return new Request("http://localhost/api/share", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const brief = { name: "Acme", industry: "fintech", audience: "founders", mood: "bold" };

describe("POST /api/share", () => {
  it("saves an unlisted share by default", async () => {
    const res = await POST(req(brief, "192.0.2.1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "testid123456", listed: false });
  });

  it("lists publicly only when asked", async () => {
    const res = await POST(req({ ...brief, public: true }, "192.0.2.2"));
    expect((await res.json()).listed).toBe(true);
  });

  it("rejects a brief that fails moderation", async () => {
    const res = await POST(req({ ...brief, name: "<script>alert(1)</script>" }, "192.0.2.3"));
    expect(res.status).toBe(400);
  });
});
