# Claude Agent SDK: Custom Tools and MCP Integration

## Overview

Custom tools extend Claude's capabilities through in-process MCP (Model Context Protocol) servers. The SDK provides helper functions `createSdkMcpServer` and `tool` to define type-safe custom implementations.

## Creating Custom Tools

Tools are defined using the `tool` function with Zod schemas for type safety.

### Basic Tool Definition

```typescript
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
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
          `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m`
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

### Tool Function Signature

```typescript
tool(
  name: string,              // Unique tool identifier
  description: string,       // What the tool does (used by Claude)
  inputSchema: ZodSchema,   // Input parameter definitions
  handler: async (args) => { // Implementation function
    // Return tool result
  }
)
```

## Key Integration Requirements

### Streaming Input Mode Required

MCP tools demand async generators for the prompt parameter—simple strings won't work.

```typescript
// WRONG - won't work with MCP tools
for await (const message of query({
  prompt: "What's the weather?",
  options: { mcpServers: { "my-tools": server } }
})) { }

// CORRECT - async generator
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: { role: "user" as const, content: "What's the weather?" }
  };
}

for await (const message of query({
  prompt: generateMessages(),
  options: { mcpServers: { "my-tools": server } }
})) { }
```

### Tool Naming Convention

Tools follow the pattern `mcp__{server_name}__{tool_name}`.

A tool named `get_weather` in server `my-custom-tools` becomes:

```
mcp__my-custom-tools__get_weather
```

Use this full name when allowing/denying tools.

## Using Custom Tools

Pass servers to the `query` function via the `mcpServers` option:

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

## Error Handling

### Basic Error Handling Pattern

```typescript
tool(
  "fetch_data",
  "Fetch data from an API",
  { endpoint: z.string().url() },
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

### Advanced Error Handling

```typescript
tool(
  "process_file",
  "Process a file and return results",
  { filePath: z.string() },
  async (args) => {
    try {
      // Validate input
      if (!args.filePath.startsWith('/safe/path')) {
        throw new Error('File path must be in safe directory');
      }

      // Process file
      const result = await processFile(args.filePath);

      // Return success
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result)
        }]
      };
    } catch (error) {
      // Log error for debugging
      console.error(`Tool error in process_file:`, error);

      // Return user-friendly error
      return {
        content: [{
          type: "text",
          text: `Error: ${error.message}`
        }]
      };
    }
  }
)
```

## Multiple Tools Example

Create servers with several tools and selectively enable them:

```typescript
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const multiToolServer = createSdkMcpServer({
  name: "utilities",
  version: "1.0.0",
  tools: [
    tool(
      "calculate",
      "Perform mathematical calculations",
      {
        expression: z.string().describe("Mathematical expression")
      },
      async (args) => {
        try {
          const result = eval(args.expression);
          return {
            content: [{
              type: "text",
              text: `Result: ${result}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Calculation error: ${error.message}`
            }]
          };
        }
      }
    ),

    tool(
      "translate",
      "Translate text between languages",
      {
        text: z.string(),
        targetLanguage: z.enum(['spanish', 'french', 'german', 'japanese'])
      },
      async (args) => {
        // Translation implementation
        const translations: Record<string, Record<string, string>> = {
          'hello': {
            spanish: 'hola',
            french: 'bonjour',
            german: 'hallo',
            japanese: 'こんにちは'
          }
        };

        const result = translations[args.text.toLowerCase()]?.[args.targetLanguage] || 'Translation not found';
        return {
          content: [{
            type: "text",
            text: result
          }]
        };
      }
    ),

    tool(
      "search_web",
      "Search the web for information",
      { query: z.string() },
      async (args) => {
        // Web search implementation
        return {
          content: [{
            type: "text",
            text: `Search results for "${args.query}": [results would go here]`
          }]
        };
      }
    )
  ]
});

// Usage with selective tool enablement
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "Calculate 2+2, translate 'hello' to Spanish, and search for Node.js"
    }
  };
}

for await (const message of query({
  prompt: generateMessages(),
  options: {
    mcpServers: { utilities: multiToolServer },
    // Only allow specific tools
    allowedTools: [
      "mcp__utilities__calculate",
      "mcp__utilities__translate"
      // search_web is NOT available
    ]
  }
})) {
  console.log(message);
}
```

## Input Validation Examples

### URL Validation

```typescript
tool(
  "fetch_url",
  "Fetch content from a URL",
  {
    url: z.string().url().describe("Valid URL to fetch"),
    timeout: z.number().optional().describe("Timeout in milliseconds")
  },
  async (args) => {
    try {
      const controller = new AbortController();
      if (args.timeout) {
        setTimeout(() => controller.abort(), args.timeout);
      }

      const response = await fetch(args.url, { signal: controller.signal });
      const text = await response.text();

      return {
        content: [{
          type: "text",
          text: text.substring(0, 10000) // Limit response size
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Fetch failed: ${error.message}`
        }]
      };
    }
  }
)
```

### File Path Validation

```typescript
import { z } from "zod";
import { resolve, relative } from "path";

