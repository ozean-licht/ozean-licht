# Plan: Integrate Context7 MCP into MCP Gateway

## Task Description

Integrate Upstash's Context7 MCP server into the existing MCP Gateway catalog to provide autonomous agents with access to up-to-date, version-specific documentation for libraries and frameworks. Context7 will be integrated as a server-side MCP service that fetches real-time documentation and code examples, eliminating LLM hallucinations about outdated or non-existent APIs.

## Objective

Add Context7 as the 9th server-side MCP service in the gateway, enabling agents to:
- Resolve library names to Context7-compatible identifiers
- Fetch version-specific documentation for any supported library
- Access real-time code examples and API references
- Query documentation with topic filtering and token limits

## Problem Statement

Current AI agents often generate code using outdated APIs or hallucinate non-existent methods because they lack access to current library documentation. Context7 solves this by providing real-time, version-specific documentation directly in the agent's context. Integrating Context7 into our MCP Gateway will standardize access to this capability across all autonomous agents in the Ozean Licht ecosystem.

## Solution Approach

Follow the established MCP Gateway pattern for server-side services:
1. Create a TypeScript handler class implementing the `MCPHandler` interface
2. Add service configuration to `mcp-catalog.json`
3. Register the service in the initialization pipeline
4. Add environment variables for optional API key authentication
5. Implement two core capabilities: `resolve-library-id` and `get-library-docs`
6. Support optional API key for higher rate limits (default: public access)

Context7 will use HTTP REST calls to the Upstash Context7 API (`https://mcp.context7.com/mcp`), similar to how we integrate with Cloudflare, GitHub, and N8N.

## Relevant Files

### Existing Files to Modify

- **`tools/mcp-gateway/src/mcp/initialize.ts`** - Add Context7 initializer function and register in server services array
- **`tools/mcp-gateway/src/mcp/registry.ts`** - No changes needed (handles service registration automatically)
- **`tools/mcp-gateway/config/mcp-catalog.json`** - Add Context7 service entry with capabilities, commands, token costs, and rate limits
- **`tools/mcp-gateway/config/environment.ts`** - Add `CONTEXT7_API_KEY` optional environment variable to schema
- **`tools/mcp-gateway/package.json`** - Add `@upstash/context7-mcp` as dependency (optional, for type references)
- **`tools/mcp-gateway/README.md`** - Update service count and add Context7 documentation section

### New Files

- **`tools/mcp-gateway/src/mcp/handlers/context7.ts`** - Context7 MCP handler implementation with resolve-library-id and get-library-docs operations

## Implementation Phases

### Phase 1: Foundation (Handler Structure)
- Create the Context7 handler TypeScript file
- Implement the handler class with basic structure
- Set up HTTP client with Axios
- Add error handling and logging infrastructure

### Phase 2: Core Implementation (Capabilities)
- Implement `resolve-library-id` operation
- Implement `get-library-docs` operation with topic filtering
- Add health check capability
- Implement parameter validation
- Add metrics and token tracking

### Phase 3: Integration & Polish (Gateway Integration)
- Register service in initialization pipeline
- Add catalog entry with detailed capabilities
- Update environment configuration
- Add tests and validation
- Update documentation

## Step by Step Tasks

### 1. Create Context7 Handler

- Create new file `tools/mcp-gateway/src/mcp/handlers/context7.ts`
- Import required types: `MCPHandler`, `MCPParams`, `MCPResult`, `MCPCapability`
- Import utilities: `ValidationError`, `ServiceUnavailableError`, `logger`, `recordMCPOperation`, `recordTokenUsage`
- Set up Axios client with base URL: `https://mcp.context7.com/mcp`
- Add request/response interceptors for logging
- Support optional API key authentication via headers

### 2. Implement Core Capabilities

**resolve-library-id operation:**
- Accept `libraryName` parameter (e.g., "react", "nextjs", "fastapi")
- Call Context7 API to resolve library name to Context7-compatible ID
- Return resolved library identifier
- Handle cases where library is not found

**get-library-docs operation:**
- Accept required `libraryId` parameter (Context7-compatible library ID)
- Accept optional `topic` parameter (e.g., "hooks", "routing", "authentication")
- Accept optional `tokens` parameter (default: 5000, limits response size)
- Call Context7 API to fetch documentation
- Return formatted documentation with metadata
- Track token usage based on response size

**health operation:**
- Check Context7 API availability
- Return service status and latency
- Test with a simple resolve operation

