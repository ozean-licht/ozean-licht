#!/usr/bin/env python3
"""
Test script to verify command discovery works correctly with new o-commands/a-commands structure.

This tests:
1. Symlinks are correctly created and functional
2. Command discovery works from root context (a-commands)
3. Command discovery works from orchestrator context (o-commands)
4. All expected commands are discovered
"""

import sys
from pathlib import Path

# Add orchestrator backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "apps" / "orchestrator_3_stream" / "backend"))

from modules.slash_command_parser import discover_slash_commands


def test_symlinks():
    """Test that symlinks are correctly created."""
    print("\n" + "=" * 80)
    print("TEST 1: Symlink Structure")
    print("=" * 80)

    root_commands = Path("/opt/ozean-licht-ecosystem/.claude/commands")
    orch_commands = Path("/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/.claude/commands")

    # Check root symlink
    if not root_commands.is_symlink():
        print(f"❌ FAILED: {root_commands} is not a symlink")
        return False

    target = root_commands.resolve()
    expected_target = Path("/opt/ozean-licht-ecosystem/.claude/a-commands")

    if target != expected_target:
        print(f"❌ FAILED: Root symlink points to {target}, expected {expected_target}")
        return False

    print(f"✅ Root symlink: .claude/commands → a-commands")

    # Check orchestrator symlink
    if not orch_commands.is_symlink():
        print(f"❌ FAILED: {orch_commands} is not a symlink")
        return False

    target = orch_commands.resolve()
    expected_target = Path("/opt/ozean-licht-ecosystem/.claude/o-commands")

    if target != expected_target:
        print(f"❌ FAILED: Orchestrator symlink points to {target}, expected {expected_target}")
        return False

    print(f"✅ Orchestrator symlink: apps/orchestrator_3_stream/.claude/commands → o-commands")

    return True


def test_root_context_discovery():
    """Test command discovery from root context (should get a-commands)."""
    print("\n" + "=" * 80)
    print("TEST 2: Root Context Discovery (A-Commands)")
    print("=" * 80)

    root_dir = "/opt/ozean-licht-ecosystem"
    commands = discover_slash_commands(root_dir)

    if not commands:
        print("❌ FAILED: No commands discovered from root context")
        return False

    print(f"✅ Discovered {len(commands)} commands from root context")

    # Expected a-commands (13 total)
    expected_a_commands = {
        "all_tools", "build", "find_and_summarize", "load_ai_docs", "load_bundle",
        "plan", "prime", "prime_3", "prime_cc", "question", "quick-plan",
        "reset", "t_metaprompt_workflow"
    }

    discovered_names = {cmd["name"] for cmd in commands}

    # Check for expected commands
    missing = expected_a_commands - discovered_names
    if missing:
        print(f"❌ FAILED: Missing expected a-commands: {missing}")
        return False

    # Check for unexpected o-commands
    o_commands = {
        "orch_scout_and_build", "orch_one_shot_agent", "orch_plan_w_scouts_build_review",
        "orch_trinity_mode", "build_in_parallel", "plan_w_scouters", "parallel_subagents"
    }

    unexpected = discovered_names & o_commands
    if unexpected:
        print(f"⚠️  WARNING: Found o-commands in root context: {unexpected}")
        # This is OK if both directories are accessible, but not ideal

    print(f"✅ All expected a-commands found: {sorted(discovered_names)}")

    return True


def test_orchestrator_context_discovery():
    """Test command discovery from orchestrator context (should get o-commands)."""
    print("\n" + "=" * 80)
    print("TEST 3: Orchestrator Context Discovery (O-Commands)")
    print("=" * 80)

    orch_dir = "/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream"
    commands = discover_slash_commands(orch_dir)

    if not commands:
        print("❌ FAILED: No commands discovered from orchestrator context")
        return False

    print(f"✅ Discovered {len(commands)} commands from orchestrator context")

    # Expected o-commands (7 total)
    expected_o_commands = {
        "orch_scout_and_build", "orch_one_shot_agent", "orch_plan_w_scouts_build_review",
        "orch_trinity_mode", "build_in_parallel", "plan_w_scouters", "parallel_subagents"
    }

    discovered_names = {cmd["name"] for cmd in commands}

    # Check for expected commands
    missing = expected_o_commands - discovered_names
    if missing:
        print(f"❌ FAILED: Missing expected o-commands: {missing}")
        return False

    print(f"✅ All expected o-commands found: {sorted(discovered_names)}")

    return True


def test_file_counts():
    """Test that file counts match expectations."""
    print("\n" + "=" * 80)
    print("TEST 4: File Counts")
    print("=" * 80)

    o_commands_dir = Path("/opt/ozean-licht-ecosystem/.claude/o-commands")
    a_commands_dir = Path("/opt/ozean-licht-ecosystem/.claude/a-commands")

    o_count = len(list(o_commands_dir.glob("*.md")))
    a_count = len(list(a_commands_dir.glob("*.md")))

    print(f"o-commands: {o_count} files")
    print(f"a-commands: {a_count} files")

    if o_count != 7:
        print(f"❌ FAILED: Expected 7 o-commands, found {o_count}")
        return False

    if a_count != 13:
        print(f"❌ FAILED: Expected 13 a-commands, found {a_count}")
        return False

    print(f"✅ File counts correct: {o_count} o-commands, {a_count} a-commands")

    return True


def main():
    """Run all tests."""
    print("🔷" * 40)
    print("COMMAND DISCOVERY VALIDATION TESTS")
    print("🔷" * 40)

    tests = [
        ("Symlink Structure", test_symlinks),
        ("Root Context Discovery", test_root_context_discovery),
        ("Orchestrator Context Discovery", test_orchestrator_context_discovery),
        ("File Counts", test_file_counts),
    ]

    passed = 0
    failed = 0

    for test_name, test_func in tests:
        try:
            result = test_func()
            if result:
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"\n❌ TEST FAILED WITH EXCEPTION: {test_name}")
            print(f"   Error: {e}")
            import traceback
            traceback.print_exc()
            failed += 1

    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"Total: {passed + failed}")

    if failed == 0:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {failed} TEST(S) FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
