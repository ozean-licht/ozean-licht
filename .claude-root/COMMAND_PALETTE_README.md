# Command Palette & Slash Commands Guide

## Quick Start: Access All Commands

### Option 1: Multi-Root Workspace (Recommended ⭐)
```bash
# Open the workspace file that has all folders:
code ozean-licht-ecosystem.code-workspace

# Or from VSCode: File → Open Workspace from File → select file
```

**Result**: Command palette shows 29-47 commands depending on which folder you're in.

### Option 2: Open Specific Folder
```bash
# For root commands:
code /opt/ozean-licht-ecosystem

# For orchestrator commands:
code /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream

# For Kids Ascension:
code /opt/ozean-licht-ecosystem/apps/kids-ascension
```

**Result**: Command palette shows only commands for that folder's context.

---

## Available Commands by Context

### 🌍 Root Context (29 Commands)

**Development** (9):
```
/plan                      # Create implementation plan
/implement                 # Execute a plan
/test                      # Run tests
/feature                   # Implement new feature
/bug                       # Report and fix bug
/patch                     # Quick patch
/chore                     # Maintenance task
/document                  # Generate documentation
/review                    # Code review
```

**Workflows** (6):
```
/classify_adw              # Classify ADW workflow
/cleanup_worktrees         # Clean ADW worktrees
/install_worktree          # Setup worktree
/track_agentic_kpis        # Track metrics
/classify_issue            # Classify GitHub issue
/create_issue              # Create issue
```

**Infrastructure** (4):
```
/health_check              # System health
/start                     # Start services
/tools                     # Tool management
/memory                    # Memory operations
```

**Advanced** (10):
```
/commit                    # Git operations
/pull_request              # PR management
/in_loop_review            # Review loop
/resolve_failed_test       # Fix test
/resolve_failed_e2e_test   # Fix E2E test
/coolify                   # Coolify deployment
/coolify-deploy            # Deploy with Coolify
/conditional_docs          # Conditional docs
/prepare_app               # Prepare app
/generate_branch_name      # Branch naming
```

### 🤖 Orchestrator Context (29 + 18 = 47 Commands)

All 29 root commands PLUS 18 orchestrator-specific:

**Multi-Agent Workflows**:
```
/orch_scout_and_build                    # Scout + build workflow
/orch_plan_w_scouts_build_review         # Full pipeline
/parallel_subagents                      # Run agents in parallel
/build_in_parallel                       # Build multiple projects
```

**Orchestrator Tools**:
```
/orch_one_shot_agent       # Single agent execution
/find_and_summarize        # Analyze and summarize
/load_bundle               # Load configuration
/load_ai_docs              # Load AI documentation
```

**Orchestrator Overrides**:
```
/plan                      # Orchestrator-specific version
/prime                     # Orchestrator-specific prime
```

**Utilities**:
```
/all_tools                 # List tools
/build                     # Build command
/prime_3                   # Prime v3
/prime_cc                  # Prime CC
/question                  # Ask question
/quick-plan                # Quick plan
```

### 📊 App Contexts

Each app (Admin, Kids Ascension, Ozean Licht) gets:
- All 29 root commands
- App-specific commands (if any)

---

## How Commands Work

### Invoking a Command

1. **Open Command Palette**: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. **Type command name**: `/plan`, `/feature`, etc.
3. **Select from results**: Click or press Enter
4. **Provide arguments**: Commands may prompt for input

### Example Workflow

```bash
# 1. Create an implementation plan
Cmd+Shift+P → /plan → Enter
# Input: "Add dark mode toggle to admin dashboard"
# Output: specs/add-dark-mode-toggle.md

# 2. Implement the plan
Cmd+Shift+P → /implement → Enter
# Input: specs/add-dark-mode-toggle.md
# Output: Implementation complete with git changes

# 3. Run tests
Cmd+Shift+P → /test → Enter
# Output: Test results

# 4. Create PR
Cmd+Shift+P → /pull_request → Enter
# Output: PR created and linked
```

---

## Troubleshooting

### "Command not found in palette"

**Diagnosis**:
```bash
# Check if you're in the right workspace
ls .claude/commands/ | grep your_command

# Check if using correct folder context
code ozean-licht-ecosystem.code-workspace
```

**Solution**:
1. Reload VSCode: `Cmd+Shift+P` → "Reload Window"
2. Verify you're in multi-root workspace
3. Check if command exists in this context (see table above)

### "Wrong version of command running"

**Cause**: App-specific commands override root commands with same name

**Solution**:
- Check which folder is active in multi-root workspace
- Use the correct context for your task
- Reference `.claude/README.md` for what each command does

### "Can't find orchestrator commands"

**Solution**:
```bash
# Option 1: Use multi-root workspace
code ozean-licht-ecosystem.code-workspace

# Option 2: Open orchestrator folder directly
code apps/orchestrator_3_stream

# Option 3: Search by prefix
Cmd+Shift+P → "orch" → see orchestrator commands
```

### "Hook not executing"

**Check**:
```bash
# Verify hooks exist
ls .claude/hooks/

# Check settings.json has hook references
grep "CLAUDE_PROJECT_DIR" .claude/settings.json

# Check working directory
pwd  # Should be /opt/ozean-licht-ecosystem
```

**Solution**:
- Reload VSCode
- Check `.claude/settings.json` syntax
- Run `/health_check` to verify setup

---

## Adding New Commands

### Create Command File

```bash
cd .claude/commands/
touch my-command.md
```

### Write Command Content

