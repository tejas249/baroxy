# @baroxy/cli

Generate a [Baroxy](https://baroxy.vercel.app) Design DNA from your terminal and write it straight into your project.

```bash
npx @baroxy/cli --name Acme --industry fintech --audience "solo founders" --mood trustworthy,modern
```

Run without flags in an interactive terminal and it will prompt you instead. Either way it writes into `./design-dna/` in the current directory:

- `STYLE_CONTRACT.md` — the human/agent-readable rules. Paste a reference to it into your project's `CLAUDE.md` or `AGENTS.md` so every coding-agent session is bound by it.
- `tokens.css` — CSS custom properties.
- `tailwind.tokens.js` — a Tailwind theme extension.
- `design-dna.json` — the raw data.

The same inputs always produce the same output for a given `@baroxy/cli`/`@baroxy/core` version — nothing here is random per run. If you need a brief to keep producing the exact result you built against, pin that version instead of relying on `npx` fetching latest; see [`@baroxy/core`'s CHANGELOG](https://github.com/tejas249/baroxy/blob/main/packages/core/CHANGELOG.md) for the determinism policy. Every run also writes the core version into `design-dna.json` and the top of `STYLE_CONTRACT.md`.

Source: [github.com/tejas249/baroxy](https://github.com/tejas249/baroxy)
