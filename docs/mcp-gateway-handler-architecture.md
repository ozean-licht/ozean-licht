# MCP Gateway Handler Architecture - Research Report

## Overview

The MCP Gateway at `/opt/ozean-licht-ecosystem/tools/mcp-gateway/` is a comprehensive Express.js-based service gateway that manages Model Context Protocol (MCP) handlers. It follows a clean architecture pattern with clear separation of concerns:

- **Registry Pattern**: Centralized handler registration and discovery
- **Factory Pattern**: Handler initialization with configuration
- **Strategy Pattern**: Each service implements MCPHandler interface
- **Plugin Architecture**: Handlers are loosely coupled and independently deployable

---

## 1. Handler File Structure

### Directory Layout
```
tools/mcp-gateway/src/mcp/
├── handlers/           # Individual service implementations
│   ├── postgres.ts     # PostgreSQL database operations (570 LOC)
│   ├── minio.ts        # MinIO object storage (515 LOC)
│   ├── github.ts       # GitHub API integration
│   ├── mem0.ts         # Persistent memory service (400+ LOC)
│   ├── firecrawl.ts    # Web scraping/crawling
│   ├── airtable.ts     # Airtable database sync
│   ├── cloudflare.ts   # Cloudflare CDN/Workers
│   ├── n8n.ts          # N8N workflow automation
│   └── coolify.ts      # Coolify deployment
├── registry.ts         # Service registry (387 LOC)
├── initialize.ts       # Service initialization (288 LOC)
└── protocol/
    └── types.ts        # TypeScript type definitions
```

**Current Handler Count**: 10 services registered

---

## 2. Core Types & Interfaces

### MCPHandler Interface (Required Implementation)

**Location**: `src/mcp/protocol/types.ts:122-126`

```typescript
export interface MCPHandler {
  execute(params: MCPParams): Promise<MCPResult>;
  validateParams?(params: MCPParams): void;        // Optional
  getCapabilities(): MCPCapability[];
}
```

All handlers MUST implement:
1. **`execute()`** - Main execution method (required)
2. **`getCapabilities()`** - Declare supported operations (required)
3. **`validateParams()`** - Optional parameter validation (optional)

### MCPParams (Input)

**Location**: `src/mcp/protocol/types.ts:12-18`

```typescript
export interface MCPParams {
  service: string;            // e.g., "postgres", "minio"
  operation: string;          // e.g., "query", "upload"
  args?: Record<string, any>; // Operation-specific arguments
  database?: string;          // For database-specific operations
  options?: MCPOptions;       // Runtime options
}

export interface MCPOptions {
  timeout?: number;
  readOnly?: boolean;
  format?: 'json' | 'table' | 'csv';
  limit?: number;
  offset?: number;
  user_id?: string;
  agent_id?: string;
  metadata?: any;
  [key: string]: any;         // Extensible for handler-specific options
}
```

### MCPResult (Output)

**Location**: `src/mcp/protocol/types.ts:39-56`

```typescript
export interface MCPResult {
  status: 'success' | 'partial' | 'cached';
  data: any;                  // Handler-specific response data
  metadata?: MCPMetadata;     // Execution metadata
}

export interface MCPMetadata {
  executionTime: number;      // ms
  tokensUsed: number;         // For cost tracking
  cost: number;               // Estimated cost
  cached?: boolean;
  truncated?: boolean;
  rowCount?: number;
  service: string;            // Which service
  operation: string;          // Which operation
  timestamp: string;          // ISO 8601
  database?: string;
  [key: string]: any;         // Custom metadata
}
```

### MCPCapability (Operation Declaration)

**Location**: `src/mcp/protocol/types.ts:102-119`

```typescript
export interface MCPCapability {
  name: string;                      // Operation name (e.g., "upload")
  description: string;               // Human-readable description
  parameters?: MCPParameter[];       // Input parameter definitions
  examples?: string[];               // Usage examples
  requiresAuth?: boolean;            // Auth requirement flag
  tokenCost?: number;                // Estimated token cost
}

export interface MCPParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: any;
  enum?: any[];                      // For restricted values
  pattern?: string;                  // Regex pattern for validation
}
```

