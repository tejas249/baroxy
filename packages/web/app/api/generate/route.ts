import { NextResponse } from "next/server";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";
import { checkRateLimit, clientKey } from "../../../lib/rateLimit";
import { parseBrief } from "../../../lib/brief";
import { readJsonObject } from "../../../lib/http";
import { validateBrief } from "../../../lib/moderation";

const LIMIT = 20;
const WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const rate = checkRateLimit(`generate:${clientKey(request)}`, LIMIT, WINDOW_MS);
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

  return NextResponse.json(
    {
      dna,
      markdown: toStyleContractMarkdown(dna),
      css: toCSSVariables(dna),
      tailwind: toTailwindTokens(dna),
    },
    { headers: { "X-RateLimit-Limit": String(rate.limit), "X-RateLimit-Remaining": String(rate.remaining) } }
  );
}
