import { NextResponse } from "next/server";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";
import { generateShareId, saveShare } from "../../../lib/share";
import { checkRateLimit, clientKey } from "../../../lib/rateLimit";
import { parseBrief } from "../../../lib/brief";
import { readJsonObject } from "../../../lib/http";
import { validateBrief } from "../../../lib/moderation";

// Lower than /api/generate since every call here also writes to blob storage.
const LIMIT = 10;
const WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const rate = checkRateLimit(`share:${clientKey(request)}`, LIMIT, WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  const parsed = await readJsonObject(request);
  if (!parsed.ok) return parsed.response;

  const brief = parseBrief(parsed.body);
  const validationError = validateBrief(brief);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const dna = generateDesignDNA(brief);
  const isPublic = parsed.body.public === true;
  const base = {
    dna,
    markdown: toStyleContractMarkdown(dna),
    css: toCSSVariables(dna),
    tailwind: toTailwindTokens(dna),
    createdAt: new Date().toISOString(),
    public: isPublic,
  };

  // Blob writes can fail (outage, missing token) or, very rarely, collide on the id. Retry once
  // with a fresh id, and otherwise return a clear 503 instead of an unhandled 500.
  for (let attempt = 0; attempt < 2; attempt++) {
    const id = generateShareId();
    try {
      const result = await saveShare({ ...base, id });
      return NextResponse.json({ id, listed: result.listed });
    } catch (err) {
      console.error("share: failed to save", { attempt, message: err instanceof Error ? err.message : String(err) });
    }
  }

  return NextResponse.json(
    { error: "Sharing is temporarily unavailable. Your Design DNA is still on this page. Please try again in a minute." },
    { status: 503, headers: { "Retry-After": "60" } }
  );
}
