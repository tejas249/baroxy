import type { DesignDNA } from "./types.js";

export function toStyleContractMarkdown(dna: DesignDNA): string {
  const { brief, typography, colors, spacing, motion, signatureDetails, forbidden, preset, rationale } = dna;
  return `<!-- BAROXY DESIGN DNA — generated for "${brief.name}", seed ${dna.seed}, @baroxy/core@${dna.coreVersion} -->
<!-- This block is binding. Any coding agent working on this project must follow it exactly. -->
<!-- Determinism is guaranteed within this core version, not across versions — pin @baroxy/core@${dna.coreVersion} to reproduce this exact DNA later. -->

## Design DNA: ${brief.name}

**Industry:** ${brief.industry} · **Audience:** ${brief.audience} · **Mood:** ${brief.mood.join(", ") || "unspecified"}

### Preset — "${preset.name}"
- Inspired by: ${preset.inspiredBy}
- Why this one: ${rationale}
- Canvas: **${colors.mode} mode** — build the default theme on \`${colors.background}\`, not the opposite.

### Typography — "${typography.name}"
- Heading: **${typography.heading.family}** (weights: ${typography.heading.weights.join(", ")})
- Body: **${typography.body.family}** (weights: ${typography.body.weights.join(", ")})
- Personality: ${typography.personality}
- Google Fonts: ${typography.heading.googleFontUrl}${typography.body.googleFontUrl !== typography.heading.googleFontUrl ? ` / ${typography.body.googleFontUrl}` : ""}

### Color system — ${colors.mode} canvas
- Background: \`${colors.background}\` · Surface: \`${colors.surface}\` · Border: \`${colors.border}\`
- Text: \`${colors.text}\` · Muted text: \`${colors.muted}\`
- Primary: \`${colors.primary}\` (text on it: \`${colors.onPrimary}\`)
- Secondary: \`${colors.secondary}\`
- Accent: \`${colors.accent}\`
- Neutral scale: ${colors.neutral.map((c) => `\`${c}\``).join(", ")}
- Success / Warning / Danger: \`${colors.success}\` / \`${colors.warning}\` / \`${colors.danger}\`

### Spacing & radius — "${spacing.name}"
- Scale (rem): ${spacing.scale.join(", ")}
- Radius: sm ${spacing.radius.sm}, md ${spacing.radius.md}, lg ${spacing.radius.lg}, full ${spacing.radius.full}

### Motion — "${motion.name}"
- Easing: \`${motion.easing}\`
- Durations: fast ${motion.durations.fast}, base ${motion.durations.base}, slow ${motion.durations.slow}

### Signature details (mandatory — do not design these away)
${signatureDetails.map((d) => `- ${d}`).join("\n")}

### Forbidden — the tells that make an app look AI-generated
${forbidden.map((f) => `- ${f}`).join("\n")}

---
Generated with \`@baroxy/core@${dna.coreVersion}\`. A given core version always maps this brief to this DNA; a later version may expand its pools and produce a different one. Pin \`@baroxy/core@${dna.coreVersion}\` (and the matching \`@baroxy/cli\`/\`@baroxy/mcp-server\`) if you need to reproduce this exact result again.
`;
}

export function toCSSVariables(dna: DesignDNA): string {
  const { colors, spacing, motion, typography } = dna;
  const neutralVars = colors.neutral.map((c, i) => `  --color-neutral-${i + 1}: ${c};`).join("\n");
  const spacingVars = spacing.scale.map((v, i) => `  --space-${i + 1}: ${v}rem;`).join("\n");
  return `:root {
  --font-heading: "${typography.heading.family}", sans-serif;
  --font-body: "${typography.body.family}", sans-serif;

  --color-bg: ${colors.background};
  --color-surface: ${colors.surface};
  --color-text: ${colors.text};
  --color-muted: ${colors.muted};
  --color-border: ${colors.border};
  --color-on-primary: ${colors.onPrimary};
  color-scheme: ${colors.mode};

  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-danger: ${colors.danger};
${neutralVars}

${spacingVars}

  --radius-sm: ${spacing.radius.sm};
  --radius-md: ${spacing.radius.md};
  --radius-lg: ${spacing.radius.lg};
  --radius-full: ${spacing.radius.full};

  --ease: ${motion.easing};
  --duration-fast: ${motion.durations.fast};
  --duration-base: ${motion.durations.base};
  --duration-slow: ${motion.durations.slow};
}
`;
}

export function toTailwindTokens(dna: DesignDNA): string {
  const { colors, spacing, motion, typography } = dna;
  return `/** Baroxy Design DNA — merge into tailwind.config.js theme.extend */
export const baroxyTokens = {
  fontFamily: {
    heading: ["${typography.heading.family}", "sans-serif"],
    body: ["${typography.body.family}", "sans-serif"],
  },
  colors: {
    background: "${colors.background}",
    surface: "${colors.surface}",
    text: "${colors.text}",
    muted: "${colors.muted}",
    border: "${colors.border}",
    "on-primary": "${colors.onPrimary}",
    primary: "${colors.primary}",
    secondary: "${colors.secondary}",
    accent: "${colors.accent}",
    success: "${colors.success}",
    warning: "${colors.warning}",
    danger: "${colors.danger}",
    neutral: {
${colors.neutral.map((c, i) => `      ${(i + 1) * 100}: "${c}",`).join("\n")}
    },
  },
  borderRadius: {
    sm: "${spacing.radius.sm}",
    md: "${spacing.radius.md}",
    lg: "${spacing.radius.lg}",
    full: "${spacing.radius.full}",
  },
  transitionTimingFunction: {
    DEFAULT: "${motion.easing}",
  },
  transitionDuration: {
    fast: "${motion.durations.fast}",
    DEFAULT: "${motion.durations.base}",
    slow: "${motion.durations.slow}",
  },
};
`;
}
