# Context Map - Ozean Licht Ecosystem (TEMPORARY RESTRUCTURE)

> **Temporary Context Map for TypeScript/Agent SDK Migration**
>
> This document tracks the migration from Python (Claude CLI subprocess) to TypeScript (Agent SDK) architecture.
> **Status**: Planning Phase - Identifying files for conversion

---

## Migration Overview

### What's Changing

**FROM (Python Architecture):**
- Python ADW modules (`adws/adw_modules/*.py`)
- Python workflow scripts (`adws/adw_*.py`)
- Claude Code CLI subprocess calls
- Separate o-commands/a-commands system
- `pip anthropic` (old library)

**TO (TypeScript Architecture):**
- TypeScript ADW modules (location TBD)
- TypeScript orchestrator integration
- Direct Agent SDK usage (already in orchestrator_3_stream)
- Unified command system
- `claude-agent-sdk` (modern SDK)

### Key Decisions

1. **Orchestrator 3 Stream is the foundation** - Already uses Agent SDK, TypeScript frontend, Python backend
2. **ADW functionality will be integrated** into orchestrator as TypeScript modules
3. **o-commands and a-commands are being removed** - Legacy system no longer needed
4. **Git worktree isolation remains** - Core ADW pattern preserved in new architecture

---

## Python Files Requiring TypeScript Conversion

### Priority 1: Core Agent Execution (CRITICAL)

#### `adws/adw_modules/agent.py` (558 lines)
**Current Functionality:**
- Executes Claude Code CLI via subprocess
- Model selection mapping (base/heavy)
- JSONL output parsing
- Retry logic with exponential backoff
- Prompt saving and logging

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/agent-executor.ts
- Use ClaudeSDKClient directly (already imported in orchestrator_service.py)
- Implement retry logic with async/await
- Model selection based on ADWState
- Stream-based output handling
```

**Key Functions to Convert:**
- `execute_template()` → `executeTemplate()`
- `prompt_claude_code()` → `executeAgentPrompt()`
- `get_model_for_slash_command()` → `getModelForCommand()`
- `parse_jsonl_output()` → Built into Agent SDK

---

#### `adws/adw_modules/orchestrator_integration.py` (474 lines)
**Current Functionality:**
- Bridge between ADW and Orchestrator
- Execute ADW workflows asynchronously
- WebSocket callbacks for status updates
- Workflow status tracking
- Log retrieval

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/workflow-manager.ts
- Already has async patterns in orchestrator_service.py
- WebSocket broadcasting already implemented
- Integrate with existing WebSocketManager
```

**Key Functions to Convert:**
- `execute_adw_workflow()` → `executeWorkflow()`
- `get_workflow_status()` → `getWorkflowStatus()`
- `list_active_workflows()` → `listActiveWorkflows()`
- `cleanup_worktree()` → `cleanupWorktree()`
- `get_adw_logs()` → `getWorkflowLogs()`

---

### Priority 2: State and Data Management

