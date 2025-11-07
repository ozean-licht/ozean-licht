#!/usr/bin/env python3
"""
Token Rate Limiter Module

Implements per-minute token tracking with proactive rate limiting to prevent
API limit errors. Uses sliding window approach for accurate rate limiting.

Features:
- Per-minute token window tracking
- Proactive backoff when approaching limits
- Token estimation (4 chars ≈ 1 token)
- Usage statistics and monitoring
- Thread-safe async operations

Usage:
    rate_limiter = TokenRateLimiter(max_tokens_per_minute=400000)

    # Before making API call
    await rate_limiter.check_and_wait(estimated_tokens=5000)

    # After API call
    rate_limiter.record_usage(actual_tokens=4850)
"""

import asyncio
import time
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
from collections import deque


@dataclass
class TokenUsageRecord:
    """Record of token usage at a specific timestamp"""
    timestamp: float
    tokens: int
    context: str = ""


class TokenRateLimiter:
    """
    Token rate limiter with sliding window tracking.

    Prevents API rate limit errors by proactively limiting token usage per minute.
    Uses a sliding window to track usage over the last 60 seconds.
    """

    def __init__(
        self,
        max_tokens_per_minute: int = 400000,
        backoff_threshold: float = 0.8,
        logger: Optional["OrchestratorLogger"] = None
    ):
        """
        Initialize token rate limiter.

        Args:
            max_tokens_per_minute: Maximum tokens allowed per minute (default: 400k, 40% of 1M limit)
            backoff_threshold: Trigger backoff when usage exceeds this ratio (0.8 = 80%)
            logger: Optional logger instance for debugging
        """
        self.max_tokens_per_minute = max_tokens_per_minute
        self.backoff_threshold = backoff_threshold
        self.logger = logger

        # Sliding window of usage records
        self._usage_window: deque[TokenUsageRecord] = deque()
        self._lock = asyncio.Lock()

        # Statistics
        self._total_tokens_used = 0
        self._total_requests = 0
        self._backoff_events = 0

        if self.logger:
            self.logger.info(
                f"TokenRateLimiter initialized: {max_tokens_per_minute:,} tokens/min, "
                f"backoff at {int(backoff_threshold * 100)}%"
            )

    def estimate_tokens(self, text: str) -> int:
        """
        Estimate token count from text.

        Uses simple heuristic: ~4 characters per token (conservative estimate).

        Args:
            text: Input text to estimate

        Returns:
            Estimated token count
        """
        if not text:
            return 0

        # Conservative estimate: 1 token per 4 characters
        # This accounts for average word length + spaces
        return max(1, len(text) // 4)

    async def check_and_wait(
        self,
        estimated_tokens: int,
        context: str = ""
    ) -> Dict[str, any]:
        """
        Check if request can proceed or needs to wait for rate limit.

        Implements proactive backoff when approaching limit. Will sleep if necessary
        to stay within rate limits.

        Args:
            estimated_tokens: Estimated tokens for this request
            context: Optional context string for debugging

        Returns:
            Dict with status information:
            - waited: bool - Whether backoff was triggered
            - wait_seconds: float - How long we waited
            - current_usage: int - Current tokens used in window
            - usage_percent: float - Percentage of limit used
        """
        async with self._lock:
            # Clean old records outside the 60-second window
            self._clean_old_records()

            # Calculate current usage
            current_usage = self._calculate_current_usage()
            projected_usage = current_usage + estimated_tokens
            usage_percent = projected_usage / self.max_tokens_per_minute

            wait_seconds = 0.0
            waited = False

            # Check if we need to wait
            if usage_percent >= self.backoff_threshold:
                # Calculate wait time needed
                # Find oldest record's age and wait until it expires
                if self._usage_window:
                    oldest_timestamp = self._usage_window[0].timestamp
                    age = time.time() - oldest_timestamp
                    wait_seconds = max(0.0, 60.0 - age + 1.0)  # +1s buffer

                    if wait_seconds > 0:
                        waited = True
                        self._backoff_events += 1

                        if self.logger:
                            self.logger.warning(
                                f"⏱️  Rate limit backoff triggered: {current_usage:,}/{self.max_tokens_per_minute:,} tokens "
                                f"({usage_percent:.1%}). Waiting {wait_seconds:.1f}s... {context}"
                            )

        # Sleep outside the lock to allow other operations
        if waited:
            await asyncio.sleep(wait_seconds)

            if self.logger:
                self.logger.info(f"✅ Rate limit backoff complete, proceeding with request")

        return {
            "waited": waited,
            "wait_seconds": wait_seconds,
            "current_usage": current_usage,
            "usage_percent": usage_percent
        }

    def record_usage(self, tokens: int, context: str = "") -> None:
        """
        Record actual token usage after API call.

        Args:
            tokens: Actual tokens used in the request
            context: Optional context string for debugging
        """
        if tokens <= 0:
            return

        record = TokenUsageRecord(
            timestamp=time.time(),
            tokens=tokens,
            context=context
        )

        self._usage_window.append(record)
        self._total_tokens_used += tokens
        self._total_requests += 1

        if self.logger:
            current_usage = self._calculate_current_usage()
            usage_percent = current_usage / self.max_tokens_per_minute
            self.logger.debug(
                f"📊 Token usage recorded: +{tokens:,} tokens. "
                f"Current window: {current_usage:,}/{self.max_tokens_per_minute:,} "
                f"({usage_percent:.1%}) {context}"
            )

    def _clean_old_records(self) -> None:
        """Remove records older than 60 seconds from the sliding window."""
        cutoff_time = time.time() - 60.0

        while self._usage_window and self._usage_window[0].timestamp < cutoff_time:
            self._usage_window.popleft()

    def _calculate_current_usage(self) -> int:
        """Calculate total tokens used in current 60-second window."""
        return sum(record.tokens for record in self._usage_window)

    def get_stats(self) -> Dict[str, any]:
        """
        Get current rate limiter statistics.

        Returns:
            Dict with statistics:
            - current_usage: Tokens used in current window
            - max_tokens_per_minute: Rate limit threshold
            - usage_percent: Percentage of limit used
            - total_tokens_used: Lifetime token usage
            - total_requests: Lifetime request count
            - backoff_events: Number of times backoff was triggered
            - window_size: Number of records in current window
        """
        self._clean_old_records()
        current_usage = self._calculate_current_usage()

        return {
            "current_usage": current_usage,
            "max_tokens_per_minute": self.max_tokens_per_minute,
            "usage_percent": current_usage / self.max_tokens_per_minute,
            "total_tokens_used": self._total_tokens_used,
            "total_requests": self._total_requests,
            "backoff_events": self._backoff_events,
            "window_size": len(self._usage_window)
        }

    def reset(self) -> None:
        """Reset all statistics and clear usage window."""
        self._usage_window.clear()
        self._total_tokens_used = 0
        self._total_requests = 0
        self._backoff_events = 0

        if self.logger:
            self.logger.info("TokenRateLimiter statistics reset")
