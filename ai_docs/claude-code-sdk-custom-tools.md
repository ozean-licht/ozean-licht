# Custom Tools in Claude Agent SDK

## Overview

Custom tools extend the Agent SDK's functionality through in-process MCP (Model Context Protocol) servers. This allows Claude to interact with external services, APIs, or perform specialized operations.

## Creating Custom Tools

Define type-safe custom tools using `createSdkMcpServer` and `tool` helper functions:

```typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

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
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m&temperature_unit=fahrenheit`
        );
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

Pass custom servers to the `query` function via `mcpServers` option. **Important:** Custom MCP tools require streaming input mode—use async generators for the `prompt` parameter.

```typescript
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "What's the weather in San Francisco?"
    }
  };
}

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

## Tool Name Format

Tools follow the pattern: `mcp__{server_name}__{tool_name}`. A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`.

## Key Configuration Options

- **allowedTools**: Control which tools Claude can access by specifying their full names
- **mcpServers**: Pass servers as object/dictionary, not array
- **Streaming Input**: Required for MCP tool support

## Error Handling

Wrap tool logic in try-catch blocks to provide meaningful feedback:

```typescript
tool(
  "fetch_data",
  "Fetch data from an API",
  { endpoint: z.string().url().describe("API endpoint URL") },
  async (args) => {
    try {
      const response = await fetch(args.endpoint);
      if (!response.ok) {
        return {
          content: [{
            type: "text",
            text: `API error: ${response.status} ${response.statusText}`
          }]
        };
      }
      const data = await response.json();
      return {
        content: [{
          type: "text",
          text: JSON.stringify(data, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Failed to fetch data: ${error.message}`
        }]
      };
    }
  }
)
```

## Example Tool Patterns

**Database Query Tool**: Execute SQL queries and return results
**API Gateway Tool**: Make authenticated requests to services (Stripe, GitHub, OpenAI, Slack)
**Calculator Tool**: Perform mathematical operations and compound interest calculations

All examples use Zod schemas for type safety and runtime validation.
