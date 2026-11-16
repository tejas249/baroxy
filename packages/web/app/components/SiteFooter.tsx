import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell-wide footer-grid">
        <div className="footer-brand">
          <p className="logo">
            <svg viewBox="0 0 64 64" width="20" height="20" aria-hidden="true">
              <circle cx="32" cy="32" r="32" fill="#ffde59" />
              <rect x="16" y="14" width="7" height="36" fill="#0e0c09" />
              <rect x="16" y="14" width="22" height="7" fill="#0e0c09" />
              <rect x="31" y="14" width="7" height="16" fill="#0e0c09" />
              <rect x="16" y="30" width="22" height="7" fill="#0e0c09" />
              <rect x="31" y="30" width="7" height="20" fill="#0e0c09" />
              <rect x="16" y="43" width="22" height="7" fill="#0e0c09" />
            </svg>
            [baroxy]
          </p>
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
