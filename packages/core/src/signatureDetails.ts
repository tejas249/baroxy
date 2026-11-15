// A pool of concrete, checkable UI decisions. We hand out 4 per project so every
// build has specific, mandatory things that make it NOT look like the default output.
export const SIGNATURE_DETAILS: readonly string[] = [
  "Nav bar has no pill-shaped active state — use an underline, a dot, or a weight change instead.",
  "Primary CTA button is not pill-shaped or default-rounded — give it a distinct shape from the rest of the UI (sharp corner, asymmetric radius, or a notch).",
  "Cards use a border, not a shadow, as the primary separation device.",
  "Empty states get a custom one-line illustration or ASCII-style mark, never a generic 'box with a dashed border and an icon'.",
  "Hover states shift color or weight, never just opacity — opacity-only hover is one of the laziest tells.",
  "Section dividers are a rule or a numbered label, never a decorative gradient blob.",
  "Headings use a deliberately tight or wide letter-spacing, not the browser default.",
  "At least one interactive element uses a non-default cursor (crosshair, grab, text) where it adds meaning.",
  "Loading states are a single branded shape or wordmark animation, never a generic spinner.",
  "Form focus states use a 2px offset ring in the accent color, not the browser's default blue outline.",
  "Tables and lists use zebra striping or a left rule, not just whitespace, to separate rows.",
  "The 404/error page has one deliberate joke or brand moment, not a generic 'Page not found'.",
  "Tags and badges are rectangular with a hard corner, not pill-shaped, to break from the shadcn default.",
  "Scroll-triggered reveals are used sparingly (max once per page) and never as the default for every section.",
  "The favicon and the loading indicator share the same mark — a small consistency detail most AI output skips.",
  "At least one page has an intentional asymmetric layout — not everything centered in a single column.",
  "Code or data snippets use the heading font's mono-adjacent weight, not a random system monospace.",
  "Tooltips have a 1px border and a hard shadow, not a soft blurred one.",
  "Primary and secondary buttons are visually distinct in shape, not just color (e.g. filled vs. underlined, not filled vs. filled-light).",
  "The logo/wordmark pairing is fixed once generated and never swapped per page — resist the urge to 'try a different font' mid-build.",
];