---

## 3. Handler Implementation Patterns

### Pattern 1: Database Handler (PostgreSQL)

**File**: `src/mcp/handlers/postgres.ts` (570 lines)

**Key Characteristics**:
- Manages multiple connection pools (one per database)
- Validates parameters before execution
- Uses `switch` statement to route operations
- Implements optional `shutdown()` for cleanup
- Returns rich metadata (execution time, token usage)
- Database allowlist: `['kids-ascension', 'ozean-licht', 'shared-users']`

**Operation Structure**:
```
execute(params) → switch on operation → specific handler → recordMetrics → MCPResult
```

**Example Operations**:
- `list-tables`: List all tables in database
- `describe-table`: Get detailed column/index info
- `query`: Execute SQL (read-only, with size limits)
- `schema-info`: Get database schema information
- `connection-stats`: Pool statistics
- `test`: Connection test

### Pattern 2: HTTP Client Handler (MinIO)

**File**: `src/mcp/handlers/minio.ts` (515 lines)

**Key Characteristics**:
- Uses factory function for flexible initialization
- Has `initialize()` hook for setup/validation
- Validates file size, type, and format before upload
- Handles base64-encoded file buffers
- Provides presigned URLs for secure access
- Token cost per operation estimated from data size

**Configuration**:
```typescript
interface MinIOHandlerOptions {
  endpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  maxFileSize: number;
  allowedContentTypes: string[];
  presignedUrlExpiry: number;
}
```

**Example Operations**:
- `upload`: Upload file (validates size, type, content)
- `list`: List files in bucket
- `getUrl`: Get presigned URL
- `delete`: Delete file
- `stat`: Get file metadata
- `health`: Service health check

### Pattern 3: API Client Handler (Mem0)

**File**: `src/mcp/handlers/mem0.ts` (400+ lines)

**Key Characteristics**:
- Uses Axios for HTTP client management
- Has request/response interceptors for logging and error handling
- Supports multiple aliases for same operation (e.g., `remember`, `add`, `store`)
- Custom error handling for specific status codes
- Semantic search capability

**Example Operations**:
- `remember` | `add` | `store`: Store a memory
- `search` | `query`: Search memories
- `get-context` | `get-memories`: Get all memories for user
- `delete` | `remove`: Delete a memory
- `list-memories`: List all memories

---

## 4. Handler Registration System

### MCPRegistry (Service Orchestration)

**File**: `src/mcp/registry.ts` (387 lines)

**Key Responsibilities**:
1. **Registration**: Store services and their handlers
2. **Discovery**: List services and their capabilities
3. **Execution**: Route requests to appropriate handler
4. **Validation**: Check operation support before execution
5. **Metadata**: Enhance results with execution info
6. **Permissions**: Check agent access (via orchestrator)
7. **Cleanup**: Graceful shutdown on exit

**Core Methods**:
```typescript
registerService(service: MCPService, handler?: MCPHandler): void
getHandler(name: string): MCPHandler | undefined
execute(params: MCPParams, agentId?: string): Promise<MCPResult>
listServices(): MCPService[]
getStatistics(): any
shutdown(): Promise<void>
```

### Service Initialization

**File**: `src/mcp/initialize.ts` (288 lines)

**Pattern**:
1. Call `registerLocalServices()` - Services that run on agent machine
2. Call `initializeServerServices()` - Loop through initializers
3. Each initializer:
   - Imports handler class/factory
   - Creates instance with config from env/options
   - Calls `initialize()` if needed (e.g., MinIO connection test)
   - Registers with registry
4. On error: Register service with `status: 'error'`

**Local Services** (no handlers): `['playwright', 'shadcn', 'magicui']`

