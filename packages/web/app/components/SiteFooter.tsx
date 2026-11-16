import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell-wide footer-grid">
        <div className="footer-brand">
          <p className="logo">[baroxy]</p>
          <p className="footer-tagline">
            A locked design identity for every AI-coded app, so it stops looking like the last one.
          </p>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Product</p>
          <Link href="/generate">Generate Design DNA</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faq">FAQ</Link>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Resources</p>
          <a href="https://github.com/tejas249/baroxy" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <Link href="/#product">CLI &amp; MCP server</Link>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Contact</p>
          <p className="footer-contact-copy">
            Found a bug, have feedback, or want to use Baroxy in your workflow?
          </p>
          <a href="https://github.com/tejas249/baroxy/issues/new" target="_blank" rel="noreferrer">
            Open an issue on GitHub →
          </a>
        </div>
      </div>

      <div className="shell-wide footer-bottom">
        <p>© {new Date().getFullYear()} Baroxy. Built for the AI coding era.</p>
      </div>
    </footer>
  );
}
