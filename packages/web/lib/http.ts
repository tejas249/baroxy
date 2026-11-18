import { NextResponse } from "next/server";

/** Largest JSON body any of our endpoints accepts. A brief is a few hundred characters. */
export const MAX_BODY_BYTES = 8 * 1024;

type JsonResult = { ok: true; body: Record<string, unknown> } | { ok: false; response: NextResponse };

function fail(status: number, error: string): JsonResult {
  return { ok: false, response: NextResponse.json({ error }, { status }) };
}

/**
 * Reads and validates a JSON request body: correct content type, bounded size, valid JSON, and a
 * plain object (not null, an array or a primitive). Returns a ready 4xx response on failure so
 * routes never crash on malformed input.
 */
export async function readJsonObject(request: Request): Promise<JsonResult> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) return fail(415, "Send the request as application/json.");

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return fail(413, "Request body is too large.");

  let text: string;
  try {
    text = await request.text();
  } catch {
    return fail(400, "Could not read the request body.");
  }
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return fail(413, "Request body is too large.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail(400, "Request body must be valid JSON.");
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return fail(400, "Request body must be a JSON object.");
  }
  return { ok: true, body: parsed as Record<string, unknown> };
}
