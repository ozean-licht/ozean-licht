# Plan: Fix Orchestrator Command Palette to Show Only Orchestrator Commands

## Task Description
The orchestrator currently loads all commands from the global command palette (32 root commands + 18 orchestrator commands = 50 total) when it should only load orchestrator-specific commands. The issue is in `slash_command_parser.py` which discovers commands based on the working directory. Since the orchestrator and agents work in `/opt/ozean-licht-ecosystem` (root), it incorrectly loads root commands.

**Key Requirements:**
- Orchestrator should only see 18 orchestrator-specific commands from `apps/orchestrator_3_stream/.claude/commands/`
- Orchestrator and agents must continue to work in `/opt/ozean-licht-ecosystem` (not change working directory)
- Root commands (32) should be excluded from orchestrator's command palette
- Agents spawned by orchestrator should still have access to work in the root directory

## Objective
Modify the command discovery logic to explicitly load only orchestrator commands while maintaining the working directory as `/opt/ozean-licht-ecosystem` for both the orchestrator and its spawned agents.

## Problem Statement
The `discover_slash_commands()` function in `slash_command_parser.py` uses the `working_dir` parameter to determine which commands to load. When `working_dir = /opt/ozean-licht-ecosystem`, it loads root commands from `.claude/commands/`. With hierarchical loading enabled (default), it merges root commands (32) with orchestrator commands (18), resulting in 50 total commands visible to the orchestrator.

This is problematic because:
1. The orchestrator should only orchestrate, not execute root-level commands
2. The command palette becomes cluttered with irrelevant commands
3. The working directory must remain `/opt/ozean-licht-ecosystem` for agents to access the full codebase

## Solution Approach
Introduce a new configuration variable `ORCHESTRATOR_COMMANDS_DIR` that explicitly points to the orchestrator commands directory. Modify the command discovery logic to prioritize this explicit path over working_dir-based discovery, ensuring the orchestrator only loads orchestrator-specific commands while maintaining the root working directory for agent operations.

## Relevant Files
Use these files to complete the task:

- `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py` (lines 257-351) - Contains `discover_slash_commands()` function that needs modification to support explicit command directory override
- `apps/orchestrator_3_stream/backend/modules/config.py` (lines 98-139) - Configuration module where new `ORCHESTRATOR_COMMANDS_DIR` variable needs to be added
- `apps/orchestrator_3_stream/backend/main.py` (line 239) - Calls `discover_slash_commands(config.get_working_dir())` and needs to use the new orchestrator commands directory
- `apps/orchestrator_3_stream/.env.sample` - Environment variable template that needs the new `ORCHESTRATOR_COMMANDS_DIR` example

### New Files
- `apps/orchestrator_3_stream/app_docs/orchestrator-command-filtering-fix.md` - Documentation explaining the fix and configuration

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Add Configuration for Orchestrator Commands Directory

**File**: `apps/orchestrator_3_stream/backend/modules/config.py`

- Add new configuration variable after line 111 (after `ORCHESTRATOR_WORKING_DIR`):
  ```python
  # Orchestrator commands directory (explicit path to orchestrator slash commands)
  # This allows the orchestrator to load only orchestrator-specific commands
  # even when working_dir is set to the root repository
  ORCHESTRATOR_COMMANDS_DIR = os.getenv(
      "ORCHESTRATOR_COMMANDS_DIR",
      str(Path(__file__).parent.parent.parent / ".claude" / "commands")
  )
  ```
- Add logging for this configuration in the startup configuration section (after line 196):
  ```python
  config_logger.info(f"Orch Commands:   {ORCHESTRATOR_COMMANDS_DIR}")
  ```

### 2. Modify Command Discovery Function to Support Explicit Directory

**File**: `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py`

- Modify the `discover_slash_commands()` function signature (line 257):
  ```python
  def discover_slash_commands(working_dir: str, commands_dir: Optional[str] = None) -> List[dict]:
  ```
- Update docstring to document the new parameter:
  ```python
  """
  Discover slash commands from specified directory or working_dir-based directories.

  Precedence:
  1. If commands_dir is provided, load ONLY from that directory (no hierarchical loading)
  2. Otherwise, use working_dir for hierarchical loading (root + app-specific)

  Args:
      working_dir: Working directory for fallback command discovery
      commands_dir: Optional explicit path to commands directory (overrides working_dir logic)

  Returns:
      List of dicts with name, description, arguments, model, and source metadata
  ```
- Add explicit directory handling at the start of the function (after line 283):
  ```python
  # If explicit commands_dir is provided, load ONLY from that directory
  if commands_dir:
      logger.info(f"Loading commands from explicit directory: {commands_dir}")
      commands_path = Path(commands_dir)
      if commands_path.exists():
          commands = _load_commands_from_dir(commands_path, "orchestrator")
          logger.info(f"Loaded {len(commands)} commands from {commands_path}")
          return sorted(commands, key=lambda x: x["name"])
      else:
          logger.warning(f"Explicit commands directory not found: {commands_path}")
          return []
  ```

### 3. Update Main Application to Use Orchestrator Commands Directory

**File**: `apps/orchestrator_3_stream/backend/main.py`

- Modify the `discover_slash_commands()` call on line 239:
  ```python
  # Discover slash commands from orchestrator-specific directory
  # Use explicit orchestrator commands dir to avoid loading root commands
  slash_commands = discover_slash_commands(
      working_dir=config.get_working_dir(),
      commands_dir=config.ORCHESTRATOR_COMMANDS_DIR
  )
  ```
- Add comment above to explain why we use explicit directory

### 4. Update Environment Variable Template

