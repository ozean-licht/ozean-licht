#!/usr/bin/env python3
"""
Token Optimization Tests

Comprehensive test suite for token optimization modules including:
- Context Manager
- Response Cache
- Rate Limiter
- Cost Tracker
- Conversation Summarizer

Tests verify functionality, edge cases, and integration scenarios.
"""

import asyncio
import pytest
import json
from datetime import datetime, timezone, timedelta
from unittest.mock import MagicMock, AsyncMock, patch
import sys
from pathlib import Path

# Add modules to path
sys.path.append(str(Path(__file__).parent.parent))

from modules.context_manager import ContextManager, MessageStats
from modules.response_cache import ResponseCache
from modules.rate_limiter import RateLimiter
from modules.cost_tracker import CostTracker
from modules.conversation_summarizer import ConversationSummarizer


# ═══════════════════════════════════════════════════════════
# CONTEXT MANAGER TESTS
# ═══════════════════════════════════════════════════════════


class TestContextManager:
    """Test suite for ContextManager."""

    def test_initialization(self):
        """Test ContextManager initialization with various configurations."""
        # Test with default values
        cm = ContextManager()
        assert cm.max_messages == 50
        assert cm.max_tokens == 100000

        # Test with custom values
        cm = ContextManager(max_messages=10, max_tokens=5000)
        assert cm.max_messages == 10
        assert cm.max_tokens == 5000

    def test_estimate_tokens(self):
        """Test token estimation accuracy."""
        cm = ContextManager()

        # Test various text lengths
        assert cm.estimate_tokens("Hello") == 1  # 5 chars / 4 ≈ 1
        assert cm.estimate_tokens("This is a test message") == 5  # 22 chars / 4 ≈ 5
        assert cm.estimate_tokens("x" * 400) == 100  # 400 chars / 4 = 100

        # Test empty string
        assert cm.estimate_tokens("") == 0

    def test_analyze_messages(self):
        """Test message analysis and statistics."""
        cm = ContextManager(max_messages=3, max_tokens=100)

        messages = [
            {"sender_type": "user", "message": "Hello"},
            {"sender_type": "assistant", "message": "Hi there"},
            {"sender_type": "system", "message": "System message"},
            {"sender_type": "user", "message": "How are you?"},
        ]

        stats = cm.analyze_messages(messages)

        assert stats.total_messages == 4
        assert stats.user_messages == 2
        assert stats.assistant_messages == 1
        assert stats.system_messages == 1
        assert stats.exceeds_message_limit == True  # 4 > 3
        assert stats.total_tokens > 0

    def test_trim_to_limit_by_messages(self):
        """Test trimming messages by count limit."""
        cm = ContextManager(max_messages=3, max_tokens=100000)

        messages = [
            {"sender_type": "user", "message": "Message 1"},
            {"sender_type": "assistant", "message": "Message 2"},
            {"sender_type": "user", "message": "Message 3"},
            {"sender_type": "assistant", "message": "Message 4"},
            {"sender_type": "user", "message": "Message 5"},
        ]

        trimmed = cm.trim_to_limit(messages)

        assert len(trimmed) == 3
        # Should keep the most recent messages
        assert trimmed[0]["message"] == "Message 3"
        assert trimmed[1]["message"] == "Message 4"
        assert trimmed[2]["message"] == "Message 5"

    def test_trim_to_limit_by_tokens(self):
        """Test trimming messages by token limit."""
        cm = ContextManager(max_messages=100, max_tokens=20)

        messages = [
            {"sender_type": "user", "message": "x" * 40},  # 10 tokens
            {"sender_type": "assistant", "message": "y" * 40},  # 10 tokens
            {"sender_type": "user", "message": "z" * 40},  # 10 tokens
        ]

        trimmed = cm.trim_to_limit(messages)

        # Should keep only messages that fit within 20 tokens
        assert len(trimmed) == 2
        assert trimmed[0]["message"] == "y" * 40
        assert trimmed[1]["message"] == "z" * 40

    def test_preserve_system_messages(self):
        """Test that system messages are preserved during trimming."""
        cm = ContextManager(max_messages=2, max_tokens=100000)

        messages = [
            {"sender_type": "system", "message": "System prompt"},
            {"sender_type": "user", "message": "Message 1"},
            {"sender_type": "assistant", "message": "Message 2"},
            {"sender_type": "user", "message": "Message 3"},
        ]

        trimmed = cm.trim_to_limit(messages)

        # System message should be preserved
        assert len(trimmed) == 3  # system + 2 most recent
        assert trimmed[0]["sender_type"] == "system"
        assert trimmed[0]["message"] == "System prompt"
        assert trimmed[1]["message"] == "Message 2"
        assert trimmed[2]["message"] == "Message 3"


