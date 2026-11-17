import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "Generate your Design DNA";
const DESCRIPTION =
  "Describe your project (name, industry, audience, mood) and get a locked typography, color, spacing, and motion identity in seconds. Free, no sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/generate" },
  openGraph: {
    type: "website",
    url: "/generate",
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

export default function GenerateLayout({ children }: { children: ReactNode }) {
  return children;
}
