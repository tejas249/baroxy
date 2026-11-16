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

The same inputs always produce the same output — nothing here is random per run.

Source: [github.com/tejas249/baroxy](https://github.com/tejas249/baroxy)
