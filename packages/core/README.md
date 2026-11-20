# @baroxy/core

Deterministic design-identity generation engine for [Baroxy](https://baroxy.xyz).

Pure, dependency-free TypeScript: give it a `DesignBrief` (name, industry, audience, mood, references) and it returns a `DesignDNA` — a locked typography pairing, a color system built from real color-theory harmonies, a spacing/radius scale, a motion personality, mandatory signature UI details, and a fixed list of "AI tells" to avoid. The same brief always produces the same DNA *for a given package version* — see [CHANGELOG.md](./CHANGELOG.md) for the determinism policy before pinning a version in production.

Most people won't use this package directly — see [`@baroxy/cli`](https://www.npmjs.com/package/@baroxy/cli) or [`@baroxy/mcp-server`](https://www.npmjs.com/package/@baroxy/mcp-server), or the [web generator](https://baroxy.xyz/generate).

```ts
import { generateDesignDNA, toStyleContractMarkdown } from "@baroxy/core";

const dna = generateDesignDNA({
  name: "Acme",
  industry: "fintech",
  audience: "solo founders",
  mood: ["trustworthy", "modern"],
});

console.log(toStyleContractMarkdown(dna));
```

Source: [github.com/tejas249/baroxy](https://github.com/tejas249/baroxy)
