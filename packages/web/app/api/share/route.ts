import { NextResponse } from "next/server";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";
import { generateShareId, saveShare } from "../../../lib/share";
import { checkRateLimit, clientKey } from "../../../lib/rateLimit";

// Lower than /api/generate since every call here also writes to blob storage.
const LIMIT = 10;
const WINDOW_MS = 60_000;

function splitList(value: unknown): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const rate = checkRateLimit(`share:${clientKey(request)}`, LIMIT, WINDOW_MS);
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
  const id = generateShareId();

  await saveShare({
    id,
    dna,
    markdown: toStyleContractMarkdown(dna),
    css: toCSSVariables(dna),
    tailwind: toTailwindTokens(dna),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ id });
}
