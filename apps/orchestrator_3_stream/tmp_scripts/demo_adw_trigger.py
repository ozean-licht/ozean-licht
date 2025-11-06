#!/usr/bin/env python3
"""
Demo script showing what happens when a user mentions an issue in the orchestrator chat

This demonstrates the complete flow from user message to ADW workflow spawning.
"""

import asyncio
import json
from datetime import datetime


async def simulate_user_message(message: str):
    """
    Simulate what happens when a user sends a message to the orchestrator
    """
    print("=" * 60)
    print("ADW TRIGGER DEMO")
    print("=" * 60)
    print(f"\n🧑 USER MESSAGE: '{message}'\n")
    print("-" * 60)

    # Check for issue pattern (same as orchestrator_service.py)
    import re
    pattern = r'(?:issue\s+#?|#)(\d+)'
    match = re.search(pattern, message.lower())

    if match:
        issue_number = match.group(1)
        print(f"✅ ISSUE DETECTED: #{issue_number}\n")

        # Determine workflow type
        message_lower = message.lower()
        if "fix" in message_lower or "bug" in message_lower:
            workflow_type = "plan_build_iso"
        elif "review" in message_lower:
            workflow_type = "plan_build_review_iso"
        elif "test" in message_lower:
            workflow_type = "plan_build_test_iso"
        else:
            workflow_type = "plan_build_iso"

        print(f"📋 WORKFLOW TYPE: {workflow_type}\n")

        # Show the command that would be executed
        cmd = [
            "uv", "run",
            f"adws/adw_{workflow_type}.py",
            issue_number
        ]
        print(f"🚀 SPAWNING COMMAND:\n   {' '.join(cmd)}\n")

        # Show the notification that would appear in chat
        notification = (
            f"✅ **Started ADW {workflow_type.replace('_', ' ')} workflow for issue #{issue_number}**\n\n"
            f"The workflow is running in the background in an isolated worktree. "
            f"This will:\n"
            f"- Create a dedicated git worktree\n"
            f"- Generate implementation plan\n"
            f"- Build the solution\n"
        )

        if "test" in workflow_type:
            notification += f"- Run tests\n"
        if "review" in workflow_type:
            notification += f"- Review the implementation\n"

        notification += f"\n📍 Check GitHub for PR updates: issue #{issue_number}"

        print(f"💬 ORCHESTRATOR RESPONSE:\n")
        print("   ┌─────────────────────────────────────────────────┐")
        for line in notification.split('\n'):
            print(f"   │ {line:<47} │")
        print("   └─────────────────────────────────────────────────┘")

        # Show WebSocket event that would be broadcast
        ws_event = {
            "type": "orchestrator_chat",
            "message": {
                "id": "msg-123-456",
                "orchestrator_agent_id": "orch-uuid-here",
                "sender_type": "orchestrator",
                "receiver_type": "user",
                "message": notification,
                "metadata": {
                    "type": "adw_trigger",
                    "issue_number": issue_number
                },
                "timestamp": datetime.now().isoformat()
            }
        }

        print(f"\n📡 WEBSOCKET EVENT:")
        print(json.dumps(ws_event, indent=2)[:500] + "...")

        print(f"\n🎨 UI DISPLAY:")
        print("   - Message appears with cyan gradient background")
        print("   - 'ADW' badge shown next to ORCHESTRATOR")
        print("   - Animated pulsing left border")
        print("   - User sees immediate confirmation")

        print(f"\n⚙️ BACKGROUND PROCESS:")
        print(f"   - ADW workflow runs in trees/{issue_number[:8]}/")
        print(f"   - Uses isolated git worktree")
        print(f"   - Creates PR when complete")
        print(f"   - No blocking of orchestrator")

    else:
        print("❌ NO ISSUE DETECTED\n")
        print("📝 Message will be processed normally by orchestrator")
        print("   - Sent to Claude SDK")
        print("   - Response streamed back")
        print("   - No ADW workflow triggered")

    print("\n" + "=" * 60)


async def main():
    """Run demo scenarios"""

    # Test various message types
    test_messages = [
        "Fix issue 123",
        "Please review PR #456",
        "Can you test #789?",
        "What's the status of the project?",  # No issue mention
    ]

    for msg in test_messages:
        await simulate_user_message(msg)
        print("\n" + "─" * 60 + "\n")
        await asyncio.sleep(0.5)  # Brief pause between demos

    print("📚 SUMMARY:")
    print("-" * 60)
    print("✅ ADW workflows trigger automatically on issue mentions")
    print("✅ Users get immediate visual feedback")
    print("✅ Workflows run in background without blocking")
    print("✅ Natural language interface - no commands to learn")
    print("✅ Zero configuration required")


if __name__ == "__main__":
    asyncio.run(main())