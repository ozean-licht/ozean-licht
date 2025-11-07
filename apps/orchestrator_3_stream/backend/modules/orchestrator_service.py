"""
Orchestrator Service Module

Business logic for executing orchestrator agent with WebSocket streaming.

Implements three-phase logging pattern:
1. Pre-execution: Log user message to database
2. Execution: Execute agent, stream response via WebSocket
3. Post-execution: Log orchestrator response, update costs

Reference: apps/orchestrator_1_term/modules/orchestrator_agent.py
"""

import uuid
import asyncio
import os
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from pathlib import Path

# Configuration
from .config import (
    DEFAULT_CHAT_HISTORY_LIMIT,
    TOKEN_MANAGEMENT_ENABLED,
    MAX_CONTEXT_MESSAGES,
    MAX_CONTEXT_TOKENS,
    RATE_LIMIT_TOKENS_PER_MINUTE,
    RATE_LIMIT_BACKOFF_THRESHOLD,
    RESPONSE_CACHE_ENABLED,
    RESPONSE_CACHE_MAX_SIZE,
    RESPONSE_CACHE_TTL_SECONDS,
    COST_ALERT_THRESHOLD as COST_ALERT_THRESHOLD_USD,
)


# Database operations
from .database import (
    get_orchestrator,
    insert_chat_message,
    insert_system_log,
    update_orchestrator_session,
    update_orchestrator_costs,
    get_chat_history,
    get_turn_count,
    get_orchestrator_action_blocks,
    update_chat_summary,
    update_prompt_summary,
    update_system_log_summary,
)


# AI summarization
from .single_agent_prompt import summarize_event

# Token optimization modules
from .context_manager import ContextManager
from .response_cache import ResponseCache
from .rate_limiter import TokenRateLimiter as RateLimiter
from .cost_tracker import CostTracker
from .model_selector import ModelSelector

# WebSocket and logging
from .websocket_manager import WebSocketManager
from .logger import OrchestratorLogger
from . import config
from .subagent_loader import SubagentRegistry

# Hook imports for orchestrator agent event tracking
from .orchestrator_hooks import (
    create_orchestrator_pre_tool_hook,
    create_orchestrator_post_tool_hook,
    create_orchestrator_stop_hook,
)


# Claude SDK imports
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    AssistantMessage,
    SystemMessage,
    TextBlock,
    ThinkingBlock,
    ToolUseBlock,
    ResultMessage,
)

# ═══════════════════════════════════════════════════════════
# PRIORITY 3: TOKEN BUDGET ENFORCEMENT
# ═══════════════════════════════════════════════════════════

# Token budgets to prevent runaway costs ($10/36k token prevention)
TOKEN_BUDGETS = {
    "simple": 5_000,      # Config, docs, simple queries
    "moderate": 15_000,   # Module creation, integration
    "complex": 30_000,    # Multi-phase workflows
}

class SessionBudget:
    """Track and enforce token budgets to prevent runaway costs."""

    def __init__(self, limit: int = 50_000):
        self.tokens_used = 0
        self.budget_limit = limit  # Hard limit for session
        self.warnings_sent = set()  # Track which warnings were sent
        self.task_budgets = {}  # Track per-task usage

    def check_budget(self, estimated_tokens: int, task_type: str = "moderate") -> tuple[bool, str]:
        """Check if we have budget for the estimated tokens."""
        task_budget = TOKEN_BUDGETS.get(task_type, TOKEN_BUDGETS["moderate"])
        projected_usage = self.tokens_used + estimated_tokens
        usage_percentage = (projected_usage / self.budget_limit) * 100

        # Hard stop at 100%
        if projected_usage > self.budget_limit:
            return False, f"🛑 BUDGET EXCEEDED: {self.tokens_used:,}/{self.budget_limit:,} tokens used. Request needs {estimated_tokens:,} more. HALTING to prevent runaway costs."

        # Task-specific budget check
        if estimated_tokens > task_budget:
            return False, f"⚠️ TASK BUDGET EXCEEDED: Request needs {estimated_tokens:,} tokens but {task_type} tasks limited to {task_budget:,}"

        # Warning thresholds
        warning = None
        if usage_percentage >= 90 and "90%" not in self.warnings_sent:
            warning = f"🚨 CRITICAL: 90% budget used ({self.tokens_used:,}/{self.budget_limit:,} tokens)"
            self.warnings_sent.add("90%")
        elif usage_percentage >= 75 and "75%" not in self.warnings_sent:
            warning = f"⚠️ WARNING: 75% budget used ({self.tokens_used:,}/{self.budget_limit:,} tokens)"
            self.warnings_sent.add("75%")
        elif usage_percentage >= 50 and "50%" not in self.warnings_sent:
            warning = f"📊 NOTICE: 50% budget used ({self.tokens_used:,}/{self.budget_limit:,} tokens)"
            self.warnings_sent.add("50%")

        return True, warning

    def add_usage(self, tokens: int, task_type: str = "general"):
        """Track token usage."""
        self.tokens_used += tokens
        if task_type not in self.task_budgets:
            self.task_budgets[task_type] = 0
        self.task_budgets[task_type] += tokens

    def get_remaining(self) -> int:
        """Get remaining token budget."""
        return max(0, self.budget_limit - self.tokens_used)

    def get_usage_report(self) -> dict:
        """Get detailed usage report."""
        return {
            "used": self.tokens_used,
            "limit": self.budget_limit,
            "remaining": self.get_remaining(),
            "percentage": (self.tokens_used / self.budget_limit * 100) if self.budget_limit > 0 else 0,
            "by_task": self.task_budgets,
            "warnings": list(self.warnings_sent)
        }


def get_orchestrator_tools() -> List[str]:
    """
    Get orchestrator management tool signatures in TypeScript format.

    Shows required vs optional parameters with proper TypeScript syntax:
    - Required parameters: `name: string`
    - Optional parameters: `param?: type`
    - Default values: `param = value`

    Returns:
        List of tool signatures in TypeScript function format
    """
    return [
        "create_agent(name: string, system_prompt?: string, model?: string, subagent_template?: string)",
        "list_agents()",
        "command_agent(agent_name: string, command: string)",
        "check_agent_status(agent_name: string, tail_count = 10, offset = 0, verbose_logs = false)",
        "delete_agent(agent_name: string)",
        "interrupt_agent(agent_name: string)",
        "read_system_logs(offset = 0, limit = 50, message_contains?: string, level?: string)",
        "report_cost()",
    ]


