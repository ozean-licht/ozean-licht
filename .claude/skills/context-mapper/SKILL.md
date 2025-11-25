---
name: context-mapper
description: Creates navigation maps in README.md for agent consumption. Use when mapping directories, creating navigation structures, or preparing codebases for agentic workflows. Read the template, explore the directory, then write a quality map.
---

# Context Mapper

A cartographer for codebases. Creates navigation maps that help agents find what they need fast.

## Workflow

When asked to map a directory:

### 1. Read the Template

```bash
Read: .claude/skills/context-mapper/context-map-template.md
```

Understand what a good context map looks like before starting.

### 2. Explore the Directory

Explore the target directory to understand:
- What is this directory's PURPOSE?
- What are the ENTRY POINTS?
- What are the HOT PATHS (most important flows)?
- How do the parts CONNECT?

Use these tools:
```bash
Glob: <directory>/**/*.ts     # Find all code files
Read: <directory>/README.md   # Existing context
Read: <directory>/package.json # Dependencies
Read: key files to understand purpose
```

### 3. Identify Hot Paths

Ask: "If an agent needs to work here, where do they START?"

Hot paths are:
- Entry points (`index.ts`, `server.ts`, `app.ts`)
- Configuration files
- Files that MANY other files import
- Files that represent key flows

### 4. Write the Map

Following the template structure:

```markdown
<!-- CONTEXT-MAP:START -->

> **[Name]** - [One-line description]

## Start Here

**Main entry:** `[file]`

**Key flows:**
1. **[Flow]:** `path` → `path` → `path`

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

### 5. Merge into README.md

Append or replace the context map section in the directory's README.md.

If no README exists, create one with the map.

## Scripts (for batch operations)

For mechanical batch updates, use the scripts:

```bash
# Auto-generate a basic map (less quality, but fast)
npx tsx scripts/generate-context-map.ts <directory>

# Organize files + create nav READMEs + auto-map
npx tsx scripts/organize.ts <directory> --apply --map

# Map all watched directories (batch)
npx tsx scripts/sweep.ts
```

**Note:** Scripts generate basic maps. For high-quality maps, do manual exploration.

## Quality Standards

From the template:

**Good descriptions:**
- ✅ `server.ts` - Express server, port 8100, mounts MCP routes
- ✅ `utils.ts` - URL signing and request retry helpers

**Bad descriptions:**
- ❌ `server.ts` - Server
- ❌ `utils.ts` - Utilities

**Required sections:**
1. One-line summary (what IS this?)
2. Start Here (hot paths)
3. Key Files (with specific purposes)
4. Directories (with README links)

## Example: Mapping /tools

```
User: Map /tools for me

Agent thinking:
1. Read the template
2. Explore /tools - what's in there?
   - tools/mcp-gateway/ - MCP integration
   - tools/scripts/ - Deployment scripts
   - tools/coolify/ - Coolify configs
3. Identify hot paths:
   - MCP Gateway is the main thing
   - Scripts are secondary
4. Write the map following template
5. Merge into /tools/README.md
```

## Configuration

Edit `watched-dirs.json` to define which directories to track for batch mapping.

## Files

```
.claude/skills/context-mapper/
├── SKILL.md                    # This file
├── context-map-template.md     # Template for quality maps
├── watched-dirs.json           # Dirs for batch mapping
└── scripts/
    ├── generate-context-map.ts # Auto-generate basic maps
    ├── organize.ts             # Restructure + create nav READMEs
    └── sweep.ts                # Batch map all watched dirs
```
