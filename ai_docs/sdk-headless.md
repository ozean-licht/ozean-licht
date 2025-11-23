# Claude Code SDK - Headless Mode

## Overview

The Claude Agent SDK enables developers to build production-ready AI agents with comprehensive tooling and management capabilities. This SDK documentation has been consolidated into the Agent SDK documentation, accessed at `https://platform.claude.com/docs/en/agent-sdk/typescript`.

## Installation

The SDK is installed via npm:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Primary Functions

### `query()`

The main function for interacting with Claude Code that "creates an async generator that streams messages as they arrive." It accepts either a string prompt or async iterable for streaming mode, with optional configuration.

**Usage:**
- Accept string prompts for simple queries
- Use async iterable for streaming mode
- Configure with optional parameters for advanced use cases

### `tool()`

Creates type-safe MCP tool definitions using Zod schemas for input validation and async handlers.

**Features:**
- Type safety with TypeScript
- Zod schema validation
- Async handler support

### `createSdkMcpServer()`

Establishes an in-process MCP server instance with configurable tools and metadata.

**Capabilities:**
- In-process MCP server creation
- Tool configuration
- Metadata management

## Key Configuration Options

The `Options` interface provides extensive customization:

### Model Selection
- Specify Claude model or fallback alternative
- Choose from available Claude models

### Tool Control
- Allow/disallow specific tools
- Define custom permission rules
- Control access to capabilities

### Permission Modes
- **default** - Standard permission model
- **acceptEdits** - Allow automatic edits
- **bypassPermissions** - Full access mode
- **plan** - Planning mode

### MCP Servers
- Configure stdio-based servers
- SSE (Server-Sent Events) connections
- HTTP-based servers
- SDK-based in-process servers

### System Prompts
- Use presets for common scenarios
- Define custom instructions for specialized use cases

### Structured Outputs
- Define JSON schema for agent results
- Ensure predictable response formats

### Session Management
- Resume previous conversations
- Fork sessions for branching interactions
- Maintain conversation state

## Message Types

The SDK returns an `SDKMessage` union supporting:

- **Assistant responses** - Responses from Claude with tool use tracking
- **User input** - User messages in conversation
- **Replayed messages** - Messages from previous conversations
- **Result summaries** - Summary data with costs and usage metrics
- **System initialization** - System setup data
- **Streaming partial messages** - Incremental message updates
- **Conversation compaction** - Conversation management boundaries

## Tool Ecosystem

The SDK includes built-in tools for:

- **Task delegation** - Delegate work to other agents or processes
- **Bash execution** - Run shell commands
- **File operations** - Read, Write, and Edit files
- **Search utilities** - Glob and Grep search capabilities
- **Jupyter notebooks** - Edit and execute notebook cells
- **Web utilities** - Fetch and process web content
- **Todo tracking** - Manage tasks and todos
- **MCP resources** - Access MCP-provided resources

## Advanced Features

### Hooks

Event callbacks for:
- **PreToolUse** - Before tool execution
- **PostToolUse** - After tool execution
- **Notifications** - Alert and notification events
- **Session lifecycle** - Session start, pause, resume, and end events

### Permission Framework

Custom `CanUseTool` functions for granular access control:
- Implement custom authorization logic
- Define role-based permissions
- Control tool access dynamically

### Settings Sources

Load configuration from multiple sources:
- User-level settings
- Project settings
- Local filesystem configuration
- Environment variables

### Subagents

Define specialized agents programmatically with:
- Scoped tool access
- Custom configurations
- Independent operation
- Task specialization

## Core Capabilities

### Context Management

"Automatic compaction and context management to ensure your agent doesn't run out of context."

- Efficient token usage
- Automatic context optimization
- Memory management

### Production Features

Built-in production-ready capabilities:
- Error handling
- Session management
- Monitoring capabilities
- Automatic prompt caching optimizations

## Authentication Options

Supports authentication via:
- Claude API keys through `ANTHROPIC_API_KEY` environment variable
- Amazon Bedrock provider integration
- Google Vertex AI provider integration
- Third-party provider support through environment variables

## Use Case Examples

The SDK is designed for applications across multiple domains:

### Coding & Development
- SRE (Site Reliability Engineering) automation
- Security audits and compliance checks
- Code review and analysis
- Bug detection and fixing

### Business Applications
- Legal document review
- Financial analysis
- Customer support automation
- Data processing and analysis

## SDK Variants

The Claude Agent SDK is available in multiple languages:

### TypeScript SDK
- For Node.js applications
- For web applications
- Available on npm: `@anthropic-ai/claude-agent-sdk`
- Dedicated GitHub repository with CHANGELOG

### Python SDK
- For Python applications
- For data science workflows
- Available on PyPI: `claude-agent-sdk`
- Dedicated GitHub repository with CHANGELOG

### Streaming vs. Single-Mode

Choose between:
- **Streaming mode** - Real-time message streaming using async iterables
- **Single-mode** - One-shot queries with string prompts

## Additional Resources

- TypeScript SDK GitHub repository with dedicated CHANGELOG for tracking updates
- Python SDK GitHub repository with dedicated CHANGELOG for tracking updates
- Agent SDK overview documentation
- API reference documentation

---

**Note:** The original URL path `/en/docs/claude-code/sdk/sdk-headless` has been redirected to the consolidated Agent SDK documentation at `/en/agent-sdk/typescript`. The "headless" functionality refers to running the Agent SDK without the Claude Code IDE interface, enabling backend/server-side deployments and integrations.
