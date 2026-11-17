"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import {
  Sparkle,
  LinkSimple,
  ArrowRight,
  ArrowLeft,
  PencilSimpleLine,
  Check,
  Tag,
  Buildings,
  UsersThree,
  Smiley,
  BookmarkSimple,
  CircleNotch,
  Confetti,
  ArrowCounterClockwise,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { DnaPreview, type GenerateResult } from "../components/DnaPreview";
import { DesignSample } from "../components/DesignSample";
import { ShareLink } from "../components/ShareLink";

type FieldKey = "name" | "industry" | "audience" | "mood" | "references";
type Phase = "ask" | "review" | "building" | "ready" | "full";

const STEPS: {
  key: FieldKey;
  label: string;
  icon: PhosphorIcon;
  title: string;
  hint: string;
  placeholder: string;
  required: boolean;
  chips: string[];
  multi?: boolean;
}[] = [
  {
    key: "name",
    label: "Name",
    icon: Tag,
    title: "What are you building?",
    hint: "Your project or product name.",
    placeholder: "Acme",
    required: true,
    chips: [],
  },
  {
    key: "industry",
    label: "Space",
    icon: Buildings,
    title: "What space is it in?",
    hint: "Pick one or type your own.",
    placeholder: "fintech, dev tools, skincare...",
    required: true,
    chips: ["fintech", "developer tools", "skincare", "healthcare", "e-commerce", "education", "travel", "creative studio"],
  },
  {
    key: "audience",
    label: "Audience",
    icon: UsersThree,
    title: "Who is it for?",
    hint: "The people you want to win over.",
    placeholder: "solo founders, enterprise IT teams...",
    required: true,
    chips: ["solo founders", "enterprise IT teams", "designers", "developers", "small businesses", "students"],
  },
  {
    key: "mood",
    label: "Vibe",
    icon: Smiley,
    title: "How should it feel?",
    hint: "Choose a few words that describe the vibe.",
    placeholder: "bold, energetic",
    required: false,
    multi: true,
    chips: ["bold", "calm", "playful", "premium", "minimal", "energetic", "trustworthy", "warm"],
  },
  {
    key: "references",
    label: "Inspiration",
    icon: BookmarkSimple,
    title: "Any brands you admire?",
    hint: "Optional. Gives the generator a direction to lean toward.",
    placeholder: "Linear, Notion",
    required: false,
    multi: true,
    chips: ["Linear", "Notion", "Stripe", "Apple", "Vercel", "Figma"],
  },
];
const REVIEW = STEPS.length;