tool(
  "safe_read_file",
  "Safely read a file from allowed directories",
  {
    filePath: z.string().describe("Path to file")
  },
  async (args) => {
    try {
      const safeBasePath = "/home/user/allowed";
      const resolvedPath = resolve(args.filePath);
      const relativePath = relative(safeBasePath, resolvedPath);

      // Prevent directory traversal
      if (relativePath.startsWith('..')) {
        throw new Error('Access denied: path outside allowed directory');
      }

      // Read file
      const { readFileSync } = await import('fs');
      const content = readFileSync(resolvedPath, 'utf-8');

      return {
        content: [{
          type: "text",
          text: content
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error.message}`
        }]
      };
    }
  }
)
```

## Advanced Patterns

### Caching Tool Results

```typescript
const cache = new Map<string, any>();

tool(
  "fetch_data_cached",
  "Fetch data with caching",
  { query: z.string() },
  async (args) => {
    if (cache.has(args.query)) {
      return {
        content: [{
          type: "text",
          text: `[CACHED] ${JSON.stringify(cache.get(args.query))}`
        }]
      };
    }

    // Fetch actual data
    const result = await fetch(`https://api.example.com?q=${args.query}`);
    const data = await result.json();

    cache.set(args.query, data);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(data)
      }]
    };
  }
)
```

### Rate-Limited Tool

```typescript
import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({ tokensPerInterval: 10, interval: 'minute' });

tool(
  "rate_limited_api_call",
  "Make API call with rate limiting",
  { endpoint: z.string().url() },
  async (args) => {
    await limiter.removeTokens(1);

    const response = await fetch(args.endpoint);
    const data = await response.json();

    return {
      content: [{
        type: "text",
        text: JSON.stringify(data)
      }]
    };
  }
)
```

### Tool with Async Context

```typescript
tool(
  "database_query",
  "Query the database",
  { sql: z.string() },
  async (args) => {
    // Use database connection pool
    const db = await getDatabaseConnection();

    try {
      const result = await db.query(args.sql);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result.rows)
        }]
      };
    } finally {
      await db.release();
    }
  }
)
```

## Tool Response Format

All tools must return a structured response:

```typescript
interface ToolResult {
  content: Array<{
    type: "text" | "image" | "file";
    text?: string;
    source?: { type: "base64" | "url"; media_type?: string; data?: string };
  }>;
}
```

## Complete Example: Multi-Tool Server

```typescript
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import axios from "axios";

const dataServiceServer = createSdkMcpServer({
  name: "data-services",
  version: "1.0.0",
  tools: [
    tool(
      "fetch_json",
      "Fetch JSON data from an API",
      {
        url: z.string().url(),
        headers: z.record(z.string()).optional()
      },
      async (args) => {
        try {
          const response = await axios.get(args.url, { headers: args.headers });
          return {
            content: [{
              type: "text",
              text: JSON.stringify(response.data, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error fetching ${args.url}: ${error.message}`
            }]
          };
        }
      }
    ),

    tool(
      "parse_json",
      "Parse and validate JSON structure",
      { json: z.string() },
      async (args) => {
        try {
          const data = JSON.parse(args.json);
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
              text: `JSON parse error: ${error.message}`
            }]
          };
        }
      }
    ),

    tool(
      "transform_data",
      "Transform data using a transformation function",
      {
        data: z.string(),
        operation: z.enum(['uppercase', 'lowercase', 'reverse', 'sort'])
      },
      async (args) => {
        const data = JSON.parse(args.data);
        let result = data;

        switch (args.operation) {
          case 'uppercase':
            if (typeof data === 'string') result = data.toUpperCase();
            break;
          case 'lowercase':
            if (typeof data === 'string') result = data.toLowerCase();
            break;
          case 'reverse':
            if (Array.isArray(data)) result = data.reverse();
            break;
          case 'sort':
            if (Array.isArray(data)) result = data.sort();
            break;
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify(result)
          }]
        };
      }
    )
  ]
});

export default dataServiceServer;
```

## Related Resources

- TypeScript SDK Reference
- Python SDK Reference
- Model Context Protocol Documentation
- SDK Overview

---

**Source**: https://docs.claude.com/en/docs/agent-sdk/custom-tools
