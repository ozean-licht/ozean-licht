#!/usr/bin/env python3
"""
Context Manager Module

Implements intelligent context window management with rolling buffer to prevent
unbounded context growth that leads to token limit issues.

Features:
- Rolling FIFO message buffer
- Dual-mode windowing (by message count OR token count)
- Token-aware trimming
- Preserves system messages and recent context
- Thread-safe operations

Usage:
    context_mgr = ContextManager(
        max_messages=50,
        max_tokens=50000
    )

    # Trim chat history to limits
    trimmed_messages = context_mgr.trim_to_limit(messages)

    # Check if limits are exceeded
    stats = context_mgr.analyze_messages(messages)
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum


class MessageType(Enum):
    """Types of messages in chat history"""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


@dataclass
class MessageStats:
    """Statistics about a set of messages"""
    total_messages: int
    total_tokens: int
    user_messages: int
    assistant_messages: int
    system_messages: int
    exceeds_message_limit: bool
    exceeds_token_limit: bool


class ContextManager:
    """
    Context window manager with intelligent message trimming.

    Implements rolling buffer to keep context within reasonable limits while
    preserving important messages (system prompts, recent context).
    """

    def __init__(
        self,
        max_messages: int = 50,
        max_tokens: int = 50000,
        preserve_system_messages: bool = True,
        logger: Optional["OrchestratorLogger"] = None,
        mode: str = "balanced"
    ):
        """
        Initialize context manager.

        Args:
            max_messages: Maximum number of messages to keep in context
            max_tokens: Maximum tokens to keep in context
            preserve_system_messages: Always keep system messages (recommended)
            logger: Optional logger instance for debugging
            mode: Trimming mode - "balanced", "token_priority", or "message_priority"
        """
        self.max_messages = max_messages
        self.max_tokens = max_tokens
        self.preserve_system_messages = preserve_system_messages
        self.logger = logger
        self.mode = mode  # "token_priority" for aggressive token reduction

        if self.logger:
            self.logger.info(
                f"ContextManager initialized: max_messages={max_messages}, "
                f"max_tokens={max_tokens:,}, preserve_system={preserve_system_messages}, "
                f"mode={mode}"
            )

    def estimate_tokens(self, text: str) -> int:
        """
        Estimate token count from text.

        Uses simple heuristic: ~4 characters per token.

        Args:
            text: Input text to estimate

        Returns:
            Estimated token count
        """
        if not text:
            return 0
        return max(1, len(text) // 4)

    def analyze_messages(self, messages: List[Dict[str, Any]]) -> MessageStats:
        """
        Analyze messages and return statistics.

        Args:
            messages: List of message dicts with 'message' and 'sender_type' keys

        Returns:
            MessageStats with counts and token estimates
        """
        total_tokens = 0
        user_count = 0
        assistant_count = 0
        system_count = 0

        for msg in messages:
            text = msg.get("message", "")
            sender = msg.get("sender_type", "")

            total_tokens += self.estimate_tokens(text)

            if sender == "user":
                user_count += 1
            elif sender == "orchestrator":
                assistant_count += 1
            elif sender == "system":
                system_count += 1

        return MessageStats(
            total_messages=len(messages),
            total_tokens=total_tokens,
            user_messages=user_count,
            assistant_messages=assistant_count,
            system_messages=system_count,
            exceeds_message_limit=len(messages) > self.max_messages,
            exceeds_token_limit=total_tokens > self.max_tokens
        )

    def trim_to_limit(
        self,
        messages: List[Dict[str, Any]],
        mode: str = "auto"
    ) -> List[Dict[str, Any]]:
        """
        Trim messages to stay within configured limits.

        Implements rolling FIFO buffer:
        1. Always preserve system messages (if enabled)
        2. Keep most recent messages that fit within limits
        3. Remove oldest messages first

        Args:
            messages: List of message dicts to trim
            mode: Trimming mode - "auto", "message_count", or "token_count"

        Returns:
            Trimmed list of messages
        """
        if not messages:
            return []

        # Analyze current state
        stats = self.analyze_messages(messages)

        # Check if trimming is needed
        needs_trim = False
        if mode == "auto":
            needs_trim = stats.exceeds_message_limit or stats.exceeds_token_limit
        elif mode == "message_count":
            needs_trim = stats.exceeds_message_limit
        elif mode == "token_count":
            needs_trim = stats.exceeds_token_limit

        if not needs_trim:
            if self.logger:
                self.logger.debug(
                    f"Context within limits: {stats.total_messages} messages, "
                    f"{stats.total_tokens:,} tokens"
                )
            return messages

        # Log trimming action
        if self.logger:
            self.logger.warning(
                f"⚠️  Context exceeds limits: {stats.total_messages} messages "
                f"({stats.total_tokens:,} tokens). Trimming to fit..."
            )

        # Separate system messages if preserving
        system_messages = []
        non_system_messages = []

        for msg in messages:
            if self.preserve_system_messages and msg.get("sender_type") == "system":
                system_messages.append(msg)
            else:
                non_system_messages.append(msg)

        # Trim non-system messages using rolling buffer (keep most recent)
        trimmed = self._trim_by_limits(non_system_messages)

        # Recombine: system messages + trimmed recent messages
        result = system_messages + trimmed

        # Log results
        if self.logger:
            final_stats = self.analyze_messages(result)
            self.logger.info(
                f"✅ Context trimmed: {stats.total_messages} → {final_stats.total_messages} messages, "
                f"{stats.total_tokens:,} → {final_stats.total_tokens:,} tokens"
            )

        return result

    def _trim_by_limits(self, messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Trim messages to fit within both message and token limits.

        Keeps most recent messages that fit within BOTH limits.
        In "token_priority" mode, aggressively prioritizes token reduction.

        Args:
            messages: Messages to trim (excluding system messages)

        Returns:
            Trimmed messages list
        """
        if not messages:
            return []

        # In token_priority mode, be MORE aggressive with limits
        effective_max_messages = self.max_messages
        effective_max_tokens = self.max_tokens

        if self.mode == "token_priority":
            # Reduce limits by 20% for extra safety margin
            effective_max_messages = int(self.max_messages * 0.8)
            effective_max_tokens = int(self.max_tokens * 0.8)

            if self.logger:
                self.logger.debug(
                    f"Token priority mode: Using reduced limits - "
                    f"{effective_max_messages} msgs, {effective_max_tokens:,} tokens"
                )

        # Start from the end (most recent) and work backwards
        result = []
        total_tokens = 0

        for msg in reversed(messages):
            msg_text = msg.get("message", "")
            msg_tokens = self.estimate_tokens(msg_text)

            # Check if adding this message would exceed limits
            would_exceed_messages = len(result) >= effective_max_messages
            would_exceed_tokens = (total_tokens + msg_tokens) > effective_max_tokens

            if would_exceed_messages or would_exceed_tokens:
                break

            result.append(msg)
            total_tokens += msg_tokens

        # Reverse back to chronological order
        return list(reversed(result))

    def get_stats(self) -> Dict[str, Any]:
        """
        Get current configuration and statistics.

        Returns:
            Dict with configuration settings
        """
        return {
            "max_messages": self.max_messages,
            "max_tokens": self.max_tokens,
            "preserve_system_messages": self.preserve_system_messages
        }