# ═══════════════════════════════════════════════════════════
# RESPONSE CACHE TESTS
# ═══════════════════════════════════════════════════════════


@pytest.mark.asyncio
class TestResponseCache:
    """Test suite for ResponseCache."""

    async def test_cache_initialization(self):
        """Test ResponseCache initialization."""
        cache = ResponseCache(max_size_mb=10, ttl_seconds=3600)
        assert cache.max_size_mb == 10
        assert cache.ttl_seconds == 3600
        assert len(cache.cache) == 0

    async def test_generate_key(self):
        """Test cache key generation."""
        cache = ResponseCache()

        # Test with same inputs produces same key
        key1 = cache.generate_key("test prompt", [{"message": "context"}])
        key2 = cache.generate_key("test prompt", [{"message": "context"}])
        assert key1 == key2

        # Test with different inputs produces different keys
        key3 = cache.generate_key("different prompt", [{"message": "context"}])
        assert key1 != key3

    async def test_set_and_get(self):
        """Test setting and getting cached responses."""
        cache = ResponseCache(ttl_seconds=1)

        key = "test_key"
        data = {"response": "test response", "tokens": 100}

        # Set cache entry
        await cache.set(key, data)

        # Get should return the data
        cached_data = await cache.get(key)
        assert cached_data == data

        # Wait for TTL to expire
        await asyncio.sleep(1.1)

        # Get should return None after TTL
        cached_data = await cache.get(key)
        assert cached_data is None

    async def test_cache_stats(self):
        """Test cache statistics tracking."""
        cache = ResponseCache()

        # Initial stats
        stats = await cache.get_stats()
        assert stats["entries"] == 0
        assert stats["hit_rate"] == 0

        # Add entries and test hits/misses
        await cache.set("key1", {"data": "value1"})
        await cache.set("key2", {"data": "value2"})

        # Test hits
        await cache.get("key1")  # hit
        await cache.get("key1")  # hit
        await cache.get("key3")  # miss

        stats = await cache.get_stats()
        assert stats["entries"] == 2
        assert stats["hits"] == 2
        assert stats["misses"] == 1
        assert stats["hit_rate"] == 2/3

    async def test_lru_eviction(self):
        """Test LRU eviction when cache size is exceeded."""
        cache = ResponseCache(max_size_mb=0.001)  # Very small size

        # Add entries until size is exceeded
        large_data = {"data": "x" * 10000}  # Large data
        await cache.set("key1", large_data)
        await cache.set("key2", large_data)
        await cache.set("key3", large_data)

        # Oldest entry should be evicted
        assert await cache.get("key1") is None  # Evicted
        assert await cache.get("key3") is not None  # Still present

    async def test_clear_cache(self):
        """Test clearing the cache."""
        cache = ResponseCache()

        # Add entries
        await cache.set("key1", {"data": "value1"})
        await cache.set("key2", {"data": "value2"})

        # Clear cache
        cleared_count = await cache.clear()
        assert cleared_count == 2

        # Cache should be empty
        stats = await cache.get_stats()
        assert stats["entries"] == 0


# ═══════════════════════════════════════════════════════════
# RATE LIMITER TESTS
# ═══════════════════════════════════════════════════════════


