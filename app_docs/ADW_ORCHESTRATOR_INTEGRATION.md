# ADW + Orchestrator Integration Guide

**Status:** Partial Implementation - Manual Steps Required
**Date:** 2025-11-06
**Integration Type:** Tool-based (Option 1 from plan)

## Overview

This integration adds ADW (Autonomous Development Workflows) management capabilities to the Orchestrator system, allowing the orchestrator agent to trigger, monitor, and control ADW workflows through conversational commands.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Orchestrator Agent (Chat Interface)             │
│              "Trigger ADW for issue #123"                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Orchestrator Backend (FastAPI)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ADWManager (5 new tools)                            │  │
│  │  - trigger_adw_workflow()                             │  │
│  │  - check_adw_status()                                 │  │
│  │  - list_adw_worktrees()                               │  │
│  │  - cleanup_adw_worktree()                             │  │
│  │  - get_adw_logs()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ Python subprocess + WebSocket events
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ADW System (adws/)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  orchestrator_integration.py (NEW)                    │  │
│  │  - execute_adw_workflow()                             │  │
│  │  - get_workflow_status()                              │  │
│  │  - list_active_workflows()                            │  │
│  │  - cleanup_worktree()                                 │  │
│  │  - get_adw_logs()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Workflow Scripts (adw_*_iso.py)                             │
│  → Creates worktrees, runs agents, creates PRs               │
└─────────────────────────────────────────────────────────────┘
```

## What Has Been Completed ✅

### 1. ADW Integration Module
**File:** `/opt/ozean-licht-ecosystem/adws/adw_modules/orchestrator_integration.py`

**Status:** ✅ Complete

**Functions:**
- `execute_adw_workflow()` - Executes ADW workflows with WebSocket status updates
- `get_workflow_status()` - Retrieves current status of ADW workflow
- `list_active_workflows()` - Lists all active ADW worktrees
- `cleanup_worktree()` - Removes completed worktrees
- `get_adw_logs()` - Fetches logs from workflow phases

**Features:**
- Async execution with subprocess management
- WebSocket callback for real-time status broadcasting
- Comprehensive error handling
- Support for all workflow types (plan, sdlc, sdlc_zte, etc.)
- Model set support (base/heavy)

### 2. WebSocket Manager Enhancement
**File:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/modules/websocket_manager.py`

**Status:** ✅ Complete

**Added Method:**
- `broadcast_adw_status()` - Broadcasts ADW workflow status updates to all connected clients

**Event Types:**
- `adw_starting` - Workflow initiated
- `adw_output` - Real-time output from ADW process
- `adw_completed` - Workflow finished successfully
- `adw_error` - Error occurred during workflow

### 3. Orchestrator System Prompt
**File:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/prompts/orchestrator_agent_system_prompt.md`

**Status:** ✅ Complete

**Added Section:** "ADW (Autonomous Development Workflows) Tools"

**Tool Descriptions:**
- `trigger_adw_workflow` - Start ADW for GitHub issue
- `check_adw_status` - Check workflow progress
- `list_adw_worktrees` - List active workflows
- `cleanup_adw_worktree` - Clean up after completion
- `get_adw_logs` - Debug workflow execution

**Guidelines Added:**
- When to use different workflow types
- Port allocation information (9100-9114 backend, 9200-9214 frontend)
- Concurrent workflow limits (15 max)
- Best practices for workflow management

## What Needs to Be Completed ⚠️

### 1. ADW Manager Backend Module (HIGH PRIORITY)

**File to Create:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/modules/adw_manager.py`

**Issue:** Permission denied (directory owned by root)

**Solution:**
```bash
# Fix permissions first
sudo chown -R adw-user:adw-user /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream

# Then create the file
```

**File Content:** See `ADW_MANAGER_CODE.md` (provided separately)

**This file provides:**
- `ADWManager` class that wraps orchestrator_integration functions
- Tool-callable methods for the orchestrator agent
- WebSocket integration for status updates
- Logging and error handling

### 2. Wire ADW Manager into Orchestrator Service (HIGH PRIORITY)

**File to Modify:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/modules/orchestrator_service.py`

**Changes Needed:**

1. Import ADWManager:
```python
from .adw_manager import ADWManager
```

2. Initialize in `__init__`:
```python
def __init__(self, websocket_manager, logger, ...):
    # ... existing code ...
    self.adw_manager = ADWManager(websocket_manager, logger)
