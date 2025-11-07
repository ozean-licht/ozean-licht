# Orchestrator Command Filtering Fix

## Problem Statement

The orchestrator was loading all commands from both the root command palette (32 commands) and orchestrator-specific commands (18 commands), totaling 50 commands. This occurred because the command discovery logic in `slash_command_parser.py` uses the `working_dir` parameter to determine which commands to load.

When `working_dir = /opt/ozean-licht-ecosystem`, the hierarchical loading feature would:
1. Load root commands from `.claude/commands/` (32 commands)
2. Load orchestrator commands from `apps/orchestrator_3_stream/.claude/commands/` (18 commands)
3. Merge them together, resulting in 50 total commands

**Issues:**
- The orchestrator should only orchestrate, not execute root-level commands
- Command palette became cluttered with irrelevant commands
- Working directory must remain `/opt/ozean-licht-ecosystem` for agents to access the full codebase

## Solution Overview

We introduced a new configuration variable `ORCHESTRATOR_COMMANDS_DIR` that explicitly points to the orchestrator commands directory. The command discovery logic now prioritizes this explicit path over working_dir-based discovery, ensuring the orchestrator only loads orchestrator-specific commands while maintaining the root working directory for agent operations.

## Changes Made

### 1. Configuration Module (`backend/modules/config.py`)

Added new environment variable:
```python
ORCHESTRATOR_COMMANDS_DIR = os.getenv(
    "ORCHESTRATOR_COMMANDS_DIR",
    str(Path(__file__).parent.parent.parent / ".claude" / "commands")
)
```

- **Default:** `apps/orchestrator_3_stream/.claude/commands`
- **Override:** Set `ORCHESTRATOR_COMMANDS_DIR` environment variable
- **Logging:** Configuration value displayed on startup

### 2. Command Discovery (`backend/modules/slash_command_parser.py`)

Modified `discover_slash_commands()` function:
```python
def discover_slash_commands(working_dir: str, commands_dir: Optional[str] = None) -> List[dict]:
```

**Precedence:**
1. **Explicit Directory (New):** If `commands_dir` parameter provided → Load ONLY from that directory
2. **Hierarchical Loading (Existing):** If `ENABLE_HIERARCHICAL_LOADING=true` → Load from root + app-specific
3. **App-Only Loading (Existing):** If `ENABLE_HIERARCHICAL_LOADING=false` → Load from app-specific only

### 3. Main Application (`backend/main.py`)

Updated slash command discovery call:
```python
slash_commands = discover_slash_commands(
    working_dir=config.get_working_dir(),
    commands_dir=config.ORCHESTRATOR_COMMANDS_DIR
)
```

### 4. Environment Template (`backend/.env.sample`)

Added documentation and example:
```bash
# Orchestrator Commands Directory
# Explicit path to orchestrator slash commands directory
# Default: apps/orchestrator_3_stream/.claude/commands
# This ensures orchestrator only loads orchestrator-specific commands
# even when ORCHESTRATOR_WORKING_DIR is set to root repository
ORCHESTRATOR_COMMANDS_DIR=apps/orchestrator_3_stream/.claude/commands
```

## Configuration Variables

### Environment Variables Summary

```bash
# Where agents execute (full codebase access)
ORCHESTRATOR_WORKING_DIR=/opt/ozean-licht-ecosystem

# Where commands are loaded from (orchestrator-specific only)
ORCHESTRATOR_COMMANDS_DIR=apps/orchestrator_3_stream/.claude/commands

# Fallback behavior if commands_dir not used
ENABLE_HIERARCHICAL_LOADING=true
```

### Command Discovery Logic

After this fix, command discovery works as follows:

1. **Explicit Directory (Priority 1):** If `commands_dir` parameter provided:
   - Load ONLY from specified directory
   - No hierarchical loading
   - No merging with root commands
   - **Orchestrator uses this mode**

2. **Hierarchical Loading (Priority 2):** If `ENABLE_HIERARCHICAL_LOADING=true`:
   - Load from root repository (`.claude/commands/`)
   - Load from app-specific directory (`working_dir/.claude/commands/`)
   - Merge with app-specific overriding root

3. **App-Only Loading (Priority 3):** If `ENABLE_HIERARCHICAL_LOADING=false`:
   - Load ONLY from app-specific directory
   - No root commands

## Verification Steps

### 1. Check Configuration Logs

Start the backend and verify configuration:
```bash
cd apps/orchestrator_3_stream
uv run python backend/main.py 2>&1 | grep "Orch Commands"
```

**Expected Output:**
```
[CONFIG] INFO: Orch Commands:   apps/orchestrator_3_stream/.claude/commands
```

### 2. Check Command Loading Logs

```bash
uv run python backend/main.py 2>&1 | grep -E "(Loading commands|Loaded.*commands)"
```

**Expected Output:**
```
Loading commands from explicit directory: apps/orchestrator_3_stream/.claude/commands
Loaded 18 commands from apps/orchestrator_3_stream/.claude/commands
```

### 3. Test API Endpoint

