import { NextResponse } from "next/server";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";
import { generateShareId, saveShare } from "../../../lib/share";
import { checkRateLimit, clientKey } from "../../../lib/rateLimit";
import { parseBrief } from "../../../lib/brief";
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

  const body = await request.json().catch(() => ({}));
  const brief = parseBrief(body);

  const validationError = validateBrief(brief);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const dna = generateDesignDNA(brief);
  const id = generateShareId();
  const isPublic = body.public === true;

  await saveShare({
    id,
    dna,
    markdown: toStyleContractMarkdown(dna),
    css: toCSSVariables(dna),
    tailwind: toTailwindTokens(dna),
    createdAt: new Date().toISOString(),
    public: isPublic,
  });

  return NextResponse.json({ id });
}
