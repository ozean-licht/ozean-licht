#!/usr/bin/env python3
"""
Configuration module for Orchestrator 3 Stream
Central location for application-wide settings and constants
Uses classic Python logging (not Rich) for configuration loading
"""

from pathlib import Path
import os
import logging
from typing import List
from dotenv import load_dotenv

# Set up classic Python logging for config loading
logging.basicConfig(
    level=logging.INFO, format="[CONFIG] %(levelname)s: %(message)s", force=True
)
config_logger = logging.getLogger(__name__)

# Get the project root (orchestrator_3_stream/)
PROJECT_ROOT = Path(__file__).parent.parent.parent.resolve()
ENV_FILE = PROJECT_ROOT / ".env"

# Load .env file
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
    config_logger.info(f"Loaded environment variables from {ENV_FILE}")
else:
    config_logger.warning(f".env file not found at {ENV_FILE}, using defaults")
    load_dotenv()  # Try to load from current directory

# ============================================================================
# PATH CONFIGURATION
# ============================================================================

# Get the backend directory
BACKEND_DIR = Path(__file__).parent.parent.resolve()

# Default codebase path for agents to work within
DEFAULT_CODEBASE_PATH = str(BACKEND_DIR.parent.parent.parent)

# ============================================================================
# SERVER CONFIGURATION
# ============================================================================

# Backend Configuration
BACKEND_HOST = os.getenv("BACKEND_HOST", "127.0.0.1")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "9403"))

# Frontend Configuration
FRONTEND_HOST = os.getenv("FRONTEND_HOST", "127.0.0.1")
FRONTEND_PORT = int(os.getenv("FRONTEND_PORT", "5175"))

# WebSocket Configuration
WEBSOCKET_URL = os.getenv("WEBSOCKET_URL", f"ws://{BACKEND_HOST}:{BACKEND_PORT}/ws")

# Computed URLs
BACKEND_URL = f"http://{BACKEND_HOST}:{BACKEND_PORT}"
FRONTEND_URL = f"http://{FRONTEND_HOST}:{FRONTEND_PORT}"

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

# PostgreSQL connection string from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost:5432/orchestrator")
DATABASE_POOL_SIZE = int(os.getenv("DATABASE_POOL_SIZE", "10"))
DATABASE_MAX_OVERFLOW = int(os.getenv("DATABASE_MAX_OVERFLOW", "20"))

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_DIR = Path(os.getenv("LOG_DIR", "backend/logs"))

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS", f"http://{FRONTEND_HOST}:{FRONTEND_PORT}"
).split(",")

# ============================================================================
# AGENT CONFIGURATION
# ============================================================================

# Default model for agents
DEFAULT_MODEL = "claude-sonnet-4-5-20250929"

FAST_MODEL = "claude-haiku-4-5-20251001"

# Available models
AVAILABLE_MODELS = ["claude-sonnet-4-5-20250929", "claude-haiku-4-5-20251001"]

# ============================================================================
# ORCHESTRATOR CONFIGURATION
# ============================================================================

# Orchestrator agent model
ORCHESTRATOR_MODEL = os.getenv("ORCHESTRATOR_MODEL", DEFAULT_MODEL)

# Orchestrator system prompt path
ORCHESTRATOR_SYSTEM_PROMPT_PATH = os.getenv(
    "ORCHESTRATOR_SYSTEM_PROMPT_PATH",
    str(BACKEND_DIR / "prompts" / "orchestrator_agent_system_prompt.md"),
)

# Orchestrator working directory (can be overridden via --cwd CLI flag)
ORCHESTRATOR_WORKING_DIR = os.getenv("ORCHESTRATOR_WORKING_DIR", DEFAULT_CODEBASE_PATH)

# Current working directory (runtime override)
_current_working_dir = ORCHESTRATOR_WORKING_DIR


def set_working_dir(path: str) -> None:
    """
    Dynamically override the working directory at runtime.

    Used when --cwd CLI flag is provided to override default.

    Args:
        path: Absolute path to working directory
    """
    global _current_working_dir
    _current_working_dir = path
    config_logger.info(f"Working directory overridden: {path}")


