# MCP Gateway - Documentation Index

This folder contains comprehensive documentation about the MCP Gateway handler architecture at `tools/mcp-gateway/`.

## Documents

### 1. mcp-gateway-handler-architecture.md (720 lines, 21 KB)
**Comprehensive Technical Reference**

The complete guide to understanding MCP Gateway architecture.

**Sections**:
1. Overview - Architecture and patterns
2. Handler File Structure - Directory layout
3. Core Types & Interfaces - MCPHandler, MCPParams, MCPResult, MCPCapability
4. Handler Implementation Patterns - 3 detailed examples:
   - Pattern 1: Database Handler (PostgreSQL) - 570 LOC
   - Pattern 2: HTTP Client Handler (MinIO) - 515 LOC
   - Pattern 3: API Client Handler (Mem0) - 400+ LOC
5. Handler Registration System
   - MCPRegistry (Service Orchestration)
   - Service Initialization
6. Handler Exports Patterns (3 variations)
7. Request Flow Through System (with diagram)
8. Service Configuration (mcp-catalog.json)
9. Error Handling (types and codes)
10. Metrics & Monitoring
11. Adding a New Service Handler (step-by-step checklist)
12. Design Patterns Used (6 patterns)
13. Service Summary (table of all 10 services)
14. File Import Hierarchy
15. Key Implementation Notes
16. Testing Pattern

**Use this for**:
- Understanding complete architecture
- Deep diving into specific handler patterns
- Seeing full code examples
- Learning design patterns used
- Reference implementation details

---

### 2. mcp-gateway-quick-reference.md (9.2 KB)
**Quick Lookup Guide**

Condensed reference for developers implementing handlers.

**Sections**:
1. Handler Structure at a Glance (ASCII diagram)
2. Registration Flow (4 steps)
3. Execute Method Template (ready to copy)
4. GetCapabilities Template (ready to copy)
5. Request/Response Cycle (diagram)
6. Key Interfaces (MCPParams, MCPResult, MCPCapability)
7. Common Patterns (3 handler types)
8. Error Codes (table)
9. Exports (3 patterns)
10. Config Entry (JSON template)
11. Current Services (table of all 10)
12. Files to Modify (3-file checklist)

**Use this for**:
- Quick lookups while coding
- Finding templates to copy
- Understanding patterns at a glance
- Remembering which files to modify
- Seeing current services available

---

### 3. MCP_GATEWAY_INDEX.md (This File)
**Navigation and Overview**

---

## Quick Start

### To Understand the System
Start here → Read `mcp-gateway-handler-architecture.md` sections 1-4

### To Implement a Handler
1. Read `mcp-gateway-quick-reference.md` - Handler Structure
2. Read `mcp-gateway-handler-architecture.md` - Section 10 (Adding New Service)
3. Use templates from `mcp-gateway-quick-reference.md`
4. Reference existing handlers in `tools/mcp-gateway/src/mcp/handlers/`

### To Debug a Request
1. Review `mcp-gateway-handler-architecture.md` - Section 7 (Request Flow)
2. Check handler's `execute()` method
3. Verify `getCapabilities()` lists the operation
4. Check error codes in Section 8

### To Add a New Operation
1. Add case to handler's `execute()` switch statement
2. Add capability to `getCapabilities()` return array
3. Update `config/mcp-catalog.json` if needed
4. Test with registry

---

## Key Files in Tools/MCP-Gateway

```
tools/mcp-gateway/
├── src/
│   ├── mcp/
│   │   ├── handlers/           [10 service handlers]
│   │   │   ├── postgres.ts    [570 LOC - Database Pool Pattern]
│   │   │   ├── minio.ts       [515 LOC - SDK Wrapper Pattern]
│   │   │   ├── mem0.ts        [400+ LOC - Axios HTTP Pattern]
│   │   │   ├── github.ts
│   │   │   ├── firecrawl.ts
│   │   │   ├── airtable.ts
│   │   │   ├── cloudflare.ts
│   │   │   ├── n8n.ts
│   │   ├── coolify.ts
│   │   ├── registry.ts        [387 LOC - Service Registry]
│   │   ├── initialize.ts      [288 LOC - Service Initialization]
│   │   └── protocol/types.ts  [Type Definitions]
│   ├── router/index.ts        [Request Routing]
│   └── monitoring/
│       ├── metrics.ts
│       └── health.ts
├── config/
│   └── mcp-catalog.json       [Service Metadata - 543 LOC]
└── README.md
```

---

## Core Concepts

### MCPHandler Interface
Every handler must implement:
```typescript
execute(params: MCPParams): Promise<MCPResult>
getCapabilities(): MCPCapability[]
validateParams?(params: MCPParams): void          // Optional
shutdown?(): Promise<void>                        // Optional
```