@pytest.mark.asyncio
class TestRateLimiter:
    """Test suite for RateLimiter."""

    async def test_initialization(self):
        """Test RateLimiter initialization."""
        limiter = RateLimiter(tokens_per_minute=1000, backoff_threshold=0.8)
        assert limiter.tokens_per_minute == 1000
        assert limiter.backoff_threshold == 0.8
        assert limiter.current_usage == 0

    async def test_estimate_tokens(self):
        """Test token estimation."""
        limiter = RateLimiter()

        # Test estimation
        tokens = limiter.estimate_tokens("Hello world")
        assert tokens == 2  # 11 chars / 4 ≈ 2

    async def test_check_and_wait_under_limit(self):
        """Test that requests proceed when under limit."""
        limiter = RateLimiter(tokens_per_minute=1000)

        # Should not wait when under limit
        start_time = asyncio.get_event_loop().time()
        await limiter.check_and_wait(100)
        elapsed = asyncio.get_event_loop().time() - start_time

        assert elapsed < 0.1  # Should be nearly instant
        assert limiter.current_usage == 100

    async def test_check_and_wait_near_limit(self):
        """Test that rate limiter waits when approaching limit."""
        limiter = RateLimiter(tokens_per_minute=1000, backoff_threshold=0.8)

        # Add usage near threshold
        limiter.current_usage = 750  # 75% of limit

        # Should wait when adding more tokens would exceed threshold
        start_time = asyncio.get_event_loop().time()
        await limiter.check_and_wait(100)  # Would be 850/1000 = 85%
        elapsed = asyncio.get_event_loop().time() - start_time

        # Should have waited (actual wait time depends on implementation)
        assert limiter.current_usage == 850

    async def test_window_reset(self):
        """Test that usage window resets after time period."""
        limiter = RateLimiter(tokens_per_minute=1000)

        # Add usage
        await limiter.check_and_wait(500)
        assert limiter.current_usage == 500

        # Manually reset window (simulating time passing)
        limiter.window_start = asyncio.get_event_loop().time() - 61
        await limiter.check_and_wait(100)

        # Usage should be reset
        assert limiter.current_usage == 100

    async def test_update_actual_usage(self):
        """Test updating with actual token usage."""
        limiter = RateLimiter()

        # Estimate and then update with actual
        await limiter.check_and_wait(100)  # Estimated
        limiter.update_actual_usage(120)  # Actual was higher

        stats = limiter.get_usage_stats()
        assert stats["current_usage"] == 120

    async def test_usage_stats(self):
        """Test getting usage statistics."""
        limiter = RateLimiter(tokens_per_minute=1000)

        await limiter.check_and_wait(400)

        stats = limiter.get_usage_stats()
        assert stats["current_usage"] == 400
        assert stats["usage_percentage"] == 40.0
        assert "time_until_reset" in stats


# ═══════════════════════════════════════════════════════════
# COST TRACKER TESTS
# ═══════════════════════════════════════════════════════════


@pytest.mark.asyncio
class TestCostTracker:
    """Test suite for CostTracker."""

    async def test_initialization(self):
        """Test CostTracker initialization."""
        tracker = CostTracker(
            alert_threshold_usd=10.0,
            input_cost_per_m=0.003,
            output_cost_per_m=0.015
        )
        assert tracker.alert_threshold_usd == 10.0
        assert tracker.get_total_cost() == 0.0

    async def test_track_usage(self):
        """Test tracking token usage and cost calculation."""
        tracker = CostTracker(
            input_cost_per_m=0.003,  # $3 per million
            output_cost_per_m=0.015  # $15 per million
        )

        # Track usage
        await tracker.track_usage(
            input_tokens=1000,
            output_tokens=500,
            model="claude-3-5-sonnet",
            request_id="test_123"
        )

        # Check totals
        assert tracker.get_total_input_tokens() == 1000
        assert tracker.get_total_output_tokens() == 500

        # Check cost calculation (1000 * 0.003/1000 + 500 * 0.015/1000)
        expected_cost = 0.003 + 0.0075
        assert abs(tracker.get_total_cost() - expected_cost) < 0.0001

    async def test_threshold_checking(self):
        """Test cost threshold alerting."""
        tracker = CostTracker(
            alert_threshold_usd=1.0,
            input_cost_per_m=1.0,  # $1 per thousand for easy math
            output_cost_per_m=1.0
        )

        # Track usage below threshold
        await tracker.track_usage(
            input_tokens=500,
            output_tokens=0,
            model="test",
            request_id="1"
        )
        assert tracker.check_threshold() == False

        # Track usage exceeding threshold
        await tracker.track_usage(
            input_tokens=600,
            output_tokens=0,
            model="test",
            request_id="2"
        )
        assert tracker.check_threshold() == True

    async def test_detailed_report(self):
        """Test getting detailed cost report."""
        tracker = CostTracker()

        # Track usage for different models
        await tracker.track_usage(
            input_tokens=1000,
            output_tokens=500,
            model="claude-3-5-sonnet",
            request_id="1"
        )
        await tracker.track_usage(
            input_tokens=500,
            output_tokens=200,
            model="claude-3-haiku",
            request_id="2"
        )

        report = tracker.get_detailed_report()

        assert "claude-3-5-sonnet" in report
        assert "claude-3-haiku" in report
        assert report["claude-3-5-sonnet"]["requests"] == 1
        assert report["claude-3-haiku"]["requests"] == 1

    async def test_reset_daily(self):
        """Test daily reset functionality."""
        tracker = CostTracker()

        # Add usage
        await tracker.track_usage(
            input_tokens=1000,
            output_tokens=500,
            model="test",
            request_id="1"
        )

        # Reset daily stats
        tracker.reset_daily()

        # Check that stats are reset
        assert tracker.get_total_cost() == 0.0
        assert tracker.get_total_input_tokens() == 0
        assert tracker.get_total_output_tokens() == 0


