# Custom Tools for Claude Agent SDK

## Overview

Custom tools extend Claude Code's capabilities through in-process MCP servers, allowing Claude to "interact with external services, APIs, or perform specialized operations."

## Creating Custom Tools

Use `createSdkMcpServer` and `tool` helper functions with Zod schemas for type-safe definitions. Tools consist of:
- A descriptive name
- Documentation string
- Parameter schema (Zod validation)
- Async handler function returning content

## Key Requirements

**Streaming Input Mode Required**: "Custom MCP tools require streaming input mode. You must use an async generator/iterable for the `prompt` parameter."

## Tool Naming Convention

MCP tools follow the pattern: `mcp__{server_name}__{tool_name}`. For instance, a "get_weather" tool in "my-custom-tools" becomes `mcp__my-custom-tools__get_weather`.

## Configuration

Pass custom servers to the `query` function via the `mcpServers` option as a dictionary. Control tool access using `allowedTools` to specify which tools Claude can invoke.

## Use Cases

The documentation provides example implementations for:
- Database query execution
- API gateway requests (Stripe, GitHub, OpenAI, Slack)
- Mathematical calculations and compound interest

## Error Handling

Wrap tool logic in try-catch blocks to gracefully handle failures and provide meaningful feedback to Claude.
