# Context7 MCP Usage Guide

## Status: ✅ OPERATIONAL

Context7 MCP integration is fully operational with the page parameter fix deployed.

## Quick Test

```bash
wget -q -O - --post-data='{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "context7",
    "operation": "get-library-docs",
    "args": ["/storybookjs/storybook/v9.0.15"],
    "options": {
      "topic": "authentication",
      "tokens": 3000,
      "page": 1
    }
  },
  "id": "test-1"
}' \
  --header='Content-Type: application/json' \
  http://localhost:8100/mcp/rpc | jq '.result.data.documentation'
```

## API Endpoints

### Base URL
- **Production:** `http://mcp-gateway.ozean-licht.dev:8100`
- **Local:** `http://localhost:8100`

### Routes

1. **JSON-RPC Endpoint** (Recommended)
   - Path: `/mcp/rpc`
   - Method: `POST`
   - Format: JSON-RPC 2.0

2. **Execute Endpoint** (Slash Commands)
   - Path: `/mcp/execute`
   - Method: `POST`
   - Format: Command string

3. **Service Catalog**
   - Path: `/mcp/catalog`
   - Method: `GET`

4. **Service Details**
   - Path: `/mcp/service/context7`
   - Method: `GET`

## Available Operations

### 1. Resolve Library ID

Resolve a library name to a Context7-compatible ID.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "context7",
    "operation": "resolve-library-id",
    "args": ["storybook"]
  },
  "id": "resolve-1"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "data": {
      "operation": "resolve_library_id",
      "libraryName": "storybook",
      "libraryId": "/storybookjs/storybook/v9.0.15",
      "version": "v9.0.15",
      "supported": true,
      "message": "Successfully resolved library..."
    }
  },
  "id": "resolve-1"
}
```

### 2. Get Library Documentation

Fetch version-specific documentation for a library.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "context7",
    "operation": "get-library-docs",
    "args": ["/storybookjs/storybook/v9.0.15"],
    "options": {
      "topic": "authentication",
      "tokens": 3000,
      "page": 1
    }
  },
  "id": "docs-1"
}
```

**Parameters:**
- `args[0]` (required): Context7-compatible library ID
- `options.topic` (optional): Specific topic to retrieve (e.g., "hooks", "authentication")
- `options.tokens` (optional): Max tokens for response (default: 5000, min: 1000, max: 10000)
- `options.page` (required): Page number for paginated results (default: 1)

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "data": {
      "operation": "get_library_docs",
      "libraryId": "/storybookjs/storybook/v9.0.15",
      "topic": "authentication",
      "tokenLimit": 3000,
      "documentation": "### Storybook Authentication...",
      "metadata": {
        "retrievedAt": "2025-11-17T08:05:13.230Z",
        "contentLength": 12543,
        "estimatedTokens": 3136
      },
      "message": "Retrieved documentation for /storybookjs/storybook/v9.0.15 on topic: authentication"
    },
    "metadata": {
      "executionTime": 2234,
      "tokensUsed": 3136,
      "cost": 0.009408,
      "service": "context7",
      "operation": "get-library-docs",
      "timestamp": "2025-11-17T08:05:13.230Z"
    }
  },
  "id": "docs-1"
}
```

### 3. Health Check

Check Context7 service health and availability.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "context7",
    "operation": "health"
  },
  "id": "health-1"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "data": {
      "status": "healthy",
      "service": "context7",
      "endpoint": "https://mcp.context7.com/mcp",
      "latency": "234ms",
      "authenticated": false,
      "testResolution": "passed",
      "rateLimit": "free tier (~30 req/min)",
      "timestamp": "2025-11-17T08:05:13.230Z"
    }
  },
  "id": "health-1"
}
```

## Common Libraries

### Storybook
```json
{
  "libraryName": "storybook",
  "libraryId": "/storybookjs/storybook/v9.0.15"
}
```

**Topics:**
- `authentication` - Auth systems and login flows
- `addons` - Addon development
- `components` - Component documentation
- `testing` - Testing strategies

### React
```json
{
  "libraryName": "react",
  "libraryId": "/facebook/react/v18.2.0"
}
```

