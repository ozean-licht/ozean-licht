#!/usr/bin/env python3
"""
Test Aggressive Context Windowing

This script tests the aggressive context windowing implementation
to verify it reduces token usage by 30-40% as intended.
"""

import asyncio
import sys
from pathlib import Path

# Add modules to path
sys.path.append(str(Path(__file__).parent))

from modules.context_manager import ContextManager


async def test_aggressive_context():
    """Test aggressive context windowing with realistic data."""

    print("=" * 60)
    print("TESTING AGGRESSIVE CONTEXT WINDOWING")
    print("=" * 60)

    # Create a large conversation history to simulate rate limiting scenario
    messages = []

    # Add system message
    messages.append({
        "sender_type": "system",
        "message": "You are a helpful assistant. " * 50,  # Large system prompt
    })

    # Add 100 message exchanges (50 user, 50 assistant)
    for i in range(50):
        # User message
        messages.append({
            "sender_type": "user",
            "message": f"User message {i}: " + "This is a detailed question about a complex topic. " * 20
        })
        # Assistant response
        messages.append({
            "sender_type": "assistant",
            "message": f"Assistant response {i}: " + "This is a comprehensive answer with lots of details. " * 25
        })

    print(f"\nOriginal conversation: {len(messages)} messages")

    # Test 1: Standard configuration (less aggressive)
    print("\n" + "-" * 40)
    print("Test 1: STANDARD Configuration")
    print("-" * 40)

    standard_manager = ContextManager(
        max_messages=50,
        max_tokens=50000,
        mode="balanced"
    )

    stats_before = standard_manager.analyze_messages(messages)
    print(f"BEFORE: {stats_before.total_messages} messages, {stats_before.total_tokens:,} tokens")

    trimmed_standard = standard_manager.trim_to_limit(messages, mode="auto")
    stats_after_standard = standard_manager.analyze_messages(trimmed_standard)

    print(f"AFTER:  {stats_after_standard.total_messages} messages, {stats_after_standard.total_tokens:,} tokens")

    if stats_before.total_tokens > 0:
        reduction_standard = (stats_before.total_tokens - stats_after_standard.total_tokens) / stats_before.total_tokens * 100
        print(f"Token reduction: {reduction_standard:.1f}%")

    # Test 2: AGGRESSIVE configuration (our new settings)
    print("\n" + "-" * 40)
    print("Test 2: AGGRESSIVE Configuration (PRIORITY 1)")
    print("-" * 40)

    aggressive_manager = ContextManager(
        max_messages=20,  # Very aggressive
        max_tokens=25000,  # 25k limit (was 50k)
        mode="token_priority"  # Prioritize token reduction
    )

    stats_before = aggressive_manager.analyze_messages(messages)
    print(f"BEFORE: {stats_before.total_messages} messages, {stats_before.total_tokens:,} tokens")

    trimmed_aggressive = aggressive_manager.trim_to_limit(messages, mode="token_count")
    stats_after_aggressive = aggressive_manager.analyze_messages(trimmed_aggressive)

    print(f"AFTER:  {stats_after_aggressive.total_messages} messages, {stats_after_aggressive.total_tokens:,} tokens")

    if stats_before.total_tokens > 0:
        reduction_aggressive = (stats_before.total_tokens - stats_after_aggressive.total_tokens) / stats_before.total_tokens * 100
        print(f"Token reduction: {reduction_aggressive:.1f}%")

    # Compare results
    print("\n" + "=" * 60)
    print("COMPARISON RESULTS")
    print("=" * 60)

    print(f"\nStandard mode:")
    print(f"  - Messages kept: {stats_after_standard.total_messages}")
    print(f"  - Tokens kept:   {stats_after_standard.total_tokens:,}")
    print(f"  - Reduction:     {reduction_standard:.1f}%")

    print(f"\nAggressive mode:")
    print(f"  - Messages kept: {stats_after_aggressive.total_messages}")
    print(f"  - Tokens kept:   {stats_after_aggressive.total_tokens:,}")
    print(f"  - Reduction:     {reduction_aggressive:.1f}%")

    improvement = reduction_aggressive - reduction_standard
    print(f"\n🎯 Aggressive mode achieves {improvement:.1f}% MORE reduction!")

    # Test 3: Extreme case - what happens with very long conversation
    print("\n" + "=" * 60)
    print("Test 3: EXTREME CASE (200 messages)")
    print("=" * 60)

    # Double the messages
    extreme_messages = messages + messages

    print(f"Extreme conversation: {len(extreme_messages)} messages")

    stats_extreme_before = aggressive_manager.analyze_messages(extreme_messages)
    print(f"BEFORE: {stats_extreme_before.total_messages} messages, {stats_extreme_before.total_tokens:,} tokens")

    trimmed_extreme = aggressive_manager.trim_to_limit(extreme_messages, mode="token_count")
    stats_extreme_after = aggressive_manager.analyze_messages(trimmed_extreme)

    print(f"AFTER:  {stats_extreme_after.total_messages} messages, {stats_extreme_after.total_tokens:,} tokens")

    if stats_extreme_before.total_tokens > 0:
        reduction_extreme = (stats_extreme_before.total_tokens - stats_extreme_after.total_tokens) / stats_extreme_before.total_tokens * 100
        print(f"Token reduction: {reduction_extreme:.1f}%")

    # Final verdict
    print("\n" + "=" * 60)
    print("VERDICT")
    print("=" * 60)

    if reduction_aggressive >= 30:
        print("✅ SUCCESS: Aggressive context windowing achieves target 30-40% reduction!")
        print(f"   Actual reduction: {reduction_aggressive:.1f}%")
    else:
        print(f"⚠️  WARNING: Only {reduction_aggressive:.1f}% reduction achieved (target: 30-40%)")

    if stats_after_aggressive.total_tokens <= 25000:
        print("✅ SUCCESS: Context stays within 25k token limit!")
    else:
        print(f"⚠️  WARNING: Context uses {stats_after_aggressive.total_tokens:,} tokens (limit: 25,000)")

    # Show sample of trimmed messages
    print("\n" + "=" * 60)
    print("SAMPLE OF TRIMMED MESSAGES")
    print("=" * 60)

    print(f"\nShowing first 3 and last 3 messages kept:")
    for i, msg in enumerate(trimmed_aggressive[:3]):
        msg_type = msg.get("sender_type", "unknown")
        msg_preview = msg.get("message", "")[:100] + "..."
        print(f"  [{i}] {msg_type}: {msg_preview}")

    print("  ...")

    for i, msg in enumerate(trimmed_aggressive[-3:], start=len(trimmed_aggressive)-3):
        msg_type = msg.get("sender_type", "unknown")
        msg_preview = msg.get("message", "")[:100] + "..."
        print(f"  [{i}] {msg_type}: {msg_preview}")


if __name__ == "__main__":
    asyncio.run(test_aggressive_context())
    print("\n✅ Test complete!")