# ADW Manager Module Code

**Target Location:** `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/modules/adw_manager.py`

**Purpose:** Provides ADW workflow management tools for the Orchestrator agent

## Instructions

1. Fix permissions first:
```bash
sudo chown -R adw-user:adw-user /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream
```

2. Create the file and paste the code below:
```bash
touch /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/modules/adw_manager.py
```

3. Copy the entire code block below into the file.

---

## Complete File Content

```python
"""ADW Manager Module for Orchestrator

Provides tool implementations for managing ADW workflows from the Orchestrator.
These tools allow the orchestrator agent to trigger, monitor, and control
Autonomous Development Workflows.
"""

import asyncio
import sys
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List

# Add adws to path
adws_path = Path(__file__).parent.parent.parent.parent.parent / "adws"
sys.path.insert(0, str(adws_path))

from adw_modules.orchestrator_integration import (
    execute_adw_workflow,
    get_workflow_status,
    list_active_workflows,
    cleanup_worktree,
    get_adw_logs,
    WORKFLOW_SCRIPTS,
)

from .websocket_manager import WebSocketManager
from .logger import OrchestratorLogger


class ADWManager:
    """Manages ADW workflows from Orchestrator.

    Provides tool-callable methods for the orchestrator agent to:
    - Trigger ADW workflows for GitHub issues
    - Check status of running workflows
    - List all active worktrees
    - Clean up completed worktrees
    - Get logs from workflow phases
    """

    def __init__(self, websocket_manager: WebSocketManager, logger: OrchestratorLogger):
        """Initialize ADW Manager.

        Args:
            websocket_manager: WebSocket manager for broadcasting updates
            logger: Logger instance
        """
        self.ws_manager = websocket_manager
        self.logger = logger

    async def trigger_adw_workflow(
        self,
        issue_number: int,
        workflow_type: str = "sdlc",
        model_set: str = "base",
    ) -> Dict[str, Any]:
        """Trigger an ADW workflow for a GitHub issue.

        Tool signature for orchestrator:
        trigger_adw_workflow(issue_number: int, workflow_type: str = "sdlc", model_set: str = "base")

        Args:
            issue_number: GitHub issue number to process
            workflow_type: Type of workflow to run. Options:
                - "plan": Planning only (creates worktree)
                - "patch": Quick patch workflow
                - "plan_build": Plan and build
                - "plan_build_test": Plan, build, and test
                - "plan_build_review": Plan, build, and review
                - "plan_build_document": Plan, build, and document
                - "sdlc": Complete SDLC (plan → build → test → review → document)
                - "sdlc_zte": Zero Touch Execution (auto-merge after SDLC)
            model_set: Model complexity ("base" for fast/cheap, "heavy" for complex tasks)

        Returns:
            Dict with workflow information:
            {
                "status": "success" | "error",
                "issue_number": int,
                "workflow_type": str,
                "adw_id": str,
                "worktree_path": str,
                "backend_port": int,
                "frontend_port": int,
                "message": str
            }
        """
        self.logger.log_tool_use("trigger_adw_workflow", {
            "issue_number": issue_number,
            "workflow_type": workflow_type,
            "model_set": model_set,
        })

        # Validate workflow type
        if workflow_type not in WORKFLOW_SCRIPTS:
            return {
                "status": "error",
                "message": f"Invalid workflow_type: {workflow_type}. "
                          f"Valid types: {list(WORKFLOW_SCRIPTS.keys())}",
            }

        try:
            # Create WebSocket callback for status updates
            async def ws_callback(status_update):
                # Broadcast ADW status update
                await self.ws_manager.broadcast_adw_status(status_update)

            # Execute workflow
            result = await execute_adw_workflow(
                issue_number=issue_number,
                workflow_type=workflow_type,
                model_set=model_set,
                websocket_callback=ws_callback,
            )

            # Add success message
            result["message"] = (
                f"ADW workflow '{workflow_type}' started successfully for issue #{issue_number}. "
                f"ADW ID: {result.get('adw_id', 'pending')}"
            )

            self.logger.log_success(f"ADW workflow triggered: {result}")
            return result

        except Exception as e:
            error_msg = f"Failed to trigger ADW workflow: {str(e)}"
            self.logger.log_error(error_msg, exc_info=True)

            return {
                "status": "error",
                "issue_number": issue_number,
                "workflow_type": workflow_type,
                "message": error_msg,
            }

    def check_adw_status(self, adw_id: str) -> Dict[str, Any]:
        """Check status of an ADW workflow.

        Tool signature for orchestrator:
        check_adw_status(adw_id: str)

        Args:
            adw_id: The ADW ID to check (e.g., "abc12345")

        Returns:
            Dict with workflow status:
            {
                "adw_id": str,
                "status": "active" | "completed" | "not_found",
                "issue_number": int,
                "phase": str,
                "branch_name": str,
                "worktree_path": str,
                "worktree_exists": bool,
                "backend_port": int,
                "frontend_port": int,
                "commits_count": int,
                "pr_number": int | None
            }
        """
        self.logger.log_tool_use("check_adw_status", {"adw_id": adw_id})

        try:
            status = get_workflow_status(adw_id)
            self.logger.log_success(f"Retrieved ADW status: {adw_id}")
            return status

        except Exception as e:
            error_msg = f"Failed to check ADW status: {str(e)}"
            self.logger.log_error(error_msg, exc_info=True)

            return {
                "adw_id": adw_id,
                "status": "error",
                "message": error_msg,
            }

    def list_adw_worktrees(self) -> Dict[str, Any]:
        """List all active ADW worktrees.

        Tool signature for orchestrator:
        list_adw_worktrees()

        Returns:
            Dict with list of active workflows:
            {
                "count": int,
                "workflows": [
                    {
                        "adw_id": str,
                        "issue_number": int,
                        "phase": str,
                        "branch_name": str,
                        "worktree_path": str,
                        "backend_port": int,
                        "frontend_port": int,
                        ...
                    },
                    ...
                ]
            }
        """
        self.logger.log_tool_use("list_adw_worktrees", {})

        try:
            workflows = list_active_workflows()

            self.logger.log_success(f"Found {len(workflows)} active ADW workflows")

            return {
                "count": len(workflows),
                "workflows": workflows,
            }

        except Exception as e:
            error_msg = f"Failed to list ADW worktrees: {str(e)}"
            self.logger.log_error(error_msg, exc_info=True)

            return {
                "count": 0,
                "workflows": [],
                "error": error_msg,
            }

    def cleanup_adw_worktree(self, adw_id: str, force: bool = False) -> Dict[str, Any]:
        """Clean up an ADW worktree.

        Tool signature for orchestrator:
        cleanup_adw_worktree(adw_id: str, force: bool = False)

        Args:
            adw_id: The ADW ID to clean up
            force: Force cleanup even if branch has uncommitted changes

        Returns:
            Dict with cleanup result:
            {
                "success": bool,
                "message": str
            }
        """
        self.logger.log_tool_use("cleanup_adw_worktree", {
            "adw_id": adw_id,
            "force": force,
        })

        try:
            result = cleanup_worktree(adw_id, force)

            if result["success"]:
                self.logger.log_success(f"Cleaned up ADW worktree: {adw_id}")
            else:
                self.logger.log_warning(f"Failed to clean up ADW worktree: {result['message']}")

            return result

        except Exception as e:
            error_msg = f"Failed to cleanup ADW worktree: {str(e)}"
            self.logger.log_error(error_msg, exc_info=True)

            return {
                "success": False,
                "message": error_msg,
            }

    def get_adw_logs(
        self,
        adw_id: str,
        phase: Optional[str] = None,
        tail_lines: int = 50,
    ) -> Dict[str, Any]:
        """Get logs from an ADW workflow phase.

        Tool signature for orchestrator:
        get_adw_logs(adw_id: str, phase: str | None = None, tail_lines: int = 50)

        Args:
            adw_id: The ADW ID
            phase: Optional phase to get logs for (planner, implementor, tester, reviewer, documenter)
            tail_lines: Number of lines to return from end of log (default 50)

        Returns:
            Dict with logs:
            {
                "logs": List[str],
                "phase": str,
                "lines_returned": int
            }
        """
        self.logger.log_tool_use("get_adw_logs", {
            "adw_id": adw_id,
            "phase": phase,
            "tail_lines": tail_lines,
        })

        try:
            result = get_adw_logs(adw_id, phase, tail_lines)
            self.logger.log_success(f"Retrieved ADW logs: {adw_id}, phase: {result.get('phase')}")
            return result

        except Exception as e:
            error_msg = f"Failed to get ADW logs: {str(e)}"
            self.logger.log_error(error_msg, exc_info=True)

            return {
                "logs": [],
                "error": error_msg,
            }
```

---

## After Creating the File

### Next Step 1: Wire into orchestrator_service.py

Add to imports section:
```python
from .adw_manager import ADWManager
```

Add to `__init__` method:
```python
self.adw_manager = ADWManager(websocket_manager, logger)
```

### Next Step 2: Test Import

```bash
cd /opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend
uv run python -c "from modules.adw_manager import ADWManager; print('Import successful!')"
```

If successful, you're ready to wire the tools into the orchestrator service!
