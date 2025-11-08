#!/usr/bin/env python3
"""
Conversation Summarizer Module

Implements intelligent conversation summarization using Claude Haiku to compress
long chat histories while maintaining context continuity.

Features:
- Automatic triggering after N messages
- Summarizes conversations into concise 200-word summaries
- Extracts key decisions, task status, and important context
- Replaces old messages with summaries to reduce token count
- Asynchronous summarization with minimal latency

Usage:
    summarizer = ConversationSummarizer(
        threshold_messages=20,
        summary_length=200
    )

    if await summarizer.should_summarize(messages):
        summary = await summarizer.summarize_conversation(messages)
        messages = summarizer.replace_with_summary(messages, summary)
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timezone
import asyncio
import json
from dataclasses import dataclass
from enum import Enum

# Import Claude SDK for Haiku summarization
from anthropic import AsyncAnthropic


class SummaryType(Enum):
    """Types of summaries that can be generated"""
    FULL = "full"  # Complete conversation summary
    PARTIAL = "partial"  # Summary of recent segment
    INCREMENTAL = "incremental"  # Update to existing summary


@dataclass
class ConversationSummary:
    """Container for conversation summary data"""
    content: str
    message_count: int
    token_count: int
    key_decisions: List[str]
    current_task: Optional[str]
    important_context: List[str]
    created_at: datetime
    summary_type: SummaryType


class ConversationSummarizer:
    """
    Manages intelligent conversation summarization to reduce token usage.

    Periodically summarizes chat history to maintain context while drastically
    reducing token count in long conversations.
    """

    def __init__(
        self,
        threshold_messages: int = 20,
        summary_length: int = 200,
        model: str = "claude-3-haiku-20240307",
        api_key: Optional[str] = None
    ):
        """
        Initialize conversation summarizer.

        Args:
            threshold_messages: Number of messages before triggering summarization
            summary_length: Target word count for summaries
            model: Claude model to use (Haiku recommended for speed/cost)
            api_key: Anthropic API key (reads from env if not provided)
        """
        self.threshold_messages = threshold_messages
        self.summary_length = summary_length
        self.model = model
        self.client = AsyncAnthropic(api_key=api_key) if api_key else AsyncAnthropic()

        # Track summarization stats
        self.total_summaries = 0
        self.total_messages_summarized = 0
        self.total_tokens_saved = 0
        self.last_summary: Optional[ConversationSummary] = None

    async def should_summarize(self, messages: List[Dict[str, Any]]) -> bool:
        """
        Check if conversation should be summarized.

        Args:
            messages: List of chat messages

        Returns:
            True if summarization should trigger
        """
        if not messages:
            return False

        # Count non-system messages
        user_assistant_messages = [
            msg for msg in messages
            if msg.get("sender_type") in ["user", "assistant", "orchestrator"]
        ]

        # Trigger if we have enough messages
        return len(user_assistant_messages) >= self.threshold_messages

    def estimate_tokens(self, text: str) -> int:
        """
        Estimate token count for text.

        Args:
            text: Text to estimate

        Returns:
            Estimated token count (rough: 1 token ≈ 4 characters)
        """
        return len(text) // 4

    async def summarize_conversation(
        self,
        messages: List[Dict[str, Any]],
        focus_recent: bool = True
    ) -> ConversationSummary:
        """
        Generate intelligent summary of conversation.

        Args:
            messages: List of chat messages to summarize
            focus_recent: Whether to emphasize recent messages

        Returns:
            ConversationSummary object with summary data
        """
        # Prepare messages for summarization
        messages_to_summarize = self._prepare_messages_for_summary(messages)

        # Build summarization prompt
        prompt = self._build_summary_prompt(messages_to_summarize, focus_recent)

        try:
            # Call Claude Haiku for summarization
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=500,  # Enough for 200-word summary
                temperature=0.3,  # Lower temperature for consistent summaries
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            # Parse response
            summary_text = response.content[0].text if response.content else ""

            # Extract structured information
            key_decisions = self._extract_key_decisions(summary_text)
            current_task = self._extract_current_task(summary_text)
            important_context = self._extract_important_context(summary_text)

            # Calculate token savings
            original_tokens = sum(
                self.estimate_tokens(str(msg.get("message", "")))
                for msg in messages_to_summarize
            )
            summary_tokens = self.estimate_tokens(summary_text)
            tokens_saved = original_tokens - summary_tokens

            # Update stats
            self.total_summaries += 1
            self.total_messages_summarized += len(messages_to_summarize)
            self.total_tokens_saved += tokens_saved

            # Create summary object
            summary = ConversationSummary(
                content=summary_text,
                message_count=len(messages_to_summarize),
                token_count=summary_tokens,
                key_decisions=key_decisions,
                current_task=current_task,
                important_context=important_context,
                created_at=datetime.now(timezone.utc),
                summary_type=SummaryType.FULL
            )

            self.last_summary = summary
            return summary

        except Exception as e:
            # Return fallback summary on error
            fallback_text = f"[Summary generation failed: {str(e)}] Conversation with {len(messages)} messages."
            return ConversationSummary(
                content=fallback_text,
                message_count=len(messages),
                token_count=self.estimate_tokens(fallback_text),
                key_decisions=[],
                current_task=None,
                important_context=[],
                created_at=datetime.now(timezone.utc),
                summary_type=SummaryType.PARTIAL
            )

    def _prepare_messages_for_summary(
        self,
        messages: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Prepare messages for summarization.

        Args:
            messages: Raw messages from chat history

        Returns:
            Cleaned messages ready for summarization
        """
        prepared = []

        for msg in messages:
            # Skip system messages and empty messages
            if msg.get("sender_type") == "system" or not msg.get("message"):
                continue

            prepared.append({
                "sender": msg.get("sender_type", "unknown"),
                "content": msg.get("message", ""),
                "timestamp": msg.get("created_at", ""),
                "has_tools": bool(msg.get("metadata", {}).get("tools_used"))
            })

        return prepared

    def _build_summary_prompt(
        self,
        messages: List[Dict[str, Any]],
        focus_recent: bool
    ) -> str:
        """
        Build prompt for summarization.

        Args:
            messages: Prepared messages
            focus_recent: Whether to emphasize recent messages

        Returns:
            Prompt string for Claude
        """
        # Format messages for prompt
        conversation = "\n".join([
            f"{msg['sender'].upper()}: {msg['content'][:500]}..."
            if len(msg['content']) > 500 else f"{msg['sender'].upper()}: {msg['content']}"
            for msg in messages
        ])

        focus_instruction = (
            "Pay special attention to the most recent 5 messages."
            if focus_recent else ""
        )

        return f"""Summarize this conversation in exactly {self.summary_length} words. {focus_instruction}

Include:
1. Main topics discussed
2. Key decisions made
3. Current task/goal being worked on
4. Important context that must be preserved
5. Any pending actions or questions

Conversation:
{conversation}

SUMMARY ({self.summary_length} words):"""

    def _extract_key_decisions(self, summary: str) -> List[str]:
        """Extract key decisions from summary text."""
        # Simple extraction - look for decision indicators
        decisions = []
        decision_keywords = ["decided", "agreed", "chosen", "selected", "determined"]

        sentences = summary.split(".")
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in decision_keywords):
                decisions.append(sentence.strip())

        return decisions[:3]  # Return top 3 decisions

    def _extract_current_task(self, summary: str) -> Optional[str]:
        """Extract current task from summary text."""
        task_keywords = ["working on", "implementing", "building", "fixing", "creating"]

        sentences = summary.split(".")
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in task_keywords):
                return sentence.strip()

        return None

    def _extract_important_context(self, summary: str) -> List[str]:
        """Extract important context from summary text."""
        context = []
        context_keywords = ["important", "note", "remember", "context", "background"]

        sentences = summary.split(".")
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in context_keywords):
                context.append(sentence.strip())

        return context[:2]  # Return top 2 context items

    def replace_with_summary(
        self,
        messages: List[Dict[str, Any]],
        summary: ConversationSummary,
        keep_recent: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Replace old messages with summary, keeping recent ones.

        Args:
            messages: Original message list
            summary: Generated summary
            keep_recent: Number of recent messages to keep

        Returns:
            New message list with summary replacing old messages
        """
        if len(messages) <= keep_recent:
            return messages

        # Create summary message
        summary_message = {
            "id": "summary_" + str(datetime.now(timezone.utc).timestamp()),
            "sender_type": "system",
            "receiver_type": "orchestrator",
            "message": f"[CONVERSATION SUMMARY - {summary.message_count} messages]\n\n{summary.content}",
            "metadata": {
                "type": "summary",
                "messages_summarized": summary.message_count,
                "tokens_saved": self.total_tokens_saved,
                "key_decisions": summary.key_decisions,
                "current_task": summary.current_task,
                "important_context": summary.important_context
            },
            "created_at": summary.created_at.isoformat(),
            "updated_at": summary.created_at.isoformat()
        }

        # Keep system messages, summary, and recent messages
        system_messages = [msg for msg in messages if msg.get("sender_type") == "system"]
        recent_messages = messages[-keep_recent:] if len(messages) > keep_recent else messages

        # Combine: system messages + summary + recent messages
        new_messages = system_messages + [summary_message] + recent_messages

        return new_messages

    def get_stats(self) -> Dict[str, Any]:
        """
        Get summarization statistics.

        Returns:
            Dictionary with summarization metrics
        """
        return {
            "total_summaries": self.total_summaries,
            "messages_summarized": self.total_messages_summarized,
            "tokens_saved": self.total_tokens_saved,
            "last_summary_at": (
                self.last_summary.created_at.isoformat()
                if self.last_summary else None
            ),
            "threshold_messages": self.threshold_messages,
            "summary_length": self.summary_length,
            "model": self.model
        }

    async def get_last_summary(self) -> Optional[str]:
        """
        Get the last generated summary.

        Returns:
            Last summary content or None
        """
        if self.last_summary:
            return self.last_summary.content
        return None

    def reset_stats(self):
        """Reset summarization statistics."""
        self.total_summaries = 0
        self.total_messages_summarized = 0
        self.total_tokens_saved = 0
        self.last_summary = None