# Custom Tools for Claude Agent SDK

## Overview

Custom tools extend Claude Agent SDK functionality through in-process MCP (Model Context Protocol) servers, enabling Claude to interact with external services, APIs, and specialized operations.

## Core Concepts

### Creating Custom Tools

The SDK provides `createSdkMcpServer` and `tool` helper functions for defining type-safe custom tools:

**Key Components:**
- Server definition with name and version
- Tool definitions using Zod schemas for validation
- Async handler functions that process arguments

### Tool Naming Convention

Custom tools follow a specific naming pattern when exposed to Claude:
- Format: `mcp__{server_name}__{tool_name}`
- Example: A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`

## Implementation Requirements

### Streaming Input Requirement

Custom MCP tools require streaming input mode. You must use an async generator/iterable for the `prompt` parameter — a simple string won't work.

### Passing Custom Servers

Custom servers are passed to the `query` function via the `mcpServers` option as a dictionary/object (not an array).

## Configuration Options

### Allowed Tools

Control which tools Claude can access using the `allowedTools` option, specifying tool names by their full qualified names.

### Multiple Tools

A single MCP server can contain multiple tools with selective access control for each.

## Type Safety

Zod schemas define both runtime validation and TypeScript types, ensuring arguments match expected structures with proper type inference.

## Error Handling

Tools should gracefully handle errors by returning meaningful feedback rather than throwing exceptions, maintaining conversation continuity.

## Practical Examples

The documentation provides three complete implementation examples:

1. **Database Query Tool** — Execute parameterized SQL queries
2. **API Gateway Tool** — Make authenticated requests to services (Stripe, GitHub, OpenAI, Slack)
3. **Calculator Tool** — Perform mathematical operations and compound interest calculations

## Related Resources

- TypeScript SDK Reference
- Python SDK Reference
- Model Context Protocol documentation
- Agent SDK Overview