class OrchestratorService:
    """
    Service layer for orchestrator agent operations.

    Handles chat message processing, agent execution, and WebSocket streaming.
    """

    def __init__(
        self,
        ws_manager: WebSocketManager,
        logger: OrchestratorLogger,
        agent_manager: Optional["AgentManager"] = None,
        session_id: Optional[str] = None,
        working_dir: Optional[str] = None,
    ):
        """
        Initialize orchestrator service.

        Args:
            ws_manager: WebSocket manager for streaming
            logger: Logger instance
            agent_manager: Optional AgentManager for management tools
            session_id: Optional session ID for resumption
            working_dir: Optional working directory override
        """
        self.ws_manager = ws_manager
        self.logger = logger
        self.agent_manager = agent_manager
        self.session_id = session_id
        self.working_dir = working_dir or config.get_working_dir()

        # Track if we started with a session_id (for resume vs new orchestrator)
        # If True, we're resuming an existing session and should NOT update session_id
        # If False, this is a new orchestrator and we SHOULD update session_id after first prompt
        self.started_with_session = session_id is not None

        # Track if we've captured SystemMessage metadata (only capture once per boot)
        self._system_message_captured = False

        # Interrupt support: Track active client and execution state
        self.active_client: Optional[ClaudeSDKClient] = None
        self.is_executing = False
        self._execution_lock = asyncio.Lock()

        # PRIORITY 3: Initialize session budget tracker
        self.session_budget = SessionBudget(limit=50_000)  # 50k token hard limit per session
        self.logger.warning(f"💰 SESSION BUDGET: {self.session_budget.budget_limit:,} tokens allocated")

        # Initialize token optimization modules if enabled
        # PRIORITY 1: Aggressive context windowing to fix 90% rate limiting
        if TOKEN_MANAGEMENT_ENABLED:
            # Use aggressive limits to immediately reduce token usage
            # Override config with hardcoded aggressive values for immediate fix
            aggressive_max_messages = 20  # Very aggressive message limit
            aggressive_max_tokens = 25000  # 25k tokens (12.5% of 200k limit)

            self.context_manager = ContextManager(
                max_messages=aggressive_max_messages,
                max_tokens=aggressive_max_tokens,
                mode="token_priority"  # Prioritize token reduction over message count
            )
            self.response_cache = ResponseCache(
                max_size=RESPONSE_CACHE_MAX_SIZE,
                ttl_seconds=RESPONSE_CACHE_TTL_SECONDS,
                logger=self.logger
            ) if RESPONSE_CACHE_ENABLED else None
            self.rate_limiter = RateLimiter(
                tokens_per_minute=RATE_LIMIT_TOKENS_PER_MINUTE,
                backoff_threshold=RATE_LIMIT_BACKOFF_THRESHOLD
            )
            self.cost_tracker = CostTracker(
                alert_threshold=COST_ALERT_THRESHOLD_USD,
                critical_threshold=COST_ALERT_THRESHOLD_USD * 2,
                logger=self.logger,
                ws_manager=self.ws_manager
            )
            # PRIORITY 2: Model selector for intelligent model tiering
            self.model_selector = ModelSelector(logger=self.logger)

            self.logger.info(f"Token optimization modules initialized (AGGRESSIVE MODE)")
            self.logger.info(f"  - Context Manager: {aggressive_max_messages} msgs, {aggressive_max_tokens:,} tokens (AGGRESSIVE)")
            self.logger.info(f"  - Response Cache: {'Enabled' if self.response_cache else 'Disabled'}")
            self.logger.info(f"  - Rate Limiter: {RATE_LIMIT_TOKENS_PER_MINUTE} tokens/min")
            self.logger.info(f"  - Cost Tracker: Alert at ${COST_ALERT_THRESHOLD_USD}")
            self.logger.info(f"  - Model Selector: ENABLED (Haiku for simple, Sonnet for moderate, Opus for complex)")
        else:
            self.context_manager = None
            self.response_cache = None
            self.rate_limiter = None
            self.cost_tracker = None
            self.model_selector = None
            self.logger.info("Token optimization disabled")

        # Get management tools from agent_manager if provided
        self.management_tools = []
        if self.agent_manager:
            self.management_tools = self.agent_manager.create_management_tools()
            self.logger.info(
                f"Registered {len(self.management_tools)} management tools"
            )

        self.logger.info(f"OrchestratorService initialized")
        if session_id:
            self.logger.info(f"Resuming session: {session_id}")
        self.logger.info(f"Working directory: {self.working_dir}")

    def _load_system_prompt(self) -> str:
        """
        Load orchestrator system prompt from file and inject SUBAGENT_MAP.
        Also loads CLAUDE.md from working directory to provide codebase context.

        Returns:
            System prompt text with {{SUBAGENT_MAP}} placeholder replaced and CLAUDE.md appended

        Raises:
            FileNotFoundError: If prompt file doesn't exist
        """
        prompt_path = Path(config.ORCHESTRATOR_SYSTEM_PROMPT_PATH)

        # Make path absolute if it's relative
        if not prompt_path.is_absolute():
            prompt_path = Path(config.BACKEND_DIR) / prompt_path

        if not prompt_path.exists():
            self.logger.warning(
                f"System prompt not found at {prompt_path}, using default"
            )
            return "You are a helpful orchestrator agent that manages other Claude Code agents."

        with open(prompt_path, "r") as f:
            prompt_text = f.read()

        # Check for SUBAGENT_MAP placeholder
        if "{{SUBAGENT_MAP}}" in prompt_text:
            self.logger.debug("Found {{SUBAGENT_MAP}} placeholder in system prompt")

            # Initialize SubagentRegistry to discover templates
            # Templates are at /opt/.claude/agents/ (installed by start.sh)
            registry = SubagentRegistry(self.working_dir, self.logger)
            self.logger.info("SubagentRegistry initialized for prompt injection")

            # Generate template list
            templates = registry.list_templates()

            if templates:
                # Format as markdown list
                template_lines = []
                for t in templates:
                    template_lines.append(f"- **{t['name']}**: {t['description']}")
                template_map = "\n".join(template_lines)
                self.logger.info(
                    f"✅ Injecting {len(templates)} subagent template(s) into orchestrator prompt"
                )
            else:
                # No templates available - provide helpful message
                template_map = "No subagent templates available. Create templates in `.claude/agents/` directory to enable specialized agents."
                self.logger.warning(
                    "⚠️  No templates available for SUBAGENT_MAP - using fallback message"
                )

            # Replace placeholder
            prompt_text = prompt_text.replace("{{SUBAGENT_MAP}}", template_map)

        # Load orchestrator-specific CLAUDE.md for context
        # Use PROJECT_ROOT (/app) not working_dir (/opt/ozean-licht-ecosystem)
        claude_md_path = Path(config.PROJECT_ROOT) / "CLAUDE.md"
        if claude_md_path.exists():
            try:
                with open(claude_md_path, "r") as f:
                    claude_md_content = f.read()

                # Append CLAUDE.md content to system prompt
                prompt_text += "\n\n---\n\n# Codebase Context (CLAUDE.md)\n\n"
                prompt_text += claude_md_content
                self.logger.info(f"✅ Loaded CLAUDE.md from {claude_md_path}")
            except Exception as e:
                self.logger.warning(f"Failed to load CLAUDE.md: {e}")
        else:
            self.logger.debug(f"No CLAUDE.md found at {claude_md_path}")

        return prompt_text

    def _create_claude_agent_options(
        self, orchestrator_agent_id: Optional[str] = None, model: Optional[str] = None
    ) -> "ClaudeAgentOptions":
        """
        Create Claude Agent SDK options for orchestrator.

        Args:
            orchestrator_agent_id: Optional orchestrator UUID for hook tracking

        Returns:
            ClaudeAgentOptions configured for orchestrator

        Note:
            - Resumes session if self.session_id is valid Claude SDK format
            - Uses configured working directory
            - Registers management tools via MCP server if agent_manager provided
            - Includes hooks for event tracking
        """
        # Use resume if session_id exists
        resume_session = None
        if self.session_id and isinstance(self.session_id, str):
            resume_session = self.session_id
            self.logger.info(f"Resuming Claude SDK session: {resume_session[:20]}...")
        else:
            self.logger.info(
                "Starting fresh Claude SDK session (no valid session to resume)"
            )

        # Build options with management tools if available
        # Pass ANTHROPIC_API_KEY explicitly to ensure subprocess has access
        env_vars = {}
        if "ANTHROPIC_API_KEY" in os.environ:
            env_vars["ANTHROPIC_API_KEY"] = os.environ["ANTHROPIC_API_KEY"]

        # Orchestrator works in global repo (/opt/ozean-licht-ecosystem)
        # At startup, orchestrator .claude is installed to /opt/.claude via start.sh
        # This gives orchestrator global file access while using orchestrator-specific commands
        options_dict = {
            "system_prompt": self._load_system_prompt(),
            "model": model or config.ORCHESTRATOR_MODEL,  # Use provided model or default
            "cwd": self.working_dir,  # Global workspace for file operations
            "resume": resume_session,
            "env": env_vars,  # Ensure API key is available to subprocess
        }

        # Add hooks for event tracking if orchestrator_agent_id provided
        if orchestrator_agent_id:
            task_slug = f"orchestrator-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            entry_counter = {"count": 0}
            options_dict["hooks"] = self._build_hooks_for_orchestrator(
                uuid.UUID(orchestrator_agent_id), task_slug, entry_counter
            )

        # Register management tools via MCP server
        if self.management_tools:
            from claude_agent_sdk import create_sdk_mcp_server

            mcp_server = create_sdk_mcp_server(
                name="mgmt", version="1.0.0", tools=self.management_tools
            )

            options_dict["mcp_servers"] = {"mgmt": mcp_server}

            # Define allowed tools
            options_dict["allowed_tools"] = [
                "mcp__mgmt__create_agent",
                "mcp__mgmt__list_agents",
                "mcp__mgmt__command_agent",
                "mcp__mgmt__check_agent_status",
                "mcp__mgmt__delete_agent",
                "mcp__mgmt__interrupt_agent",
                "mcp__mgmt__read_system_logs",
                "mcp__mgmt__report_cost",
                "Bash",
                "Read",
                "SlashCommand",
                "Skill",
            ]

            self.logger.info("MCP management tools registered for orchestrator")

        # Add setting_sources to load project settings (CLAUDE.md, slash commands, etc.)
        options_dict["setting_sources"] = ["project"]

        options = ClaudeAgentOptions(**options_dict)

        return options

    def _build_hooks_for_orchestrator(
        self,
        orchestrator_agent_id: uuid.UUID,
        task_slug: str,
        entry_counter: Dict[str, int],
    ) -> Dict[str, Any]:
        """
        Build hooks dictionary for orchestrator agent.

        Args:
            orchestrator_agent_id: UUID of orchestrator
            task_slug: Task identifier
            entry_counter: Mutable counter dict

        Returns:
            Hooks dict for ClaudeAgentOptions
        """
        agent_name = "orchestrator"  # Orchestrator's name for logging

        return {
            "PreToolUse": [
                {
                    "hooks": [
                        create_orchestrator_pre_tool_hook(
                            orchestrator_agent_id,
                            self.logger,
                            self.ws_manager,
                        )
                    ]
                }
            ],
            "PostToolUse": [
                {
                    "hooks": [
                        create_orchestrator_post_tool_hook(
                            orchestrator_agent_id,
                            self.logger,
                            self.ws_manager,
                        )
                    ]
                }
            ],
            "Stop": [
                {
                    "hooks": [
                        create_orchestrator_stop_hook(
                            orchestrator_agent_id,
                            self.logger,
                            self.ws_manager,
                        )
                    ]
                }
            ],
        }

    async def load_chat_history(
        self, orchestrator_agent_id: str, limit: int = DEFAULT_CHAT_HISTORY_LIMIT
    ) -> Dict[str, Any]:
        """
        Load chat history for orchestrator agent, including action blocks.

        Fetches both chat messages (TextBlock chunks) and action blocks
        (ThinkingBlock, ToolUseBlock) from system_logs, merges them, and
        returns in chronological order.

        Args:
            orchestrator_agent_id: UUID of orchestrator agent
            limit: Maximum number of messages to return

        Returns:
            Dictionary with messages list (includes action blocks) and turn count
        """
        # PRIORITY 4: Check cache for chat history (saves 15-25% on repeated loads)
        cache_key = None
        if self.response_cache and RESPONSE_CACHE_ENABLED:
            cache_key = f"chat_history:{orchestrator_agent_id}:{limit}"
            cached_history = await self.response_cache.get(cache_key)
            if cached_history:
                self.logger.info(f"💾 CACHE HIT: Chat history for {orchestrator_agent_id[:8]}... (saved DB query)")
                return cached_history

        try:
            orch_uuid = uuid.UUID(orchestrator_agent_id)

            # Get chat history, action blocks, and turn count in parallel
            messages = await get_chat_history(orch_uuid, limit=limit)
            action_blocks = await get_orchestrator_action_blocks(orch_uuid, limit=limit)
            turn_count = await get_turn_count(orch_uuid)

            # Convert chat messages UUIDs to strings for JSON serialization
            for msg in messages:
                msg["id"] = str(msg["id"])
                msg["orchestrator_agent_id"] = str(msg["orchestrator_agent_id"])
                if msg.get("agent_id"):
                    msg["agent_id"] = str(msg["agent_id"])
                # Convert datetime objects to ISO strings
                msg["created_at"] = msg["created_at"].isoformat()
                msg["updated_at"] = msg["updated_at"].isoformat()

            # Transform action blocks into chat message format
            transformed_blocks = []
            for block in action_blocks:
                block_type = block.get("metadata", {}).get("type")

                if block_type == "thinking_block":
                    # Transform thinking block to frontend format
                    transformed_blocks.append(
                        {
                            "id": str(block["id"]),
                            "sender_type": "orchestrator",
                            "receiver_type": "user",
                            "message": "",  # Empty for thinking blocks
                            "metadata": {
                                "type": "thinking",
                                "thinking": block["metadata"].get("thinking", ""),
                            },
                            "created_at": block["timestamp"].isoformat(),
                            "updated_at": block["timestamp"].isoformat(),
                            "orchestrator_agent_id": orchestrator_agent_id,
                            "agent_id": None,
                        }
                    )

                elif block_type == "tool_use_block":
                    # Transform tool use block to frontend format
                    transformed_blocks.append(
                        {
                            "id": str(block["id"]),
                            "sender_type": "orchestrator",
                            "receiver_type": "user",
                            "message": "",  # Empty for tool use blocks
                            "metadata": {
                                "type": "tool_use",
                                "tool_name": block["metadata"].get("tool_name", ""),
                                "tool_input": block["metadata"].get("tool_input", {}),
                            },
                            "created_at": block["timestamp"].isoformat(),
                            "updated_at": block["timestamp"].isoformat(),
                            "orchestrator_agent_id": orchestrator_agent_id,
                            "agent_id": None,
                        }
                    )

            # Merge messages and action blocks, then sort by timestamp
            all_messages = messages + transformed_blocks
            all_messages.sort(key=lambda x: x["created_at"])

            # Apply context management if enabled
            if self.context_manager and TOKEN_MANAGEMENT_ENABLED:
                # PRIORITY 1: Aggressive context trimming to fix rate limiting
                stats_before = self.context_manager.analyze_messages(all_messages)

                # Log BEFORE trimming for visibility
                self.logger.warning(
                    f"🔍 PRE-TRIM Context: {stats_before.total_messages} messages, "
                    f"{stats_before.total_tokens:,} tokens"
                )

                # Use aggressive token-based trimming
                trimmed_messages = self.context_manager.trim_to_limit(all_messages, mode="token_count")
                stats_after = self.context_manager.analyze_messages(trimmed_messages)

                # Calculate reduction percentage
                token_reduction = (stats_before.total_tokens - stats_after.total_tokens) / stats_before.total_tokens * 100 if stats_before.total_tokens > 0 else 0
                message_reduction = (stats_before.total_messages - stats_after.total_messages) / stats_before.total_messages * 100 if stats_before.total_messages > 0 else 0

                # Always log the reduction (even if 0) for monitoring
                self.logger.warning(
                    f"✂️  POST-TRIM Context: {stats_after.total_messages} messages ({message_reduction:.1f}% reduction), "
                    f"{stats_after.total_tokens:,} tokens ({token_reduction:.1f}% reduction)"
                )

                if token_reduction > 30:
                    self.logger.info(f"🎯 Achieved {token_reduction:.1f}% token reduction - Rate limiting should improve!")
                elif token_reduction < 10:
                    self.logger.error(f"⚠️  Only {token_reduction:.1f}% token reduction - May still hit rate limits!")

                # Cache the trimmed result
                result = {"messages": trimmed_messages, "turn_count": turn_count}
                if cache_key and self.response_cache and RESPONSE_CACHE_ENABLED:
                    await self.response_cache.set(cache_key, result)
                    self.logger.debug(f"💾 Cached trimmed chat history")

                return result

            # Cache the result
            result = {"messages": all_messages, "turn_count": turn_count}
            if cache_key and self.response_cache and RESPONSE_CACHE_ENABLED:
                await self.response_cache.set(cache_key, result)
                self.logger.debug(f"💾 Cached chat history")

            return result

        except Exception as e:
            self.logger.error(f"Failed to load chat history: {e}")
            raise

    def select_model_for_task(self, task_type: str = "general", complexity: str = "moderate") -> str:
        """Select optimal model based on task complexity to reduce costs by 2.5x"""
        # Simple tasks -> Haiku (4x cheaper than Sonnet)
        simple_tasks = ["config", "docs", "simple_query", "file_read", "documentation", "basic_edit"]

        if task_type in simple_tasks or complexity == "simple":
            model = "claude-3-5-haiku-20241022"  # $0.80 per 1M input tokens
            self.logger.info(f"💰 MODEL TIER: HAIKU selected (75% cost savings)")
        elif complexity == "moderate":
            model = "claude-3-5-sonnet-20241022"  # $3.00 per 1M input tokens
            self.logger.info(f"⚖️ MODEL TIER: SONNET selected (standard pricing)")
        else:
            model = "claude-3-opus-20240229"      # $15.00 per 1M input tokens
            self.logger.info(f"🚀 MODEL TIER: OPUS selected (premium pricing)")

        return model

    def analyze_task_complexity(self, user_message: str) -> tuple[str, str]:
        """Analyze user message to determine task type and complexity"""
        msg_lower = user_message.lower()

        # Simple task detection
        if any(word in msg_lower for word in ["read", "show", "list", "cat", "ls", "what is", "explain"]):
            return "file_read", "simple"
        elif any(word in msg_lower for word in ["config", "setting", "env", "environment"]):
            return "config", "simple"
        elif any(word in msg_lower for word in ["docs", "documentation", "readme", "help"]):
            return "docs", "simple"
        elif any(word in msg_lower for word in ["status", "check", "verify"]):
            return "simple_query", "simple"

        # Complex task detection
        elif any(word in msg_lower for word in ["architect", "design", "refactor", "optimize"]):
            return "architecture", "complex"
        elif any(word in msg_lower for word in ["debug", "investigate", "analyze complex"]):
            return "debugging", "complex"

        # Default to moderate
        return "general", "moderate"

    async def process_user_message(
        self, user_message: str, orchestrator_agent_id: str
    ) -> Dict[str, Any]:
        """
        Process user message with orchestrator agent.

        Implements three-phase logging:
        1. Pre-execution: Log user message
        2. Execution: Execute agent with streaming
        3. Post-execution: Log response, update costs

        Args:
            user_message: User's message text
            orchestrator_agent_id: UUID of orchestrator agent

        Returns:
            Dictionary with response, session_id, and execution status

        Raises:
            Exception: If execution fails
        """
        orch_uuid = uuid.UUID(orchestrator_agent_id)

        # ═══════════════════════════════════════════════════════════
        # PHASE 1: PRE-EXECUTION - Log user message
        # ═══════════════════════════════════════════════════════════

        try:
            # Invalidate chat history cache since we're adding a new message
            if self.response_cache and RESPONSE_CACHE_ENABLED:
                # Clear all chat history cache entries for this orchestrator
                cache_pattern = f"chat_history:{orchestrator_agent_id}:"
                await self.response_cache.clear_pattern(cache_pattern)
                self.logger.debug(f"💾 Invalidated chat history cache for new message")

            # Insert message into database
            chat_id = await insert_chat_message(
                orchestrator_agent_id=orch_uuid,
                sender_type="user",
                receiver_type="orchestrator",
                message=user_message,
                agent_id=None,
                metadata={},
            )

            # Generate AI summary in background
            asyncio.create_task(self._summarize_and_update_chat(chat_id, user_message))

            self.logger.chat_event(orchestrator_agent_id, user_message, sender="user")

            # NOTE: We do NOT broadcast user messages via WebSocket because the frontend
            # already adds them optimistically when the user clicks send.
            # Broadcasting here would cause duplicate messages in the UI.
            # Only orchestrator responses are broadcasted below during agent execution.
        except Exception as e:
            self.logger.error(f"Failed to log user message: {e}")
            raise

        # ═══════════════════════════════════════════════════════════
        # INTERRUPT CHECK - Stop current execution if busy
        # ═══════════════════════════════════════════════════════════

        async with self._execution_lock:
            if self.is_executing and self.active_client:
                self.logger.warning(
                    "⚠️  Orchestrator is busy with previous task - interrupting..."
                )
                try:
                    await self.active_client.interrupt()
                    self.logger.info("✅ Successfully interrupted previous task")

                    # Broadcast interruption notification
                    await self.ws_manager.broadcast(
                        {
                            "type": "system_log",
                            "data": {
                                "level": "WARNING",
                                "message": "Previous orchestrator task interrupted - refocusing on new message",
                                "timestamp": datetime.now().isoformat(),
                            },
                        }
                    )
                except Exception as e:
                    self.logger.error(f"Failed to interrupt orchestrator: {e}")
                    # Continue anyway - the new message will be processed

        # ═══════════════════════════════════════════════════════════
        # MODEL SELECTION - Choose optimal model for cost savings
        # ═══════════════════════════════════════════════════════════

        # Use ModelSelector for intelligent model tiering (PRIORITY 2: Save 50-60% costs)
        if self.model_selector and TOKEN_MANAGEMENT_ENABLED:
            selected_model = self.model_selector.select_model(user_message)
            # Get usage stats for monitoring
            stats = self.model_selector.get_usage_stats()
            if stats["total_requests"] > 0:
                self.logger.info(
                    f"📊 Model Usage: Haiku {stats['haiku_percentage']:.1f}%, "
                    f"Sonnet {stats['sonnet_percentage']:.1f}%, "
                    f"Opus {stats['opus_percentage']:.1f}% | "
                    f"Cost Reduction: {stats['cost_reduction_percentage']:.1f}%"
                )
        else:
            # Fallback to simple selection if model selector not available
            task_type, complexity = self.analyze_task_complexity(user_message)
            selected_model = self.select_model_for_task(task_type, complexity)

        # ═══════════════════════════════════════════════════════════
        # PHASE 2: EXECUTION - Execute agent with streaming
        # ═══════════════════════════════════════════════════════════

        response_text = ""
        tools_used = []
        final_session_id = None
        usage_data = None
        result_message = None  # Track the ResultMessage for cost extraction

        try:
            # Set typing indicator
            await self.ws_manager.set_typing_indicator(orchestrator_agent_id, True)

            # Create Claude SDK client with hooks and selected model
            options = self._create_claude_agent_options(orchestrator_agent_id, model=selected_model)

            # Check cache if enabled
            cached_response = None
            cache_key = None
            if self.response_cache and RESPONSE_CACHE_ENABLED:
                # Generate cache key from prompt and recent context
                chat_history = await self.load_chat_history(orchestrator_agent_id, limit=5)
                cache_key = self.response_cache.generate_key(user_message, chat_history.get("messages", []))
                cached_response = await self.response_cache.get(cache_key)

                if cached_response:
                    self.logger.info(f"Cache hit for query: {user_message[:50]}...")
                    # Return cached response directly
                    await self.ws_manager.broadcast({
                        "type": "chat_message",
                        "data": {
                            "message": cached_response["message"],
                            "sender_type": "orchestrator",
                            "receiver_type": "user",
                        }
                    })
                    return {
                        "response": cached_response["message"],
                        "session_id": self.session_id,
                        "tools_used": cached_response.get("tools_used", []),
                        "usage": cached_response.get("usage"),
                        "cached": True
                    }

            # Apply rate limiting if enabled
            if self.rate_limiter and TOKEN_MANAGEMENT_ENABLED:
                # Load recent context to estimate total input tokens
                recent_context = await self.load_chat_history(orchestrator_agent_id, limit=20)

                # Estimate TOTAL input tokens (context + new message)
                context_tokens = sum(
                    len(str(msg.get("message", ""))) // 4
                    for msg in recent_context.get("messages", [])
                )
                message_tokens = self.rate_limiter.estimate_tokens(user_message)
                total_estimated_tokens = context_tokens + message_tokens

                # Log the token estimation for monitoring
                self.logger.warning(
                    f"📊 Token Estimation: Context={context_tokens:,}, "
                    f"Message={message_tokens}, TOTAL={total_estimated_tokens:,}"
                )

                # Check and wait if necessary
                await self.rate_limiter.check_and_wait(total_estimated_tokens)

                if total_estimated_tokens > 15000:
                    self.logger.error(f"⚠️  HIGH TOKEN USAGE: {total_estimated_tokens:,} tokens may cause rate limiting!")
                else:
                    self.logger.info(f"✅ Token usage OK: {total_estimated_tokens:,} tokens")

            async with ClaudeSDKClient(options=options) as client:
                # Track execution state for interrupt support
                async with self._execution_lock:
                    self.active_client = client
                    self.is_executing = True

                # Send user's prompt
                await client.query(user_message)

                # Iterate through ALL messages (THE CORE LOOP)
                async for message in client.receive_response():

                    # Handle SystemMessage (informational, not agent output)
                    if isinstance(message, SystemMessage):
                        subtype = getattr(message, "subtype", "unknown")
                        data = getattr(message, "data", {})
                        self.logger.warning(
                            f"[OrchestratorService] SystemMessage received:\n"
                            f"  Subtype: {subtype}\n"
                            f"  Data: {data}\n"
                        )

                        # NEW: Store SystemMessage data in orchestrator metadata (ONCE per boot)
                        if not self._system_message_captured:
                            try:
                                from .database import update_orchestrator_metadata
                                from .slash_command_parser import discover_slash_commands
                                from . import config

                                # Discover slash commands from orchestrator's .claude/commands/ directory
                                slash_commands = discover_slash_commands(str(config.PROJECT_ROOT))

                                # Extract relevant fields for display
                                system_message_info = {
                                    "session_id": data.get("session_id"),
                                    "cwd": data.get("cwd"),
                                    "tools": data.get("tools", []),
                                    "model": data.get("model"),
                                    "subtype": subtype,
                                    "captured_at": datetime.now(
                                        timezone.utc
                                    ).isoformat(),
                                    "slash_commands": slash_commands,  # Store slash commands
                                }

                                # Store in metadata - IMPORTANT: Pass orchestrator_agent_id to update only THIS agent
                                await update_orchestrator_metadata(
                                    orchestrator_agent_id=orch_uuid,
                                    metadata_updates={"system_message_info": system_message_info}
                                )

                                # Mark as captured so we don't overwrite on subsequent messages
                                self._system_message_captured = True

                                self.logger.info(
                                    f"✅ Stored SystemMessage data in orchestrator metadata (including {len(slash_commands)} slash commands)"
                                )
                            except Exception as e:
                                raise e
                        else:
                            self.logger.debug(
                                "SystemMessage already captured, skipping metadata update"
                            )

                        # SystemMessages are informational - log but don't process as agent output
                        continue

                    # Process AssistantMessage blocks
                    if isinstance(message, AssistantMessage):
                        for block in message.content:

                            # Capture and stream text responses
                            if isinstance(block, TextBlock):
                                response_text += block.text

                                # Save this TextBlock chunk to database immediately
                                try:
                                    message_id = await insert_chat_message(
                                        orchestrator_agent_id=orch_uuid,
                                        sender_type="orchestrator",
                                        receiver_type="user",
                                        message=block.text,
                                        agent_id=None,
                                        metadata={"type": "text_chunk"},
                                    )

                                    # Generate AI summary in background
                                    asyncio.create_task(
                                        self._summarize_and_update_chat(
                                            message_id, block.text
                                        )
                                    )

                                    # Broadcast chunk to event stream with database ID
                                    await self.ws_manager.broadcast(
                                        {
                                            "type": "orchestrator_chat",
                                            "message": {
                                                "id": str(message_id),
                                                "orchestrator_agent_id": str(orch_uuid),
                                                "sender_type": "orchestrator",
                                                "receiver_type": "user",
                                                "message": block.text,
                                                "agent_id": None,
                                                "metadata": {"type": "text_chunk"},
                                                "timestamp": datetime.now().isoformat(),
                                            },
                                        }
                                    )
                                except Exception as e:
                                    self.logger.error(
                                        f"Failed to save TextBlock chunk: {e}"
                                    )

                            # Capture thinking blocks
                            elif isinstance(block, ThinkingBlock):
                                self.logger.debug(
                                    f"Orchestrator thinking: {block.thinking[:100]}..."
                                )

                                # Save ThinkingBlock to system_logs
                                try:
                                    log_id = await insert_system_log(
                                        level="INFO",
                                        message=f"Orchestrator thinking: {block.thinking[:100]}...",
                                        metadata={
                                            "type": "thinking_block",
                                            "thinking": block.thinking,
                                            "orchestrator_agent_id": str(orch_uuid),
                                        },
                                    )

                                    # Generate AI summary in background
                                    asyncio.create_task(
                                        self._summarize_and_update_system_log(
                                            log_id, block.thinking, "thinking"
                                        )
                                    )

                                    # Broadcast thinking block to event stream
                                    await self.ws_manager.broadcast(
                                        {
                                            "type": "thinking_block",
                                            "data": {
                                                "id": str(log_id),
                                                "orchestrator_agent_id": str(orch_uuid),
                                                "thinking": block.thinking,
                                                "timestamp": datetime.now().isoformat(),
                                            },
                                        }
                                    )
                                except Exception as e:
                                    self.logger.error(
                                        f"Failed to save ThinkingBlock: {e}"
                                    )

                            # Track tool usage
                            elif isinstance(block, ToolUseBlock):
                                tools_used.append(block.name)
                                self.logger.info(
                                    f"Orchestrator using tool: {block.name}"
                                )

                                # Save ToolUseBlock to system_logs
                                try:
                                    log_id = await insert_system_log(
                                        level="INFO",
                                        message=f"Orchestrator using tool: {block.name}",
                                        metadata={
                                            "type": "tool_use_block",
                                            "tool_name": block.name,
                                            "tool_input": block.input,
                                            "tool_use_id": block.id,
                                            "orchestrator_agent_id": str(orch_uuid),
                                        },
                                    )

                                    # Generate AI summary in background
                                    asyncio.create_task(
                                        self._summarize_and_update_system_log(
                                            log_id,
                                            f"Using tool: {block.name}",
                                            "tool_use",
                                            {
                                                "tool_name": block.name,
                                                "tool_input": block.input,
                                            },
                                        )
                                    )

                                    # Broadcast tool use block to event stream
                                    await self.ws_manager.broadcast(
                                        {
                                            "type": "tool_use_block",
                                            "data": {
                                                "id": str(log_id),
                                                "orchestrator_agent_id": str(orch_uuid),
                                                "tool_name": block.name,
                                                "tool_input": block.input,
                                                "tool_use_id": block.id,
                                                "timestamp": datetime.now().isoformat(),
                                            },
                                        }
                                    )
                                except Exception as e:
                                    self.logger.error(
                                        f"Failed to save ToolUseBlock: {e}"
                                    )

                    # Capture final session ID and usage
                    elif isinstance(message, ResultMessage):
                        result_message = (
                            message  # Store for cost extraction outside loop
                        )
                        final_session_id = message.session_id
                        usage_data = message.usage

                        # Extract cost from top-level field first (preferred)
                        cost = getattr(message, "total_cost_usd", None) or 0.0

                        # Log full ResultMessage details
                        self.logger.debug(
                            f"[OrchestratorService] ResultMessage received:\n"
                            f"  session_id: {message.session_id}\n"
                            f"  subtype: {getattr(message, 'subtype', 'N/A')}\n"
                            f"  duration_ms: {getattr(message, 'duration_ms', 'N/A')}\n"
                            f"  duration_api_ms: {getattr(message, 'duration_api_ms', 'N/A')}\n"
                            f"  is_error: {getattr(message, 'is_error', False)}\n"
                            f"  num_turns: {getattr(message, 'num_turns', 'N/A')}\n"
                            f"  result: {getattr(message, 'result', 'N/A')}\n"
                            f"  top_level_cost: {cost}\n"
                            f"  usage: {usage_data}\n"
                        )

                        # Fall back to usage cost if top-level is None/0.0
                        if cost == 0.0 and usage_data:
                            if isinstance(usage_data, dict):
                                cost = usage_data.get("total_cost_usd", 0.0)
                            else:
                                cost = getattr(usage_data, "total_cost_usd", 0.0)

                        self.logger.info(
                            f"Orchestrator session complete | "
                            f"turns: {message.num_turns} | "
                            f"cost: ${cost:.4f}"
                        )

                        # Track costs if cost tracker is enabled
                        if self.cost_tracker and TOKEN_MANAGEMENT_ENABLED and usage_data:
                            # Track token usage
                            if isinstance(usage_data, dict):
                                input_tokens = usage_data.get("input_tokens", 0)
                                output_tokens = usage_data.get("output_tokens", 0)
                            else:
                                input_tokens = getattr(usage_data, "input_tokens", 0)
                                output_tokens = getattr(usage_data, "output_tokens", 0)

                            # Use record_usage instead of track_usage
                            usage_result = self.cost_tracker.record_usage(
                                session_id=str(orch_uuid),
                                input_tokens=input_tokens,
                                output_tokens=output_tokens,
                                model=selected_model,  # Use the actual model selected
                                context=f"Message: {user_message[:50]}..."
                            )

                            # Check if we've exceeded cost threshold
                            if self.cost_tracker.check_threshold():
                                alert_msg = f"⚠️ Cost Alert: Total cost ${self.cost_tracker.get_total_cost():.2f} exceeded threshold ${COST_ALERT_THRESHOLD_USD}"
                                self.logger.warning(alert_msg)
                                await self.ws_manager.broadcast({
                                    "type": "system_log",
                                    "data": {
                                        "level": "WARNING",
                                        "message": alert_msg,
                                        "timestamp": datetime.now().isoformat(),
                                    }
                                })

                        # Update rate limiter with actual tokens used
                        if self.rate_limiter and TOKEN_MANAGEMENT_ENABLED and usage_data:
                            if isinstance(usage_data, dict):
                                actual_tokens = usage_data.get("input_tokens", 0) + usage_data.get("output_tokens", 0)
                            else:
                                actual_tokens = getattr(usage_data, "input_tokens", 0) + getattr(usage_data, "output_tokens", 0)
                            self.rate_limiter.update_actual_usage(actual_tokens)

            # Clear typing indicator (streaming is complete)
            await self.ws_manager.set_typing_indicator(orchestrator_agent_id, False)

            # Send completion signal to clear typing indicator in chat UI
            await self.ws_manager.broadcast(
                {
                    "type": "chat_stream",
                    "chunk": "",
                    "is_complete": True,
                }
            )

        except Exception as e:
            self.logger.error(f"Orchestrator execution failed: {e}")
            await self.ws_manager.set_typing_indicator(orchestrator_agent_id, False)
            await self.ws_manager.broadcast_error(
                error_message="Orchestrator execution failed", details={"error": str(e)}
            )
            raise

        finally:
            # Always reset execution state when done (success or failure)
            async with self._execution_lock:
                self.is_executing = False
                self.active_client = None
            self.logger.debug("Orchestrator execution state reset")

        # ═══════════════════════════════════════════════════════════
        # PHASE 3: POST-EXECUTION - Log response, update costs
        # ═══════════════════════════════════════════════════════════

        # Update orchestrator's session for next interaction
        if final_session_id:
            self.session_id = final_session_id

            # ONLY update database if this is a NEW orchestrator (didn't start with session_id)
            # For resumed orchestrators (started with --session), we skip database update
            if not self.started_with_session:
                try:
                    await update_orchestrator_session(orch_uuid, final_session_id)
                    self.logger.info(
                        f"Updated database with new session_id: {final_session_id[:20]}..."
                    )
                except Exception as e:
                    self.logger.error(f"Failed to update session: {e}")
            else:
                self.logger.debug(
                    f"Skipping session_id database update (resumed session)"
                )

        # Cache the response if cache is enabled and we have a cache key
        if self.response_cache and RESPONSE_CACHE_ENABLED and cache_key and response_text:
            cache_data = {
                "message": response_text,
                "tools_used": tools_used,
                "usage": usage_data,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            await self.response_cache.set(cache_key, cache_data)
            self.logger.info(f"Cached response for future queries")

        # Update costs in database
        # Extract cost from top-level field first (preferred) - using stored result_message
        cost_usd = 0.0
        input_tokens = 0
        output_tokens = 0

        if result_message:
            # Extract cost from top-level field first (preferred)
            cost_usd = getattr(result_message, "total_cost_usd", None) or 0.0

        # Extract token counts from usage dict/object
        if usage_data:
            # Handle both dict and object formats
            if isinstance(usage_data, dict):
                input_tokens = usage_data.get("input_tokens", 0)
                output_tokens = usage_data.get("output_tokens", 0)
                # Fall back to usage cost if top-level is None/0.0
                if cost_usd == 0.0:
                    cost_usd = usage_data.get("total_cost_usd", 0.0)
            else:
                input_tokens = getattr(usage_data, "input_tokens", 0)
                output_tokens = getattr(usage_data, "output_tokens", 0)
                # Fall back to usage cost if top-level is None/0.0
                if cost_usd == 0.0:
                    cost_usd = getattr(usage_data, "total_cost_usd", 0.0)

        # Log what we're about to update
        self.logger.debug(
            f"[OrchestratorService] Updating costs: "
            f"input_tokens={input_tokens}, output_tokens={output_tokens}, cost_usd=${cost_usd:.6f}"
        )

        try:
            # Call database update and get detailed response
            # IMPORTANT: Pass orchestrator_agent_id to ensure we only update THIS agent, not all agents
            update_result = await update_orchestrator_costs(
                orchestrator_agent_id=orch_uuid,
                input_tokens=input_tokens or 0,
                output_tokens=output_tokens or 0,
                cost_usd=cost_usd or 0.0,
            )

            # Log detailed results
            if update_result.get("success"):
                self.logger.info(
                    f"✅ Updated orchestrator costs successfully:\n"
                    f"  Rows Updated: {update_result.get('rows_updated', 0)}\n"
                    f"  Orchestrator ID: {update_result.get('id', 'N/A')}\n"
                    f"  New Total Tokens: {update_result.get('input_tokens', 0) + update_result.get('output_tokens', 0)}\n"
                    f"  New Total Cost: ${update_result.get('total_cost', 0.0):.6f}\n"
                    f"  Updated At: {update_result.get('updated_at', 'N/A')}"
                )

                # Broadcast orchestrator update via WebSocket for live frontend updates
                await self.ws_manager.broadcast_orchestrator_updated(
                    {
                        "id": update_result.get("id"),
                        "input_tokens": update_result.get("input_tokens", 0),
                        "output_tokens": update_result.get("output_tokens", 0),
                        "total_cost": update_result.get("total_cost", 0.0),
                        "updated_at": update_result.get("updated_at"),
                    }
                )
                self.logger.debug("📡 Broadcast orchestrator cost update via WebSocket")
            else:
                self.logger.error(
                    f"❌ Database update reported failure:\n"
                    f"  Error: {update_result.get('error', 'Unknown error')}\n"
                    f"  Rows Updated: {update_result.get('rows_updated', 0)}"
                )

        except Exception as e:
            self.logger.error(
                f"❌ Failed to update costs (exception): {e}", exc_info=True
            )

        # Note: Each TextBlock chunk is saved individually as it streams in
        # This allows real-time display in chat UI
        self.logger.chat_event(
            orchestrator_agent_id, response_text, sender="orchestrator"
        )

        return {
            "ok": True,
            "response": response_text.strip(),
            "session_id": final_session_id or self.session_id,
            "tools_used": tools_used,
            "cost_usd": cost_usd,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
        }

    # ═══════════════════════════════════════════════════════════
    # HELPER METHODS - AI Summarization
    # ═══════════════════════════════════════════════════════════

    async def _summarize_and_update_chat(
        self, chat_id: uuid.UUID, message: str
    ) -> None:
        """
        Generate AI summary for chat message and update database (background task).

        Args:
            chat_id: UUID of the chat message to update
            message: The message text content
        """
        try:
            # Build event data for summarization
            event_data = {"content": message}

            # Generate AI summary (uses Claude Haiku for speed/cost)
            summary = await summarize_event(event_data, "text")

            # Update database with summary (only if non-empty)
            if summary and summary.strip():
                await update_chat_summary(chat_id, summary)
                self.logger.debug(
                    f"[OrchestratorService:Summary] Generated summary for chat_id={chat_id}: {summary}"
                )
            else:
                self.logger.warning(
                    f"[OrchestratorService:Summary] Empty summary for chat_id={chat_id}"
                )

        except Exception as e:
            self.logger.error(
                f"[OrchestratorService:Summary] Failed for chat_id={chat_id}: {e}"
            )

    async def _summarize_and_update_system_log(
        self,
        log_id: uuid.UUID,
        message: str,
        event_type: str,
        event_data: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Generate AI summary for system log and update database (background task).

        Args:
            log_id: UUID of the system log to update
            message: The log message content
            event_type: Type of event (thinking, tool_use, etc.)
            event_data: Optional additional event data for better summarization
        """
        try:
            # Build event data for summarization
            if event_data is None:
                event_data = {"content": message}
            else:
                # Merge message with event_data
                event_data["content"] = message

            # Generate AI summary (uses Claude Haiku for speed/cost)
            summary = await summarize_event(event_data, event_type)

            # Update database with summary (only if non-empty)
            if summary and summary.strip():
                await update_system_log_summary(log_id, summary)
                self.logger.debug(
                    f"[OrchestratorService:Summary] Generated summary for system_log_id={log_id}: {summary}"
                )
            else:
                self.logger.warning(
                    f"[OrchestratorService:Summary] Empty summary for system_log_id={log_id}"
                )

        except Exception as e:
            self.logger.error(
                f"[OrchestratorService:Summary] Failed for system_log_id={log_id}: {e}"
            )

    async def get_token_metrics(self) -> Dict[str, Any]:
        """
        Get current token optimization metrics.

        Returns:
            Dictionary with token usage stats, cache performance, and cost data
        """
        metrics = {
            "enabled": TOKEN_MANAGEMENT_ENABLED,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        if not TOKEN_MANAGEMENT_ENABLED:
            return metrics

        # Context manager stats
        if self.context_manager:
            metrics["context"] = {
                "max_messages": MAX_CONTEXT_MESSAGES,
                "max_tokens": MAX_CONTEXT_TOKENS,
            }

        # Cache stats
        if self.response_cache:
            cache_stats = await self.response_cache.get_stats()
            metrics["cache"] = {
                "enabled": RESPONSE_CACHE_ENABLED,
                "hit_rate": cache_stats.get("hit_rate", 0),
                "entries": cache_stats.get("entries", 0),
                "size_mb": cache_stats.get("size_mb", 0),
                "ttl_seconds": RESPONSE_CACHE_TTL_SECONDS
            }

        # Rate limiter stats
        if self.rate_limiter:
            rate_stats = self.rate_limiter.get_usage_stats()
            metrics["rate_limiter"] = {
                "tokens_per_minute": RATE_LIMIT_TOKENS_PER_MINUTE,
                "current_usage": rate_stats.get("current_usage", 0),
                "usage_percentage": rate_stats.get("usage_percentage", 0),
                "time_until_reset": rate_stats.get("time_until_reset", 0)
            }

        # Cost tracker stats
        if self.cost_tracker:
            metrics["costs"] = {
                "total_cost_usd": self.cost_tracker.get_total_cost(),
                "total_input_tokens": self.cost_tracker.get_total_input_tokens(),
                "total_output_tokens": self.cost_tracker.get_total_output_tokens(),
                "threshold_usd": COST_ALERT_THRESHOLD_USD,
                "threshold_exceeded": self.cost_tracker.check_threshold(),
                "breakdown": self.cost_tracker.get_detailed_report()
            }

        return metrics

    async def clear_cache(self) -> Dict[str, Any]:
        """
        Clear the response cache.

        Returns:
            Dictionary with operation status
        """
        if not self.response_cache:
            return {"success": False, "error": "Cache not enabled"}

        try:
            cleared_count = await self.response_cache.clear()
            return {
                "success": True,
                "cleared_entries": cleared_count,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            self.logger.error(f"Failed to clear cache: {e}")
            return {"success": False, "error": str(e)}