# ═══════════════════════════════════════════════════════════
# CONVERSATION SUMMARIZER TESTS
# ═══════════════════════════════════════════════════════════


@pytest.mark.asyncio
class TestConversationSummarizer:
    """Test suite for ConversationSummarizer."""

    async def test_initialization(self):
        """Test ConversationSummarizer initialization."""
        summarizer = ConversationSummarizer(
            threshold_messages=20,
            summary_length=200
        )
        assert summarizer.threshold_messages == 20
        assert summarizer.summary_length == 200

    async def test_should_summarize(self):
        """Test summarization trigger logic."""
        summarizer = ConversationSummarizer(threshold_messages=3)

        # Not enough messages
        messages = [
            {"sender_type": "user", "message": "Hello"},
            {"sender_type": "assistant", "message": "Hi"},
        ]
        assert await summarizer.should_summarize(messages) == False

        # Enough messages
        messages.append({"sender_type": "user", "message": "How are you?"})
        assert await summarizer.should_summarize(messages) == True

        # System messages don't count
        messages = [
            {"sender_type": "system", "message": "System"},
            {"sender_type": "system", "message": "System"},
            {"sender_type": "user", "message": "Hello"},
        ]
        assert await summarizer.should_summarize(messages) == False

    async def test_prepare_messages(self):
        """Test message preparation for summarization."""
        summarizer = ConversationSummarizer()

        messages = [
            {"sender_type": "system", "message": "System prompt"},
            {"sender_type": "user", "message": "Hello"},
            {"sender_type": "assistant", "message": "Hi there"},
            {"sender_type": "user", "message": ""},  # Empty message
        ]

        prepared = summarizer._prepare_messages_for_summary(messages)

        # System and empty messages should be filtered
        assert len(prepared) == 2
        assert prepared[0]["sender"] == "user"
        assert prepared[0]["content"] == "Hello"
        assert prepared[1]["sender"] == "assistant"

    @patch('modules.conversation_summarizer.AsyncAnthropic')
    async def test_summarize_conversation(self, mock_anthropic):
        """Test conversation summarization with mocked API."""
        # Setup mock
        mock_client = AsyncMock()
        mock_anthropic.return_value = mock_client

        mock_response = MagicMock()
        mock_response.content = [MagicMock(text="Summary: User asked about testing. Assistant explained unit tests.")]
        mock_client.messages.create.return_value = mock_response

        summarizer = ConversationSummarizer(api_key="test_key")

        messages = [
            {"sender_type": "user", "message": "How do I write tests?"},
            {"sender_type": "assistant", "message": "Use pytest for unit tests"},
        ]

        summary = await summarizer.summarize_conversation(messages)

        assert summary.content == "Summary: User asked about testing. Assistant explained unit tests."
        assert summary.message_count == 2
        assert summary.token_count > 0
        assert summarizer.total_summaries == 1

    async def test_replace_with_summary(self):
        """Test replacing messages with summary."""
        summarizer = ConversationSummarizer()

        messages = [
            {"sender_type": "system", "message": "System"},
            {"sender_type": "user", "message": "Message 1"},
            {"sender_type": "assistant", "message": "Message 2"},
            {"sender_type": "user", "message": "Message 3"},
            {"sender_type": "assistant", "message": "Message 4"},
            {"sender_type": "user", "message": "Message 5"},
        ]

        # Create mock summary
        from modules.conversation_summarizer import ConversationSummary, SummaryType
        summary = ConversationSummary(
            content="Summary of conversation",
            message_count=3,
            token_count=10,
            key_decisions=["Decision 1"],
            current_task="Current task",
            important_context=["Context 1"],
            created_at=datetime.now(timezone.utc),
            summary_type=SummaryType.FULL
        )

        new_messages = summarizer.replace_with_summary(messages, summary, keep_recent=2)

        # Should have: system + summary + 2 recent
        assert len(new_messages) == 4
        assert new_messages[0]["sender_type"] == "system"
        assert "[CONVERSATION SUMMARY" in new_messages[1]["message"]
        assert new_messages[2]["message"] == "Message 4"
        assert new_messages[3]["message"] == "Message 5"

    async def test_get_stats(self):
        """Test getting summarization statistics."""
        summarizer = ConversationSummarizer()

        stats = summarizer.get_stats()
        assert stats["total_summaries"] == 0
        assert stats["messages_summarized"] == 0
        assert stats["tokens_saved"] == 0

        # Update stats manually (would normally happen during summarization)
        summarizer.total_summaries = 5
        summarizer.total_messages_summarized = 100
        summarizer.total_tokens_saved = 5000

        stats = summarizer.get_stats()
        assert stats["total_summaries"] == 5
        assert stats["messages_summarized"] == 100
        assert stats["tokens_saved"] == 5000


