import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadShare } from "../../../lib/share";
import { DnaPreview } from "../../components/DnaPreview";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const record = await loadShare(id);
  if (!record) return { title: "Design DNA not found" };

  const title = `${record.dna.brief.name} — Design DNA`;
  const description = `A locked Design DNA generated for "${record.dna.brief.name}": ${record.dna.typography.name} typography, ${record.dna.colors.harmony} color system, ${record.dna.spacing.name} spacing.`;

  return {
    title,
    description,
    alternates: { canonical: `/d/${id}` },
    openGraph: {
      type: "website",
      url: `/d/${id}`,
      siteName: "Baroxy",
      locale: "en_US",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SharedDnaPage({ params }: PageProps) {
  const { id } = await params;
  const record = await loadShare(id);
  if (!record) notFound();

  return (
    <main className="shell">
      <header className="tool-header">
        <p className="kicker">Shared Design DNA</p>
        <h1>{record.dna.brief.name}</h1>
        <p className="sub">
          Generated {new Date(record.createdAt).toLocaleDateString()} for the brief: {record.dna.brief.industry} ·{" "}
          {record.dna.brief.audience}
          {record.dna.brief.mood.length > 0 ? ` · ${record.dna.brief.mood.join(", ")}` : ""}. Reproduce it yourself at{" "}
          <a href="/generate">/generate</a>.
        </p>
      </header>

      <DnaPreview result={record} />
    </main>
  );
}
