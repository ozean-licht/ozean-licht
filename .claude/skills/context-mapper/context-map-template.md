# Context Map Template

> This template defines what a good context map looks like. Follow this structure when mapping directories.

## Required Sections

### 1. One-Line Summary

What is this directory? One sentence.

```markdown
> **MCP Gateway** - Unified API gateway for external service integration (MinIO, Cloudflare, GitHub, etc.)
```

### 2. Start Here (Hot Paths)

The most important entry points. Where should an agent BEGIN?

```markdown
## Start Here

**Main entry:** `src/server.ts` → starts the gateway

**Key flows:**
1. **Add MCP service:** `src/mcp/` → `config/mcp-catalog.json`
2. **Auth config:** `src/auth/` → `config/environment.ts`
3. **Health checks:** `src/monitoring/health.ts`
```

### 3. Architecture Overview

A quick mental model. How does this directory work?

```markdown
## Architecture

Request → `server.ts` → `router/` → `mcp/[service].ts` → External API
                              ↓
                         `auth/` validates
                              ↓
                         `monitoring/` logs
```

### 4. Key Files

Most important files with SPECIFIC purposes (not generic).

```markdown
## Key Files

| File | What it does |
|------|-------------|
| `server.ts` | Express server, port 8100, mounts all routes |
| `config/environment.ts` | All env vars, validates on startup |
| `config/mcp-catalog.json` | Service registry (add new MCPs here) |
| `src/mcp/minio.ts` | MinIO S3 operations (upload, presign, list) |
```

**Bad descriptions:**
- ❌ `utils.ts` - Utilities
- ❌ `config.ts` - Configuration
- ❌ `types.ts` - Types

**Good descriptions:**
- ✅ `utils.ts` - URL signing and request retry helpers
- ✅ `config.ts` - Environment validation, feature flags
- ✅ `types.ts` - MCP request/response interfaces

### 5. Directory Map

Subdirectories with navigation links.

```markdown
## Directories

| Directory | Purpose | Navigate |
|-----------|---------|----------|
| `src/mcp/` | MCP service implementations | [→ README](./src/mcp/) |
| `src/auth/` | Token validation, API keys | [→ README](./src/auth/) |
| `config/` | Environment and service config | [→ README](./config/) |
| `docs/` | Architecture docs | 3 files |
```

### 6. Common Tasks (Optional but valuable)

What do agents typically need to do here?

```markdown
## Common Tasks

**Add a new MCP service:**
1. Create `src/mcp/[name].ts` (copy `minio.ts` as template)
2. Add to `config/mcp-catalog.json`
3. Add route in `src/router/index.ts`
4. Add env vars to `config/environment.ts`

**Debug a failing service:**
1. Check `logs/` for errors
2. Verify env vars in `config/environment.ts`
3. Test endpoint: `curl localhost:8100/health/[service]`
```

---

## Template Structure

```markdown
<!-- CONTEXT-MAP:START -->

> **[Directory Name]** - [One-line description of what this is]

## Start Here

**Main entry:** `[entry file]`

**Key flows:**
1. **[Flow name]:** `path` → `path` → `path`
2. **[Flow name]:** `path` → `path`

## Key Files

| File | What it does |
|------|-------------|
| `file.ts` | Specific description |

## Directories

| Directory | Purpose | Navigate |
|-----------|---------|----------|
| `dir/` | Purpose | [→ README](./dir/) |

<!-- CONTEXT-MAP:END -->
```

---

## Quality Checklist

Before finalizing a context map, verify:

- [ ] Can an agent understand what this directory IS in 5 seconds?
- [ ] Are the hot paths clearly marked?
- [ ] Does every file description answer "what does this DO"?
- [ ] Are there navigation links to subdirectory READMEs?
- [ ] Would YOU be able to navigate this directory using only this map?

---

## Anti-Patterns

**Don't:**
- List every file (max 10-15 in Key Files)
- Use generic descriptions ("utilities", "helpers", "types")
- Forget to link subdirectory READMEs
- Skip the "Start Here" section
- Make the map longer than 50 lines

**Do:**
- Prioritize entry points and hot paths
- Write specific, actionable descriptions
- Create a mental model (architecture section)
- Link to deeper READMEs for navigation
- Keep it scannable (tables, bullets, short lines)
