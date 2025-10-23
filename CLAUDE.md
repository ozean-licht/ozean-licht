# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo for the **Ozean Licht Ecosystem**, which encompasses two legally separate Austrian associations (Vereine) sharing technical infrastructure:

1. **Kids Ascension** (`kids-ascension.dev`) - Video platform for parents and kids
2. **Ozean Licht** (`ozean-licht.dev`) - Content platform for courses and community

**Current Status:** Foundation phase - MCP Setup and Admin-Dashboards in development, autonomous development system experimental.

## Essential Commands

### Development Workflow

```bash
# Install all dependencies (uses pnpm workspaces)
pnpm install

# Start specific project dev servers
pnpm --filter @ka/web dev        # Kids Ascension frontend
pnpm --filter @ka/api dev        # Kids Ascension backend
pnpm --filter @ol/web dev        # Ozean Licht frontend
pnpm --filter @ol/api dev        # Ozean Licht backend

# Start all projects in parallel
pnpm --parallel dev

# Build all projects
pnpm --recursive build

# Run tests
pnpm --recursive test
pnpm --filter @ka/web test:e2e   # E2E tests

# Database migrations (Prisma)
pnpm --filter @ka/api prisma migrate dev
pnpm --filter @ka/api prisma studio
```

### Autonomous Development Workflows (ADW)

**Core Concept:** All ADW workflows with `_iso` suffix run in **isolated git worktrees** under `trees/{adw_id}/` with dedicated ports (backend: 9100-9114, frontend: 9200-9214). Each workflow gets a complete repo copy with full filesystem and network isolation.

**Important:**
- **Entry point workflows** create new worktrees (e.g., `adw_plan_iso.py`, `adw_patch_iso.py`)
- **Dependent workflows** require existing worktree + ADW ID (e.g., `adw_build_iso.py`, `adw_test_iso.py`)

```bash
cd adws/

# Entry Point: Create isolated worktree and plan
uv run adw_plan_iso.py <issue-number> [optional-adw-id]

# Entry Point: Quick patch in isolation
uv run adw_patch_iso.py <issue-number> [optional-adw-id]

# Dependent: Build in existing worktree (ADW ID required)
uv run adw_build_iso.py <issue-number> <adw-id>

# Dependent: Test in existing worktree (ADW ID required)
uv run adw_test_iso.py <issue-number> <adw-id> [--skip-e2e]

# Dependent: Review in existing worktree (ADW ID required)
uv run adw_review_iso.py <issue-number> <adw-id> [--skip-resolution]

# Dependent: Document in existing worktree (ADW ID required)
uv run adw_document_iso.py <issue-number> <adw-id>

# Dependent: Ship (approve & merge PR, ADW ID required)
uv run adw_ship_iso.py <issue-number> <adw-id>

# Orchestrator: Complete SDLC in isolation (plan → build → test → review → document)
uv run adw_sdlc_iso.py <issue-number> [optional-adw-id]

# ⚠️ Auto-ship: Complete SDLC + automatic merge to main
uv run adw_sdlc_zte_iso.py <issue-number> [optional-adw-id]

# Automation: Continuous monitoring (polls every 20s)
uv run adw_triggers/trigger_cron.py

# Automation: Webhook server for instant response
uv run adw_triggers/trigger_webhook.py
```

### Worktree Management

```bash
# List all worktrees
git worktree list

# Check ADW state
cat agents/{adw_id}/adw_state.json | jq .

# Remove specific worktree after PR merge
git worktree remove trees/{adw_id}

# Clean up orphaned worktree entries
git worktree prune
```

### Model Selection

ADW supports dynamic model selection for complexity. Include in GitHub issue body:

```
Include workflow: adw_sdlc_iso model_set heavy
```

- **Base** (default): Sonnet for speed and cost efficiency
- **Heavy**: Opus for complex tasks, debugging, detailed documentation

## High-Level Architecture

### Multi-Tenant Database Strategy

Single PostgreSQL instance with **separate databases per entity**:
- `shared_users_db` - Unified authentication (cross-platform SSO)
- `kids_ascension_db` - KA-specific data (videos, parents, kids)
- `ozean_licht_db` - OL-specific data (courses, members, content)
- `literag_knowledge_db` - LiteRAG knowledge base (future)