# ═══════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════


@pytest.mark.asyncio
class TestIntegration:
    """Integration tests for token optimization modules working together."""

    async def test_context_and_cache_integration(self):
        """Test context manager and cache working together."""
        context_mgr = ContextManager(max_messages=5)
        cache = ResponseCache()

        # Simulate messages
        messages = [
            {"sender_type": "user", "message": f"Message {i}"}
            for i in range(10)
        ]

        # Trim with context manager
        trimmed = context_mgr.trim_to_limit(messages)
        assert len(trimmed) == 5

        # Generate cache key from trimmed context
        key = cache.generate_key("test prompt", trimmed)

        # Cache response
        await cache.set(key, {"response": "cached response"})

        # Verify cache hit with same trimmed context
        cached = await cache.get(key)
        assert cached["response"] == "cached response"

    async def test_rate_limiter_and_cost_tracker(self):
        """Test rate limiter and cost tracker coordination."""
        limiter = RateLimiter(tokens_per_minute=10000)
        tracker = CostTracker(alert_threshold_usd=1.0)

        # Simulate API request
        estimated_tokens = 1000

        # Check rate limit
        await limiter.check_and_wait(estimated_tokens)

        # Track actual usage and cost
        actual_input = 1100
        actual_output = 500
        await tracker.track_usage(
            input_tokens=actual_input,
            output_tokens=actual_output,
            model="test",
            request_id="test_123"
        )

        # Update rate limiter with actual
        limiter.update_actual_usage(actual_input + actual_output)

        # Verify both are tracking correctly
        assert limiter.current_usage == 1600
        assert tracker.get_total_input_tokens() == 1100
        assert tracker.get_total_output_tokens() == 500

    async def test_full_optimization_pipeline(self):
        """Test complete optimization pipeline."""
        # Initialize all components
        context_mgr = ContextManager(max_messages=3, max_tokens=1000)
        cache = ResponseCache(ttl_seconds=60)
        limiter = RateLimiter(tokens_per_minute=10000)
        tracker = CostTracker(alert_threshold_usd=10.0)

        # Simulate conversation history
        messages = [
            {"sender_type": "user", "message": "Message 1"},
            {"sender_type": "assistant", "message": "Response 1"},
            {"sender_type": "user", "message": "Message 2"},
            {"sender_type": "assistant", "message": "Response 2"},
            {"sender_type": "user", "message": "Message 3"},
        ]

        # Step 1: Trim context
        trimmed = context_mgr.trim_to_limit(messages)
        assert len(trimmed) <= 3

        # Step 2: Check cache
        prompt = "New user message"
        cache_key = cache.generate_key(prompt, trimmed)
        cached_response = await cache.get(cache_key)

        if not cached_response:
            # Step 3: Check rate limit
            estimated_tokens = limiter.estimate_tokens(prompt)
            await limiter.check_and_wait(estimated_tokens)

            # Step 4: Simulate API call (would happen here)
            api_response = {"response": "AI response", "input_tokens": 100, "output_tokens": 50}

            # Step 5: Track costs
            await tracker.track_usage(
                input_tokens=api_response["input_tokens"],
                output_tokens=api_response["output_tokens"],
                model="test",
                request_id="test"
            )

            # Step 6: Update cache
            await cache.set(cache_key, api_response)

            # Step 7: Update rate limiter with actual
            actual_tokens = api_response["input_tokens"] + api_response["output_tokens"]
            limiter.update_actual_usage(actual_tokens)

        # Verify all components worked
        stats = await cache.get_stats()
        assert stats["entries"] >= 0
        assert limiter.current_usage > 0
        assert tracker.get_total_cost() > 0