**Server Services** (10 total):
```typescript
[
  { name: 'airtable', initializer: initializeAirtable },
  { name: 'postgres', initializer: initializePostgreSQL },
  { name: 'mem0', initializer: initializeMem0 },
  { name: 'cloudflare', initializer: initializeCloudflare },
  { name: 'github', initializer: initializeGitHub },
  { name: 'n8n', initializer: initializeN8N },
  { name: 'minio', initializer: initializeMinIO },
  { name: 'coolify', initializer: initializeCoolify },
  { name: 'firecrawl', initializer: initializeFirecrawl },
  { name: 'context7', initializer: initializeContext7 },
]
```

---

## 5. Handler Exports Patterns

### Pattern A: Class Export (Most Common)

```typescript
// In handler file
export class PostgreSQLHandler implements MCPHandler { /* ... */ }

// In initialize.ts
const { PostgreSQLHandler } = await import('./handlers/postgres');
const handler = new PostgreSQLHandler(options);
```

### Pattern B: Factory Function

```typescript
// In handler file
export function createMinIOHandler(options): MinIOHandler {
  return new MinIOHandler(options);
}

// In initialize.ts
const { createMinIOHandler } = await import('./handlers/minio');
const handler = createMinIOHandler(options);
```

### Pattern C: Direct Class Import (Simple Services)

```typescript
// In handler file
export class Mem0Handler implements MCPHandler { /* ... */ }

// In initialize.ts
const { Mem0Handler } = await import('./handlers/mem0');
const handler = new Mem0Handler(baseUrl);
```

---

## 6. Request Flow Through System

```
HTTP POST /rpc (or /execute)
  ↓
setupRouter (src/router/index.ts)
  ├─ Parse request format (JSON-RPC or command)
  ├─ Extract agent ID from X-Agent-ID header
  └─ Build MCPParams
      ↓
      registry.execute(params, agentId)
      ├─ Check service exists and is active
      ├─ Check agent permission (via orchestrator)
      ├─ If local service: return instructions
      ├─ If server service:
      │  ├─ Get handler from registry
      │  ├─ Call handler.validateParams() (if exists)
      │  ├─ Check getCapabilities() for operation support
      │  └─ Call handler.execute(params)
      │      ├─ Validate inputs
      │      ├─ Route to operation method
      │      ├─ Execute business logic
      │      ├─ Record metrics
      │      └─ Return MCPResult
      └─ Enhance metadata
          ├─ Set executionTime
          ├─ Set tokenCost from catalog
          └─ Set timestamp
          ↓
          Return MCPResponse with MCPResult
```

---

## 7. Service Configuration (mcp-catalog.json)

**File**: `config/mcp-catalog.json` (543 lines)

**Structure**:
```json
{
  "version": "1.1.0",
  "updated": "2025-11-28",
  "services": {
    "[service-name]": {
      "name": "Display Name",
      "description": "What it does",
      "location": "server" | "local",
      "version": "1.0.0",
      "status": "active",
      "capabilities": ["operation1", "operation2"],
      "tokenCost": {
        "avgTokensPerCall": 500,
        "costPerCall": 0.0015,
        "complexity": "medium"
      },
      "rateLimit": {
        "requestsPerMinute": 100,
        "burstLimit": 20
      }
    }
  }
}
```

**Usage in System**:
- Registry loads at startup
- Used to expose capabilities to agents
- Used for cost tracking and billing
- `alwaysActive: true` flag bypasses permission checks (e.g., mem0)

---

## 8. Error Handling

### Error Types

**File**: `src/utils/errors.ts`

```typescript
ValidationError      // Parameter validation failure
ServiceUnavailableError  // Service not available
TimeoutError         // Operation timeout
MCPError            // MCP-specific error with code
```

### Error Codes (MCPErrorCode)

**File**: `src/mcp/protocol/types.ts:71-90`