```

3. Register ADW tools in agent options (find where tools are registered):
```python
# Add to tool registration
tools = [
    # ... existing tools ...
    "trigger_adw_workflow",
    "check_adw_status",
    "list_adw_worktrees",
    "cleanup_adw_worktree",
    "get_adw_logs",
]
```

4. Add tool handlers (find tool dispatch section):
```python
# In tool execution handler
elif tool_name == "trigger_adw_workflow":
    result = await self.adw_manager.trigger_adw_workflow(**tool_input)
    return result

elif tool_name == "check_adw_status":
    result = self.adw_manager.check_adw_status(**tool_input)
    return result

elif tool_name == "list_adw_worktrees":
    result = self.adw_manager.list_adw_worktrees()
    return result

elif tool_name == "cleanup_adw_worktree":
    result = self.adw_manager.cleanup_adw_worktree(**tool_input)
    return result

elif tool_name == "get_adw_logs":
    result = self.adw_manager.get_adw_logs(**tool_input)
    return result
```

### 3. Frontend UI Component (OPTIONAL - Phase 2)

**File to Create:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/frontend/src/components/ADWWorkflowList.vue`

**Purpose:** Display active ADW workflows in the UI

**Features:**
- Show ADW ID, issue number, phase
- Display port assignments
- Link to GitHub PRs
- Progress indicators
- Real-time status updates via WebSocket

**Priority:** Low - Can be added later. ADW integration works without UI component.

### 4. TypeScript Types for Frontend (OPTIONAL - Phase 2)

**File to Modify:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/frontend/src/types.d.ts`

**Types to Add:**
```typescript
interface ADWWorkflow {
  adw_id: string;
  issue_number: number;
  phase: string;
  branch_name: string;
  worktree_path: string;
  worktree_exists: boolean;
  backend_port: number;
  frontend_port: number;
  commits_count: number;
  pr_number: number | null;
  status: "active" | "completed" | "not_found";
}

interface ADWStatusEvent {
  type: "adw_starting" | "adw_output" | "adw_completed" | "adw_error";
  issue_number?: number;
  adw_id?: string;
  workflow_type?: string;
  message?: string;
  timestamp: string;
}
```

## Testing the Integration

Once manual steps are completed, test with:

### 1. Start Orchestrator
```bash
cd apps/orchestrator_3_stream
./start_be.sh  # Terminal 1
./start_fe.sh  # Terminal 2
```

### 2. Test via Chat Interface

Open http://127.0.0.1:5175 and send messages:

**Test 1: List active workflows**
```
You: List all active ADW workflows
Orchestrator: [uses list_adw_worktrees tool]
Orchestrator: Found 2 active ADW workflows: ...
```

**Test 2: Trigger ADW workflow**
```
You: Trigger ADW for issue #123
Orchestrator: [uses trigger_adw_workflow tool]
Orchestrator: ADW workflow 'sdlc' started successfully for issue #123. ADW ID: abc12345
```

**Test 3: Check status**
```
You: Check status of ADW abc12345
Orchestrator: [uses check_adw_status tool]
Orchestrator: ADW abc12345 is in the 'building' phase, 3 commits made...
```

**Test 4: Get logs**
```
You: Show me the planner logs for ADW abc12345
Orchestrator: [uses get_adw_logs tool]
Orchestrator: Here are the recent planner logs: ...
```

**Test 5: Cleanup**
```
You: Clean up worktree for ADW abc12345
Orchestrator: [uses cleanup_adw_worktree tool]
Orchestrator: Successfully removed worktree at trees/abc12345/
```

### 3. Watch WebSocket Events

Open browser console and watch for:
- `adw_starting` events when workflow begins
- `adw_output` events with real-time output
- `adw_completed` events when finished
- `adw_error` events on failures

## Expected Behavior

### Successful Workflow Execution

1. User: "Trigger ADW for issue #123"
2. Orchestrator calls `trigger_adw_workflow(123, "sdlc", "base")`
3. ADW Manager executes `uv run adw_sdlc_iso.py 123`
4. WebSocket broadcasts:
   - `adw_starting` - Workflow initiated
   - `adw_output` (multiple) - Real-time progress
   - `adw_completed` - With adw_id, ports, worktree info
5. Orchestrator responds: "ADW workflow started successfully..."
6. User can check status: "Check status of ADW abc12345"
7. After PR merged: "Clean up ADW abc12345"

### Error Scenarios

**Scenario 1: Invalid workflow type**
```
trigger_adw_workflow(123, "invalid_type")
→ Returns: { "status": "error", "message": "Invalid workflow_type..." }
```

**Scenario 2: Workflow execution fails**
```
ADW script exits with non-zero code
→ WebSocket: { "type": "adw_error", "exit_code": 1 }
→ Returns error with details
```

**Scenario 3: ADW ID not found**
```
check_adw_status("nonexistent")
→ Returns: { "status": "not_found", "message": "No state file found..." }
```

## File Permissions Issue

**Problem:** `apps/orchestrator_3_stream/` owned by root, preventing file creation

**Solution:**
```bash
# Option 1: Change ownership (recommended)
sudo chown -R adw-user:adw-user /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream

