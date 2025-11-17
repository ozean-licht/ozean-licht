# Claude Agent SDK Custom Tools Documentation

## Overview

Custom tools extend Claude Code's capabilities through in-process MCP (Model Context Protocol) servers, enabling Claude to interact with external services and APIs.

## Key Components

**Creating Tools:**
Use `createSdkMcpServer` and `tool` helper functions with Zod schemas for type safety. As documented, tools define "a name, description, input parameters, and async handler function."

**Tool Naming Format:**
Tools follow the pattern `mcp__{server_name}__{tool_name}`. For example, a weather tool in the "my-custom-tools" server becomes `mcp__my-custom-tools__get_weather`.

**Critical Requirement:**
"Custom MCP tools require streaming input mode." You must use an async generator for the `prompt` parameter—simple strings won't work with MCP servers.

## Implementation Pattern

Tools are defined with:
- Schema validation using Zod
- Async handler functions
- Content response objects

The `allowedTools` option controls which tools Claude can access, enabling selective tool availability.

## Example Domains

The documentation provides examples for:
- Database query tools
- API gateway tools with multi-service support
- Calculator tools with compound interest computation

## Usage with Query Function

Tools integrate via the `mcpServers` parameter as an object/dictionary (not an array), combined with `maxTurns` configuration for agentic behavior.
