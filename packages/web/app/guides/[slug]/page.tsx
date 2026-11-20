import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES, getGuide } from "../../../lib/guides";
import { SITE_NAME, SITE_URL } from "../../../lib/site";
import { JsonLd, breadcrumbs } from "../../components/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      url: `/guides/${guide.slug}`,
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      images: ["/opengraph-image"],
    },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <main className="shell">
      <JsonLd
        data={[
          breadcrumbs(SITE_URL, [
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            datePublished: guide.published,
            dateModified: guide.published,
            mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
            author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            publisher: { "@id": `${SITE_URL}/#org` },
          },
        ]}
      />
      <article className="prose">
        <p className="crumbs">
          <Link href="/guides">Guides</Link> / {guide.title}
        </p>
        <h1>{guide.title}</h1>
        <p className="sub">{guide.description}</p>
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.code && (
              <pre>
                <code>{s.code}</code>
              </pre>
            )}
          </section>
        ))}
        <p>
          <Link href="/generate" className="cta-button">
            Generate your Design DNA
          </Link>
        </p>
      </article>
    </main>
  );
}
