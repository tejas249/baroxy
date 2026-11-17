import Link from "next/link";
import { ArrowRight, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { DESIGN_PRESETS, SIGNATURE_DETAILS, ANTI_PATTERNS, FONT_PAIRINGS } from "@baroxy/core";
import { DesignSample } from "./components/DesignSample";
import { Terminal, Cmd, Out } from "./components/ProductMocks";
import { SITE_URL, SITE_NAME, REPO_URL, DESCRIPTION, FAQS, STEPS as JSON_STEPS } from "../lib/site";

const byId = (id: string) => {
  const p = DESIGN_PRESETS.find((x) => x.id === id);
  if (!p) throw new Error(`Missing preset ${id}`);
  return p;
};

const HERO_IDS = ["obsidian-terminal", "trattoria", "street-acid"];
const TEASER_IDS = ["sage-studio", "ledger-green", "brutalist-paper", "izakaya-night", "atelier-bone", "crayon-box"];

const FAMILIES = new Set(DESIGN_PRESETS.flatMap((p) => [p.typography.heading.family, p.typography.body.family]));
FONT_PAIRINGS.forEach((f) => FAMILIES.add(f.heading.family));

const STATS = [
  { n: DESIGN_PRESETS.length, label: "curated presets" },
  { n: FAMILIES.size, label: "typefaces in play" },
  { n: DESIGN_PRESETS.filter((p) => p.colors.mode === "dark").length, label: "dark-first identities" },
  { n: SIGNATURE_DETAILS.length, label: "signature details" },
  { n: ANTI_PATTERNS.length, label: "banned AI tells" },
];

const TELLS = [
  ["Inter, Roboto, Poppins everywhere", "A designed pairing, picked per project, enforced in the contract."],
  ["Blue-to-violet hero gradient", "Palettes with real canvas, surface, text and border roles, light or dark."],
  ["rounded-xl on every corner", "A radius system with its own logic: sharp, notched, pillowy, boxy."],
  ["shadcn defaults, untouched", "Every token overridden: colour, radius, motion, focus ring."],
  ["'Unlock the power of…' copy", "Banned phrases, plus a personality line that sets the voice."],
  ["One centred column, one blob", "Signature layout rules that force asymmetry and variety."],
];

const STEPS = [
  ["Describe the project", "Name, space, audience, mood. Thirty seconds, no sign-up."],
  ["Get a matched identity", "Baroxy scores every preset against your brief and explains why it picked the one you got."],
  ["Hand it to your agent", "Paste the style contract into Claude Code, Cursor or any agent, or connect the MCP server."],
  ["Ship something that looks like yours", "Same brief, same identity. Different brief, different one. Nothing random per request."],
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description: DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      sameAs: [REPO_URL, "https://www.npmjs.com/package/@baroxy/cli", "https://www.npmjs.com/package/@baroxy/mcp-server"],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "HowTo",
      "@id": `${SITE_URL}/#how-to`,
      name: "How to give an AI-coded app a unique design identity with Baroxy",
      step: JSON_STEPS.map((st, i) => ({ "@type": "HowToStep", position: i + 1, name: st.name, text: st.text })),
    },
  ],
};

export default function HomePage() {
  const hero = HERO_IDS.map(byId);
  const teaser = TEASER_IDS.map(byId);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <section className="hero">
        <div className="shell-wide hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Design identity for AI-coded apps</p>
            <h1>Your app shouldn&apos;t look like everyone else&apos;s.</h1>
            <p className="sub">
              Coding agents reach for the same font, the same gradient, the same card. Baroxy gives your project a
              locked identity, chosen from {DESIGN_PRESETS.length} hand-tuned presets, so the agent has rules instead of defaults.
            </p>
            <div className="hero-actions">
              <Link href="/generate" className="cta-button">
                Generate your Design DNA <ArrowRight size={16} weight="bold" />
              </Link>
              <Link href="/presets" className="cta-button cta-button--ghost">
                Browse the library
              </Link>
            </div>
            <p className="hero-works">Works with Claude Code · Cursor · Windsurf · Claude Desktop</p>
          </div>

          <div className="hero-stack" aria-label="Three example identities">
            {hero.map((p, i) => (
              <div className={`hero-sample hero-sample--${i + 1}`} key={p.id}>
                <DesignSample name={p.name} colors={p.colors} typography={p.typography} spacing={p.spacing} motion={p.motion} />
                <span className="hero-tag">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="shell-wide">
          <dl className="stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" id="problem">
        <div className="shell-wide">
          <p className="eyebrow">The problem</p>
          <h2>Every AI-coded app looks the same.</h2>
          <p className="section-sub">
            Those defaults are the median of the training data, not a design decision. Here is what Baroxy swaps out.
          </p>
          <div className="swap">
            <div className="swap-head">
              <span>Agent default</span>
              <span>With Baroxy</span>
            </div>
            {TELLS.map(([bad, good]) => (
              <div className="swap-row" key={bad}>
                <span className="swap-bad">{bad}</span>
                <span className="swap-good">{good}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="presets">
        <div className="shell-wide">
          <div className="section-split">
            <div>
              <p className="eyebrow">The library</p>
              <h2>{DESIGN_PRESETS.length} identities, none of them a template.</h2>
            </div>
            <Link href="/presets" className="cta-button cta-button--ghost">
              See all {DESIGN_PRESETS.length} <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          <div className="teaser-grid">
            {teaser.map((p) => (
              <figure className="teaser" key={p.id}>
                <DesignSample name={p.name} colors={p.colors} typography={p.typography} spacing={p.spacing} motion={p.motion} />
                <figcaption>
                  <b>{p.name}</b>
                  <span>{p.inspiredBy}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="shell-wide">
          <p className="eyebrow">How it works</p>
          <h2>Four steps, no design background required.</h2>
          <ol className="steps-list">
            {STEPS.map(([title, text], i) => (
              <li key={title}>
                <span className="step-n">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="product">
        <div className="shell-wide">
          <p className="eyebrow">The product</p>
          <h2>One identity, three ways to use it.</h2>
          <div className="ways">
            <div className="way">
              <h3>Web generator</h3>
              <p>No install. Answer five questions, see your identity rendered live, download the files.</p>
              <Link href="/generate" className="cta-button cta-button--small">
                Open the generator <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
            <div className="way">
              <Terminal title="your-project" copy="npx @baroxy/cli --name Acme --industry fintech --mood trustworthy">
                <Cmd>npx @baroxy/cli --name Acme --industry fintech --mood trustworthy</Cmd>
                <Out>design-dna/STYLE_CONTRACT.md</Out>
                <Out>design-dna/tokens.css</Out>
                <Out>design-dna/tailwind.tokens.js</Out>
              </Terminal>
              <h3>CLI</h3>
              <p>Writes the style contract, tokens and JSON straight into your repo.</p>
            </div>
            <div className="way">
              <Terminal title="claude code" copy="claude mcp add baroxy -- npx @baroxy/mcp-server">
                <Cmd>claude mcp add baroxy -- npx @baroxy/mcp-server</Cmd>
                <Out>Added MCP server baroxy</Out>
              </Terminal>
              <h3>MCP server</h3>
              <p>Let Claude Code, Cursor or any MCP agent pull your identity mid-conversation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="shell-wide">
          <p className="eyebrow">FAQ</p>
          <h2>Questions worth asking before you install anything.</h2>
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
          <h2>Ready to stop looking generic?</h2>
          <Link href="/generate" className="cta-button">
            Generate your Design DNA <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