Start backend and query orchestrator info:
```bash
cd apps/orchestrator_3_stream
uv run python backend/main.py &
BACKEND_PID=$!
sleep 3

# Count commands
curl -s http://localhost:9403/get_orchestrator | python3 -c "
import sys, json
data = json.load(sys.stdin)
commands = data.get('slash_commands', [])
print(f'Total commands: {len(commands)}')
print(f'Command names: {[c[\"name\"] for c in commands]}')"

kill $BACKEND_PID
```

**Expected:** Exactly 18 orchestrator commands

### 4. Verify Working Directory

```bash
cd apps/orchestrator_3_stream
uv run python backend/main.py 2>&1 | grep "Working Directory"
```

**Expected:** `/opt/ozean-licht-ecosystem` (agents still have full codebase access)

### 5. Test Command Discovery Directly

```python
from modules.slash_command_parser import discover_slash_commands

# Test with explicit directory
commands = discover_slash_commands(
    working_dir='/opt/ozean-licht-ecosystem',
    commands_dir='/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/.claude/commands'
)
print(f'Commands loaded with explicit dir: {len(commands)}')

# Test without explicit directory (hierarchical)
commands_hierarchical = discover_slash_commands(
    working_dir='/opt/ozean-licht-ecosystem'
)
print(f'Commands loaded hierarchically: {len(commands_hierarchical)}')
```

**Expected:**
- With explicit dir: 18 commands
- Hierarchical: 50 commands (32 root + 18 orchestrator)

## Why Not Change Working Directory?

We maintain `/opt/ozean-licht-ecosystem` as the working directory because:

1. **Full Codebase Access:** Agents need to access `apps/`, `tools/`, `adws/`, etc.
2. **ADW Integration:** ADW workflows expect to work from the root
3. **Path References:** File paths in slash commands reference root-relative paths
4. **Existing Workflows:** Changing working directory would break agent workflows

The explicit `commands_dir` parameter solves the filtering problem without compromising agent functionality.

## Backward Compatibility

This change is **fully backward compatible:**

- If `commands_dir` is not provided, behavior remains unchanged
- Existing configurations continue to work
- Only the orchestrator application uses the explicit directory feature
- No breaking changes to command discovery API

## Troubleshooting

### Issue: Still seeing 50 commands

**Diagnosis:**
```bash
# Check if ORCHESTRATOR_COMMANDS_DIR is set
env | grep ORCHESTRATOR_COMMANDS_DIR

# Check startup logs
uv run python backend/main.py 2>&1 | grep "Orch Commands"
```

**Solutions:**
1. Ensure `.env` file contains `ORCHESTRATOR_COMMANDS_DIR`
2. Verify path points to orchestrator commands directory
3. Restart backend to reload configuration

### Issue: Commands not loading

**Diagnosis:**
```bash
# Verify directory exists
ls -la apps/orchestrator_3_stream/.claude/commands/

# Check for .md files
ls apps/orchestrator_3_stream/.claude/commands/*.md | wc -l
```

**Solutions:**
1. Verify path is correct (relative or absolute)
2. Ensure directory contains `.md` command files
3. Check file permissions (must be readable)

### Issue: Wrong commands directory logged

**Diagnosis:**
```bash
uv run python backend/main.py 2>&1 | grep "Loading commands from explicit directory"
```

**Solutions:**
1. Check `ORCHESTRATOR_COMMANDS_DIR` environment variable
2. Verify default path in `config.py` is correct
3. Use absolute paths if relative paths fail

### Issue: Working directory changed

**Diagnosis:**
```bash
uv run python backend/main.py 2>&1 | grep "Working Directory"
```

**Solutions:**
1. Verify `ORCHESTRATOR_WORKING_DIR` is set to `/opt/ozean-licht-ecosystem`
2. Check if `--cwd` CLI flag was used (overrides environment)
3. Ensure no code is calling `set_working_dir()` incorrectly

## Future Enhancements

Consider adding:
- **Command Filtering:** Filter commands by category/tag
- **Per-Agent Restrictions:** Different command sets per agent type
- **Allowlist/Blocklist:** Explicit command inclusion/exclusion
- **Dynamic Loading:** Load commands based on orchestrator mode
- **Command Validation:** Verify command frontmatter on load
- **Hot Reload:** Reload commands without restarting backend

## Related Files

- `backend/modules/config.py` - Configuration with `ORCHESTRATOR_COMMANDS_DIR`
- `backend/modules/slash_command_parser.py` - Command discovery logic
- `backend/main.py` - API endpoint using explicit commands directory
- `backend/.env.sample` - Environment variable template
- `.claude/commands/` - Root-level commands (32 commands)
- `apps/orchestrator_3_stream/.claude/commands/` - Orchestrator commands (18 commands)

## Summary

This fix ensures the orchestrator only loads orchestrator-specific commands (18) while maintaining full codebase access (`/opt/ozean-licht-ecosystem`) for spawned agents. The solution uses an explicit `commands_dir` parameter that takes precedence over working_dir-based hierarchical loading, providing clean separation between orchestrator UI and agent execution environments.
