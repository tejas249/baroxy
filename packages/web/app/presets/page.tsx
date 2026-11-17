import type { Metadata } from "next";
import Link from "next/link";
import { DESIGN_PRESETS } from "@baroxy/core";
import PresetBrowser from "../components/PresetBrowser";

const TITLE = "Preset library";
const DESCRIPTION = `${DESIGN_PRESETS.length} hand-tuned design identities: palettes, type pairings, radius and motion, each previewed live.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/presets" },
  openGraph: { type: "website", url: "/presets", siteName: "Baroxy", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function PresetsPage() {
  return (
    <main className="shell-wide presets-page">
      <header className="page-head">
        <p className="eyebrow">Library / {DESIGN_PRESETS.length} presets</p>
        <h1>Every identity, rendered with its own type and colour.</h1>
        <p className="sub">
          Baroxy picks from these based on your brief&apos;s space, audience and mood. Each one is a full system: canvas, text roles,
          brand colours, a type pairing, radius and motion. Inspired by the best product and component design languages, never copied.
        </p>
        <Link href="/generate" className="cta-button">
          Match one to my project
        </Link>
      </header>
      <PresetBrowser presets={[...DESIGN_PRESETS]} />
    </main>
  );
}
