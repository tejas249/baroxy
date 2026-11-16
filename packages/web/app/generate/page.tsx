"use client";

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Sparkles, Link2 } from "lucide-react";
import { DnaPreview, type GenerateResult } from "../components/DnaPreview";
import { ShareLink } from "../components/ShareLink";

async function readError(res: Response): Promise<string> {
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After");
    return retryAfter
      ? `You're generating too fast — try again in ${retryAfter}s.`
      : "You're generating too fast — slow down and try again shortly.";
  }
  const data = await res.json().catch(() => null);
  return data?.error || `Request failed (${res.status})`;
}

export default function GeneratePage() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [mood, setMood] = useState("");
  const [references, setReferences] = useState("");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [listPublicly, setListPublicly] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShareUrl(null);
    setShareError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, industry, audience, mood, references }),
      });
      if (!res.ok) throw new Error(await readError(res));
      const data: GenerateResult = await res.json();
      setResult(data);
      track("generate", { industry, typography: data.dna.typography.name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    setSharing(true);
    setShareError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, industry, audience, mood, references, public: listPublicly }),
      });
      if (!res.ok) throw new Error(await readError(res));
      const { id } = await res.json();
      setShareUrl(`${window.location.origin}/d/${id}`);
      track("share", { public: listPublicly });
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Could not create a share link");
    } finally {
      setSharing(false);
    }
  }

  return (
    <main className="shell">
      <header className="tool-header">
        <p className="kicker">Design DNA generator</p>
        <h1>Describe your project, get your rules.</h1>
        <p className="sub">
          Fill in the brief below. The same inputs always produce the same Design DNA — different inputs produce a
          different one. Nothing here is random per request.
        </p>
      </header>

      <form className="brief-form" onSubmit={handleSubmit}>
        <label>
          Project name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme" required />
        </label>
        <label>
          Industry / category
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="fintech, dev tools, skincare..."
            required
          />
        </label>
        <label>
          Target audience
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="solo founders, enterprise IT teams..."
            required
          />
        </label>
        <label>
          Mood (comma-separated)
          <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="bold, energetic" />
        </label>
        <label>
          References (comma-separated, optional)
          <input value={references} onChange={(e) => setReferences(e.target.value)} placeholder="Linear, Notion" />
        </label>
        <button type="submit" disabled={loading}>
          <Sparkles size={15} strokeWidth={2} />
          {loading ? "Generating..." : "Generate Design DNA"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {result && (
        <DnaPreview result={result}>
          <div className="share-block">
            {!shareUrl && (
              <>
                <label className="checkbox-label">
                  <input type="checkbox" checked={listPublicly} onChange={(e) => setListPublicly(e.target.checked)} />
                  List this publicly in the <a href="/showcase">showcase</a>
                </label>
                <button type="button" onClick={handleShare} disabled={sharing}>
                  <Link2 size={15} strokeWidth={2} />
                  {sharing ? "Creating link..." : "Save & get shareable link"}
                </button>
              </>
            )}
            {shareUrl && <ShareLink url={shareUrl} />}
            {shareError && <p className="error">{shareError}</p>}
          </div>
        </DnaPreview>
      )}
    </main>
  );
}