### 3. Add Capability Definitions

Implement `getCapabilities()` method returning:
- `resolve-library-id`: Resolve library name to Context7 ID
  - Parameter: `libraryName` (string, required)
  - Token cost: 100
  - Auth: optional (higher limits with API key)
- `get-library-docs`: Fetch library documentation
  - Parameter: `libraryId` (string, required)
  - Parameter: `topic` (string, optional)
  - Parameter: `tokens` (number, optional, default: 5000)
  - Token cost: 800 (high due to large responses)
  - Auth: optional (higher limits with API key)
- `health`: Service health check
  - Token cost: 50
  - Auth: not required

### 4. Update MCP Catalog Configuration

Edit `tools/mcp-gateway/config/mcp-catalog.json`:
- Add `context7` entry under `services`
- Set `name`: "Context7 MCP"
- Set `description`: "Up-to-date, version-specific code documentation for libraries"
- Set `location`: "server"
- Set `version`: "1.0.0"
- Set `status`: "active"
- Set `alwaysActive`: true (allow all agents to use documentation)
- Add capabilities array: `["resolve-library-id", "get-library-docs", "health"]`
- Add command examples:
  - `/mcp-context7 resolve "react"`
  - `/mcp-context7 get-docs "react@18" --topic="hooks"`
  - `/mcp-context7 get-docs "fastapi@0.104" --tokens=3000`
- Set token costs:
  - `avgTokensPerCall`: 800
  - `costPerCall`: 0.0024
  - `complexity`: "high"
- Set rate limits:
  - `requestsPerMinute`: 30 (free tier limit)
  - `burstLimit`: 5

### 5. Update Environment Configuration

Edit `tools/mcp-gateway/config/environment.ts`:
- Add to env schema: `CONTEXT7_API_KEY: z.string().optional()`
- Add to service URLs: `context7: process.env.CONTEXT7_API_URL || 'https://mcp.context7.com/mcp'`
- Document that API key is optional (provides higher rate limits when set)

### 6. Register Service Initialization

Edit `tools/mcp-gateway/src/mcp/initialize.ts`:
- Add import: `{ Context7Handler } from './handlers/context7'`
- Add to services array in `initializeServerServices()`:
  ```typescript
  { name: 'context7', initializer: initializeContext7 }
  ```
- Create initializer function:
  ```typescript
  async function initializeContext7(registry: MCPRegistry): Promise<void> {
    const { Context7Handler } = await import('./handlers/context7');
    const handler = new Context7Handler();
    const serviceConfig = mcpCatalog.services.context7;
    registry.registerService({
      name: 'context7',
      version: serviceConfig.version,
      description: serviceConfig.description,
      location: 'server',
      capabilities: serviceConfig.capabilities,
      status: 'active',
    }, handler);
  }
  ```

### 7. Update Package Dependencies

Edit `tools/mcp-gateway/package.json`:
- Consider adding `@upstash/context7-mcp` as a dev dependency for type references (optional)
- Axios is already available for HTTP requests
- No additional runtime dependencies needed

### 8. Update Documentation

Edit `tools/mcp-gateway/README.md`:
- Update service count: "9 server-side MCP services" → "10 server-side MCP services"
- Add Context7 to Architecture section under "Server-Side MCP Services"
- Add Context7 configuration section:
  - Purpose: Up-to-date code documentation
  - Features: Library resolution, documentation fetching, topic filtering
  - Endpoint: `https://mcp.context7.com/mcp`
  - Authentication: Optional API key (higher rate limits)
- Add to Usage Examples section:
  ```bash
  # Context7 operations
  /mcp-context7 resolve "nextjs"
  /mcp-context7 get-docs "react@18" --topic="hooks"
  /mcp-context7 get-docs "fastapi@0.104" --tokens=5000
  /mcp-context7 health
  ```
- Update changelog with v1.0.3 entry

### 9. Validate Implementation

- Build TypeScript: `npm run build`
- Check for TypeScript errors: `npm run type-check`
- Test locally with dev server: `npm run dev`
- Test health check: `curl http://localhost:8100/mcp/catalog | jq '.services.context7'`
- Test resolve operation via MCP Gateway
- Test get-docs operation with different libraries
- Verify error handling for invalid library names
- Check metrics are being recorded

## Testing Strategy

