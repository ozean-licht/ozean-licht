# Claude Code MCP Integration Guide

## Overview

Claude Code integrates with hundreds of external tools through the Model Context Protocol (MCP), an open standard for AI-tool connections. MCP servers grant Claude access to databases, APIs, and specialized tools.

## Key Capabilities

Users can direct Claude to:
- Implement features from issue trackers with PR creation
- Analyze monitoring and observability data
- Query databases with natural language
- Reference design files for implementation updates
- Automate multi-step workflows

## Installation Methods

Three transport options exist:

### 1. HTTP Servers (Recommended for Cloud Services)

```bash
claude mcp add --transport http <name> <url>
```

### 2. SSE Servers (Server-Sent Events - Deprecated but Supported)

```bash
claude mcp add --transport sse <name> <url>
```

### 3. Stdio Servers (Local Processes)

```bash
claude mcp add --transport stdio <name> -- <command>
```

The double-dash separator distinguishes Claude's flags from server commands.

## Configuration Scopes

- **Local**: Private to current project directory
- **Project**: Shared via `.mcp.json` in version control
- **User**: Available across all projects on the machine

Local scope takes precedence over project scope, which overrides user scope.

## Authentication

OAuth 2.0 support enables secure remote server connections through the `/mcp` command within Claude Code. Tokens are stored securely and refresh automatically.

## Advanced Features

### MCP Resources
Servers can expose resources referenced via "@" mentions, similar to file attachments.

### MCP Prompts
Servers provide prompts accessible as slash commands with normalized naming conventions (e.g., `/mcp__servername__promptname`).

### Enterprise Configuration
Administrators deploy `managed-mcp.json` files to control organizational server access through allowlists or denylists.

### Environment Variable Expansion
Configurations support environment variable expansion for flexible deployment.

### Output Warnings
System provides warnings for large token usage (10,000+ tokens).

### Import from Claude Desktop
Users can import MCP configurations from Claude Desktop.

### Claude Code as MCP Server
Claude Code can be deployed as an MCP server for use in other applications.

## Popular Integrations

Over 40 pre-configured servers are available across multiple categories:

### Project Management
- Asana
- Linear
- Monday
- Notion
- Atlassian
- ClickUp

### Payments & Commerce
- Stripe
- PayPal
- Square
- Plaid

### Infrastructure & DevOps
- Vercel
- Netlify
- Cloudflare
- Stytch

### Design & Media
- Figma
- Canva
- Cloudinary
- invideo

### Development Tools
- Sentry
- Socket
- Hugging Face
- Jam

## Security Features

- OAuth 2.0 authentication support
- Environment variable expansion in configurations
- Enterprise allowlist/denylist controls
- Output warnings for large token usage
- Secure token storage with automatic refresh

## Configuration Management

### Local Configuration
Project-specific MCP servers are stored locally and are private to the user.

### Project Configuration
MCP servers can be shared via `.mcp.json` file in version control for team collaboration.

### User Configuration
MCP servers configured at the user level are available across all projects on the machine.

### Configuration Precedence
1. Local scope (highest priority)
2. Project scope
3. User scope (lowest priority)

## Usage Examples

### Adding an HTTP Server
```bash
claude mcp add --transport http my_server https://example.com/mcp
```

### Adding a Local Stdio Server
```bash
claude mcp add --transport stdio my_tool -- node /path/to/server.js
```

### Using MCP Resources
Reference MCP resources with "@" mentions similar to file attachments.

### Using MCP Prompts
Access MCP prompts through slash commands: `/mcp__servername__promptname`

## Enterprise Deployment

Administrators can control organizational server access by deploying `managed-mcp.json` files that specify:
- Allowlists of permitted MCP servers
- Denylists of prohibited MCP servers
- Server configurations and authentication details

This enables secure and standardized MCP usage across an organization.
