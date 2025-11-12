"""Bridge between ADW system and Orchestrator.

Provides functions for the Orchestrator to trigger, monitor, and manage
ADW workflows with real-time status updates via WebSocket callbacks.
"""

import asyncio
import json
import os
import subprocess
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List, Callable
from adw_modules.state import ADWState
from adw_modules.worktree_ops import (
    get_worktree_path,
    validate_worktree,
    remove_worktree,
)
from adw_modules.git_ops import get_current_branch

logger = logging.getLogger(__name__)


# Workflow type to script mapping
WORKFLOW_SCRIPTS = {
    "plan": "adw_plan_iso.py",
    "patch": "adw_patch_iso.py",
    "plan_build": "adw_plan_build_iso.py",
    "plan_build_test": "adw_plan_build_test_iso.py",
    "plan_build_review": "adw_plan_build_review_iso.py",
    "plan_build_document": "adw_plan_build_document_iso.py",
    "sdlc": "adw_sdlc_iso.py",
    "sdlc_zte": "adw_sdlc_zte_iso.py",
}


async def execute_adw_workflow(
    issue_number: int,
    workflow_type: str = "sdlc",
    model_set: str = "base",
    websocket_callback: Optional[Callable] = None,
) -> Dict[str, Any]:
    """Execute ADW workflow asynchronously with status updates.

    Args:
        issue_number: GitHub issue number to process
        workflow_type: Type of workflow (plan, sdlc, etc.)
        model_set: Model set to use (base or heavy)
        websocket_callback: Optional async callback for status updates

    Returns:
        Dict with adw_id, status, and workflow info

    Raises:
        ValueError: If workflow_type is invalid
        RuntimeError: If workflow execution fails
    """
    # Validate workflow type
    if workflow_type not in WORKFLOW_SCRIPTS:
        raise ValueError(
            f"Invalid workflow_type: {workflow_type}. "
            f"Valid types: {list(WORKFLOW_SCRIPTS.keys())}"
        )

    script_name = WORKFLOW_SCRIPTS[workflow_type]

    # Get project root and adws directory
    project_root = Path(__file__).parent.parent.parent
    adws_dir = project_root / "adws"

    # Construct command
    cmd = [
        "uv", "run",
        str(adws_dir / script_name),
        str(issue_number),
    ]

    # Add model_set to environment if not base
    env = os.environ.copy()
    if model_set != "base":
        env["ADW_MODEL_SET"] = model_set

    logger.info(f"Executing ADW workflow: {' '.join(cmd)}")

    # Broadcast start event
    if websocket_callback:
        await websocket_callback({
            "type": "adw_starting",
            "issue_number": issue_number,
            "workflow_type": workflow_type,
            "model_set": model_set,
            "timestamp": datetime.now().isoformat(),
        })

    try:
        # Run workflow in background
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(adws_dir),
            env=env,
        )

        # Read output asynchronously and broadcast updates
        async def read_and_broadcast(stream, stream_name):
            while True:
                line = await stream.readline()
                if not line:
                    break

                line_str = line.decode().strip()
                logger.info(f"ADW {stream_name}: {line_str}")

                # Broadcast output if callback provided
                if websocket_callback:
                    await websocket_callback({
                        "type": "adw_output",
                        "stream": stream_name,
                        "line": line_str,
                        "timestamp": datetime.now().isoformat(),
                    })

        # Read both stdout and stderr concurrently
        await asyncio.gather(
            read_and_broadcast(process.stdout, "stdout"),
            read_and_broadcast(process.stderr, "stderr"),
        )

        # Wait for process to complete
        await process.wait()

        # Check return code
        if process.returncode != 0:
            error_msg = f"ADW workflow failed with exit code {process.returncode}"
            logger.error(error_msg)

            if websocket_callback:
                await websocket_callback({
                    "type": "adw_error",
                    "error": error_msg,
                    "exit_code": process.returncode,
                    "timestamp": datetime.now().isoformat(),
                })

            raise RuntimeError(error_msg)

        # Try to find the ADW ID from the agents directory
        # (workflow scripts create agents/{adw_id}/ directories)
        agents_dir = project_root / "agents"
        adw_id = None
        worktree_path = None
        backend_port = None
        frontend_port = None

        # Find most recent directory for this issue
        for agent_dir in sorted(agents_dir.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True):
            if agent_dir.is_dir():
                state_file = agent_dir / "adw_state.json"
                if state_file.exists():
                    try:
                        with open(state_file) as f:
                            state_data = json.load(f)
                            if state_data.get("issue_number") == issue_number:
                                adw_id = state_data.get("adw_id")
                                worktree_path = state_data.get("worktree_path")
                                backend_port = state_data.get("backend_port")
                                frontend_port = state_data.get("frontend_port")
                                break
                    except (json.JSONDecodeError, KeyError):
                        continue

        result = {
            "status": "success",
            "issue_number": issue_number,
            "workflow_type": workflow_type,
            "adw_id": adw_id,
            "worktree_path": worktree_path,
            "backend_port": backend_port,
            "frontend_port": frontend_port,
            "exit_code": process.returncode,
        }

        # Broadcast completion
        if websocket_callback:
            await websocket_callback({
                "type": "adw_completed",
                **result,
                "timestamp": datetime.now().isoformat(),
            })

        logger.info(f"ADW workflow completed successfully: {result}")
        return result

    except Exception as e:
        error_msg = f"Failed to execute ADW workflow: {str(e)}"
        logger.error(error_msg, exc_info=True)

        if websocket_callback:
            await websocket_callback({
                "type": "adw_error",
                "error": error_msg,
                "timestamp": datetime.now().isoformat(),
            })

        raise RuntimeError(error_msg) from e


