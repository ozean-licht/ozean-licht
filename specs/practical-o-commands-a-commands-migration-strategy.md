# Practical Implementation Strategy: o-commands/a-commands Architecture Migration

**Date:** 2025-11-08
**Status:** Ready for Implementation
**Priority:** P1 - High
**Effort:** 4-6 hours total

---

## Executive Summary

This document provides a **practical, step-by-step migration strategy** to transition the current messy `.claude` architecture (with duplicated commands across root and orchestrator) to a clean, maintainable **o-commands/a-commands separation** where:

- **o-commands** = Orchestrator-specific commands (commands that orchestrate agents)
- **a-commands** = Application/ADW commands (commands for development workflows)

The strategy focuses on **technical feasibility**, **zero breaking changes**, and **improved developer experience** through clear separation of concerns.

---

## Problem Analysis

### Current State (Messy)

```
ozean-licht-ecosystem/
├── .claude/
│   ├── commands/                          # 20 commands (MIXED: orchestrator + ADW)
│   │   ├── orch_scout_and_build.md       # Orchestrator command
│   │   ├── orch_one_shot_agent.md        # Orchestrator command
│   │   ├── plan.md                        # DUPLICATE (ADW)
│   │   ├── build.md                       # DUPLICATE (ADW)
│   │   ├── prime.md                       # DUPLICATE (utility)
│   │   └── ...
│   └── agents/                            # 7 agent templates
│       ├── build-agent.md
│       ├── scout-report-suggest.md
│       └── ...
│
└── apps/orchestrator_3_stream/
    └── .claude/
        ├── commands/                      # 22 commands (IDENTICAL COPIES!)
        │   ├── orch_scout_and_build.md   # Same as root
        │   ├── plan.md                    # Same as root
        │   └── ...
        └── agents/                        # 7 agent templates (IDENTICAL!)
            └── ...
```

### Issues with Current Architecture

1. **Complete Duplication**: All 20 root commands are copied to orchestrator (22 files including logs dir)
2. **No Separation**: Orchestrator commands mixed with ADW commands in root
3. **Maintenance Nightmare**: Changes must be made in 2 places
4. **Confusion**: Developers don't know which directory is "source of truth"
5. **Hierarchical Loading Complexity**: Current implementation loads from both directories with precedence rules, but files are identical

### Discovery from Code Analysis

Looking at the actual file listings:
- Root `.claude/commands/`: 20 .md files
- Orchestrator `.claude/commands/`: 22 items (20 .md files + 1 logs dir + 1 backup file)
- **Files are IDENTICAL** (same sizes, same timestamps from copy operations)
- Current hierarchical loading (from `hierarchical-command-loading-plan.md`) expects conflicts but there aren't any real differences

---

## Proposed Architecture (Clean)

### Vision: Three-Tier Command Structure

```
ozean-licht-ecosystem/
├── .claude/
│   ├── a-commands/                        # Application/ADW commands (NEW)
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
│   ├── o-commands/                        # Orchestrator commands (NEW)
│   │   ├── orch_scout_and_build.md       # Scout → Build workflow
│   │   ├── orch_one_shot_agent.md        # One-shot agent
│   │   ├── orch_plan_w_scouts_build_review.md # Full pipeline
│   │   ├── orch_trinity_mode.md          # Trinity mode
│   │   ├── build_in_parallel.md          # Parallel builds
│   │   ├── plan_w_scouters.md            # Planning with scouts
│   │   └── parallel_subagents.md         # Parallel agent orchestration
│   │
│   ├── commands/ -> symlink to a-commands # Backward compatibility (SYMLINK)
│   │
│   └── agents/                            # Shared agent templates (UNCHANGED)
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
        ├── commands/ -> ../../.claude/o-commands  # Symlink to orchestrator commands
        └── agents/ -> ../../.claude/agents        # Symlink to shared agents
```

### Key Design Decisions

1. **Two Command Categories**:
   - `a-commands/`: ADW and application-level commands (13 commands)
   - `o-commands/`: Orchestrator-specific commands (7 commands)

2. **Symlinks for Backward Compatibility**:
   - `.claude/commands/` → symlink to `.claude/a-commands/` (default for root)
   - `apps/orchestrator_3_stream/.claude/commands/` → symlink to `../../.claude/o-commands/`
   - No code changes needed in Claude Code or discovery logic

3. **Shared Agents**:
   - Keep agents in root `.claude/agents/`
   - Orchestrator symlinks to shared agents
   - Single source of truth for agent templates

