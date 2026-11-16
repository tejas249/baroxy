import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baroxy — Design DNA for AI-coded apps",
  description:
    "Describe your project once and get a locked typography, color, spacing, and motion identity — plus the exact AI tells to avoid — that any coding agent can follow.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
