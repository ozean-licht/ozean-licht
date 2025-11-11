# Memory Tools - Institutional Memory System

## Overview

The Memory Tools provide a comprehensive system for agents to save, search, and retrieve valuable patterns using Mem0 through the progressive disclosure tool system. This enables agents to build institutional knowledge and reduce friction in future workflows by learning from past experiences.

## Purpose

- **Save valuable patterns** for future reference
- **Search institutional memory** using semantic search
- **Build agent knowledge base** over time
- **Reduce friction** by reusing proven solutions
- **Learn from past experiences** across agent sessions

## Quick Start

### Save a Memory
```bash
# Simple save
bash tools/memory/save.sh "Use connection pooling for database queries"

# Save with category
bash tools/memory/save.sh "Admin dashboard uses NextAuth for authentication" --category=decision

# Save structured pattern
bash tools/memory/save.sh "$(cat <<'EOF'
Category: solution
Problem: MCP Gateway failing health checks
Solution: Increased DB_POOL_MAX from 10 to 20
Prevention: Monitor pool metrics at /metrics endpoint
Files: tools/mcp-gateway/.env
EOF
)" --category=solution
```

### Search Memories
```bash
# Semantic search
bash tools/memory/search.sh "database connection issues"

# Limit results
bash tools/memory/search.sh "authentication" --limit=5

# Filter by user
bash tools/memory/search.sh "deployment" --user-id=agent_claude_code
```

### List Patterns
```bash
# View all patterns
bash tools/memory/patterns.sh

# Filter by category
bash tools/memory/patterns.sh --category=pattern
bash tools/memory/patterns.sh --category=solution
bash tools/memory/patterns.sh --category=error
```

## Pattern Categories

The system supports five core pattern categories:

### 1. Pattern
Reusable implementation approaches and code patterns.

**Example:**
```bash
bash tools/memory/save.sh "Pattern: Use progressive disclosure to reduce context usage by 85%" --category=pattern
```

### 2. Decision
Architecture and design decisions with rationale.

**Example:**
```bash
bash tools/memory/save.sh "Decision: Using NextAuth for admin dashboard due to built-in session management" --category=decision
```

### 3. Solution
Problem-solution pairs for common issues.

**Example:**
```bash
bash tools/memory/save.sh "Solution: PostgreSQL connection refused - increased DB_POOL_MAX to 20" --category=solution
```

### 4. Error
Error patterns and their resolutions.

**Example:**
```bash
bash tools/memory/save.sh "Error: 500 on /health endpoint - exhausted connection pool" --category=error
```

### 5. Workflow
Successful workflow sequences.

**Example:**
```bash
bash tools/memory/save.sh "Workflow: Deploy admin dashboard - build → test → deploy → verify health" --category=workflow
```

## Available Commands

### Core Operations

#### `save.sh` - Save Memory
```bash
bash tools/memory/save.sh <content> [--category=type] [--user-id=id]

# Examples:
bash tools/memory/save.sh "Use connection pooling"
bash tools/memory/save.sh "NextAuth decision" --category=decision
bash tools/memory/save.sh "Pattern text" --user-id=agent_custom
```

#### `search.sh` - Search Memories
```bash
bash tools/memory/search.sh <query> [--limit=N] [--user-id=id]

# Examples:
bash tools/memory/search.sh "database"
bash tools/memory/search.sh "auth" --limit=5
bash tools/memory/search.sh "deploy" --user-id=agent_claude_code
```

#### `get.sh` - Get All Memories
```bash
bash tools/memory/get.sh <user_id> [--limit=N] [--category=type]

# Examples:
bash tools/memory/get.sh agent_claude_code
bash tools/memory/get.sh agent_id --category=pattern
bash tools/memory/get.sh agent_id --limit=20
```

### Pattern Management

#### `patterns.sh` - List Patterns
```bash
bash tools/memory/patterns.sh [--category=type] [--limit=N]

# Examples:
bash tools/memory/patterns.sh
bash tools/memory/patterns.sh --category=solution
bash tools/memory/patterns.sh --category=error --limit=10
```

#### `stats.sh` - Usage Statistics
```bash
bash tools/memory/stats.sh

# Shows:
# - Total memory count
# - Breakdown by category
# - User/agent distribution
# - Most active users
```

### Service Management

#### `health.sh` - Service Health
```bash
bash tools/memory/health.sh

# Checks:
# - MCP Gateway connectivity
# - Mem0 service status
# - Qdrant connection
# - Response latency
```

#### `delete.sh` - Delete Memory
```bash
bash tools/memory/delete.sh <memory_id> [--force]

# Examples:
bash tools/memory/delete.sh mem_abc123
bash tools/memory/delete.sh mem_abc123 --force  # Skip confirmation
```

