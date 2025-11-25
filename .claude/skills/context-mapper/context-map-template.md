# Context Map Template

> README.md IS the context map. No human READMEs. This template defines the output format.

## Output Format

```markdown
# {Directory Name}

> {One-line essence - what this IS, not what it contains}

## Quick Nav

**Entry:** `{entry-file}` | **Config:** `{config-path}/` | **Types:** `{types-path}/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| {Common task 1} | `{file}` | {step} → {step} → {step} |
| {Common task 2} | `{file}` | {step} → {step} |
| {Common task 3} | `{file}` | {step} → {step} |

## Structure

```
.
├── {dir}/         # {Purpose} [→](./dir/)
│   ├── {subdir}/  # {Purpose}
│   └── {file}     # {Purpose}
├── {dir}/         # {Purpose}
└── {file}         # {Purpose}
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `{file}` | {Specific purpose - what it DOES} | ●●● |
| `{file}` | {Specific purpose} | ●● |
| `{file}` | {Specific purpose} | ● |

## Needs Deeper Mapping

These directories are complex enough to warrant their own README:

- [ ] `{dir}/` — {N} files, {reason for complexity}
- [ ] `{dir}/` — {N} files, {reason}

---

*Mapped: {YYYY-MM-DD} | Priority: {high|medium|low} | Files: {N}*
```

---

## Section Guidelines

### 1. One-Line Essence

Answer: "What IS this?" Not what it contains.

**Good:**
- `> MCP Gateway - Unified API proxy for external services (MinIO, GitHub, Cloudflare)`
- `> Admin authentication - NextAuth with PostgreSQL adapter and RBAC`

**Bad:**
- `> This directory contains the MCP gateway code`
- `> Authentication related files`

### 2. Quick Nav

One-line shortcuts to the 3 most important locations:

```markdown
**Entry:** `src/server.ts` | **Config:** `config/` | **Types:** `types/`
```

### 3. If You Need To... (Task-Oriented Hot Paths)

Map common agent TASKS to file paths. Think: "What do agents DO here?"

**Good tasks:**
| Task | Start Here | Flow |
|------|------------|------|
| Add MCP service | `src/mcp/` | Create handler → Add to `catalog.json` → Register route |
| Debug auth failure | `src/auth/jwt.ts` | Check token parsing → Validate claims → Trace middleware |
| Add environment var | `config/env.ts` | Add to schema → Update `.env.example` → Restart |

**Bad tasks:**
| Task | Start Here | Flow |
|------|------------|------|
| Work with files | `src/` | Look around |
| Do stuff | `index.ts` | Read code |

### 4. Structure (ASCII Tree)

Visual hierarchy. Link complex subdirs to their READMEs.

```
.
├── src/              # Core implementation
│   ├── mcp/          # Service handlers [→](./src/mcp/)
│   ├── auth/         # JWT + API key validation
│   └── routes/       # Express route definitions
├── config/           # Environment & catalogs
│   ├── env.ts        # Environment schema
│   └── catalog.json  # Service registry
└── tests/            # Integration tests
```

**Rules:**
- Max 15 items in tree
- Use `[→](./path/)` for subdirs with their own README
- Group related items under parent dirs

### 5. Key Files (With Gravity)

Most important files with SPECIFIC purposes and gravity scores.

**Gravity Score:**
- `●●●` = High gravity (imported by many files, critical path)
- `●●` = Medium gravity (important but not central)
- `●` = Low gravity (useful but peripheral)

**Good descriptions:**
| File | Purpose | Gravity |
|------|---------|---------|
| `server.ts` | Express app, port 8100, mounts `/mcp/*` and `/health` routes | ●●● |
| `config/env.ts` | Zod schema for all env vars, validates on startup, exports typed config | ●●● |
| `src/mcp/minio.ts` | MinIO S3 operations: upload, presign URLs, list buckets | ●● |
| `src/auth/jwt.ts` | JWT verification, extracts user claims, validates expiry | ●● |

**Bad descriptions:**
| File | Purpose | Gravity |
|------|---------|---------|
| `utils.ts` | Utilities | ● |
| `types.ts` | Type definitions | ● |
| `config.ts` | Configuration | ●● |

### 6. Needs Deeper Mapping

Flag directories that are too complex for this map. Use checklist format.

**Criteria for deeper mapping:**
- More than 10 code files
- More than 2 levels of nesting
- Contains distinct subsystem (auth, database, etc.)
- Would benefit from its own task-oriented paths

```markdown
## Needs Deeper Mapping

- [ ] `src/mcp/` — 15 handlers, each integrates different external service
- [ ] `src/auth/` — 8 files, security-critical authentication flow
- [ ] `lib/database/` — 12 files, connection pooling and query builders
```

### 7. Footer Metadata

Track when mapped and priority level:

```markdown
---

*Mapped: 2025-11-25 | Priority: high | Files: 42*
```

---

## Quality Checklist

Before finalizing, verify:

- [ ] Can an agent understand what this IS in 5 seconds?
- [ ] Are 3+ common tasks mapped with file flows?
- [ ] Does ASCII tree show structure clearly?
- [ ] Are file descriptions specific (not "utilities")?
- [ ] Are complex subdirs flagged for deeper mapping?
- [ ] Is the map under 60 lines?

---

## Anti-Patterns

**Don't:**
- List every file (max 10-12 in Key Files)
- Use generic descriptions ("helpers", "utilities", "types")
- Create deep nesting in ASCII tree (max 3 levels)
- Skip the task-oriented section
- Append to existing README (REPLACE it entirely)

**Do:**
- Prioritize task flows over file lists
- Write specific, actionable descriptions
- Link to deeper READMEs for navigation
- Flag complexity for future mapping
- Keep it scannable (tables, trees, short lines)

---

## Example: MCP Gateway

```markdown
# mcp-gateway

> Unified API proxy for external services - routes requests to MinIO, GitHub, Cloudflare, etc.

## Quick Nav

**Entry:** `src/server.ts` | **Config:** `config/` | **Handlers:** `src/mcp/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add MCP service | `src/mcp/` | Create `{name}.ts` → Add to `config/catalog.json` → Register in `routes/index.ts` |
| Debug failing request | `src/middleware/logger.ts` | Check logs → Trace to handler → Verify external API |
| Update auth | `src/auth/` | Modify `jwt.ts` or `api-key.ts` → Update middleware chain |
| Add health check | `src/health/` | Add check function → Register in `health/index.ts` |

## Structure

```
.
├── src/
│   ├── server.ts      # Express entry point
│   ├── mcp/           # Service handlers [→](./src/mcp/)
│   ├── auth/          # JWT + API key validation
│   ├── health/        # Health check endpoints
│   └── middleware/    # Logging, error handling
├── config/
│   ├── env.ts         # Environment schema
│   └── catalog.json   # Service registry
└── tests/             # Integration tests
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `src/server.ts` | Express app on port 8100, mounts all routes | ●●● |
| `config/env.ts` | Zod schema for env vars, validates on startup | ●●● |
| `config/catalog.json` | MCP service registry (add new services here) | ●●● |
| `src/mcp/index.ts` | Handler registry, routes to specific handlers | ●● |
| `src/auth/jwt.ts` | JWT verification and claim extraction | ●● |

## Needs Deeper Mapping

- [ ] `src/mcp/` — 11 handlers, each with external API integration

---

*Mapped: 2025-11-25 | Priority: high | Files: 34*
```
