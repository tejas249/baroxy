// Lightweight, dependency-free guard for the free-text brief fields that get persisted and
// rendered on public pages (shared links, and the showcase gallery). Two layers:
//  1. Length caps — stop someone pasting a spam-sized blob into a field that ends up on a page.
//  2. A small blocklist — catches overt slurs/profanity. Deliberately conservative: it targets
//     explicit terms, not broad topics, to avoid false-positives on legitimate industries/moods.
const FIELD_LIMITS = {
  name: 80,
  industry: 100,
  audience: 100,
  mood: 200, // joined, comma-separated
  references: 200, // joined, comma-separated
} as const;

// Intentionally short and explicit-only — expand if abuse is actually observed, not preemptively.
const BLOCKED_TERMS = ["fuck", "shit", "nigger", "faggot", "cunt", "retard", "whore", "slut"];

function containsBlockedTerm(text: string): boolean {
  const normalized = text.toLowerCase();
  return BLOCKED_TERMS.some((term) => normalized.includes(term));
}

export interface BriefInput {
  name: string;
  industry: string;
  audience: string;
  mood: string[];
  references: string[];
}

/** Returns an error message if the brief should be rejected, or null if it's fine. */
export function validateBrief(brief: BriefInput): string | null {
  if (brief.name.length > FIELD_LIMITS.name) return `Project name must be ${FIELD_LIMITS.name} characters or fewer.`;
  if (brief.industry.length > FIELD_LIMITS.industry) return `Industry must be ${FIELD_LIMITS.industry} characters or fewer.`;
  if (brief.audience.length > FIELD_LIMITS.audience) return `Audience must be ${FIELD_LIMITS.audience} characters or fewer.`;

  const moodJoined = brief.mood.join(", ");
  if (moodJoined.length > FIELD_LIMITS.mood) return `Mood is too long (${FIELD_LIMITS.mood} characters max).`;

  const referencesJoined = brief.references.join(", ");
  if (referencesJoined.length > FIELD_LIMITS.references) {
    return `References are too long (${FIELD_LIMITS.references} characters max).`;
  }

  const allText = [brief.name, brief.industry, brief.audience, moodJoined, referencesJoined].join(" ");
  if (containsBlockedTerm(allText)) return "That brief contains language we don't allow.";

  return null;
}