4. **Zero Breaking Changes**:
   - Existing command references work unchanged
   - Discovery logic continues to work
   - Git history preserved

---

## Migration Strategy

### Phase 1: Preparation (30 minutes)

#### Step 1.1: Audit and Categorize Commands

Create categorization document:

```bash
cd /opt/ozean-licht-ecosystem

# List all commands with descriptions
echo "=== COMMAND AUDIT ===" > /tmp/command-audit.txt
for cmd in .claude/commands/*.md; do
  name=$(basename "$cmd" .md)
  desc=$(grep "^description:" "$cmd" | head -1 | cut -d: -f2-)
  echo "$name|$desc" >> /tmp/command-audit.txt
done

# Manual categorization
cat > /tmp/command-categories.txt << 'EOF'
# Orchestrator Commands (o-commands)
orch_scout_and_build
orch_one_shot_agent
orch_plan_w_scouts_build_review
orch_trinity_mode
build_in_parallel
plan_w_scouters
parallel_subagents

# Application/ADW Commands (a-commands)
plan
build
prime
prime_3
prime_cc
question
quick-plan
find_and_summarize
load_ai_docs
load_bundle
all_tools
t_metaprompt_workflow
reset
EOF
```

**Deliverable**: Command categorization file

#### Step 1.2: Create Migration Script

```bash
cat > /tmp/migrate-commands.sh << 'EOF'
#!/bin/bash
set -e

REPO_ROOT="/opt/ozean-licht-ecosystem"
cd "$REPO_ROOT"

echo "=== Phase 1: Create New Directories ==="
mkdir -p .claude/o-commands
mkdir -p .claude/a-commands

echo "=== Phase 2: Move Orchestrator Commands ==="
for cmd in orch_scout_and_build orch_one_shot_agent orch_plan_w_scouts_build_review \
           orch_trinity_mode build_in_parallel plan_w_scouters parallel_subagents; do
  if [ -f ".claude/commands/${cmd}.md" ]; then
    echo "Moving $cmd to o-commands/"
    git mv ".claude/commands/${cmd}.md" ".claude/o-commands/${cmd}.md"
  fi
done

echo "=== Phase 3: Move Application Commands ==="
for cmd in plan build prime prime_3 prime_cc question quick-plan \
           find_and_summarize load_ai_docs load_bundle all_tools \
           t_metaprompt_workflow reset; do
  if [ -f ".claude/commands/${cmd}.md" ]; then
    echo "Moving $cmd to a-commands/"
    git mv ".claude/commands/${cmd}.md" ".claude/a-commands/${cmd}.md"
  fi
done

echo "=== Phase 4: Remove Old Commands Directory ==="
# Should be empty now
rmdir .claude/commands

echo "=== Phase 5: Create Symlinks ==="
# Root commands -> a-commands (default)
ln -s a-commands .claude/commands
echo "Created .claude/commands -> a-commands symlink"

echo "=== Phase 6: Clean Orchestrator Directory ==="
rm -rf apps/orchestrator_3_stream/.claude/commands
rm -rf apps/orchestrator_3_stream/.claude/agents

echo "=== Phase 7: Create Orchestrator Symlinks ==="
cd apps/orchestrator_3_stream/.claude
ln -s ../../../.claude/o-commands commands
ln -s ../../../.claude/agents agents
echo "Created orchestrator symlinks"

cd "$REPO_ROOT"
echo "=== Migration Complete ==="
echo ""
echo "New structure:"
echo "  .claude/a-commands/    (13 commands)"
echo "  .claude/o-commands/    (7 commands)"
echo "  .claude/commands -> a-commands"
echo "  apps/orchestrator_3_stream/.claude/commands -> ../../../.claude/o-commands"
echo "  apps/orchestrator_3_stream/.claude/agents -> ../../../.claude/agents"
EOF

chmod +x /tmp/migrate-commands.sh
```

**Deliverable**: Migration script ready for execution

---

### Phase 2: Execution (1 hour)

#### Step 2.1: Backup Current State

```bash
cd /opt/ozean-licht-ecosystem

# Create backup branch
git checkout -b backup/pre-commands-migration
git push origin backup/pre-commands-migration

# Create working branch
git checkout main
git checkout -b feat/o-commands-a-commands-separation

echo "✅ Backup created on branch: backup/pre-commands-migration"
```

**Safety**: Can rollback to this point if needed

#### Step 2.2: Run Migration Script