def get_workflow_status(adw_id: str) -> Dict[str, Any]:
    """Get current status of an ADW workflow.

    Args:
        adw_id: The ADW ID to check

    Returns:
        Dict with workflow status information
    """
    # Load state
    state = ADWState.load(adw_id)

    if not state:
        return {
            "adw_id": adw_id,
            "status": "not_found",
            "message": "No state file found for this ADW ID",
        }

    # Get basic info from state
    issue_number = state.get("issue_number")
    branch_name = state.get("branch_name")
    worktree_path = state.get("worktree_path")
    backend_port = state.get("backend_port")
    frontend_port = state.get("frontend_port")
    plan_file = state.get("plan_file")

    # Check worktree status
    worktree_exists = False
    if worktree_path and os.path.exists(worktree_path):
        is_valid, error = validate_worktree(adw_id, state)
        worktree_exists = is_valid

    # Get commit count if worktree exists
    commits_count = 0
    current_branch = None
    if worktree_exists:
        try:
            # Get current branch
            result = subprocess.run(
                ["git", "branch", "--show-current"],
                cwd=worktree_path,
                capture_output=True,
                text=True,
            )
            if result.returncode == 0:
                current_branch = result.stdout.strip()

            # Get commit count
            result = subprocess.run(
                ["git", "rev-list", "--count", "HEAD"],
                cwd=worktree_path,
                capture_output=True,
                text=True,
            )
            if result.returncode == 0:
                commits_count = int(result.stdout.strip())
        except Exception as e:
            logger.warning(f"Failed to get git info: {e}")

    # Check for PR number from GitHub (would need github module)
    # For now, return None - this could be enhanced
    pr_number = None

    # Determine phase based on what files exist
    phase = "unknown"
    agents_dir = Path(__file__).parent.parent.parent / "agents" / adw_id

    if agents_dir.exists():
        if (agents_dir / "planner").exists():
            phase = "planned"
        if (agents_dir / "implementor").exists():
            phase = "built"
        if (agents_dir / "tester").exists():
            phase = "tested"
        if (agents_dir / "reviewer").exists():
            phase = "reviewed"
        if (agents_dir / "documenter").exists():
            phase = "documented"

    return {
        "adw_id": adw_id,
        "status": "active" if worktree_exists else "completed",
        "issue_number": issue_number,
        "phase": phase,
        "branch_name": branch_name or current_branch,
        "worktree_path": worktree_path,
        "worktree_exists": worktree_exists,
        "backend_port": backend_port,
        "frontend_port": frontend_port,
        "commits_count": commits_count,
        "pr_number": pr_number,
        "plan_file": plan_file,
    }


