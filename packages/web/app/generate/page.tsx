"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Sparkle, LinkSimple, ArrowRight, ArrowLeft, PencilSimpleLine, Check } from "@phosphor-icons/react";
import { DnaPreview, type GenerateResult } from "../components/DnaPreview";
import { ShareLink } from "../components/ShareLink";

type FieldKey = "name" | "industry" | "audience" | "mood" | "references";

const STEPS: {
  key: FieldKey;
  title: string;
  hint: string;
  placeholder: string;
  required: boolean;
  chips: string[];
  multi?: boolean;
}[] = [
  {
    key: "name",
    title: "What are you building?",
    hint: "Your project or product name.",
    placeholder: "Acme",
    required: true,
    chips: [],
  },
  {
    key: "industry",
    title: "What space is it in?",
    hint: "Pick one or type your own.",
    placeholder: "fintech, dev tools, skincare...",
    required: true,
    chips: ["fintech", "developer tools", "skincare", "healthcare", "e-commerce", "education", "travel", "creative studio"],
  },
  {
    key: "audience",
    title: "Who is it for?",
    hint: "The people you want to win over.",
    placeholder: "solo founders, enterprise IT teams...",
    required: true,
    chips: ["solo founders", "enterprise IT teams", "designers", "developers", "small businesses", "students"],
  },
  {
    key: "mood",
    title: "How should it feel?",
    hint: "Choose a few words that describe the vibe.",
    placeholder: "bold, energetic",
    required: false,
    multi: true,
    chips: ["bold", "calm", "playful", "premium", "minimal", "energetic", "trustworthy", "warm"],
  },
  {
    key: "references",
    title: "Any brands you admire?",
    hint: "Optional. Gives the generator a direction to lean toward.",
    placeholder: "Linear, Notion",
    required: false,
    multi: true,
    chips: ["Linear", "Notion", "Stripe", "Apple", "Vercel", "Figma"],
  },
];
const REVIEW = STEPS.length;

