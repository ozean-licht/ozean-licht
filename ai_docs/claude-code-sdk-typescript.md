# TypeScript Agent SDK Reference - Complete Documentation

## Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Core Functions

**`query()`** - Primary function for interacting with Claude Code. Takes a prompt (string or async iterable) and optional configuration, returning an async generator that streams messages.

**`tool()`** - Creates type-safe MCP tool definitions using Zod schemas for input validation and async handlers.

**`createSdkMcpServer()`** - Establishes an in-process MCP server with tools, name, and optional version.

## Key Configuration Options

The `Options` interface supports extensive customization:

- **Model selection**: `model`, `fallbackModel` for resilience
- **Tool management**: `allowedTools`, `disallowedTools`, custom `canUseTool` permission functions
- **Execution context**: `cwd`, `env`, `executable` (bun/deno/node)
- **MCP integration**: `mcpServers` configuration for external tool providers
- **Session handling**: `resume` for continuation, `forkSession` for branching
- **Permission modes**: 'default', 'acceptEdits', 'bypassPermissions', 'plan'
- **System prompts**: String custom prompts or preset Claude Code configuration
- **Output formatting**: `outputFormat` for structured JSON schema results
- **Hooks**: Event-based callbacks for lifecycle monitoring

## Message Types

The SDK returns a discriminated union `SDKMessage` encompassing:

- `SDKAssistantMessage` - Claude's responses with tool use tracking
- `SDKUserMessage` - User inputs with UUID tracking
- `SDKResultMessage` - Final execution results with metrics (tokens, cost, duration)
- `SDKSystemMessage` - Initialization data (tools, models, permissions)
- `SDKPartialAssistantMessage` - Streaming events (when enabled)

## Built-in Tools

**File Operations**: Read, Write, Edit, NotebookEdit
**Search**: Grep (ripgrep-based), Glob, WebSearch
**Execution**: Bash (with background support), Task (delegated agents)
**Utilities**: TodoWrite, WebFetch, MCP resource access

## Permissions & Security

Control tool access through:

- **`permissionMode`** - Global behavior (plan mode prevents execution)
- **`CanUseTool` callback** - Custom logic receiving tool name, input, and abort signals
- **`PermissionResult`** - Allow/deny with optional input modification
- **Settings sources** - Load from `~/.claude/settings.json`, `.claude/settings.json`, or `.claude/settings.local.json`

## Subagents & Advanced Features

**Programmatic agents**: Define via `agents` option with description, tools, prompt, and model
**Structured outputs**: "Enforce consistent response formats via JSON schema"
**Cost tracking**: `SDKResultMessage` includes `total_cost_usd` and token breakdowns
**Hooks**: PreToolUse, PostToolUse, SessionStart/End, PreCompact for monitoring

## MCP Server Configuration

Support for multiple transport types:
- **stdio**: Direct process execution with args/env
- **sse**: Server-sent events over HTTP
- **http**: Native HTTP protocol
- **sdk**: In-process instances via `createSdkMcpServer()`

## Settings & Defaults

When `settingSources` is omitted, no filesystem settings load (SDK isolation). Include specific sources ('user', 'project', 'local') to enable CLAUDE.md project instructions and team configurations.