def list_active_workflows() -> List[Dict[str, Any]]:
    """List all active ADW worktrees.

    Returns:
        List of dicts with workflow information
    """
    # Get project root
    project_root = Path(__file__).parent.parent.parent
    agents_dir = project_root / "agents"

    workflows = []

    # Scan agents directory for state files
    if agents_dir.exists():
        for agent_dir in agents_dir.iterdir():
            if agent_dir.is_dir():
                state_file = agent_dir / "adw_state.json"
                if state_file.exists():
                    try:
                        with open(state_file) as f:
                            state_data = json.load(f)

                        adw_id = state_data.get("adw_id")
                        if not adw_id:
                            continue

                        # Get full status
                        status = get_workflow_status(adw_id)

                        # Only include if worktree exists (active)
                        if status.get("worktree_exists"):
                            workflows.append(status)

                    except (json.JSONDecodeError, KeyError) as e:
                        logger.warning(f"Failed to parse state in {agent_dir}: {e}")
                        continue

    # Sort by most recent first (based on adw_id)
    workflows.sort(key=lambda x: x.get("adw_id", ""), reverse=True)

    return workflows


def cleanup_worktree(adw_id: str, force: bool = False) -> Dict[str, Any]:
    """Clean up an ADW worktree.

    Args:
        adw_id: The ADW ID to clean up
        force: Force cleanup even if branch has uncommitted changes

    Returns:
        Dict with success status and message
    """
    logger.info(f"Cleaning up worktree for ADW {adw_id}, force={force}")

    # Load state to get worktree path
    state = ADWState.load(adw_id)

    if not state:
        return {
            "success": False,
            "message": f"No state found for ADW {adw_id}",
        }

    worktree_path = state.get("worktree_path")

    if not worktree_path or not os.path.exists(worktree_path):
        return {
            "success": False,
            "message": f"Worktree not found at {worktree_path}",
        }

    # Remove worktree
    success, error = remove_worktree(adw_id, logger)

    if success:
        return {
            "success": True,
            "message": f"Successfully removed worktree at {worktree_path}",
        }
    else:
        return {
            "success": False,
            "message": error or "Unknown error removing worktree",
        }


def get_adw_logs(adw_id: str, phase: Optional[str] = None, tail_lines: int = 50) -> Dict[str, Any]:
    """Get logs from an ADW workflow.

    Args:
        adw_id: The ADW ID
        phase: Optional phase to get logs for (planner, implementor, etc.)
        tail_lines: Number of lines to return from end of log

    Returns:
        Dict with logs array and phase info
    """
    # Get agents directory
    project_root = Path(__file__).parent.parent.parent
    agents_dir = project_root / "agents" / adw_id

    if not agents_dir.exists():
        return {
            "logs": [],
            "message": f"No agents directory found for ADW {adw_id}",
        }

    # If no phase specified, find the most recent phase
    if not phase:
        phase_dirs = ["planner", "implementor", "tester", "reviewer", "documenter"]
        for phase_name in reversed(phase_dirs):
            phase_dir = agents_dir / phase_name
            if phase_dir.exists():
                phase = phase_name
                break

    if not phase:
        return {
            "logs": [],
            "message": "No phase directories found",
        }

    # Look for raw_output.jsonl
    log_file = agents_dir / phase / "raw_output.jsonl"

    if not log_file.exists():
        return {
            "logs": [],
            "phase": phase,
            "message": f"No log file found for phase {phase}",
        }

    try:
        # Read JSONL file and extract text content
        logs = []
        with open(log_file) as f:
            lines = f.readlines()

        # Take last N lines
        for line in lines[-tail_lines:]:
            try:
                data = json.loads(line)
                # Extract message content if it exists
                if "content" in data:
                    logs.append(data["content"])
                elif "message" in data:
                    logs.append(str(data["message"]))
                else:
                    logs.append(json.dumps(data, indent=2))
            except json.JSONDecodeError:
                logs.append(line.strip())

        return {
            "logs": logs,
            "phase": phase,
            "lines_returned": len(logs),
        }

    except Exception as e:
        logger.error(f"Failed to read logs: {e}")
        return {
            "logs": [],
            "phase": phase,
            "error": str(e),
        }
