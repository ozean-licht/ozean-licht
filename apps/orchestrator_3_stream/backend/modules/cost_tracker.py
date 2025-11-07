#!/usr/bin/env python3
"""
Cost Tracker Module

Implements per-session cost tracking with alert thresholds and real-time
monitoring to prevent unexpected API costs.

Features:
- Per-session cost tracking
- Model-specific pricing
- Alert thresholds with WebSocket broadcast
- Historical cost tracking
- Budget monitoring

Usage:
    cost_tracker = CostTracker(
        alert_threshold=10.0,
        critical_threshold=50.0
    )

    # Track API usage
    cost_tracker.record_usage(
        session_id="session-123",
        input_tokens=1000,
        output_tokens=500,
        model="claude-sonnet-4"
    )

    # Check if alert needed
    if cost_tracker.should_alert(session_id):
        await send_cost_alert(cost_tracker.get_session_stats(session_id))
"""

import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from datetime import datetime


# Model pricing per 1M tokens (as of 2025)
# Source: Anthropic pricing page
MODEL_PRICING = {
    # Sonnet models
    "claude-3-5-sonnet-20241022": {
        "input": 3.00,   # $3 per 1M input tokens
        "output": 15.00  # $15 per 1M output tokens
    },
    "claude-sonnet-4-5-20250929": {
        "input": 3.00,   # $3 per 1M input tokens
        "output": 15.00  # $15 per 1M output tokens
    },
    # Haiku models (75% cheaper than Sonnet!)
    "claude-3-5-haiku-20241022": {
        "input": 0.80,   # $0.80 per 1M input tokens
        "output": 4.00   # $4 per 1M output tokens
    },
    "claude-haiku-4-5-20251001": {
        "input": 0.80,   # $0.80 per 1M input tokens
        "output": 4.00   # $4 per 1M output tokens
    },
    # Opus models (5x more expensive than Sonnet)
    "claude-3-opus-20240229": {
        "input": 15.00,  # $15 per 1M input tokens
        "output": 75.00  # $75 per 1M output tokens
    },
    "claude-opus-4-5": {
        "input": 15.00,  # $15 per 1M input tokens
        "output": 75.00  # $75 per 1M output tokens
    },
    # Default fallback
    "default": {
        "input": 3.00,   # Default to Sonnet pricing
        "output": 15.00
    }
}


@dataclass
class SessionCostData:
    """Cost data for a single session"""
    session_id: str
    total_input_tokens: int = 0
    total_output_tokens: int = 0
    total_cost: float = 0.0
    request_count: int = 0
    alerts_sent: int = 0
    created_at: float = field(default_factory=time.time)
    last_updated: float = field(default_factory=time.time)


