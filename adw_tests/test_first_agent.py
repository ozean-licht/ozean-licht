#!/usr/bin/env python3
"""
Test script for running your first ADW agent with MCP Gateway integration
This script helps verify that the ADW system is properly configured
"""

import os
import sys
import asyncio
import json
from pathlib import Path
from datetime import datetime
import subprocess

# Add ADW modules to path (updated for new structure)
sys.path.insert(0, str(Path(__file__).parent.parent / "adws"))

try:
    from adw_modules.mcp_integration import MCPGateway, MCPEnabledADW, create_mcp_config_file
    print("✅ MCP integration module loaded successfully")
except ImportError as e:
    print(f"❌ Failed to import MCP integration: {e}")
    print("Make sure you're in the virtual environment:")
    print("  source scripts/activate_env.sh")
    print("  OR: source infrastructure/python-env/.venv/bin/activate")
    sys.exit(1)

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def print_status(message: str, status: str = "info"):
    """Print colored status messages."""
    color = {
        "success": Colors.GREEN,
        "warning": Colors.YELLOW,
        "error": Colors.RED,
        "info": Colors.BLUE
    }.get(status, Colors.ENDC)

    symbol = {
        "success": "✅",
        "warning": "⚠️",
        "error": "❌",
        "info": "ℹ️"
    }.get(status, "")

    print(f"{color}{symbol} {message}{Colors.ENDC}")


def check_environment():
    """Check if environment is properly configured."""
    print_status("Checking environment configuration...", "info")

    required_vars = [
        "ANTHROPIC_API_KEY",
        "GITHUB_PAT"
    ]

    missing_vars = []
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)

    if missing_vars:
        print_status(f"Missing environment variables: {', '.join(missing_vars)}", "error")
        print_status("Please set them in your .env file", "warning")
        return False

    print_status("Environment configured correctly", "success")
    return True


def check_git_status():
    """Check Git repository status."""
    print_status("Checking Git repository...", "info")

    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            check=True
        )

        if result.stdout:
            print_status("Uncommitted changes detected:", "warning")
            print(result.stdout)

        # Check for remote
        result = subprocess.run(
            ["git", "remote", "-v"],
            capture_output=True,
            text=True,
            check=True
        )

        if not result.stdout:
            print_status("No Git remote configured", "error")
            return False

        print_status("Git repository configured", "success")
        return True

    except subprocess.CalledProcessError:
        print_status("Not a Git repository", "error")
        return False


async def test_mcp_gateway():
    """Test MCP Gateway connectivity."""
    print_status("Testing MCP Gateway connections...", "info")

    gateway = MCPGateway()

    # Test Mem0 connection
    try:
        result = await gateway.remember(
            content=f"ADW Test at {datetime.now().isoformat()}",
            agent_id="test_agent",
            metadata={"type": "test", "timestamp": datetime.now().isoformat()}
        )
        print_status("Mem0 connection successful", "success")
    except Exception as e:
        print_status(f"Mem0 connection failed: {e}", "error")
        return False

    # Test memory search
    try:
        memories = await gateway.search_memory("ADW Test", "test_agent")
        print_status(f"Found {len(memories)} test memories", "success")
    except Exception as e:
        print_status(f"Memory search failed: {e}", "error")

    return True


async def create_test_workflow():
    """Create a test ADW workflow."""
    print_status("Creating test ADW workflow...", "info")

    # Generate test ADW ID
    adw_id = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    issue_number = 0  # Test issue

    print_status(f"ADW ID: {adw_id}", "info")

    # Create ADW instance with MCP
    adw = MCPEnabledADW(adw_id=adw_id, issue_number=issue_number)

    # Test planning phase
    print_status("Testing planning phase...", "info")

    test_issue = """
    Create a simple health check endpoint that returns:
    - Status: 'ok'
    - Timestamp: Current time in ISO format
    - Service: 'ozean-licht-test'
    - Version: '1.0.0'
    """

    result = await adw.plan_with_mcp(test_issue)

    if result["status"] == "success":
        print_status("Planning phase successful", "success")
    elif result["status"] == "sdk_not_available":
        print_status("Claude SDK not available - showing prompt that would be used:", "warning")
        print(result["prompt"][:500] + "...")
    else:
        print_status(f"Planning failed: {result}", "error")

    # Clean up
    await adw.cleanup()

    return adw_id


