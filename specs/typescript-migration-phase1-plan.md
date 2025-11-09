# TypeScript Migration - Phase 1 Implementation Plan

> **Comprehensive plan for migrating Orchestrator + ADW to full TypeScript**
>
> **Target**: New TypeScript orchestrator with integrated ADW workflows
> **Timeline**: Phase 1 (Foundation) - 2-3 weeks
> **Status**: Planning

---

## Executive Summary

### What We're Building

A unified TypeScript orchestrator application that:
- Runs multi-agent orchestration (existing orchestrator_3_stream functionality)
- Executes ADW workflows (migrated from Python adws/ system)
- Uses Agent SDK natively (no subprocess calls)
- Stores state in PostgreSQL (no JSON files)
- Provides both HTTP API and WebSocket streaming
- Supports both manual (chat) and automated (webhook) workflows

### Key Architecture Decisions

1. ✅ **Full TypeScript** - No Python backend
2. ✅ **PostgreSQL** - Database-backed state
3. ✅ **Both execution models** - Tools + webhooks
4. ✅ **Fastify** - HTTP server with WebSocket support
5. ✅ **Prisma** - Type-safe database ORM
6. ✅ **Pino** - Fast structured logging

---

## Phase 1: Database Extension + Core Foundation

**Goal**: Set up TypeScript backend foundation and database schema

**Duration**: Week 1-2

**Deliverables**:
1. Database schema with ADW tables
2. TypeScript backend scaffolding
3. Database client with type-safe queries
4. Basic HTTP server with health checks
5. Environment configuration

---

## Step 1: Database Schema Design

### New Tables to Add

#### 1. `adw_workflows` - Core ADW workflow state

```sql
CREATE TABLE adw_workflows (
    -- Identity
    adw_id VARCHAR(8) PRIMARY KEY,
    issue_number INTEGER NOT NULL,

    -- Workflow metadata
    workflow_type VARCHAR(50) NOT NULL,  -- 'plan', 'build', 'test', 'sdlc', etc.
    phase VARCHAR(50) NOT NULL DEFAULT 'initialized',  -- 'planned', 'built', 'tested', etc.
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- 'active', 'completed', 'failed', 'cancelled'

    -- GitHub integration
    branch_name VARCHAR(255),
    pr_number INTEGER,
    issue_title TEXT,
    issue_body TEXT,
    issue_class VARCHAR(50),  -- 'feature', 'bug', 'chore'

    -- Git worktree
    worktree_path TEXT,
    worktree_exists BOOLEAN DEFAULT true,

    -- Port allocation
    backend_port INTEGER,
    frontend_port INTEGER,

    -- Model configuration
    model_set VARCHAR(10) DEFAULT 'base',  -- 'base' or 'heavy'

    -- Files and outputs
    plan_file TEXT,

    -- Tracking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,

    -- Indexes
    INDEX idx_issue_number (issue_number),
    INDEX idx_status (status),
    INDEX idx_workflow_type (workflow_type),
    INDEX idx_created_at (created_at)
);
```

#### 2. `adw_workflow_events` - Event log for workflow progress

```sql
CREATE TABLE adw_workflow_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adw_id VARCHAR(8) NOT NULL REFERENCES adw_workflows(adw_id) ON DELETE CASCADE,

    -- Event details
    event_type VARCHAR(50) NOT NULL,  -- 'phase_started', 'phase_completed', 'error', 'tool_use', etc.
    event_subtype VARCHAR(50),
    phase VARCHAR(50),  -- 'plan', 'build', 'test', 'review', 'document', 'ship'

    -- Event data
    message TEXT,
    data JSONB,

    -- Tracking
    created_at TIMESTAMP DEFAULT NOW(),

    -- Indexes
    INDEX idx_adw_id (adw_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);
```

#### 3. `adw_agent_outputs` - Store agent execution outputs

```sql
CREATE TABLE adw_agent_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adw_id VARCHAR(8) NOT NULL REFERENCES adw_workflows(adw_id) ON DELETE CASCADE,

    -- Agent details
    agent_name VARCHAR(100) NOT NULL,  -- 'planner', 'implementor', 'tester', etc.
    phase VARCHAR(50) NOT NULL,

    -- Output data
    session_id TEXT,
    model VARCHAR(50),
    output_text TEXT,
    output_jsonl JSONB,  -- Structured output data

    -- Metadata
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Tracking
    created_at TIMESTAMP DEFAULT NOW(),

    -- Indexes
    INDEX idx_adw_id (adw_id),
    INDEX idx_agent_name (agent_name),
    INDEX idx_phase (phase)
);
```

