# Connect Claude Code to Tools via MCP

Claude Code integrates with external tools and services through the Model Context Protocol (MCP), an open-source standard for AI-tool integrations. This enables Claude to access databases, APIs, and various business tools directly.

## Key Capabilities

With MCP servers connected, you can ask Claude Code to:

- **Implement features from issue trackers**: Reference and work with tickets from systems like JIRA
- **Analyze monitoring data**: Query error tracking and analytics platforms
- **Query databases**: Execute searches across your data infrastructure
- **Integrate designs**: Pull in design context from platforms like Figma
- **Automate workflows**: Create automated tasks across multiple services

## Installation Methods

Claude Code supports three transport options for MCP servers:

**1. Remote HTTP Servers** (Recommended)
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

**2. Remote SSE Servers** (Deprecated)
```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

**3. Local Stdio Servers**
```bash
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY -- npx -y airtable-mcp-server
```

## Configuration Scopes

MCP servers can be configured at three levels:

- **Local**: Project-specific, private to you
- **Project**: Team-shared via `.mcp.json` in version control
- **User**: Available across all projects on your machine

## Popular Integrations

Available MCP servers include Stripe, GitHub, Notion, Asana, Linear, HubSpot, Sentry, and many others across categories like payments, project management, databases, and DevOps tools.

## Security Considerations

"Use third party MCP servers at your own risk - Anthropic has not verified the correctness or security of all these servers." Trust the servers you install and be cautious with those handling untrusted content due to prompt injection risks.
