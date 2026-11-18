"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shell">
      <header className="tool-header">
        <p className="kicker">Something went wrong</p>
        <h1>That didn&apos;t work.</h1>
        <p className="sub">
          An unexpected error stopped this page from loading. It&apos;s on us, not you. Try again, and if it keeps
          happening, <a href="https://github.com/tejas249/baroxy/issues/new">tell us</a>
          {error.digest ? ` and mention reference ${error.digest}` : ""}.
        </p>
        <p style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button type="button" className="cta-button" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="cta-button cta-button--ghost">
            Back home
          </Link>
        </p>
      </header>
    </main>
  );
}
