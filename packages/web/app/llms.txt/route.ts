import { SITE_URL, DESCRIPTION, REPO_URL } from "../../lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# Baroxy

> ${DESCRIPTION}

Baroxy is a free tool (web app, CLI and MCP server) that stops AI-coded apps from all looking the same. Given a brief (name, industry, audience, mood, references) it deterministically generates a "Design DNA": a typography pairing, color harmony, spacing and radius scale, motion system, mandatory signature UI details and a list of banned AI design patterns. The same brief always yields the same output.

## Key pages
- [Home](${SITE_URL}/): what Baroxy is, the AI tells it bans, how it works, FAQ
- [Generate Design DNA](${SITE_URL}/generate): the free web generator, no sign-up
- [Showcase](${SITE_URL}/showcase): publicly shared Design DNAs
- [Full details for LLMs](${SITE_URL}/llms-full.txt)

## Developers
- [GitHub](${REPO_URL})
- [@baroxy/cli on npm](https://www.npmjs.com/package/@baroxy/cli): \`npx @baroxy/cli\`
- [@baroxy/mcp-server on npm](https://www.npmjs.com/package/@baroxy/mcp-server): exposes generate_design_dna and get_style_contract to MCP-compatible agents
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
