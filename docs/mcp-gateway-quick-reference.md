# MCP Gateway - Quick Reference

## Handler Structure at a Glance

```
File: src/mcp/handlers/[service].ts
├─ Imports:
│  ├─ MCPHandler, MCPParams, MCPResult, MCPCapability (protocol/types)
│  ├─ ValidationError, TimeoutError (utils/errors)
│  ├─ logger (utils/logger)
│  └─ recordMCPOperation, recordTokenUsage (monitoring/metrics)
│
├─ Interface/Options definition
│  └─ MyServiceOptions { ... }
│
├─ Class: MyHandler implements MCPHandler
│  ├─ Properties (client, options, internal state)
│  ├─ Constructor(options)
│  ├─ async initialize?() [optional setup hook]
│  │
│  ├─ async execute(params: MCPParams): Promise<MCPResult>
│  │  ├─ const startTime = Date.now()
│  │  ├─ switch(params.operation)
│  │  │  ├─ case 'op1': result = await this.op1(params.args)
│  │  │  ├─ case 'op2': result = await this.op2(params.args)
│  │  │  └─ default: throw new ValidationError()
│  │  ├─ recordMCPOperation(service, operation, duration, 'success')
│  │  └─ return { status: 'success', data, metadata: { ... } }
│  │
│  ├─ validateParams?(params): void [optional]
│  │  └─ throw ValidationError if invalid
│  │
│  ├─ getCapabilities(): MCPCapability[]
│  │  └─ return [
│  │       {
│  │         name: 'op1',
│  │         description: 'Does op1',
│  │         parameters: [{ name, type, description, required }],
│  │         requiresAuth: true,
│  │         tokenCost: 300,
│  │       },
│  │       ...
│  │     ]
│  │
│  ├─ async shutdown?() [optional cleanup]
│  │
│  └─ private async op1/op2(...) [operation handlers]
│
└─ Export: export class MyHandler { ... }
   OR: export function createMyHandler(options) { ... }
```

## Registration Flow

1. **Handler Created**
   ```typescript
   export class MyHandler implements MCPHandler { ... }
   ```

2. **Initializer Written** (`src/mcp/initialize.ts`)
   ```typescript
   async function initializeMyService(registry: MCPRegistry) {
     const { MyHandler } = await import('./handlers/myservice');
     const handler = new MyHandler(options);
     
     registry.registerService({
       name: 'myservice',
       version: '1.0.0',
       description: 'My service',
       location: 'server',
       capabilities: ['op1', 'op2'],
       status: 'active',
     }, handler);
   }
   ```

3. **Added to Service List** (`src/mcp/initialize.ts`)
   ```typescript
   const services = [
     // ...
     { name: 'myservice', initializer: initializeMyService },
   ];
   ```

4. **Config Added** (`config/mcp-catalog.json`)
   ```json
   "myservice": {
     "name": "My Service",
     "capabilities": ["op1", "op2"],
     "tokenCost": { "avgTokensPerCall": 300, "costPerCall": 0.0009 }
   }
   ```

## Execute Method Template

```typescript
public async execute(params: MCPParams): Promise<MCPResult> {
  const startTime = Date.now();
  
  try {
    let result: any;

    switch (params.operation) {
      case 'operation1':
        if (!params.args || params.args.length === 0) {
          throw new ValidationError('Argument required');
        }
        result = await this.operation1(params.args[0], params.options);
        break;

      case 'operation2':
        result = await this.operation2(params.options);
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
    logger.error(`Operation failed`, { error });
    throw error;
  }
}
```

## GetCapabilities Template

```typescript
public getCapabilities(): MCPCapability[] {
  return [
    {
      name: 'operation1',
      description: 'What it does',
      parameters: [
        {
          name: 'param1',
          type: 'string',
          description: 'First param',
          required: true,
        },
        {
          name: 'param2',
          type: 'number',
          description: 'Second param',
          required: false,
          default: 100,
        },
      ],
      requiresAuth: true,
      tokenCost: 300,
    },
    {
      name: 'operation2',
      description: 'Another operation',
      parameters: [],
      tokenCost: 200,
    },
  ];
}
```

## Request/Response Cycle

