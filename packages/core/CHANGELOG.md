# @baroxy/core changelog

## Determinism policy

A given `@baroxy/core` version always maps the same brief to the same Design DNA. That
guarantee holds **within** a version, not across versions: a later release may expand the
font/spacing/motion/signature-detail pools, which shifts which option a given brief lands on.

Every generated `DesignDNA` records the core version that produced it (`coreVersion`, also
stamped into `STYLE_CONTRACT.md`'s header and footer). If you need a brief to keep producing
the exact DNA you built against, pin that exact version of `@baroxy/core` — and the matching
`@baroxy/cli` / `@baroxy/mcp-server` — in your project instead of letting `npx` fetch latest.

## 0.4.0

- **100+ curated design presets.** The generator now starts from a hand-tuned preset (palette with
  real background/surface/text/border roles in light *or* dark, type pairing, radius and motion)
  chosen from the brief's mood, industry and audience, instead of a random hue plus a random font.
- `DesignDNA` gains `preset`, `rationale`, and `colors.{mode,background,surface,text,muted,border,onPrimary}`.
- `STYLE_CONTRACT.md`, `tokens.css` and the Tailwind tokens include the new surface/text roles.
- **Output for existing briefs changes relative to 0.3.0.** Pin `@baroxy/core@0.3.0` to reproduce older DNA.

## 0.3.0

- Added `DesignDNA.coreVersion`, stamped into every generated DNA and into
  `STYLE_CONTRACT.md`'s header/footer, so a Design DNA always records exactly which core
  version produced it.
- Documented the determinism policy above. No change to how existing briefs map to a DNA.

## 0.2.0

- Expanded variety: font pairings 12 → 34, spacing systems 5 → 9, motion systems 5 → 8,
  signature-details pool 20 → 30 (handing out 5 per project instead of 4).
- **Output for existing briefs changes relative to 0.1.0.** Pin `@baroxy/core@0.1.0` if you
  generated a Design DNA before this release and need that exact result again.
- Added `DesignDNA.coreVersion`.

## 0.1.0

Initial public release: deterministic typography, color, spacing, motion, signature-detail,
and anti-pattern generation from a `DesignBrief`.
