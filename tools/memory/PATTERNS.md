# Pattern Library Templates

## Overview

This document provides structured templates for each pattern type in the memory system. Use these templates to ensure consistent, searchable, and valuable memories.

## Pattern Categories

1. **Pattern** - Reusable implementation approaches
2. **Decision** - Architecture and design decisions
3. **Solution** - Problem-solution pairs
4. **Error** - Error patterns and resolutions
5. **Workflow** - Successful workflow sequences

---

## 1. Pattern Template

### Purpose
Document reusable implementation approaches, code patterns, and best practices that can be applied across different contexts.

### Template Structure
```
Category: pattern
Type: [code|architecture|infrastructure|ui]
Context: [When to use this pattern]
Problem: [What problem does it solve]
Solution: [How to implement]
Example: [Code snippet or description]
Benefits: [Advantages of this approach]
Trade-offs: [Limitations or considerations]
Related: [Related patterns, files, or tools]
```

### Example 1: Connection Pooling Pattern
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: pattern
Type: infrastructure
Context: Database queries in server applications
Problem: Connection overhead and timeout errors under load
Solution: Use connection pooling with min/max limits
Example: DB_POOL_MIN=2, DB_POOL_MAX=20 in .env
Benefits: Reduced latency, better resource utilization, prevents exhaustion
Trade-offs: Memory overhead for idle connections
Related: tools/mcp-gateway/.env, PostgreSQL configuration
EOF
)" --category=pattern
```

### Example 2: Progressive Disclosure Pattern
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: pattern
Type: architecture
Context: Large tool collections causing context bloat
Problem: Loading all tools upfront consumes 20k+ tokens
Solution: Hierarchical navigation - discover categories, then drill down
Example: tools/discover.sh → tools/deployment/list.sh → tools/deployment/deploy.sh
Benefits: 85% context reduction, faster navigation, better UX
Trade-offs: Requires extra step for unfamiliar users
Related: tools/templates/shared.sh, progressive disclosure system
EOF
)" --category=pattern
```

### Example 3: Structured Metadata Pattern
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: pattern
Type: code
Context: API responses and data models
Problem: Inconsistent data structures make parsing difficult
Solution: Always include status, data, and metadata fields
Example: { status: "success", data: {...}, metadata: { timestamp, cost, service } }
Benefits: Predictable structure, easier error handling, better debugging
Trade-offs: Slightly larger payload size
Related: tools/mcp-gateway/src/mcp/protocol/types.ts
EOF
)" --category=pattern
```

---

## 2. Decision Template

### Purpose
Document architecture and design decisions, including rationale, alternatives considered, and trade-offs made.

### Template Structure
```
Category: decision
Context: [Situation requiring decision]
Problem: [Challenge or requirement]
Options: [Alternatives considered]
Chosen: [Selected option]
Rationale: [Why this was chosen]
Trade-offs: [Known limitations]
Impact: [What this affects]
Date: [When decided]
```

### Example 1: Authentication Decision
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: decision
Context: Admin dashboard authentication
Problem: Need secure, maintainable auth with session management
Options:
  1. Custom JWT implementation
  2. NextAuth.js
  3. Auth0 third-party service
Chosen: NextAuth.js
Rationale: Built-in session management, JWT support, OAuth providers, active community
Trade-offs: Opinionated structure, learning curve, some customization limits
Impact: apps/admin/pages/api/auth/[...nextauth].ts, all protected routes
Date: 2025-11-01
EOF
)" --category=decision
```

### Example 2: Database Decision
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: decision
Context: Multi-tenant database architecture
Problem: Need to isolate data between Kids Ascension and Ozean Licht
Options:
  1. Separate database servers
  2. Multiple databases on same server
  3. Single database with tenant_id columns
Chosen: Multiple databases on same server
Rationale: Balance between isolation and resource efficiency, easier backups
Trade-offs: More complex connection management, shared resource limits
Impact: PostgreSQL configuration, MCP Gateway connection pooling
Date: 2025-10-15
EOF
)" --category=decision
```

### Example 3: Tool System Decision
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: decision
Context: Agent tool selection (MCP vs scripts)
Problem: When to use MCP services vs direct CLI/API scripts
Options:
  1. Use MCP for everything (consistency)
  2. Use scripts for everything (performance)
  3. Hybrid approach (3-tier system)
Chosen: Hybrid 3-tier system
Rationale: Tier 1 (native CLI) for speed, Tier 2 (API scripts) for simple REST, Tier 3 (MCP) for complex auth/state
Trade-offs: More tools to maintain, decision complexity for users
Impact: tools/ structure, agent guidelines, documentation
Date: 2025-11-08
EOF
)" --category=decision
```

---

## 3. Solution Template

### Purpose
Document problem-solution pairs for issues that have been resolved, enabling quick resolution of similar future problems.

### Template Structure
```
Category: solution
Problem: [Specific issue description]
Symptoms: [How it manifests]
Root Cause: [Why it happens]
Solution: [How to fix]
Steps: [Detailed resolution steps]
Prevention: [How to avoid in future]
Files: [Related file paths]
Verified: [Date and outcome]
```

