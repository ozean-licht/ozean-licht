# Claude Agent SDK Overview

The Claude Agent SDK is Anthropic's official toolkit for building custom AI agents. It was previously called the Claude Code SDK and is built on the agent harness powering Claude Code.

## Installation

### TypeScript
```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Python
```bash
pip install claude-agent-sdk
```

## Key Features

### Context Management
The SDK automatically handles context compaction and management to prevent agents from exhausting available context windows during extended operations.

### Rich Tool Ecosystem
Agents gain access to:
- File operations (read, write, edit)
- Code execution capabilities
- Web search functionality
- Extensibility through Model Context Protocol (MCP)

### Advanced Permissions
Fine-grained control enables developers to specify which tools agents can access using:
- `allowedTools` - Explicit tool allowlisting
- `disallowedTools` - Tool blocklisting
- `permissionMode` - Overall permission strategy configuration

### Production Essentials
Built-in error handling, session management, and monitoring provide foundational production-readiness.

## Available SDK Options

- **TypeScript SDK** — For Node.js and web applications
- **Python SDK** — For Python and data science use cases
- **Streaming vs Single Mode** — Choose between input processing approaches

## Core Concepts

### Authentication

Retrieve an API key from the Claude Console and set `ANTHROPIC_API_KEY` environment variable.

Third-party provider support includes:
- **Amazon Bedrock**: Set `CLAUDE_CODE_USE_BEDROCK=1` with AWS credentials
- **Google Vertex AI**: Set `CLAUDE_CODE_USE_VERTEX=1` with Google Cloud credentials

### Claude Code Feature Support

The SDK accesses all Claude Code features including:
- Subagents stored in `./.claude/agents/`
- Agent Skills in `./.claude/skills/`
- Custom hooks via `./.claude/settings.json`
- Slash commands as Markdown files
- Memory management through `CLAUDE.md` files

### System Prompts

Define agent roles, expertise, and behavioral guidelines through system prompt configuration.

### Model Context Protocol

Extend agents with custom tools and integrations by connecting to databases, APIs, and external services via MCP servers.

## Use Cases

### Coding Agents
- SRE incident diagnosis and resolution
- Security code audits
- Oncall incident triage
- Code review enforcement

### Business Agents
- Legal contract review
- Financial analysis
- Customer support automation
- Marketing content creation

## Branding Guidelines

When integrating the SDK, use:
- **"Claude Agent"** (preferred for dropdowns)
- **"Claude"** (in agent-specific menus)
- **"{AgentName} Powered by Claude"**

Avoid using "Claude Code" or Claude Code visual elements for custom products.

## Resources

- **Bug Reporting**: TypeScript and Python SDKs have dedicated GitHub issue trackers
- **Changelogs**: View SDK updates on respective GitHub repositories
- **Additional Docs**: CLI reference, GitHub Actions integration, and troubleshooting guides available
