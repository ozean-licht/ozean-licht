# Orchestrator TypeScript - Phase 1 Complete

> **Status**: Phase 1 Foundation Complete ✅
>
> Full TypeScript orchestrator with Agent SDK integration and PostgreSQL-backed ADW workflow system.

## Overview

The TypeScript orchestrator is a modern rewrite of the Python-based orchestrator system, featuring:
- **Native Agent SDK** integration (no subprocess calls)
- **PostgreSQL** state management (no JSON files)
- **Fastify** HTTP server with WebSocket streaming
- **Prisma ORM** for type-safe database operations
- **Full TypeScript** with strict type checking

## Phase 1 Implementation Status

### ✅ Completed

#### Project Foundation
- [x] Directory structure created
- [x] `package.json` with all dependencies
- [x] `tsconfig.json` with ES2022 target
- [x] `.env.sample` template
- [x] `.gitignore` for version control

#### Database Layer
- [x] Database migration `005_add_adw_tables.sql`
- [x] Prisma schema with ADW tables
- [x] Prisma client singleton with event logging
- [x] ADW database operations (8 functions)
- [x] Orchestrator database operations (6 functions)

#### Application Core
- [x] Environment validation with Zod
- [x] Pino logger configuration
- [x] Fastify server with WebSocket support
- [x] Application entry point with graceful shutdown

### 📋 Next Steps (Phase 2+)

- [ ] Install dependencies (`npm install`)
- [ ] Generate Prisma client (`npm run db:generate`)
- [ ] Run database migration
- [ ] Core ADW modules (agent executor, workflow manager)
- [ ] Workflow implementations (plan, build, test, review)
- [ ] Frontend integration

## Deployment

### 🚀 Coolify Deployment (Production)

See **[COOLIFY_DEPLOYMENT.md](./COOLIFY_DEPLOYMENT.md)** for complete Coolify deployment guide including:
- Reusing existing PostgreSQL instance
- Cleaning orchestrator_db database
- Running migrations
- Docker compose configuration
- Troubleshooting

**Quick reference**: [tools/coolify/orchestrator-ts-config.md](../../tools/coolify/orchestrator-ts-config.md)

### 💻 Local Development

## Quick Start

### Prerequisites

```bash
# Required tools
node -v       # Node.js 18+
npm -v        # npm 9+
postgresql    # PostgreSQL 14+
```

### Installation

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

# Run migrations (ensure PostgreSQL is running)
npm run db:migrate
```

### Development

```bash
# Start development server (hot reload)
npm run dev

# Server will start on http://localhost:8003
# WebSocket available at ws://localhost:8003/ws
# Health check at http://localhost:8003/health
```

### Production

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## Project Structure

```
apps/orchestrator_ts/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env.sample               # Environment template
├── .env                      # Your environment (gitignored)
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
│
├── src/
│   ├── index.ts              # Application entry point
│   ├── server.ts             # Fastify server setup
│   │
│   ├── config/
│   │   ├── env.ts            # Zod environment validation
│   │   └── logger.ts         # Pino logger configuration
│   │
│   ├── database/
│   │   ├── client.ts         # Prisma singleton
│   │   └── queries/
│   │       ├── adw.ts        # ADW database operations
│   │       └── orchestrator.ts # Orchestrator operations
│   │
│   ├── modules/              # Feature modules (Phase 2+)
│   │   ├── orchestrator/     # Orchestrator service
│   │   ├── adw/              # ADW workflows
│   │   └── websocket/        # WebSocket manager
│   │
│   ├── routes/               # HTTP routes (Phase 2+)
│   │   ├── health.ts         # Health check
│   │   ├── orchestrator.ts   # Orchestrator endpoints
│   │   └── adw.ts            # ADW endpoints
│   │
│   └── tools/                # Agent tools (Phase 2+)
│       ├── adw-tools.ts      # ADW workflow tools
│       └── system-tools.ts   # System tools
│
├── tests/                    # Tests (Phase 2+)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── dist/                     # Build output (gitignored)
```

## Database Schema

### ADW Tables

#### `adw_workflows`
Core workflow state tracking with:
- Workflow metadata (type, phase, status)
- GitHub integration (issue, PR, branch)
- Git worktree management
- Port allocation
- Model configuration

#### `adw_workflow_events`
Event log for workflow progress:
- Event type and subtype
- Phase tracking
- Structured JSONB data

#### `adw_agent_outputs`
Agent execution outputs:
- Agent identification
- Session and model tracking
- Output text and JSONB
- Success/failure tracking

### Orchestrator Tables

#### `orchestrator_agents`
Orchestrator agent tracking:
- Session management
- Token usage metrics
- Cost tracking
- Soft delete (archived flag)

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run type-check   # Type check without emitting files
npm test             # Run tests with Vitest
npm test:ui          # Run tests with UI
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio GUI
```