#### 4. Extend existing `orchestrator_agents` table

```sql
-- Add ADW integration fields to orchestrator_agents
ALTER TABLE orchestrator_agents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Metadata will store:
-- {
--   "system_message_info": {...},
--   "slash_commands": [...],
--   "agent_templates": [...],
--   "adw_enabled": true
-- }
```

### Migration File

**File**: `apps/orchestrator_db/migrations/005_add_adw_tables.sql`

```sql
-- Migration: Add ADW workflow tables
-- Created: 2025-11-09
-- Description: Add tables for ADW workflow state, events, and agent outputs

BEGIN;

-- 1. ADW Workflows table
CREATE TABLE IF NOT EXISTS adw_workflows (
    adw_id VARCHAR(8) PRIMARY KEY,
    issue_number INTEGER NOT NULL,
    workflow_type VARCHAR(50) NOT NULL,
    phase VARCHAR(50) NOT NULL DEFAULT 'initialized',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    branch_name VARCHAR(255),
    pr_number INTEGER,
    issue_title TEXT,
    issue_body TEXT,
    issue_class VARCHAR(50),
    worktree_path TEXT,
    worktree_exists BOOLEAN DEFAULT true,
    backend_port INTEGER,
    frontend_port INTEGER,
    model_set VARCHAR(10) DEFAULT 'base',
    plan_file TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_adw_workflows_issue_number ON adw_workflows(issue_number);
CREATE INDEX IF NOT EXISTS idx_adw_workflows_status ON adw_workflows(status);
CREATE INDEX IF NOT EXISTS idx_adw_workflows_workflow_type ON adw_workflows(workflow_type);
CREATE INDEX IF NOT EXISTS idx_adw_workflows_created_at ON adw_workflows(created_at);

-- 2. ADW Workflow Events table
CREATE TABLE IF NOT EXISTS adw_workflow_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adw_id VARCHAR(8) NOT NULL REFERENCES adw_workflows(adw_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_subtype VARCHAR(50),
    phase VARCHAR(50),
    message TEXT,
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adw_workflow_events_adw_id ON adw_workflow_events(adw_id);
CREATE INDEX IF NOT EXISTS idx_adw_workflow_events_event_type ON adw_workflow_events(event_type);
CREATE INDEX IF NOT EXISTS idx_adw_workflow_events_created_at ON adw_workflow_events(created_at);

-- 3. ADW Agent Outputs table
CREATE TABLE IF NOT EXISTS adw_agent_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adw_id VARCHAR(8) NOT NULL REFERENCES adw_workflows(adw_id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    phase VARCHAR(50) NOT NULL,
    session_id TEXT,
    model VARCHAR(50),
    output_text TEXT,
    output_jsonl JSONB,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adw_agent_outputs_adw_id ON adw_agent_outputs(adw_id);
CREATE INDEX IF NOT EXISTS idx_adw_agent_outputs_agent_name ON adw_agent_outputs(agent_name);
CREATE INDEX IF NOT EXISTS idx_adw_agent_outputs_phase ON adw_agent_outputs(phase);

-- 4. Extend orchestrator_agents table
ALTER TABLE orchestrator_agents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

COMMIT;
```

---

## Step 2: TypeScript Backend Scaffolding

### Project Structure

