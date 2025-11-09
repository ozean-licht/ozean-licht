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

## Command Discovery & Multi-Root Workspace

### Understanding Command Availability

Claude Code slash commands are discovered from `.claude/commands/` relative to where you opened the editor. This creates context-specific command availability:

| Context | Commands Available | Count |
|---------|-------------------|-------|
| **Root** | All root commands | 32 |
| **Orchestrator** | Root + Orchestrator commands | 50 (32+18) |
| **Other Apps** | Root commands only | 32 |
| **Multi-Root Workspace** ⭐ | ALL commands from ALL contexts | 50 |

### Quick Reference

```bash
# View all available commands
ls -la .claude/commands/
ls -la apps/orchestrator_3_stream/.claude/commands/

# Open in multi-root workspace (RECOMMENDED)
code ozean-licht-ecosystem.code-workspace

# Navigate to specific context
cd apps/orchestrator_3_stream  # Access orchestrator commands
```

### Multi-Root Workspace (Best Practice)

**Problem**: Opening Claude Code at repository root means orchestrator-specific commands like `/orch_scout_and_build` are not discoverable.

**Solution**: Use `ozean-licht-ecosystem.code-workspace` which defines all major folders as workspace roots with the critical setting:

```json
{
  "settings": {
    "claude.commands.scanWorkspace": true
  }
}
```

This enables Claude Code to scan ALL workspace folders for commands simultaneously.

**Benefits**:
- ✅ Access ALL 50 commands regardless of active folder
- ✅ No need to navigate between directories
- ✅ Maintain full repository context in Explorer
- ✅ Consistent command availability across development
- ✅ Both root AND orchestrator commands always available

**Workspace Folders**:
- 🏠 Root (Ecosystem) - 32 root commands + ADW workflows
- 🎓 Kids Ascension - Root commands + app context
- 🌊 Ozean Licht - Root commands + app context
- ⚙️ Admin Dashboard - Root commands + app context
- 🤖 Orchestrator 3 Stream - 50 commands (32 root + 18 orchestrator)
- 🔧 MCP Gateway - Root commands + tool context
- 🚀 Coolify Config - Root commands
- 🐳 Docker Services - Root commands
- 🤖 ADW Workflows - Root commands + ADW context
- 📚 Documentation - Root commands
- 🧩 Shared Libraries - Root commands
- 🎥 Video Translator - Root commands + app context
- 📅 Event Calendar - Root commands + app context

### Command Categories

#### Primary Commands (Always Available)
- `/plan` - Create implementation plans
- `/bug` - Bug fixes with structured workflow
- `/feature` - Feature implementation
- `/test` - Run test suites
- `/health_check` - System diagnostics

#### Orchestrator Commands (Only in Orchestrator Context)
- `/orch_scout_and_build` - Scout → Build workflow
- `/orch_plan_w_scouts_build_review` - Full scout pipeline
- `/plan_w_scouters` - Planning with multiple scouts
- `/build_in_parallel` - Parallel agent execution

**See `.claude/README.md` for complete command catalog.**

### Troubleshooting Command Discovery

#### Missing Orchestrator Commands

```bash
# Verify orchestrator commands exist
ls -la apps/orchestrator_3_stream/.claude/commands/

# Option 1: Use multi-root workspace (recommended)
code ozean-licht-ecosystem.code-workspace

# Option 2: Navigate to orchestrator
cd apps/orchestrator_3_stream
# Restart Claude Code in this directory
```

#### Commands Not Loading at All

```bash
# Verify .claude directory exists
ls -la .claude/

# Check command file syntax
head -n 5 .claude/commands/plan.md
# Should show valid frontmatter:
# ---
# description: Command description
# ---
```

#### ADW Worktree Commands

ADW worktrees (`trees/{adw_id}/`) receive `.claude/` copied by `adw_plan_iso.py`. If commands are missing:

```bash
# Verify .claude was copied to worktree
ls -la trees/{adw_id}/.claude/commands/

# If missing, entry point workflow wasn't run
cd adws/
uv run adw_plan_iso.py <issue-number>
```

### References

- **Complete Command Catalog**: `.claude/README.md` (60 commands documented)
- **Implementation Plan**: `specs/implementation_command_palette_fix.md`
- **Orchestrator Discovery Logic**: `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py`

## Command Architecture: o-commands vs a-commands

### Separation of Concerns

Commands are organized into two categories to eliminate duplication and provide clear architectural boundaries:

1. **a-commands** (Application/ADW Commands)
   - **Location**: `.claude/a-commands/`
   - **Purpose**: Development workflows, ADW operations, codebase utilities
   - **Examples**: `/plan`, `/build`, `/prime`, `/question`, `/quick-plan`
   - **Count**: 13 commands
   - **Usage**: Root-level development, ADW workflows, general operations

2. **o-commands** (Orchestrator Commands)
   - **Location**: `.claude/o-commands/`
   - **Purpose**: Agent orchestration, multi-agent workflows, parallel execution
   - **Examples**: `/orch_scout_and_build`, `/parallel_subagents`, `/build_in_parallel`
   - **Count**: 7 commands
   - **Usage**: Orchestrator-specific agent coordination