def get_working_dir() -> str:
    """
    Get the current working directory.

    Returns:
        Current working directory path
    """
    return _current_working_dir


# ============================================================================
# AGENT CONFIGURATION
# ============================================================================

# Default model for managed agents
DEFAULT_AGENT_MODEL = os.getenv("DEFAULT_AGENT_MODEL", DEFAULT_MODEL)

# Agent system prompt template path
AGENT_SYSTEM_PROMPT_TEMPLATE_PATH = os.getenv(
    "AGENT_SYSTEM_PROMPT_TEMPLATE_PATH",
    str(BACKEND_DIR / "prompts" / "managed_agent_system_prompt_template.md"),
)

# Maximum turns for agent execution
MAX_AGENT_TURNS = int(os.getenv("MAX_AGENT_TURNS", "500"))

# ============================================================================
# LOG QUERY LIMITS
# ============================================================================

# Default limit for agent log queries
DEFAULT_AGENT_LOG_LIMIT = int(os.getenv("DEFAULT_AGENT_LOG_LIMIT", "50"))

# Default limit for system log queries
DEFAULT_SYSTEM_LOG_LIMIT = int(os.getenv("DEFAULT_SYSTEM_LOG_LIMIT", "50"))

# Default limit for chat history queries
# Load 300 messages for full context, but use smart summarization to condense
# Older messages are summarized while recent ones are kept in full detail
DEFAULT_CHAT_HISTORY_LIMIT = int(os.getenv("DEFAULT_CHAT_HISTORY_LIMIT", "300"))

# ============================================================================
# TOKEN MANAGEMENT CONFIGURATION
# ============================================================================

# Feature flag to enable/disable token optimization system
TOKEN_MANAGEMENT_ENABLED = os.getenv("TOKEN_MANAGEMENT_ENABLED", "true").lower() in ["true", "1", "yes"]

# Context window limits - Uses smart summarization to maintain long-term memory
#
# STRATEGY: Load full history but use MessageSummarizer to condense old messages
# - Recent messages (0-30): Keep in full detail
# - Mid-range (31-100): Light summarization
# - Old messages (101+): Heavy summarization into conversation segments
#
# This allows orchestrator to:
# - Remember user intent from 200+ messages ago
# - Track agent lifecycle across long conversations
# - Stay under token limits without losing context
#
# Claude Sonnet 4.5 has 200k context window, we target ~40-50k for safety:
# - System prompt + tools + CLAUDE.md: ~5-10k tokens
# - Summarized old messages: ~5-10k tokens
# - Recent messages (30-50 full): ~20-30k tokens
# - Total: ~40-50k tokens (leaves 150k for response)
MAX_CONTEXT_MESSAGES = int(os.getenv("MAX_CONTEXT_MESSAGES", "200"))  # Before summarization
MAX_CONTEXT_TOKENS = int(os.getenv("MAX_CONTEXT_TOKENS", "200000"))  # Full window - summarizer keeps ~50k

# Rate limiting (Full 1M/minute API limit with 80% backoff)
RATE_LIMIT_TOKENS_PER_MINUTE = int(os.getenv("RATE_LIMIT_TOKENS_PER_MINUTE", "1000000"))
RATE_LIMIT_BACKOFF_THRESHOLD = float(os.getenv("RATE_LIMIT_BACKOFF_THRESHOLD", "0.8"))

# Response caching - ENABLED with smart summarization
# With message summarization, context stays reasonable (~40-50k tokens)
# Cache helps with repeated queries and reduces API calls
RESPONSE_CACHE_ENABLED = os.getenv("RESPONSE_CACHE_ENABLED", "true").lower() in ["true", "1", "yes"]
RESPONSE_CACHE_MAX_SIZE = int(os.getenv("RESPONSE_CACHE_MAX_SIZE", "100"))
RESPONSE_CACHE_TTL_SECONDS = int(os.getenv("RESPONSE_CACHE_TTL_SECONDS", "3600"))

