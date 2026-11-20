import Link from "next/link";
import type { Metadata } from "next";
import { listGallery } from "../../lib/share";
import { JsonLd, breadcrumbs } from "../components/JsonLd";
import { SITE_URL } from "../../lib/site";

const TITLE = "Showcase";
const DESCRIPTION = "Design DNAs the community has chosen to share publicly. Real briefs, real variety.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/showcase" },
  openGraph: {
    type: "website",
    url: "/showcase",
    siteName: "Baroxy",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const revalidate = 60;

export default async function ShowcasePage() {
  // The gallery lives in Vercel Blob. Without credentials (CI, local builds) or if the store is
  // unreachable, render the empty state instead of failing the whole build.
  const entries = await listGallery(48).catch(() => []);

  return (
    <main className="shell shell--wide">
      <JsonLd
        data={[
          breadcrumbs(SITE_URL, [
            { name: "Home", path: "/" },
            { name: "Showcase", path: "/showcase" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: TITLE,
            description: DESCRIPTION,
            url: `${SITE_URL}/showcase`,
          },
        ]}
      />
      <header className="tool-header">
        <p className="kicker">Showcase</p>
        <h1>Design DNA, out in the wild.</h1>
        <p className="sub">
          Every entry here was shared on purpose by whoever generated it. Want yours here? Check "List this
          publicly" when you{" "}
          <Link href="/generate">save a share link</Link>.
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="sub">Nothing shared publicly yet. Be the first.</p>
      ) : (
        <div className="gallery-grid">
          {entries.map((entry) => (
            <Link href={`/d/${entry.id}`} key={entry.id} className="gallery-card">
              <div className="gallery-swatches">
                <span style={{ background: entry.colors.primary }} />
                <span style={{ background: entry.colors.secondary }} />
                <span style={{ background: entry.colors.accent }} />
              </div>
              <h3>{entry.name}</h3>
              <p className="gallery-meta">
                {entry.industry} · {entry.typography}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
