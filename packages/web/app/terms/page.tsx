import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Baroxy website, generator and share links.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="shell">
      <article className="prose">
        <h1>Terms of use</h1>
        <p>Last updated 20 November 2026.</p>
        <h2>Using Baroxy</h2>
        <p>
          Baroxy is free to use. The generated Design DNA (tokens, style contract and related files) is yours to use in
          any personal or commercial project. The fonts it names are subject to their own licenses (typically the SIL
          Open Font License for Google Fonts).
        </p>
        <h2>Share links and the showcase</h2>
        <p>
          You are responsible for what you put in a brief you share. Do not submit unlawful, hateful, infringing or
          confidential content. We may remove shared items and block abusive use without notice, and we apply automated
          checks to briefs before they are stored.
        </p>
        <h2>No warranty</h2>
        <p>
          The service and generated output are provided &quot;as is&quot;, without warranties of any kind. Output may change
          between versions of the generator; pin the core version recorded in each result if you need to reproduce it.
          To the extent permitted by law, we are not liable for any loss arising from use of the service.
        </p>
        <h2>Source and license</h2>
        <p>
          The source code is available on{" "}
          <a href="https://github.com/tejas249/baroxy" rel="noreferrer">
            GitHub
          </a>{" "}
          under the MIT License.
        </p>
      </article>
    </main>
  );
}
