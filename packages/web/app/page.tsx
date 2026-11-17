import Link from "next/link";
import type { CSSProperties } from "react";
import {
  PencilSimpleLine,
  Sparkle,
  TerminalWindow,
  RocketLaunch,
  X,
  PlugsConnected,
  GlobeHemisphereWest,
  CaretDown,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./components/Reveal";
import Moodboard from "./components/Moodboard";
import SpotlightCard from "./components/SpotlightCard";
import CountUp from "./components/CountUp";
import {
  FontIllus,
  GradientIllus,
  RadiusIllus,
  ShadcnIllus,
  CopyIllus,
  ColumnIllus,
} from "./components/Illustrations";
import { Terminal, Cmd, Out, WebMock } from "./components/ProductMocks";

const HEADLINE = "Stop your AI-coded app from looking like".split(" ");
const HEADLINE_EM = ["everyone", "else's."];

const STATS = [
  { n: 34, label: "typography pairings" },
  { n: 8, label: "motion systems" },
  { n: 30, label: "signature details" },
  { n: 10, label: "banned patterns" },
];

const TELLS = [
  {
    Illus: FontIllus,
    title: "The same three fonts",
    body: "Inter, Roboto, Open Sans or Poppins as the heading font, on every project.",
    span: "bento-span-2",
  },
  {
    Illus: GradientIllus,
    title: "Blue to violet gradient",
    body: "Sitting behind the hero headline, every single time.",
    span: "bento-span-2",
  },
  {
    Illus: RadiusIllus,
    title: "12px on everything",
    body: "Every corner rounded to exactly the same radius, everywhere, forever.",
    span: "bento-span-2",
  },
  {
    Illus: ShadcnIllus,
    title: "Untouched component defaults",
    body: "Unmodified shadcn/ui radius, shadow and color tokens straight out of the box.",
    span: "bento-span-3",
  },
  {
    Illus: CopyIllus,
    title: "The same hero copy",
    body: "Headlines that say 'Unlock the power of' or 'Supercharge your workflow'.",
    span: "bento-span-3",
  },
  {
    Illus: ColumnIllus,
    title: "One column, one blob",
    body: "A single centered column with a gradient blob behind every section.",
    span: "bento-span-6",
  },
];

const STEPS = [
  {
    icon: PencilSimpleLine,
    title: "Describe your project",
    body: "Name, industry, audience, mood, references. Thirty seconds of input, no sign-up.",
  },
  {
    icon: Sparkle,
    title: "Get a locked Design DNA",
    body: "Typography pairing, color harmony, spacing scale, motion system and mandatory signature details, plus a fixed list of AI tells it's not allowed to use.",
  },
  {
    icon: TerminalWindow,
    title: "Hand it to your agent",
    body: "Paste the style contract into Claude Code, Cursor or any coding agent, or wire it in directly with the Baroxy MCP server so every screen follows the same rules automatically.",
  },
  {
    icon: RocketLaunch,
    title: "Ship something that looks like yours",
    body: "The same brief always reproduces the same DNA. Different briefs produce different ones. Nothing is random per request.",
  },
];

const FAQS = [
  {
    q: "Is the output actually deterministic, or just randomized to look custom?",
    a: "Deterministic. Your brief is hashed and used to seed the generator, so the exact same inputs always reproduce the exact same typography, colors, spacing and motion. Change the brief and you get a different, but still reproducible, result.",
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
        <div className="hero-aurora" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="shell-wide hero-center">
          <a href="#product" className="hero-pill">
            <span className="hero-pill-tag">New</span>
            MCP server for Claude Code and Cursor
            <ArrowRight size={14} weight="bold" />
          </a>
          <h1 className="hero-title">
            {HEADLINE.map((w, i) => (
              <span key={i}>
                <span className="word" style={{ "--i": i } as CSSProperties}>
                  {w}
                </span>{" "}
              </span>
            ))}
            <em>
              {HEADLINE_EM.map((w, i) => (
                <span key={w}>
                  <span className="word" style={{ "--i": HEADLINE.length + i } as CSSProperties}>
                    {w}
                  </span>{" "}
                </span>
              ))}
            </em>
          </h1>
          <p className="sub">
            Every vibe-coded app is starting to look identical: same font, same gradient, same layout. Baroxy
            generates a locked, deterministic design identity from a 30-second brief, so your coding agent has
            exact rules to follow instead of its defaults.
          </p>
          <div className="hero-actions">
            <Link href="/generate" className="cta-button cta-button--shimmer">
              Generate your Design DNA
              <ArrowRight size={16} weight="bold" />
            </Link>
            <a href="#how-it-works" className="cta-button cta-button--ghost">
              See how it works
            </a>
          </div>
          <div className="hero-works">
            <span>Works with</span>
            <b>Claude Code</b>
            <b>Cursor</b>
            <b>Windsurf</b>
            <b>Claude Desktop</b>
          </div>
          <div className="hero-stats-grid">
            {STATS.map((st) => (
              <div className="stat-chip" key={st.label}>
                <strong>
                  <CountUp to={st.n} />
                </strong>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
        <Moodboard />
      </section>

      <section className="section section--glow" id="problem">
        <div className="shell-wide">
          <Reveal>
            <p className="section-kicker">The problem</p>
            <h2>Every AI-coded app looks the same.</h2>
            <p className="section-sub">
              Ask any coding agent to build a landing page or a dashboard and it reaches for the same defaults,
              because those defaults are the median of its training data, not a design decision. Baroxy exists so
              your project isn&apos;t the median.
            </p>
          </Reveal>
          <div className="bento-grid">
            {TELLS.map((t, i) => (
              <Reveal key={t.title} delay={i * 50} className={`bento-cell ${t.span}`}>
                <SpotlightCard>
                  <span className="tell-tag">
                    <X size={12} weight="bold" />
                    Banned
                  </span>
                  <div className="illus-wrap">
                    <t.Illus />
                  </div>
                  <h3 className="card-title">{t.title}</h3>
                  <p className="card-body">{t.body}</p>
                </SpotlightCard>
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
                <SpotlightCard className="step">
                  <div className="step-top">
                    <span className="icon-badge">
                      <s.icon size={22} weight="duotone" />
                    </span>
                    <span className="step-num">0{i + 1}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--glow" id="product">
        <div className="shell-wide">
          <Reveal>
            <p className="section-kicker">The product</p>
            <h2>One Design DNA, three ways to use it.</h2>
          </Reveal>
          <div className="bento-grid">
            <Reveal className="bento-cell bento-span-3 bento-tall">
              <SpotlightCard>
                <WebMock />
                <div className="card-head">
                  <span className="icon-badge icon-badge--sm">
                    <GlobeHemisphereWest size={20} weight="duotone" />
                  </span>
                  <h3 className="card-title">Web generator</h3>
                </div>
                <p className="card-body">
                  No install. Fill in a brief, preview the result live, and download the same files the CLI
                  produces.
                </p>
                <div className="feature-list">
                  <span>Live preview</span>
                  <span>Free downloads</span>
                  <span>No sign-up</span>
                  <span>Shareable link</span>
                </div>
                <Link href="/generate" className="cta-button cta-button--small">
                  Open the generator
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </SpotlightCard>
            </Reveal>

            <Reveal className="bento-cell bento-span-3" delay={60}>
              <SpotlightCard>
                <Terminal title="your-project" copy="npx @baroxy/cli --name Acme --industry fintech --mood trustworthy">
                  <Cmd>npx @baroxy/cli --name Acme --industry fintech --mood trustworthy</Cmd>
                  <Out>design-dna/STYLE_CONTRACT.md</Out>
                  <Out>design-dna/tokens.css</Out>
                  <Out>design-dna/tailwind.tokens.js</Out>
                  <Out>design-dna/design-dna.json</Out>
                </Terminal>
                <div className="card-head">
                  <span className="icon-badge icon-badge--sm">
                    <TerminalWindow size={20} weight="duotone" />
                  </span>
                  <h3 className="card-title">CLI</h3>
                </div>
                <p className="card-body">
                  Run it from your terminal or a script. Writes the style contract, tokens and JSON straight into
                  your repo.
                </p>
              </SpotlightCard>
            </Reveal>

            <Reveal className="bento-cell bento-span-3" delay={120}>
              <SpotlightCard>
                <Terminal title="claude code" copy="claude mcp add baroxy -- npx @baroxy/mcp-server">
                  <Cmd>claude mcp add baroxy -- npx @baroxy/mcp-server</Cmd>
                  <Out>Added MCP server baroxy</Out>
                  <div className="tool-chips">
                    <span>generate_design_dna</span>
                    <span>get_style_contract</span>
                  </div>
                </Terminal>
                <div className="card-head">
                  <span className="icon-badge icon-badge--sm">
                    <PlugsConnected size={20} weight="duotone" />
                  </span>
                  <h3 className="card-title">MCP server</h3>
                </div>
                <p className="card-body">
                  Exposes two tools, so Claude Code, Cursor or any MCP-compatible agent can pull your Design DNA
                  mid-conversation.
                </p>
              </SpotlightCard>
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
                  <CaretDown size={18} weight="bold" className="faq-chevron" />
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
              <ArrowRight size={16} weight="bold" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