#### `adws/adw_modules/state.py`
**Current Functionality:**
- ADWState JSON persistence
- Load/save state to disk
- State validation

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/state-manager.ts
- Use PostgreSQL instead of JSON files
- New table: adw_workflows (mirrors ADWState structure)
- Integrate with existing database.py patterns
```

**Database Schema Addition:**
```sql
CREATE TABLE adw_workflows (
    adw_id VARCHAR(8) PRIMARY KEY,
    issue_number INTEGER NOT NULL,
    branch_name VARCHAR(255),
    plan_file TEXT,
    issue_class VARCHAR(50),
    worktree_path TEXT,
    backend_port INTEGER,
    frontend_port INTEGER,
    model_set VARCHAR(10) DEFAULT 'base',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

#### `adws/adw_modules/data_types.py`
**Current Functionality:**
- Pydantic models for type safety
- Request/Response types
- Enums for ModelSet, SlashCommand, RetryCode

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/types.ts
- Use TypeScript interfaces and types
- Zod for runtime validation (matches Pydantic style)
```

---

### Priority 3: Git and Workflow Operations

#### `adws/adw_modules/worktree_ops.py`
**Current Functionality:**
- Git worktree creation and management
- Port allocation (9100-9114 backend, 9200-9214 frontend)
- Worktree validation
- .ports.env file generation

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/worktree-manager.ts
- Use simple-git or exec for git operations
- Keep deterministic port allocation algorithm
- Environment variable management
```

---

#### `adws/adw_modules/git_ops.py`
**Current Functionality:**
- Git operations with cwd support
- Branch creation, checkout, push
- Commit operations
- Working directory context

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/git-operations.ts
- Use simple-git library
- Async operations with error handling
```

---

#### `adws/adw_modules/workflow_ops.py`
**Current Functionality:**
- Core workflow logic
- Plan generation
- Build implementation
- Test execution
- Review and documentation

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/workflow-operations.ts
- Integrate with Agent SDK
- Use database for state tracking
- WebSocket streaming for progress
```

---

### Priority 4: External Integrations

#### `adws/adw_modules/github.py`
**Current Functionality:**
- GitHub API operations
- Issue fetching
- PR creation and management
- Comment posting

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/github-integration.ts
- Use @octokit/rest (TypeScript GitHub API client)
- Already have GitHub tools in orchestrator system
```

---

#### `adws/adw_modules/mcp_integration.py`
**Current Functionality:**
- MCP Gateway integration
- Tool execution
- Service catalog access

**Conversion Target:**
```typescript
// Already exists in orchestrator system!
// apps/orchestrator_3_stream/backend/modules/tools/
- mcp_gateway_tools.py already implements this
- No conversion needed, just integrate
```

---

#### `adws/adw_modules/r2_uploader.py`
**Current Functionality:**
- Cloudflare R2 uploads
- Screenshot storage

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/storage-manager.ts
- Use @aws-sdk/client-s3 (R2 is S3-compatible)
- Or integrate with existing MCP Cloudflare tools
```

---

### Priority 5: Utilities

#### `adws/adw_modules/utils.py`
**Current Functionality:**
- Generate ADW IDs
- Environment variable filtering
- Path utilities

**Conversion Target:**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/utils.ts
- Simple utility functions
- Use crypto.randomBytes for ID generation
```

---

## Workflow Scripts to Convert

All 14 workflow scripts (`adw_*.py`) will become:

**Option A: TypeScript Modules**
```typescript
// apps/orchestrator_3_stream/backend/modules/adw/workflows/
- plan.ts
- build.ts
- test.ts
- review.ts
- document.ts
- ship.ts
- orchestrators/ (plan-build.ts, sdlc.ts, etc.)
```

**Option B: Orchestrator Commands/Tools**
- Integrate as tools available to orchestrator agent
- User sends message like "Create a plan for issue 123"
- Orchestrator uses ADW tools to execute workflow

**Recommended: Hybrid Approach**
- Keep modular TypeScript implementations (Option A)
- Expose as tools to orchestrator (Option B)
- Best of both worlds: reusable + accessible

---

## Orchestrator 3 Stream - Current Architecture

### Already Implemented (No Conversion Needed)

**TypeScript Frontend:**
- ✅ Vue 3 + TypeScript + Pinia
- ✅ WebSocket real-time streaming
- ✅ Event stream with filtering
- ✅ Agent list with status
- ✅ Chat interface

**Python Backend with Agent SDK:**
- ✅ FastAPI + asyncpg
- ✅ `claude-agent-sdk` integration (NOT pip anthropic!)
- ✅ WebSocket broadcasting
- ✅ Database operations
- ✅ Hook system for event tracking
- ✅ Tool integration patterns

**Database:**
- ✅ PostgreSQL with connection pooling
- ✅ Schema: orchestrator_agents, agents, prompts, agent_logs, system_logs, orchestrator_chat
- ✅ Need to ADD: adw_workflows table

---

## Migration Strategy

### Phase 1: Database Extension
1. Add `adw_workflows` table to orchestrator_db
2. Update database.py with ADW operations
3. Run migrations

### Phase 2: Core ADW Modules (TypeScript)
1. Convert state.py → state-manager.ts (use DB instead of JSON)
2. Convert agent.py → agent-executor.ts (use Agent SDK directly)
3. Convert worktree_ops.py → worktree-manager.ts
4. Convert git_ops.py → git-operations.ts

### Phase 3: Workflow Operations
1. Convert workflow_ops.py → workflow-operations.ts
2. Convert orchestrator_integration.py → workflow-manager.ts
3. Integrate with WebSocket streaming

### Phase 4: External Integrations
1. Convert github.py → github-integration.ts (use @octokit/rest)
2. Use existing MCP tools for gateway/storage
3. Convert utils.py → utils.ts

### Phase 5: Workflow Scripts
1. Convert individual workflow scripts (plan, build, test, etc.)
2. Create orchestrator workflow compositions
3. Expose as tools to orchestrator agent

### Phase 6: Frontend Integration
1. Add ADW workflow UI to orchestrator frontend
2. Workflow status panel
3. Real-time progress tracking
4. Worktree management interface

### Phase 7: Cleanup
1. Remove o-commands and a-commands directories
2. Archive Python ADW system
3. Update documentation
4. Update CONTEXT_MAP.md

---

## Files NOT Being Converted (Archive)

These files will be archived but not converted:

**ADW Tests:**
- `adws/adw_tests/*.py` - Python test files (will create new TypeScript tests)

**ADW Triggers:**
- `adws/adw_triggers/trigger_cron.py` - Polling monitor (integrate into orchestrator)
- `adws/adw_triggers/trigger_webhook.py` - Webhook server (integrate into orchestrator)

**Old Command System:**
- `.claude/o-commands/*.md` - Orchestrator commands (being removed)
- `.claude/a-commands/*.md` - Application commands (being removed)
- `.claude/commands/` - Symlink (being removed)

---

## New Architecture Structure

```
apps/orchestrator_3_stream/
├── backend/
│   ├── modules/
│   │   ├── adw/                          # NEW: ADW system in TypeScript
│   │   │   ├── agent-executor.ts         # Agent SDK execution
│   │   │   ├── workflow-manager.ts       # Workflow orchestration
│   │   │   ├── state-manager.ts          # Database-backed state
│   │   │   ├── worktree-manager.ts       # Git worktree operations
│   │   │   ├── git-operations.ts         # Git commands
│   │   │   ├── github-integration.ts     # GitHub API
│   │   │   ├── storage-manager.ts        # R2 uploads
│   │   │   ├── types.ts                  # TypeScript types
│   │   │   ├── utils.ts                  # Utilities
│   │   │   └── workflows/                # Individual workflow modules
│   │   │       ├── plan.ts
│   │   │       ├── build.ts
│   │   │       ├── test.ts
│   │   │       ├── review.ts
│   │   │       ├── document.ts
│   │   │       ├── ship.ts
│   │   │       └── orchestrators/        # Workflow compositions
│   │   │           ├── plan-build.ts
│   │   │           ├── sdlc.ts
│   │   │           └── zte.ts
│   │   │
│   │   ├── orchestrator_service.py       # EXISTING: Already uses Agent SDK
│   │   ├── database.py                   # UPDATE: Add ADW operations
│   │   ├── websocket_manager.py          # EXISTING: Already implemented
│   │   └── ... (other existing modules)
│   │
│   └── tools/
│       ├── adw_tools.py                  # NEW: ADW tools for orchestrator
│       └── ... (other existing tools)
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── adw/                      # NEW: ADW UI components
│       │   │   ├── WorkflowStatusPanel.vue
│       │   │   ├── WorktreeManager.vue
│       │   │   └── WorkflowProgress.vue
│       │   └── ... (existing components)
│       │
│       └── stores/
│           ├── adwStore.ts               # NEW: ADW state management
│           └── orchestratorStore.ts      # EXISTING: Main store
│
└── tests/
    ├── adw/                              # NEW: TypeScript ADW tests
    │   ├── agent-executor.test.ts
    │   ├── workflow-manager.test.ts
    │   └── ... (other tests)
    └── ... (existing tests)
```

---

## Python → TypeScript Conversion Map

| Python File | TypeScript Target | Priority | Notes |
|------------|------------------|----------|-------|
| `adw_modules/agent.py` | `modules/adw/agent-executor.ts` | P1 | Use Agent SDK directly |
| `adw_modules/orchestrator_integration.py` | `modules/adw/workflow-manager.ts` | P1 | Async + WebSocket |
| `adw_modules/state.py` | `modules/adw/state-manager.ts` | P2 | Use PostgreSQL |
| `adw_modules/data_types.py` | `modules/adw/types.ts` | P2 | TypeScript interfaces |
| `adw_modules/worktree_ops.py` | `modules/adw/worktree-manager.ts` | P3 | Git worktree mgmt |
| `adw_modules/git_ops.py` | `modules/adw/git-operations.ts` | P3 | Use simple-git |
| `adw_modules/workflow_ops.py` | `modules/adw/workflow-operations.ts` | P3 | Core logic |
| `adw_modules/github.py` | `modules/adw/github-integration.ts` | P4 | Use @octokit/rest |
| `adw_modules/mcp_integration.py` | ✅ Already exists | P4 | Use existing MCP tools |
| `adw_modules/r2_uploader.py` | `modules/adw/storage-manager.ts` | P4 | S3 SDK or MCP |
| `adw_modules/utils.py` | `modules/adw/utils.ts` | P5 | Simple utilities |
| `adw_plan_iso.py` | `modules/adw/workflows/plan.ts` | P5 | Plan workflow |
| `adw_build_iso.py` | `modules/adw/workflows/build.ts` | P5 | Build workflow |
| `adw_test_iso.py` | `modules/adw/workflows/test.ts` | P5 | Test workflow |
| `adw_review_iso.py` | `modules/adw/workflows/review.ts` | P5 | Review workflow |
| `adw_document_iso.py` | `modules/adw/workflows/document.ts` | P5 | Document workflow |
| `adw_ship_iso.py` | `modules/adw/workflows/ship.ts` | P5 | Ship workflow |
| `adw_sdlc_iso.py` | `modules/adw/workflows/orchestrators/sdlc.ts` | P5 | SDLC orchestrator |
| `adw_sdlc_zte_iso.py` | `modules/adw/workflows/orchestrators/zte.ts` | P5 | Zero-touch exec |

---

## Key Dependencies to Add

**Backend (TypeScript/Node.js):**
```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.27.0",     // Agent SDK (TypeScript native)
    "@octokit/rest": "^20.0.0",         // GitHub API client
    "@aws-sdk/client-s3": "^3.500.0",   // R2/S3 uploads (R2 is S3-compatible)
    "simple-git": "^3.21.0",            // Git operations
    "zod": "^3.22.0",                   // Runtime validation (Pydantic equivalent)
    "fastify": "^4.25.0",               // HTTP server (or Express)
    "@fastify/websocket": "^10.0.0",    // WebSocket support
    "@fastify/cors": "^9.0.0",          // CORS support
    "prisma": "^5.8.0",                 // Database ORM
    "@prisma/client": "^5.8.0",         // Prisma client
    "ws": "^8.16.0",                    // WebSocket library
    "dotenv": "^16.3.1",                // Environment variables
    "pino": "^8.17.0",                  // Fast JSON logger (replaces Rich)
    "pino-pretty": "^10.3.0"            // Pretty console output
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/ws": "^8.5.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",                    // TypeScript executor
    "vitest": "^1.1.0",                 // Testing framework
    "@vitest/ui": "^1.1.0"              // Test UI
  }
}
```

---

## Architecture Decisions ✅ CONFIRMED

1. **Backend Language:** ✅ **FULL TYPESCRIPT**
   - Convert entire backend to TypeScript/Node.js
   - No Python backend - unified TypeScript codebase
   - Use Fastify or Express for HTTP server
   - Agent SDK: `@anthropic-ai/sdk` (TypeScript native)

2. **State Storage:** ✅ **POSTGRESQL**
   - Database-backed state management
   - Add `adw_workflows` table to orchestrator_db
   - Use Prisma or TypeORM for database access
   - Consistent with orchestrator pattern

3. **Workflow Execution:** ✅ **BOTH**
   - Orchestrator tools for user-initiated workflows (via chat)
   - Background webhooks for automated GitHub triggers
   - RESTful API endpoints for both patterns

4. **Command System:**
   - Remove all o-commands and a-commands during migration
   - Archive Python ADW system when complete

---

## Success Criteria

Migration is complete when:

- ✅ All ADW core modules converted to TypeScript
- ✅ Agent SDK used instead of Claude CLI subprocess
- ✅ ADW workflows accessible via orchestrator
- ✅ Database schema includes adw_workflows table
- ✅ Frontend UI for workflow management
- ✅ WebSocket streaming for workflow progress
- ✅ Tests passing for new TypeScript modules
- ✅ Documentation updated
- ✅ o-commands and a-commands removed
- ✅ Python ADW system archived

---

**Last Updated**: 2025-11-09
**Status**: Planning Phase
**Next Step**: Review and approve migration strategy
