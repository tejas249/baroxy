// Dependency-free guard for the free-text brief fields that get persisted and rendered on public
// pages (shared links, the showcase gallery and Open Graph images). Layers:
//  1. Length caps, so nobody pastes a spam-sized blob into a field that ends up on a page.
//  2. Structure checks: no markup, control characters, or links. Briefs describe a project, they
//     don't need to carry URLs, and public pages are exactly where link spam would land.
//  3. A small explicit-terms blocklist applied to a normalised copy of the text, so trivial
//     evasions (CAPS, f.u.c.k, leetspeak, repeated letters) are caught without flagging innocent
//     words that merely contain a blocked string ("Scunthorpate" problem).
const FIELD_LIMITS = {
  name: 80,
  industry: 100,
  audience: 100,
  mood: 200, // joined, comma-separated
  references: 200, // joined, comma-separated
} as const;

// Intentionally short and explicit-only — expand if abuse is actually observed, not preemptively.
const BLOCKED_TERMS = ["fuck", "shit", "nigger", "faggot", "cunt", "retard", "whore", "slut"];

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s", "!": "i" };

/** Lower-case, strip accents, map leetspeak, and collapse repeated letters (so "fuuuck" and "shiit" normalise like the originals). */
export function normalizeForModeration(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[0-9@$!]/g, (c) => LEET[c] ?? c)
    .replace(/(.)\1+/g, "$1");
}

// Terms go through the same normalisation as the input, so both sides compare like for like.
const NORMALIZED_TERMS = BLOCKED_TERMS.map(normalizeForModeration);

function containsBlockedTerm(text: string): boolean {
  const normalized = normalizeForModeration(text);
  // Words as written ("fuck", "shit tier") — whole-word, optionally with a plural/gerund suffix.
  const words = normalized.split(/[^a-z]+/).filter(Boolean);
  const wordHit = words.some((w) => NORMALIZED_TERMS.some((t) => w === t || w === `${t}s` || w === `${t}ing` || w === `${t}ed` || w === `${t}y`));
  if (wordHit) return true;
  // Spaced/punctuated evasion ("f u c k", "f.u.c.k"): only for runs of single letters.
  const singles = normalized.match(/\b(?:[a-z][\s.\-_*]+){3,}[a-z]\b/g) ?? [];
  return singles.some((run) => {
    const squashed = run.replace(/[^a-z]/g, "");
    return NORMALIZED_TERMS.some((t) => squashed.includes(t));
  });
}

const URL_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|co|app|dev|xyz|ru|cn|tk|ly|gg|me)\b\/)/i;
const MARKUP_PATTERN = /[<>]/;
const CONTROL_PATTERN = new RegExp("[\\u0000-\\u0008\\u000b\\u000c\\u000e-\\u001f\\u007f\\u200b-\\u200f\\u2028-\\u202e\\u2066-\\u2069]");

export interface BriefInput {
  name: string;
  industry: string;
  audience: string;
  mood: string[];
  references: string[];
  variant?: number;
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
  if (MARKUP_PATTERN.test(allText)) return "Please remove angle brackets (< >) from your brief.";
  if (CONTROL_PATTERN.test(allText)) return "Your brief contains characters we can't accept.";
  // Reference brands are often written as bare domains (stripe.com) — only reject real links.
  if (URL_PATTERN.test([brief.name, brief.industry, brief.audience, moodJoined].join(" "))) {
    return "Please leave links out of your brief.";
  }
  if (/https?:\/\//i.test(referencesJoined)) return "References should be names or domains, not full links.";
  if (containsBlockedTerm(allText)) return "That brief contains language we don't allow.";

  return null;
}
