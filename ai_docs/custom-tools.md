# Custom Tools for Claude Agent SDK

## Overview

Custom tools extend Claude Code's capabilities through in-process MCP servers, enabling interactions with external services, APIs, and specialized operations.

## Creating Custom Tools

Use `createSdkMcpServer` and `tool` helper functions to define type-safe custom tools with Zod schemas:

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
      async (args) => {
        // Implementation fetches weather data and returns formatted response
      }
    )
  ]
});
```

## Using Custom Tools

Pass custom servers via the `mcpServers` option as a dictionary. **Important:** "Custom MCP tools require streaming input mode" — use an async generator for the `prompt` parameter, not a simple string.

### Tool Naming Convention

Tools follow the pattern: `mcp__{server_name}__{tool_name}`

Example: A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`

### Controlling Tool Access

Use `allowedTools` to specify which tools Claude can access:

```typescript
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

## Type Safety

Zod schemas provide both runtime validation and TypeScript type inference, ensuring arguments match expected structures with proper constraints like email validation or numeric ranges.

## Error Handling

Wrap implementations in try-catch blocks to gracefully handle API failures, returning meaningful error messages as text content rather than throwing exceptions.

## Example Tools

**Database Query Tool:** Execute parameterized SQL queries safely.

**API Gateway Tool:** Make authenticated requests to services like Stripe, GitHub, OpenAI, and Slack with proper configuration management.

**Calculator Tool:** Perform mathematical operations with precision control and compound interest calculations.
