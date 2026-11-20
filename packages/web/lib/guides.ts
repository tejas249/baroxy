export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: string;
  sections: { heading: string; body: string[]; code?: string }[];
}

const REPO = "https://github.com/tejas249/baroxy";

export const GUIDES: Guide[] = [
  {
    slug: "stop-ai-websites-looking-the-same",
    title: "How to stop AI-generated websites from looking the same",
    description:
      "Why Claude, Cursor and v0 keep producing the same Inter-plus-indigo-gradient layout, and how to give your coding agent a locked design identity instead.",
    published: "2026-11-20",
    sections: [
      {
        heading: "Why every AI-built site looks alike",
        body: [
          "A coding agent without design direction falls back on the most common patterns in its training data: Inter for type, an indigo-to-violet gradient hero, rounded cards with soft shadows and a three-column feature grid. These aren't design decisions. They're the statistical median of the web.",
          "The fix is not a better prompt like \"make it unique\". Vague taste words give the model nothing to hold onto, so it regresses to the median again two screens later.",
        ],
      },
      {
        heading: "Give the agent a contract, not a mood",
        body: [
          "Agents follow concrete, checkable rules well: exact font families, exact hex colors, a radius scale, an easing curve, and an explicit list of things not to do. Put those in a file the agent reads at the start of every session.",
          "A Design DNA is that file. You describe the project in a short brief (name, industry, audience, mood, brands you admire) and Baroxy returns a locked typography pairing, color system, spacing and radius scale, motion personality, mandatory signature details and a list of AI tells to avoid.",
        ],
      },
      {
        heading: "Set it up in two minutes",
        body: [
          "Run the CLI in your project, then reference the generated contract from your agent instructions file so it applies to every session.",
        ],
        code: "npx @baroxy/cli\n\n# then add to CLAUDE.md or AGENTS.md:\n# Follow design-dna/STYLE_CONTRACT.md for every UI change.",
      },
      {
        heading: "Why deterministic matters",
        body: [
          "The same brief always produces the same Design DNA, so teammates and CI get identical output, and a design decision doesn't silently change when someone re-runs the generator. Each result records the exact @baroxy/core version that made it, so you can pin it.",
        ],
      },
    ],
  },
  {
    slug: "claude-code-design-system",
    title: "Give Claude Code a design system it will actually follow",
    description:
      "Use a style contract and the Baroxy MCP server so Claude Code builds every screen with the same fonts, colors, radius and motion.",
    published: "2026-11-20",
    sections: [
      {
        heading: "Option 1: a style contract in CLAUDE.md",
        body: [
          "Generate a Design DNA, save STYLE_CONTRACT.md into your repo, and add one line to CLAUDE.md telling Claude Code to follow it for all UI work. Claude Code loads CLAUDE.md at the start of each session, so the contract is in context before it writes any markup.",
        ],
        code: "## Design\nFollow design-dna/STYLE_CONTRACT.md for every UI change. Use tokens from design-dna/tokens.css, never hard-coded colors.",
      },
      {
        heading: "Option 2: the MCP server",
        body: [
          "The Baroxy MCP server exposes generate_design_dna and get_style_contract as tools. Claude Code can call them while scaffolding a new project, so you can simply ask it to generate a design identity first and then build with it.",
        ],
        code: "claude mcp add baroxy -- npx -y @baroxy/mcp-server",
      },
      {
        heading: "Make it stick",
        body: [
          "Keep tokens.css imported at the root of your app and refer to tokens by name. Review pull requests against the \"forbidden\" list in the contract, which names the specific AI tells to reject.",
        ],
      },
    ],
  },
  {
    slug: "cursor-design-rules",
    title: "Cursor design rules: lock your project's visual identity",
    description:
      "How to turn a Design DNA into Cursor rules so every generated component uses your fonts, colors, radius and motion.",
    published: "2026-11-20",
    sections: [
      {
        heading: "Why rules beat prompts",
        body: [
          "Cursor applies project rules to every request, so visual decisions don't depend on remembering to repeat them in each chat. Put the design decisions there once.",
        ],
      },
      {
        heading: "Generate and paste",
        body: [
          "Generate your Design DNA at baroxy.xyz/generate and download the zip. It includes AGENT_RULES.md, a short block listing your fonts, canvas, brand colors, radius, motion, mandatory signature details and the forbidden list. Paste it into your .cursorrules file or a project rule.",
        ],
        code: "# .cursorrules\n<contents of design-dna/AGENT_RULES.md>",
      },
      {
        heading: "Keep tokens in code",
        body: [
          "Import design-dna/tokens.css and reference the variables instead of raw hex values. If you use Tailwind, merge tailwind.tokens.js into your config so utility classes map to the same tokens.",
        ],
      },
    ],
  },
  {
    slug: "design-tokens-for-tailwind-and-shadcn",
    title: "Design tokens for Tailwind and shadcn/ui from a one-minute brief",
    description:
      "Generate CSS variables, a Tailwind token file, a shadcn/ui theme and Figma tokens from a single project brief.",
    published: "2026-11-20",
    sections: [
      {
        heading: "One brief, four formats",
        body: [
          "Baroxy generates the same identity in every format you are likely to need: tokens.css (CSS variables), tailwind.tokens.js, shadcn-theme.css (HSL variables with a derived dark theme) and figma-tokens.json (W3C-style design tokens for Tokens Studio).",
        ],
      },
      {
        heading: "Using the shadcn/ui theme",
        body: [
          "Paste shadcn-theme.css into your globals.css in place of the default :root and .dark blocks. The designed canvas (light or dark) comes from the preset; the opposite theme is derived from the same tinted neutral scale, so treat it as a strong starting point and adjust it by eye.",
        ],
      },
      {
        heading: "Using the Tailwind tokens",
        body: ["Merge the exported object into theme.extend in your Tailwind config."],
        code: "// tailwind.config.js\nconst tokens = require('./design-dna/tailwind.tokens.js');\nmodule.exports = { theme: { extend: tokens } };",
      },
      {
        heading: "Source and issues",
        body: [`Baroxy is open source at ${REPO}. Bug reports and preset suggestions are welcome.`],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
