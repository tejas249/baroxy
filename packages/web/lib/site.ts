// Origin used for canonical URLs, Open Graph, the sitemap and structured data. Set
// NEXT_PUBLIC_SITE_URL once a custom domain is attached; on Vercel it otherwise follows the
// project's production domain, so these never point at a site this deployment doesn't serve.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  // Last resort in production if system env vars are disabled: the project's own domain.
  return process.env.NODE_ENV === "production" ? "https://baroxy-jet.vercel.app" : "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Baroxy";
export const REPO_URL = "https://github.com/tejas249/baroxy";
export const TAGLINE = "Design DNA for AI-coded apps";
export const TITLE = `${SITE_NAME}: ${TAGLINE}`;
export const DESCRIPTION =
  "Baroxy turns a short project brief into a locked, deterministic design identity (typography, color, spacing, motion and signature details, plus the AI tells to avoid) that Claude Code, Cursor and any coding agent can follow. Free, no sign-up.";

export const KEYWORDS = [
  "design system generator",
  "AI generated website design",
  "stop AI looking generic",
  "avoid AI slop design",
  "design tokens generator",
  "style contract for AI agents",
  "Claude Code design system",
  "Cursor design rules",
  "MCP server design",
  "Tailwind tokens generator",
  "design DNA",
  "deterministic design",
];

export const FAQS = [
  {
    q: "Is the output actually deterministic, or just randomized to look custom?",
    a: "Deterministic. Your brief is hashed and used to seed the generator, so the exact same inputs always reproduce the exact same preset, typography, colors, spacing and motion. Change the brief and you get a different, but still reproducible, result.",
  },
  {
    q: "What do I actually get?",
    a: "A style contract (Markdown), a tokens.css file, a tailwind.tokens.js file and a raw design-dna.json, plus a fixed list of signature details your UI must include and anti-patterns it must avoid.",
  },
  {
    q: "How do I use this with Claude Code, Cursor, or another agent?",
    a: "Paste the generated STYLE_CONTRACT.md into your agent's context before it starts building, or run the Baroxy MCP server locally so your agent can call generate_design_dna and get_style_contract directly as tools.",
  },
  {
    q: "Is this free?",
    a: "Yes. The web generator, CLI and MCP server are all free to use.",
  },
  {
    q: "Does it lock me into Tailwind, or a specific framework?",
    a: "No. You get plain CSS variables, a Tailwind token file and a framework-agnostic style contract. Use whichever one fits your stack.",
  },
  {
    q: "Why would a tool meant to fight generic AI output risk looking generic itself?",
    a: "Fair question. It's why this site doesn't ship the default shadcn card grid you'll see in the 'what to avoid' section. If Baroxy ever looks like every other AI-generated landing page, that's a bug, not a vibe.",
  },
];

export const STEPS = [
  { name: "Describe your project", text: "Enter a name, industry, audience, mood and reference brands. It takes about thirty seconds and needs no sign-up." },
  { name: "Get a locked Design DNA", text: "Baroxy matches your brief to one of 100+ curated presets and returns its typography pairing, light or dark palette with surface and text roles, radius system, motion feel, mandatory signature details and a fixed list of AI tells to avoid." },
  { name: "Hand it to your agent", text: "Paste the style contract into Claude Code, Cursor or any coding agent, or connect the Baroxy MCP server so every screen follows the same rules." },
  { name: "Ship something that looks like yours", text: "The same brief always reproduces the same DNA, and different briefs produce different ones." },
];