```markdown
---
description: Brief description of what this command does
argument-hint: [arg1] [optional-arg2]
---

# My Command

Write your command instructions here in Markdown format.

## Variables

MY_VAR: $1
MY_OPTIONAL_VAR: $2

## Instructions

- Do this first
- Then do this
- Finally do that
```

### Test Command

1. Reload VSCode: `Cmd+Shift+P` → "Reload Window"
2. Open command palette: `Cmd+Shift+P`
3. Type `/my-command`
4. Verify it appears and works

### Make Available in All Contexts

```bash
# For all contexts: Create in root
.claude/commands/my-command.md

# For specific context: Create in app folder
apps/orchestrator_3_stream/.claude/commands/my-command.md
```

---

## Command Frontmatter Reference

```yaml
# REQUIRED
description: "One-line description"

# OPTIONAL
argument-hint: "[arg1] [arg2]"              # Argument template
model: "sonnet"                              # Claude model to use
allowed_tools: ["Bash", "Read", "Write"]    # Allowed tools
disable_model_invocation: false              # Disable model calls (for pure shell)
```

### Example Frontmatters

```yaml
# Simple command
---
description: Run all tests
---

# With arguments
---
description: Create implementation plan
argument-hint: "[user-prompt]"
---

# Advanced
---
description: Scout and build workflow
argument-hint: "[problem-description]"
model: "opus"
allowed_tools: ["Task", "Bash", "Read"]
---
```

---

## Common Command Patterns

### 1. Planning Workflow

```bash
/plan                              # Analyze problem
  ↓
/implement                         # Execute plan
  ↓
/test                             # Verify implementation
  ↓
/pull_request                     # Create PR
```

### 2. Bug Fix Workflow

```bash
/bug                              # Report and fix bug
  ↓
/test                             # Run tests
  ↓
/commit                           # Commit changes
  ↓
/pull_request                     # Create PR
```

### 3. Feature Workflow

```bash
/feature                          # Plan and implement
  ↓
/test                             # Run tests
  ↓
/review                           # Code review
  ↓
/pull_request                     # Create PR
```

### 4. Orchestrator Multi-Agent Workflow

```bash
/orch_scout_and_build             # Scout + build
  ↓
/test                             # Test results
  ↓
/review                           # Review code
  ↓
/pull_request                     # Create PR
```

---

## Environment Variables & Context

### Available to Commands

```bash
$CLAUDE_PROJECT_DIR          # Root of VSCode workspace
$PWD                         # Current working directory
$HOME                        # User home directory
$USER                        # Current user
ORCHESTRATOR_MODEL           # Model override (set to claude-sonnet-4-20250514)
```

### Example Usage

```markdown
---
description: My command
---

The project root is: $CLAUDE_PROJECT_DIR
Current folder: $PWD
```

---

## Performance Tips

1. **Reload on changes**: After editing commands, reload VSCode
2. **Use specific models**: `model: "sonnet"` for faster execution
3. **Limit scope**: Use `argument-hint` to focus command purpose
4. **Cache frequently**: Store results in workspace for reuse

---

## Integration with ADW

When running ADW workflows from command palette:

```bash
/classify_adw                      # Classify workflow type
  ↓
Determine if needs planning or direct execution

If planning:
  /plan                            # Create plan
  /create_issue                    # Create GitHub issue
  # ADW triggers from issue

If direct:
  /implement                       # Execute directly
  /test                           # Test
  /pull_request                   # Create PR
```

---

## Security & Permissions

### What Commands Can Do
- Execute bash scripts
- Read/write files
- Create git commits and PRs
- Access MCP Gateway tools
- Run tests and builds

### Permissions in `.claude/settings.json`

```json
"permissions": {
  "allow": [
    "Bash(mkdir:*)",
    "Bash(uv:*)",
    "Write"
  ],
  "deny": [
    "Bash(git push --force:*)",
    "Bash(rm -rf:*)"
  ]
}
```

---

## Advanced: Custom Hooks

Hooks can run before/after command execution:

```bash
.claude/hooks/
├── pre_tool_use.py          # Before any tool use
├── post_tool_use.py         # After tool use
├── user_prompt_submit.py    # User input processing
└── notification.py          # Send notifications
```

These automatically run when configured in `settings.json`.

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│ COMMAND PALETTE QUICK REFERENCE         │
├─────────────────────────────────────────┤
│ Open palette:  Cmd/Ctrl+Shift+P        │
│ Clear search:  Esc                      │
│ Go to file:    Cmd/Ctrl+P              │
│ Open settings: Cmd+, (Mac)             │
│            Ctrl+, (Windows/Linux)      │
├─────────────────────────────────────────┤
│ Root: 29 commands                       │
│ Orchestrator: 47 commands (29+18)      │
│ Apps: 29+ commands                      │
├─────────────────────────────────────────┤
│ Most used: /plan, /implement, /test    │
│ Workflows: /feature, /bug, /patch      │
│ Multi-agent: /orch_scout_and_build     │
└─────────────────────────────────────────┘
```

---

## See Also

- **Full documentation**: See `.claude/README.md` for complete command catalog
- **Implementation guide**: See `specs/implementation_command_palette_fix.md`
- **Scout report**: See `SCOUT_REPORT_COMMAND_PALETTE_ACCESS.md`
- **Engineering rules**: See `CLAUDE.md` → "Command Discovery" section
- **Official docs**: https://docs.anthropic.com/en/docs/claude-code/slash-commands

---

**Last Updated**: 2025-11-07
**Status**: Ready for Use ✅
