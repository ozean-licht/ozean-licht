# Claude Code MCP Integration Guide

Claude Code connects to external tools through the **Model Context Protocol (MCP)**, an open standard for AI-tool integration. This enables access to hundreds of services and databases.

## Key Capabilities

With MCP servers, Claude Code can:
- Implement features from issue trackers like JIRA and GitHub
- Analyze monitoring data from services such as Sentry
- Query databases including PostgreSQL
- Integrate design tools like Figma
- Automate workflows via Gmail and other services

## Installation Methods

Three transport options are available:

**HTTP Servers** (recommended for remote services):
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

**SSE Servers** (deprecated but still functional):
```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

**Stdio Servers** (local processes):
```bash
claude mcp add --transport stdio airtable -- npx -y airtable-mcp-server
```

## Configuration Scopes

MCP servers operate at three levels:
- **Local**: Personal, project-specific (default)
- **Project**: Team-shared via `.mcp.json` file
- **User**: Available across all projects

## Management Commands

```bash
claude mcp list          # View all servers
claude mcp get github    # Details for specific server
claude mcp remove github # Delete a server
/mcp                     # Check status within Claude Code
```

## Authentication

OAuth 2.0 support enables secure connections. Use `/mcp` command within Claude Code to authenticate with services like Sentry or GitHub.

## Enterprise Features

Organizations can deploy centralized MCP configurations through `managed-mcp.json` and control server access via allowlists/denylists in `managed-settings.json`.

## Advanced Features

- **MCP Resources**: Reference data via `@server:protocol://path` syntax
- **MCP Prompts**: Access server-provided commands as slash commands
- **Output Limits**: Configure `MAX_MCP_OUTPUT_TOKENS` for large datasets