### Handler Registration
1. Handler class created
2. Initializer function created
3. Service added to mcp-catalog.json
4. Initializer added to registry initialization list
5. Handler registered with registry

### Request Flow
```
HTTP POST /rpc
  → Router parses params
  → Registry.execute()
  → Handler.execute()
  → Return MCPResult with metadata
```

### Key Patterns
- **Strategy**: Each handler implements MCPHandler interface
- **Registry**: Centralized MCPRegistry manages all handlers
- **Factory**: Handler initialization with configuration
- **Template Method**: Consistent execute() flow
- **Interceptor**: Axios request/response logging
- **Pool**: Connection pooling for databases

---

## Handler Implementation Steps

1. Create `src/mcp/handlers/[service].ts`
   - Implement MCPHandler interface
   - Implement execute() method
   - Implement getCapabilities()
   - Optional: validateParams(), shutdown()

2. Update `config/mcp-catalog.json`
   - Add service entry with capabilities and token costs

3. Update `src/mcp/initialize.ts`
   - Add initializer function
   - Add to services array

4. Test
   - Verify capabilities are correct
   - Test each operation
   - Check error handling

---

## Common Questions

**Q: How do I add a new operation?**
A: Add case to handler's switch statement, add to getCapabilities(), update catalog if needed.

**Q: What's the difference between the 3 handler patterns?**
A: Database (connection pools), HTTP Client (Axios + interceptors), SDK Wrapper (third-party SDK).

**Q: How are permissions checked?**
A: Registry queries orchestrator for agent permissions before execution.

**Q: How are tokens tracked?**
A: recordTokenUsage() called after each operation, cost estimated from catalog.

**Q: What if a handler fails to initialize?**
A: Service registered with status: 'error', requests will get SERVICE_UNAVAILABLE response.

**Q: Can I have multiple handlers for one service?**
A: No, each service has one handler. Multiple operations handled by one handler via switch statement.

---

## File Statistics

| File | Lines | Purpose |
|------|-------|---------|
| postgres.ts | 570 | Database operations handler |
| minio.ts | 515 | Object storage handler |
| mem0.ts | 400+ | Persistent memory handler |
| registry.ts | 387 | Service registry/orchestration |
| mcp-catalog.json | 543 | Service metadata and configuration |
| initialize.ts | 288 | Service initialization orchestrator |
| github.ts | ~300+ | GitHub API handler |
| airtable.ts | ~500+ | Airtable database handler |

**Total**: 10 service handlers, ~3000+ LOC across handlers

---

## Services (10 Total)

| Service | Type | Pattern | Operations |
|---------|------|---------|-----------|
| postgres | Database | Pool | 6 |
| minio | Storage | SDK | 6 |
| github | API | Axios | 12+ |
| mem0 | Memory | Axios | 5+ |
| firecrawl | Web | Axios | 3+ |
| airtable | Database | SDK | 12+ |
| cloudflare | API | Axios | 5+ |
| n8n | Workflow | Axios | 4+ |
| coolify | Deploy | Axios | 6+ |
| context7 | Docs | API | 2+ |

**Local Services** (3): playwright, shadcn, magicui (no handlers)

---

## Error Codes

13 error codes defined (JSON-RPC + MCP-specific):

| Range | Purpose |
|-------|---------|
| -32700 to -32603 | JSON-RPC standard errors |
| -32000 to -32009 | MCP-specific errors |

Common:
- `-32602` INVALID_PARAMS
- `-32000` SERVICE_NOT_FOUND
- `-32002` OPERATION_NOT_SUPPORTED
- `-32004` PERMISSION_DENIED
- `-32009` VALIDATION_ERROR

---

## How to Use These Documents

**For Developers Implementing Handlers**:
1. Start with quick-reference.md
2. Look at similar existing handler
3. Reference architecture.md for details
4. Use templates from quick-reference.md

**For Code Reviewers**:
1. Check against checklist in architecture.md Section 10
2. Verify getCapabilities() matches switch cases
3. Check metrics recording
4. Verify error handling

**For Learning the System**:
1. Read overview in architecture.md
2. Study a simple handler (Mem0 or Firecrawl)
3. Study a complex handler (PostgreSQL or Airtable)
4. Trace a request through request-flow diagram

---

## Additional Resources

- Full code: `/opt/ozean-licht-ecosystem/tools/mcp-gateway/`
- Registry: `tools/mcp-gateway/src/mcp/registry.ts`
- Initialization: `tools/mcp-gateway/src/mcp/initialize.ts`
- Types: `tools/mcp-gateway/src/mcp/protocol/types.ts`
- Config: `tools/mcp-gateway/config/mcp-catalog.json`

---

**Last Updated**: 2025-12-04
**Research Scope**: Handler architecture, registration, and implementation patterns
**Status**: Complete - Ready for implementation