#### `update.sh` - Update Memory
```bash
bash tools/memory/update.sh <memory_id> <new_content>

# Example:
bash tools/memory/update.sh mem_abc123 "Updated pattern text"
```

## When to Save Memories

### ✅ Save a memory when you:

- **Solve a non-trivial problem** that could recur
- **Make an architectural decision** with important trade-offs
- **Discover a useful pattern** or implementation approach
- **Resolve an error** that wasn't immediately obvious
- **Complete a complex workflow** that worked well
- **Learn something important** about the codebase structure

### ❌ Don't save when:

- Following **standard documented procedures**
- Making **trivial changes** (typo fixes, formatting)
- Information is **already in documentation**
- Solution is **one-off** and context-specific

## Memory Best Practices

### 1. Be Specific
Include concrete details: file paths, error messages, tool versions.

```bash
# Good
bash tools/memory/save.sh "Solution: MCP Gateway 500 errors - increased DB_POOL_MAX from 10 to 20 in tools/mcp-gateway/.env" --category=solution

# Too vague
bash tools/memory/save.sh "Fixed database issue" --category=solution
```

### 2. Add Context
Explain when and why this matters.

```bash
# Good
bash tools/memory/save.sh "Decision: NextAuth for admin dashboard - provides built-in session management, JWT support, and OAuth integration out of the box" --category=decision

# Missing context
bash tools/memory/save.sh "Using NextAuth" --category=decision
```

### 3. Link Related Info
Reference related patterns, files, or tools.

```bash
bash tools/memory/save.sh "Pattern: Progressive disclosure reduces context by 85%. Related: tools/discover.sh, tools/what.sh, tools/templates/shared.sh" --category=pattern
```

### 4. Use Categories
Proper categorization improves retrieval.

```bash
# Use appropriate category
bash tools/memory/save.sh "Content" --category=pattern   # For reusable patterns
bash tools/memory/save.sh "Content" --category=decision  # For architecture choices
bash tools/memory/save.sh "Content" --category=solution  # For problem fixes
bash tools/memory/save.sh "Content" --category=error     # For error resolutions
bash tools/memory/save.sh "Content" --category=workflow  # For process sequences
```

### 5. Update Don't Duplicate
Search first, update existing memories when appropriate.

```bash
# Search first
bash tools/memory/search.sh "database connection"

# If similar exists, update instead of creating new
bash tools/memory/update.sh mem_abc123 "Updated solution"
```

### 6. Quality Over Quantity
One good memory is better than five vague ones.

## Common Workflows

### Workflow 1: Before Starting Work
```bash
# Search for relevant patterns
bash tools/memory/search.sh "authentication implementation"
bash tools/memory/search.sh "database migration"

# List patterns by category
bash tools/memory/patterns.sh --category=pattern
```

### Workflow 2: During Development
```bash
# Save architectural decision
bash tools/memory/save.sh "Decision: Using tRPC for type-safe API calls between frontend and backend" --category=decision

# Save discovered pattern
bash tools/memory/save.sh "Pattern: Use Zod schemas for both validation and TypeScript types" --category=pattern
```

### Workflow 3: After Debugging
```bash
# Search for similar errors
bash tools/memory/search.sh "connection refused postgres"

# Save resolution
bash tools/memory/save.sh "Error: PostgreSQL 'connection refused' - check DB_HOST in .env was localhost instead of container name" --category=error
```

### Workflow 4: After Complex Task
```bash
# Save successful workflow
bash tools/memory/save.sh "$(cat <<'EOF'
Workflow: Deploy admin dashboard to production
Steps:
1. Run tests: pnpm --filter admin test
2. Build: pnpm --filter admin build
3. Deploy: bash tools/deployment/deploy.sh 3
4. Verify: bash tools/deployment/status.sh 3
5. Check health: curl http://admin.ozean-licht.dev/api/health
Duration: ~5 minutes
Success: ✓
EOF
)" --category=workflow
```

## Integration with Progressive Disclosure

Memory tools are integrated with the progressive disclosure system:

### Discovery
```bash
bash tools/discover.sh  # Shows memory category
bash tools/what.sh "save pattern"  # Routes to memory tools
```

### Navigation
All commands support navigation breadcrumbs and `--explain` mode:

```bash
bash tools/memory/save.sh --explain
bash tools/memory/search.sh --explain
bash tools/memory/patterns.sh --explain
```

## Architecture

### MCP Gateway Integration
All memory operations use the MCP Gateway Mem0 handler:

- **Endpoint:** `http://localhost:8100/mcp/mem0`
- **Authentication:** Bypassed for localhost
- **Operations:** remember, search, get-context, delete, update, list, health

### Metadata Structure
Each memory includes structured metadata:

```json
{
  "id": "mem_abc123",
  "user_id": "agent_claude_code",
  "content": "Pattern or solution text",
  "metadata": {
    "category": "pattern|decision|solution|error|workflow",
    "source": "memory-cli",
    "timestamp": "2025-11-11T12:00:00Z"
  },
  "created_at": "2025-11-11T12:00:00Z"
}
```

### Vector Search
Mem0 uses Qdrant for semantic vector search:

- **Embedding Model:** Configurable in Mem0 service
- **Similarity Threshold:** 0.7 (default)
- **Max Results:** 10 (default, configurable)

## Troubleshooting

### Memory Save Failed

**Problem:** Cannot save memory
```bash
bash tools/memory/save.sh "content"
# Error: Failed to save memory (HTTP 500)
```

**Solution:**
```bash
# 1. Check MCP Gateway health
bash tools/memory/health.sh

# 2. Check MCP Gateway logs
docker logs mcp-gateway

# 3. Verify Mem0 service
docker ps | grep mem0

# 4. Restart MCP Gateway if needed
docker restart mcp-gateway
```

### Search Returns No Results

**Problem:** Search doesn't find expected memories
```bash
bash tools/memory/search.sh "database"
# No memories found
```

**Solution:**
```bash
# 1. Try broader search terms
bash tools/memory/search.sh "db"

# 2. List all patterns to verify data exists
bash tools/memory/patterns.sh

# 3. Get all for specific user
bash tools/memory/get.sh agent_claude_code

# 4. Check stats to verify memories exist
bash tools/memory/stats.sh
```

### Service Unhealthy

**Problem:** Health check fails
```bash
bash tools/memory/health.sh
# Service Status: Unhealthy
```

**Solution:**
```bash
# 1. Check MCP Gateway is running
docker ps | grep mcp-gateway

# 2. Start MCP Gateway if stopped
cd tools/mcp-gateway && npm run dev

# 3. Check Mem0 service
docker ps | grep mem0

# 4. View logs for errors
docker logs mcp-gateway
docker logs mem0
```

## Performance

- **Save operation:** 1-2 seconds
- **Search operation:** 2-4 seconds (semantic vector search)
- **Get operation:** 1-2 seconds
- **Health check:** < 1 second

## Related Documentation

- **Pattern Templates:** `tools/memory/PATTERNS.md`
- **Tool Catalog:** `tools/inventory/tool-catalog.json`
- **Agent Guidelines:** `.claude/CLAUDE.md`
- **Context Map:** `CONTEXT_MAP.md`
- **MCP Gateway:** `tools/mcp-gateway/README.md`

## Examples from Real Workflows

### Example 1: Database Connection Pattern
```bash
bash tools/memory/save.sh "Pattern: Always use connection pooling for PostgreSQL queries. Set DB_POOL_MIN=2 and DB_POOL_MAX=20 in .env. Monitor pool stats at /metrics endpoint." --category=pattern
```

### Example 2: Deployment Decision
```bash
bash tools/memory/save.sh "Decision: Using Coolify for deployment instead of manual Docker Compose. Rationale: Built-in CI/CD, automatic SSL, easier rollbacks, better monitoring. Trade-off: Adds another abstraction layer." --category=decision
```

### Example 3: Auth Error Solution
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Solution: NextAuth session undefined in API routes
Problem: req.session always undefined despite successful login
Root Cause: Missing getServerSession import from next-auth
Solution: Import { getServerSession } from "next-auth" and use getServerSession(req, res, authOptions)
Files: apps/admin/pages/api/**/*.ts
Prevention: Always use getServerSession for API routes, useSession for client components
EOF
)" --category=solution
```

### Example 4: Successful Workflow
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Workflow: Complete MCP handler implementation
Steps:
1. Define interface in src/mcp/protocol/types.ts
2. Implement handler in src/mcp/handlers/service.ts
3. Add route in src/routes/mcp.ts
4. Update config in config/mcp-catalog.json
5. Write tests in tests/unit/handlers/service.test.ts
6. Test manually: curl localhost:8100/mcp/service
Duration: ~30 minutes for simple handler
Success: ✓ All tests passing
EOF
)" --category=workflow
```

## Support

For issues or questions:

1. Check health: `bash tools/memory/health.sh`
2. View stats: `bash tools/memory/stats.sh`
3. Check logs: `docker logs mcp-gateway`
4. Review docs: `tools/memory/PATTERNS.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintainer:** Ozean Licht Infrastructure Team