**File**: Create or update `.env` example

- Add documentation for the new environment variable with clear explanation:
  ```bash
  # Orchestrator Commands Directory
  # Explicit path to orchestrator slash commands directory
  # Default: apps/orchestrator_3_stream/.claude/commands
  # This ensures orchestrator only loads orchestrator-specific commands
  # even when ORCHESTRATOR_WORKING_DIR is set to root repository
  ORCHESTRATOR_COMMANDS_DIR=apps/orchestrator_3_stream/.claude/commands
  ```

### 5. Create Documentation

**File**: `apps/orchestrator_3_stream/app_docs/orchestrator-command-filtering-fix.md`

- Document the issue and solution
- Explain the command discovery precedence
- Provide configuration examples
- Include troubleshooting guide

Content should include:
- Problem statement
- Solution overview
- Configuration variables
- How command discovery works now
- Verification steps
- Troubleshooting section

### 6. Run Validation Commands

Execute the validation commands listed in the Validation Commands section to ensure the fix works correctly.

## Acceptance Criteria

1. ✅ Orchestrator only loads 18 orchestrator-specific commands (not 50)
2. ✅ Orchestrator working directory remains `/opt/ozean-licht-ecosystem`
3. ✅ Agents spawned by orchestrator can access the full codebase in `/opt/ozean-licht-ecosystem`
4. ✅ Root commands (32) are not visible in orchestrator's command palette
5. ✅ Configuration is explicit and well-documented
6. ✅ No breaking changes to existing functionality
7. ✅ Command discovery logs clearly show which directory is being used

## Validation Commands
Execute these commands to validate the task is complete:

### 1. Check Configuration Loading
```bash
cd apps/orchestrator_3_stream
# Start backend and check logs for configuration
uv run python backend/main.py 2>&1 | grep -E "(Orch Commands|Loaded.*commands)"
# Expected: Should show orchestrator commands directory and 18 commands loaded
```

### 2. Verify Command Discovery Logic
```bash
# Test the modified function directly
cd apps/orchestrator_3_stream/backend
python3 -c "
from modules.slash_command_parser import discover_slash_commands
import os

# Test with explicit directory
commands = discover_slash_commands(
    working_dir='/opt/ozean-licht-ecosystem',
    commands_dir='/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/.claude/commands'
)
print(f'Commands loaded with explicit dir: {len(commands)}')
print(f'Command names: {[c[\"name\"] for c in commands[:5]]}...')

# Test without explicit directory (should load hierarchically)
commands_hierarchical = discover_slash_commands(
    working_dir='/opt/ozean-licht-ecosystem'
)
print(f'Commands loaded hierarchically: {len(commands_hierarchical)}')
"
# Expected: First should be 18, second should be 50
```

### 3. Test API Endpoint
```bash
# Start the backend
cd apps/orchestrator_3_stream
uv run python backend/main.py &
BACKEND_PID=$!
sleep 3

# Query the orchestrator info endpoint
curl -s http://localhost:9403/get_orchestrator | python3 -m json.tool | grep -A 5 '"slash_commands"'

# Count commands
curl -s http://localhost:9403/get_orchestrator | python3 -c "
import sys, json
data = json.load(sys.stdin)
commands = data.get('slash_commands', [])
print(f'Total commands available to orchestrator: {len(commands)}')
print(f'Command names: {[c[\"name\"] for c in commands]}')
"

# Cleanup
kill $BACKEND_PID
# Expected: Should show exactly 18 orchestrator commands
```

### 4. Verify Working Directory
```bash
# Check that working directory is still root
cd apps/orchestrator_3_stream
uv run python backend/main.py 2>&1 | grep "Working Directory"
# Expected: Should show /opt/ozean-licht-ecosystem
```

### 5. Python Syntax Validation
```bash
cd apps/orchestrator_3_stream
uv run python -m py_compile backend/modules/slash_command_parser.py
uv run python -m py_compile backend/modules/config.py
uv run python -m py_compile backend/main.py
# Expected: No syntax errors
```

## Notes

### Configuration Hierarchy
After this fix, command discovery works as follows:
1. **Explicit Directory** (New): If `commands_dir` parameter is provided → Load ONLY from that directory
2. **Hierarchical Loading** (Existing): If `ENABLE_HIERARCHICAL_LOADING=true` → Load from root + app-specific
3. **App-Only Loading** (Existing): If `ENABLE_HIERARCHICAL_LOADING=false` → Load from app-specific only

### Backward Compatibility
This change is backward compatible:
- If `commands_dir` is not provided, behavior remains unchanged (hierarchical or app-only based on `ENABLE_HIERARCHICAL_LOADING`)
- Existing configurations continue to work
- Only the orchestrator application uses the explicit directory feature

### Environment Variables Summary
```bash
ORCHESTRATOR_WORKING_DIR=/opt/ozean-licht-ecosystem  # Where agents execute
ORCHESTRATOR_COMMANDS_DIR=apps/orchestrator_3_stream/.claude/commands  # Where commands are loaded from
ENABLE_HIERARCHICAL_LOADING=true  # Fallback behavior if commands_dir not used
```

### Why Not Change Working Directory?
We maintain `/opt/ozean-licht-ecosystem` as working directory because:
1. Agents need access to the full codebase (apps/, tools/, adws/, etc.)
2. ADW workflows expect to work from the root
3. File paths in slash commands reference root-relative paths
4. Changing working directory would break existing agent workflows

### Future Enhancements
Consider adding:
- Command filtering by category/tag
- Per-agent command restrictions
- Command allowlist/blocklist
- Dynamic command loading based on orchestrator mode