# Cost tracking and alerts
COST_TRACKING_ENABLED = os.getenv("COST_TRACKING_ENABLED", "true").lower() in ["true", "1", "yes"]
COST_ALERT_THRESHOLD = float(os.getenv("COST_ALERT_THRESHOLD", "10.0"))
COST_CRITICAL_THRESHOLD = float(os.getenv("COST_CRITICAL_THRESHOLD", "50.0"))

# ============================================================================
# TIMEOUT CONFIGURATION
# ============================================================================

# Database operation timeouts
# Increased from 60s to 180s to allow sufficient time for complex orchestrator operations
DATABASE_COMMAND_TIMEOUT = int(os.getenv("DATABASE_COMMAND_TIMEOUT", "180"))

# Claude SDK timeout for API calls (5 minutes for complex operations)
# This ensures long-running agent operations don't timeout prematurely
CLAUDE_SDK_TIMEOUT = int(os.getenv("CLAUDE_SDK_TIMEOUT", "300"))

# WebSocket keepalive configuration
# Ping interval prevents long-running connections from timing out
WEBSOCKET_PING_INTERVAL = int(os.getenv("WEBSOCKET_PING_INTERVAL", "30"))

# WebSocket connection timeout (how long to wait before considering connection dead)
WEBSOCKET_CONNECTION_TIMEOUT = int(os.getenv("WEBSOCKET_CONNECTION_TIMEOUT", "60"))

# ============================================================================
# IDE INTEGRATION CONFIGURATION
# ============================================================================

# IDE command for opening files (supports 'cursor' or 'code')
# Format: cursor {file} or code {file}
IDE_COMMAND = os.getenv("IDE_COMMAND", "code")
IDE_ENABLED = os.getenv("IDE_ENABLED", "true").lower() in ["true", "1", "yes"]

# ============================================================================
# STARTUP CONFIGURATION LOGGING
# ============================================================================

config_logger.info("=" * 70)
config_logger.info("ORCHESTRATOR 3 STREAM CONFIGURATION")
config_logger.info("=" * 70)
config_logger.info(f"Backend URL:     {BACKEND_URL}")
config_logger.info(f"Frontend URL:    {FRONTEND_URL}")
config_logger.info(f"WebSocket URL:   {WEBSOCKET_URL}")
config_logger.info(
    f"Database URL:    {DATABASE_URL[:40]}..."
    if len(DATABASE_URL) > 40
    else f"Database URL:    {DATABASE_URL}"
)
config_logger.info(f"Log Level:       {LOG_LEVEL}")
config_logger.info(f"Log Directory:   {LOG_DIR}")
config_logger.info(f"CORS Origins:    {', '.join(CORS_ORIGINS)}")
config_logger.info("-" * 70)
config_logger.info("TOKEN MANAGEMENT:")
config_logger.info(f"  Enabled:       {TOKEN_MANAGEMENT_ENABLED}")
if TOKEN_MANAGEMENT_ENABLED:
    config_logger.info(f"  Max Context:   {MAX_CONTEXT_MESSAGES} messages / {MAX_CONTEXT_TOKENS:,} tokens")
    config_logger.info(f"  Chat History:  {DEFAULT_CHAT_HISTORY_LIMIT} messages (smart summarization enabled)")
    config_logger.info(f"  Rate Limit:    {RATE_LIMIT_TOKENS_PER_MINUTE:,} tokens/min")
    config_logger.info(f"  Cache:         {RESPONSE_CACHE_ENABLED} (with summarized context)")
    config_logger.info(f"  Cost Alerts:   ${COST_ALERT_THRESHOLD:.2f} (warn) / ${COST_CRITICAL_THRESHOLD:.2f} (critical)")
config_logger.info("-" * 70)
config_logger.info("TIMEOUT CONFIGURATION:")
config_logger.info(f"  Database:      {DATABASE_COMMAND_TIMEOUT}s (command timeout)")
config_logger.info(f"  Claude SDK:    {CLAUDE_SDK_TIMEOUT}s (API timeout)")
config_logger.info(f"  WebSocket:     {WEBSOCKET_PING_INTERVAL}s (ping) / {WEBSOCKET_CONNECTION_TIMEOUT}s (timeout)")
config_logger.info("=" * 70)