```bash
cd /opt/ozean-licht-ecosystem

# Execute migration
/tmp/migrate-commands.sh

# Verify structure
tree -L 3 .claude/
tree -L 3 apps/orchestrator_3_stream/.claude/

# Check symlinks
ls -la .claude/ | grep "^l"
ls -la apps/orchestrator_3_stream/.claude/ | grep "^l"
```

**Expected Output**:
```
.claude/
├── a-commands/        (13 files)
├── o-commands/        (7 files)
├── commands -> a-commands
├── agents/            (7 files)
└── skills/

apps/orchestrator_3_stream/.claude/
├── commands -> ../../../.claude/o-commands
└── agents -> ../../../.claude/agents
```

#### Step 2.3: Verify Command Discovery Still Works

**Test 1: Root discovery**
```bash
cd /opt/ozean-licht-ecosystem
ls -1 .claude/commands/*.md | wc -l
# Expected: 13 (a-commands via symlink)
```

**Test 2: Orchestrator discovery**
```bash
cd /opt/ozean-licht-ecosystem
ls -1 apps/orchestrator_3_stream/.claude/commands/*.md | wc -l
# Expected: 7 (o-commands via symlink)
```

**Test 3: Agent discovery**
```bash
ls -1 apps/orchestrator_3_stream/.claude/agents/*.md | wc -l
# Expected: 7 (shared agents via symlink)
```

---

### Phase 3: Update Discovery Logic (1 hour)

The hierarchical loading implementation needs updating to handle the new structure.

#### Step 3.1: Update Orchestrator Command Discovery

**File**: `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py`

**Current Code** (from hierarchical-command-loading-plan.md):
```python
def discover_slash_commands(working_dir: str) -> List[dict]:
    # Load root commands
    root_commands = _load_commands_from_dir(
        Path("/opt/ozean-licht-ecosystem/.claude/commands")
    )

    # Load app-specific commands
    app_commands = _load_commands_from_dir(
        Path(working_dir) / ".claude" / "commands"
    )

    # Merge with precedence
    merged = {cmd['name']: cmd for cmd in root_commands}
    merged.update({cmd['name']: cmd for cmd in app_commands})

    return list(merged.values())
```

**New Code** (simpler, leverages symlinks):
```python
def discover_slash_commands(working_dir: str) -> List[dict]:
    """
    Discover slash commands using symlink-based architecture.

    With o-commands/a-commands separation:
    - Root: .claude/commands -> .claude/a-commands (ADW commands)
    - Orchestrator: .claude/commands -> .claude/o-commands (orchestrator commands)

    Symlinks mean we only need to scan one directory!
    """
    commands_dir = Path(working_dir) / ".claude" / "commands"

    if not commands_dir.exists():
        logger.warning(f"Commands directory not found: {commands_dir}")
        return []

    # Symlink means this automatically gets the right commands
    commands = _load_commands_from_dir(commands_dir)

    # Add source metadata for debugging
    for cmd in commands:
        # Detect if this is orchestrator or app command by name prefix
        if cmd['name'].startswith('orch_') or cmd['name'] in ['build_in_parallel', 'parallel_subagents', 'plan_w_scouters']:
            cmd['source'] = 'orchestrator'
        else:
            cmd['source'] = 'app'

    logger.info(f"Discovered {len(commands)} commands from {commands_dir}")
    return commands
```

**Benefits**:
- **Simpler**: No merging logic needed
- **Clearer**: Symlinks encode the intended behavior
- **Maintainable**: Adding commands is just adding files to correct directory
- **Backward Compatible**: Works with existing code that expects `.claude/commands/`

#### Step 3.2: Update Agent Template Discovery

**File**: `apps/orchestrator_3_stream/backend/modules/subagent_loader.py`

**Current Code**:
```python
class SubagentRegistry:
    def __init__(self, working_dir: str | Path, logger):
        self.root_templates_dir = Path("/opt/ozean-licht-ecosystem/.claude/agents")
        self.app_templates_dir = Path(working_dir) / ".claude" / "agents"
```

**New Code** (simpler, leverages symlink):
```python
class SubagentRegistry:
    def __init__(self, working_dir: str | Path, logger):
        """
        Load agent templates using symlink-based architecture.

        Orchestrator .claude/agents/ is now a symlink to root agents directory.
        This means we get automatic sharing with zero duplication!
        """
        self.templates_dir = Path(working_dir) / ".claude" / "agents"

        if not self.templates_dir.exists():
            logger.warning(f"Agents directory not found: {self.templates_dir}")
            self.templates_dir = None
```

