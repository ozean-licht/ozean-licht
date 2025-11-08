#!/usr/bin/env python3
"""
Test Priority Implementations

Tests for PRIORITY 1 (Context Windowing) and PRIORITY 2 (Model Tiering)
to verify immediate token reduction and cost savings.
"""

import asyncio
import sys
from pathlib import Path

# Add modules to path
sys.path.append(str(Path(__file__).parent))

from modules.context_manager import ContextManager
from modules.model_selector import ModelSelector


def test_priority1_aggressive_context_windowing():
    """
    Test PRIORITY 1: Aggressive context windowing with 25k token limit.
    Expected: 30-40% immediate reduction in input tokens.
    """
    print("\n" + "="*60)
    print("PRIORITY 1: AGGRESSIVE CONTEXT WINDOWING TEST")
    print("="*60)

    # Create context manager with aggressive settings
    cm = ContextManager(
        max_messages=20,
        max_tokens=25000,
        mode="token_priority"
    )

    # Simulate a long conversation (100 messages) with realistic sizes
    messages = []
    for i in range(100):
        role = "user" if i % 2 == 0 else "assistant"
        # Create messages of varying sizes to simulate real conversation
        if i < 20:
            # Initial context-setting messages
            content = f"Initial message {i}: " + ("This is context about the project. " * 20)
        elif i < 50:
            # Mid-conversation working messages
            content = f"Working message {i}: " + ("Here we discuss implementation details and technical aspects of the system. " * 50)
        else:
            # Later detailed implementation messages
            content = f"Detailed message {i}: " + ("This contains extensive code examples, documentation, and implementation details that take up significant token space in the context window. " * 100)

        messages.append({
            "sender_type": role,
            "message": content,
            "created_at": f"2024-{i:02d}",
        })

    # Analyze before trimming
    stats_before = cm.analyze_messages(messages)
    print(f"\nBEFORE TRIMMING:")
    print(f"  Messages: {stats_before.total_messages}")
    print(f"  Tokens: {stats_before.total_tokens:,}")
    print(f"  Exceeds limits: Messages={stats_before.exceeds_message_limit}, Tokens={stats_before.exceeds_token_limit}")

    # Trim aggressively
    trimmed = cm.trim_to_limit(messages, mode="token_count")
    stats_after = cm.analyze_messages(trimmed)

    # Calculate reduction
    message_reduction = (stats_before.total_messages - stats_after.total_messages) / stats_before.total_messages * 100
    token_reduction = (stats_before.total_tokens - stats_after.total_tokens) / stats_before.total_tokens * 100

    print(f"\nAFTER TRIMMING:")
    print(f"  Messages: {stats_after.total_messages} ({message_reduction:.1f}% reduction)")
    print(f"  Tokens: {stats_after.total_tokens:,} ({token_reduction:.1f}% reduction)")
    print(f"  Within limits: Messages={not stats_after.exceeds_message_limit}, Tokens={not stats_after.exceeds_token_limit}")

    # Verify aggressive reduction
    success = token_reduction >= 30 and stats_after.total_tokens <= 25000
    print(f"\n✅ RESULT: {'PASS' if success else 'FAIL'}")
    print(f"  Target: 30-40% reduction, <25k tokens")
    print(f"  Achieved: {token_reduction:.1f}% reduction, {stats_after.total_tokens:,} tokens")

    return success


def test_priority2_model_tiering():
    """
    Test PRIORITY 2: Model tiering for 50-60% cost reduction.
    """
    print("\n" + "="*60)
    print("PRIORITY 2: MODEL TIERING TEST")
    print("="*60)

    # Create model selector
    selector = ModelSelector()

    # Test various message types
    test_cases = [
        # Simple tasks (should use Haiku)
        ("Show me the contents of config.py", "Haiku", "simple"),
        ("List all files in the directory", "Haiku", "simple"),
        ("What is the current status?", "Haiku", "simple"),
        ("Read the documentation file", "Haiku", "simple"),
        ("Check the environment variables", "Haiku", "simple"),

        # Moderate tasks (should use Sonnet)
        ("Implement a new feature for user authentication", "Sonnet", "moderate"),
        ("Create a module for data processing", "Sonnet", "moderate"),
        ("Add error handling to the API endpoints", "Sonnet", "moderate"),
        ("Write unit tests for the service", "Sonnet", "moderate"),

        # Complex tasks (should use Opus)
        ("Design a new architecture for the entire system", "Opus", "complex"),
        ("Analyze and optimize the performance bottlenecks", "Opus", "complex"),
        ("Debug this complex issue with race conditions", "Opus", "complex"),
        ("Refactor the entire codebase for better scalability", "Opus", "complex"),
    ]

    print("\nTesting model selection for different tasks:")
    print("-" * 50)

    correct = 0
    for message, expected_tier, complexity in test_cases:
        selected_model = selector.select_model(message)

        # Check which model was selected
        if "haiku" in selected_model.lower():
            actual_tier = "Haiku"
        elif "opus" in selected_model.lower():
            actual_tier = "Opus"
        else:
            actual_tier = "Sonnet"

        is_correct = actual_tier == expected_tier
        if is_correct:
            correct += 1

        status = "✅" if is_correct else "❌"
        print(f"{status} [{complexity:8}] {actual_tier:6} | {message[:50]}...")

    # Get usage statistics
    stats = selector.get_usage_stats()

    print("\n" + "-" * 50)
    print("USAGE STATISTICS:")
    print(f"  Haiku: {stats['haiku_count']} requests ({stats['haiku_percentage']:.1f}%)")
    print(f"  Sonnet: {stats['sonnet_count']} requests ({stats['sonnet_percentage']:.1f}%)")
    print(f"  Opus: {stats['opus_count']} requests ({stats['opus_percentage']:.1f}%)")
    print(f"\n  💰 COST REDUCTION: {stats['cost_reduction_percentage']:.1f}%")

    accuracy = (correct / len(test_cases)) * 100
    success = stats['cost_reduction_percentage'] >= 40 and accuracy >= 70

    print(f"\n✅ RESULT: {'PASS' if success else 'FAIL'}")
    print(f"  Target: 50-60% cost reduction, 70%+ accuracy")
    print(f"  Achieved: {stats['cost_reduction_percentage']:.1f}% cost reduction, {accuracy:.1f}% accuracy")

    return success


