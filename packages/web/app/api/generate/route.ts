import { NextResponse } from "next/server";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";

function splitList(value: unknown): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const brief = {
    name: String(body.name || "Untitled Project"),
    industry: String(body.industry || "general"),
    audience: String(body.audience || "general users"),
    mood: splitList(body.mood),
    references: splitList(body.references),
  };

  const dna = generateDesignDNA(brief);

  return NextResponse.json({
    dna,
    markdown: toStyleContractMarkdown(dna),
    css: toCSSVariables(dna),
    tailwind: toTailwindTokens(dna),
  });
}