**Topics:**
- `hooks` - React hooks API
- `context` - Context API
- `performance` - Performance optimization

### Next.js
```json
{
  "libraryName": "nextjs",
  "libraryId": "/vercel/next.js/v14.0.0"
}
```

**Topics:**
- `routing` - App router and pages
- `authentication` - Auth patterns
- `api-routes` - API development

## Error Handling

### Common Errors

1. **Invalid operation**
```json
{
  "error": "Invalid operation. Allowed: resolve-library-id, get-library-docs, health"
}
```
**Fix:** Use correct operation name (`get-library-docs` not `get-docs`)

2. **Missing page parameter**
```json
{
  "error": "Input validation error: Required page parameter"
}
```
**Fix:** Always include `page: 1` in options

3. **Library not supported**
```json
{
  "result": {
    "data": {
      "supported": false,
      "message": "Library 'xyz' is not supported by Context7"
    }
  }
}
```
**Fix:** Check supported libraries at https://context7.com/libraries

## Best Practices

### 1. Always Include Page Parameter
```json
{
  "options": {
    "page": 1  // Required!
  }
}
```

### 2. Use Specific Topics
```json
{
  "options": {
    "topic": "authentication",  // Better than no topic
    "tokens": 3000,
    "page": 1
  }
}
```

### 3. Manage Token Limits
```json
{
  "options": {
    "tokens": 3000,  // Balance between detail and cost
    "page": 1
  }
}
```

### 4. Handle Pagination
```json
// Page 1
{ "options": { "page": 1, "tokens": 3000 } }

// Page 2
{ "options": { "page": 2, "tokens": 3000 } }
```

## Integration with Claude Agent SDK

Context7 is designed to provide up-to-date, version-specific library documentation to Claude agents.

**Example Agent Usage:**
```typescript
import { query } from '@anthropic/agent-sdk';

const result = await query({
  prompt: "How do I implement authentication in Storybook?",
  tools: [{
    name: "get_storybook_docs",
    description: "Get Storybook documentation",
    input_schema: {
      type: "object",
      properties: {
        topic: { type: "string" }
      }
    },
    async execute(input) {
      const response = await fetch('http://localhost:8100/mcp/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'mcp.execute',
          params: {
            service: 'context7',
            operation: 'get-library-docs',
            args: ['/storybookjs/storybook/v9.0.15'],
            options: {
              topic: input.topic,
              tokens: 3000,
              page: 1
            }
          },
          id: Date.now().toString()
        })
      });
      const data = await response.json();
      return data.result.data.documentation;
    }
  }]
});
```

## Rate Limiting

**Free Tier:**
- ~30 requests per minute
- No API key required
- Public access

**With API Key:**
- Higher rate limits
- Set `CONTEXT7_API_KEY` environment variable
- Contact Context7 for API key

## Monitoring

Check service health:
```bash
curl http://localhost:8100/mcp/service/context7 | jq '.'
```

Check metrics:
```bash
curl http://localhost:9090/metrics | grep context7
```

## Troubleshooting

### Empty Response
- Check if MCP Gateway is running: `docker ps | grep mcp-gateway`
- Verify correct endpoint: `/mcp/rpc` not `/api/mcp/context7`
- Use JSON-RPC 2.0 format

### 404 Error
- Ensure using `/mcp/rpc` endpoint
- Check operation name: `get-library-docs` not `get-docs`

### Validation Error
- Always include `page` parameter in options
- Check `args` array has library ID

## Fix Details

**Commit:** `1adebb6`
**Date:** 2025-11-17
**Changes:**
- Added required `page` parameter to Context7 handler
- Default to `page: 1` if not specified
- Updated capabilities definition
- Deployed successfully to production

**Files Changed:**
- `tools/mcp-gateway/src/mcp/handlers/context7.ts`
- `tools/mcp-gateway/config/mcp-catalog.json`

## Contact

- **Documentation:** https://context7.com/docs
- **MCP Gateway Docs:** /tools/mcp-gateway/README.md
- **Issues:** Report to MCP Gateway team