## API Endpoints

### Health Check
```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2025-11-09T12:00:00.000Z",
  "service": "orchestrator-ts"
}
```

### WebSocket
```bash
ws://localhost:8003/ws

Connection message:
{
  "type": "connection_established",
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

## Database Operations

### ADW Workflows

```typescript
import { createWorkflow, getWorkflow, createWorkflowEvent } from './database/queries/adw.js';

// Create a new workflow
const workflow = await createWorkflow({
  adwId: 'abc12345',
  issueNumber: 123,
  workflowType: 'sdlc',
  issueTitle: 'Implement new feature',
  issueClass: 'feature'
});

// Log an event
await createWorkflowEvent({
  adwId: 'abc12345',
  eventType: 'phase_started',
  phase: 'plan',
  message: 'Starting planning phase',
  data: { estimatedDuration: '30m' }
});

// Retrieve workflow
const current = await getWorkflow('abc12345');
```

### Orchestrator Agents

```typescript
import { getOrCreateOrchestrator, updateOrchestratorCosts } from './database/queries/orchestrator.js';

// Get or create orchestrator
const orchestrator = await getOrCreateOrchestrator('/opt/ozean-licht-ecosystem');

// Update costs
await updateOrchestratorCosts(
  orchestrator.id,
  1000, // input tokens
  500,  // output tokens
  0.05  // total cost
);
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `ANTHROPIC_API_KEY` - Anthropic API key (sk-ant-...)
- `GITHUB_TOKEN` - GitHub personal access token (ghp_...)
- `ADW_WORKING_DIR` - Working directory for ADW
- `ORCHESTRATOR_WORKING_DIR` - Working directory for orchestrator

Optional:
- `PORT` - Server port (default: 8003)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment (development|production|test)
- `LOG_LEVEL` - Log level (fatal|error|warn|info|debug|trace)
- `R2_*` - Cloudflare R2 storage credentials

See `.env.sample` for complete list.

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :8003

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Test PostgreSQL connection
psql $DATABASE_URL

# Verify database exists
psql -l | grep orchestrator_db
```

### Prisma Client Not Generated
```bash
# Regenerate Prisma client
npm run db:generate

# Verify generation
ls node_modules/.prisma/client
```

### TypeScript Compilation Errors
```bash
# Clean build
rm -rf dist/

# Rebuild
npm run build

# Type check without building
npm run type-check
```

## Migration from Python

This TypeScript implementation replaces:
- Python ADW modules (`adws/adw_modules/*.py`)
- Python orchestrator (`apps/orchestrator_3_stream/backend/*.py`)
- Claude CLI subprocess calls
- JSON file state management
- Separate o-commands/a-commands system

Advantages:
- Native Agent SDK usage (no subprocess overhead)
- PostgreSQL-backed state (no file I/O)
- Full TypeScript type safety
- Unified codebase
- Better tooling and IDE support

## Development Guidelines

### Code Style
- Use strict TypeScript mode
- Prefer async/await over callbacks
- Use Pino structured logging
- Include JSDoc comments for public functions

### Error Handling
```typescript
try {
  // Operation
  const result = await someOperation();
  logger.info({ result }, 'Operation succeeded');
  return result;
} catch (error) {
  logger.error({ error }, 'Operation failed');
  throw new Error(`Failed: ${error instanceof Error ? error.message : 'Unknown'}`);
}
```

### Database Operations
- Always use Prisma for database access
- Include error handling and logging
- Use type-safe queries
- Leverage Prisma's generated types

## Contributing

1. Create feature branch from `main`
2. Implement changes with tests
3. Run type check: `npm run type-check`
4. Run tests: `npm test`
5. Create pull request

## License

**UNLICENSED** - Part of Ozean Licht Ecosystem

---

**Phase 1 Completed**: 2025-11-09
**Next Phase**: Core ADW Modules Implementation
**Documentation**: See `/opt/ozean-licht-ecosystem/specs/typescript-migration-phase1-plan.md`