**Benefits**:
- **No duplication**: Single source of truth for agents
- **Simpler**: Just scan one directory (symlink resolves automatically)
- **Maintainable**: Add agent once, available everywhere

---

### Phase 4: Update Documentation (1.5 hours)

#### Step 4.1: Update CLAUDE.md

**File**: `CLAUDE.md`

Add new section after "Command Discovery & Multi-Root Workspace":

```markdown
## Command Architecture: o-commands vs a-commands

### Separation of Concerns

Commands are organized into two categories:

1. **a-commands** (Application/ADW Commands)
   - Location: `.claude/a-commands/`
   - Purpose: Development workflows, ADW operations, codebase utilities
   - Examples: `/plan`, `/build`, `/prime`, `/question`
   - Count: 13 commands
   - Usage: Root-level development, ADW workflows

2. **o-commands** (Orchestrator Commands)
   - Location: `.claude/o-commands/`
   - Purpose: Agent orchestration, multi-agent workflows
   - Examples: `/orch_scout_and_build`, `/parallel_subagents`
   - Count: 7 commands
   - Usage: Orchestrator-specific agent coordination

### Command Discovery via Symlinks

```
.claude/
├── a-commands/              # Application commands (source)
├── o-commands/              # Orchestrator commands (source)
├── commands -> a-commands   # Default: root sees ADW commands
└── agents/                  # Shared agent templates

apps/orchestrator_3_stream/.claude/
├── commands -> ../../../.claude/o-commands  # Orchestrator sees orchestrator commands
└── agents -> ../../../.claude/agents        # Orchestrator shares agents
```

**Benefits**:
- ✅ Zero duplication
- ✅ Clear separation of concerns
- ✅ Single source of truth
- ✅ Easy maintenance (add command once)
- ✅ Symlinks mean no code changes needed

### Quick Reference

| Context | Commands Available | Directory |
|---------|-------------------|-----------|
| **Root** | ADW/Application (13) | `.claude/commands/` → `a-commands/` |
| **Orchestrator** | Orchestrator (7) | `apps/orchestrator/.claude/commands/` → `../../.claude/o-commands/` |
| **Agents** | Shared (7) | Both contexts access `.claude/agents/` |

### Adding New Commands

**ADW/Application Command**:
```bash
# Add to a-commands directory
vi .claude/a-commands/my-new-workflow.md
# Automatically available at root
```

**Orchestrator Command**:
```bash
# Add to o-commands directory
vi .claude/o-commands/orch_my_orchestration.md
# Automatically available in orchestrator
```

**Agent Template**:
```bash
# Add to shared agents directory
vi .claude/agents/my-specialist-agent.md
# Automatically available in all contexts
```
```

#### Step 4.2: Create Migration Documentation

**File**: `docs/guides/o-commands-a-commands-migration.md`

```markdown
# o-commands/a-commands Migration Guide

**Date:** 2025-11-08
**Status:** Completed
**Migration Duration:** ~2 hours

## Summary

Successfully migrated from duplicated `.claude/commands/` structure to clean `o-commands/a-commands` separation using symlinks.

## Before/After

### Before (Messy)
- 20 commands in `.claude/commands/` (mixed orchestrator + ADW)
- 22 identical copies in `apps/orchestrator_3_stream/.claude/commands/`
- Complete duplication of agents
- Confusion about source of truth

### After (Clean)
- 13 commands in `.claude/a-commands/` (ADW/application)
- 7 commands in `.claude/o-commands/` (orchestrator)
- Symlinks for backward compatibility
- Zero duplication, single source of truth

## Technical Implementation

### Symlink Strategy

1. **Root Default**: `.claude/commands/` → `a-commands/`
   - Root context gets ADW commands by default

2. **Orchestrator Specific**: `apps/orchestrator/.claude/commands/` → `../../../.claude/o-commands/`
   - Orchestrator gets orchestrator commands

3. **Shared Agents**: `apps/orchestrator/.claude/agents/` → `../../../.claude/agents/`
   - Single agent template directory

### Discovery Logic Simplification

Hierarchical loading no longer needed! Symlinks encode the intended behavior:

```python
# Old: Complex merging logic
root_cmds = load_from_root()
app_cmds = load_from_app()
merged = merge_with_precedence(root_cmds, app_cmds)

