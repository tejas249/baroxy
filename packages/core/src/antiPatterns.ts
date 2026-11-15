// Fixed list of "AI tells" every generated project must avoid, regardless of
// which typography/color/spacing/motion system it was assigned.
export const ANTI_PATTERNS: readonly string[] = [
  "Do not use Inter, Roboto, Open Sans, or Poppins as the primary typeface — the assigned typography pairing is mandatory.",
  "Do not use an indigo-to-violet, blue-to-purple, or purple-to-pink gradient as a hero background — it is the single most recognizable 'AI-coded app' tell.",
  "Do not leave shadcn/ui default tokens (radius, shadow, color variables) unmodified — every token must reflect this Design DNA.",
  "Do not default every corner to rounded-xl (12px) — use the assigned radius system instead.",
  "Do not write hero copy in the pattern 'Unlock the power of X', 'Supercharge your Y', 'Revolutionize the way you Z', or 'Take your X to the next level'.",
  "Do not center every section in a single column with a gradient blob behind the headline — vary the layout.",
  "Do not use a generic spinner (a rotating circle) for loading states — use the assigned motion system and signature details instead.",
  "Do not default button hover states to an opacity change only.",
  "Do not use the default browser focus ring (blue outline) — use the accent-colored focus ring from the color system.",
  "Do not ship a feature-grid section of exactly 3 cards with an icon, a bold title, and one sentence of body text as the only way to present features.",
];