### Command Discovery via Symlinks

The system uses symlinks to route commands to the correct context without duplication:

```
.claude/
├── a-commands/              # Application commands (source of truth)
│   ├── plan.md
│   ├── build.md
│   ├── prime.md
│   └── ... (13 total)
├── o-commands/              # Orchestrator commands (source of truth)
│   ├── orch_scout_and_build.md
│   ├── parallel_subagents.md
│   └── ... (7 total)
├── commands -> a-commands   # Symlink: root sees ADW commands
└── agents/                  # Shared agent templates (7 total)

apps/orchestrator_3_stream/.claude/
├── commands -> ../../../.claude/o-commands  # Symlink: orchestrator sees orchestrator commands
└── agents -> ../../../.claude/agents        # Symlink: shared agent templates
```

**How It Works:**
- **Root context**: `.claude/commands/` → `a-commands/` (13 ADW commands available)
- **Orchestrator context**: `apps/orchestrator/.claude/commands/` → `../../.claude/o-commands/` (7 orchestrator commands available)
- **Agent templates**: Both contexts share `.claude/agents/` via symlinks (zero duplication)

### Benefits

- ✅ **Zero Duplication**: Each command exists in exactly one location
- ✅ **Clear Separation**: Obvious which commands are for which purpose
- ✅ **Single Source of Truth**: Update once, change propagates automatically
- ✅ **Easy Maintenance**: Add command to correct directory, symlink handles routing
- ✅ **Backward Compatible**: Existing code and references work unchanged
- ✅ **Simplified Discovery**: Symlinks encode routing logic, no complex merging needed

### Quick Reference

| Context | Commands Available | Directory | Count |
|---------|-------------------|-----------|-------|
| **Root** | ADW/Application | `.claude/commands/` → `a-commands/` | 13 |
| **Orchestrator** | Orchestrator-specific | `apps/orchestrator/.claude/commands/` → `../../.claude/o-commands/` | 7 |
| **Agents** | Shared templates | `.claude/agents/` (no symlink at root) | 7 |
| | | `apps/orchestrator/.claude/agents/` → `../../.claude/agents/` | |

### Adding New Commands

**ADW/Application Command:**
```bash
# Add to a-commands directory
vi .claude/a-commands/my-new-workflow.md

# Automatically available at root via symlink!
```

**Orchestrator Command:**
```bash
# Add to o-commands directory
vi .claude/o-commands/orch_my_orchestration.md

# Automatically available in orchestrator via symlink!
```

**Agent Template:**
```bash
# Add to shared agents directory
vi .claude/agents/my-specialist-agent.md

# Automatically available in all contexts!
```

### Command Categorization Guidelines

When creating new commands, categorize by purpose:

| Command Type | Category | Examples |
|--------------|----------|----------|
| Single-agent workflow | a-commands | `/plan`, `/build`, `/test` |
| Multi-agent orchestration | o-commands | `/orch_*`, `/build_in_parallel` |
| Codebase utilities | a-commands | `/prime`, `/question`, `/find_and_summarize` |
| Parallel execution | o-commands | `/parallel_subagents` |
| Development workflows | a-commands | `/feature`, `/bug`, `/patch` |

**Naming Conventions:**
- **Orchestrator commands**: Prefix with `orch_` OR contain `parallel` in name
- **Application commands**: No prefix, descriptive action verbs
- **Utility commands**: Short, clear names (`prime`, `reset`, `question`)

### Complete Command Lists

**a-commands (13 total):**
1. `plan.md` - Create implementation plans
2. `build.md` - Build based on plan
3. `prime.md` - Prime codebase understanding
4. `prime_3.md` - Enhanced priming (v3)
5. `prime_cc.md` - Prime Claude Code context
6. `question.md` - Q&A mode without changes
7. `quick-plan.md` - Fast planning
8. `find_and_summarize.md` - Find and document files
9. `load_ai_docs.md` - Load AI documentation
10. `load_bundle.md` - Load context bundle
11. `all_tools.md` - List available tools
12. `t_metaprompt_workflow.md` - Create slash commands
13. `reset.md` - Reset orchestrator context

**o-commands (7 total):**
1. `orch_scout_and_build.md` - Scout → Build workflow
2. `orch_one_shot_agent.md` - One-shot agent creation
3. `orch_plan_w_scouts_build_review.md` - Full scout pipeline
4. `orch_trinity_mode.md` - Trinity mode orchestration
5. `build_in_parallel.md` - Parallel build execution
6. `plan_w_scouters.md` - Planning with scouts
7. `parallel_subagents.md` - Parallel subagent execution

### Migration Status

**Current State**: Planning phase - architecture documented, migration ready to execute

**Migration Guide**: See `docs/guides/o-commands-a-commands-migration.md` for complete migration instructions

**Related Documentation**:
- Migration Guide: `docs/guides/o-commands-a-commands-migration.md`
- Migration Strategy: `specs/practical-o-commands-a-commands-migration-strategy.md`
- Command Discovery: This section + Multi-Root Workspace section above
- Context Map: `CONTEXT_MAP.md` (Claude Code Configuration)

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