```typescript
PARSE_ERROR = -32700                    // JSON parsing failed
INVALID_REQUEST = -32600                // Request structure invalid
METHOD_NOT_FOUND = -32601               // Unknown method
INVALID_PARAMS = -32602                 // Parameters invalid
INTERNAL_ERROR = -32603                 // Server error

SERVICE_NOT_FOUND = -32000              // Service not registered
SERVICE_UNAVAILABLE = -32001            // Service not active
OPERATION_NOT_SUPPORTED = -32002        // Operation not in capabilities
AUTHENTICATION_REQUIRED = -32003        // Auth failed
PERMISSION_DENIED = -32004              // Agent lacks permission
RATE_LIMIT_EXCEEDED = -32005            // Rate limit hit
TIMEOUT = -32006                        // Operation timeout
RESOURCE_NOT_FOUND = -32007             // Resource not found
CONFLICT = -32008                       // Resource conflict
VALIDATION_ERROR = -32009               // Validation failed
```

---

## 9. Metrics & Monitoring

**Files**: `src/monitoring/metrics.ts`, `src/monitoring/health.ts`

**Functions**:
```typescript
recordMCPOperation(service, operation, duration, status)
recordTokenUsage(service, operation, tokensUsed)
updateConnectionPoolMetrics(database, poolStats)
```

---

## 10. Adding a New Service Handler

### Step-by-Step Checklist

1. **Create handler file**: `src/mcp/handlers/[service].ts`
   - Implement `MCPHandler` interface
   - Implement `execute(params)` method
   - Implement `getCapabilities()` method
   - Optional: implement `validateParams(params)`
   - Optional: implement `shutdown()` or `close()`

2. **Export handler**: Choose pattern
   ```typescript
   // Option A: Direct class export
   export class MyHandler implements MCPHandler { /* ... */ }

   // Option B: Factory function
   export function createMyHandler(options): MyHandler { /* ... */ }
   ```

3. **Add to service config**: `config/mcp-catalog.json`
   ```json
   "myservice": {
     "name": "My Service",
     "description": "What it does",
     "location": "server",
     "version": "1.0.0",
     "status": "active",
     "capabilities": ["operation1", "operation2"],
     "tokenCost": {
       "avgTokensPerCall": 300,
       "costPerCall": 0.0009,
       "complexity": "medium"
     },
     "rateLimit": {
       "requestsPerMinute": 100,
       "burstLimit": 20
     }
   }
   ```

4. **Add initializer**: `src/mcp/initialize.ts`
   ```typescript
   async function initializeMyService(registry: MCPRegistry): Promise<void> {
     const { MyHandler } = await import('./handlers/myservice');
     const handler = new MyHandler(/* options */);
     
     const config = mcpCatalog.services.myservice;
     registry.registerService({
       name: 'myservice',
       version: config.version,
       description: config.description,
       location: 'server',
       capabilities: config.capabilities,
       status: 'active',
     }, handler);
   }
   ```

5. **Register in service list**: `src/mcp/initialize.ts`
   ```typescript
   const services = [
     // ... existing services ...
     { name: 'myservice', initializer: initializeMyService },
   ];
   ```

### Minimal Handler Template

```typescript
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

export class MyHandler implements MCPHandler {
  constructor() {
    logger.info('MyHandler initialized');
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();
    
    try {
      let result: any;

      switch (params.operation) {
        case 'operation1':
          result = await this.operation1(params.args, params.options);
          break;
        case 'operation2':
          result = await this.operation2(params.args, params.options);
          break;
        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;
      recordMCPOperation('myservice', params.operation, duration, 'success');
      recordTokenUsage('myservice', params.operation, 300);

      return {
        status: 'success',
        data: result,
        metadata: {
          service: 'myservice',
          operation: params.operation,
          executionTime: duration,
          tokensUsed: 300,
          cost: 0.0009,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('myservice', params.operation, duration, 'error');
      throw error;
    }
  }

  public getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'operation1',
        description: 'First operation',
        parameters: [
          { name: 'param1', type: 'string', description: 'First param', required: true },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'operation2',
        description: 'Second operation',
        parameters: [],
        tokenCost: 200,
      },
    ];
  }

  private async operation1(args: any[], options?: any): Promise<any> {
    // Implementation
    return { result: 'success' };
  }

  private async operation2(args: any[], options?: any): Promise<any> {
    // Implementation
    return { result: 'success' };
  }
}
```