```
POST /rpc or /execute
  ↓
{ service: 'myservice', operation: 'op1', args: [...], options: {...} }
  ↓
registry.execute(params)
  ├─ handler.validateParams(params) [if exists]
  ├─ handler.getCapabilities() [to check operation exists]
  └─ handler.execute(params)
      ├─ Validate inputs
      ├─ Route to operation
      ├─ Execute logic
      ├─ Return MCPResult
      └─ Registry enhances with metadata
          ↓
MCPResponse { status, data, metadata }
```

## Key Interfaces

### MCPParams
```typescript
{
  service: string;        // 'myservice'
  operation: string;      // 'operation1'
  args?: Record<string, any>;     // { "sql": "SELECT * FROM..." }
  database?: string;      // 'kids-ascension'
  options?: MCPOptions;   // { timeout: 5000, limit: 100 }
}
```

### MCPResult
```typescript
{
  status: 'success' | 'partial' | 'cached',
  data: any,              // Handler-specific result
  metadata: {
    service: string,
    operation: string,
    executionTime: number,
    tokensUsed: number,
    cost: number,
    timestamp: string,
    // ... custom metadata
  }
}
```

### MCPCapability
```typescript
{
  name: string,                   // 'operation1'
  description: string,            // 'Does operation 1'
  parameters: MCPParameter[],     // Input schema
  examples?: string[],            // Usage examples
  requiresAuth?: boolean,         // Default: false
  tokenCost?: number,             // Estimated cost
}
```

## Common Patterns

### Pattern: Database Handler
```typescript
- Initialize connection pools in constructor
- Check allowedDatabases list
- Use switch on operation to route
- Implement shutdown() to close pools
- Example: PostgreSQLHandler
```

### Pattern: HTTP Client Handler
```typescript
- Use Axios for HTTP requests
- Setup request/response interceptors
- Support operation aliases (e.g., 'remember' = 'add')
- Custom error handling for HTTP status codes
- Example: Mem0Handler, FirecrawlHandler
```

### Pattern: SDK Wrapper Handler
```typescript
- Wrap third-party SDK (MinIO, Airtable, etc.)
- Initialize SDK client in constructor
- Use factory function for flexible creation
- Call initialize() to test connection
- Example: MinIOHandler, AirtableHandler
```

## Error Codes

Use appropriate MCPErrorCode for errors:

| Code | Error | Trigger |
|------|-------|---------|
| -32602 | INVALID_PARAMS | Parameter validation fails |
| -32603 | INTERNAL_ERROR | Unexpected error in handler |
| -32000 | SERVICE_NOT_FOUND | Service not registered |
| -32001 | SERVICE_UNAVAILABLE | Service status not 'active' |
| -32002 | OPERATION_NOT_SUPPORTED | Operation not in capabilities |
| -32004 | PERMISSION_DENIED | Agent lacks permission |
| -32006 | TIMEOUT | Operation timeout |
| -32009 | VALIDATION_ERROR | Custom validation failure |

## Exports

Choose ONE pattern:

**Pattern A: Direct Class**
```typescript
export class MyHandler implements MCPHandler { ... }
```

**Pattern B: Factory Function**
```typescript
export function createMyHandler(options): MyHandler {
  return new MyHandler(options);
}
```

## Config Entry (mcp-catalog.json)

```json
"myservice": {
  "name": "My Service",
  "description": "What it does",
  "location": "server",
  "version": "1.0.0",
  "status": "active",
  "capabilities": ["op1", "op2"],
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

## Current Services

| Service | Handlers | Operations |
|---------|----------|-----------|
| postgres | Connection pools | 6: list-tables, describe-table, query, schema-info, connection-stats, test |
| minio | MinIO SDK | 6: upload, list, getUrl, delete, stat, health |
| github | Octokit | 12+: PRs, issues, workflows |
| mem0 | Axios HTTP | 5+: remember, search, get-context, delete |
| firecrawl | Axios HTTP | 3+: scrape, map, extract |
| airtable | Airtable SDK | 12+: tables, records, CRUD |
| cloudflare | Axios HTTP | 5+: DNS, stream, workers, cache |
| n8n | Axios HTTP | 4+: workflows, execution |
| coolify | Axios HTTP | 6+: deployment, logs |
| context7 | API | 2+: resolve-library, get-docs |

## Files to Modify

**To add a new service:**
1. Create: `src/mcp/handlers/[service].ts`
2. Edit: `config/mcp-catalog.json` (add service entry)
3. Edit: `src/mcp/initialize.ts` (add initializer + entry)

**Total edits: 3 files**

---

Full documentation: `/docs/mcp-gateway-handler-architecture.md`
