#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { parseArgs } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  generateDesignDNA,
  toStyleContractMarkdown,
  toCSSVariables,
  toTailwindTokens,
  type DesignBrief,
} from "@baroxy/core";

function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function promptForMissing(flags: Partial<Record<"name" | "industry" | "audience" | "mood" | "references", string>>) {
  const rl = createInterface({ input: stdin, output: stdout });
  const ask = async (question: string, fallback = "") => {
    const answer = (await rl.question(`${question} `)).trim();
    return answer || fallback;
  };

  console.log("\nBaroxy — generate a Design DNA for your project\n");

  const name = flags.name ?? (await ask("Project name:"));
  const industry = flags.industry ?? (await ask("Industry / category:"));
  const audience = flags.audience ?? (await ask("Target audience:"));
  const mood = flags.mood ?? (await ask("Mood (comma-separated, e.g. energetic, bold):", "modern"));
  const references = flags.references ?? (await ask("Reference brands/sites (comma-separated, optional):"));

  rl.close();
  return { name, industry, audience, mood, references };
}

async function main() {
  const { values } = parseArgs({
    options: {
      name: { type: "string" },
      industry: { type: "string" },
      audience: { type: "string" },
      mood: { type: "string" },
      references: { type: "string" },
      out: { type: "string" },
    },
    strict: false,
  });

  const hasAllRequired = values.name && values.industry && values.audience;
  // Only drop into interactive prompts when we're missing required fields AND
  // actually attached to a real terminal — piping input non-interactively into
  // sequential readline.question() calls is unreliable on non-TTY stdin, so we
  // never rely on it for scripted/non-TTY invocations.
  const resolved = !hasAllRequired && stdin.isTTY
    ? await promptForMissing(values as Record<string, string>)
    : {
        name: (values.name as string) ?? "Untitled Project",
        industry: (values.industry as string) ?? "general",
        audience: (values.audience as string) ?? "general users",
        mood: (values.mood as string) ?? "modern",
        references: (values.references as string) ?? "",
      };

  const brief: DesignBrief = {
    name: resolved.name,
    industry: resolved.industry,
    audience: resolved.audience,
    mood: splitList(resolved.mood),
    references: splitList(resolved.references),
  };

  const dna = generateDesignDNA(brief);

  const outDir = path.join(process.cwd(), (values.out as string) || "design-dna");
  await mkdir(outDir, { recursive: true });

  await writeFile(path.join(outDir, "STYLE_CONTRACT.md"), toStyleContractMarkdown(dna), "utf8");
  await writeFile(path.join(outDir, "tokens.css"), toCSSVariables(dna), "utf8");
  await writeFile(path.join(outDir, "tailwind.tokens.js"), toTailwindTokens(dna), "utf8");
  await writeFile(path.join(outDir, "design-dna.json"), JSON.stringify(dna, null, 2), "utf8");

  console.log(`\nDesign DNA generated in ${path.relative(process.cwd(), outDir) || "."}/`);
  console.log(`  - STYLE_CONTRACT.md   (paste a reference to this into your CLAUDE.md / AGENTS.md)`);
  console.log(`  - tokens.css          (CSS variables)`);
  console.log(`  - tailwind.tokens.js  (merge into tailwind.config.js)`);
  console.log(`  - design-dna.json     (raw data, seed ${dna.seed})\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
