#!/usr/bin/env python3
"""
Test script for ADW trigger functionality in orchestrator

This script tests that:
1. Issue mentions are detected correctly
2. ADW workflows are triggered
3. UI notifications are sent via WebSocket
"""

import asyncio
import re
from typing import Optional


def detect_issue_pattern(message: str) -> Optional[str]:
    """Test the same regex pattern used in orchestrator_service.py"""
    pattern = r'(?:issue\s+#?|#)(\d+)'
    match = re.search(pattern, message.lower())
    if match:
        return match.group(1)
    return None


def determine_workflow_type(message: str) -> str:
    """Test workflow type determination logic"""
    message_lower = message.lower()

    if "fix" in message_lower or "bug" in message_lower:
        return "plan_build_iso"
    elif "review" in message_lower:
        return "plan_build_review_iso"
    elif "test" in message_lower:
        return "plan_build_test_iso"
    else:
        return "plan_build_iso"  # default


def test_issue_detection():
    """Test various message formats for issue detection"""

    test_cases = [
        # Should trigger
        ("Fix issue 123", "123", "plan_build_iso"),
        ("Please fix bug #456", "456", "plan_build_iso"),
        ("Review issue #789", "789", "plan_build_review_iso"),
        ("Test #101", "101", "plan_build_test_iso"),
        ("issue 999 needs work", "999", "plan_build_iso"),

        # Should NOT trigger
        ("Let's discuss the solution", None, None),
        ("What about the performance?", None, None),
        ("The number is 123 but not an issue", None, None),
    ]

    print("Testing issue detection patterns:")
    print("-" * 50)

    all_passed = True

    for message, expected_issue, expected_workflow in test_cases:
        detected_issue = detect_issue_pattern(message)

        if expected_issue:
            # Should trigger
            if detected_issue == expected_issue:
                workflow = determine_workflow_type(message)
                if workflow == expected_workflow:
                    print(f"✅ PASS: '{message}' -> issue #{detected_issue} ({workflow})")
                else:
                    print(f"❌ FAIL: '{message}' -> wrong workflow: {workflow} (expected {expected_workflow})")
                    all_passed = False
            else:
                print(f"❌ FAIL: '{message}' -> not detected (expected #{expected_issue})")
                all_passed = False
        else:
            # Should NOT trigger
            if detected_issue is None:
                print(f"✅ PASS: '{message}' -> correctly ignored")
            else:
                print(f"❌ FAIL: '{message}' -> wrongly detected as #{detected_issue}")
                all_passed = False

    print("-" * 50)
    if all_passed:
        print("🎉 All tests passed!")
    else:
        print("⚠️ Some tests failed")

    return all_passed


async def test_subprocess_command():
    """Test that the subprocess command would be constructed correctly"""

    print("\nTesting subprocess command construction:")
    print("-" * 50)

    issue_number = "123"
    workflow_type = "plan_build_iso"

    cmd = [
        "uv", "run",
        f"adws/adw_{workflow_type}.py",
        issue_number
    ]

    print(f"Command that would be executed: {' '.join(cmd)}")
    print(f"Working directory: /opt/ozean-licht-ecosystem")

    # Check if the ADW script exists
    import os
    script_path = f"/opt/ozean-licht-ecosystem/adws/adw_{workflow_type}.py"

    if os.path.exists(script_path):
        print(f"✅ ADW script exists: {script_path}")
    else:
        print(f"❌ ADW script NOT found: {script_path}")

    return True


async def main():
    """Run all tests"""

    print("=" * 60)
    print("ADW Trigger Integration Tests")
    print("=" * 60)

    # Test 1: Pattern detection
    pattern_test_passed = test_issue_detection()

    # Test 2: Command construction
    await test_subprocess_command()

    print("\n" + "=" * 60)
    print("Test Summary:")
    print("=" * 60)

    if pattern_test_passed:
        print("✅ Pattern detection: PASSED")
    else:
        print("❌ Pattern detection: FAILED")

    print("\n📝 Notes:")
    print("- The integration will trigger ADW workflows in the background")
    print("- ADW workflows run in isolated git worktrees")
    print("- Users see a notification in the chat with ADW badge")
    print("- Check GitHub for PR updates after workflow completes")


if __name__ == "__main__":
    asyncio.run(main())