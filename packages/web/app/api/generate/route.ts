import { NextResponse } from "next/server";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";
import { checkRateLimit, clientKey } from "../../../lib/rateLimit";

const LIMIT = 20;
const WINDOW_MS = 60_000;

function splitList(value: unknown): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const rate = checkRateLimit(`generate:${clientKey(request)}`, LIMIT, WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => ({}));

  const brief = {
    name: String(body.name || "Untitled Project"),
    industry: String(body.industry || "general"),
    audience: String(body.audience || "general users"),
    mood: splitList(body.mood),
    references: splitList(body.references),
  };

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
