---
name: context-mapper
description: Creates README.md navigation maps for agent consumption. README IS the map - no human READMEs exist. Use when mapping directories, creating navigation structures, or preparing codebases for agentic workflows.
---

# Context Mapper

Cartographer for codebases. Creates navigation maps that help agents find what they need fast.

## Core Philosophy

1. **README IS the map** - Not a section within README, the entire file
2. **Task-oriented** - "If you need to X, start at Y" (not just file lists)
3. **Fractal** - Complex dirs get their own maps, linked together
4. **Gravity-aware** - Highlight files many others depend on
5. **Specific** - "JWT validation with expiry check" not "utilities"

## Workflow

When asked to map a directory:

### 1. Read the Template

```
Read: .claude/skills/context-mapper/context-map-template.md
```

Understand the output format before starting.

### 2. Explore the Directory

```
Glob: <directory>/**/*.ts          # Find all code files
Read: <directory>/package.json     # Understand purpose
Read: 3-5 key files                # Understand structure
```

Answer these questions:
- What IS this directory? (one sentence)
- What do agents typically DO here?
- Which files are most important?
- Which subdirs are complex enough for their own map?

### 3. Identify Tasks (Hot Paths)

Think: "If an agent lands here, what are they trying to accomplish?"

Common task patterns:
- **Add feature:** Where to create, what to register
- **Fix bug:** Where to find logs, how to trace
- **Update config:** Which file, what to restart
- **Extend API:** Where to add route, handler, types

### 4. Analyze Gravity

Which files are imported by many others? These are navigation anchors.

```typescript
// High gravity: imported by 5+ files
server.ts, config/env.ts, types/index.ts

// Medium gravity: imported by 2-4 files
auth/jwt.ts, utils/logger.ts

// Low gravity: imported by 0-1 files
specific-feature.ts
```

Use gravity indicators: `●●●` (high), `●●` (medium), `●` (low)

### 5. Detect Complexity

Flag directories that need their own README:

**Criteria:**
- More than 10 code files
- More than 2 levels of nesting
- Contains distinct subsystem
- Would benefit from its own task flows

Output as checklist:
```markdown
## Needs Deeper Mapping
- [ ] `src/mcp/` — 15 files, each integrates external service
```

### 6. Generate ASCII Tree

Visual hierarchy beats flat tables:

```
.
├── src/              # Core implementation
│   ├── mcp/          # Service handlers [→](./src/mcp/)
│   └── auth/         # Authentication
├── config/           # Settings
└── tests/            # Test suites
```

Rules:
- Max 15 items
- Max 3 levels deep
- Link complex subdirs with `[→](./path/)`

### 7. Write the Map

Follow template structure exactly:
1. Title + one-line essence
2. Quick Nav (3 key locations)
3. If You Need To... (task table)
4. Structure (ASCII tree)
5. Key Files (with gravity)
6. Needs Deeper Mapping (checklist)
7. Footer metadata

### 8. Replace README.md

**REPLACE entirely** - do not append or merge.

```
Write: <directory>/README.md
```

The map IS the README. Old content is superseded.

## Scripts (Batch Operations)

For mechanical batch updates:

```bash
# Auto-generate basic map (fast, lower quality)
npx tsx .claude/skills/context-mapper/scripts/generate-context-map.ts <directory>

# Organize files + create stub READMEs
npx tsx .claude/skills/context-mapper/scripts/organize.ts <directory> --apply

# Map all watched directories
npx tsx .claude/skills/context-mapper/scripts/sweep.ts
```

**Note:** Scripts generate basic maps. For high-quality maps, do manual exploration and write custom task flows.

## Quality Standards

**Good descriptions:**
```
server.ts     → Express app, port 8100, mounts /mcp/* and /health routes
config/env.ts → Zod schema for env vars, validates on startup
auth/jwt.ts   → JWT verification, extracts claims, validates expiry
```

**Bad descriptions:**
```
utils.ts  → Utilities
types.ts  → Type definitions
config.ts → Configuration
```

**Required sections:**
1. One-line essence (what IS this?)
2. Quick Nav (3 key locations)
3. If You Need To... (task flows)
4. Structure (ASCII tree)
5. Key Files (with gravity)
6. Needs Deeper Mapping (if applicable)

## Configuration

Edit `watched-dirs.json` to track high-traffic directories:

```json
{
  "watched": [
    { "path": "apps/admin", "priority": "high", "reason": "Current focus" },
    { "path": "tools/mcp-gateway", "priority": "high", "reason": "Integration layer" }
  ]
}
```

## Files

```
.claude/skills/context-mapper/
├── SKILL.md                    # This file
├── context-map-template.md     # Output format template
├── watched-dirs.json           # Directories to track
└── scripts/
    ├── generate-context-map.ts # Auto-generate basic maps
    ├── organize.ts             # Organize markdown files
    └── sweep.ts                # Batch map watched dirs
```
