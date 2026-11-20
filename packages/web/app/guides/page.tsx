import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES } from "../../lib/guides";
import { SITE_URL } from "../../lib/site";
import { JsonLd, breadcrumbs } from "../components/JsonLd";

const TITLE = "Guides";
const DESCRIPTION =
  "Practical guides for giving Claude Code, Cursor and other AI coding agents a locked design system: style contracts, design tokens, Tailwind and shadcn/ui.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: { type: "website", url: "/guides", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

export default function GuidesPage() {
  return (
    <main className="shell">
      <JsonLd
        data={[
          breadcrumbs(SITE_URL, [
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: TITLE,
            description: DESCRIPTION,
            url: `${SITE_URL}/guides`,
          },
        ]}
      />
      <header className="tool-header">
        <p className="kicker">Guides</p>
        <h1>Make AI-coded apps look designed.</h1>
        <p className="sub">{DESCRIPTION}</p>
      </header>
      <ul className="guide-list">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`}>
              <strong>{g.title}</strong>
              <span>{g.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