```
apps/orchestrator_ts/
├── package.json
├── tsconfig.json
├── .env
├── .env.sample
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── index.ts                    # Application entry point
│   ├── server.ts                   # Fastify server setup
│   ├── config/
│   │   ├── env.ts                  # Environment validation (Zod)
│   │   └── logger.ts               # Pino logger configuration
│   ├── database/
│   │   ├── client.ts               # Prisma client singleton
│   │   └── queries/                # Database query functions
│   │       ├── orchestrator.ts
│   │       └── adw.ts
│   ├── modules/
│   │   ├── orchestrator/           # Orchestrator service
│   │   │   ├── service.ts          # Main orchestrator logic
│   │   │   ├── hooks.ts            # Agent SDK hooks
│   │   │   └── types.ts            # TypeScript types
│   │   ├── adw/                    # ADW system
│   │   │   ├── agent-executor.ts   # Agent SDK execution
│   │   │   ├── workflow-manager.ts # Workflow orchestration
│   │   │   ├── state-manager.ts    # Database state operations
│   │   │   ├── worktree-manager.ts # Git worktree operations
│   │   │   ├── git-operations.ts   # Git commands
│   │   │   ├── github-integration.ts # GitHub API
│   │   │   ├── types.ts            # ADW types
│   │   │   └── workflows/          # Workflow implementations
│   │   │       ├── plan.ts
│   │   │       ├── build.ts
│   │   │       ├── test.ts
│   │   │       ├── review.ts
│   │   │       ├── document.ts
│   │   │       └── orchestrators/
│   │   │           ├── sdlc.ts
│   │   │           └── zte.ts
│   │   └── websocket/
│   │       ├── manager.ts          # WebSocket connection manager
│   │       └── broadcaster.ts      # Event broadcasting
│   ├── routes/
│   │   ├── health.ts               # Health check endpoint
│   │   ├── orchestrator.ts         # Orchestrator endpoints
│   │   └── adw.ts                  # ADW workflow endpoints
│   └── tools/
│       ├── adw-tools.ts            # ADW tools for orchestrator
│       └── system-tools.ts         # System tools
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

### Core Files

#### `package.json`

```json
{
  "name": "@ozean-licht/orchestrator-ts",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.27.0",
    "@octokit/rest": "^20.0.0",
    "@aws-sdk/client-s3": "^3.500.0",
    "simple-git": "^3.21.0",
    "zod": "^3.22.0",
    "fastify": "^4.25.0",
    "@fastify/websocket": "^10.0.0",
    "@fastify/cors": "^9.0.0",
    "prisma": "^5.8.0",
    "@prisma/client": "^5.8.0",
    "ws": "^8.16.0",
    "dotenv": "^16.3.1",
    "pino": "^8.17.0",
    "pino-pretty": "^10.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/ws": "^8.5.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "vitest": "^1.1.0",
    "@vitest/ui": "^1.1.0"
  }
}
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["node", "ws"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### `.env.sample`

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/orchestrator_db

# Server
PORT=8003
HOST=0.0.0.0
NODE_ENV=development

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Cloudflare R2 (S3-compatible)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket

# ADW Configuration
ADW_WORKING_DIR=/opt/ozean-licht-ecosystem
ADW_BACKEND_PORT_START=9100
ADW_FRONTEND_PORT_START=9200
ADW_MAX_CONCURRENT_WORKFLOWS=15

# Orchestrator
ORCHESTRATOR_MODEL=claude-sonnet-4-20250514
ORCHESTRATOR_WORKING_DIR=/opt/ozean-licht-ecosystem

# Logging
LOG_LEVEL=info
```

#### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Existing orchestrator tables
model OrchestratorAgent {
  id            String   @id @default(uuid())
  sessionId     String?  @map("session_id")
  workingDir    String   @map("working_dir")
  inputTokens   Int      @default(0) @map("input_tokens")
  outputTokens  Int      @default(0) @map("output_tokens")
  totalCost     Float    @default(0) @map("total_cost")
  status        String   @default("idle")
  metadata      Json     @default("{}")
  archived      Boolean  @default(false)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @default(now()) @updatedAt @map("updated_at")

  chat          OrchestratorChat[]

  @@map("orchestrator_agents")
}

model OrchestratorChat {
  id                    String   @id @default(uuid())
  orchestratorAgentId   String   @map("orchestrator_agent_id")
  senderType            String   @map("sender_type")
  receiverType          String   @map("receiver_type")
  message               String
  agentId               String?  @map("agent_id")
  metadata              Json     @default("{}")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @default(now()) @updatedAt @map("updated_at")

  orchestrator          OrchestratorAgent @relation(fields: [orchestratorAgentId], references: [id])

  @@map("orchestrator_chat")
}

// ADW tables
model AdwWorkflow {
  adwId           String    @id @map("adw_id")
  issueNumber     Int       @map("issue_number")
  workflowType    String    @map("workflow_type")
  phase           String    @default("initialized")
  status          String    @default("active")
  branchName      String?   @map("branch_name")
  prNumber        Int?      @map("pr_number")
  issueTitle      String?   @map("issue_title")
  issueBody       String?   @map("issue_body")
  issueClass      String?   @map("issue_class")
  worktreePath    String?   @map("worktree_path")
  worktreeExists  Boolean   @default(true) @map("worktree_exists")
  backendPort     Int?      @map("backend_port")
  frontendPort    Int?      @map("frontend_port")
  modelSet        String    @default("base") @map("model_set")
  planFile        String?   @map("plan_file")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @default(now()) @updatedAt @map("updated_at")
  completedAt     DateTime? @map("completed_at")

  events          AdwWorkflowEvent[]
  agentOutputs    AdwAgentOutput[]

  @@index([issueNumber])
  @@index([status])
  @@index([workflowType])
  @@index([createdAt])
  @@map("adw_workflows")
}

model AdwWorkflowEvent {
  id           String   @id @default(uuid())
  adwId        String   @map("adw_id")
  eventType    String   @map("event_type")
  eventSubtype String?  @map("event_subtype")
  phase        String?
  message      String?
  data         Json?
  createdAt    DateTime @default(now()) @map("created_at")

  workflow     AdwWorkflow @relation(fields: [adwId], references: [adwId], onDelete: Cascade)

  @@index([adwId])
  @@index([eventType])
  @@index([createdAt])
  @@map("adw_workflow_events")
}

model AdwAgentOutput {
  id           String   @id @default(uuid())
  adwId        String   @map("adw_id")
  agentName    String   @map("agent_name")
  phase        String
  sessionId    String?  @map("session_id")
  model        String?
  outputText   String?  @map("output_text")
  outputJsonl  Json?    @map("output_jsonl")
  success      Boolean  @default(true)
  errorMessage String?  @map("error_message")
  retryCount   Int      @default(0) @map("retry_count")
  createdAt    DateTime @default(now()) @map("created_at")

  workflow     AdwWorkflow @relation(fields: [adwId], references: [adwId], onDelete: Cascade)

  @@index([adwId])
  @@index([agentName])
  @@index([phase])
  @@map("adw_agent_outputs")
}
```

---

## Step 3: Core TypeScript Files

### `src/config/env.ts` - Environment validation with Zod

```typescript
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Server
  PORT: z.coerce.number().default(8003),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),

  // GitHub
  GITHUB_TOKEN: z.string().startsWith('ghp_'),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),

  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),

  // ADW
  ADW_WORKING_DIR: z.string(),
  ADW_BACKEND_PORT_START: z.coerce.number().default(9100),
  ADW_FRONTEND_PORT_START: z.coerce.number().default(9200),
  ADW_MAX_CONCURRENT_WORKFLOWS: z.coerce.number().default(15),

  // Orchestrator
  ORCHESTRATOR_MODEL: z.string().default('claude-sonnet-4-20250514'),
  ORCHESTRATOR_WORKING_DIR: z.string(),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
```

### `src/config/logger.ts` - Pino logger setup

```typescript
import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  } : undefined,
});
```

### `src/database/client.ts` - Prisma client singleton

```typescript
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug({ query: e.query, params: e.params, duration: e.duration }, 'Database query');
  });
}

prisma.$on('error', (e) => {
  logger.error({ target: e.target, message: e.message }, 'Database error');
});

prisma.$on('warn', (e) => {
  logger.warn({ target: e.target, message: e.message }, 'Database warning');
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
```

### `src/server.ts` - Fastify server setup

```typescript
import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import cors from '@fastify/cors';
import { logger } from './config/logger.js';
import { env } from './config/env.js';

export async function buildServer() {
  const server = Fastify({
    logger: logger,
  });

  // Register plugins
  await server.register(cors, {
    origin: true, // Allow all origins in development
  });

  await server.register(websocket);

  // Health check route
  server.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'orchestrator-ts',
    };
  });

  // WebSocket endpoint
  server.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (connection, req) => {
      logger.info('WebSocket client connected');

      connection.socket.on('message', (message) => {
        logger.debug({ message: message.toString() }, 'WebSocket message received');
      });

      connection.socket.on('close', () => {
        logger.info('WebSocket client disconnected');
      });

      // Send welcome message
      connection.socket.send(JSON.stringify({
        type: 'connection_established',
        timestamp: new Date().toISOString(),
      }));
    });
  });

  return server;
}
```

### `src/index.ts` - Application entry point

```typescript
import { buildServer } from './server.js';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import { prisma } from './database/client.js';

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Build and start server
    const server = await buildServer();

    await server.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`Server listening on http://${env.HOST}:${env.PORT}`);
    logger.info(`WebSocket available at ws://${env.HOST}:${env.PORT}/ws`);

  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'] as const;
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await prisma.$disconnect();
    process.exit(0);
  });
});

