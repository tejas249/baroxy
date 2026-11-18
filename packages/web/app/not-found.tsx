import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <header className="tool-header">
        <p className="kicker">404</p>
        <h1>We couldn&apos;t find that page.</h1>
        <p className="sub">The link may be old, mistyped, or a shared Design DNA that no longer exists.</p>
        <p>
          <Link href="/generate" className="cta-button">
            Generate a Design DNA
          </Link>
        </p>
      </header>
    </main>
  );
}
