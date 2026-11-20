import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Baroxy collects, what it stores when you share a Design DNA, and your choices.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="shell">
      <article className="prose">
        <h1>Privacy</h1>
        <p>Last updated 20 November 2026.</p>
        <h2>What you type</h2>
        <p>
          The brief you enter (project name, industry, audience, mood, reference brands) is sent to our server to
          generate your Design DNA. Generating does not require an account and the brief is not stored unless you
          choose to share it.
        </p>
        <h2>Share links and the showcase</h2>
        <p>
          If you click &quot;Save &amp; get shareable link&quot;, the brief and generated result are stored in Vercel Blob and
          are readable by anyone who has the link. If you also tick &quot;List this publicly&quot;, the project name, industry,
          mood and colors appear in the public showcase and may be indexed by search engines. Do not put confidential
          or personal information in a brief you intend to share. To remove a shared item, open an issue on GitHub with
          its link.
        </p>
        <h2>Analytics and logs</h2>
        <p>
          We use Vercel Web Analytics, which is cookie-free and records page views and a few product events (such as
          generating, downloading and sharing) without identifying you. Our host keeps standard request logs, including
          IP addresses, for security and rate limiting.
        </p>
        <h2>Third parties</h2>
        <p>
          Generated previews load fonts from Google Fonts, which means your browser contacts Google when a preview is
          shown. We do not sell personal data or use it for advertising.
        </p>
        <h2>Contact</h2>
        <p>
          Questions or removal requests: open an issue at{" "}
          <a href="https://github.com/tejas249/baroxy/issues/new" rel="noreferrer">
            github.com/tejas249/baroxy
          </a>
          .
        </p>
      </article>
    </main>
  );
}
