import type { BriefInput } from "./moderation";

const MAX_LIST_ITEMS = 12;

/** Accepts either "a, b, c" or ["a", "b", "c"]; anything else becomes an empty list. */
function toList(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return raw
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_LIST_ITEMS);
}

function toText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

/** A non-negative whole "take" number, capped so it can't be abused as an unbounded seed. */
function toVariant(value: unknown): number {
  const n = typeof value === "number" ? value : Number.NaN;
  return Number.isInteger(n) && n > 0 ? Math.min(n, 99) : 0;
}

export function parseBrief(body: Record<string, unknown>): BriefInput {
  return {
    name: toText(body.name, "Untitled Project"),
    industry: toText(body.industry, "general"),
    audience: toText(body.audience, "general users"),
    mood: toList(body.mood),
    references: toList(body.references),
    ...(toVariant(body.variant) > 0 ? { variant: toVariant(body.variant) } : {}),
  };
}