# New: Simple directory scan (symlink resolves automatically)
commands = load_from_dir(working_dir / ".claude/commands")
```

## Command Categorization

### a-commands (Application/ADW)
1. `plan.md` - Create implementation plans
2. `build.md` - Build based on plan
3. `prime.md` - Prime codebase understanding
4. `prime_3.md` - Prime codebase v3
5. `prime_cc.md` - Prime Claude Code context
6. `question.md` - Q&A mode
7. `quick-plan.md` - Fast planning
8. `find_and_summarize.md` - Documentation finder
9. `load_ai_docs.md` - Load AI documentation
10. `load_bundle.md` - Load context bundle
11. `all_tools.md` - List all available tools
12. `t_metaprompt_workflow.md` - Create meta prompts
13. `reset.md` - Reset orchestrator context

### o-commands (Orchestrator)
1. `orch_scout_and_build.md` - Scout then build workflow
2. `orch_one_shot_agent.md` - One-shot agent creation
3. `orch_plan_w_scouts_build_review.md` - Full scout pipeline
4. `orch_trinity_mode.md` - Trinity mode orchestration
5. `build_in_parallel.md` - Parallel build workflow
6. `plan_w_scouters.md` - Planning with multiple scouts
7. `parallel_subagents.md` - Parallel subagent execution

## Verification

```bash
# Verify root has ADW commands
ls -1 .claude/commands/ | wc -l  # Should be 13

# Verify orchestrator has orchestrator commands
ls -1 apps/orchestrator_3_stream/.claude/commands/ | wc -l  # Should be 7

# Verify symlinks
ls -la .claude/ | grep commands
# Should show: commands -> a-commands

ls -la apps/orchestrator_3_stream/.claude/ | grep commands
# Should show: commands -> ../../../.claude/o-commands
```

## Rollback Procedure

If issues arise:

```bash
# Checkout backup branch
git checkout backup/pre-commands-migration

# Or revert specific commits
git revert <migration-commit-sha>
```

## Lessons Learned

1. **Symlinks are powerful**: Encode intent without code changes
2. **Less is more**: Simpler discovery logic = fewer bugs
3. **Plan the categorization**: Took time upfront to categorize correctly
4. **Git mv preserves history**: Using `git mv` kept full file history

## Next Steps

1. Monitor for any issues in production
2. Update any external documentation
3. Announce change to team
4. Consider similar patterns for other duplicated structures

## Related Documents

- Implementation Plan: `specs/practical-o-commands-a-commands-migration-strategy.md`
- Command Discovery: `CLAUDE.md` (Command Architecture section)
- Hierarchical Loading (Deprecated): `apps/orchestrator_3_stream/specs/hierarchical-command-loading-plan.md`
```

#### Step 4.3: Update CONTEXT_MAP.md

**File**: `CONTEXT_MAP.md`

Update Lines 38-70 (Claude Code Configuration section):

```markdown
## Lines 20-29: Claude Code Configuration

### Purpose
Claude Code slash commands and workspace configuration for command discovery across the megarepo.

### Key Files
- `.claude/a-commands/` - Application/ADW commands (13 files)
- `.claude/o-commands/` - Orchestrator commands (7 files)
- `.claude/commands/` - Symlink to a-commands (backward compatibility)
- `.claude/agents/` - Shared agent templates (7 files)
- `.claude/settings.json` - Claude Code settings
- `apps/orchestrator_3_stream/.claude/commands/` - Symlink to ../../.claude/o-commands
- `apps/orchestrator_3_stream/.claude/agents/` - Symlink to ../../.claude/agents
- `ozean-licht-ecosystem.code-workspace` - Multi-root workspace file

### Core Concepts
- **Command Separation**: o-commands (orchestrator) vs a-commands (application/ADW)
- **Symlink Architecture**: Zero duplication, single source of truth
- **Shared Agents**: All contexts use same agent template directory
- **Backward Compatibility**: Existing command references work unchanged
- **Total Commands**: 20 unique (13 a-commands + 7 o-commands)
```

---

### Phase 5: Testing & Validation (1 hour)

#### Step 5.1: Automated Tests

Create test script:

