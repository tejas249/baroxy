"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import Logo from "./Logo";

const NAV = [
  { href: "/#problem", label: "Product" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/showcase", label: "Showcase" },
  { href: "/guides", label: "Guides" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="hdr">
      <div className="hdr-bar">
        <Link href="/" className="logo hdr-logo" aria-label="Baroxy home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hdr-nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>

        <Link href="/generate" className="cta-button cta-button--small hdr-cta">
          <span className="hdr-cta-long">Generate Design DNA</span>
          <span className="hdr-cta-short">Generate</span>
        </Link>

        <button
          type="button"
          className="hdr-toggle"
          aria-expanded={open}
          aria-controls="hdr-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      <nav id="hdr-menu" className="hdr-menu" aria-label="Mobile" data-open={open} hidden={!open}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
