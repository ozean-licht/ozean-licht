# Engineering Rules for Ozean Licht Ecosystem

## Repository Overview

This is a monorepo for the **Ozean Licht Ecosystem** - two legally separate Austrian associations (Vereine) sharing technical infrastructure:

1. **Kids Ascension** (`kids-ascension.dev`) - Free educational video platform
2. **Ozean Licht** (`ozean-licht.dev`) - Content platform for courses and community

**Status:** Foundation phase - MCP Gateway and Admin Dashboard in development, autonomous development system experimental.

## IMPORTANT: Use CONTEXT_MAP.md for navigation

- **ALWAYS** check `CONTEXT_MAP.md` for file locations and code structure
- `CONTEXT_MAP.md` provides line-based navigation chapters (e.g., Lines 351-470: MCP Gateway)
- This eliminates repetitive searching and grep operations
- Read `CONTEXT_MAP.md` first before starting any task

## Engineering Rules

### Actually read files completely

- IMPORTANT: When asked to read a file, read ALL of it - don't just read the first N lines
- Read the file in chunks if needed. If too large, cut in half and try again, then iterate
- This is VERY IMPORTANT for understanding the codebase
- Use `wc -l <filename>` to get line counts and properly divide your Read tool usage

### Use Astral UV, never raw python

- We're using Astral UV to manage Python projects
- **ALWAYS** use `uv run` to execute scripts, never raw `python`
- ADW scripts: `uv run adws/adw_plan_iso.py <issue-number>`

### Testing practices

- Use real database connections and real Claude Agent SDK agents
- **NO MOCKS** - tests should be ephemeral: start and end database in exact same state
- Create test data, run test, clean up after

### Git commits

- **IMPORTANT**: Do NOT commit changes unless explicitly asked
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Include issue number and ADW ID in commits

### Prefer Pydantic models over dicts

- Use Pydantic models for all data structures
- For database models, use appropriate ORM models (Prisma for apps)

### Environment variables

- Use `python-dotenv` to load from `.env` files
- Copy root `.env` to respective `apps/*/.env` if needed locally
- Never hardcode credentials

## Available Tools (via MCP Gateway)

The MCP Gateway (`tools/mcp-gateway/`) provides unified access to all infrastructure tools:

### PostgreSQL
```bash
/mcp-postgres kids-ascension-db query "SELECT * FROM videos LIMIT 10"
```
- Multi-tenant: `shared_users_db`, `kids_ascension_db`, `ozean_licht_db`
- Connection pooling (min 2, max 10 connections)

### Mem0 (Institutional Memory)
```bash
/mcp-mem0 remember "Pattern: Use connection pooling for PostgreSQL"
/mcp-mem0 search "optimization patterns"
/mcp-mem0 report
```
- Vector search with Qdrant
- Stores learnings across ADW workflows
- Collection: `ozean_memories`

### MinIO (S3 Storage)
```bash
/mcp-minio upload ozean-ecosystem videos/lesson.mp4 video/mp4
/mcp-minio getUrl ozean-ecosystem videos/lesson.mp4
/mcp-minio list ozean-ecosystem videos/
```
- Hot storage for uploads before moderation
- Auto-cleanup after 30 days
- S3-compatible API

### GitHub
```bash
/mcp-github create-pr "feat: Add feature" "Description"
/mcp-github merge-pr 123
```
- Repository management
- PR and issue operations

### Cloudflare
```bash
/mcp-cloudflare stream upload /videos/lesson.mp4
```
- Stream (video CDN)
- R2 (cold storage)
- DNS and zones

### N8N
```bash
/mcp-n8n trigger-workflow <workflow-id>
```
- Workflow automation
- Webhooks

## Autonomous Development Workflows (ADW)

ADW enables Zero Touch Engineering - humans define "what" in GitHub issues, agents determine "how".

### Core Concepts
- **Isolated Execution**: Each workflow runs in separate git worktree (`trees/{adw_id}/`)
- **Port Allocation**: Backend (9100-9114), Frontend (9200-9214)
- **ADW ID**: 8-character unique identifier tracking entire lifecycle
- **15 Concurrent Workflows**: Full filesystem and network isolation

### Common ADW Commands
```bash
cd adws/

# Complete SDLC in isolation
uv run adw_sdlc_iso.py 123

# Individual phases
uv run adw_plan_iso.py 123              # Plan (creates worktree)
uv run adw_build_iso.py 123 <adw-id>    # Build (requires worktree)
uv run adw_test_iso.py 123 <adw-id>     # Test
uv run adw_review_iso.py 123 <adw-id>   # Review
uv run adw_document_iso.py 123 <adw-id> # Document
uv run adw_ship_iso.py 123 <adw-id>     # Ship (approve & merge)

# Zero Touch Execution (auto-merge!)
uv run adw_sdlc_zte_iso.py 123

# Automation triggers
uv run adw_triggers/trigger_cron.py     # Poll every 20s
uv run adw_triggers/trigger_webhook.py  # Real-time webhook
```

