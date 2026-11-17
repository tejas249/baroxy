import type { CSSProperties } from "react";
import type { ColorSystem, FontPairing, MotionSystem, SpacingSystem } from "@baroxy/core";

/** Base font-size of the sample, in px, at the reference frame width. Radii are expressed in em so they scale with it. */
const REF_PX = 11.5;

function em(radius: string): string {
  return radius
    .split(" ")
    .map((r) => {
      const px = parseFloat(r);
      if (!Number.isFinite(px) || /%/.test(r) || px >= 999) return r;
      return `${(px / REF_PX).toFixed(3)}em`;
    })
    .join(" ");
}

export interface DesignSampleProps {
  name: string;
  tagline?: string;
  colors: ColorSystem;
  typography: FontPairing;
  spacing: SpacingSystem;
  motion: MotionSystem;
  /** Load the Google Fonts stylesheets for this sample. Turn off until the card is near the viewport. */
  loadFonts?: boolean;
  /** "card" = compact thumbnail, "full" = a fuller product page with form + data. */
  size?: "card" | "full";
}

/**
 * A miniature product page rendered with a Design DNA's real tokens: its fonts, palette, radius
 * and motion. Everything is sized in `em` against a container-query font-size, so it scales
 * cleanly from a thumbnail to a full-width preview.
 */
export function DesignSample({ name, tagline, colors, typography, spacing, motion, loadFonts = true, size = "card" }: DesignSampleProps) {
  const heading = typography.heading;
  const body = typography.body;
  const headWeight = heading.weights[heading.weights.length - 1];
  const bodyWeight = body.weights[0];
  const style = {
    "--s-bg": colors.background,
    "--s-surface": colors.surface,
    "--s-text": colors.text,
    "--s-muted": colors.muted,
    "--s-border": colors.border,
    "--s-primary": colors.primary,
    "--s-on-primary": colors.onPrimary,
    "--s-secondary": colors.secondary,
    "--s-accent": colors.accent,
    "--s-r-sm": em(spacing.radius.sm),
    "--s-r-md": em(spacing.radius.md),
    "--s-r-lg": em(spacing.radius.lg),
    "--s-ease": motion.easing,
    "--s-dur": motion.durations.base,
    "--s-head": `"${heading.family}", system-ui, sans-serif`,
    "--s-body": `"${body.family}", system-ui, sans-serif`,
    "--s-head-w": headWeight,
    "--s-body-w": bodyWeight,
    colorScheme: colors.mode,
  } as CSSProperties;

  const fonts = Array.from(new Set([heading.googleFontUrl, body.googleFontUrl]));
  const line = tagline ?? typography.personality;

  return (
    <div className={`ds-frame ds-frame--${size}`}>
      {loadFonts && fonts.map((href) => <link key={href} rel="stylesheet" href={href} />)}
      <div className="ds" style={style} aria-hidden={size === "card" ? true : undefined}>
        <div className="ds-nav">
          <b className="ds-brand">{name}</b>
          <span className="ds-links">
            <i>Product</i>
            <i>Pricing</i>
            <i>Docs</i>
          </span>
          <span className="ds-btn ds-btn--sm">Get started</span>
        </div>

        <div className="ds-hero">
          <span className="ds-eyebrow">{colors.mode === "dark" ? "Now in beta" : "New release"}</span>
          <h4 className="ds-title">{line.charAt(0).toUpperCase() + line.slice(1)}</h4>
          <p className="ds-lede">A short supporting line set in {body.family}, so you can judge the voice at reading size.</p>
          <div className="ds-actions">
            <span className="ds-btn">Start building</span>
            <span className="ds-btn ds-btn--ghost">Learn more</span>
          </div>
        </div>

        {size === "full" ? (
          <div className="ds-grid">
            <div className="ds-card">
              <span className="ds-label">Revenue</span>
              <strong className="ds-num">$48,210</strong>
              <span className="ds-chip">+12.4%</span>
              <svg className="ds-spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="0,22 14,18 28,20 42,11 56,14 70,6 84,9 100,2" fill="none" stroke="var(--s-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div className="ds-card">
              <span className="ds-label">Email</span>
              <span className="ds-input">you@company.com</span>
              <span className="ds-btn ds-btn--block">Subscribe</span>
            </div>
            <div className="ds-card">
              <span className="ds-label">Status</span>
              <ul className="ds-list">
                <li><span className="ds-dot ds-dot--ok" />Deployed</li>
                <li><span className="ds-dot ds-dot--warn" />Review</li>
                <li><span className="ds-dot ds-dot--bad" />Failed</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="ds-strip">
            <span className="ds-chip">Primary</span>
            <span className="ds-chip ds-chip--alt">Secondary</span>
            <span className="ds-chip ds-chip--acc">Accent</span>
          </div>
        )}
      </div>
    </div>
  );
}
