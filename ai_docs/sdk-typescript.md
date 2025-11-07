# TypeScript Agent SDK Documentation

## Installation
```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Core Functions

**`query()`** - Primary function for Claude Code interaction, returns an async generator streaming messages.

**`tool()`** - Creates type-safe MCP tool definitions using Zod schemas for input validation.

**`createSdkMcpServer()`** - Establishes in-process MCP server instances with defined tools.

## Key Configuration Options

The SDK accepts extensive configuration through the `Options` object:

- **Model selection**: Specify Claude version or use fallback models
- **Permission modes**: `'default'`, `'acceptEdits'`, `'bypassPermissions'`, or `'plan'`
- **Tool access**: Control via `allowedTools`, `disallowedTools`, or custom `canUseTool` function
- **MCP servers**: Configure stdio, SSE, HTTP, or SDK-based servers
- **Settings sources**: Load from `'user'`, `'project'`, or `'local'` filesystem locations
- **Hooks**: Listen to lifecycle events like `PreToolUse`, `PostToolUse`, `SessionStart`

## Message Types

The SDK returns a union of message types:

- `SDKAssistantMessage` - Claude responses with tool use details
- `SDKUserMessage` - User input with session tracking
- `SDKResultMessage` - Final results with usage statistics and costs
- `SDKSystemMessage` - Initialization data including available tools and MCP servers
- `SDKPartialAssistantMessage` - Streaming events (when enabled)

## Tool Coverage

Built-in tools include file operations (`Read`, `Write`, `Edit`, `Glob`), bash execution, web capabilities (`WebFetch`, `WebSearch`), search (`Grep`), notebook editing, and MCP resource access.

## Permission & Control

Custom permission logic flows through the `CanUseTool` callback, enabling approval workflows. The SDK supports session resumption, forking, and conversation compaction for extended interactions.
