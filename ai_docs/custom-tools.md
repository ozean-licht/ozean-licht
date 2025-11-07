# Custom Tools in Claude Agent SDK

## Overview

Custom tools extend Claude's capabilities through in-process MCP servers, enabling interaction with external services, APIs, and specialized operations.

## Creating Custom Tools

The SDK provides `createSdkMcpServer` and `tool` helper functions for type-safe tool definition:

```typescript
const customServer = createSdkMcpServer({
  name: "my-custom-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "Get current weather for a location",
      {
        location: z.string().describe("City name or coordinates"),
        units: z.enum(["celsius", "fahrenheit"]).default("celsius")
      },
      async (args) => {
        // Implementation
      }
    )
  ]
});
```

## Using Custom Tools

**Critical Requirement:** Custom MCP tools require streaming input mode. The prompt parameter must use an async generator, not a simple string.

Pass servers via the `mcpServers` option as an object:

```typescript
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: { role: "user" as const, content: "Query" }
  };
}

for await (const message of query({
  prompt: generateMessages(),
  options: {
    mcpServers: { "my-custom-tools": customServer },
    allowedTools: ["mcp__my-custom-tools__get_weather"],
    maxTurns: 3
  }
})) {
  // Process results
}
```

## Tool Naming Convention

Tools follow the pattern: `mcp__{server_name}__{tool_name}`

## Key Features

- **Type Safety:** Zod schemas provide runtime validation and TypeScript typing
- **Error Handling:** Graceful error management with meaningful feedback
- **Selective Access:** Control which tools Claude can invoke via `allowedTools`

## Example Use Cases

The documentation includes three ready-to-use examples:
- Database query execution
- Authenticated API gateway calls
- Mathematical calculations with compound interest