---

## 11. Design Patterns Used

### 1. Strategy Pattern
Each handler implements the same `MCPHandler` interface but with different execution strategies.

### 2. Registry Pattern
Centralized `MCPRegistry` manages service discovery and routing.

### 3. Factory Pattern
Initializers in `initialize.ts` create handler instances with configuration.

### 4. Template Method Pattern
`execute()` follows a consistent flow:
1. Validate params
2. Route by operation
3. Execute business logic
4. Record metrics
5. Return result with metadata

### 5. Interceptor Pattern
Axios-based handlers use request/response interceptors for logging and error handling.

### 6. Pool Pattern
Database handlers use connection pools for efficient resource management.

---

## 12. Service Summary

| Service | Type | Pattern | Status | Operations |
|---------|------|---------|--------|-----------|
| postgres | Database | Pool-based | Active | 6 |
| minio | S3-Compatible | HTTP Client | Active | 6 |
| github | API | Axios HTTP | Active | 12+ |
| mem0 | Memory | Axios HTTP | Active | 5+ |
| firecrawl | Web | Axios HTTP | Active | 3+ |
| airtable | Database | SDK | Active | 12+ |
| cloudflare | API | Axios HTTP | Active | 5+ |
| n8n | Workflow | Axios HTTP | Active | 4+ |
| coolify | Deployment | Axios HTTP | Active | 6+ |
| context7 | Documentation | API | Active | 2+ |

---

## 13. File Import Hierarchy

```
src/server.ts
├── src/mcp/initialize.ts
│   ├── src/mcp/registry.ts
│   ├── src/mcp/handlers/*.ts
│   └── config/mcp-catalog.json
├── src/router/index.ts
│   ├── src/mcp/registry.ts
│   └── src/mcp/protocol/types.ts
└── src/monitoring/
    ├── metrics.ts
    └── health.ts
```

---

## 14. Key Implementation Notes

1. **Parameter Validation**: Use `validateParams()` to validate before execution
2. **Token Cost**: Estimate from catalog or calculate from operation result size
3. **Metadata**: Always include `executionTime`, `service`, `operation`, `timestamp`
4. **Error Handling**: Catch and log errors, use appropriate MCPErrorCode
5. **Metrics**: Call `recordMCPOperation()` and `recordTokenUsage()` for every execution
6. **Shutdown**: Implement cleanup in `shutdown()` or `close()` for resources
7. **Initialization**: Use `initialize()` hook to test connections before use
8. **Capabilities**: Keep `getCapabilities()` in sync with switch cases

---

## 15. Testing Pattern

Handler testing follows this structure:
```typescript
describe('MyHandler', () => {
  let handler: MyHandler;

  beforeEach(() => {
    handler = new MyHandler();
  });

  it('should execute operation1', async () => {
    const result = await handler.execute({
      service: 'myservice',
      operation: 'operation1',
      args: ['value'],
    });
    expect(result.status).toBe('success');
  });

  it('should return capabilities', () => {
    const caps = handler.getCapabilities();
    expect(caps).toHaveLength(2);
    expect(caps[0].name).toBe('operation1');
  });

  it('should validate params', () => {
    expect(() => {
      handler.validateParams({
        service: 'myservice',
        operation: 'invalid',
      });
    }).toThrow();
  });
});
```

---

## Summary

The MCP Gateway architecture provides a clean, extensible framework for adding service handlers:

- **Plugin Architecture**: Services are loosely coupled
- **Type Safety**: Full TypeScript interface contracts
- **Consistency**: All handlers follow same patterns
- **Observability**: Metrics, logging, and error tracking built-in
- **Security**: Permission checking and validation
- **Resilience**: Graceful error handling and cleanup
- **Documentation**: Capabilities declared in code and catalog

This design makes it straightforward to add new handlers while maintaining system consistency and reliability.
