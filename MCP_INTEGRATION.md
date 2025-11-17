# MCP Integration Guide

## Overview

This project uses the Model Context Protocol (MCP) to integrate external tools and services with Claude Code.

## Configured MCP Servers

### Context7
- **Type:** HTTP Server
- **URL:** `https://mcp.context7.com/mcp`
- **Purpose:** Version-specific library documentation
- **Status:** ✅ Active

**Available Tools:**
1. `resolve-library-id` - Convert library name to Context7-compatible ID
2. `get-library-docs` - Fetch version-specific documentation for libraries
3. `health` - Check Context7 service health

## Usage Examples

### Example 1: Query Storybook Documentation

```
Use the Context7 MCP to get Storybook v9.0.15 documentation on addons
```

Claude Code will:
1. Call `resolve-library-id` with "storybook"
2. Get library ID: `/storybookjs/storybook/v9.0.15`
3. Call `get-library-docs` with the library ID and topic "addons"
4. Return comprehensive, up-to-date documentation

### Example 2: Get React Hooks Documentation

```
Use Context7 to fetch React v18 hooks documentation
```

### Example 3: Query Multiple Libraries

```
Use Context7 to compare authentication implementations in Next.js vs React
```

## Configuration

### Project-Level (.mcp.json)
Located at project root. Shared with team via git.

```json
{
  "mcpServers": {
    "context7": {
      "transport": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

### User-Level
Add to `~/.claude/mcp.json` for personal MCP servers.

### Local-Level
Override project config with local `.mcp.json` (not committed to git).

## MCP Commands

```bash
# List all configured MCP servers
/mcp status

# View available tools from Context7
/mcp tools context7

# Authenticate if needed
/mcp auth context7
```

## Supported Libraries

Context7 supports 1000+ libraries including:
- **Frontend:** React, Vue, Angular, Svelte, Storybook
- **Backend:** Next.js, Express, FastAPI, Django
- **Testing:** Jest, Playwright, Cypress
- **Build:** Vite, Webpack, esbuild
- **And many more...**

Check supported libraries at: https://context7.com/libraries

## Benefits

### 1. Always Up-to-Date
Context7 provides real-time documentation directly from GitHub repositories.

### 2. Version-Specific
Get docs for the exact version you're using (e.g., React 18 vs React 19).

### 3. Topic-Focused
Query specific topics instead of browsing entire documentation.

### 4. AI-Optimized
Documentation is formatted for optimal AI consumption.

## Troubleshooting

### MCP Server Not Found
**Issue:** Context7 not appearing in `/mcp status`

**Solutions:**
1. Restart Claude Code to reload `.mcp.json`
2. Check `.mcp.json` syntax is valid JSON
3. Verify URL is correct: `https://mcp.context7.com/mcp`

### Connection Timeout
**Issue:** Requests to Context7 timing out

**Solutions:**
1. Check internet connection
2. Verify Context7 service is up: https://mcp.context7.com/mcp
3. Try again (Context7 has rate limits for free tier)

### Empty Results
**Issue:** Context7 returns no documentation

**Solutions:**
1. Verify library is supported at https://context7.com/libraries
2. Try different topic keywords
3. Use broader queries (e.g., "configuration" instead of specific config key)

## Rate Limits

**Free Tier:**
- ~30 requests per minute
- No API key required
- Public access

**With API Key:**
- Higher rate limits available
- Contact Context7 for API access

## MCP Gateway Integration

This project also runs a local MCP Gateway at `http://localhost:8100` that provides:
- PostgreSQL access
- Mem0 institutional memory
- GitHub operations
- Coolify deployments
- And more...

See `tools/mcp-gateway/README.md` for MCP Gateway documentation.

## Architecture

```
Claude Code → .mcp.json → Context7 HTTP Server
                             ↓
                    https://mcp.context7.com/mcp
                             ↓
                    Library Documentation (GitHub)
                             ↓
                    Formatted Response → Claude Code
```

## Related Documentation

- [Claude Code MCP Docs](./ai_docs/claude-code-mcp.md)
- [MCP Gateway](./tools/mcp-gateway/README.md)
- [Context7 Usage Guide](./tools/mcp-gateway/docs/context7-usage.md)

## Support

- **MCP Specification:** https://spec.modelcontextprotocol.io/
- **Claude Code Docs:** https://docs.claude.com/claude-code
- **Context7:** https://context7.com

---

**Last Updated:** 2025-11-17
**Status:** ✅ Operational