### Example 1: Connection Pool Exhaustion
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: solution
Problem: MCP Gateway returning 500 errors on /health endpoint
Symptoms: Container keeps restarting, 500 responses, "connection refused" in logs
Root Cause: PostgreSQL connection pool exhausted (DB_POOL_MAX too low)
Solution: Increase DB_POOL_MAX from 10 to 20
Steps:
  1. Edit tools/mcp-gateway/.env
  2. Set DB_POOL_MAX=20
  3. Restart container: docker restart mcp-gateway
  4. Verify: curl localhost:8100/health
Prevention: Monitor pool metrics at /metrics endpoint, set alerts for >80% usage
Files: tools/mcp-gateway/.env, tools/mcp-gateway/src/config/environment.ts
Verified: 2025-11-10, health checks stable for 24+ hours
EOF
)" --category=solution
```

### Example 2: Build Failure
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: solution
Problem: Next.js build fails with "Module not found: Can't resolve '@/components'"
Symptoms: Build succeeds locally but fails in Coolify, imports work in dev
Root Cause: Case-sensitive file system in Linux container vs case-insensitive MacOS
Solution: Fix import paths to match exact file case
Steps:
  1. Find mismatched imports: grep -r "@/Components" apps/admin/
  2. Change to correct case: @/components (lowercase)
  3. Commit changes
  4. Redeploy: bash tools/deployment/deploy.sh 3
Prevention: Enable TypeScript path validation, use ESLint rule for import case
Files: apps/admin/**/*.tsx, apps/admin/tsconfig.json
Verified: 2025-11-09, deployment successful
EOF
)" --category=solution
```

### Example 3: Memory Search Not Working
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: solution
Problem: Memory search returns no results despite saved memories
Symptoms: save.sh works, but search.sh always returns 0 results
Root Cause: Qdrant vector database not initialized or disconnected
Solution: Restart Mem0 service to reinitialize Qdrant connection
Steps:
  1. Check Qdrant status: docker ps | grep qdrant
  2. Check Mem0 logs: docker logs mem0
  3. Restart Mem0: docker restart mem0
  4. Wait 10 seconds for initialization
  5. Verify: bash tools/memory/health.sh
Prevention: Add Qdrant health check to monitoring, set up auto-restart
Files: tools/mcp-gateway/config/mem0-config.json
Verified: 2025-11-11, search working correctly
EOF
)" --category=solution
```

---

## 4. Error Template

### Purpose
Document error patterns, messages, and their resolutions for quick troubleshooting when similar errors occur.

### Template Structure
```
Category: error
Error: [Error message or type]
Context: [When it occurred]
Cause: [Root cause]
Resolution: [How fixed]
Prevention: [How to avoid]
Tools: [Tools used to debug]
Related: [Similar errors or docs]
```

### Example 1: Database Connection Error
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: error
Error: PostgreSQL connection refused (ECONNREFUSED)
Context: MCP Gateway startup, /mcp/postgres requests
Cause: DB_HOST set to "localhost" instead of Docker container name "postgres"
Resolution: Changed DB_HOST=postgres in .env, restarted container
Prevention: Use docker-compose service names for inter-container communication
Tools: docker logs, docker-compose.yml, .env file
Related: All MCP handlers using PostgreSQL
EOF
)" --category=error
```

### Example 2: NextAuth Session Error
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: error
Error: "Session is undefined" in API routes
Context: Admin dashboard, authenticated API calls
Cause: Using useSession() hook server-side instead of getServerSession()
Resolution: Import and use getServerSession(req, res, authOptions) in API routes
Prevention: Always use getServerSession for API routes, useSession only for client
Tools: Next.js error logs, Chrome DevTools Network tab
Related: apps/admin/pages/api/**/*.ts, NextAuth documentation
EOF
)" --category=error
```

### Example 3: Deployment Timeout
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Category: error
Error: Coolify deployment timeout after 10 minutes
Context: Admin dashboard deployment via Coolify
Cause: Next.js build taking too long (>10 min) due to large node_modules
Resolution: Added .dockerignore to exclude node_modules, install in container
Prevention: Always use .dockerignore, consider multi-stage Docker builds
Tools: Coolify logs, docker build, .dockerignore
Related: apps/admin/Dockerfile, apps/admin/.dockerignore
EOF
)" --category=error
```

---

## 5. Workflow Template

### Purpose
Document successful workflow sequences, including steps, tools used, and outcomes for repeatable processes.

### Template Structure
```
Category: workflow
Task: [What was accomplished]
Context: [When/why this workflow]
Steps: [Sequence of actions]
Tools: [Tools/commands used]
Duration: [Time taken]
Success: [Outcome]
Learnings: [Key takeaways]
Improvements: [How to optimize]
```