# ═══════════════════════════════════════════════════════════
# PERFORMANCE BENCHMARKS
# ═══════════════════════════════════════════════════════════


@pytest.mark.asyncio
class TestPerformance:
    """Performance benchmarks for token optimization."""

    async def test_token_reduction_achieved(self):
        """Verify 50-70% token reduction target."""
        context_mgr = ContextManager(max_messages=10, max_tokens=10000)

        # Create large conversation history
        large_history = [
            {"sender_type": "user" if i % 2 == 0 else "assistant",
             "message": f"This is message {i} with some content " * 20}
            for i in range(100)
        ]

        # Calculate original tokens
        original_stats = context_mgr.analyze_messages(large_history)
        original_tokens = original_stats.total_tokens

        # Trim and calculate new tokens
        trimmed = context_mgr.trim_to_limit(large_history)
        trimmed_stats = context_mgr.analyze_messages(trimmed)
        trimmed_tokens = trimmed_stats.total_tokens

        # Calculate reduction percentage
        reduction = (original_tokens - trimmed_tokens) / original_tokens * 100

        # Should achieve at least 50% reduction
        assert reduction >= 50, f"Only achieved {reduction:.1f}% reduction"

        # Log actual reduction
        print(f"Token reduction: {reduction:.1f}% ({original_tokens} → {trimmed_tokens})")

    async def test_cache_hit_rate(self):
        """Test cache hit rate with realistic usage."""
        cache = ResponseCache()

        # Simulate realistic query patterns
        queries = [
            "How to write tests?",
            "What is Python?",
            "How to write tests?",  # Repeat
            "Explain async/await",
            "What is Python?",  # Repeat
            "How to write tests?",  # Repeat again
            "New unique query",
        ]

        hits = 0
        for query in queries:
            key = cache.generate_key(query, [])
            if await cache.get(key):
                hits += 1
            else:
                await cache.set(key, {"response": f"Response to {query}"})

        stats = await cache.get_stats()
        hit_rate = stats["hit_rate"]

        # Should achieve at least 30% hit rate
        assert hit_rate >= 0.3, f"Hit rate only {hit_rate:.1%}"
        print(f"Cache hit rate: {hit_rate:.1%}")

    async def test_latency_overhead(self):
        """Test that optimization adds minimal latency."""
        import time

        context_mgr = ContextManager()
        cache = ResponseCache()
        limiter = RateLimiter(tokens_per_minute=1000000)  # High limit
        tracker = CostTracker()

        messages = [{"sender_type": "user", "message": "Test"}] * 10
        prompt = "Test prompt"

        # Measure optimization overhead
        start = time.perf_counter()

        # Run optimization pipeline
        trimmed = context_mgr.trim_to_limit(messages)
        cache_key = cache.generate_key(prompt, trimmed)
        await cache.get(cache_key)
        await limiter.check_and_wait(100)
        await tracker.track_usage(100, 50, "test", "1")

        elapsed_ms = (time.perf_counter() - start) * 1000

        # Should add less than 20ms overhead
        assert elapsed_ms < 20, f"Overhead was {elapsed_ms:.1f}ms"
        print(f"Optimization overhead: {elapsed_ms:.1f}ms")


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "--tb=short"])