main();
```

---

## Step 4: Implementation Checklist

### Week 1: Foundation

- [ ] Create `apps/orchestrator_ts/` directory
- [ ] Initialize npm project with `package.json`
- [ ] Install all dependencies
- [ ] Create `tsconfig.json`
- [ ] Set up `.env` and `.env.sample`
- [ ] Create database migration `005_add_adw_tables.sql`
- [ ] Run database migration
- [ ] Create Prisma schema
- [ ] Generate Prisma client
- [ ] Implement environment validation (`env.ts`)
- [ ] Set up Pino logger (`logger.ts`)
- [ ] Create Prisma client singleton (`client.ts`)
- [ ] Build Fastify server (`server.ts`)
- [ ] Create application entry point (`index.ts`)
- [ ] Test health check endpoint
- [ ] Test WebSocket connection
- [ ] Verify database connectivity

### Week 2: Database Queries

- [ ] Create `src/database/queries/orchestrator.ts`
  - [ ] `getOrCreateOrchestrator()`
  - [ ] `updateOrchestratorSession()`
  - [ ] `updateOrchestratorCosts()`
- [ ] Create `src/database/queries/adw.ts`
  - [ ] `createWorkflow()`
  - [ ] `getWorkflow()`
  - [ ] `updateWorkflow()`
  - [ ] `listActiveWorkflows()`
  - [ ] `createWorkflowEvent()`
  - [ ] `getWorkflowEvents()`
  - [ ] `createAgentOutput()`
  - [ ] `getAgentOutputs()`
- [ ] Write unit tests for database queries
- [ ] Verify type safety with Prisma

---

## Step 5: Testing Strategy

### Unit Tests (`tests/unit/`)

```typescript
// tests/unit/database/queries/adw.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '../../../src/database/client.js';
import { createWorkflow, getWorkflow } from '../../../src/database/queries/adw.js';

