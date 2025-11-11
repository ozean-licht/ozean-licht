# Claude Code MCP Documentation Summary

## Overview

Claude Code connects to external tools through the **Model Context Protocol (MCP)**, an open-source standard for AI-tool integrations. This enables access to databases, APIs, and services directly within your workflow.

## Key Capabilities

With MCP servers connected, you can:

- **Automate issue implementation**: "Add the feature from JIRA ticket ENG-4521 and create a pull request"
- **Monitor production systems**: "Check error logs and usage metrics for specific features"
- **Query databases naturally**: "Identify users matching specific criteria from our database"
- **Integrate design tools**: "Update email templates based on latest Figma designs"
- **Workflow automation**: "Generate and send invitation drafts to selected users"

## Installation Methods

Claude Code supports three transport options:

**HTTP Servers** (Recommended for remote services):
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

**SSE Servers** (Deprecated but functional):
```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

**Stdio Servers** (Local processes):
```bash
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY -- npx -y airtable-mcp-server
```

## Management Commands

```bash
claude mcp list          # View all configured servers
claude mcp get [name]    # Get server details
claude mcp remove [name] # Delete a server
/mcp                     # Check status within Claude Code
```

## Configuration Scopes

- **Local**: Private to current project (default)
- **Project**: Shared via `.mcp.json` checked into version control
- **User**: Available across all projects on your machine

## Security Considerations

Users assume responsibility when installing third-party MCP servers. Exercise caution with servers fetching untrusted content due to prompt injection risks. Project-scoped servers from `.mcp.json` require explicit approval before use.

## Popular Integrations

Supported MCP servers span multiple categories: project management (Asana, Linear, Monday), payments (Stripe, PayPal), infrastructure (Vercel, Netlify), and databases (HubSpot, PostgreSQL).

## Advanced Features

- **OAuth 2.0 authentication** via `/mcp` command
- **Environment variable expansion** in `.mcp.json`
- **Resource references** using @ mentions
- **MCP prompts as slash commands**
- **Enterprise configuration** for organizational control
- **Claude Code as MCP server** for bidirectional integration
