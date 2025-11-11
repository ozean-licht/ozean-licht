# Claude Agent SDK Custom Tools Documentation

## Overview

Custom tools extend Claude Agent SDK capabilities through in-process MCP servers, enabling Claude to interact with external services, APIs, and perform specialized operations.

## Creating Custom Tools

Developers use `createSdkMcpServer` and `tool` helper functions to define type-safe custom tools:

```typescript
const customServer = createSdkMcpServer({
  name: "my-custom-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "Get current temperature for a location using coordinates",
      {
        latitude: z.number().describe("Latitude coordinate"),
        longitude: z.number().describe("Longitude coordinate")
      },
      async (args) => { /* implementation */ }
    )
  ]
});
```

## Using Custom Tools

Custom MCP tools require **streaming input mode**—an async generator for the prompt parameter rather than a simple string.

Pass the server via the `mcpServers` option:

```typescript
for await (const message of query({
  prompt: generateMessages(),
  options: {
    mcpServers: {
      "my-custom-tools": customServer
    },
    maxTurns: 3
  }
})) { /* process messages */ }
```

## Tool Naming Convention

Exposed tool names follow the pattern: `mcp__{server_name}__{tool_name}`

Example: A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`

## Configuring Allowed Tools

Control which tools Claude can access through the `allowedTools` option:

```typescript
allowedTools: [
  "mcp__my-custom-tools__get_weather"
]
```

## Error Handling

Tools should gracefully handle errors and return meaningful feedback rather than throwing exceptions.

## Example Use Cases

- **Database queries**: Execute SQL with parameter support
- **API integration**: Make authenticated requests to external services
- **Calculations**: Perform mathematical operations with precision control
