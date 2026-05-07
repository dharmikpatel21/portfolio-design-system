# Portfolio Design System — AI Enablement Requirements

## Vision
To make the `portfolio-design-system` the fastest way for anyone to build a portfolio. By providing a dedicated MCP server to AI agents, we enable the AI to become an expert "Architect" that can write, suggest, and refine UI code using our components with 100% accuracy.

## The Goal
A developer installs your design system and adds your MCP to their IDE. The AI now knows exactly how to use every component.
- **User says:** "Build a hero section with a primary button and my avatar."
- **AI does:** Writes the perfect `<ds-hero>`, `<ds-avatar>`, and `<ds-button>` code instantly because it has the MCP "Manual" in its head.

---

## Requirements for Standalone IDE Integration

### 1. Standalone MCP Server (Headless)
Build a Node.js-based MCP server that serves the design system's API metadata *statically*.
- **No Browser Required:** Unlike the current WebMCP bridge, this should run directly in the IDE (Cursor, VS Code, Antigravity).
- **Static Documentation:** The server provides a tool like `get_component_api` which returns the JSON spec of all components (properties, slots, events).

### 2. Auto-Sync from Source
The MCP metadata should be generated directly from your existing component files.
- We should reuse the `registerMCPTool` objects already in your `.ts` files to generate a `docs.json`.
- This ensures the AI never uses outdated component names or properties.

### 3. Portfolio "Recipes" & Snippets
Provide a tool that suggests "Compositions" rather than just single components.
- **Tool:** `get_portfolio_templates`
- **Output:** Complete code blocks for:
    - Hero sections with specific layout patterns.
    - Project grids using `<ds-card>`.
    - Contact forms using `<ds-input>` and `<ds-button>`.

### 4. Zero-Setup Distribution
Make the MCP server accessible via `npx` so other developers can add it to their IDE in seconds.
- `npx @your-org/portfolio-mcp`

---

## Why this makes development faster
1. **No Guessing:** The AI doesn't have to guess attribute names (like `badge-text` vs `badgeText`).
2. **Instant UI:** The AI can generate a whole page skeleton using your 15+ components in one shot.
3. **Universality:** It will work whether the user is developing in pure HTML, Angular, or React, as long as they are using your design system.