**Rationale:** Legal separation while sharing infrastructure. Users can have accounts on both platforms with unified auth.

### Three-Tier Storage System

1. **MinIO (Hot Storage)** - On-premise staging on Hetzner server
   - Video upload staging before moderation
   - Brand assets and temporary files
   - Local SSD performance (~3000 MB/s)
   - Auto-cleanup after 30 days

2. **Cloudflare R2 (Cold Archive)** - Permanent video masters
   - Original quality after approval
   - $0.015/GB/month, zero egress
   - S3-compatible API

3. **Cloudflare Stream (Delivery)** - CDN video streaming
   - Automatic transcoding (360p, 720p, 1080p)
   - Adaptive bitrate streaming
   - Global edge delivery (<50ms to user)
   - $1 per 1000 minutes watched

**Video Pipeline Flow:**
```
User Upload → MinIO Staging → Admin Approval → R2 Archive (original)
                                              → Cloudflare Stream (transcoded)
                                              → Users watch via Stream player
```

### Autonomous Development System (ADW)

**Core Innovation:** Git worktree-based isolation enabling up to **15 concurrent workflows** without interference.

**Key Concepts:**
- **ADW ID:** Unique 8-char identifier (e.g., `abc12345`) tracking entire workflow lifecycle
- **Isolated Execution:** Each workflow gets its own worktree at `trees/{adw_id}/` with dedicated ports
- **State Management:** Persistent state in `agents/{adw_id}/adw_state.json` enables phase composition
- **Memory Integration:** Mem0 stores learnings from each workflow to improve future executions

**Workflow Phases:**
1. **Plan** - Classify issue, create implementation spec
2. **Build** - Implement from spec in isolation
3. **Test** - Run unit/E2E tests with allocated ports
4. **Review** - Validate against spec, capture screenshots
5. **Document** - Generate docs in `app_docs/features/`
6. **Ship** - Approve PR and merge to main

**Slash Commands:**
All agent operations use slash commands (e.g., `/classify_issue`, `/implement`, `/review`, `/document`). Located in `.claude/commands/`.

**Triggers:**
- **Manual:** Direct execution of Python scripts
- **Cron:** Polls GitHub for "adw" comments every 20s
- **Webhook:** Real-time GitHub event processing

### Infrastructure

