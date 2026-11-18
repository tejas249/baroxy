#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateDesignDNA, toStyleContractMarkdown, toCSSVariables, toTailwindTokens } from "@baroxy/core";

const server = new McpServer({ name: "baroxy", version: "0.2.0" });

const briefSchema = {
  name: z.string().describe("Project name"),
  industry: z.string().describe("Industry or category, e.g. 'fintech', 'dev tools', 'skincare'"),
  audience: z.string().describe("Target audience, e.g. 'solo founders', 'enterprise IT teams'"),
  mood: z.array(z.string()).describe("Mood keywords, e.g. ['bold', 'energetic'] or ['calm', 'luxury']"),
  references: z.array(z.string()).optional().describe("Reference brands or sites, optional"),
};

server.registerTool(
  "generate_design_dna",
  {
    title: "Generate Design DNA",
    description:
      "Generates a unique, deterministic design identity (typography, color system, spacing, motion, " +
      "signature UI details, and a list of forbidden 'AI tell' patterns) for a project brief. " +
      "Call this once at the start of a new project and follow the returned style contract exactly " +
      "instead of defaulting to generic shadcn/Tailwind styling. The same brief always returns the same DNA.",
    inputSchema: briefSchema,
  },
  async (brief) => {
    const dna = generateDesignDNA({ ...brief, references: brief.references ?? [] });
    return {
      content: [
        { type: "text", text: toStyleContractMarkdown(dna) },
        { type: "text", text: "```css\n" + toCSSVariables(dna) + "```" },
        { type: "text", text: "```js\n" + toTailwindTokens(dna) + "```" },
      ],
    };
  }
);

server.registerTool(
  "get_style_contract",
  {
    title: "Get Style Contract (markdown only)",
    description:
      "Same generation as generate_design_dna, but returns only the markdown style contract — " +
      "meant to be pasted directly into CLAUDE.md or AGENTS.md so every future agent session inherits it.",
    inputSchema: briefSchema,
  },
  async (brief) => {
    const dna = generateDesignDNA({ ...brief, references: brief.references ?? [] });
    return { content: [{ type: "text", text: toStyleContractMarkdown(dna) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