class CostTracker:
    """
    Track API costs per session with alert thresholds.

    Monitors token usage and costs in real-time, sending alerts when
    configurable thresholds are exceeded.
    """

    def __init__(
        self,
        alert_threshold: float = 10.0,
        critical_threshold: float = 50.0,
        logger: Optional["OrchestratorLogger"] = None,
        ws_manager: Optional["WebSocketManager"] = None
    ):
        """
        Initialize cost tracker.

        Args:
            alert_threshold: Send warning alert at this cost (USD)
            critical_threshold: Send critical alert at this cost (USD)
            logger: Optional logger instance
            ws_manager: Optional WebSocket manager for broadcasting alerts
        """
        self.alert_threshold = alert_threshold
        self.critical_threshold = critical_threshold
        self.logger = logger
        self.ws_manager = ws_manager

        # Per-session tracking
        self._sessions: Dict[str, SessionCostData] = {}

        # Global statistics
        self._total_cost = 0.0
        self._total_requests = 0

        if self.logger:
            self.logger.info(
                f"CostTracker initialized: alert=${alert_threshold:.2f}, "
                f"critical=${critical_threshold:.2f}"
            )

    def calculate_cost(
        self,
        input_tokens: int,
        output_tokens: int,
        model: str
    ) -> float:
        """
        Calculate cost for token usage.

        Args:
            input_tokens: Number of input tokens
            output_tokens: Number of output tokens
            model: Model identifier

        Returns:
            Cost in USD
        """
        # Get pricing for model (use default as fallback)
        pricing = MODEL_PRICING.get(
            model,
            MODEL_PRICING["default"]
        )

        # Log which pricing is being used
        if model in MODEL_PRICING:
            model_type = "Haiku" if "haiku" in model.lower() else "Opus" if "opus" in model.lower() else "Sonnet"
            if self.logger:
                self.logger.debug(f"Using {model_type} pricing: ${pricing['input']}/1M input, ${pricing['output']}/1M output")

        # Calculate cost (pricing is per 1M tokens)
        input_cost = (input_tokens / 1_000_000) * pricing["input"]
        output_cost = (output_tokens / 1_000_000) * pricing["output"]

        return input_cost + output_cost

    def record_usage(
        self,
        session_id: str,
        input_tokens: int,
        output_tokens: int,
        model: str,
        context: str = ""
    ) -> Dict[str, Any]:
        """
        Record token usage and calculate costs.

        Args:
            session_id: Session identifier
            input_tokens: Number of input tokens used
            output_tokens: Number of output tokens used
            model: Model used for the request
            context: Optional context string for debugging

        Returns:
            Dict with cost information and alert status
        """
        # Calculate cost
        cost = self.calculate_cost(input_tokens, output_tokens, model)

        # Get or create session data
        if session_id not in self._sessions:
            self._sessions[session_id] = SessionCostData(session_id=session_id)

        session = self._sessions[session_id]

        # Update session statistics
        session.total_input_tokens += input_tokens
        session.total_output_tokens += output_tokens
        session.total_cost += cost
        session.request_count += 1
        session.last_updated = time.time()

        # Update global statistics
        self._total_cost += cost
        self._total_requests += 1

        # Check for alerts
        alert_status = self._check_alerts(session)

        if self.logger:
            self.logger.debug(
                f"💰 Cost tracked: ${cost:.4f} "
                f"(in:{input_tokens:,} out:{output_tokens:,} model:{model}) "
                f"Session total: ${session.total_cost:.2f} {context}"
            )

        return {
            "session_id": session_id,
            "request_cost": cost,
            "session_total": session.total_cost,
            "alert_status": alert_status
        }

    def _check_alerts(self, session: SessionCostData) -> str:
        """
        Check if alerts should be sent for session.

        Args:
            session: Session cost data

        Returns:
            Alert status: "none", "warning", "critical"
        """
        # Check critical threshold first
        if session.total_cost >= self.critical_threshold:
            if session.alerts_sent < 2:  # Send critical alert once
                self._send_alert(session, "critical")
                session.alerts_sent = 2
            return "critical"

        # Check warning threshold
        if session.total_cost >= self.alert_threshold:
            if session.alerts_sent < 1:  # Send warning alert once
                self._send_alert(session, "warning")
                session.alerts_sent = 1
            return "warning"

        return "none"

    def _send_alert(self, session: SessionCostData, level: str) -> None:
        """
        Send cost alert via WebSocket and logging.

        Args:
            session: Session cost data
            level: Alert level ("warning" or "critical")
        """
        threshold = self.alert_threshold if level == "warning" else self.critical_threshold

        message = (
            f"Session {session.session_id[:8]}... has reached "
            f"${threshold:.2f} cost threshold (current: ${session.total_cost:.2f})"
        )

        # Log alert
        if self.logger:
            if level == "critical":
                self.logger.critical(f"💸 CRITICAL: {message}")
            else:
                self.logger.warning(f"⚠️  WARNING: {message}")

        # Broadcast via WebSocket if available
        if self.ws_manager:
            import asyncio
            asyncio.create_task(
                self.ws_manager.broadcast({
                    "type": "cost_alert",
                    "data": {
                        "level": level,
                        "message": message,
                        "session_id": session.session_id,
                        "cost": session.total_cost,
                        "threshold": threshold,
                        "timestamp": datetime.now().isoformat()
                    }
                })
            )

    def get_session_stats(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get cost statistics for a specific session.

        Args:
            session_id: Session identifier

        Returns:
            Dict with session statistics, or None if session not found
        """
        if session_id not in self._sessions:
            return None

        session = self._sessions[session_id]
        total_tokens = session.total_input_tokens + session.total_output_tokens

        return {
            "session_id": session_id,
            "total_cost": session.total_cost,
            "total_input_tokens": session.total_input_tokens,
            "total_output_tokens": session.total_output_tokens,
            "total_tokens": total_tokens,
            "request_count": session.request_count,
            "alerts_sent": session.alerts_sent,
            "created_at": session.created_at,
            "last_updated": session.last_updated,
            "average_cost_per_request": session.total_cost / session.request_count if session.request_count > 0 else 0.0
        }

    def get_all_stats(self) -> Dict[str, Any]:
        """
        Get global cost statistics across all sessions.

        Returns:
            Dict with global statistics
        """
        return {
            "total_cost": self._total_cost,
            "total_requests": self._total_requests,
            "session_count": len(self._sessions),
            "average_cost_per_request": self._total_cost / self._total_requests if self._total_requests > 0 else 0.0,
            "alert_threshold": self.alert_threshold,
            "critical_threshold": self.critical_threshold
        }

    def reset_session(self, session_id: str) -> bool:
        """
        Reset cost tracking for a specific session.

        Args:
            session_id: Session identifier

        Returns:
            True if session was reset, False if not found
        """
        if session_id in self._sessions:
            del self._sessions[session_id]
            if self.logger:
                self.logger.info(f"Cost tracking reset for session {session_id[:8]}...")
            return True
        return False

    def reset_all(self) -> None:
        """Reset all cost tracking data."""
        self._sessions.clear()
        self._total_cost = 0.0
        self._total_requests = 0

        if self.logger:
            self.logger.info("All cost tracking data reset")
