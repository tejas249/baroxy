import type { BriefInput } from "./moderation";

function splitList(value: unknown): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseBrief(body: Record<string, unknown>): BriefInput {
  return {
    name: String(body.name || "Untitled Project"),
    industry: String(body.industry || "general"),
    audience: String(body.audience || "general users"),
    mood: splitList(body.mood),
    references: splitList(body.references),
  };
}
