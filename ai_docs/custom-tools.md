# Custom Tools in Claude Agent SDK

## Overview

The documentation explains how to create and integrate custom tools that extend Claude's capabilities through in-process MCP (Model Context Protocol) servers.

## Key Implementation Steps

**Creating Tools:**
Tools are defined using `createSdkMcpServer` and the `tool` helper function with Zod schemas for type safety:

```typescript
const customServer = createSdkMcpServer({
  name: "my-custom-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "Get current temperature for a location",
      { latitude: z.number(), longitude: z.number() },
      async (args) => { /* implementation */ }
    )
  ]
});
```

**Tool Naming Format:**
Tools follow the pattern: `mcp__{server_name}__{tool_name}` when exposed to Claude.

## Important Requirement

"Custom MCP tools require streaming input mode. You must use an async generator/iterable for the `prompt` parameter."

## Using Tools

Pass servers to the `query` function via `mcpServers` option and optionally restrict access through `allowedTools`:

```typescript
for await (const message of query({
  prompt: generateMessages(),
  options: {
    mcpServers: { "my-custom-tools": customServer },
    allowedTools: ["mcp__my-custom-tools__get_weather"]
  }
})) { /* handle response */ }
```

## Example Use Cases

The guide provides templates for database queries, API gateways, and calculator tools with comprehensive error handling patterns.