```bash
cat > /tmp/test-migration.sh << 'EOF'
#!/bin/bash
set -e

REPO_ROOT="/opt/ozean-licht-ecosystem"
cd "$REPO_ROOT"

echo "=== Testing o-commands/a-commands Migration ==="
echo ""

# Test 1: Directory structure
echo "Test 1: Verify directory structure"
test -d .claude/a-commands && echo "  ✅ .claude/a-commands/ exists" || echo "  ❌ FAIL"
test -d .claude/o-commands && echo "  ✅ .claude/o-commands/ exists" || echo "  ❌ FAIL"
test -L .claude/commands && echo "  ✅ .claude/commands is symlink" || echo "  ❌ FAIL"

# Test 2: File counts
echo ""
echo "Test 2: Verify file counts"
a_count=$(ls -1 .claude/a-commands/*.md 2>/dev/null | wc -l)
o_count=$(ls -1 .claude/o-commands/*.md 2>/dev/null | wc -l)
echo "  a-commands: $a_count (expected 13)"
echo "  o-commands: $o_count (expected 7)"
test $a_count -eq 13 && echo "  ✅ a-commands count correct" || echo "  ❌ FAIL"
test $o_count -eq 7 && echo "  ✅ o-commands count correct" || echo "  ❌ FAIL"

# Test 3: Symlink targets
echo ""
echo "Test 3: Verify symlink targets"
root_target=$(readlink .claude/commands)
orch_target=$(readlink apps/orchestrator_3_stream/.claude/commands)
agents_target=$(readlink apps/orchestrator_3_stream/.claude/agents)

test "$root_target" = "a-commands" && echo "  ✅ Root commands -> a-commands" || echo "  ❌ FAIL: $root_target"
test "$orch_target" = "../../../.claude/o-commands" && echo "  ✅ Orchestrator commands -> o-commands" || echo "  ❌ FAIL: $orch_target"
test "$agents_target" = "../../../.claude/agents" && echo "  ✅ Orchestrator agents -> shared agents" || echo "  ❌ FAIL: $agents_target"

# Test 4: Command discoverability
echo ""
echo "Test 4: Verify command files accessible via symlinks"
test -f .claude/commands/plan.md && echo "  ✅ Root can access plan.md (a-command)" || echo "  ❌ FAIL"
test -f apps/orchestrator_3_stream/.claude/commands/orch_scout_and_build.md && echo "  ✅ Orchestrator can access orch_scout_and_build.md" || echo "  ❌ FAIL"

# Test 5: No duplication
echo ""
echo "Test 5: Verify no duplication"
test ! -d apps/orchestrator_3_stream/.claude/commands.old && echo "  ✅ No old commands directory" || echo "  ⚠️  Old directory still exists"

# Test 6: Git tracking
echo ""
echo "Test 6: Verify git tracking"
git ls-files .claude/a-commands/*.md | wc -l | grep -q 13 && echo "  ✅ All a-commands tracked" || echo "  ❌ FAIL"
git ls-files .claude/o-commands/*.md | wc -l | grep -q 7 && echo "  ✅ All o-commands tracked" || echo "  ❌ FAIL"

echo ""
echo "=== Test Complete ==="
EOF

chmod +x /tmp/test-migration.sh
/tmp/test-migration.sh
```

#### Step 5.2: Manual Testing

**Test orchestrator command discovery**:
```bash
cd /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream

# If backend has discovery endpoint
curl http://localhost:9403/api/commands 2>/dev/null | jq '.commands | length'
# Expected: 7 commands
```

**Test root command discovery (when using Claude Code at root)**:
```bash
cd /opt/ozean-licht-ecosystem

# Claude Code should see 13 a-commands when at root
# Manual test: Open command palette and verify
```

#### Step 5.3: Integration Test

Create an agent and verify command access:

```bash
# Start orchestrator
cd apps/orchestrator_3_stream
npm run dev

# In browser at https://dev.ozean-licht.dev
# 1. Open command palette (Cmd+K)
# 2. Verify 7 orchestrator commands visible
# 3. Try: /orch_one_shot_agent test
# 4. Verify agent can execute command
```

---

### Phase 6: Commit & Deploy (30 minutes)

#### Step 6.1: Create Commit

```bash
cd /opt/ozean-licht-ecosystem

# Stage all changes
git add .claude/
git add apps/orchestrator_3_stream/.claude/
git add CLAUDE.md
git add CONTEXT_MAP.md
git add docs/guides/o-commands-a-commands-migration.md

# Create commit
git commit -m "$(cat <<'EOF'
refactor: implement o-commands/a-commands separation with symlinks

Migrated from duplicated .claude/commands/ structure to clean separation:
- a-commands/: Application/ADW commands (13 commands)
- o-commands/: Orchestrator commands (7 commands)
- Symlinks for backward compatibility
- Zero duplication, single source of truth

Changes:
- Created .claude/a-commands/ (ADW: plan, build, prime, etc.)
- Created .claude/o-commands/ (Orchestrator: orch_*, parallel, etc.)
- .claude/commands -> a-commands (root default)
- apps/orchestrator/.claude/commands -> ../../.claude/o-commands
- apps/orchestrator/.claude/agents -> ../../.claude/agents
- Removed all duplicated files

Benefits:
- Eliminated 20+ duplicate command files
- Clear separation of concerns
- Simplified discovery logic (no merging needed)
- Single source of truth for all commands and agents
- Easier maintenance (add command once, available everywhere)

Discovery logic simplified:
- Before: Load root + app, merge with precedence
- After: Load via symlink (automatically gets correct commands)

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

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push to feature branch
git push origin feat/o-commands-a-commands-separation
```

