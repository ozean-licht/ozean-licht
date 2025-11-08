# Claude Code Command Catalog

> **Complete reference for all slash commands available in the Ozean Licht Ecosystem**

This document provides a comprehensive inventory of all slash commands, their availability across different project contexts, and troubleshooting guidance for command discovery issues.

## Quick Links

- [Command Availability](#command-availability)
- [Root Commands](#root-commands-42)
- [Orchestrator Commands](#orchestrator-commands-18)
- [How Command Discovery Works](#how-command-discovery-works)
- [Troubleshooting](#troubleshooting)
- [Multi-Root Workspace](#multi-root-workspace)

---

## Command Availability

The Ozean Licht ecosystem uses hierarchical command discovery based on your current working directory:

| Working Directory | Available Commands | Total Count |
|-------------------|-------------------|-------------|
| **Root** (`/opt/ozean-licht-ecosystem/`) | All root commands | 32 |
| **Orchestrator** (`apps/orchestrator_3_stream/`) | Root + Orchestrator commands | 50 (32+18) |
| **Other Apps** | Root commands only | 32 |
| **ADW Worktrees** (`trees/{adw_id}/`) | Root commands (from copied `.claude/`) | 32 |
| **Multi-Root Workspace** ⭐ RECOMMENDED | ALL commands from ALL contexts | 50 |

### Key Insight

**Claude Code loads slash commands from the `.claude/commands/` directory relative to where you opened the editor.**

- Opening at root: Only root commands available
- Opening at orchestrator: Both root and orchestrator commands available
- **Solution: Use Multi-Root Workspace** (`ozean-licht-ecosystem.code-workspace`) with `claude.commands.scanWorkspace: true` ⭐

### Critical Setting

The workspace file includes this essential setting:

```json
{
  "settings": {
    "claude.commands.scanWorkspace": true
  }
}
```

This enables Claude Code to scan **all folders** in the workspace for commands, giving you access to both root and orchestrator commands regardless of which folder is active.

---

## Root Commands (32)

Located in: `.claude/commands/`

### <� Primary Commands

The most frequently used commands for day-to-day development:

#### Work Management
- `/create_issue` - Create GitHub issue with optional ADW trigger
- `/bug` - Report and fix bugs with structured workflow
- `/feature` - Implement new features end-to-end
- `/chore` - Handle maintenance tasks

#### Planning & Implementation
- `/plan` - Create detailed implementation plans (saves to `specs/`)
- `/implement` - Direct implementation without planning phase
- `/patch` - Quick patches for small fixes

#### Testing & Quality
- `/test` - Run test suites with validation
- `/test_e2e` - Execute end-to-end tests
- `/resolve_failed_test` - Debug and fix failing tests
- `/resolve_failed_e2e_test` - Debug and fix failing E2E tests
- `/review` - Conduct code reviews

#### Documentation
- `/document` - Generate comprehensive documentation
- `/conditional_docs` - Smart documentation based on task complexity

#### Status & Information
- `/health_check` - System health status and diagnostics

---

### =' ADW Workflow Commands

Autonomous Development Workflow management:

- `/classify_adw` - Classify ADW workflow types and status
- `/classify_issue` - Classify GitHub issue types for routing
- `/cleanup_worktrees` - Clean up completed ADW worktrees
- `/install_worktree` - Set up dependencies in ADW worktree
- `/track_agentic_kpis` - Track and log agentic system KPIs

---

### =� Deployment & Infrastructure

- `/coolify` - Coolify deployment operations
- `/coolify-deploy` - Quick deployment to Coolify
- `/prepare_app` - Prepare application for deployment
- `/start` - Start local development servers

---

### = Git & Version Control

- `/commit` - Create structured git commits
- `/pull_request` - Create pull requests with context
- `/generate_branch_name` - Generate semantic branch names

---

### >� Memory & Intelligence

- `/memory` - Mem0 operations (remember, search, report)
- `/prime` - Prime the agent with context

---

### =� Utilities

- `/install` - Install dependencies across the monorepo
- `/tools` - Tool and service management
- `/in_loop_review` - Interactive review loop

---

## Orchestrator Commands (18)

Located in: `apps/orchestrator_3_stream/.claude/commands/`

**These commands are ONLY available when working in the orchestrator directory or using multi-root workspace.**

### > Agent Orchestration

High-level orchestration workflows:

- `/orch_scout_and_build` - Scout problem � Build solution (2-phase)
- `/orch_plan_w_scouts_build_review` - Plan with scouts � Build � Review (full pipeline)
- `/orch_one_shot_agent` - Launch single-purpose agent for quick tasks

### =� Planning Workflows

- `/plan` - Create implementation plan (orchestrator version)
- `/plan_w_scouters` - Planning with multiple scout agents
- `/quick-plan` - Rapid planning for simple tasks

### =( Building Workflows

- `/build` - Single build agent execution
- `/build_in_parallel` - Parallel agent execution for complex tasks

### = Research & Analysis

- `/find_and_summarize` - Search codebase and create summaries
- `/question` - Ask questions and get research-backed answers

### =� Documentation Loading

- `/load_ai_docs` - Load AI documentation bundles
- `/load_bundle` - Load specific documentation bundles

### =' Agent Management

- `/parallel_subagents` - Launch multiple agents in parallel
- `/all_tools` - Show all available orchestrator tools

### <� System Priming

- `/prime` - Prime orchestrator (orchestrator version)
- `/prime_3` - Prime with 3-level context
- `/prime_cc` - Prime for Claude Code context

### >� Experimental

- `/t_metaprompt_workflow` - Test metaprompt workflow patterns

---

## How Command Discovery Works

### Standard Discovery (Single Root)

1. **Claude Code starts** in directory `/path/to/project/`
2. **Looks for** `.claude/commands/` in that directory
3. **Loads all** `.md` files as slash commands
4. **Parses frontmatter** for metadata:
   ```yaml
   ---
   description: Command description here
   argument-hint: [arg1] [arg2]
   name: custom-name (optional)
   ---
   ```

### Hierarchical Discovery (Orchestrator)

The orchestrator backend implements custom hierarchical discovery:

**File**: `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py`

```python
def discover_slash_commands(base_path: str) -> List[Dict]:
    """
    Discover slash commands hierarchically:
    1. Root commands (../../.claude/commands/)
    2. App-specific commands (./.claude/commands/)
    3. Merge with app overriding root
    """
```

This allows the orchestrator to:
-  Access all root commands
-  Access orchestrator-specific commands
-  Override root commands with app versions
-  Maintain consistency across contexts

### Multi-Root Workspace Discovery

When using `ozean-licht-ecosystem.code-workspace`:

1. **All folders** defined in workspace are available
2. **Command palette** shows commands from active folder
3. **Switch folders** to access different command sets
4. **No navigation** required between directories

---

## Troubleshooting

### Problem: Missing Orchestrator Commands

**Symptom**: `/orch_scout_and_build` not available in command palette

**Diagnosis**:
```bash
# Check where you opened Claude Code
pwd
# If output is /opt/ozean-licht-ecosystem/, you're at root

# Check orchestrator commands exist
ls -la apps/orchestrator_3_stream/.claude/commands/
```

**Solutions**:

1. **Option A: Navigate to Orchestrator** (Simple)
   ```bash
   cd apps/orchestrator_3_stream
   # Restart Claude Code in this directory
   ```

2. **Option B: Use Multi-Root Workspace** (Recommended)
   ```bash
   code ozean-licht-ecosystem.code-workspace
   # Switch to "> Orchestrator 3 Stream" folder in Explorer
   ```

3. **Option C: Invoke via Orchestrator Backend** (Advanced)
   ```bash
   # Use orchestrator's CLI directly
   cd apps/orchestrator_3_stream
   python backend/cli.py execute /orch_scout_and_build "problem description"
   ```

---

### Problem: Duplicate Commands

**Symptom**: Same command name appears twice with different behavior

**Diagnosis**:
```bash
# Check for duplicates
find . -name "plan.md" -path "*/.claude/commands/*"
# Output:
# ./.claude/commands/plan.md
# ./apps/orchestrator_3_stream/.claude/commands/plan.md
```

**Explanation**: This is **intentional**. The orchestrator's `/plan` overrides the root `/plan` when working in that context. The hierarchical discovery system ensures the correct version is used.

**Rule**: App-specific commands always take precedence over root commands.

---

### Problem: Commands Not Loading

**Symptom**: No slash commands available at all

**Diagnosis**:
```bash
# Verify .claude directory exists
ls -la .claude/

# Check commands directory
ls -la .claude/commands/

# Validate a command file
cat .claude/commands/plan.md
```

**Common Causes**:
1. **No `.claude/` directory** - You're not in a Claude Code project
2. **Empty `commands/` folder** - Commands deleted or not committed
3. **Invalid frontmatter** - YAML parsing errors in command files
4. **File permissions** - Commands not readable

**Solutions**:
```bash
# Verify frontmatter syntax
head -n 5 .claude/commands/plan.md
# Should show:
# ---
# description: Creates a concise engineering implementation plan
# ---

# Check file permissions
chmod 644 .claude/commands/*.md
```

---

### Problem: ADW Worktree Commands

**Symptom**: Commands missing in ADW worktree (`trees/{adw_id}/`)

**Explanation**: ADW worktrees are isolated git worktrees that may not include `.claude/` directory depending on when they were created.

**Solution**:
```bash
# The adw_plan_iso.py script copies .claude/ to worktree
cd adws/
uv run adw_plan_iso.py 123

# Verify copy occurred
ls -la trees/{adw_id}/.claude/commands/
```

**Permanent Fix**: Ensure ADW scripts always copy `.claude/` to new worktrees.

---

## Multi-Root Workspace

### What is it?

A VSCode workspace file that defines multiple project folders, allowing you to work across different parts of the monorepo without losing context or commands.

**File**: `ozean-licht-ecosystem.code-workspace`

### How to Use

1. **Open the workspace**:
   ```bash
   cd /opt/ozean-licht-ecosystem
   code ozean-licht-ecosystem.code-workspace
   ```

2. **Folders appear in Explorer**:
   - <� Root (Ecosystem)
   - <� Kids Ascension
   - <
 Ozean Licht
   - � Admin Dashboard
   - > Orchestrator 3 Stream
   - =' MCP Gateway
   - =� Coolify Config
   - =3 Docker Services
   - > ADW Workflows
   - =� Documentation
   - >� Shared Libraries

3. **Switch between folders** to access different command sets

4. **Commands automatically update** based on active folder

### Benefits

 **No navigation required** - All commands accessible
 **Context preserved** - See all parts of ecosystem
 **Faster development** - Switch contexts instantly
 **Better debugging** - Trace across boundaries
 **Consistent experience** - Same workflow everywhere

### Settings

The workspace includes:
- Python interpreter configuration
- TypeScript preferences
- Formatting rules (Black, Prettier)
- File exclusions (trees/, venv/, node_modules/)
- Launch configurations for debugging
- Recommended extensions

---

## Command Naming Conventions

### Root Commands
- Use **imperative verbs**: `/plan`, `/build`, `/test`
- Keep **short and memorable**: `/bug`, `/fix`, `/patch`
- Use **underscores** for multi-word: `/create_issue`, `/health_check`

### Orchestrator Commands
- Use **`orch_` prefix** for orchestration workflows: `/orch_scout_and_build`
- Use **`_w_`** for "with": `/plan_w_scouters` (plan with scouters)
- Use **descriptive names**: `/build_in_parallel`, `/find_and_summarize`

### Command Arguments
- Use **`[brackets]`** for required args: `[problem-description]`
- Use **`<angle-brackets>`** for optional args: `<issue-number>`
- Use **descriptive names**: `[user-prompt]`, `[test-filter]`

---

## Adding New Commands

### For Root Commands

1. **Create file**: `.claude/commands/my-command.md`
2. **Add frontmatter**:
   ```yaml
   ---
   description: What this command does
   argument-hint: [arg1] [arg2]
   ---
   ```
3. **Write prompt**: Command instructions below frontmatter
4. **Test**: Restart Claude Code, verify in palette
5. **Document**: Add to this README under appropriate section

### For Orchestrator Commands

1. **Create file**: `apps/orchestrator_3_stream/.claude/commands/my-command.md`
2. **Follow same frontmatter format**
3. **Test in orchestrator directory**
4. **Update orchestrator documentation**

### Best Practices

-  **Clear descriptions** - Users see this in command palette
-  **Descriptive arguments** - Help users understand inputs
-  **Examples included** - Show usage in command body
-  **Variables defined** - Use `VARIABLE_NAME: $1` format
-  **Workflow documented** - Step-by-step instructions
- L **Avoid duplicates** - Check existing commands first
- L **Don't abbreviate excessively** - `get_health` not `ghlth`

---

## Command Statistics

| Metric | Count |
|--------|-------|
| **Total Commands** | 50 |
| **Root Commands** | 32 |
| **Orchestrator Commands** | 18 |
| **Primary Commands** | 10 |
| **ADW Commands** | 5 |
| **Deployment Commands** | 4 |
| **Git Commands** | 3 |

---

## References

- **Claude Code Documentation**: https://docs.anthropic.com/en/docs/claude-code/slash-commands
- **Configuration Guide**: https://docs.anthropic.com/en/docs/claude-code/configuration
- **Orchestrator Backend**: `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py`
- **ADW Integration**: `adws/adw_modules/orchestrator_integration.py`
- **Implementation Plan**: `specs/implementation_command_palette_fix.md`
- **Scout Report**: `SCOUT_REPORT_COMMAND_PALETTE_ACCESS.md`

---

## Support

### Issues with Commands?

1. **Check this README** - Most issues documented above
2. **Verify `.claude/` exists** - Core requirement
3. **Use multi-root workspace** - Solves 90% of discovery issues
4. **Check CLAUDE.md** - Engineering rules and patterns
5. **Review orchestrator docs** - App-specific guidance

### Feature Requests

File issues in GitHub with:
- Command name and description
- Use case and examples
- Expected behavior
- Why existing commands don't work

---

**Last Updated**: 2025-11-07
**Maintainer**: Ozean Licht Team + Autonomous Agents
**Version**: 1.0.0
