import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell-wide site-header-inner">
        <Link href="/" className="logo">
          <svg viewBox="0 0 64 64" width="20" height="20" aria-hidden="true">
            <circle cx="32" cy="32" r="32" fill="#ffde59" />
            <rect x="16" y="14" width="7" height="36" fill="#0b0d0c" />
            <rect x="16" y="14" width="22" height="7" fill="#0b0d0c" />
            <rect x="31" y="14" width="7" height="16" fill="#0b0d0c" />
            <rect x="16" y="30" width="22" height="7" fill="#0b0d0c" />
            <rect x="31" y="30" width="7" height="20" fill="#0b0d0c" />
            <rect x="16" y="43" width="22" height="7" fill="#0b0d0c" />
          </svg>
          [baroxy]
        </Link>
        <nav className="site-nav">
          <Link href="/#problem">Product</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <Link href="/generate" className="cta-button cta-button--small">
          Generate Design DNA
        </Link>
      </div>
    </header>
  );
}
