import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell-wide site-header-inner">
        <Link href="/" className="logo">
          <Logo />
        </Link>
        <nav className="site-nav">
          <Link href="/#problem">Product</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/showcase">Showcase</Link>
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
