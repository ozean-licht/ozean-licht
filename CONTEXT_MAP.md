# Context Map - Ozean Licht Ecosystem

> **Single Source of Truth for Agent Navigation**
>
> This document provides line-number-based navigation to enable fast, reliable code discovery without repeated searching. Each chapter contains precise file locations and key concepts.

## How to Use This Context Map

1. **Find Your Chapter** - Browse the table of contents below
2. **Jump to Line Range** - Use the line numbers to navigate directly
3. **Locate Files** - Each section lists exact file paths
4. **Understand Context** - Read descriptions to understand what code does

---

## Table of Contents

- [Lines 30-150](#lines-30-150-repository-overview--quick-start) - Repository Overview & Quick Start
- [Lines 151-350](#lines-151-350-apps-directory-structure) - Apps Directory Structure
  - [Lines 151-230](#lines-151-230-admin-dashboard) - Admin Dashboard
  - [Lines 231-290](#lines-231-290-kids-ascension) - Kids Ascension
  - [Lines 291-350](#lines-291-350-ozean-licht) - Ozean Licht
- [Lines 351-550](#lines-351-550-infrastructure) - Infrastructure
  - [Lines 351-470](#lines-351-470-mcp-gateway) - MCP Gateway
  - [Lines 471-510](#lines-471-510-coolify-configuration) - Coolify Configuration
  - [Lines 511-550](#lines-511-550-docker--services) - Docker & Services
- [Lines 551-750](#lines-551-750-autonomous-development-workflows-adw) - Autonomous Development Workflows (ADW)
  - [Lines 551-630](#lines-551-630-core-modules) - Core Modules
  - [Lines 631-700](#lines-631-700-workflow-scripts) - Workflow Scripts
  - [Lines 701-750](#lines-701-750-triggers--automation) - Triggers & Automation
- [Lines 751-850](#lines-751-850-shared-libraries) - Shared Libraries
- [Lines 851-950](#lines-851-950-documentation) - Documentation
- [Lines 951-1050](#lines-951-1050-configuration-files) - Configuration Files

---

## Lines 30-150: Repository Overview & Quick Start

### Purpose
Entry point for understanding the entire ecosystem, installation, and development setup.

### Key Files
- `README.md` - Main repository documentation
- `CLAUDE.md` - AI agent instructions and patterns
- `package.json` - Root package configuration
- `.gitignore` - Git ignore patterns
- `example.env` - Environment variable template

### Core Concepts
- **Monorepo Structure**: Two Austrian associations sharing infrastructure
- **Kids Ascension**: Free educational platform for children (ages 6-14)
- **Ozean Licht**: Content platform for courses and community
- **Unified Auth**: Single sign-on across platforms
- **Multi-tenant DB**: Separate databases with shared infrastructure

### Common Operations
```bash
# Clone and setup
git clone https://github.com/ozean-licht/ecosystem.git
cd ozean-licht-ecosystem
pnpm install

# Start development
pnpm --filter admin dev         # Admin dashboard (port 9200)
pnpm --filter @ka/web dev        # Kids Ascension (port 3000)
pnpm --filter @ol/web dev        # Ozean Licht (port 3001)
```

---

## Lines 151-350: Apps Directory Structure

### Purpose
Applications that serve end users - admin dashboards, frontend platforms, and specialized services.

---

### Lines 151-230: Admin Dashboard

**Location**: `apps/admin/`

#### Purpose
Unified admin interface for both Kids Ascension and Ozean Licht platforms with NextAuth authentication.

#### Key Files
- `apps/admin/package.json` - Dependencies and scripts
- `apps/admin/app/` - Next.js app directory
  - `apps/admin/app/(auth)/login/page.tsx` - Login page
  - `apps/admin/app/(dashboard)/page.tsx` - Dashboard home
  - `apps/admin/app/(dashboard)/health/page.tsx` - System health monitoring
  - `apps/admin/app/dashboard/storage/page.tsx` - MinIO storage management
- `apps/admin/lib/` - Shared libraries
  - `apps/admin/lib/auth/config.ts` - NextAuth configuration
  - `apps/admin/lib/mcp-client/` - MCP Gateway client
- `apps/admin/types/` - TypeScript type definitions
- `apps/admin/middleware.ts` - Route protection
- `apps/admin/migrations/` - Database migrations

#### Features
- NextAuth.js v5 authentication
- Role-based access control (RBAC)
- Session management with JWT
- Audit logging for admin actions
- MCP Gateway integration
- MinIO S3 storage operations
- System health monitoring

#### Common Operations
```bash
# Development
cd apps/admin
npm run dev                    # Start on port 9200

# Testing
npm test                       # Unit tests
npm run test:e2e               # E2E tests

# Database
npm run seed:test-admin        # Create test users
```

#### Documentation
- `apps/admin/app_docs/features/nextauth-admin-authentication.md`
- `apps/admin/app_docs/features/minio-s3-storage-integration.md`
- `apps/admin/app_docs/features/system-health-monitoring.md`

---

### Lines 231-290: Kids Ascension

**Location**: `apps/kids-ascension/`

#### Purpose
Educational platform liberating children through self-paced, teacher-quality learning.

#### Key Structure
- `apps/kids-ascension/README.md` - Platform documentation
- `apps/kids-ascension/docs/` - Product requirements and guides
- `apps/kids-ascension/app_docs/` - Feature documentation
- `apps/kids-ascension/specs/` - Implementation specifications

#### Core Values
- Education is a Human Right (100% free, lifetime)
- Creator Autonomy (full content rights)
- Parent Authority (final say)
- Open Governance (transparent review)

#### Features
- Video courses for ages 6-14
- Self-paced learning paths
- Parent/child account management
- Progress tracking
- Video streaming via Cloudflare Stream

#### Tech Stack
- React + TypeScript
- Cloudflare Stream (video delivery)
- PostgreSQL (`kids_ascension_db`)
- Prisma ORM

---

### Lines 291-350: Ozean Licht

**Location**: `apps/ozean-licht/`

#### Purpose
Content platform for courses and community (currently in foundation phase).

#### Key Files
- `apps/ozean-licht/README.md` - Platform overview
- `apps/ozean-licht/package.json` - Dependencies
- `apps/ozean-licht/app_docs/` - Documentation
- `apps/ozean-licht/specs/` - Specifications

#### Planned Features
- Course management system
- Member portal
- Event calendar integration
- Community forums
- Content delivery

#### Tech Stack
- React + TypeScript (planned)
- PostgreSQL (`ozean_licht_db`)
- Shared authentication via `shared_users_db`

---

## Lines 351-550: Infrastructure

### Purpose
DevOps configurations, services, and infrastructure management.

---

### Lines 351-470: MCP Gateway

**Location**: `tools/mcp-gateway/`

#### Purpose
Unified gateway for autonomous agents to access tools via Model Context Protocol.

#### Key Files
- `tools/mcp-gateway/src/server.ts` - Main server entry point
- `tools/mcp-gateway/src/mcp/handlers/` - Service handlers
  - `postgres.ts` - PostgreSQL operations
  - `mem0.ts` - Memory storage operations
  - `cloudflare.ts` - CDN and Stream operations
  - `github.ts` - Repository management
  - `minio.ts` - S3-compatible storage
  - `n8n.ts` - Workflow automation
- `tools/mcp-gateway/src/monitoring/` - Health and metrics
- `tools/mcp-gateway/config/mcp-catalog.json` - Service catalog

#### Available Services
- **PostgreSQL**: Multi-tenant database operations
- **Mem0**: Agent memory with vector search
- **Cloudflare**: Stream, DNS, zones, analytics
- **GitHub**: Repos, PRs, issues, workflows
- **N8N**: Workflow execution and webhooks
- **MinIO**: S3-compatible file storage

#### Endpoints
- `POST /mcp/execute` - Execute slash commands
- `POST /mcp/rpc` - JSON-RPC interface
- `GET /mcp/catalog` - List available services
- `GET /health` - Health check
- `GET /ready` - Readiness probe

#### Common Operations
```bash
# Start gateway
cd tools/mcp-gateway
npm run dev                    # Port 8100

# Health check
curl http://localhost:8100/health

# Query database
/mcp-postgres kids-ascension-db query "SELECT * FROM videos LIMIT 10"

# Memory operations
/mcp-mem0 remember "Pattern: Use connection pooling"
/mcp-mem0 search "optimization patterns"
```

#### Documentation
- `tools/mcp-gateway/README.md`
- `tools/mcp-gateway/docs/architecture.md`

---

### Lines 471-510: Coolify Configuration

**Location**: `tools/coolify/`

#### Purpose
Self-hosted PaaS configurations for all services.

#### Key Files
- `tools/coolify/mcp-gateway-config.md`
- `tools/coolify/postgres-config.md`
- `tools/coolify/mem0-config.md`
- `tools/coolify/n8n-config.md`
- `tools/coolify/literag-config.md`

#### Deployed Services
- MCP Gateway (port 8100)
- PostgreSQL instances (4 databases)
- MinIO (S3 storage)
- Mem0 (vector memory)
- N8N (automation)

---

### Lines 511-550: Docker & Services

**Location**: `tools/docker/`

#### Purpose
Docker Compose configurations for local development.

#### Key Files
- `tools/docker/docker-compose.yml` - Main compose file
- `tools/docker/postgres/init.sql` - Database initialization

#### Current Infrastructure
- **Server**: Hetzner AX42 ($50/mo)
  - AMD Ryzen 5 3600 (6c/12t)
  - 64GB RAM
  - 2x512GB NVMe SSD
- **Orchestration**: Coolify
- **Databases**: PostgreSQL 15-17 (multi-tenant)
- **Storage**: MinIO → Cloudflare R2 → Cloudflare Stream

---

## Lines 551-750: Autonomous Development Workflows (ADW)

### Purpose
AI-driven development system enabling Zero Touch Engineering.

**Location**: `adws/`

---

### Lines 551-630: Core Modules

#### Purpose
Reusable Python modules for ADW workflows.

#### Key Files
- `adws/adw_modules/agent.py` - Claude Code CLI integration
- `adws/adw_modules/state.py` - ADWState management
- `adws/adw_modules/worktree_ops.py` - Git worktree & port management
- `adws/adw_modules/workflow_ops.py` - Core workflow logic
- `adws/adw_modules/git_ops.py` - Git operations with cwd support
- `adws/adw_modules/github.py` - GitHub API operations
- `adws/adw_modules/mcp_integration.py` - MCP Gateway integration
- `adws/adw_modules/r2_uploader.py` - Cloudflare R2 uploads
- `adws/adw_modules/utils.py` - Utility functions
- `adws/adw_modules/data_types.py` - Pydantic models

#### Core Concepts
- **Isolated Execution**: Each workflow in separate git worktree
- **Port Allocation**: Backend (9100-9114), Frontend (9200-9214)
- **ADW ID**: 8-character unique identifier per workflow
- **State Persistence**: JSON files in `agents/{adw_id}/`
- **15 Concurrent Workflows**: Full filesystem and network isolation

---

### Lines 631-700: Workflow Scripts

#### Purpose
Executable workflow scripts for different development phases.

#### Entry Point Workflows (Create Worktrees)
- `adws/adw_plan_iso.py` - Planning phase
- `adws/adw_patch_iso.py` - Quick patches

#### Dependent Workflows (Require Worktree)
- `adws/adw_build_iso.py` - Implementation phase
- `adws/adw_test_iso.py` - Testing phase
- `adws/adw_review_iso.py` - Review phase
- `adws/adw_document_iso.py` - Documentation phase
- `adws/adw_ship_iso.py` - Shipping (approve & merge)

#### Orchestrators
- `adws/adw_plan_build_iso.py` - Plan + Build
- `adws/adw_plan_build_test_iso.py` - Plan + Build + Test
- `adws/adw_plan_build_test_review_iso.py` - Full review pipeline
- `adws/adw_plan_build_review_iso.py` - Plan + Build + Review
- `adws/adw_plan_build_document_iso.py` - Plan + Build + Document
- `adws/adw_sdlc_iso.py` - Complete SDLC
- `adws/adw_sdlc_zte_iso.py` - Zero Touch Execution (auto-merge)

#### Common Operations
```bash
cd adws/

# Complete SDLC
uv run adw_sdlc_iso.py 123

# Individual phases
uv run adw_plan_iso.py 123
uv run adw_build_iso.py 123 abc12345
uv run adw_test_iso.py 123 abc12345
uv run adw_ship_iso.py 123 abc12345
```

---

### Lines 701-750: Triggers & Automation

**Location**: `adws/adw_triggers/`

#### Purpose
Automated workflow triggering via polling or webhooks.

#### Key Files
- `adws/adw_triggers/trigger_cron.py` - Polling monitor (20s interval)
- `adws/adw_triggers/trigger_webhook.py` - GitHub webhook server

#### Trigger Cron
```bash
uv run adw_triggers/trigger_cron.py
```
- Polls GitHub every 20 seconds
- Triggers on new issues with no comments
- Triggers when latest comment is exactly "adw"

#### Trigger Webhook
```bash
uv run adw_triggers/trigger_webhook.py  # Port 8001
```
- Real-time GitHub event processing
- Endpoints: `/gh-webhook`, `/health`
- Validates GitHub webhook signatures

---

## Lines 751-850: Shared Libraries

### Purpose
Reusable code shared across applications.

**Location**: `shared/`

#### Planned Structure
- `shared/ui-components/` - React components
- `shared/auth/` - Authentication logic
- `shared/database/` - Prisma client configs
- `shared/types/` - TypeScript types

#### Current Status
Foundation phase - structure defined in CLAUDE.md

---

## Lines 851-950: Documentation

### Purpose
Architecture guides, implementation specs, and knowledge base.

**Location**: `docs/`

#### Key Files
- `docs/architecture.md` - Complete system architecture (2900+ lines)
- `docs/guides/AGENTIC_SYSTEM_STRATEGY.md` - ADW philosophy
- `docs/guides/QUICK_START_ADW.md` - ADW quick start
- `docs/guides/AGENTIC_LAYER_INTEGRATION_MASTERCHECKLIST.md` - Integration checklist

#### App-Specific Documentation
- `apps/admin/app_docs/` - Admin dashboard features
- `apps/kids-ascension/app_docs/` - Kids Ascension features
- `apps/ozean-licht/app_docs/` - Ozean Licht features
- `app_docs/agentic_kpis.md` - Agentic KPIs tracking

---

## Lines 951-1050: Configuration Files

### Purpose
Environment variables, tool configurations, and settings.

#### Root Configuration
- `.env` - Environment variables (gitignored)
- `example.env` - Environment template
- `.gitignore` - Git ignore patterns
- `.mcp.json` - MCP server configuration
- `.ports.env` - ADW port allocations

#### Claude Code Configuration
- `.claude/settings.json` - Claude Code settings
- `.claude/settings.local.json` - Local overrides
- `.claude/commands/*.md` - 29 slash commands
- `.claude/hooks/*.py` - Event hooks

#### Database Configuration
- Multi-tenant PostgreSQL setup:
  - `shared_users_db` - Unified authentication
  - `kids_ascension_db` - KA-specific data
  - `ozean_licht_db` - OL-specific data

#### Storage Configuration
- **MinIO**: Staging uploads (localhost:9000)
- **Cloudflare R2**: Permanent archive
- **Cloudflare Stream**: CDN delivery

---

## Quick Reference Commands

### Navigation
```bash
# Find files quickly
grep -r "search term" apps/ tools/ adws/

# Count references
grep -r "pattern" . --include="*.ts" --include="*.py" | wc -l

# List directory structure
ls -R apps/ | head -50
```

### Development
```bash
# Start all services
pnpm --parallel dev

# Run tests
pnpm test
pnpm --filter @ka/web test:e2e

# Database migrations
pnpm --filter @ka/api prisma migrate dev
```

### ADW Operations
```bash
# Check worktrees
git worktree list

# View ADW state
cat agents/{adw_id}/adw_state.json | jq .

# Monitor ports
lsof -i :9100-9114  # Backend
lsof -i :9200-9214  # Frontend
```

### Infrastructure
```bash
# Health checks
curl http://localhost:8100/health  # MCP Gateway
docker ps | grep -E "(postgres|minio|mem0)"

# Logs
docker logs mcp-gateway -f
docker logs mem0 --tail 50
```

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0
**Maintainer**: Ozean Licht Team + Autonomous Agents
