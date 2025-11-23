# Claude Agent SDK TypeScript Reference

## Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Core Functions

### `query()`
The main entry point for interacting with Claude Code. Returns an async generator that streams messages.

**Parameters:**
- `prompt`: String or async iterable for streaming mode
- `options`: Configuration object (see Options)

**Returns:** `Query` object extending `AsyncGenerator<SDKMessage, void>`

### `tool()`
Creates type-safe MCP tool definitions using Zod schemas for input validation and handler functions.

### `createSdkMcpServer()`
Instantiates an MCP server running in the same process as your application.

## Key Configuration Options

The `Options` object supports:

- **Model selection**: `model` (defaults from CLI)
- **Tool management**: `allowedTools`, `disallowedTools`
- **Permission control**: `permissionMode` ('default' | 'acceptEdits' | 'bypassPermissions' | 'plan')
- **Session handling**: `resume`, `continue`, `forkSession`
- **MCP servers**: `mcpServers` configuration
- **System prompt**: Custom or preset prompts
- **Output formatting**: Structured output schemas
- **Settings sources**: Load from `'user'`, `'project'`, or `'local'` filesystem locations

## Message Types

The SDK returns various message types:

- `SDKAssistantMessage`: Claude's responses
- `SDKUserMessage`: User input
- `SDKResultMessage`: Final results with usage and cost data
- `SDKSystemMessage`: System initialization info
- `SDKPartialAssistantMessage`: Streaming events (with `includePartialMessages`)

## Permission Modes

- **default**: Standard permission behavior
- **acceptEdits**: Auto-accept file modifications
- **bypassPermissions**: Skip all permission checks
- **plan**: Planning mode without execution

## Built-in Tools

The SDK provides access to: Task delegation, Bash execution, file operations (Read/Write/Edit), Glob pattern matching, Grep searching, Jupyter notebook editing, web fetching, web searching, and todo list management.

## Hooks System

Subscribe to lifecycle events via the `hooks` option with callbacks for: PreToolUse, PostToolUse, Notification, UserPromptSubmit, SessionStart, SessionEnd, Stop, SubagentStop, and PreCompact events.

## Settings Management

Control configuration loading via `settingSources`:
- Omit entirely for SDK-only applications (default)
- Include `'project'` to load CLAUDE.md files
- Combine `'user'`, `'project'`, `'local'` as needed

Precedence: Local > Project > User settings.
