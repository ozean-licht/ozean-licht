#!/usr/bin/env python3
"""
Test script for the create_github_issue tool functionality

This demonstrates:
1. How the orchestrator can create well-structured issues
2. Automatic issue template formatting
3. Triggering ADW workflows after issue creation
"""

import asyncio
import json
from datetime import datetime


def show_formatted_issue(title: str, body: str, labels: str, trigger_adw: bool):
    """Display how an issue would be formatted"""

    print("=" * 60)
    print("📋 GITHUB ISSUE PREVIEW")
    print("=" * 60)

    print(f"\n📌 Title: {title}")
    print(f"🏷️  Labels: {labels}")
    print(f"🤖 ADW: {'Yes - Auto-trigger workflow' if trigger_adw else 'No - Manual implementation'}")

    print("\n📄 Body:")
    print("-" * 60)

    # Format body if it's not already structured
    if body and not body.startswith("## "):
        formatted_body = f"""## 🎯 Objective
{body}

## 📋 Scope

### In Scope
- Implement the core functionality described above
- Add necessary error handling
- Include basic tests

### Out of Scope
- Extended features beyond the objective
- Major refactoring of existing code
- UI/UX design changes not mentioned

## ✅ Acceptance Criteria
1. The objective is successfully implemented
2. Code passes existing tests
3. No regression in existing functionality

## 🤖 ADW Instructions
```yaml
adw:
  estimated_effort: small
  workflow_type: plan_build_iso
  model_set: base
  auto_merge: false
```"""
        print(formatted_body)
    else:
        print(body)

    print("-" * 60)


def demonstrate_issue_examples():
    """Show examples of good issue creation"""

    print("\n" + "=" * 60)
    print("🎯 EXAMPLE ISSUES")
    print("=" * 60)

    examples = [
        {
            "title": "Add dark mode toggle to admin dashboard",
            "body": "Add a toggle button in the header that switches between light and dark themes. The preference should persist in localStorage.",
            "labels": "enhancement,ui",
            "trigger_adw": True,
            "explanation": "✅ GOOD: Specific, scoped, clear acceptance criteria"
        },
        {
            "title": "Fix WebSocket reconnection after timeout",
            "body": "WebSocket connections are not automatically reconnecting after a timeout. Users have to manually refresh the page to reconnect.",
            "labels": "bug,high-priority",
            "trigger_adw": True,
            "explanation": "✅ GOOD: Clear bug with reproducible issue"
        },
        {
            "title": "Add CSV export to user table",
            "body": "Users need ability to export the user table data as CSV. Include all visible columns and respect current filters.",
            "labels": "enhancement,feature",
            "trigger_adw": True,
            "explanation": "✅ GOOD: Single feature, well-defined scope"
        }
    ]

    for i, example in enumerate(examples, 1):
        print(f"\n{'─' * 60}")
        print(f"Example {i}: {example['explanation']}")
        print(f"{'─' * 60}")

        show_formatted_issue(
            example["title"],
            example["body"],
            example["labels"],
            example["trigger_adw"]
        )

        if example["trigger_adw"]:
            print(f"\n🚀 ADW Workflow would be triggered:")
            print(f"   - Creates worktree for implementation")
            print(f"   - Generates plan based on issue")
            print(f"   - Implements solution")
            print(f"   - Creates PR when complete")


def show_workflow_flow():
    """Show the complete flow from issue to implementation"""

    print("\n" + "=" * 60)
    print("🔄 COMPLETE WORKFLOW FLOW")
    print("=" * 60)

    steps = [
        ("1️⃣", "Orchestrator identifies needed work", "User mentions a problem or needed feature"),
        ("2️⃣", "Creates GitHub issue", "Well-structured issue with template"),
        ("3️⃣", "Issue gets number", "e.g., #123"),
        ("4️⃣", "Triggers ADW workflow", "If trigger_adw=true"),
        ("5️⃣", "ADW creates worktree", "Isolated environment for work"),
        ("6️⃣", "ADW implements solution", "Following issue requirements"),
        ("7️⃣", "Creates PR", "Links back to issue #123"),
        ("8️⃣", "Ready for review", "Human or automated review")
    ]

    for emoji, title, description in steps:
        print(f"\n{emoji} {title}")
        print(f"   └─ {description}")

    print("\n📊 Result: From problem identification to PR in minutes!")


def show_orchestrator_usage():
    """Show how the orchestrator would use this tool"""

    print("\n" + "=" * 60)
    print("🤖 ORCHESTRATOR USAGE")
    print("=" * 60)

    print("""
Example orchestrator conversation:

USER: "We need a way to export user data"

ORCHESTRATOR: "I'll create an issue for that and start working on it."

*Orchestrator uses tool:*
```python
create_github_issue(
    title="Add CSV export to user table",
    body="Users need ability to export the user table data as CSV...",
    labels="enhancement,feature",
    trigger_adw=True,
    workflow_type="plan_build_iso"
)
```

RESPONSE:
✅ Created issue #234: Add CSV export to user table
📍 URL: https://github.com/owner/repo/issues/234
🚀 ADW workflow started - implementation in progress
📝 Check PR in ~30 minutes

USER: "Great! Also track the bug with login timeouts but don't implement yet"

ORCHESTRATOR: "I'll create an issue for tracking without triggering ADW."

*Orchestrator uses tool:*
```python
create_github_issue(
    title="Fix login timeout after inactivity",
    body="Users are experiencing timeouts after 30 minutes...",
    labels="bug",
    trigger_adw=False  # Just track, don't implement yet
)
```

RESPONSE:
✅ Created issue #235: Fix login timeout after inactivity
📍 URL: https://github.com/owner/repo/issues/235
📌 Issue created for tracking (ADW not triggered)
    """)


def main():
    """Run all demonstrations"""

    print("=" * 60)
    print("CREATE GITHUB ISSUE TOOL - DEMONSTRATION")
    print("=" * 60)

    # Show examples
    demonstrate_issue_examples()

    # Show workflow
    show_workflow_flow()

    # Show orchestrator usage
    show_orchestrator_usage()

    # Summary
    print("\n" + "=" * 60)
    print("💡 KEY BENEFITS")
    print("=" * 60)
    print("""
1. **Structured Issues** - Consistent format for better agent understanding
2. **Proper Scoping** - Template guides toward manageable chunks
3. **Seamless Integration** - Issue → ADW → PR pipeline
4. **Flexibility** - Can create issues with or without auto-implementation
5. **Traceability** - Full audit trail from idea to implementation

The orchestrator becomes proactive:
- Identifies problems → Creates issues → Fixes them
- All with proper tracking and documentation!
    """)


if __name__ == "__main__":
    main()