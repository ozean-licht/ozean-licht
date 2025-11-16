# Claude Agent SDK Custom Tools Documentation

## Overview

Custom tools extend Claude Code's capabilities through in-process MCP servers, enabling integration with external services and specialized operations.

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
      async (args) => {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m&temperature_unit=fahrenheit`);
        const data = await response.json();
        return {
          content: [{
            type: "text",
            text: `Temperature: ${data.current.temperature_2m}°F`
          }]
        };
      }
    )
  ]
});
```

## Using Custom Tools

Custom servers pass to the `query` function via `mcpServers` option. **Important:** Custom MCP tools require streaming input mode using async generators, not simple strings.

## Tool Naming Convention

"When MCP tools are exposed to Claude, their names follow a specific format: `mcp__{server_name}__{tool_name}`"

Example: A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`.

## Configuring Allowed Tools

Control which tools Claude can use through the `allowedTools` option:

```typescript
for await (const message of query({
  prompt: generateMessages(),
  options: {
    mcpServers: {
      "my-custom-tools": customServer
    },
    allowedTools: [
      "mcp__my-custom-tools__get_weather"
    ],
    maxTurns: 3
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}
```

## Type Safety with Zod

Zod schemas define both runtime validation and TypeScript types, ensuring strongly-typed arguments.

## Error Handling

Tools should gracefully handle errors and provide meaningful feedback to users rather than failing silently.

## Example Tools

**Database Query Tool:** Execute SQL queries with parameterized inputs

**API Gateway Tool:** Make authenticated requests to external services (Stripe, GitHub, OpenAI, Slack)

**Calculator Tool:** Perform mathematical calculations and compound interest computations

## Related Documentation

- TypeScript SDK Reference
- Python SDK Reference
- Model Context Protocol Documentation
- SDK Overview
