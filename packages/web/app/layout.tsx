import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";

const SITE_NAME = "Baroxy";
const TITLE = "Baroxy — Design DNA for AI-coded apps";
const DESCRIPTION =
  "Describe your project once and get a locked typography, color, spacing, and motion identity — plus the exact AI tells to avoid — that any coding agent can follow.";

export const metadata: Metadata = {
  metadataBase: new URL("https://baroxy.vercel.app"),
  title: {
    default: TITLE,
    template: "%s — Baroxy",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "design system generator",
    "AI coding agent",
    "design tokens",
    "Claude Code",
    "Cursor",
    "design DNA",
    "deterministic design",
    "MCP server",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0c09",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