function splitList(v: string) {
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

async function readError(res: Response): Promise<string> {
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After");
    return retryAfter
      ? `You're generating too fast. Try again in ${retryAfter}s.`
      : "You're generating too fast. Slow down and try again shortly.";
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
  const [step, setStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [listPublicly, setListPublicly] = useState(false);

  const values: Record<FieldKey, string> = { name, industry, audience, mood, references };
  const setters: Record<FieldKey, (v: string) => void> = {
    name: setName,
    industry: setIndustry,
    audience: setAudience,
    mood: setMood,
    references: setReferences,
  };

  useEffect(() => {
    if (step < REVIEW && !collapsed) inputRef.current?.focus();
  }, [step, collapsed]);

  useEffect(() => {
    if (result && collapsed) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result, collapsed]);

  function pickChip(cfg: (typeof STEPS)[number], chip: string) {
    const cur = values[cfg.key];
    if (cfg.multi) {
      const list = splitList(cur);
      const has = list.some((x) => x.toLowerCase() === chip.toLowerCase());
      const next = has ? list.filter((x) => x.toLowerCase() !== chip.toLowerCase()) : [...list, chip];
      setters[cfg.key](next.join(", "));
    } else {
      setters[cfg.key](chip);
    }
    // Keep the keyboard flow: Enter continues instead of re-toggling the focused chip.
    inputRef.current?.focus();
  }

  function chipActive(cfg: (typeof STEPS)[number], chip: string) {
    const cur = values[cfg.key];
    return cfg.multi
      ? splitList(cur).some((x) => x.toLowerCase() === chip.toLowerCase())
      : cur.trim().toLowerCase() === chip.toLowerCase();
  }

  const canAdvance = step >= REVIEW || !STEPS[step].required || values[STEPS[step].key].trim().length > 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < REVIEW) {
      if (canAdvance) setStep(step + 1);
      return;
    }
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
      setCollapsed(true);
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
          Five quick questions, about thirty seconds. The same answers always produce the same Design DNA. Nothing
          here is random per request.
        </p>
      </header>

      {collapsed && result ? (
        <div className="wizard wizard--summary">
          <div className="wiz-summary-head">
            <span className="wiz-done">
              <Check size={14} weight="bold" /> Brief complete
            </span>
            <button type="button" className="cta-button cta-button--ghost cta-button--small" onClick={() => {
              setCollapsed(false);
              setStep(0);
            }}>
              <PencilSimpleLine size={14} weight="bold" /> Edit brief
            </button>
          </div>
          <div className="wiz-chips-summary">
            {STEPS.map((cfg) =>
              values[cfg.key].trim() ? (
                <span className="wiz-pill" key={cfg.key}>
                  <em>{cfg.key}</em>
                  {values[cfg.key]}
                </span>
              ) : null
            )}
          </div>
        </div>
      ) : (
        <form className="wizard" onSubmit={handleSubmit}>
          <div className="wiz-progress">
            <div className="wiz-progress-top">
              <span aria-live="polite">{step < REVIEW ? `Step ${step + 1} of ${STEPS.length}` : "Ready to generate"}</span>
              <span>{Math.round((Math.min(step, REVIEW) / REVIEW) * 100)}%</span>
            </div>
            <div
              className="wiz-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((Math.min(step, REVIEW) / REVIEW) * 100)}
              aria-label="Brief progress"
            >
              <i style={{ width: `${Math.max(6, (Math.min(step, REVIEW) / REVIEW) * 100)}%` }} />
            </div>
            <ol className="wiz-dots" aria-hidden="true">
              {STEPS.map((cfg, i) => (
                <li key={cfg.key} className={i < step ? "done" : i === step ? "current" : ""}>
                  {i < step ? <Check size={11} weight="bold" /> : i + 1}
                </li>
              ))}
            </ol>
          </div>

          {step < REVIEW ? (
            <div className="wiz-body" key={step}>
              <h2 className="wiz-title">{STEPS[step].title}</h2>
              <p className="wiz-hint">{STEPS[step].hint}</p>
              <input
                ref={inputRef}
                className="wiz-input"
                value={values[STEPS[step].key]}
                onChange={(e) => setters[STEPS[step].key](e.target.value)}
                placeholder={STEPS[step].placeholder}
                aria-label={STEPS[step].title}
                autoComplete="off"
              />
              {STEPS[step].chips.length > 0 && (
                <div className="chip-row">
                  {STEPS[step].chips.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      className={`chip ${chipActive(STEPS[step], chip) ? "chip--on" : ""}`}
                      aria-pressed={chipActive(STEPS[step], chip)}
                      onClick={() => pickChip(STEPS[step], chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="wiz-body" key="review">
              <h2 className="wiz-title">Looks good?</h2>
              <p className="wiz-hint">Here&apos;s your brief. Jump back to change anything.</p>
              <dl className="wiz-review">
                {STEPS.map((cfg, i) => (
                  <div key={cfg.key}>
                    <dt>{cfg.title.replace("?", "")}</dt>
                    <dd>{values[cfg.key].trim() || <span className="muted">Skipped</span>}</dd>
                    <button type="button" onClick={() => setStep(i)} aria-label={`Edit ${cfg.key}`}>
                      <PencilSimpleLine size={14} weight="bold" />
                    </button>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="wiz-actions">
            {step > 0 ? (
              <button type="button" className="cta-button cta-button--ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} weight="bold" /> Back
              </button>
            ) : (
              <span />
            )}
            <div className="wiz-actions-right">
              {step < REVIEW && !STEPS[step].required && (
                <button type="button" className="wiz-skip" onClick={() => setStep(step + 1)}>
                  Skip
                </button>
              )}
              <button type="submit" className="cta-button cta-button--shimmer" disabled={loading || !canAdvance}>
                {step < REVIEW ? (
                  <>
                    Continue <ArrowRight size={16} weight="bold" />
                  </>
                ) : (
                  <>
                    <Sparkle size={16} weight="duotone" />
                    {loading ? "Generating..." : "Generate Design DNA"}
                  </>
                )}
              </button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      )}

      <div ref={resultRef} />
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
                  <LinkSimple size={16} weight="duotone" />
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