### Worktree Management
```bash
git worktree list                       # List all worktrees
cat agents/{adw_id}/adw_state.json | jq .  # Check state
git worktree remove trees/{adw_id}      # Clean up after merge
git worktree prune                      # Remove orphaned entries
```

## Development Commands

### Apps (formerly "projects")
```bash
# Start specific app
pnpm --filter admin dev           # Admin dashboard (port 9200)
pnpm --filter @ka/web dev          # Kids Ascension (port 3000)
pnpm --filter @ol/web dev          # Ozean Licht (port 3001)

# Start MCP Gateway
cd tools/mcp-gateway
npm run dev                        # Port 8100

# Test apps
pnpm test                          # All tests
pnpm --filter @ka/web test:e2e     # E2E tests
```

### Database Operations
```bash
# Migrations
pnpm --filter @ka/api prisma migrate dev
pnpm --filter @ka/api prisma studio

# Direct access via MCP
/mcp-postgres kids-ascension-db query "SELECT * FROM users LIMIT 5"
```

## Repository Structure (Quick Reference)

```
ozean-licht-ecosystem/
├── apps/                      # Applications (admin, kids-ascension, ozean-licht)
├── adws/                      # Autonomous Development Workflows
├── tools/                     # Infrastructure tools (MCP Gateway, Coolify, Docker)
├── shared/                    # Reusable code (UI components, auth, types)
├── docs/                      # Documentation
│   ├── architecture.md        # Complete system architecture
│   └── guides/                # Implementation guides
├── agents/                    # ADW outputs and state
├── trees/                     # ADW worktrees (gitignored)
├── CONTEXT_MAP.md             # ⭐ Single source of truth for navigation
├── CLAUDE.md                  # This file - engineering rules
└── .claude/                   # Commands and hooks
    ├── commands/              # Slash commands for agents
    └── hooks/                 # Event hooks
```

## Multi-Tenant Database Strategy

```sql
-- Unified authentication
shared_users_db
  ├── users              -- Core user accounts
  ├── user_entities      -- Entity access mapping
  └── sessions           -- Active sessions

-- Kids Ascension data
kids_ascension_db
  ├── videos             -- Educational videos
  ├── courses            -- Course structure
  └── progress           -- User progress

-- Ozean Licht data
ozean_licht_db
  ├── courses            -- Community courses
  ├── members            -- Member profiles
  └── content            -- Platform content
```

**Rationale:** Legal separation while sharing infrastructure. Users can have accounts on both platforms with unified auth.

## Three-Tier Storage System

1. **MinIO (Hot)** - Staging before moderation (local SSD ~3000 MB/s)
2. **Cloudflare R2 (Cold)** - Permanent archive ($0.015/GB/month, zero egress)
3. **Cloudflare Stream (CDN)** - Video delivery (adaptive bitrate, global edge)

**Flow:** Upload → MinIO → Approval → R2 (original) + Stream (transcoded) → Users watch

## Common Pitfalls & Solutions

### Worktree Issues
- **Error**: "Worktree validation failed for ADW {adw_id}"
- **Solution**: Run entry point workflow first (`adw_plan_iso.py`) to create worktree

### Port Conflicts
- **Error**: "Port 9100 already in use"
- **Solution**: ADW auto-allocates unique ports. If all 15 busy, wait or clean up worktrees

### Database Mixing
- **Error**: Cannot query across `kids_ascension_db` and `ozean_licht_db`
- **Solution**: Use application-level joins. Reference `shared_users_db` via `user_id`

## Critical Files for Context

- `CONTEXT_MAP.md` - ⭐ Line-based navigation (READ THIS FIRST!)
- `docs/architecture.md` - Complete system architecture (2900+ lines)
- `adws/README.md` - ADW workflow documentation
- `tools/mcp-gateway/README.md` - MCP Gateway docs
- `.claude/commands/*.md` - All slash command definitions

## Health Checks

```bash
# MCP Gateway
curl http://localhost:8100/health

# Check all infrastructure
docker ps | grep -E "(postgres|minio|mem0|mcp-gateway)"

# ADW state
cat agents/{adw_id}/adw_state.json | jq .
```

## Philosophy

**Zero Touch Engineering (ZTE):** Humans define "what", agents determine "how" through isolated workflows. Goal is complete SDLC automation from issue to production.

**Institutional Memory:** Every workflow stores learnings in Mem0, compounding knowledge over time. Future agents benefit from past patterns and solutions.

**Legal Separation with Technical Unity:** Two independent entities share cost-efficient infrastructure while maintaining clear database boundaries.

---

**Last Updated:** 2025-11-06
**Repository:** Private monorepo - ozean-licht-ecosystem
**Maintainer:** Sergej Götz (via autonomous agents)

**⭐ Remember: Check `CONTEXT_MAP.md` first for navigation!**
