import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What changed in Baroxy: new presets, exports, fixes and site updates.",
  alternates: { canonical: "/changelog" },
};

const ENTRIES = [
  {
    date: "2026-11-20",
    title: "Exports, takes and guides",
    items: [
      "Download everything as one zip, plus shadcn/ui theme and Figma tokens exports.",
      "Paste-ready agent rules for CLAUDE.md, AGENTS.md and .cursorrules.",
      "Try another take: get a different preset for the same brief.",
      "Preview a derived dark or light canvas next to the designed one.",
      "New guides, privacy policy and terms.",
    ],
  },
  {
    date: "2026-11-20",
    title: "Moved to baroxy.xyz",
    items: ["baroxy.xyz is the canonical address; old vercel.app links redirect permanently."],
  },
  {
    date: "2026-11-18",
    title: "Security, reliability and performance",
    items: [
      "Content-Security-Policy and other security headers, request validation and size caps.",
      "Legacy share links keep working; preset matching fixes.",
    ],
  },
  {
    date: "2026-11-17",
    title: "109 curated presets",
    items: ["Hand-tuned design identities with live sample previews and a written rationale for each match."],
  },
];

export default function ChangelogPage() {
  return (
    <main className="shell">
      <article className="prose">
        <h1>Changelog</h1>
        {ENTRIES.map((e) => (
          <section key={e.date}>
            <h2>
              {e.title} <small>· {e.date}</small>
            </h2>
            <ul>
              {e.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
        ))}
        <p>Engine changes are tracked separately in the @baroxy/core changelog on GitHub.</p>
      </article>
    </main>
  );
}
