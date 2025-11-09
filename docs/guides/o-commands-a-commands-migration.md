# o-commands/a-commands Migration Guide

**Date:** 2025-11-08
**Status:** Planning Phase - Ready for Implementation
**Migration Duration:** ~2 hours (execution only)
**Total Effort:** 6 hours (including planning, testing, documentation)

---

## Executive Summary

This guide documents the migration from a duplicated `.claude/commands/` structure to a clean **o-commands/a-commands separation** using symlinks. This architectural improvement eliminates command duplication, provides clear separation of concerns, and simplifies maintenance.

### Key Benefits

- ✅ **Zero Duplication**: Single source of truth for each command
- ✅ **Clear Separation**: Orchestrator commands vs ADW/application commands
- ✅ **Simplified Discovery**: Symlinks encode intent, no complex merging needed
- ✅ **Easy Maintenance**: Add command once, automatically available in correct contexts
- ✅ **Backward Compatible**: Existing code and references continue to work

---

## Table of Contents

1. [Problem Analysis](#problem-analysis)
2. [Proposed Architecture](#proposed-architecture)
3. [Migration Strategy](#migration-strategy)
4. [Command Categorization](#command-categorization)
5. [Technical Implementation](#technical-implementation)
6. [Verification & Testing](#verification--testing)
7. [Rollback Procedure](#rollback-procedure)
8. [Maintenance Guide](#maintenance-guide)
9. [FAQ](#faq)

---

## Problem Analysis

### Current State (Before Migration)

```
ozean-licht-ecosystem/
├── .claude/
│   ├── commands/                          # 20 commands (MIXED)
│   │   ├── orch_scout_and_build.md       # Orchestrator
│   │   ├── orch_one_shot_agent.md        # Orchestrator
│   │   ├── build_in_parallel.md          # Orchestrator
│   │   ├── plan.md                        # ADW
│   │   ├── build.md                       # ADW
│   │   ├── prime.md                       # Utility
│   │   └── ...                            # Mixed
│   └── agents/                            # 7 agent templates
│
└── apps/orchestrator_3_stream/
    └── .claude/
        ├── commands/                      # 19 commands (NEAR-IDENTICAL)
        │   ├── orch_scout_and_build.md   # Duplicated
        │   ├── plan.md                    # Duplicated
        │   └── ...                        # Nearly all duplicated
        └── agents/                        # 7 agent templates (DUPLICATED)
```

### Issues with Current Architecture

1. **Near-Complete Duplication**
   - 19 of 20 commands duplicated between root and orchestrator
   - All 7 agent templates duplicated
   - Changes must be made in 2+ places

2. **No Separation of Concerns**
   - Orchestrator-specific commands mixed with ADW commands in root
   - Unclear which commands belong to which context
   - Developers confused about where to add new commands

3. **Maintenance Nightmare**
   - Update a command → must update in multiple locations
   - Easy to forget to sync changes
   - Git history fragmented across locations

4. **Discovery Complexity**
   - Current hierarchical loading expects conflicts but files are identical
   - Complex merging logic for identical files
   - Unnecessary complexity in discovery code

### Command Discovery Background

The command discovery issue has two aspects that this migration addresses:

1. **Multi-Root Workspace Solution** (Immediate UX Fix)
   - Uses VSCode multi-root workspace to make all commands visible
   - Documented in `CLAUDE.md` and `COMMAND_PALETTE_EXECUTIVE_SUMMARY.md`
   - Solves: "Users see different commands depending on open folder"

2. **Architecture Migration** (Long-term Maintainability)
   - This migration: Eliminates duplication using symlinks
   - Provides clear separation: o-commands vs a-commands
   - Solves: "Commands duplicated in multiple locations"

**Both solutions are complementary:**
- Multi-root workspace = Better UX (users see correct commands)
- This migration = Better DX (developers maintain commands easily)

---

## Proposed Architecture

### New Structure (After Migration)

```
ozean-licht-ecosystem/
├── .claude/
│   ├── a-commands/                        # Application/ADW commands (13)
│   │   ├── plan.md                        # ADW planning
│   │   ├── build.md                       # ADW build
│   │   ├── prime.md                       # Codebase priming
│   │   ├── prime_3.md                     # Codebase priming v3
│   │   ├── prime_cc.md                    # Claude Code priming
│   │   ├── question.md                    # Q&A mode
│   │   ├── quick-plan.md                  # Fast planning
│   │   ├── find_and_summarize.md          # Documentation
│   │   ├── load_ai_docs.md                # AI docs loader
│   │   ├── load_bundle.md                 # Context bundling
│   │   ├── all_tools.md                   # Tool listing
│   │   ├── t_metaprompt_workflow.md       # Meta prompt creation
│   │   └── reset.md                       # Reset context
│   │
│   ├── o-commands/                        # Orchestrator commands (7)
│   │   ├── orch_scout_and_build.md       # Scout → Build workflow
│   │   ├── orch_one_shot_agent.md        # One-shot agent
│   │   ├── orch_plan_w_scouts_build_review.md # Full pipeline
│   │   ├── orch_trinity_mode.md          # Trinity mode
│   │   ├── build_in_parallel.md          # Parallel builds
│   │   ├── plan_w_scouters.md            # Planning with scouts
│   │   └── parallel_subagents.md         # Parallel agent orchestration
│   │
│   ├── commands -> a-commands             # Symlink (root default)
│   │
│   └── agents/                            # Shared agent templates (7)
│       ├── build-agent.md
│       ├── scout-report-suggest.md
│       ├── scout-report-suggest-fast.md
│       ├── review-agent.md
│       ├── playwright-validator.md
│       ├── meta-agent.md
│       └── docs-scraper.md
│
└── apps/orchestrator_3_stream/
    └── .claude/
        ├── commands -> ../../../.claude/o-commands    # Symlink to orchestrator
        └── agents -> ../../../.claude/agents          # Symlink to shared agents
```

### Design Principles

1. **Two Command Categories**
   - **a-commands**: Application/ADW development workflows (13 commands)
   - **o-commands**: Orchestrator-specific multi-agent workflows (7 commands)

2. **Symlinks for Context Routing**
   - Root: `.claude/commands/` → `a-commands/` (default ADW context)
   - Orchestrator: `apps/orchestrator/.claude/commands/` → `../../.claude/o-commands/`
   - No code changes needed in Claude Code discovery logic

3. **Shared Agent Templates**
   - Single directory: `.claude/agents/`
   - Orchestrator symlinks to shared agents
   - All agent templates maintained in one place

4. **Zero Breaking Changes**
   - Existing command references work unchanged
   - Discovery logic continues to function
   - Git history preserved through `git mv`

### Why Symlinks?

**Benefits:**
- Native Git feature (since Git 1.6)
- Transparent to file access (code doesn't need changes)
- Encode architectural intent directly in filesystem
- Eliminates need for complex merging logic
- Portable (works on Linux, macOS, Windows with Git)

**How They Work:**
```bash
# Create symlink
ln -s target_path link_name

# Reading through symlink is transparent
cat .claude/commands/plan.md
# → Actually reads from .claude/a-commands/plan.md

# Directory listing works normally
ls .claude/commands/
# → Shows contents of .claude/a-commands/

# Git tracks symlinks as special 120000 mode files
git ls-files -s .claude/commands
# → 120000 <hash> .claude/commands
```

---

## Migration Strategy

### Prerequisites

- Git repository in clean state
- Backup branch created
- All commands committed
- No uncommitted changes in `.claude/` directories

### Phase 1: Preparation (30 minutes)

#### Step 1.1: Audit Current Commands

```bash
cd /opt/ozean-licht-ecosystem

# List all commands
echo "=== ROOT COMMANDS ==="
ls -1 .claude/commands/*.md

echo "=== ORCHESTRATOR COMMANDS ==="
ls -1 apps/orchestrator_3_stream/.claude/commands/*.md

# Count commands
echo "Root count: $(ls -1 .claude/commands/*.md | wc -l)"
echo "Orchestrator count: $(ls -1 apps/orchestrator_3_stream/.claude/commands/*.md | wc -l)"
```

**Expected Output:**
- Root: 20 commands
- Orchestrator: 19 commands (mostly duplicates)

#### Step 1.2: Create Backup Branch

```bash
cd /opt/ozean-licht-ecosystem

# Create backup
git checkout -b backup/pre-commands-migration-$(date +%Y%m%d)
git push origin backup/pre-commands-migration-$(date +%Y%m%d)

# Create working branch
git checkout main
git checkout -b feat/o-commands-a-commands-separation

echo "✅ Backup created"
```

### Phase 2: Execution (1 hour)

#### Step 2.1: Create New Directory Structure

```bash
cd /opt/ozean-licht-ecosystem

# Create new command directories
mkdir -p .claude/a-commands
mkdir -p .claude/o-commands

echo "✅ Directories created"
```

#### Step 2.2: Move Commands to Correct Categories

**Move Orchestrator Commands (o-commands):**
```bash
cd /opt/ozean-licht-ecosystem

# Move orchestrator-specific commands
for cmd in orch_scout_and_build orch_one_shot_agent orch_plan_w_scouts_build_review \
           orch_trinity_mode build_in_parallel plan_w_scouters parallel_subagents; do
  if [ -f ".claude/commands/${cmd}.md" ]; then
    echo "Moving $cmd to o-commands/"
    git mv ".claude/commands/${cmd}.md" ".claude/o-commands/${cmd}.md"
  fi
done
```

**Move Application/ADW Commands (a-commands):**
```bash
cd /opt/ozean-licht-ecosystem

# Move ADW/application commands
for cmd in plan build prime prime_3 prime_cc question quick-plan \
           find_and_summarize load_ai_docs load_bundle all_tools \
           t_metaprompt_workflow reset; do
  if [ -f ".claude/commands/${cmd}.md" ]; then
    echo "Moving $cmd to a-commands/"
    git mv ".claude/commands/${cmd}.md" ".claude/a-commands/${cmd}.md"
  fi
done
```

#### Step 2.3: Create Symlinks

```bash
cd /opt/ozean-licht-ecosystem

# Remove old commands directory (should be empty now)
rmdir .claude/commands

# Create root symlink (a-commands as default)
ln -s a-commands .claude/commands
echo "✅ Created .claude/commands -> a-commands"

# Remove orchestrator duplicates
rm -rf apps/orchestrator_3_stream/.claude/commands
rm -rf apps/orchestrator_3_stream/.claude/agents

# Create orchestrator symlinks
cd apps/orchestrator_3_stream/.claude
ln -s ../../../.claude/o-commands commands
ln -s ../../../.claude/agents agents
echo "✅ Created orchestrator symlinks"
```

#### Step 2.4: Verify Structure

```bash
cd /opt/ozean-licht-ecosystem

# Verify directory counts
echo "a-commands count: $(ls -1 .claude/a-commands/*.md | wc -l)"
echo "o-commands count: $(ls -1 .claude/o-commands/*.md | wc -l)"

# Verify symlinks
echo "Root commands symlink:"
ls -la .claude/ | grep "commands ->"

echo "Orchestrator symlinks:"
ls -la apps/orchestrator_3_stream/.claude/ | grep " -> "

# Test symlink access
echo "Can access plan.md via root symlink:"
test -f .claude/commands/plan.md && echo "✅ Yes" || echo "❌ No"

echo "Can access orch_scout_and_build.md via orchestrator symlink:"
test -f apps/orchestrator_3_stream/.claude/commands/orch_scout_and_build.md && echo "✅ Yes" || echo "❌ No"
```

**Expected Output:**
```
a-commands count: 13
o-commands count: 7
Root commands symlink:
lrwxrwxrwx 1 user user   10 Nov  8 10:00 commands -> a-commands
Orchestrator symlinks:
lrwxrwxrwx 1 user user   30 Nov  8 10:01 commands -> ../../../.claude/o-commands
lrwxrwxrwx 1 user user   25 Nov  8 10:01 agents -> ../../../.claude/agents
Can access plan.md via root symlink:
✅ Yes
Can access orch_scout_and_build.md via orchestrator symlink:
✅ Yes
```

### Phase 3: Update Discovery Logic (30 minutes)

The symlink architecture simplifies discovery logic significantly. Update these files:

#### File: `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py`

**Before (Complex):**
```python
def discover_slash_commands(working_dir: str) -> List[dict]:
    """Load root commands, then app commands, merge with precedence."""
    root_commands = _load_commands_from_dir(
        Path("/opt/ozean-licht-ecosystem/.claude/commands")
    )
    app_commands = _load_commands_from_dir(
        Path(working_dir) / ".claude" / "commands"
    )

    # Merge with app taking precedence
    merged = {cmd['name']: cmd for cmd in root_commands}
    merged.update({cmd['name']: cmd for cmd in app_commands})

    return list(merged.values())
```

**After (Simple):**
```python
def discover_slash_commands(working_dir: str) -> List[dict]:
    """
    Discover slash commands using symlink-based architecture.

    With o-commands/a-commands separation:
    - Root: .claude/commands -> a-commands (ADW context)
    - Orchestrator: .claude/commands -> o-commands (orchestrator context)

    Symlinks mean we only need to scan one directory!
    """
    commands_dir = Path(working_dir) / ".claude" / "commands"

    if not commands_dir.exists():
        logger.warning(f"Commands directory not found: {commands_dir}")
        return []

    # Symlink automatically resolves to correct directory
    commands = _load_commands_from_dir(commands_dir)

    # Add metadata for debugging
    for cmd in commands:
        # Detect command type by name pattern
        if cmd['name'].startswith('orch_') or cmd['name'] in [
            'build_in_parallel', 'parallel_subagents', 'plan_w_scouters'
        ]:
            cmd['source'] = 'orchestrator'
        else:
            cmd['source'] = 'app'

    logger.info(f"Discovered {len(commands)} commands from {commands_dir}")
    return commands
```

**Benefits:**
- ✅ No merging logic needed
- ✅ Simpler, more maintainable
- ✅ Symlinks encode architectural intent
- ✅ Works with existing code

#### File: `apps/orchestrator_3_stream/backend/modules/subagent_loader.py`

**Before (Dual Loading):**
```python
class SubagentRegistry:
    def __init__(self, working_dir: str | Path, logger):
        self.root_templates_dir = Path("/opt/ozean-licht-ecosystem/.claude/agents")
        self.app_templates_dir = Path(working_dir) / ".claude" / "agents"
        # Complex logic to load from both...
```

**After (Symlink):**
```python
class SubagentRegistry:
    def __init__(self, working_dir: str | Path, logger):
        """
        Load agent templates using symlink-based architecture.

        Orchestrator .claude/agents/ is now a symlink to root agents directory.
        Single source of truth, zero duplication!
        """
        self.templates_dir = Path(working_dir) / ".claude" / "agents"

        if not self.templates_dir.exists():
            logger.warning(f"Agents directory not found: {self.templates_dir}")
            self.templates_dir = None
```

---

## Command Categorization

### a-commands (Application/ADW) - 13 Commands

Development workflows, ADW operations, and codebase utilities:

1. **`plan.md`** - Create implementation plans for features
2. **`build.md`** - Build implementation based on plan
3. **`prime.md`** - Prime agent with codebase understanding
4. **`prime_3.md`** - Enhanced codebase priming (v3)
5. **`prime_cc.md`** - Prime Claude Code context specifically
6. **`question.md`** - Q&A mode without code changes
7. **`quick-plan.md`** - Fast planning for small tasks
8. **`find_and_summarize.md`** - Find and document specific files
9. **`load_ai_docs.md`** - Load external AI documentation
10. **`load_bundle.md`** - Load context bundle from previous session
11. **`all_tools.md`** - List all available MCP tools
12. **`t_metaprompt_workflow.md`** - Create new slash command prompts
13. **`reset.md`** - Reset orchestrator context

**Usage Context:** Root-level development, ADW workflows, general codebase operations

### o-commands (Orchestrator) - 7 Commands

Multi-agent orchestration and parallel workflow execution:

1. **`orch_scout_and_build.md`** - Scout codebase, then build solution
2. **`orch_one_shot_agent.md`** - Create and execute one-shot agent
3. **`orch_plan_w_scouts_build_review.md`** - Full pipeline with scouts
4. **`orch_trinity_mode.md`** - Trinity mode orchestration
5. **`build_in_parallel.md`** - Parallel build execution across files
6. **`plan_w_scouters.md`** - Planning with multiple scout agents
7. **`parallel_subagents.md`** - Parallel subagent coordination

**Usage Context:** Orchestrator-specific agent coordination, multi-agent workflows

### Command Type Detection

Commands are categorized by:
- **Naming Convention**: `orch_*` prefix = orchestrator
- **Functional Purpose**: Multi-agent coordination = orchestrator, Single workflows = application
- **Usage Pattern**: Spawns multiple agents = orchestrator, Linear workflow = application

---

## Technical Implementation

### Symlink Creation Details

**Relative Paths (Recommended):**
```bash
# Root symlink (relative)
cd .claude
ln -s a-commands commands

# Orchestrator symlinks (relative paths for portability)
cd apps/orchestrator_3_stream/.claude
ln -s ../../../.claude/o-commands commands
ln -s ../../../.claude/agents agents
```

**Why Relative Paths:**
- ✅ Works across different machines and repo clones
- ✅ No hardcoded absolute paths
- ✅ Portable in Docker containers, CI/CD
- ❌ Absolute paths break when repo location changes

### Git Behavior with Symlinks

**Git tracks symlinks as special files:**
```bash
# Symlink is stored as blob containing target path
$ git ls-files -s .claude/commands
120000 a6e1b5c... .claude/commands

# Content is just the target path string
$ git cat-file -p a6e1b5c
a-commands
```

**File History Preservation:**
```bash
# git mv preserves full file history
git mv .claude/commands/plan.md .claude/a-commands/plan.md

# View history (follows across moves)
git log --follow .claude/a-commands/plan.md
```

### Cross-Platform Compatibility

| Platform | Support | Notes |
|----------|---------|-------|
| **Linux** | ✅ Native | Full symlink support |
| **macOS** | ✅ Native | Full symlink support |
| **Windows** | ⚠️ Conditional | Requires Developer Mode OR `core.symlinks=true` |

**Windows Setup:**
```bash
# Enable symlinks in Git (recommended)
git config --global core.symlinks true

# Or enable Windows Developer Mode
# Settings → Update & Security → For developers → Developer Mode
```

### Discovery Logic Comparison

**Before Migration (Complex):**
```python
# Load from two directories
root_commands = load_from("/opt/.../commands")  # 20 files
app_commands = load_from("{working_dir}/.claude/commands")  # 19 files

# Merge with precedence (complex)
merged = {}
for cmd in root_commands:
    merged[cmd['name']] = cmd
for cmd in app_commands:  # Override
    merged[cmd['name']] = cmd

# Result: 20 commands (mostly duplicates)
```

**After Migration (Simple):**
```python
# Load from one directory (symlink resolves automatically)
commands_dir = Path(working_dir) / ".claude/commands"
commands = load_from(commands_dir)

# Root working_dir: commands -> a-commands (13 ADW commands)
# Orchestrator working_dir: commands -> o-commands (7 orchestrator commands)
# No merging needed!
```

---

## Verification & Testing

### Automated Test Suite

Create comprehensive test script:

```bash
#!/bin/bash
# File: tests/verify-command-migration.sh

set -e

REPO_ROOT="/opt/ozean-licht-ecosystem"
cd "$REPO_ROOT"

echo "=== Command Migration Verification Suite ==="
echo ""

# Test 1: Directory structure
echo "✅ Test 1: Directory Structure"
test -d .claude/a-commands && echo "  ✓ .claude/a-commands/ exists" || exit 1
test -d .claude/o-commands && echo "  ✓ .claude/o-commands/ exists" || exit 1
test -L .claude/commands && echo "  ✓ .claude/commands is symlink" || exit 1

# Test 2: File counts
echo ""
echo "✅ Test 2: File Counts"
a_count=$(ls -1 .claude/a-commands/*.md 2>/dev/null | wc -l)
o_count=$(ls -1 .claude/o-commands/*.md 2>/dev/null | wc -l)
test $a_count -eq 13 && echo "  ✓ a-commands: $a_count (expected 13)" || exit 1
test $o_count -eq 7 && echo "  ✓ o-commands: $o_count (expected 7)" || exit 1

# Test 3: Symlink targets
echo ""
echo "✅ Test 3: Symlink Targets"
root_target=$(readlink .claude/commands)
test "$root_target" = "a-commands" && echo "  ✓ Root: commands -> a-commands" || exit 1

orch_cmds=$(readlink apps/orchestrator_3_stream/.claude/commands)
test "$orch_cmds" = "../../../.claude/o-commands" && echo "  ✓ Orchestrator: commands -> o-commands" || exit 1

orch_agents=$(readlink apps/orchestrator_3_stream/.claude/agents)
test "$orch_agents" = "../../../.claude/agents" && echo "  ✓ Orchestrator: agents -> shared" || exit 1

# Test 4: File accessibility
echo ""
echo "✅ Test 4: File Accessibility via Symlinks"
test -f .claude/commands/plan.md && echo "  ✓ Root can access plan.md" || exit 1
test -f apps/orchestrator_3_stream/.claude/commands/orch_scout_and_build.md && \
  echo "  ✓ Orchestrator can access orch_scout_and_build.md" || exit 1
test -f apps/orchestrator_3_stream/.claude/agents/build-agent.md && \
  echo "  ✓ Orchestrator can access build-agent.md" || exit 1

# Test 5: No duplication
echo ""
echo "✅ Test 5: No Duplication"
test ! -d apps/orchestrator_3_stream/.claude/commands.old && \
  echo "  ✓ No old commands directory" || echo "  ⚠️  Cleanup recommended"

# Test 6: Git tracking
echo ""
echo "✅ Test 6: Git Tracking"
tracked_a=$(git ls-files .claude/a-commands/*.md | wc -l)
tracked_o=$(git ls-files .claude/o-commands/*.md | wc -l)
test $tracked_a -eq 13 && echo "  ✓ All a-commands tracked ($tracked_a)" || exit 1
test $tracked_o -eq 7 && echo "  ✓ All o-commands tracked ($tracked_o)" || exit 1

# Test 7: Symlink git tracking
echo ""
echo "✅ Test 7: Symlink Git Tracking"
git ls-files -s .claude/commands | grep -q "^120000" && \
  echo "  ✓ Root commands symlink tracked (mode 120000)" || exit 1
git ls-files -s apps/orchestrator_3_stream/.claude/commands | grep -q "^120000" && \
  echo "  ✓ Orchestrator commands symlink tracked" || exit 1

echo ""
echo "=== ✅ All Tests Passed ==="
echo ""
echo "Summary:"
echo "  • a-commands: 13 files"
echo "  • o-commands: 7 files"
echo "  • Total: 20 unique commands (zero duplication)"
echo "  • Symlinks: 3 created and working"
echo "  • Git tracking: All files tracked correctly"
```

### Manual Testing Checklist

**Root Context:**
```bash
cd /opt/ozean-licht-ecosystem

# Should see 13 a-commands
ls .claude/commands/

# Should include: plan, build, prime, question, etc.
# Should NOT include: orch_*, build_in_parallel, etc.
```

**Orchestrator Context:**
```bash
cd /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream

# Should see 7 o-commands
ls .claude/commands/

# Should include: orch_*, build_in_parallel, plan_w_scouters
# Should NOT include: question, quick-plan, etc. (pure ADW commands)
```

**Agent Access:**
```bash
# Both contexts should see same 7 agents
ls /opt/ozean-licht-ecosystem/.claude/agents/
ls /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/.claude/agents/

# Should be identical (symlink)
diff <(ls /opt/ozean-licht-ecosystem/.claude/agents/) \
     <(ls /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/.claude/agents/)
```

### Integration Testing

**Test Command Discovery (if orchestrator backend running):**
```bash
# Test from orchestrator context
cd apps/orchestrator_3_stream

# If backend has discovery endpoint
curl http://localhost:9403/api/commands 2>/dev/null | jq '.commands | length'
# Expected: 7 commands

# Check command names
curl http://localhost:9403/api/commands 2>/dev/null | jq '.commands[].name'
# Should show: orch_* commands and parallel commands
```

---

## Rollback Procedure

If issues arise during or after migration:

### Immediate Rollback (Git)

```bash
cd /opt/ozean-licht-ecosystem

# Option 1: Checkout backup branch
git checkout backup/pre-commands-migration-YYYYMMDD

# Option 2: Revert migration commit
git revert <migration-commit-sha>

# Option 3: Reset to pre-migration state (destructive)
git reset --hard <pre-migration-commit-sha>
```

### Manual Rollback (Filesystem)

```bash
cd /opt/ozean-licht-ecosystem

# Remove symlinks
rm .claude/commands
rm apps/orchestrator_3_stream/.claude/commands
rm apps/orchestrator_3_stream/.claude/agents

# Restore directories
mkdir .claude/commands
mkdir apps/orchestrator_3_stream/.claude/commands
mkdir apps/orchestrator_3_stream/.claude/agents

# Copy commands back
cp .claude/a-commands/* .claude/commands/
cp .claude/o-commands/* .claude/commands/

# For orchestrator, decide which commands to include
# (or copy all from root)
```

### Verification After Rollback

```bash
# Verify old structure restored
test -d .claude/commands && ! test -L .claude/commands && echo "✅ Rollback successful"

# Verify commands discoverable
ls .claude/commands/ | wc -l
# Should show original count (20)
```

---

## Maintenance Guide

### Adding New Commands

**Application/ADW Command:**
```bash
cd /opt/ozean-licht-ecosystem

# Create in a-commands directory
cat > .claude/a-commands/my-new-workflow.md << 'EOF'
---
description: My new development workflow
---

# My New Workflow

Execute my custom development workflow.

## Usage

```bash
/my-new-workflow
```

## Implementation

[Command implementation here]
EOF

# Commit
git add .claude/a-commands/my-new-workflow.md
git commit -m "feat: add /my-new-workflow command"

# ✅ Automatically available at root via symlink!
```

**Orchestrator Command:**
```bash
cd /opt/ozean-licht-ecosystem

# Create in o-commands directory
cat > .claude/o-commands/orch_my_orchestration.md << 'EOF'
---
description: My orchestration workflow
---

# My Orchestration

Orchestrate multiple agents for complex task.

## Usage

```bash
/orch_my_orchestration
```

## Implementation

[Multi-agent orchestration logic here]
EOF

# Commit
git add .claude/o-commands/orch_my_orchestration.md
git commit -m "feat: add /orch_my_orchestration command"

# ✅ Automatically available in orchestrator via symlink!
```

**Agent Template:**
```bash
cd /opt/ozean-licht-ecosystem

# Add to shared agents directory
cat > .claude/agents/my-specialist-agent.md << 'EOF'
# My Specialist Agent

## Purpose
Specialized agent for [specific task]

## Tools Available
- Read, Write, Edit, Bash, Grep, Glob

## Workflow
1. [Step 1]
2. [Step 2]
3. [Step 3]
EOF

# Commit
git add .claude/agents/my-specialist-agent.md
git commit -m "feat: add my-specialist-agent template"

# ✅ Automatically available in all contexts!
```

### Updating Existing Commands

```bash
cd /opt/ozean-licht-ecosystem

# Edit command in source directory
vi .claude/a-commands/plan.md

# Commit change
git add .claude/a-commands/plan.md
git commit -m "docs: improve /plan command documentation"

# ✅ Change automatically visible via symlink everywhere!
```

### Debugging Discovery Issues

**Check Symlink Integrity:**
```bash
cd /opt/ozean-licht-ecosystem

# List symlinks
ls -la .claude/ | grep "^l"
ls -la apps/orchestrator_3_stream/.claude/ | grep "^l"

# Verify symlink targets exist
test -d "$(readlink -f .claude/commands)" && echo "✅ Root symlink OK" || echo "❌ Broken"
test -d "$(readlink -f apps/orchestrator_3_stream/.claude/commands)" && echo "✅ Orchestrator symlink OK" || echo "❌ Broken"
```

**Verify File Counts:**
```bash
# Should always match
find .claude/a-commands -name "*.md" | wc -l  # 13
find .claude/o-commands -name "*.md" | wc -l  # 7

# Via symlinks
find .claude/commands -name "*.md" | wc -l  # 13 (follows symlink to a-commands)
find apps/orchestrator_3_stream/.claude/commands -name "*.md" | wc -l  # 7 (follows symlink to o-commands)
```

**Check Git Tracking:**
```bash
# All commands should be tracked
git ls-files .claude/a-commands/*.md | wc -l  # 13
git ls-files .claude/o-commands/*.md | wc -l  # 7

# Symlinks should be tracked (mode 120000)
git ls-files -s .claude/commands | grep "^120000"
```

**Verify Command Frontmatter:**
```bash
# All commands must have valid frontmatter
for cmd in .claude/a-commands/*.md; do
  echo "Checking: $(basename $cmd)"
  head -n 5 "$cmd" | grep -q "description:" || echo "  ❌ Missing description"
done
```

### Command Categorization Rules

When adding new commands, follow these guidelines:

| Command Type | Category | Directory | Examples |
|--------------|----------|-----------|----------|
| Single-agent workflow | a-commands | `.claude/a-commands/` | `/plan`, `/build`, `/test` |
| Multi-agent orchestration | o-commands | `.claude/o-commands/` | `/orch_*`, `/build_in_parallel` |
| Codebase utilities | a-commands | `.claude/a-commands/` | `/prime`, `/question`, `/find_and_summarize` |
| Parallel execution | o-commands | `.claude/o-commands/` | `/parallel_subagents` |
| Development workflows | a-commands | `.claude/a-commands/` | `/feature`, `/bug`, `/patch` |

**Naming Conventions:**
- **Orchestrator commands**: Prefix with `orch_` OR contain `parallel` in name
- **Application commands**: No prefix, descriptive action verbs
- **Utility commands**: Short, clear names (`prime`, `reset`, `question`)

---

## FAQ

### General Questions

**Q: Why migrate to o-commands/a-commands?**
> To eliminate duplication (19 duplicate commands), provide clear separation of concerns, and simplify maintenance. This architecture makes it obvious where each command belongs.

**Q: Will this break existing workflows?**
> No. Symlinks maintain backward compatibility. All existing command references (e.g., `/plan`, `/orch_scout_and_build`) continue to work unchanged.

**Q: Do I need to update my code?**
> No. Discovery logic can be simplified (optional improvement) but existing code works as-is because symlinks are transparent to file operations.

### Technical Questions

**Q: What are symlinks and why use them?**
> Symlinks (symbolic links) are filesystem pointers to other files/directories. They're native to Git, transparent to file operations, and encode architectural intent directly in the filesystem structure.

**Q: How do symlinks work with Git?**
> Git tracks symlinks as special files (mode 120000) containing the target path. They're versioned like normal files and work across platforms (with some Windows considerations).

**Q: What if I'm on Windows?**
> Enable `git config core.symlinks true` OR enable Developer Mode in Windows settings. Git on Windows can handle symlinks with proper configuration.

**Q: Can I still use `git mv` with symlinks?**
> Yes. Use `git mv` on actual command files (in `a-commands/` or `o-commands/`), not on symlinks. Symlinks stay in place, pointing to renamed targets.

### Workflow Questions

**Q: Where do I add a new ADW workflow command?**
> Add to `.claude/a-commands/`. It will automatically be available at root via the symlink.

**Q: Where do I add a new orchestrator command?**
> Add to `.claude/o-commands/`. It will automatically be available in orchestrator via its symlink.

**Q: How do I update an existing command?**
> Edit the command in its source directory (`a-commands/` or `o-commands/`). Changes automatically propagate via symlinks.

**Q: Can I have a command available in both contexts?**
> Not directly. Choose the primary context (a-commands OR o-commands). If truly needed in both, create two separate command files with different names.

### Migration Questions

**Q: How long does migration take?**
> Execution: ~1 hour. Total with planning and testing: ~6 hours.

**Q: What if migration fails midway?**
> Checkout the backup branch created before migration: `git checkout backup/pre-commands-migration-YYYYMMDD`

**Q: Do I need to update ADW worktrees?**
> ADW worktrees receive `.claude/` copied during planning phase. The copied structure will include symlinks, so they work automatically.

**Q: Will this affect command discovery in Claude Code UI?**
> No. Claude Code scans `.claude/commands/` which is now a symlink. It transparently reads from the target directory.

### Maintenance Questions

**Q: How do I verify symlinks are working?**
> Run the automated test suite (see Verification & Testing section) or manually check: `ls -la .claude/ | grep commands`

**Q: What if a symlink breaks?**
> Recreate it: `cd .claude && rm commands && ln -s a-commands commands`

**Q: How do I audit which commands are in which category?**
> `ls .claude/a-commands/` for application commands, `ls .claude/o-commands/` for orchestrator commands.

---

## Related Documentation

### Internal Documentation
- **Command Discovery**: `CLAUDE.md` (Command Architecture section)
- **Context Map**: `CONTEXT_MAP.md` (Claude Code Configuration)
- **Migration Strategy**: `specs/practical-o-commands-a-commands-migration-strategy.md`
- **Command Palette Fix**: `specs/COMMAND_PALETTE_EXECUTIVE_SUMMARY.md`
- **Implementation Plan**: `specs/implementation_command_palette_fix.md`

### External Resources
- **Git Symlinks**: [Git Documentation - Symbolic Links](https://git-scm.com/docs/gitattributes#_working_tree_encoding)
- **Claude Code**: [Claude Agent SDK Documentation](https://github.com/anthropics/claude-agent)
- **ADW Workflows**: `adws/README.md`

---

## Lessons Learned

### What Went Well
1. **Symlinks encode intent** - Architecture visible in filesystem structure
2. **Git mv preserves history** - Full file history maintained across moves
3. **Backward compatibility** - No breaking changes, existing code works
4. **Clear categorization** - Obvious where each command belongs

### What to Improve
1. **Windows documentation** - Need clearer Windows symlink setup guide
2. **Automated tests** - Add to CI/CD to catch symlink issues early
3. **Discovery logic** - Simplify now that symlinks handle routing
4. **Team communication** - Announce architectural changes clearly

### Future Considerations
1. **Apply pattern elsewhere** - Could use symlinks for other duplicated structures
2. **Automated validation** - CI job to verify symlink integrity
3. **Command registry** - Consider dynamic command generation/discovery
4. **Documentation generation** - Auto-generate command catalog from frontmatter

---

## Appendix

### Complete Command List

**a-commands (13):**
1. all_tools.md
2. build.md
3. find_and_summarize.md
4. load_ai_docs.md
5. load_bundle.md
6. plan.md
7. prime.md
8. prime_3.md
9. prime_cc.md
10. question.md
11. quick-plan.md
12. reset.md
13. t_metaprompt_workflow.md

**o-commands (7):**
1. build_in_parallel.md
2. orch_one_shot_agent.md
3. orch_plan_w_scouts_build_review.md
4. orch_scout_and_build.md
5. orch_trinity_mode.md
6. parallel_subagents.md
7. plan_w_scouters.md

### Symlink Paths Reference

```
.claude/commands -> a-commands
apps/orchestrator_3_stream/.claude/commands -> ../../../.claude/o-commands
apps/orchestrator_3_stream/.claude/agents -> ../../../.claude/agents
```

### Migration Timeline Estimate

| Phase | Duration | Activities |
|-------|----------|------------|
| Preparation | 30 min | Audit, backup, create branches |
| Execution | 1 hour | Create dirs, move files, create symlinks |
| Discovery Update | 30 min | Simplify Python discovery logic |
| Documentation | 1.5 hours | Update CLAUDE.md, CONTEXT_MAP.md, this guide |
| Testing | 1 hour | Automated tests, manual verification |
| Commit & Deploy | 30 min | Git commit, PR, merge |
| **Total** | **5.5 hours** | Full migration with buffer |

### Git Commit Message Template

```
refactor: implement o-commands/a-commands separation with symlinks

Migrated from duplicated .claude/commands/ structure to clean separation:
- a-commands/: Application/ADW commands (13 commands)
- o-commands/: Orchestrator commands (7 commands)
- Symlinks for backward compatibility and context routing
- Zero duplication, single source of truth

Changes:
- Created .claude/a-commands/ (13 ADW commands)
- Created .claude/o-commands/ (7 orchestrator commands)
- .claude/commands -> a-commands (root default)
- apps/orchestrator/.claude/commands -> ../../.claude/o-commands
- apps/orchestrator/.claude/agents -> ../../.claude/agents
- Removed all duplicated files

Benefits:
- Eliminated 19 duplicate command files
- Clear separation of concerns (orchestrator vs ADW)
- Simplified discovery logic (no merging needed)
- Single source of truth for all commands and agents
- Easier maintenance (add command once, available everywhere)

Discovery logic simplified:
- Before: Load root + app, merge with precedence
- After: Load via symlink (automatically correct commands)

Updated documentation:
- CLAUDE.md: Added "Command Architecture" section
- CONTEXT_MAP.md: Updated .claude directory description
- docs/guides/o-commands-a-commands-migration.md: Full migration guide

Testing:
- ✅ Root sees 13 a-commands via symlink
- ✅ Orchestrator sees 7 o-commands via symlink
- ✅ Both contexts share 7 agent templates
- ✅ All commands discoverable
- ✅ No duplication
- ✅ Backward compatible

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

**Document Version:** 1.0
**Created:** 2025-11-08
**Status:** Planning Phase - Ready for Implementation
**Author:** Build Agent (Claude Code)
**Maintained By:** Ozean Licht Team + Autonomous Agents

---

*This migration guide is part of the broader command discovery improvement initiative documented in `COMMAND_PALETTE_EXECUTIVE_SUMMARY.md`. It addresses the long-term architectural maintainability while the multi-root workspace solution provides immediate UX improvements.*
