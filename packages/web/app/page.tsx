import Link from "next/link";

const TELLS = [
  "Inter, Roboto, Open Sans, or Poppins as the heading font",
  "A blue-to-indigo-to-violet gradient behind the hero headline",
  "Unmodified shadcn/ui default radius, shadow, and color tokens",
  "Every corner rounded to exactly 12px, everywhere, forever",
  "Hero copy that says 'Unlock the power of' or 'Supercharge your workflow'",
  "A single centered column with a gradient blob behind every section",
];

const STEPS = [
  {
    n: "01",
    title: "Describe your project",
    body: "Name, industry, audience, mood, references. Thirty seconds of input, no sign-up.",
  },
  {
    n: "02",
    title: "Get a locked Design DNA",
    body: "Typography pairing, color harmony, spacing scale, motion system, and mandatory signature details — plus a fixed list of AI tells it's not allowed to use.",
  },
  {
    n: "03",
    title: "Hand it to your agent",
    body: "Paste the style contract into Claude Code, Cursor, or any coding agent — or wire it in directly with the Baroxy MCP server so every screen follows the same rules automatically.",
  },
  {
    n: "04",
    title: "Ship something that looks like yours",
    body: "The same brief always reproduces the same DNA. Different briefs produce different ones. Nothing is random per request.",
  },
];

const FAQS = [
  {
    q: "Is the output actually deterministic, or just randomized to look custom?",
    a: "Deterministic. Your brief is hashed and used to seed the generator, so the exact same inputs always reproduce the exact same typography, colors, spacing, and motion. Change the brief and you get a different — but still reproducible — result.",
  },
  {
    q: "What do I actually get?",
    a: "A style contract (Markdown), a tokens.css file, a tailwind.tokens.js file, and a raw design-dna.json — plus a fixed list of signature details your UI must include and anti-patterns it must avoid.",
  },
  {
    q: "How do I use this with Claude Code, Cursor, or another agent?",
    a: "Paste the generated STYLE_CONTRACT.md into your agent's context before it starts building, or run the Baroxy MCP server locally so your agent can call generate_design_dna and get_style_contract directly as tools.",
  },
  {
    q: "Is this free?",
    a: "Yes. The web generator, CLI, and MCP server are all free to use.",
  },
  {
    q: "Does it lock me into Tailwind, or a specific framework?",
    a: "No. You get plain CSS variables, a Tailwind token file, and a framework-agnostic style contract. Use whichever one fits your stack.",
  },
  {
    q: "Why would a tool meant to fight generic AI output risk looking generic itself?",
    a: "Fair question — it's why this site doesn't ship the default shadcn card grid you'll see below in the 'what to avoid' list. If Baroxy ever looks like every other AI-generated landing page, that's a bug, not a vibe.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Baroxy",
  url: "https://baroxy.vercel.app",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Generates a locked, deterministic design identity (typography, color, spacing, motion, signature details, and banned AI tells) from a short brief, for AI coding agents to follow.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <section className="marketing-hero">
        <div className="shell-wide">
          <p className="kicker">Design DNA generator for AI-coded apps</p>
          <h1>Stop your AI-coded app from looking like everyone else&apos;s.</h1>
          <p className="sub">
            Every vibe-coded app is starting to look identical — same font, same gradient, same layout. Baroxy
            generates a locked, deterministic design identity from a 30-second brief, so your coding agent has
            exact rules to follow instead of its defaults.
          </p>
          <div className="hero-actions">
            <Link href="/generate" className="cta-button">
              Generate your Design DNA
            </Link>
            <a href="#how-it-works" className="cta-button cta-button--ghost">
              See how it works
            </a>
          </div>
          <p className="hero-stats">
            34 typography pairings · a continuous color system · 8 motion systems · 30 signature details · 10
            banned patterns
          </p>
        </div>
      </section>

      <section className="section" id="problem">
        <div className="shell-wide">
          <p className="section-kicker">The problem</p>
          <h2>Every AI-coded app looks the same.</h2>
          <p className="section-sub">
            Ask any coding agent to build a landing page or a dashboard and it reaches for the same defaults —
            because those defaults are the median of its training data, not a design decision. Baroxy exists so
            your project isn&apos;t the median.
          </p>
          <ul className="tell-list">
            {TELLS.map((t) => (
              <li key={t}>
                <span className="tell-mark">✕</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="shell-wide">
          <p className="section-kicker">How it works</p>
          <h2>Four steps, no design background required.</h2>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <p className="step-n">{s.n}</p>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="product">
        <div className="shell-wide">
          <p className="section-kicker">The product</p>
          <h2>One Design DNA, three ways to use it.</h2>
          <div className="product-grid">
            <div className="product-row">
              <code>npx @baroxy/cli --name Acme --industry fintech --mood trustworthy</code>
              <p>
                <strong>CLI.</strong> Run it from your terminal or a script. Writes STYLE_CONTRACT.md, tokens.css,
                tailwind.tokens.js, and design-dna.json straight into your repo.
              </p>
            </div>
            <div className="product-row">
              <code>claude mcp add baroxy -- npx @baroxy/mcp-server</code>
              <p>
                <strong>MCP server.</strong> Exposes generate_design_dna and get_style_contract as tools, so
                Claude Code, Cursor, or any MCP-compatible agent can pull your Design DNA mid-conversation.
              </p>
            </div>
            <div className="product-row">
              <Link href="/generate">baroxy.vercel.app/generate</Link>
              <p>
                <strong>Web generator.</strong> No install. Fill in a brief, preview the result live, and download
                the same files the CLI produces.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="shell-wide">
          <p className="section-kicker">FAQ</p>
          <h2>Questions worth asking before you install anything.</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell-wide">
          <h2>Ready to stop looking generic?</h2>
          <Link href="/generate" className="cta-button">
            Generate your Design DNA
          </Link>
        </div>
      </section>
    </main>
  );
}
