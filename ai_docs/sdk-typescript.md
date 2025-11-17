# TypeScript Agent SDK Reference - Complete Guide

## Overview

The TypeScript Agent SDK provides a comprehensive interface for building AI agents with Claude. The primary function is `query()`, which creates an async generator for streaming messages from Claude Code.

## Key Functions

### query()
"The primary function for interacting with Claude Code. Creates an async generator that streams messages as they arrive."

```typescript
function query({
  prompt,
  options
}: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

The function accepts either a string prompt or async iterable for streaming mode, returning a `Query` object with interrupt and permission management methods.

### tool()
Creates type-safe MCP tool definitions with Zod schema validation:

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args, extra) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

### createSdkMcpServer()
"Creates an MCP server instance that runs in the same process as your application."

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

## Essential Configuration Options

**settingSources** controls which filesystem configuration to load:
- `'user'`: Global settings (~/.claude/settings.json)
- `'project'`: Shared project settings (.claude/settings.json)
- `'local'`: Gitignored local settings (.claude/settings.local.json)

Default behavior omits filesystem settings for SDK isolation.

**permissionMode** options:
- `'default'`: Standard permission behavior
- `'acceptEdits'`: Auto-accept file edits
- `'bypassPermissions'`: Skip all checks
- `'plan'`: Planning mode without execution

## Built-in Tools

The SDK includes tools for file operations (Read, Write, Edit, Glob, Grep), code execution (Bash, NotebookEdit), web access (WebFetch, WebSearch), and MCP resource management.

## Hook System

Register callbacks for lifecycle events: PreToolUse, PostToolUse, Notification, UserPromptSubmit, SessionStart, SessionEnd, Stop, SubagentStop, and PreCompact.

Hook return types support both async operations and synchronous decision-making for tool permission management.