### Example 1: Complete Deployment Workflow
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Workflow: Deploy admin dashboard to production
Task: Full deployment from code changes to production verification
Context: After completing feature development and testing
Steps:
  1. Run tests: pnpm --filter admin test
  2. Build locally: pnpm --filter admin build
  3. Fix any build errors
  4. Commit changes: git add . && git commit -m "feat: description"
  5. Push: git push origin main
  6. Trigger deployment: bash tools/deployment/deploy.sh 3
  7. Monitor logs: bash tools/deployment/logs.sh 3 100
  8. Check status: bash tools/deployment/status.sh 3
  9. Verify health: curl https://admin.ozean-licht.dev/api/health
  10. Smoke test: Login and check critical features
Tools: pnpm, git, Coolify CLI tools, curl
Duration: 5-8 minutes (build ~3min, deploy ~2min, verify ~1min)
Success: ✓ All steps completed, production stable
Learnings: Always run local build first, saves debugging time in production
Improvements: Add pre-push git hook for automated testing
EOF
)" --category=workflow
```

### Example 2: MCP Handler Implementation
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Workflow: Implement new MCP handler
Task: Add complete MCP service handler with tests
Context: Adding new service integration to MCP Gateway
Steps:
  1. Define types in src/mcp/protocol/types.ts
  2. Create handler file: src/mcp/handlers/service.ts
  3. Implement MCPHandler interface:
     - execute() method with operation switch
     - validateParams() method
     - getCapabilities() method
     - shutdown() method
  4. Add route in src/routes/mcp.ts
  5. Update config in config/mcp-catalog.json
  6. Write unit tests in tests/unit/handlers/service.test.ts
  7. Run tests: npm test
  8. Manual test: curl -X POST localhost:8100/mcp/service -d '{"operation":"test"}'
  9. Update documentation
Tools: TypeScript, Jest, curl, VS Code
Duration: 30-60 minutes (simple handler ~30min, complex ~60min)
Success: ✓ Tests passing, manual verification successful
Learnings: Start with types first, makes implementation clearer
Improvements: Create handler template script to generate boilerplate
EOF
)" --category=workflow
```

### Example 3: Database Backup and Restore
```bash
bash tools/memory/save.sh "$(cat <<'EOF'
Workflow: Database backup and restore
Task: Create backup before migration, restore if issues
Context: Pre-deployment safety for database schema changes
Steps:
  1. Create backup directory: mkdir -p /backups/$(date +%Y%m%d)
  2. Backup database: bash tools/database/backup.sh kids_ascension_db /backups/$(date +%Y%m%d)/ka.sql
  3. Verify backup: ls -lh /backups/$(date +%Y%m%d)/ka.sql
  4. Run migration: pnpm --filter @ka/api prisma migrate deploy
  5. Test application: pnpm --filter @ka/web dev
  6. If issues, restore: bash tools/database/restore.sh kids_ascension_db /backups/$(date +%Y%m%d)/ka.sql
  7. Upload backup to R2 for long-term storage
Tools: database CLI scripts, Prisma, pnpm
Duration: 5-10 minutes (backup ~2min, migration ~2min, verify ~3min)
Success: ✓ Migration completed, backup verified
Learnings: Always verify backup file size before migration
Improvements: Automate backup upload to R2, add retention policy
EOF
)" --category=workflow
```

---

## Best Practices for Pattern Creation

### 1. Start with Search
Always search before creating a new pattern to avoid duplicates:
```bash
bash tools/memory/search.sh "similar topic"
```

### 2. Use Structured Templates
Follow the templates above for consistency and searchability.

### 3. Include Concrete Details
- **File paths**: Exact locations
- **Commands**: Copy-pasteable examples
- **Versions**: Tool/library versions if relevant
- **Dates**: When decision made or solution verified

### 4. Keep It Searchable
Use keywords that future searches might use:
- Technology names (PostgreSQL, NextAuth, Docker)
- Error messages (exact strings)
- Problem descriptions (common terms)

### 5. Update, Don't Duplicate
If a similar pattern exists:
```bash
bash tools/memory/update.sh mem_abc123 "Updated content"
```

### 6. Cross-Reference Related Patterns
Link to related memories, files, or documentation.

---

## Pattern Quality Checklist

Before saving a pattern, verify:

- [ ] **Category is correct** (pattern/decision/solution/error/workflow)
- [ ] **Context is clear** (when/why this applies)
- [ ] **Details are concrete** (file paths, commands, specifics)
- [ ] **Solution is verified** (tested and working)
- [ ] **Related info is linked** (files, patterns, docs)
- [ ] **Searchable keywords** (technology names, error messages)
- [ ] **No duplicates exist** (searched first)

---

## Quick Reference

```bash
# Save pattern
bash tools/memory/save.sh "content" --category=pattern

# Save decision
bash tools/memory/save.sh "content" --category=decision

# Save solution
bash tools/memory/save.sh "content" --category=solution

# Save error
bash tools/memory/save.sh "content" --category=error

# Save workflow
bash tools/memory/save.sh "content" --category=workflow

# Use heredoc for multi-line
bash tools/memory/save.sh "$(cat <<'EOF'
Multi-line
content
here
EOF
)" --category=pattern
```

---

**Version:** 1.0.0
**Last Updated:** 2025-11-11
**Related:** `tools/memory/README.md`, `.claude/CLAUDE.md`