**Current:** Single Hetzner AX42 dedicated server ($50/mo)
- **Specs:** AMD Ryzen 5 3600 (6c/12t), 64GB RAM, 2x512GB NVMe
- **Orchestration:** Coolify (self-hosted PaaS)
- **Containers:** PostgreSQL, MinIO, LiteRAG, MCP Gateway, N8N, Taskmaster
- **Proxy:** Nginx with SSL (Let's Encrypt via Coolify)
- **CDN:** Cloudflare (DDoS, WAF, DNS, R2, Stream, Pages)

**Frontend Hosting:** Cloudflare Pages (static builds from React apps)

**Future Migration Path:** Kubernetes when traffic exceeds 100k DAU (currently designed for easy transition - all services containerized).

### MCP Gateway

**Purpose:** Unified gateway for autonomous agents to access tools via Model Context Protocol.

**Location:** `infrastructure/mcp-gateway/`

**Supported Services:**
- PostgreSQL (database operations)
- Mem0 (persistent memory)
- Cloudflare (CDN, DNS, Stream)
- GitHub (repository management)
- N8N (workflow automation)

**Usage:**
```bash
# PostgreSQL
/mcp-postgres kids-ascension-db query "SELECT * FROM videos LIMIT 10"

# Mem0
/mcp-mem0 remember "User prefers TypeScript"
/mcp-mem0 search "programming preferences"

# Cloudflare
/mcp-cloudflare stream upload /videos/lesson1.mp4
```

**Endpoints:**
- `POST /mcp/execute` - Execute slash commands
- `POST /mcp/rpc` - JSON-RPC interface
- `GET /mcp/catalog` - List services
- `GET /health` - Health check

## Project Structure Patterns

### Monorepo Organization

```
ozean-licht-ecosystem/
├── projects/                  # Application projects
│   ├── kids-ascension/
│   │   ├── apps/
│   │   │   ├── web/          # React frontend (Vite + TypeScript)
│   │   │   ├── mobile/       # React Native (future)
│   │   │   └── admin/        # Admin dashboard
│   │   └── api/              # Node.js backend (Express + TypeScript)
│   │       ├── src/
│   │       ├── prisma/       # Database schema & migrations
│   │       └── tests/
│   └── ozean-licht/          # Similar structure
│
├── shared/                    # Reusable code
│   ├── ui-components/        # React components
│   ├── auth/                 # Authentication logic
│   ├── database/             # Prisma client configs
│   └── types/                # TypeScript types
│
├── infrastructure/            # DevOps & services
│   ├── mcp-gateway/          # MCP protocol gateway
│   ├── coolify/              # Service configs
│   └── server/               # Server architecture docs
│
├── adws/                      # Autonomous development workflows
│   ├── adw_*_iso.py          # Isolated workflow scripts
│   ├── adw_modules/          # Core modules
│   │   ├── agent.py          # Claude Code integration
│   │   ├── state.py          # State management
│   │   ├── worktree_ops.py   # Worktree & port management
│   │   ├── workflow_ops.py   # Core workflow logic
│   │   └── git_ops.py        # Git operations
│   └── adw_triggers/         # Automation triggers
│
├── tools/                     # Development tools
│   ├── .knowledge/           # LiteRAG (future)
│   └── .mcp/                 # MCP configurations
│
├── docs/                      # Documentation
│   ├── architecture.md       # Complete system architecture
│   └── guides/               # How-to guides
│
├── app_docs/                  # Generated documentation
│   └── features/             # Feature-specific docs
│
├── trees/                     # ADW worktrees (gitignored)
│   └── {adw_id}/             # Isolated workspace per workflow
│
├── agents/                    # ADW agent outputs
│   └── {adw_id}/
│       ├── adw_state.json    # Workflow state
│       ├── planner/          # Planning agent output
│       ├── implementor/      # Implementation agent output
│       ├── tester/           # Test agent output
│       ├── reviewer/         # Review agent output
│       │   └── review_img/   # Screenshots
│       └── documenter/       # Documentation agent output
│
└── .claude/                   # Claude Code configuration
    ├── commands/              # Slash commands
    └── hooks/                 # Event hooks
```

### Authentication Flow

**Unified SSO with Entity Context:**
```typescript
// JWT structure for multi-entity access
{
  userId: "uuid",
  email: "user@example.com",
  entities: [
    { entityId: "kids_ascension", role: "admin" },
    { entityId: "ozean_licht", role: "user" }
  ]
}
```

1. User logs in → verify credentials in `shared_users_db`
2. Fetch user entities from `user_entities` table
3. Generate JWT + refresh token (httpOnly cookie)
4. Client stores access token in memory
5. Middleware validates entity access per request

**Supported Providers:** Email/password, Google OAuth (future: Facebook)

### Branching & Commits

**Branch Naming:**
```
{type}-{issue_number}-{adw_id}-{slug}
```
Example: `feat-456-abc12345-add-user-authentication`

**Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`

**Commit Convention:**
```
{type}: {description} ({adw_id})

feat: add video upload to MinIO staging (abc12345)
fix: mobile login touch events (def67890)
test: add E2E tests for video moderation (ghi12345)
```

## Important Patterns & Conventions

### Working with Isolated Worktrees

1. **Always validate worktree exists** before dependent workflows:
   ```python
   from adw_modules.worktree_ops import validate_worktree
   validate_worktree(adw_id)  # Raises if not found
   ```

2. **Load ADWState at workflow start:**
   ```python
   from adw_modules.state import ADWState
   state = ADWState.load(adw_id)
   working_dir = state.worktree_path
   backend_port = state.backend_port
   ```

3. **All git operations use `cwd` parameter:**
   ```python
   from adw_modules.git_ops import commit_changes
   commit_changes("feat: add feature", cwd=working_dir)
   ```

4. **Use allocated ports for services:**
   ```bash
   # Ports stored in trees/{adw_id}/.ports.env
   BACKEND_PORT=9107
   FRONTEND_PORT=9207
   ```

5. **Clean up after PR merge:**
   ```bash
   git worktree remove trees/{adw_id}
   ```

### Database Migrations

Each database has its own Prisma schema:
```
projects/kids-ascension/api/prisma/schema.prisma
projects/ozean-licht/api/prisma/schema.prisma
shared/database/prisma/schema.prisma  # shared_users_db
```

**Migration workflow:**
```bash
# Generate migration
pnpm --filter @ka/api prisma migrate dev --name add_videos_table

# Apply to production
pnpm --filter @ka/api prisma migrate deploy

# Reset (dev only)
pnpm --filter @ka/api prisma migrate reset
```

### Agent Collaboration via Mem0

**Store learnings after workflow completion:**
```python
memory_payload = {
    "adw_id": state.adw_id,
    "issue_class": state.issue_class,
    "files_changed": ["path/to/file1.ts", "path/to/file2.tsx"],
    "lessons_learned": [
        "Mobile touch events need passive listeners",
        "Safari requires specific touch-action CSS"
    ],
    "patterns_used": ["React useEffect for event listeners"]
}
# Store in Mem0 via MCP Gateway
```

**Query before planning:**
```python
# Retrieve similar past work
similar_tasks = query_mem0(
    query="mobile login touch events",
    issue_class="/bug"
)
# Incorporate learnings into implementation plan
```

### File Upload Pipeline (Kids Ascension)

**Key Pattern:** Three-tier storage ensures cost efficiency and performance.

```typescript
// 1. Upload to MinIO staging
const uploadToStaging = async (file: File) => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch('/api/videos/upload', {
    method: 'POST',
    body: formData,
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return response.json(); // Returns video ID
};

// 2. Admin approves (backend)
async function approveVideo(videoId: string) {
  // Copy from MinIO to R2 archive
  await uploadToR2(minioKey, r2Key);

  // Upload to Cloudflare Stream for delivery
  const streamId = await uploadToStream(r2Key);

  // Update database
  await prisma.video.update({
    where: { id: videoId },
    data: {
      status: 'approved',
      r2_key: r2Key,
      cloudflare_stream_id: streamId
    }
  });
}

// 3. Frontend playback
<VideoPlayer streamId={video.cloudflare_stream_id} />
```

### Testing with Isolated Ports

**Unit tests must use allocated ports:**
```typescript
// tests/api/videos.test.ts
import dotenv from 'dotenv';

// Load port from worktree .ports.env
dotenv.config({ path: '.ports.env' });

const API_URL = `http://localhost:${process.env.BACKEND_PORT}`;

describe('Video API', () => {
  it('uploads video to staging', async () => {
    const response = await fetch(`${API_URL}/api/videos/upload`, {
      method: 'POST',
      body: videoFormData
    });
    expect(response.status).toBe(201);
  });
});
```

**E2E tests with frontend port:**
```typescript
// tests/e2e/video-upload.spec.ts
import { test, expect } from '@playwright/test';

const FRONTEND_URL = `http://localhost:${process.env.FRONTEND_PORT}`;

test('user can upload video', async ({ page }) => {
  await page.goto(FRONTEND_URL);
  await page.click('[data-testid="upload-button"]');
  // ...
});
```

## Common Pitfalls & Solutions

### Pitfall: Running dependent workflow without worktree
**Error:** `Worktree validation failed for ADW {adw_id}`

**Solution:** Always run an entry point workflow first (e.g., `adw_plan_iso.py`) to create the worktree, or provide an existing ADW ID.

### Pitfall: Port conflicts between concurrent workflows
**Error:** `Port 9100 already in use`

**Solution:** ADW automatically allocates unique ports (9100-9114 for backend, 9200-9214 for frontend). If all 15 ports are busy, wait for workflows to complete or manually clean up worktrees.

### Pitfall: Mixing databases in queries
**Error:** Cannot query across `kids_ascension_db` and `ozean_licht_db` directly

**Solution:** Use application-level joins. User data in `shared_users_db` is referenced via `user_id` in entity-specific tables. Never join across databases at SQL level.

### Pitfall: Forgetting to update ADWState
**Error:** Ship phase fails with "Incomplete state"

**Solution:** Each workflow phase must update state:
```python
state = ADWState.load(adw_id)
state.plan_file = "specs/plan-abc12345.md"
state.issue_class = "/feature"
state.save()
```

### Pitfall: Using main repo instead of worktree
**Error:** Changes appear in main repo instead of isolated branch

**Solution:** Always use `working_dir` from ADWState:
```python
state = ADWState.load(adw_id)
os.chdir(state.worktree_path)  # Switch to worktree
# Now all operations are isolated
```

## Critical Files for Context

- `docs/architecture.md` - Complete system architecture (2900+ lines)
- `docs/guides/AGENTIC_SYSTEM_STRATEGY.md` - ADW philosophy and patterns
- `adws/README.md` - Detailed ADW workflow documentation
- `infrastructure/README.md` - Infrastructure overview
- `infrastructure/mcp-gateway/README.md` - MCP Gateway documentation
- `.claude/commands/*.md` - All slash command definitions
- `agents/{adw_id}/adw_state.json` - Workflow state (runtime)

## Environment Variables

**Required for ADW:**
```bash
GITHUB_REPO_URL="https://github.com/owner/repo"
ANTHROPIC_API_KEY="sk-ant-..."
CLAUDE_CODE_PATH="/path/to/claude"  # Optional, defaults to "claude"
GITHUB_PAT="ghp_..."  # Optional if using gh CLI auth
```

**Required for Applications:**
```bash
# Databases
SHARED_USERS_DB_URL="postgresql://user:pass@host/shared_users_db"
KIDS_ASCENSION_DB_URL="postgresql://user:pass@host/kids_ascension_db"
OZEAN_LICHT_DB_URL="postgresql://user:pass@host/ozean_licht_db"

# Auth
JWT_SECRET="<256-bit-key>"
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_SECRET="<256-bit-key>"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Storage
MINIO_ENDPOINT="localhost:9000"
MINIO_ACCESS_KEY="<key>"
MINIO_SECRET_KEY="<secret>"
CLOUDFLARE_R2_ACCESS_KEY="<key>"
CLOUDFLARE_R2_SECRET_KEY="<secret>"
CLOUDFLARE_STREAM_API_TOKEN="<token>"

# External
SENDGRID_API_KEY="<key>"  # Email notifications
STRIPE_SECRET_KEY="<key>"  # Payments (future)
```

## Quick Diagnostic Commands

```bash
# Check worktree status
git worktree list

# Verify ADW state
cat agents/{adw_id}/adw_state.json | jq .

# View agent output
tail -f agents/{adw_id}/planner/raw_output.jsonl | jq .

# Check allocated ports
cat trees/{adw_id}/.ports.env

# Test ports are free
lsof -i :9107
lsof -i :9207

# Health checks
curl http://localhost:8100/health  # MCP Gateway
curl http://localhost:8080/health  # LiteRAG (future)

# Database status
docker ps | grep postgres
pnpm --filter @ka/api prisma studio  # GUI

# Storage status
docker ps | grep minio
```

## Philosophy & Approach

**Zero Touch Engineering (ZTE):** Humans define "what" in GitHub issues, agents determine "how" through isolated workflows. Goal is complete SDLC automation from issue to production deployment.

**Institutional Memory:** Every workflow stores learnings in Mem0, compounding knowledge over time. Future agents benefit from past patterns, mistakes, and solutions.

**Isolated Execution:** Complete filesystem and network isolation prevents interference between concurrent workflows, enabling true parallel development.

**Legal Separation with Technical Unity:** Two independent entities (Kids Ascension, Ozean Licht) share cost-efficient infrastructure while maintaining clear database boundaries.

**Future-Proof Foundation:** Current architecture (Coolify + single server) designed for seamless migration to Kubernetes when scale demands (all containerized, stateless APIs, separated storage).

---

**Last Updated:** 2025-10-21
**Repository:** Private monorepo - ozean-licht-ecosystem
**Primary Maintainer:** Sergej Götz (via autonomous agents)
