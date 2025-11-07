#!/usr/bin/env python3
"""
Model Selector Module

Intelligent model selection based on task complexity to reduce costs.
Uses Haiku for simple tasks, Sonnet for moderate, and Opus for complex tasks.

PRIORITY 2 IMPLEMENTATION: Expected 50-60% cost reduction.
"""

from typing import Optional


class ModelSelector:
    """
    Selects the optimal Claude model based on task complexity analysis.

    Cost comparison (per million tokens):
    - Haiku: $0.25 input / $1.25 output (95% cheaper than Sonnet)
    - Sonnet: $3.00 input / $15.00 output (baseline)
    - Opus: $15.00 input / $75.00 output (5x more expensive than Sonnet)
    """

    # Model constants
    MODEL_HAIKU = "claude-3-haiku-20240307"
    MODEL_SONNET = "claude-3-5-sonnet-20241022"
    MODEL_OPUS = "claude-3-5-opus-latest"

    def __init__(self, logger: Optional["OrchestratorLogger"] = None):
        """
        Initialize model selector.

        Args:
            logger: Optional logger for decision tracking
        """
        self.logger = logger

        # Track model usage for cost analysis
        self.haiku_count = 0
        self.sonnet_count = 0
        self.opus_count = 0

    def select_model(self, user_message: str, force_model: Optional[str] = None) -> str:
        """
        Select the optimal model based on task complexity.

        Args:
            user_message: User's message to analyze
            force_model: Optional model override for testing

        Returns:
            Model name to use
        """
        if force_model:
            return force_model

        message_lower = user_message.lower()
        message_length = len(user_message)

        # Analyze task complexity
        complexity = self._analyze_complexity(message_lower, message_length)

        # Select model based on complexity
        if complexity == "simple":
            model = self.MODEL_HAIKU
            self.haiku_count += 1
            if self.logger:
                self.logger.info(
                    f"🎯 Model: HAIKU (simple task, 95% cost reduction) - "
                    f"Usage: H:{self.haiku_count} S:{self.sonnet_count} O:{self.opus_count}"
                )

        elif complexity == "complex":
            model = self.MODEL_OPUS
            self.opus_count += 1
            if self.logger:
                self.logger.info(
                    f"🎯 Model: OPUS (complex task, maximum capability) - "
                    f"Usage: H:{self.haiku_count} S:{self.sonnet_count} O:{self.opus_count}"
                )

        else:  # moderate
            model = self.MODEL_SONNET
            self.sonnet_count += 1
            if self.logger:
                self.logger.info(
                    f"🎯 Model: SONNET (moderate complexity) - "
                    f"Usage: H:{self.haiku_count} S:{self.sonnet_count} O:{self.opus_count}"
                )

        return model

    def _analyze_complexity(self, message_lower: str, message_length: int) -> str:
        """
        Analyze message complexity.

        Returns:
            "simple", "moderate", or "complex"
        """
        # Simple task indicators - use Haiku
        simple_indicators = [
            # File operations
            ('read', 2), ('open', 2), ('cat', 2), ('ls', 2),
            ('list', 2), ('show', 2), ('view', 2), ('display', 2),

            # Documentation & info
            ('explain', 2), ('what is', 3), ('what\'s', 2),
            ('describe', 2), ('tell me about', 3),
            ('documentation', 3), ('docs', 2), ('help', 2),

            # Config & settings
            ('config', 2), ('setting', 2), ('environment', 2),
            ('.env', 3), ('variable', 2), ('parameter', 2),

            # Simple queries
            ('status', 2), ('check', 2), ('verify', 2),
            ('confirm', 2), ('test', 2), ('validate', 2),

            # Basic commands
            ('run', 2), ('execute', 2), ('start', 2),
            ('stop', 2), ('restart', 2), ('clear', 2),

            # Version & info
            ('version', 3), ('usage', 2), ('example', 2),

            # Quick fixes
            ('typo', 3), ('spacing', 3), ('indent', 3),
            ('rename', 2), ('move', 2), ('copy', 2),
        ]

        # Complex task indicators - use Opus
        complex_indicators = [
            # Architecture & design
            ('architect', 5), ('design', 3), ('refactor', 4),
            ('restructure', 4), ('redesign', 4), ('framework', 3),

            # Complex analysis
            ('analyze', 3), ('optimize', 3), ('performance', 3),
            ('security', 3), ('vulnerability', 4), ('audit', 3),

            # Integration & migration
            ('integrate', 3), ('migration', 4), ('upgrade', 3),
            ('synchronize', 3), ('orchestrate', 3), ('coordinate', 3),

            # Complex debugging
            ('debug', 2), ('investigate', 3), ('root cause', 4),
            ('diagnose', 3), ('troubleshoot', 3), ('trace', 2),

            # Strategic planning
            ('strategy', 4), ('roadmap', 4), ('planning', 3),
            ('proposal', 3), ('recommendation', 3), ('decision', 2),

            # Multi-component
            ('multiple', 2), ('several', 2), ('various', 2),
            ('entire', 2), ('whole', 2), ('comprehensive', 3),

            # Complexity keywords
            ('complex', 5), ('complicated', 4), ('advanced', 3),
            ('sophisticated', 4), ('intricate', 4),
        ]

        # Calculate scores
        simple_score = 0
        complex_score = 0

        # Check simple indicators
        for keyword, weight in simple_indicators:
            if keyword in message_lower:
                simple_score += weight

        # Check complex indicators
        for keyword, weight in complex_indicators:
            if keyword in message_lower:
                complex_score += weight

        # Length modifiers
        if message_length < 50:
            simple_score += 3  # Short messages are usually simple
        elif message_length > 500:
            complex_score += 2  # Long messages might be complex

        # Check for code blocks (complex)
        if '```' in message_lower or 'function' in message_lower or 'class' in message_lower:
            complex_score += 3

        # Check for questions (often simple)
        if message_lower.endswith('?') and message_length < 100:
            simple_score += 2

        # Decision thresholds - BALANCED for cost savings + accuracy
        # Aim for 40% Haiku, 50% Sonnet, 10% Opus

        # Complex tasks get priority
        if complex_score >= 6 or ("architect" in message_lower and "design" in message_lower):
            return "complex"  # Opus - for architecture and complex tasks
        elif simple_score >= 5 and complex_score < 2:
            return "simple"  # Haiku - only for clearly simple tasks
        else:
            return "moderate"  # Sonnet - default for most work including implementation

    def get_usage_stats(self) -> dict:
        """
        Get model usage statistics.

        Returns:
            Dictionary with usage counts and estimated cost savings
        """
        total = self.haiku_count + self.sonnet_count + self.opus_count
        if total == 0:
            return {
                "haiku_count": 0,
                "sonnet_count": 0,
                "opus_count": 0,
                "haiku_percentage": 0,
                "cost_reduction_percentage": 0
            }

        haiku_pct = (self.haiku_count / total) * 100
        sonnet_pct = (self.sonnet_count / total) * 100
        opus_pct = (self.opus_count / total) * 100

        # Calculate cost reduction
        # Baseline: all requests using Sonnet = 1.0
        # Haiku costs ~5% of Sonnet, Opus costs ~5x Sonnet
        actual_cost = (self.haiku_count * 0.05 + self.sonnet_count * 1.0 + self.opus_count * 5.0)
        baseline_cost = total * 1.0
        cost_reduction = ((baseline_cost - actual_cost) / baseline_cost * 100) if baseline_cost > 0 else 0

        return {
            "haiku_count": self.haiku_count,
            "sonnet_count": self.sonnet_count,
            "opus_count": self.opus_count,
            "haiku_percentage": haiku_pct,
            "sonnet_percentage": sonnet_pct,
            "opus_percentage": opus_pct,
            "total_requests": total,
            "cost_reduction_percentage": cost_reduction
        }

    def reset_stats(self):
        """Reset usage statistics."""
        self.haiku_count = 0
        self.sonnet_count = 0
        self.opus_count = 0