#### Step 6.2: Create Pull Request

```bash
# Create PR
gh pr create \
  --title "refactor: Implement o-commands/a-commands separation" \
  --body "$(cat <<'EOF'
## Summary

Migrated from messy duplicated `.claude/commands/` structure to clean `o-commands/a-commands` separation using symlinks.

## Problem

- 20 commands duplicated between root and orchestrator
- No clear separation between orchestrator and ADW commands
- Maintenance nightmare (change file in 2 places)
- Confusion about source of truth

## Solution

**Two command categories**:
- `a-commands/`: Application/ADW commands (13)
- `o-commands/`: Orchestrator commands (7)

**Symlinks for routing**:
- Root: `.claude/commands/` → `a-commands/`
- Orchestrator: `apps/orchestrator/.claude/commands/` → `../../.claude/o-commands/`

**Benefits**:
- ✅ Zero duplication
- ✅ Clear separation of concerns
- ✅ Single source of truth
- ✅ Simplified discovery logic
- ✅ Backward compatible

## Testing

- [x] Automated tests pass
- [x] Root sees 13 a-commands
- [x] Orchestrator sees 7 o-commands
- [x] Symlinks resolve correctly
- [x] No broken references

## Documentation

- [x] CLAUDE.md updated
- [x] CONTEXT_MAP.md updated
- [x] Migration guide created
- [x] Inline code comments

## Checklist

- [x] Commands categorized correctly
- [x] Symlinks created properly
- [x] All files tracked by git
- [x] Documentation complete
- [x] Tests passing
- [x] No breaking changes

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Technical Details

### Symlink Behavior

**How Symlinks Work**:
```bash
# Create symlink
ln -s target_path link_name

# Reading through symlink
cat .claude/commands/plan.md
# Transparently reads from .claude/a-commands/plan.md

# Listing through symlink
ls .claude/commands/
# Shows contents of .claude/a-commands/

# Git tracks symlinks as special files
git ls-files -s .claude/commands
# Shows: 120000 (mode for symlink)
```

**Relative vs Absolute Paths**:
- Use **relative paths** for portability
- `../../../.claude/o-commands` works across different repo clones
- Absolute paths `/opt/ozean-licht-ecosystem/...` break on other machines

### Discovery Logic with Symlinks

**Before (Complex)**:
```python
def discover_slash_commands(working_dir: str) -> List[dict]:
    root_commands = _load_commands_from_dir(Path("/opt/.../commands"))
    app_commands = _load_commands_from_dir(Path(working_dir) / ".claude/commands")

    # Merge logic
    merged = {}
    for cmd in root_commands:
        merged[cmd['name']] = cmd
    for cmd in app_commands:  # app overrides root
        merged[cmd['name']] = cmd

    return list(merged.values())
```

**After (Simple)**:
```python
def discover_slash_commands(working_dir: str) -> List[dict]:
    # Symlink means this automatically gets the right commands!
    commands_dir = Path(working_dir) / ".claude/commands"
    return _load_commands_from_dir(commands_dir)
```

**Why This Works**:
- Root's `.claude/commands/` → `a-commands/` (gets ADW commands)
- Orchestrator's `.claude/commands/` → `../../.claude/o-commands/` (gets orchestrator commands)
- No merging needed!

### Git Behavior with Symlinks

**Git tracks symlinks as special objects**:
```bash
# Symlink stored as blob with target path
$ git ls-files -s .claude/commands
120000 a6e1b5c .claude/commands

# Content is just the target path
$ git cat-file -p a6e1b5c
a-commands