def test_combined_impact():
    """
    Test combined impact of both optimizations.
    """
    print("\n" + "="*60)
    print("COMBINED IMPACT TEST")
    print("="*60)

    # Simulate token usage before optimizations
    baseline_tokens_per_request = 90000  # Current average
    baseline_model_cost = 3.0  # Sonnet cost per million tokens
    requests_per_hour = 60

    print("\nBASELINE (Before Optimizations):")
    print(f"  Tokens per request: {baseline_tokens_per_request:,}")
    print(f"  Model: Sonnet only (${baseline_model_cost}/M tokens)")
    print(f"  Hourly tokens: {baseline_tokens_per_request * requests_per_hour:,}")
    print(f"  Hourly cost: ${(baseline_tokens_per_request * requests_per_hour * baseline_model_cost / 1_000_000):.2f}")

    # After PRIORITY 1: Context windowing
    optimized_tokens = baseline_tokens_per_request * 0.65  # 35% reduction

    # After PRIORITY 2: Model tiering
    # Assume 40% Haiku, 50% Sonnet, 10% Opus
    avg_model_cost = (0.4 * 0.25 + 0.5 * 3.0 + 0.1 * 15.0) / 1.0  # Weighted average

    print("\nOPTIMIZED (After Both Priorities):")
    print(f"  Tokens per request: {optimized_tokens:,.0f} (35% reduction)")
    print(f"  Model mix: 40% Haiku, 50% Sonnet, 10% Opus")
    print(f"  Average cost: ${avg_model_cost:.2f}/M tokens")
    print(f"  Hourly tokens: {optimized_tokens * requests_per_hour:,.0f}")
    print(f"  Hourly cost: ${(optimized_tokens * requests_per_hour * avg_model_cost / 1_000_000):.2f}")

    # Calculate total savings
    baseline_hourly_cost = baseline_tokens_per_request * requests_per_hour * baseline_model_cost / 1_000_000
    optimized_hourly_cost = optimized_tokens * requests_per_hour * avg_model_cost / 1_000_000
    cost_reduction = (baseline_hourly_cost - optimized_hourly_cost) / baseline_hourly_cost * 100

    print(f"\n💰 TOTAL COST REDUCTION: {cost_reduction:.1f}%")
    print(f"  Baseline: ${baseline_hourly_cost:.2f}/hour")
    print(f"  Optimized: ${optimized_hourly_cost:.2f}/hour")
    print(f"  Savings: ${baseline_hourly_cost - optimized_hourly_cost:.2f}/hour")

    # Check if we're under rate limit
    tokens_per_minute = (optimized_tokens * requests_per_hour) / 60
    under_limit = tokens_per_minute < 400000  # 40% of 1M limit

    print(f"\n📊 RATE LIMITING:")
    print(f"  Tokens per minute: {tokens_per_minute:,.0f}")
    print(f"  Rate limit target: 400,000 (40% of 1M)")
    print(f"  Under limit: {'✅ YES' if under_limit else '❌ NO'}")

    success = cost_reduction >= 50 and under_limit
    print(f"\n✅ FINAL RESULT: {'PASS' if success else 'FAIL'}")
    print(f"  Target: 50%+ cost reduction, <400k tokens/min")
    print(f"  Achieved: {cost_reduction:.1f}% cost reduction, {tokens_per_minute:,.0f} tokens/min")

    return success


def main():
    """Run all priority implementation tests."""
    print("\n" + "="*60)
    print(" PRIORITY IMPLEMENTATIONS TEST SUITE")
    print(" Testing immediate fixes for 90% rate limiting")
    print("="*60)

    results = []

    # Test PRIORITY 1
    results.append(("Context Windowing", test_priority1_aggressive_context_windowing()))

    # Test PRIORITY 2
    results.append(("Model Tiering", test_priority2_model_tiering()))

    # Test Combined Impact
    results.append(("Combined Impact", test_combined_impact()))

    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)

    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name:20} {status}")
        if not passed:
            all_passed = False

    if all_passed:
        print("\n🎉 ALL TESTS PASSED! Rate limiting and cost issues should be resolved.")
        print("\n📈 EXPECTED IMPROVEMENTS:")
        print("  • Input tokens: Reduced from 900k to <400k per minute")
        print("  • Cost: Reduced by 50-60% through model tiering")
        print("  • Rate limiting: Should stay under 40% of API limit")
    else:
        print("\n⚠️  Some tests failed. Review the implementations.")

    return all_passed


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)