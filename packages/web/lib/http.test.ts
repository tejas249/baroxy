import { describe, it, expect } from "vitest";
import { readJsonObject, MAX_BODY_BYTES } from "./http";

function req(body: string, headers: Record<string, string> = { "content-type": "application/json" }) {
  return new Request("http://x/api", { method: "POST", body, headers });
}

async function status(r: Request) {
  const out = await readJsonObject(r);
  return out.ok ? 200 : out.response.status;
}

describe("readJsonObject", () => {
  it("accepts a JSON object", async () => {
    const out = await readJsonObject(req('{"name":"a"}'));
    expect(out.ok && out.body.name).toBe("a");
  });

  it("rejects null, arrays and primitives with 400", async () => {
    expect(await status(req("null"))).toBe(400);
    expect(await status(req("[]"))).toBe(400);
    expect(await status(req("42"))).toBe(400);
  });

  it("rejects malformed JSON with 400", async () => {
    expect(await status(req("{"))).toBe(400);
  });

  it("rejects the wrong content type with 415", async () => {
    expect(await status(req("{}", { "content-type": "text/plain" }))).toBe(415);
  });

  it("rejects oversized bodies with 413", async () => {
    expect(await status(req(JSON.stringify({ name: "x".repeat(MAX_BODY_BYTES) })))).toBe(413);
  });
});
