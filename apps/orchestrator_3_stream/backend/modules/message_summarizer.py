#!/usr/bin/env python3
"""
Message Summarization Module

Implements intelligent message summarization to maintain long-term context
while keeping token usage under control.

Instead of dropping old messages, we:
1. Keep recent messages in full detail (last 30-50 messages)
2. Summarize older messages into condensed conversation summaries
3. Maintain key information like agent creations, tool results, user intents
4. Progressive summarization - older messages get more condensed

This allows the orchestrator to:
- Remember user intent from 200+ messages ago
- Track agent lifecycle across long conversations
- Maintain context without hitting token limits
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ConversationSummary:
    """Condensed summary of a conversation segment"""
    time_range: str
    message_count: int
    summary: str
    key_events: List[str]
    agents_mentioned: List[str]


class MessageSummarizer:
    """
    Intelligently summarizes old messages to maintain long-term context.

    Strategy:
    - Recent messages (0-30): Keep in full detail
    - Mid-range messages (31-100): Light summarization
    - Old messages (101+): Heavy summarization into conversation segments
    """

    def __init__(
        self,
        recent_message_threshold: int = 30,
        mid_range_threshold: int = 100,
        logger: Optional["OrchestratorLogger"] = None
    ):
        """
        Initialize message summarizer.

        Args:
            recent_message_threshold: Keep this many recent messages in full
            mid_range_threshold: Start heavy summarization after this many messages
            logger: Optional logger instance
        """
        self.recent_threshold = recent_message_threshold
        self.mid_range_threshold = mid_range_threshold
        self.logger = logger

    def summarize_messages(
        self,
        messages: List[Dict[str, Any]],
        max_total_tokens: int = 35000
    ) -> List[Dict[str, Any]]:
        """
        Summarize messages using sliding window + progressive condensation.

        Args:
            messages: Full message list (may be 200+ messages)
            max_total_tokens: Target token limit for output

        Returns:
            List of messages: [summary_segment, summary_segment, ...recent_messages]
        """
        if not messages:
            return []

        total_messages = len(messages)

        # If under threshold, return as-is
        if total_messages <= self.recent_threshold:
            return messages

        # Split into segments
        recent_messages = messages[-self.recent_threshold:]  # Last 30 in full
        mid_range_messages = messages[max(0, len(messages) - self.mid_range_threshold):-self.recent_threshold]
        old_messages = messages[:max(0, len(messages) - self.mid_range_threshold)]

        result = []

        # Summarize old messages into conversation segments (if any)
        if old_messages:
            summary_segment = self._create_conversation_summary(
                old_messages,
                time_range=f"{old_messages[0].get('created_at', 'unknown')} to {old_messages[-1].get('created_at', 'unknown')}",
                segment_type="old"
            )
            result.append(summary_segment)

        # Lightly summarize mid-range messages (if any)
        if mid_range_messages:
            summary_segment = self._create_conversation_summary(
                mid_range_messages,
                time_range=f"{mid_range_messages[0].get('created_at', 'unknown')} to {mid_range_messages[-1].get('created_at', 'unknown')}",
                segment_type="mid"
            )
            result.append(summary_segment)

        # Add recent messages in full detail
        result.extend(recent_messages)

        if self.logger:
            token_estimate = sum(len(str(msg.get("message", ""))) // 4 for msg in result)
            self.logger.info(
                f"📚 Message summarization: {total_messages} messages → {len(result)} entries "
                f"(~{token_estimate:,} tokens estimated)"
            )

        return result

    def _create_conversation_summary(
        self,
        messages: List[Dict[str, Any]],
        time_range: str,
        segment_type: str = "old"
    ) -> Dict[str, Any]:
        """
        Create a condensed summary segment from multiple messages.

        Args:
            messages: Messages to summarize
            time_range: Time range of this segment
            segment_type: "old" (heavy condensation) or "mid" (light condensation)

        Returns:
            Synthetic message dict containing the summary
        """
        # Extract key information
        agents_created = []
        agents_commanded = []
        user_intents = []
        tool_results = []

        for msg in messages:
            content = msg.get("message", "")
            sender = msg.get("sender_type", "")
            metadata = msg.get("metadata", {})

            # Track agent creations
            if "create_agent" in content.lower():
                # Extract agent name from content
                if "name" in content:
                    agents_created.append(self._extract_agent_name(content))

            # Track agent commands
            if "command_agent" in content.lower():
                agents_commanded.append(self._extract_agent_name(content))

            # Track user intents (from user messages)
            if sender == "user" and len(content) > 20:
                user_intents.append(self._condense_intent(content))

            # Track significant tool results
            if "tool_use" in metadata.get("type", ""):
                tool_name = metadata.get("tool_name", "")
                if tool_name:
                    tool_results.append(tool_name)

        # Build summary based on segment type
        if segment_type == "old":
            # Heavy condensation for old messages
            summary_parts = [
                f"Earlier conversation ({len(messages)} messages from {time_range}):"
            ]

            if agents_created:
                summary_parts.append(f"  - Created agents: {', '.join(set(agents_created))}")
            if user_intents:
                summary_parts.append(f"  - User requested: {'; '.join(user_intents[:3])}")  # Top 3 intents
            if tool_results:
                top_tools = list(set(tool_results))[:5]
                summary_parts.append(f"  - Tools used: {', '.join(top_tools)}")

            summary_text = "\n".join(summary_parts)

        else:  # mid-range
            # Light condensation for mid-range messages
            summary_parts = [
                f"Recent conversation ({len(messages)} messages):"
            ]

            # More detail for mid-range
            if agents_created:
                summary_parts.append(f"  - Agents created: {', '.join(set(agents_created))}")
            if agents_commanded:
                summary_parts.append(f"  - Agents commanded: {', '.join(set(agents_commanded))}")
            if user_intents:
                summary_parts.append(f"  - User tasks: {'; '.join(user_intents)}")

            summary_text = "\n".join(summary_parts)

        # Return as synthetic message
        return {
            "id": f"summary-{segment_type}-{datetime.now().isoformat()}",
            "sender_type": "system",
            "receiver_type": "orchestrator",
            "message": summary_text,
            "metadata": {
                "type": "conversation_summary",
                "segment_type": segment_type,
                "original_message_count": len(messages),
                "time_range": time_range
            },
            "created_at": messages[0].get("created_at", datetime.now().isoformat())
        }

    def _extract_agent_name(self, content: str) -> str:
        """Extract agent name from tool use content"""
        # Simple heuristic - look for name="..." or name: ...
        import re
        match = re.search(r'name["\s:=]+([a-zA-Z0-9_-]+)', content)
        if match:
            return match.group(1)
        return "agent"

    def _condense_intent(self, message: str) -> str:
        """Condense a user message into a short intent statement"""
        # Take first sentence or first 100 chars
        sentences = message.split(". ")
        if sentences:
            first_sentence = sentences[0].strip()
            if len(first_sentence) > 100:
                return first_sentence[:97] + "..."
            return first_sentence
        return message[:100]

    def estimate_tokens(self, messages: List[Dict[str, Any]]) -> int:
        """Estimate total tokens in message list"""
        return sum(len(str(msg.get("message", ""))) // 4 for msg in messages)