const BUILD_STAGES = [
  "Reading your brief",
  "Choosing a typography pairing",
  "Composing the color harmony",
  "Setting spacing and motion",
  "Locking signature details",
];
const BUILD_MS = 4800;
const SHUFFLE = ["#6b1d3a", "#e0a085", "#2f6b57", "#c9a24d", "#0b5d7a", "#d9541e", "#c4456a", "#2563a8", "#8c2f2f", "#6c7a6b"];

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

  const [phase, setPhase] = useState<Phase>("ask");
  const [step, setStep] = useState(0);
  const [buildPct, setBuildPct] = useState(0);
  const [shuffleTick, setShuffleTick] = useState(0);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [listPublicly, setListPublicly] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);

  const values: Record<FieldKey, string> = { name, industry, audience, mood, references };
  const setters: Record<FieldKey, (v: string) => void> = {
    name: setName,
    industry: setIndustry,
    audience: setAudience,
    mood: setMood,
    references: setReferences,
  };

  const inFlow = phase === "ask" || phase === "review";
  const cur = step < REVIEW ? STEPS[step] : null;
  const curFilled = cur ? values[cur.key].trim().length > 0 : true;
  const canAdvance = !cur || !cur.required || curFilled;

  // Progress: each answered step is worth a fifth; typing in the current one counts as partway.
  const progress = phase === "ask" ? Math.round(((step + (curFilled ? 0.6 : 0)) / REVIEW) * 100) : 100;
  const filledCount = STEPS.filter((c) => values[c.key].trim()).length;

  useEffect(() => {
    if (phase === "ask") inputRef.current?.focus();
  }, [phase, step]);

  useEffect(() => {
    if (phase === "full") fullRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase]);

  // Swatch shuffle while the DNA is "building"
  useEffect(() => {
    if (phase !== "building") return;
    const id = setInterval(() => setShuffleTick((t) => t + 1), 420);
    return () => clearInterval(id);
  }, [phase]);

  function pickChip(cfg: (typeof STEPS)[number], chip: string) {
    const curVal = values[cfg.key];
    if (cfg.multi) {
      const list = splitList(curVal);
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
    const curVal = values[cfg.key];
    return cfg.multi
      ? splitList(curVal).some((x) => x.toLowerCase() === chip.toLowerCase())
      : curVal.trim().toLowerCase() === chip.toLowerCase();
  }

  async function startBuild() {
    setError(null);
    setShareUrl(null);
    setShareError(null);
    setBuildPct(0);
    setPhase("building");

    const started = Date.now();
    const ticker = setInterval(() => {
      setBuildPct(Math.min(97, ((Date.now() - started) / BUILD_MS) * 100));
    }, 60);

    try {
      const request = fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, industry, audience, mood, references }),
      }).then(async (res) => {
        if (!res.ok) throw new Error(await readError(res));
        return (await res.json()) as GenerateResult;
      });
      // The staged animation always runs its full length so the work feels deliberate.
      const [data] = await Promise.all([request, new Promise((r) => setTimeout(r, BUILD_MS))]);
      clearInterval(ticker);
      setBuildPct(100);
      setResult(data);
      track("generate", { industry, typography: data.dna.typography.name });
      setTimeout(() => setPhase("ready"), 450);
    } catch (err) {
      clearInterval(ticker);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("review");
      setStep(REVIEW);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < REVIEW) {
      if (canAdvance) {
        const next = step + 1;
        setStep(next);
        if (next === REVIEW) setPhase("review");
      }
      return;
    }
    startBuild();
  }

  function goTo(i: number) {
    setPhase(i >= REVIEW ? "review" : "ask");
    setStep(i);
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

  function startOver() {
    setPhase("ask");
    setStep(0);
    setResult(null);
    setShareUrl(null);
  }

  const stageIndex = Math.min(BUILD_STAGES.length - 1, Math.floor((buildPct / 100) * BUILD_STAGES.length));

  return (
    <main className="shell shell--wide">
      <header className="tool-header tool-header--narrow">
        <p className="kicker">Design DNA generator</p>
        <h1>Let&apos;s build your design identity.</h1>
        <p className="sub">
          Five quick answers, about thirty seconds. The same answers always give the same Design DNA.
        </p>
      </header>

      {/* ------------------------------------------------ asking */}
      {inFlow && (
        <div className="studio">
          <div className="studio-progress">
            <div className="studio-progress-top">
              <span aria-live="polite">
                {phase === "ask" ? `Step ${step + 1} of ${REVIEW}` : "Ready to build"}
              </span>
              <span className="studio-pct">{progress}% complete</span>
            </div>
            <div
              className="seg-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Brief progress"
            >
              {STEPS.map((c, i) => {
                const fill = phase === "review" || i < step ? 100 : i === step ? (curFilled ? 60 : 8) : 0;
                return (
                  <span className="seg" key={c.key}>
                    <i style={{ width: `${fill}%` }} />
                  </span>
                );
              })}
            </div>
            <ol className="seg-labels">
              {STEPS.map((c, i) => {
                const done = phase === "review" || i < step;
                const Ic = c.icon;
                return (
                  <li key={c.key} className={done ? "done" : i === step && phase === "ask" ? "current" : ""}>
                    <button type="button" onClick={() => goTo(i)} disabled={!done && i !== step}>
                      {done ? <Check size={13} weight="bold" /> : <Ic size={13} weight="duotone" />}
                      <span>{c.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="studio-grid">
            <form className="studio-main" onSubmit={handleSubmit}>
              {phase === "ask" && cur ? (
                <div className="wiz-body" key={step}>
                  <h2 className="wiz-title">{cur.title}</h2>
                  <p className="wiz-hint">{cur.hint}</p>
                  <input
                    ref={inputRef}
                    className="wiz-input"
                    value={values[cur.key]}
                    onChange={(e) => setters[cur.key](e.target.value)}
                    placeholder={cur.placeholder}
                    aria-label={cur.title}
                    autoComplete="off"
                  />
                  {cur.chips.length > 0 && (
                    <div className="chip-row">
                      {cur.chips.map((chip) => (
                        <button
                          type="button"
                          key={chip}
                          className={`chip ${chipActive(cur, chip) ? "chip--on" : ""}`}
                          aria-pressed={chipActive(cur, chip)}
                          onClick={() => pickChip(cur, chip)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="wiz-body" key="review">
                  <h2 className="wiz-title">Ready when you are.</h2>
                  <p className="wiz-hint">
                    Everything looks filled in. Hit build and we&apos;ll turn this into your Design DNA.
                  </p>
                  <dl className="wiz-review">
                    {STEPS.map((c, i) => (
                      <div key={c.key}>
                        <dt>{c.label}</dt>
                        <dd>{values[c.key].trim() || <span className="muted">Skipped</span>}</dd>
                        <button type="button" onClick={() => goTo(i)} aria-label={`Edit ${c.label}`}>
                          <PencilSimpleLine size={14} weight="bold" />
                        </button>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="wiz-actions">
                {step > 0 ? (
                  <button type="button" className="cta-button cta-button--ghost" onClick={() => goTo(step - 1)}>
                    <ArrowLeft size={16} weight="bold" /> Back
                  </button>
                ) : (
                  <span />
                )}
                <div className="wiz-actions-right">
                  {cur && !cur.required && (
                    <button type="button" className="wiz-skip" onClick={() => goTo(step + 1)}>
                      Skip
                    </button>
                  )}
                  <button type="submit" className="cta-button cta-button--shimmer" disabled={!canAdvance}>
                    {cur ? (
                      <>
                        Continue <ArrowRight size={16} weight="bold" />
                      </>
                    ) : (
                      <>
                        <Sparkle size={16} weight="duotone" /> Build my Design DNA
                      </>
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="error">{error}</p>}
            </form>

            {/* live brief card that fills as you answer */}
            <aside className="brief-card" aria-label="Your brief so far">
              <div className="brief-card-head">
                <h3>Your brief</h3>
                <span>
                  {filledCount}/{REVIEW}
                </span>
              </div>
              <ul>
                {STEPS.map((c, i) => {
                  const v = values[c.key].trim();
                  const Ic = c.icon;
                  const active = phase === "ask" && i === step;
                  return (
                    <li key={c.key} className={`slot ${v ? "slot--filled" : ""} ${active ? "slot--active" : ""}`}>
                      <span className="slot-icon">{v ? <Check size={15} weight="bold" /> : <Ic size={15} weight="duotone" />}</span>
                      <div>
                        <p className="slot-label">{c.label}</p>
                        {v ? <p className="slot-value">{v}</p> : <span className="slot-empty" />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ building */}
      {phase === "building" && (
        <section className="building" aria-live="polite">
          <p className="building-eyebrow">Building the Design DNA for</p>
          <h2 className="building-name">{name || "your project"}</h2>

          <div className="shuffle" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} style={{ background: SHUFFLE[(shuffleTick * 3 + i * 7) % SHUFFLE.length] }} />
            ))}
          </div>

          <div className="build-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(buildPct)}>
            <i style={{ width: `${buildPct}%` }} />
          </div>
          <p className="build-pct">{Math.round(buildPct)}%</p>

          <ul className="stages">
            {BUILD_STAGES.map((label, i) => {
              const state = buildPct >= 100 || i < stageIndex ? "done" : i === stageIndex ? "active" : "todo";
              return (
                <li key={label} className={`stage stage--${state}`}>
                  <span className="stage-dot">
                    {state === "done" ? (
                      <Check size={13} weight="bold" />
                    ) : state === "active" ? (
                      <CircleNotch size={14} weight="bold" className="spin" />
                    ) : null}
                  </span>
                  {label}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ------------------------------------------------ ready: approve */}
      {phase === "ready" && result && (
        <section className="ready">
          <link rel="stylesheet" href={result.dna.typography.heading.googleFontUrl} />
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => {
              const dc = result.dna.colors;
              const colors = [dc.primary, dc.secondary, dc.accent, dc.surface, dc.text];
              const angle = (i / 18) * Math.PI * 2;
              return (
                <i
                  key={i}
                  style={
                    {
                      background: colors[i % colors.length],
                      "--dx": `${Math.cos(angle) * (160 + (i % 3) * 50)}px`,
                      "--dy": `${Math.sin(angle) * (120 + (i % 4) * 36) - 40}px`,
                      "--rot": `${i * 47}deg`,
                      animationDelay: `${(i % 6) * 25}ms`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>

          <span className="ready-badge">
            <Confetti size={16} weight="duotone" /> Your Design DNA is ready
          </span>
          <h2
            className="ready-name"
            style={{
              fontFamily: `"${result.dna.typography.heading.family}", serif`,
              fontWeight: result.dna.typography.heading.weights[result.dna.typography.heading.weights.length - 1],
            }}
          >
            {result.dna.brief.name || name}
          </h2>
          <div className="ready-sample">
            <DesignSample
              name={result.dna.brief.name || name}
              colors={result.dna.colors}
              typography={result.dna.typography}
              spacing={result.dna.spacing}
              motion={result.dna.motion}
            />
          </div>
          <div className="ready-chips">
            <span>{result.dna.typography.name}</span>
            <span>{result.dna.preset.name}</span>
            <span>{result.dna.colors.mode} canvas</span>
            <span>{result.dna.spacing.name}</span>
            <span>{result.dna.motion.name} motion</span>
          </div>

          <p className="ready-ask">Does this feel like {result.dna.brief.name || name}?</p>
          <div className="ready-actions">
            <button type="button" className="cta-button cta-button--shimmer" onClick={() => setPhase("full")}>
              <Check size={16} weight="bold" /> Looks right, show me everything
            </button>
            <button type="button" className="cta-button cta-button--ghost" onClick={() => goTo(REVIEW)}>
              <PencilSimpleLine size={16} weight="bold" /> Tweak my brief
            </button>
          </div>
        </section>
      )}

      {/* ------------------------------------------------ full result */}
      {phase === "full" && result && (
        <div ref={fullRef}>
          <div className="approved-bar">
            <span className="wiz-done">
              <Check size={14} weight="bold" /> Approved
            </span>
            <div className="wiz-chips-summary">
              {STEPS.map((c) =>
                values[c.key].trim() ? (
                  <span className="wiz-pill" key={c.key}>
                    <em>{c.label}</em>
                    {values[c.key]}
                  </span>
                ) : null
              )}
            </div>
            <button type="button" className="cta-button cta-button--ghost cta-button--small" onClick={startOver}>
              <ArrowCounterClockwise size={14} weight="bold" /> Start over
            </button>
          </div>

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
        </div>
      )}
    </main>
  );
}
