# Claude Code MCP Documentation Summary

## Overview
Claude Code integrates with the Model Context Protocol (MCP), an open-source standard enabling connections to hundreds of external tools and data sources. This allows Claude to access databases, APIs, and specialized services.

## Capabilities
MCP-connected Claude Code can handle diverse tasks:
- "Implement features from issue trackers like JIRA and create pull requests"
- "Analyze monitoring data from services like Sentry"
- "Query databases such as Postgres for specific information"
- "Integrate design updates from Figma"
- "Automate workflows including email drafts"

## Installation Methods

**Three transport options exist:**

1. **HTTP Servers** (recommended for remote services)
   - Syntax: `claude mcp add --transport http <name> <url>`
   - Supports authentication headers

2. **SSE Servers** (deprecated)
   - Legacy Server-Sent Events transport
   - Replaced by HTTP where possible

3. **Stdio Servers** (local processes)
   - Direct system access for custom scripts
   - Uses `--` separator between Claude flags and server commands
   - Windows requires `cmd /c` wrapper for npx commands

## Configuration Scopes

Three scope levels control server accessibility:

- **Local**: Personal, project-specific configurations (default)
- **Project**: Team-shared via `.mcp.json` file in version control
- **User**: Cross-project access on individual machine

Precedence hierarchy: local > project > user

## Key Features

**Environment Variable Expansion** in `.mcp.json`:
- `${VAR}` syntax supported
- Allows machine-specific customization
- Works in commands, arguments, URLs, and headers

**Authentication**: OAuth 2.0 support via `/mcp` command within Claude Code

**Resources**: Reference MCP-provided resources using `@server:protocol://resource/path` syntax

**Prompts**: MCP servers expose slash commands accessible as `/mcp__servername__promptname`

## Management Commands

```
claude mcp list          # View all servers
claude mcp get <name>    # Details for specific server
claude mcp remove <name> # Delete server
/mcp                     # Check status within Claude Code
```

## Output Management

- Warning threshold: 10,000 tokens
- Default maximum: 25,000 tokens
- Adjustable via `MAX_MCP_OUTPUT_TOKENS` environment variable

## Enterprise Features

Administrators can deploy centralized MCP configurations at system-level paths with allowlists and denylists to control server access across organizations.