### Unit Tests (Optional Phase)
- Test library ID resolution with valid and invalid library names
- Test documentation fetching with various parameters
- Test topic filtering functionality
- Test token limit enforcement
- Test error handling for network failures
- Test API key authentication (with and without key)

### Integration Tests
1. **Health Check Test**: Verify Context7 service is accessible
2. **Library Resolution Test**: Resolve common libraries (react, nextjs, python, fastapi)
3. **Documentation Fetch Test**: Get docs for React hooks with topic filter
4. **Large Response Test**: Fetch full documentation (high token count)
5. **Error Handling Test**: Request docs for non-existent library
6. **Rate Limit Test**: Verify rate limiting works correctly

### Manual Testing
- Start MCP Gateway in dev mode
- Use curl or Postman to test endpoints
- Verify responses contain expected documentation structure
- Check logs for proper operation tracking
- Monitor metrics endpoint for token usage

## Acceptance Criteria

- [ ] Context7 handler implements `MCPHandler` interface correctly
- [ ] `resolve-library-id` operation successfully resolves library names to IDs
- [ ] `get-library-docs` operation fetches documentation with optional topic and token parameters
- [ ] Health check reports Context7 service status and latency
- [ ] Service is registered in MCP catalog with correct capabilities
- [ ] Environment configuration supports optional `CONTEXT7_API_KEY`
- [ ] Service initializes correctly on gateway startup
- [ ] All operations log properly and record metrics
- [ ] Token usage is tracked accurately
- [ ] Error handling works for network failures and invalid requests
- [ ] Service appears in `/mcp/catalog` endpoint response
- [ ] Documentation is updated with Context7 examples
- [ ] Gateway builds without TypeScript errors
- [ ] Integration follows existing patterns (mem0, cloudflare, github handlers)

## Validation Commands

Execute these commands to validate the integration is complete:

```bash
# 1. Build TypeScript (should complete without errors)
cd /opt/ozean-licht-ecosystem/tools/mcp-gateway
npm run build

# 2. Type check (should pass)
npm run type-check

# 3. Start development server
npm run dev

# 4. Check service catalog (in new terminal)
curl http://localhost:8100/mcp/catalog | jq '.services.context7'

# 5. Test health check
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "context7",
      "operation": "health"
    },
    "id": 1
  }' | jq

# 6. Test library resolution
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "context7",
      "operation": "resolve-library-id",
      "args": ["react"]
    },
    "id": 2
  }' | jq

# 7. Test documentation fetching
curl -X POST http://localhost:8100/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.execute",
    "params": {
      "service": "context7",
      "operation": "get-library-docs",
      "args": ["react@18"],
      "options": {
        "topic": "hooks",
        "tokens": 3000
      }
    },
    "id": 3
  }' | jq

# 8. Check metrics for token tracking
curl http://localhost:9090/metrics | grep context7

# 9. Verify all services initialized (should show 10 server-side services)
curl http://localhost:8100/health | jq

# 10. Check service statistics
curl http://localhost:8100/mcp/catalog | jq '.aggregates'
```

## Notes

### Context7 API Details
- **Base URL**: `https://mcp.context7.com/mcp`
- **Authentication**: Optional API key via `CONTEXT7_API_KEY` header
- **Rate Limits**:
  - Free tier: ~30 requests/minute
  - With API key: Higher limits (check Context7 dashboard)
- **Supported Libraries**: 100+ popular libraries (React, Next.js, FastAPI, Django, etc.)

### API Key (Optional)
To get a Context7 API key for higher rate limits:
1. Visit https://context7.com/dashboard
2. Create an account
3. Generate an API key
4. Set `CONTEXT7_API_KEY` environment variable in MCP Gateway

### Implementation Pattern Reference
This integration follows the same pattern as:
- **Mem0 Handler** (`mem0.ts`) - HTTP-based external service
- **Cloudflare Handler** (`cloudflare.ts`) - REST API with authentication
- **N8N Handler** (`n8n.ts`) - Optional API key authentication

### Token Cost Justification
- Set to 800 tokens (high) because documentation responses can be large
- Similar to Firecrawl which also returns large text content
- Actual token usage will vary based on library and topic
- Monitor via Prometheus metrics to adjust if needed

### Future Enhancements (Post-MVP)
- Cache frequently requested documentation locally
- Add support for private repositories (requires Context7 Pro)
- Implement documentation versioning and changelog tracking
- Add support for framework-specific templates
- Integrate with project.json/package.json auto-detection
