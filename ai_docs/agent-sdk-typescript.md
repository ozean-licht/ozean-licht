# Agent SDK TypeScript Reference - Complete Overview

This comprehensive API reference documents Anthropic's TypeScript Agent SDK for Claude Code integration.

## Core Functions

**`query()`** - Primary interaction function that returns an async generator streaming messages. Accepts a prompt (string or async iterable) and optional configuration object.

**`tool()`** - Creates type-safe MCP tool definitions using Zod schemas with async handler functions.

**`createSdkMcpServer()`** - Instantiates an in-process MCP server with specified tools and metadata.

## Configuration Options

The Options object supports:
- **Model selection**: `model`, `fallbackModel`
- **Permissions**: `permissionMode`, `canUseTool`, `allowedTools`, `disallowedTools`
- **Execution**: `cwd`, `executable`, `maxTurns`, `maxThinkingTokens`
- **Integration**: `mcpServers`, `agents`, `plugins`, `hooks`
- **Settings**: `settingSources` (user/project/local), `systemPrompt`
- **Session management**: `resume`, `forkSession`, `continue`

## Message Types

The system emits several message types:
- **SDKAssistantMessage** - Model responses
- **SDKUserMessage** - User input
- **SDKResultMessage** - Final execution results with token usage and costs
- **SDKSystemMessage** - Initialization data
- **SDKPartialAssistantMessage** - Streaming events (optional)
- **SDKCompactBoundaryMessage** - Conversation compression markers

## Built-in Tools

Available tools include file operations (Read, Write, Edit, Glob, Grep), bash execution, web operations (WebFetch, WebSearch), notebook editing, and MCP resource access.

## Permission System

Three permission modes: 'default', 'acceptEdits', 'bypassPermissions', 'plan'. Custom `CanUseTool` functions enable granular control over tool usage.

## Settings & Hooks

Settings load from filesystem locations with precedence: local > project > user. Hooks support events like PreToolUse, PostToolUse, UserPromptSubmit, and SessionStart for custom logic injection.

## Subagents

Define specialized agents programmatically with descriptions, tool restrictions, custom prompts, and model overrides.
