# O-Commands & A-Commands Architecture

## Overview

The slash commands are organized into two distinct categories using a symlink-based architecture:

- **O-Commands** (Orchestrator Commands) - Advanced orchestration and multi-agent workflows
- **A-Commands** (Agent Commands) - General-purpose agent commands for everyday tasks

## Directory Structure

```
.claude/
├── o-commands/          # Orchestrator commands (7 commands)
│   ├── orch_scout_and_build.md
│   ├── orch_one_shot_agent.md
│   ├── orch_plan_w_scouts_build_review.md
│   ├── orch_trinity_mode.md
│   ├── build_in_parallel.md
│   ├── plan_w_scouters.md
│   └── parallel_subagents.md
│
├── a-commands/          # Agent commands (13 commands)
│   ├── plan.md
│   ├── build.md
│   ├── prime.md
│   ├── prime_3.md
│   ├── prime_cc.md
│   ├── question.md
│   ├── quick-plan.md
│   ├── find_and_summarize.md
│   ├── load_ai_docs.md
│   ├── load_bundle.md
│   ├── all_tools.md
│   ├── t_metaprompt_workflow.md
│   └── reset.md
│
└── commands -> a-commands   # Symlink for root context
```

## Symlink Architecture

The system uses symlinks to provide context-specific command discovery:

### Root Context
- `.claude/commands` → `a-commands` (13 general-purpose commands)
- Used by: Root-level agents, general development workflows

### Orchestrator Context
- `apps/orchestrator_3_stream/.claude/commands` → `../../../.claude/o-commands` (7 orchestrator commands)
- Used by: Orchestrator agents, multi-agent workflows, ADW system

## Command Categories

### O-Commands (Orchestrator)
Advanced orchestration commands that manage multiple agents and complex workflows:

1. **orch_scout_and_build** - Scout codebase, then build solution
2. **orch_one_shot_agent** - Create ephemeral agent for specific task
3. **orch_plan_w_scouts_build_review** - Full pipeline: scout → plan → build → review
4. **orch_trinity_mode** - Three-agent collaboration pattern
5. **build_in_parallel** - Parallel file creation across multiple agents
6. **plan_w_scouters** - Planning with multiple scout agents
7. **parallel_subagents** - Launch multiple parallel agents for task

### A-Commands (Agent)
General-purpose commands for everyday development tasks:

1. **plan** - Create implementation plans
2. **build** - Build implementation from plan
3. **prime** - Load codebase context
4. **prime_3** - Enhanced context loading
5. **prime_cc** - Claude Code focused context
6. **question** - Answer questions about codebase
7. **quick-plan** - Fast planning without scouts
8. **find_and_summarize** - Find and summarize code
9. **load_ai_docs** - Load documentation from URLs
10. **load_bundle** - Load context bundles
11. **all_tools** - Show all available tools
12. **t_metaprompt_workflow** - Create new prompts
13. **reset** - Reset orchestrator context

## Benefits of This Architecture

### 1. **Clear Separation of Concerns**
- Orchestrator commands are isolated from general commands
- Reduces cognitive load - users see only relevant commands
- Easier to understand command purposes

### 2. **Context-Specific Discovery**
- Root context: General development commands
- Orchestrator context: Advanced orchestration commands
- No command pollution across contexts

### 3. **Maintainability**
- Single source of truth for each command
- Easy to add new commands to appropriate category
- Git history preserved through `git mv`

### 4. **Backward Compatible**
- Symlinks ensure existing code continues to work
- No changes needed to discovery logic
- Transparent to command consumers

## Migration

The migration from flat structure to o-commands/a-commands was performed using:

```bash
python3 scripts/migrate_commands.py
```

This script:
1. Categorizes commands based on functionality
2. Uses `git mv` to preserve history
3. Creates symlinks for backward compatibility
4. Validates the new structure

## Testing

Verify the structure with:

```bash
python3 scripts/test_command_discovery.py
```

This validates:
- Symlinks are correctly created
- Command discovery works in both contexts
- All expected commands are present
- File counts match expectations

## Adding New Commands

### Adding an O-Command
1. Create `.md` file in `.claude/o-commands/`
2. Test in orchestrator context: `cd apps/orchestrator_3_stream`
3. Verify with: `/your-command-name`

### Adding an A-Command
1. Create `.md` file in `.claude/a-commands/`
2. Test in root context: `cd /opt/ozean-licht-ecosystem`
3. Verify with: `/your-command-name`

## Troubleshooting

### Commands Not Discovered
```bash
# Check symlinks
ls -la .claude/commands
ls -la apps/orchestrator_3_stream/.claude/commands

# Verify targets
readlink .claude/commands
readlink apps/orchestrator_3_stream/.claude/commands
```

### Wrong Commands Discovered
```bash
# Check which directory is being accessed
cd <context-directory>
ls -la .claude/commands/

# Verify discovery
python3 scripts/test_command_discovery.py
```

### Symlink Broken
```bash
# Re-run migration (safe to run multiple times)
python3 scripts/migrate_commands.py
```

## Design Principles

1. **Single Source of Truth** - Each command file exists in exactly one location
2. **Symlinks for Access** - Use symlinks to provide context-specific views
3. **Git History Preserved** - Use `git mv` for all migrations
4. **Transparent Operation** - Discovery logic unchanged, works through symlinks
5. **Context Isolation** - Commands are scoped to appropriate contexts

## Future Enhancements

- [ ] Add validation pre-commit hook
- [ ] Create command usage analytics
- [ ] Auto-generate command catalog documentation
- [ ] Add command search/filter UI in orchestrator
- [ ] Implement command namespacing for multi-tenancy

---

**Last Updated:** 2025-11-09
**Migration Script:** `scripts/migrate_commands.py`
**Test Script:** `scripts/test_command_discovery.py`
