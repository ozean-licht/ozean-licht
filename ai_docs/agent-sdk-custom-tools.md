# Claude Agent SDK Custom Tools Documentation

## Overview

Custom tools extend Claude Code's capabilities through in-process MCP servers, enabling integration with external services and specialized operations.

## Core Concepts

### Creating Custom Tools

The SDK provides `createSdkMcpServer` and `tool` helper functions for defining type-safe custom tools. Tools require:

- **Name**: Identifier for the tool
- **Description**: Explanation of functionality
- **Schema**: Zod-defined parameters for type safety
- **Handler**: Async function implementing the tool logic

### Tool Implementation Pattern

Tools accept arguments validated against their schema and return content objects with text responses. The pattern follows:

```typescript
tool(
  "tool_name",
  "Description of what this does",
  { parameter: z.type().describe("explanation") },
  async (args) => ({ content: [{ type: "text", text: "result" }] })
)
```

## Key Requirements

**Streaming Input Mode Required**: Custom MCP tools mandate streaming input via async generators. String-based prompts won't work with MCP servers.

**mcpServers as Dictionary**: Pass MCP servers as object dictionaries, not arrays, to the `query` function.

## Tool Naming Convention

Tools exposed to Claude follow the pattern: `mcp__{server_name}__{tool_name}`

Example: A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`

## Configuration Options

### allowedTools Parameter

Restrict Claude's access to specific tools via the `allowedTools` array:

```typescript
allowedTools: [
  "mcp__my-custom-tools__get_weather",
  "mcp__utilities__calculate"
]
```

This provides granular control over available functionality.

## Error Handling

Tools should gracefully handle failures by returning error messages within response content rather than throwing exceptions. This maintains conversation flow and provides meaningful feedback.

## Example Implementations

### Weather Tool

Fetches temperature data via Open-Meteo API using latitude/longitude coordinates.

### Database Query Tool

Executes SQL queries with parameter support and returns formatted results.

### API Gateway Tool

Authenticates and routes requests to services (Stripe, GitHub, OpenAI, Slack) with method support (GET, POST, PUT, DELETE).

### Calculator Tool

Performs mathematical operations and compound interest calculations with configurable precision.

## Type Safety

Zod schemas provide runtime validation and TypeScript type inference, ensuring args parameters are properly typed based on schema definitions.

## Related Documentation

- TypeScript SDK Reference
- Python SDK Reference
- MCP Documentation
- Agent SDK Overview
