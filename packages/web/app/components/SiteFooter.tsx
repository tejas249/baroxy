import Link from "next/link";
import {
  ArrowUpRight,
  GithubLogo,
  Sparkle,
  ListNumbers,
  ImagesSquare,
  Question,
  Package,
  TerminalWindow,
  Bug,
} from "@phosphor-icons/react/dist/ssr";
import Logo from "./Logo";
import CopyButton from "./CopyButton";

const REPO = "https://github.com/tejas249/baroxy";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell-wide">
        <div className="ft-card">
          <div className="ft-top">
            <div className="ft-brand">
              <p className="logo">
                <Logo />
              </p>
              <p className="footer-tagline">
                A locked design identity for every AI-coded app, so it stops looking like the last one.
              </p>
              <div className="install-chip">
                <span className="t-prompt">$</span>
                <code>npx @baroxy/cli</code>
                <CopyButton text="npx @baroxy/cli" />
              </div>
              <div className="ft-social">
                <a href={REPO} target="_blank" rel="noreferrer" aria-label="Baroxy on GitHub">
                  <GithubLogo size={20} weight="duotone" />
                </a>
                <a
                  href="https://www.npmjs.com/package/@baroxy/cli"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Baroxy CLI on npm"
                >
                  <Package size={20} weight="duotone" />
                </a>
              </div>
            </div>

            <div className="ft-cols">
              <div className="footer-col">
                <p className="footer-col-title">Product</p>
                <Link href="/generate">
                  <Sparkle size={16} weight="duotone" /> Generate Design DNA
                </Link>
                <Link href="/#how-it-works">
                  <ListNumbers size={16} weight="duotone" /> How it works
                </Link>
                <Link href="/showcase">
                  <ImagesSquare size={16} weight="duotone" /> Showcase
                </Link>
                <Link href="/guides">
                  <ListNumbers size={16} weight="duotone" /> Guides
                </Link>
                <Link href="/#faq">
                  <Question size={16} weight="duotone" /> FAQ
                </Link>
              </div>

              <div className="footer-col">
                <p className="footer-col-title">Resources</p>
                <a href={REPO} target="_blank" rel="noreferrer">
                  <GithubLogo size={16} weight="duotone" /> GitHub
                  <ArrowUpRight size={12} weight="bold" className="ft-ext" />
                </a>
                <a href="https://www.npmjs.com/package/@baroxy/cli" target="_blank" rel="noreferrer">
                  <Package size={16} weight="duotone" /> CLI on npm
                  <ArrowUpRight size={12} weight="bold" className="ft-ext" />
                </a>
                <a href="https://www.npmjs.com/package/@baroxy/mcp-server" target="_blank" rel="noreferrer">
                  <TerminalWindow size={16} weight="duotone" /> MCP server on npm
                  <ArrowUpRight size={12} weight="bold" className="ft-ext" />
                </a>
              </div>

              <div className="footer-col">
                <p className="footer-col-title">Contact</p>
                <p className="footer-contact-copy">
                  Found a bug, have feedback, or want to use Baroxy in your workflow?
                </p>
                <a href={`${REPO}/issues/new`} target="_blank" rel="noreferrer">
                  <Bug size={16} weight="duotone" /> Open an issue
                  <ArrowUpRight size={12} weight="bold" className="ft-ext" />
                </a>
              </div>
            </div>
          </div>

          <div className="ft-bottom">
            <p>© {new Date().getFullYear()} Baroxy. Built for the AI coding era.</p>
            <nav aria-label="Legal" className="ft-legal">
              <Link href="/changelog">Changelog</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
            </nav>
            <span className="ft-status">
              <i /> Deterministic by design
            </span>
          </div>
        </div>
      </div>
      <div className="ft-mark" aria-hidden="true">
        baro<span>x</span>y
      </div>
    </footer>
  );
}