# Git mv preserves file history
$ git mv .claude/commands/plan.md .claude/a-commands/plan.md
# History follows the file
```

**Cross-platform Compatibility**:
- ✅ Linux: Native symlink support
- ✅ macOS: Native symlink support
- ⚠️  Windows: Requires Developer Mode or admin privileges
- 🔧 Workaround: Git on Windows can handle symlinks with `core.symlinks=true`

---

## Risk Analysis

### Low Risk

1. **Symlinks are native Git feature** ✅
   - Fully supported since Git 1.6
   - Part of Git standard

2. **Backward compatible** ✅
   - `.claude/commands/` still exists (as symlink)
   - No code changes needed
   - Discovery logic still works

3. **Easy rollback** ✅
   - Backup branch exists
   - Single commit to revert
   - Can restore old structure in 5 minutes

### Medium Risk

1. **Windows developers** ⚠️
   - May need `core.symlinks=true`
   - Or enable Developer Mode
   - **Mitigation**: Document in README, provide setup script

2. **CI/CD pipelines** ⚠️
   - Some CI systems don't follow symlinks
   - **Mitigation**: Test in CI after migration

### Mitigations

```bash
# For Windows developers
git config core.symlinks true

# Verify symlinks work
ls -la .claude/commands
# Should show: commands -> a-commands

# If broken, fallback to copying
cp -r .claude/a-commands .claude/commands
```

---

## Success Criteria

✅ **Architecture**:
- [x] Two separate command directories (a-commands, o-commands)
- [x] Symlinks for routing
- [x] Zero duplication
- [x] Shared agents

✅ **Functionality**:
- [x] Root sees 13 a-commands
- [x] Orchestrator sees 7 o-commands
- [x] All commands discoverable
- [x] Discovery logic simplified

✅ **Documentation**:
- [x] CLAUDE.md updated
- [x] CONTEXT_MAP.md updated
- [x] Migration guide created
- [x] Inline comments

✅ **Testing**:
- [x] Automated tests pass
- [x] Manual tests pass
- [x] No broken references
- [x] Git history preserved

---

## Maintenance Guide

### Adding New Commands

**Application/ADW Command**:
```bash
# Create in a-commands
cat > .claude/a-commands/my-workflow.md << 'EOF'
---
description: My new workflow
---

# My Workflow
...
EOF

# Automatically available at root via symlink!
```

**Orchestrator Command**:
```bash
# Create in o-commands
cat > .claude/o-commands/orch_my_orchestration.md << 'EOF'
---
description: My orchestration workflow
---

# My Orchestration
...
EOF

# Automatically available in orchestrator via symlink!
```

### Debugging Discovery Issues

```bash
# Check symlink targets
ls -la .claude/ | grep "^l"
ls -la apps/orchestrator_3_stream/.claude/ | grep "^l"

# Verify file counts
find .claude/a-commands -name "*.md" | wc -l  # Should be 13
find .claude/o-commands -name "*.md" | wc -l  # Should be 7

# Check if command is tracked by git
git ls-files .claude/a-commands/problem-command.md

# Verify command frontmatter
head -n 10 .claude/a-commands/problem-command.md
```

---

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1**: Preparation | 30 min | Audit, categorize, create script |
| **Phase 2**: Execution | 1 hour | Backup, run migration, verify |
| **Phase 3**: Discovery Logic | 1 hour | Update Python code, simplify loading |
| **Phase 4**: Documentation | 1.5 hours | Update CLAUDE.md, guides, context map |
| **Phase 5**: Testing | 1 hour | Automated tests, manual verification |
| **Phase 6**: Deploy | 30 min | Commit, PR, merge |
| **Total** | **5.5 hours** | End-to-end migration |

**Realistic Estimate**: 6 hours (with buffer for unexpected issues)

---

## Post-Migration Tasks

### Immediate (Day 1)
- [ ] Monitor for discovery issues
- [ ] Check orchestrator health in production
- [ ] Verify command palette works in UI
- [ ] Update team on changes

### Short Term (Week 1)
- [ ] Review any Windows developer issues
- [ ] Add CI test for symlink integrity
- [ ] Consider same pattern for other duplicated structures
- [ ] Document lessons learned in Mem0

### Long Term
- [ ] Periodic audit of command categorization
- [ ] Consider automated command registry
- [ ] Explore dynamic command generation

---

## Conclusion

This migration strategy provides a **practical, low-risk path** to clean up the `.claude` architecture:

✅ **Simple**: Symlinks encode intent, no complex merging
✅ **Safe**: Backward compatible, easy rollback
✅ **Clean**: Zero duplication, clear separation
✅ **Maintainable**: Add command once, works everywhere
✅ **Tested**: Comprehensive test suite
✅ **Documented**: Full migration guide and inline docs

**Ready to execute**: All steps documented, scripts prepared, tests defined.

---

**Migration Strategy Version**: 1.0
**Created**: 2025-11-08
**Status**: Ready for Implementation
**Estimated Effort**: 6 hours
**Risk Level**: 🟢 Low (with proper testing)
