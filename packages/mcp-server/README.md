# @baroxy/mcp-server

An MCP server exposing [Baroxy](https://baroxy.vercel.app)'s Design DNA generator as tools, so any MCP-compatible coding agent can pull a locked design identity mid-session instead of falling back to its defaults.

## Claude Code

```bash
claude mcp add baroxy -- npx @baroxy/mcp-server
```

## Other MCP clients (Cursor, Windsurf, Claude Desktop)

Point your client's MCP config at the stdio command:

```json
{
  "mcpServers": {
    "baroxy": {
      "command": "npx",
      "args": ["@baroxy/mcp-server"]
    }
  }
}
```

## Tools

- **`generate_design_dna`** — takes a brief (name, industry, audience, mood, references) and returns the full style contract, CSS variables, and Tailwind tokens.
- **`get_style_contract`** — same brief, returns just the markdown style contract.

Source: [github.com/tejas249/baroxy](https://github.com/tejas249/baroxy)
