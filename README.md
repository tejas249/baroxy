# Baroxy

AI coding agents (Claude, Cursor, v0, Lovable, Bolt...) default to the same look when nothing tells them otherwise: Inter, an indigo-to-violet gradient hero, rounded-xl shadcn cards, the same three-card feature grid. Baroxy breaks that default.

Give it a short brief — industry, audience, mood, a couple of reference brands — and it deterministically generates a **Design DNA**: a locked typography pairing, a color system built from real color-theory harmonies, a spacing/radius scale, a motion personality, a handful of mandatory signature UI details, and an explicit list of "AI tells" to avoid. The same brief always produces the same DNA, so it's reproducible across a team.

## Packages

- **[`@baroxy/core`](packages/core)** — the actual generation engine (fonts, color harmonies, spacing, motion, signature details, anti-patterns). Pure, deterministic, no I/O. [npm](https://www.npmjs.com/package/@baroxy/core)
- **[`@baroxy/cli`](packages/cli)** — `npx @baroxy/cli` prompts for a brief and writes the generated contract into `./design-dna/` in the current project. [npm](https://www.npmjs.com/package/@baroxy/cli)
- **[`@baroxy/mcp-server`](packages/mcp-server)** — an MCP server exposing `generate_design_dna` and `get_style_contract` as tools, so any MCP-compatible coding agent (Claude Code, Cursor, Windsurf, Claude Desktop) can call it directly while scaffolding a new project. [npm](https://www.npmjs.com/package/@baroxy/mcp-server)
- **[`packages/web`](packages/web)** — the marketing site and web generator at [baroxy.vercel.app](https://baroxy.vercel.app), live via Vercel.

## Development

```bash
npm install
npm run build
```

### Try the CLI

```bash
node packages/cli/dist/index.js
```

Answer the prompts; it writes `design-dna/STYLE_CONTRACT.md`, `tokens.css`, `tailwind.tokens.js`, and `design-dna.json` into the current directory. Paste a reference to `STYLE_CONTRACT.md` into your project's `CLAUDE.md`/`AGENTS.md` so every agent session is bound by it.

### Run the MCP server

```bash
node packages/mcp-server/dist/index.js
```

Point an MCP-compatible client at this command (stdio transport) to call `generate_design_dna` / `get_style_contract` directly from inside a coding agent session.

## Status

Published and live:

- `@baroxy/core`, `@baroxy/cli`, and `@baroxy/mcp-server` are published to npm under the `@baroxy` scope.
- The marketing site and web generator are live at [baroxy.vercel.app](https://baroxy.vercel.app).

Not yet built: tests, CI, persistence/shareable links for web-generated Design DNA, a showcase gallery, and rate limiting on `/api/generate`.
