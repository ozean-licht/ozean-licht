# MCP Gateway Architecture

## Overview

The MCP (Model Context Protocol) Gateway serves as a unified interface for autonomous agents to access various tools and services through standardized slash commands. It acts as a bridge between agent requests and backend services, handling protocol translation, authentication, and resource management.

## Architecture Components

### 1. Core Gateway Server

The gateway is built on Node.js with Express, providing:
- **Request Router**: Maps slash commands to appropriate MCP handlers
- **Protocol Handler**: Implements JSON-RPC 2.0 for MCP communication
- **Service Registry**: Maintains active MCP services and their capabilities
- **Authentication Layer**: Validates agent requests via JWT tokens

### 2. MCP Services

#### Server-Side MCPs (Always Loaded)
These run on the server for performance and resource efficiency:

1. **PostgreSQL MCP**
   - Maintains persistent connections to both databases
   - Provides schema introspection and query execution
   - Implements connection pooling for efficiency

2. **Mem0 MCP**
   - Interfaces with the Mem0 API at port 8090
   - Handles memory storage and retrieval
   - Supports vector-based semantic search

3. **Cloudflare MCP**
   - Manages DNS, Stream, and Workers
   - Handles video upload and management
   - Provides CDN configuration

4. **GitHub MCP**
   - Repository management
   - PR and issue operations
   - Workflow triggers

5. **N8N MCP**
   - Workflow execution
   - Webhook management
   - Execution history

#### Local MCPs (Agent-Side)
These are executed locally on the agent's machine:
- Playwright (browser automation)
- ShadCN (UI components)
- MagicUI (enhanced components)

## Data Flow

```
1. Agent sends slash command: /mcp-postgres kids-ascension-db list tables
2. Gateway receives and parses command
3. Router identifies target MCP (postgres)
4. Authentication middleware validates agent
5. MCP handler processes request:
   - Establishes database connection
   - Executes operation
   - Formats response
6. Gateway returns formatted response to agent
```

## Protocol Specification

### Request Format
```json
{
  "jsonrpc": "2.0",
  "method": "mcp.execute",
  "params": {
    "service": "postgres",
    "database": "kids-ascension-db",
    "operation": "list-tables",
    "args": {}
  },
  "id": "unique-request-id"
}
```

### Response Format
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "data": {
      "tables": ["users", "videos", "courses"]
    },
    "metadata": {
      "executionTime": 45,
      "tokensUsed": 150
    }
  },
  "id": "unique-request-id"
}
```

## Service Registry

Each MCP service registers its capabilities:

```typescript
interface MCPService {
  name: string;
  version: string;
  location: 'server' | 'local';
  capabilities: string[];
  commands: CommandDefinition[];
  tokenCost: TokenCostModel;
}
```

## Authentication & Authorization

### Agent Authentication
- Agents receive JWT tokens upon initialization
- Tokens contain agent ID, permissions, and rate limits
- Tokens expire after 24 hours (renewable)

### Rate Limiting
- Default: 100 requests/minute per agent
- Configurable per service and operation
- Implements token bucket algorithm

## Connection Management

### Database Connections
- Connection pools: 10 min, 50 max per database
- Idle timeout: 10 seconds
- Connection retry: 3 attempts with exponential backoff

### HTTP Clients
- Keep-alive connections for Mem0, N8N
- Request timeout: 30 seconds
- Circuit breaker pattern for resilience

## Error Handling

### Error Categories
1. **Protocol Errors**: Invalid JSON-RPC format
2. **Authentication Errors**: Invalid or expired tokens
3. **Service Errors**: MCP service failures
4. **Resource Errors**: Database unavailable, API down
5. **Rate Limit Errors**: Quota exceeded

### Error Response
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": {
      "service": "postgres",
      "details": "Connection pool exhausted"
    }
  },
  "id": "request-id"
}
```

## Monitoring & Observability

### Metrics
- Request rate by service and operation
- Response time percentiles (P50, P95, P99)
- Error rate by category
- Active connections
- Token usage

### Logging
- Structured logs via Winston
- Log levels: ERROR, WARN, INFO, DEBUG
- Correlation IDs for request tracing

### Health Checks
- `/health` - Basic liveness check
- `/ready` - Readiness with dependency checks
- `/metrics` - Prometheus-compatible metrics

## Deployment Configuration

### Environment Variables
```bash
# Server Configuration
NODE_ENV=production
PORT=8100

# Database Connections
POSTGRES_KA_URL=postgresql://postgres:password@localhost:5432/kids-ascension
POSTGRES_OL_URL=postgresql://postgres:password@localhost:5432/ozean-licht

# Service URLs
MEM0_API_URL=http://mem0:8090
N8N_API_URL=http://n8n:5678

# External APIs
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=xxx
GITHUB_APP_ID=xxx
GITHUB_PRIVATE_KEY=xxx

# Security
JWT_SECRET=xxx
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

### Docker Configuration
- Base image: node:20-alpine
- Multi-stage build for optimization
- Non-root user execution
- Health check every 30 seconds

## Scaling Strategy

### Horizontal Scaling
- Stateless design enables multiple instances
- Load balancing via Traefik
- Shared Redis for rate limiting state

### Vertical Scaling
- Initial: 1 CPU, 1GB RAM
- Auto-scale triggers:
  - CPU > 80% for 5 minutes
  - Memory > 800MB
  - Response time > 1000ms P95

## Security Considerations

### Network Security
- Internal Docker network only
- No direct external access
- TLS termination at Traefik

### Application Security
- Input validation on all parameters
- SQL injection prevention via parameterized queries
- Command injection prevention
- CORS configuration for web access

### Secrets Management
- Environment variables for sensitive data
- Future: HashiCorp Vault integration
- Regular token rotation

## Future Enhancements

1. **GraphQL Interface**: Unified query language
2. **WebSocket Support**: Real-time updates
3. **Caching Layer**: Redis-based response cache
4. **Plugin System**: Dynamic MCP loading
5. **Multi-tenancy**: Workspace isolation