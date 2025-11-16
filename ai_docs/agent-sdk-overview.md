# Claude Agent SDK Documentation

## Overview

The Claude Agent SDK enables developers to build custom AI agents with production-ready features. The SDK was formerly called Claude Code SDK and has been renamed to reflect its broader agent-building capabilities.

## Installation

For TypeScript/Node.js environments, install via npm:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Available SDK Options

- **TypeScript SDK** - For Node.js and web applications
- **Python SDK** - For Python applications and data science
- **Streaming vs Single Mode** - Different input modes with corresponding best practices

## Key Features & Capabilities

### Context Management
The SDK automatically compacts and manages context to prevent agents from exhausting token limits.

### Tool Ecosystem
Includes file operations, code execution, web search capabilities, and extensibility through MCP (Model Context Protocol).

### Permissions
Provides fine-grained control via `allowedTools`, `disallowedTools`, and `permissionMode` settings.

### Production Features
Built-in error handling, session management, and monitoring capabilities.

### Claude Code Integration
Leverages the same harness powering Claude Code, including automatic prompt caching and performance optimizations.

## Core Concepts

### Authentication
Retrieve an API key from the Claude Console and set the `ANTHROPIC_API_KEY` environment variable. Third-party support includes Amazon Bedrock and Google Vertex AI.

### Full Feature Support
Agents access subagents, Agent Skills, hooks, slash commands, plugins, and memory through `.claude/` directory configuration matching Claude Code's structure.

### System Prompts
Define agent roles, expertise, and behavior patterns.

### Model Context Protocol
Connect to external databases, APIs, and services through custom MCP servers.

## Example Agent Types

Developers can create:
- **Coding agents** - SRE troubleshooting, security audits, incident triage
- **Business agents** - Legal review, financial analysis, customer support
- **Content creation assistants**

## Branding Guidelines

For products integrating the SDK, use:
- "Claude Agent"
- "Claude"
- "{AgentName} Powered by Claude"

Avoid "Claude Code" terminology.

## Support & Resources

- Report bugs on GitHub (separate repos for TypeScript and Python SDKs)
- Access changelogs via official repository CHANGELOG.md files
- Review CLI reference, GitHub Actions integration, and MCP documentation for additional guidance

---

**Source:** https://docs.claude.com/en/docs/agent-sdk/overview
