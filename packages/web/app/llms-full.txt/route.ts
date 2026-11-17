import { SITE_URL, DESCRIPTION, FAQS, STEPS, REPO_URL } from "../../lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# Baroxy: full reference

${DESCRIPTION}

Site: ${SITE_URL}
Source: ${REPO_URL}

## What it outputs
- STYLE_CONTRACT.md: a Markdown style contract an AI agent must follow
- tokens.css: CSS custom properties for type, color, spacing, radius and motion
- tailwind.tokens.js: the same tokens for Tailwind
- design-dna.json: the raw machine-readable result

## How it works
${STEPS.map((s, i) => `${i + 1}. ${s.name}: ${s.text}`).join("\n")}

## Frequently asked questions
${FAQS.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Ways to use it
- Web: ${SITE_URL}/generate
- CLI: npx @baroxy/cli (writes ./design-dna/)
- MCP server: @baroxy/mcp-server, tools generate_design_dna and get_style_contract (Claude Code, Cursor, Windsurf, Claude Desktop)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
