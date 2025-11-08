#!/usr/bin/env python3
"""
Model Tiering Test Suite

Verifies that different task types get assigned to appropriate models
for cost optimization.
"""

import sys
from pathlib import Path

# Add modules to path
sys.path.append(str(Path(__file__).parent.parent))

from modules.orchestrator_service import OrchestratorService


def test_model_selection():
    """Test that different task types get appropriate models"""

    # Create minimal orchestrator service for testing
    class MockLogger:
        def info(self, msg): print(f"INFO: {msg}")
        def warning(self, msg): print(f"WARNING: {msg}")
        def error(self, msg): print(f"ERROR: {msg}")
        def debug(self, msg): pass

    class MockWSManager:
        pass

    service = OrchestratorService(
        ws_manager=MockWSManager(),
        logger=MockLogger()
    )

    # Test cases: (message, expected_model_type)
    test_cases = [
        # Simple tasks -> Should use Haiku
        ("show me the config file", "haiku"),
        ("read the README.md", "haiku"),
        ("what is the status?", "haiku"),
        ("list all files", "haiku"),
        ("check the environment variables", "haiku"),
        ("explain what this does", "haiku"),
        ("show documentation", "haiku"),

        # Moderate tasks -> Should use Sonnet
        ("implement a new feature", "sonnet"),
        ("fix this bug", "sonnet"),
        ("create a new module", "sonnet"),
        ("update the API endpoint", "sonnet"),

        # Complex tasks -> Should use Opus
        ("redesign the entire architecture", "opus"),
        ("optimize the database schema redesign", "opus"),
        ("perform a security audit", "opus"),
        ("refactor the entire system", "opus"),
    ]

    print("\n" + "="*60)
    print("MODEL TIERING TEST RESULTS")
    print("="*60 + "\n")

    haiku_count = 0
    sonnet_count = 0
    opus_count = 0

    for message, expected_type in test_cases:
        # Analyze and select model
        task_type, complexity = service.analyze_task_complexity(message)
        selected_model = service.select_model_for_task(task_type, complexity)

        # Check result
        if "haiku" in selected_model.lower():
            actual_type = "haiku"
            haiku_count += 1
            symbol = "💰"
        elif "opus" in selected_model.lower():
            actual_type = "opus"
            opus_count += 1
            symbol = "💎"
        else:
            actual_type = "sonnet"
            sonnet_count += 1
            symbol = "📘"

        # Verify expectation
        status = "✅" if actual_type == expected_type else "❌"

        print(f"{status} {symbol} '{message[:40]:<40}' -> {actual_type.upper():<7} (expected: {expected_type.upper()})")

    # Calculate cost savings
    print("\n" + "-"*60)
    print("MODEL DISTRIBUTION & COST ANALYSIS")
    print("-"*60)

    total = len(test_cases)
    haiku_pct = (haiku_count / total) * 100
    sonnet_pct = (sonnet_count / total) * 100
    opus_pct = (opus_count / total) * 100

    print(f"\nModel Distribution:")
    print(f"  Haiku:  {haiku_count:2d}/{total} ({haiku_pct:5.1f}%) - $0.80/1M tokens")
    print(f"  Sonnet: {sonnet_count:2d}/{total} ({sonnet_pct:5.1f}%) - $3.00/1M tokens")
    print(f"  Opus:   {opus_count:2d}/{total} ({opus_pct:5.1f}%) - $15.00/1M tokens")

    # Calculate weighted average cost
    avg_cost = (haiku_pct * 0.80 + sonnet_pct * 3.00 + opus_pct * 15.00) / 100
    baseline_cost = 3.00  # All Sonnet
    savings_pct = ((baseline_cost - avg_cost) / baseline_cost) * 100

    print(f"\nCost Analysis:")
    print(f"  Baseline (all Sonnet): $3.00 per 1M tokens")
    print(f"  With tiering:          ${avg_cost:.2f} per 1M tokens")
    print(f"  Savings:               {savings_pct:.1f}%")

    if savings_pct >= 50:
        print(f"\n🎉 SUCCESS: Achieved {savings_pct:.1f}% cost reduction!")
    else:
        print(f"\n⚠️  WARNING: Only {savings_pct:.1f}% cost reduction (target: 50-60%)")

    print("\n" + "="*60)


def test_complexity_analysis():
    """Test the complexity analysis function"""

    class MockLogger:
        def info(self, msg): pass
        def warning(self, msg): pass
        def error(self, msg): pass
        def debug(self, msg): pass

    class MockWSManager:
        pass

    service = OrchestratorService(
        ws_manager=MockWSManager(),
        logger=MockLogger()
    )

    print("\nCOMPLEXITY ANALYSIS TEST")
    print("-"*40)

    test_messages = [
        "read the config file",
        "implement OAuth authentication",
        "redesign the entire database schema",
        "show me the logs",
        "fix the login bug",
        "what is the current version?",
    ]

    for msg in test_messages:
        task_type, complexity = service.analyze_task_complexity(msg)
        print(f"'{msg[:30]:<30}' -> Type: {task_type:<15} Complexity: {complexity}")


if __name__ == "__main__":
    test_model_selection()
    test_complexity_analysis()

    print("\n✅ Model tiering tests complete!")
    print("Expected 50-60% cost savings with proper task distribution.\n")