def create_monitoring_script():
    """Create a monitoring script for ADW agents."""
    print_status("Creating ADW monitoring script...", "info")

    monitor_script = """#!/bin/bash
# ADW Agent Monitor

echo "🔍 ADW Agent Monitor"
echo "===================="

# Check for active worktrees
echo -e "\\n📁 Active Worktrees:"
git worktree list 2>/dev/null || echo "No worktrees found"

# Check for agent states
echo -e "\\n🤖 Agent States:"
if [ -d "agents" ]; then
    for agent in agents/*/; do
        if [ -f "${agent}adw_state.json" ]; then
            echo "Agent: $(basename $agent)"
            cat "${agent}adw_state.json" | python -m json.tool | head -10
        fi
    done
else
    echo "No agents directory found"
fi

# Check port usage
echo -e "\\n🔌 Port Usage (9100-9214):"
for port in {9100..9114} {9200..9214}; do
    lsof -i :$port 2>/dev/null | grep LISTEN && echo "Port $port in use"
done

# Check recent logs
echo -e "\\n📝 Recent Agent Activity:"
if [ -d "agents" ]; then
    find agents -name "*.jsonl" -type f -exec echo "Log: {}" \\; -exec tail -1 {} \\; 2>/dev/null | head -20
else
    echo "No agent logs found"
fi
"""

    monitor_path = Path("monitor_adw.sh")
    monitor_path.write_text(monitor_script)
    monitor_path.chmod(0o755)

    print_status(f"Created monitoring script: {monitor_path}", "success")


def main():
    """Main test execution."""
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print("🚀 ADW System First Agent Test")
    print("=" * 60)
    print(f"{Colors.ENDC}")

    # Step 1: Check environment
    if not check_environment():
        print_status("Please configure your environment first", "error")
        sys.exit(1)

    # Step 2: Check Git
    if not check_git_status():
        print_status("Please initialize Git repository first", "warning")
        print("Run: ./setup_github_adw.sh")

    # Step 3: Create MCP config
    print_status("Creating MCP configuration...", "info")
    config_path = create_mcp_config_file(Path.cwd())
    print_status(f"MCP config created: {config_path}", "success")

    # Step 4: Test MCP Gateway
    asyncio.run(test_mcp_gateway())

    # Step 5: Create test workflow
    adw_id = asyncio.run(create_test_workflow())

    # Step 6: Create monitoring script
    create_monitoring_script()

    # Summary
    print(f"\n{Colors.BOLD}{Colors.GREEN}")
    print("=" * 60)
    print("✅ ADW System Test Complete!")
    print("=" * 60)
    print(f"{Colors.ENDC}")

    print("\n📋 Next Steps:")
    print("1. Review the test results above")
    print("2. If using GitHub, create a real issue:")
    print("   gh issue create --title 'Your task' --body 'Description'")
    print("3. Run ADW planning on the issue:")
    print("   uv run adws/adw_plan_iso.py [issue-number]")
    print("4. Monitor agent activity:")
    print("   ./monitor_adw.sh")
    print("\n⚡ Quick Commands:")
    print("- Full SDLC: uv run adws/adw_sdlc_iso.py [issue-number]")
    print("- Plan only: uv run adws/adw_plan_iso.py [issue-number]")
    print("- Build: uv run adws/adw_build_iso.py [issue-number] [adw-id]")

    print(f"\n{Colors.YELLOW}Remember: Always review agent-generated code before merging!{Colors.ENDC}")


if __name__ == "__main__":
    # Load .env file if it exists
    from pathlib import Path
    env_file = Path(".env")

    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value.strip('"').strip("'")

    try:
        main()
    except KeyboardInterrupt:
        print_status("\nTest interrupted by user", "warning")
        sys.exit(0)
    except Exception as e:
        print_status(f"Unexpected error: {e}", "error")
        import traceback
        traceback.print_exc()
        sys.exit(1)