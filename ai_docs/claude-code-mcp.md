# Claude Code MCP Documentation Summary

## Overview
Claude Code connects to external tools through the Model Context Protocol (MCP), an open standard enabling AI-tool integrations. MCP servers provide access to databases, APIs, and various services.

## Key Capabilities
With MCP servers, Claude Code enables:
- Implementation of features from issue trackers
- Monitoring data analysis
- Database queries
- Design integration workflows
- Workflow automation

## Installation Methods

**Three transport options exist:**

1. **HTTP Servers** (Recommended for remote services)
   - Command syntax: `claude mcp add --transport http <name> <url>`
   - Supports optional Bearer token authentication

2. **SSE Servers** (Deprecated)
   - Format: `claude mcp add --transport sse <name> <url>`
   - Alternative for services without HTTP support

3. **Stdio Servers** (Local processes)
   - Syntax: `claude mcp add --transport stdio <name> -- <command>`
   - Uses `--` separator to distinguish Claude flags from server commands
   - Requires `cmd /c` wrapper on Windows for `npx` commands

## Configuration Scopes

**Three scope levels manage accessibility:**

- **Local**: Project-specific, private to individual users (default)
- **Project**: Team-shared via `.mcp.json` in version control
- **User**: Cross-project accessibility for personal utilities

Precedence hierarchy: local > project > user

## Server Management Commands

```
claude mcp list          # View all configured servers
claude mcp get <name>    # Details for specific server
claude mcp remove <name> # Delete server configuration
/mcp                     # Check status within Claude Code
```

## Authentication
OAuth 2.0 authentication uses the `/mcp` command within Claude Code. Tokens store securely and refresh automatically.

## Popular Integrations
The documentation lists 40+ servers across categories including project management (Asana, Linear, Monday), payments (Stripe, PayPal, Square), design (Figma, Canva), and infrastructure (Vercel, Netlify).

## Advanced Features

**Environment Variable Expansion**: `.mcp.json` supports `${VAR}` and `${VAR:-default}` syntax for flexible team configurations.

**MCP Resources**: Reference server resources via `@server:protocol://path` mentions, similar to file references.

**MCP Prompts**: Servers expose slash commands following `/mcp__servername__promptname` format.

**Output Management**: Default 25,000-token limit for MCP tool outputs; configure via `MAX_MCP_OUTPUT_TOKENS` environment variable.

## Enterprise Management
Administrators deploy `managed-mcp.json` to provide standardized server access while using allowlists/denylists in `managed-settings.json` to restrict user configurations.