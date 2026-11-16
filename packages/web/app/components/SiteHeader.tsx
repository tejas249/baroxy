import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell-wide site-header-inner">
        <Link href="/" className="logo">
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