describe('ADW Database Queries', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.adwWorkflow.deleteMany();
  });

  afterEach(async () => {
    await prisma.adwWorkflow.deleteMany();
  });

  it('should create a new workflow', async () => {
    const workflow = await createWorkflow({
      adwId: 'test1234',
      issueNumber: 123,
      workflowType: 'sdlc',
    });

    expect(workflow.adwId).toBe('test1234');
    expect(workflow.issueNumber).toBe(123);
    expect(workflow.status).toBe('active');
  });

  it('should retrieve a workflow by ID', async () => {
    await createWorkflow({
      adwId: 'test5678',
      issueNumber: 456,
      workflowType: 'plan',
    });

    const workflow = await getWorkflow('test5678');
    expect(workflow).not.toBeNull();
    expect(workflow?.issueNumber).toBe(456);
  });
});
```

---

## Success Criteria for Phase 1

✅ Phase 1 is complete when:

1. **Database**:
   - [ ] Migration `005_add_adw_tables.sql` applied successfully
   - [ ] Prisma schema matches database
   - [ ] All tables created with indexes
   - [ ] Can query and insert test data

2. **TypeScript Backend**:
   - [ ] Project compiles without errors
   - [ ] All dependencies installed
   - [ ] Environment validation working
   - [ ] Logger outputs structured logs

3. **Server**:
   - [ ] Fastify server starts on configured port
   - [ ] Health check endpoint returns 200
   - [ ] WebSocket endpoint accepts connections
   - [ ] CORS configured correctly

4. **Database Client**:
   - [ ] Prisma client connects to database
   - [ ] Query logging works in development
   - [ ] Type-safe queries generated
   - [ ] Connection pooling enabled

5. **Tests**:
   - [ ] Unit tests for database queries pass
   - [ ] Test coverage >80% for core functions
   - [ ] Vitest UI accessible

---

## Next Steps After Phase 1

**Phase 2**: Core ADW Modules (agent execution, state management, worktree operations)

**Phase 3**: Workflow Operations (plan, build, test workflows)

**Phase 4**: External Integrations (GitHub, R2 storage)

**Phase 5**: Workflow Scripts (individual + orchestrators)

**Phase 6**: Frontend Integration

**Phase 7**: Cleanup and Migration

---

## Quick Start Commands

```bash
# Navigate to project
cd apps/orchestrator_ts

# Install dependencies
npm install

# Set up environment
cp .env.sample .env
# Edit .env with your credentials

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev

# Run tests
npm run test

# Type check
npm run type-check

# View database
npm run db:studio
```

---

**Status**: Ready to begin Phase 1 implementation
**Estimated Duration**: 2 weeks
**Next Action**: Create `apps/orchestrator_ts/` directory and initialize project