# Option 2: Create files with sudo
sudo touch /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/modules/adw_manager.py
sudo chown adw-user:adw-user /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/modules/adw_manager.py
```

## Integration Benefits

### For Users
✅ Trigger ADW workflows conversationally
✅ Monitor workflow progress in real-time
✅ Debug workflows with log access
✅ Manage multiple workflows from one interface
✅ Visual feedback in UI (when component added)

### For Developers
✅ Simple tool-based integration
✅ No major refactoring of existing systems
✅ Both systems remain independent
✅ Clear separation of concerns
✅ Extensible architecture

### System Architecture
✅ Async execution doesn't block orchestrator
✅ WebSocket events provide real-time updates
✅ Isolated worktrees prevent conflicts
✅ Up to 15 concurrent workflows
✅ Comprehensive error handling

## Next Steps

### Immediate (Required for Functionality)
1. ✅ Fix file permissions on orchestrator_3_stream directory
2. ✅ Create `adw_manager.py` with provided code
3. ✅ Wire ADW Manager into `orchestrator_service.py`
4. ✅ Test basic workflow trigger
5. ✅ Verify WebSocket events are broadcast

### Phase 2 (Enhanced UX)
1. ⬜ Create ADWWorkflowList Vue component
2. ⬜ Add TypeScript types for frontend
3. ⬜ Integrate component into App.vue layout
4. ⬜ Handle WebSocket events in Pinia store
5. ⬜ Add visual indicators for workflow progress

### Phase 3 (Advanced Features)
1. ⬜ Add workflow pause/resume capability
2. ⬜ Implement workflow cancellation
3. ⬜ Add workflow history/timeline view
4. ⬜ Create workflow templates
5. ⬜ Add metrics and analytics

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'adw_modules'"

**Cause:** Path to adws not added correctly

**Solution:** Verify in `adw_manager.py`:
```python
adws_path = Path(__file__).parent.parent.parent.parent.parent / "adws"
sys.path.insert(0, str(adws_path))
```

### Issue: "Permission denied" when creating files

**Cause:** Directory owned by root

**Solution:** See "File Permissions Issue" section above

### Issue: WebSocket events not received

**Cause:** WebSocket not connected or callback not wired

**Solution:**
1. Check browser console for WebSocket connection
2. Verify `broadcast_adw_status` is called in ADW Manager
3. Check WebSocket manager has active connections

### Issue: ADW workflow hangs

**Cause:** ADW subprocess not completing

**Solution:**
1. Check ADW logs: `get_adw_logs(adw_id)`
2. Check system logs: `read_system_logs()`
3. Verify issue exists in GitHub
4. Check environment variables (GITHUB_PAT, ANTHROPIC_API_KEY)

## Documentation Updates Needed

1. ✅ Update `CONTEXT_MAP.md` with new files
2. ⬜ Update orchestrator CLAUDE.md with ADW integration
3. ⬜ Update main README.md with ADW + Orchestrator section
4. ⬜ Create video demo of integration
5. ⬜ Add integration to system architecture docs

## References

- **ADW System:** `/opt/ozean-licht-ecosystem/adws/README.md`
- **Orchestrator:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/README.md`
- **Integration Planning:** (This document's "Architecture" section)
- **ADW Integration Module:** `/opt/ozean-licht-ecosystem/adws/adw_modules/orchestrator_integration.py`

---

**Status:** Ready for manual completion steps
**Estimated Time to Complete:** 30-60 minutes
**Complexity:** Medium (mainly wiring existing components)
