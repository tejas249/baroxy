import Link from "next/link";
import { PenLine, Sparkles, Terminal, Rocket, X, Plug, Globe, ChevronDown } from "lucide-react";
import { Reveal } from "./components/Reveal";

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
    icon: PenLine,
    title: "Describe your project",
    body: "Name, industry, audience, mood, references. Thirty seconds of input, no sign-up.",
  },
  {
    icon: Sparkles,
    title: "Get a locked Design DNA",
    body: "Typography pairing, color harmony, spacing scale, motion system, and mandatory signature details — plus a fixed list of AI tells it's not allowed to use.",
  },
  {
    icon: Terminal,
    title: "Hand it to your agent",
    body: "Paste the style contract into Claude Code, Cursor, or any coding agent — or wire it in directly with the Baroxy MCP server so every screen follows the same rules automatically.",
  },
  {
    icon: Rocket,
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
        <div className="shell-wide hero-grid">
          <div>
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

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-row">
              <div className="hero-visual-swatch" style={{ background: "#ffde59" }} />
              <div className="hero-visual-swatch" style={{ background: "#ff8a3d" }} />
              <div className="hero-visual-swatch" style={{ background: "#1f8a4c" }} />
              <div className="hero-visual-swatch" style={{ background: "#17171a" }} />
            </div>
            <div className="hero-visual-type">
              <p className="big">Meridian</p>
              <p className="small">Clean Startup · analogous · Deliberate motion</p>
            </div>
            <div className="hero-visual-footer">
              <span>
                <span className="hero-visual-dot" />
                seed 20481293
              </span>
              <span>@baroxy/core</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="problem">
        <div className="shell-wide">
          <Reveal>
            <p className="section-kicker">The problem</p>
            <h2>Every AI-coded app looks the same.</h2>
            <p className="section-sub">
              Ask any coding agent to build a landing page or a dashboard and it reaches for the same defaults —
              because those defaults are the median of its training data, not a design decision. Baroxy exists so
              your project isn&apos;t the median.
            </p>
          </Reveal>
          <div className="bento-grid">
            {TELLS.map((t, i) => (
              <Reveal key={t} delay={i * 40} className="bento-card bento-span-3">
                <span className="icon-badge icon-badge--danger">
                  <X size={18} strokeWidth={2.5} />
                </span>
                <p style={{ margin: 0, color: "var(--text-dim)", lineHeight: 1.5 }}>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="shell-wide">
          <Reveal>
            <p className="section-kicker">How it works</p>
            <h2>Four steps, no design background required.</h2>
          </Reveal>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="step">
                  <span className="icon-badge">
                    <s.icon size={20} strokeWidth={2} />
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="product">
        <div className="shell-wide">
          <Reveal>
            <p className="section-kicker">The product</p>
            <h2>One Design DNA, three ways to use it.</h2>
          </Reveal>
          <div className="bento-grid">
            <Reveal className="bento-card">
              <span className="icon-badge">
                <Globe size={20} strokeWidth={2} />
              </span>
              <p className="product-row">
                <strong>Web generator.</strong>{" "}
                <span style={{ color: "var(--text-dim)" }}>
                  No install. Fill in a brief, preview the result live, and download the same files the CLI
                  produces.
                </span>
              </p>
              <Link href="/generate" className="cta-button cta-button--small">
                Open /generate
              </Link>
            </Reveal>

            <Reveal className="bento-card bento-span-3" delay={60}>
              <span className="icon-badge">
                <Terminal size={20} strokeWidth={2} />
              </span>
              <code>npx @baroxy/cli --name Acme --industry fintech --mood trustworthy</code>
              <p className="product-row">
                <strong>CLI.</strong>{" "}
                <span style={{ color: "var(--text-dim)" }}>
                  Run it from your terminal or a script. Writes STYLE_CONTRACT.md, tokens.css, tailwind.tokens.js,
                  and design-dna.json straight into your repo.
                </span>
              </p>
            </Reveal>

            <Reveal className="bento-card bento-span-3" delay={120}>
              <span className="icon-badge">
                <Plug size={20} strokeWidth={2} />
              </span>
              <code>claude mcp add baroxy -- npx @baroxy/mcp-server</code>
              <p className="product-row">
                <strong>MCP server.</strong>{" "}
                <span style={{ color: "var(--text-dim)" }}>
                  Exposes generate_design_dna and get_style_contract as tools, so Claude Code, Cursor, or any
                  MCP-compatible agent can pull your Design DNA mid-conversation.
                </span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="shell-wide">
          <Reveal>
            <p className="section-kicker">FAQ</p>
            <h2>Questions worth asking before you install anything.</h2>
          </Reveal>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>
                  {f.q}
                  <ChevronDown size={18} className="faq-chevron" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell-wide">
          <Reveal>
            <h2>Ready to stop looking generic?</h2>
            <Link href="/generate" className="cta-button">
              Generate your Design DNA
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
