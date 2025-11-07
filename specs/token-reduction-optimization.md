# Plan: Token Reduction and Rate Limit Optimization for Orchestrator

## Task Description

Implement comprehensive token optimization strategies to reduce the orchestrator's token usage from current spikes of 900k+ tokens/minute to sustainable levels below 400k tokens/minute. This includes adding context windowing, caching, rate limiting, cost tracking with alerts, and hybrid model selection to prevent rate limiting issues and reduce operational costs.

## Objective

Create a robust token management system that:
- Prevents rate limit errors (currently hitting 1M tokens/minute limit)
- Reduces context size through intelligent windowing and summarization
- Caches repetitive queries to avoid redundant API calls
- Tracks token usage in real-time with cost alerts
- Implements proactive rate limiting to stay within API quotas
- Reduces operational costs by 50-70% through optimization

## Problem Statement

The orchestrator is experiencing critical issues with token usage:
- **Rate Limiting**: Hitting 900k+ input tokens per minute, approaching the 1M/minute API limit
- **High Costs**: Excessive token usage leading to unsustainable API costs
- **No Context Management**: Chat history grows unbounded, inflating input tokens
- **Redundant Queries**: No caching mechanism for repetitive operations
- **No Prevention**: Only tracking costs after the fact, no proactive limits

These issues cause:
- Service interruptions when rate limits are hit
- Unpredictable and high API costs
- Degraded performance due to large context windows
- Inability to scale to multiple concurrent orchestrators

## Solution Approach

Implement a multi-layered optimization strategy:

1. **Context Management**: Limit chat history to recent N messages and implement rolling summarization
2. **Response Caching**: Cache frequently accessed queries and responses with TTL
3. **Rate Limiting**: Track token usage per minute and implement exponential backoff
4. **Cost Tracking**: Real-time token monitoring with configurable alert thresholds
5. **Database Optimization**: Add chat history limits at query level
6. **Configuration**: Centralize all optimization settings in config module

This approach addresses both immediate rate limiting issues and long-term cost optimization.

## Relevant Files

### Existing Files to Modify

- **apps/orchestrator_3_stream/backend/modules/config.py** - Add token management configuration constants (max context tokens, cache TTL, rate limits, alert thresholds)
- **apps/orchestrator_3_stream/backend/modules/orchestrator_service.py** - Integrate context manager, cache, and rate limiter into message processing flow (lines 452-934)
- **apps/orchestrator_3_stream/backend/modules/database.py** - Add chat history query limits and implement summary-based history loading
- **apps/orchestrator_3_stream/backend/main.py** - Add cost tracking endpoint and token metrics for monitoring
- **apps/orchestrator_3_stream/.env.sample** - Document new environment variables for token management
- **apps/orchestrator_3_stream/backend/modules/single_agent_prompt.py** - Already uses Haiku for summaries (good!), verify optimal usage

### New Files

- **apps/orchestrator_3_stream/backend/modules/context_manager.py** - Implements context windowing and token estimation
- **apps/orchestrator_3_stream/backend/modules/response_cache.py** - Implements response caching with TTL and LRU eviction
- **apps/orchestrator_3_stream/backend/modules/rate_limiter.py** - Implements token-based rate limiting with exponential backoff
- **apps/orchestrator_3_stream/backend/modules/cost_tracker.py** - Real-time token/cost tracking with alert thresholds
- **apps/orchestrator_3_stream/backend/modules/conversation_summarizer.py** - Periodic chat history summarization using Haiku

## Implementation Phases

### Phase 1: Foundation (Configuration & Core Modules)

**Goal**: Create the core optimization modules and configuration system

**Tasks**:
1. Add token management configuration to config.py
2. Create ContextManager module for token estimation and windowing
3. Create ResponseCache module with TTL and hash-based keys
4. Create RateLimiter module with per-minute token tracking
5. Create CostTracker module for real-time monitoring
6. Update .env.sample with new configuration options

**Deliverables**:
- Reusable optimization modules with comprehensive tests
- Centralized configuration for easy tuning
- Foundation for Phase 2 integration

### Phase 2: Core Integration (Orchestrator Service)

**Goal**: Integrate optimization modules into orchestrator message flow

**Tasks**:
1. Add ContextManager to OrchestratorService initialization
2. Implement cache checking before API calls
3. Add rate limiting before agent execution
4. Integrate cost tracking for all API calls
5. Modify load_chat_history to apply context limits
6. Add token estimation before query execution

**Deliverables**:
- Fully integrated token optimization in orchestrator
- Reduced context size in production
- Automatic rate limiting protection

### Phase 3: Advanced Features (Summarization & Monitoring)

**Goal**: Add conversation summarization and monitoring endpoints

**Tasks**:
1. Create ConversationSummarizer module
2. Implement periodic chat history summarization
3. Add /api/metrics/tokens endpoint for real-time monitoring
4. Add /api/metrics/cache endpoint for cache statistics
5. Create admin tool for manual cache clearing
6. Add WebSocket events for cost alerts

**Deliverables**:
- Automatic chat history compaction
- Real-time monitoring dashboard data
- Proactive cost alerts

## Step by Step Tasks

### 1. Add Token Management Configuration

**File**: `apps/orchestrator_3_stream/backend/modules/config.py`

- Add new configuration section for token management
- Define max context tokens (50,000 recommended)
- Define max messages in memory (10-20 recommended)
- Define rate limit per minute (400,000 to stay at 40% of limit)
- Define cache TTL (60 minutes recommended)
- Define cost alert threshold ($10 recommended)
- Load all values from environment with sensible defaults
- Log token management settings on startup

**Rationale**: Centralized configuration makes tuning easy and provides documentation of optimization strategy.

### 2. Create ContextManager Module

**File**: `apps/orchestrator_3_stream/backend/modules/context_manager.py`

- Create `ContextManager` class with max_tokens and max_messages parameters
- Implement `add_message()` method to append messages to rolling buffer
- Implement `estimate_tokens()` method (rough estimate: 1 token ≈ 4 characters)
- Implement `get_context()` method returning only recent N messages
- Implement `trim_to_limit()` method that removes oldest messages when over limit
- Add `get_context_stats()` for monitoring (message count, estimated tokens, percentage used)
- Support for both message-based and token-based windowing

**Rationale**: Prevents unbounded context growth which is the primary cause of high token usage.

### 3. Create ResponseCache Module

**File**: `apps/orchestrator_3_stream/backend/modules/response_cache.py`

- Create `ResponseCache` class with TTL and max size parameters
- Implement `get_cache_key()` using MD5 hash of prompt + context
- Implement `get()` method checking TTL expiration
- Implement `set()` method storing response with timestamp
- Implement `clear()` method for manual cache reset
- Implement `get_stats()` returning hit rate, size, and entries
- Use LRU eviction when max cache size is reached
- Support for cache warming with common queries

**Rationale**: Eliminates redundant API calls for repetitive queries, especially during debugging and testing.

### 4. Create RateLimiter Module

**File**: `apps/orchestrator_3_stream/backend/modules/rate_limiter.py`

- Create `RateLimiter` class with tokens_per_minute limit
- Track tokens used in current minute window
- Implement `check_and_wait()` async method that estimates request cost
- If approaching limit, sleep until window resets
- Track window start time and reset after 60 seconds
- Implement exponential backoff if rate limit is hit
- Add `get_usage_stats()` for monitoring (current usage, time until reset)
- Support for request queue and prioritization

**Rationale**: Proactively prevents rate limit errors by throttling before hitting API limits.

### 5. Create CostTracker Module

**File**: `apps/orchestrator_3_stream/backend/modules/cost_tracker.py`

- Create `CostTracker` class with cost models for each Claude model
- Track cumulative input/output tokens and costs
- Implement `track()` method recording usage per request
- Implement `get_total_cost()` returning cumulative cost
- Implement `check_threshold()` alerting when threshold exceeded
- Implement `reset_daily()` for daily cost tracking
- Add `get_detailed_report()` with per-model breakdowns
- Support for budget limits and auto-pause when exceeded

**Rationale**: Real-time cost visibility enables proactive budget management and prevents cost surprises.

### 6. Create ConversationSummarizer Module

**File**: `apps/orchestrator_3_stream/backend/modules/conversation_summarizer.py`

- Create `ConversationSummarizer` class with summary_threshold parameter
- Implement `summarize_conversation()` using Claude Haiku
- Summarize every N messages (20 recommended) into 200-word summary
- Extract key decisions, current task status, and important context
- Replace old messages with summary in context
- Implement `should_summarize()` checking message count
- Add `get_last_summary()` for display purposes

**Rationale**: Maintains context continuity while drastically reducing token count in long conversations.

### 7. Integrate ContextManager into OrchestratorService

**File**: `apps/orchestrator_3_stream/backend/modules/orchestrator_service.py`

- Import ContextManager in `__init__()`
- Initialize self.context_manager with config limits
- Modify `load_chat_history()` to use context_manager.get_context()
- Before API call, estimate tokens and check against limit
- After receiving response, add to context_manager
- Replace old chat history loading with context-aware version
- Add context stats to session metadata

**Changes at**:
- Line 99-148: Add context_manager initialization
- Line 363-450: Modify load_chat_history to apply limits
- Line 452-534: Add token estimation before execution

**Rationale**: Integrates context windowing into the core message flow, reducing input tokens per request.

### 8. Integrate ResponseCache into OrchestratorService

**File**: `apps/orchestrator_3_stream/backend/modules/orchestrator_service.py`

- Import ResponseCache in `__init__()`
- Initialize self.cache with config TTL
- Before calling client.query(), check cache with get()
- Build cache key from prompt + last N messages
- If cached, return cached response and skip API call
- After API response, cache with set()
- Add cache stats to monitoring endpoint

**Changes at**:
- Line 99-148: Add cache initialization
- Line 533-813: Add cache check/set around API calls

**Rationale**: Eliminates redundant API calls for repeated queries, saving tokens and cost.

### 9. Integrate RateLimiter into OrchestratorService

**File**: `apps/orchestrator_3_stream/backend/modules/orchestrator_service.py`

- Import RateLimiter in `__init__()`
- Initialize self.rate_limiter with config limit
- Before calling client.query(), estimate token cost
- Call rate_limiter.check_and_wait(estimated_tokens)
- If approaching limit, rate_limiter will sleep automatically
- After response, track actual tokens used
- Broadcast rate limit warnings via WebSocket

**Changes at**:
- Line 99-148: Add rate_limiter initialization
- Line 533-545: Add rate limit check before query

**Rationale**: Prevents rate limit errors by throttling before hitting API limits.

### 10. Integrate CostTracker into OrchestratorService

**File**: `apps/orchestrator_3_stream/backend/modules/orchestrator_service.py`

- Import CostTracker in `__init__()`
- Initialize self.cost_tracker
- After each API response, call cost_tracker.track()
- Check threshold after each request
- If threshold exceeded, broadcast alert via WebSocket
- Add cost stats to report_cost tool

**Changes at**:
- Line 99-148: Add cost_tracker initialization
- Line 876-918: Add cost tracking after usage extraction
- Line 536-597: Add threshold check in report_cost tool

**Rationale**: Provides real-time cost visibility and alerts for budget management.

### 11. Optimize Database Chat History Queries

**File**: `apps/orchestrator_3_stream/backend/modules/database.py`

- Modify get_chat_history() to accept max_tokens parameter
- Implement summary-only history loading for old messages
- Query summaries instead of full message content for messages beyond N
- Only load full content for most recent N messages
- Add get_chat_history_with_summaries() variant
- Optimize query with proper indexing on created_at

**Rationale**: Reduces database payload and context size by loading summaries for old messages.

### 12. Add Monitoring Endpoints

**File**: `apps/orchestrator_3_stream/backend/main.py`

- Add GET /api/metrics/tokens endpoint returning token usage stats
- Add GET /api/metrics/cache endpoint returning cache hit rates
- Add GET /api/metrics/costs endpoint returning cost breakdown
- Add POST /api/cache/clear endpoint for admin cache reset
- Include rate limiter stats in /health endpoint
- Add WebSocket events for cost threshold alerts

**Rationale**: Enables real-time monitoring and management of optimization systems.

### 13. Add Conversation Summarization Integration

**File**: `apps/orchestrator_3_stream/backend/modules/orchestrator_service.py`

- Import ConversationSummarizer in `__init__()`
- Initialize self.summarizer with threshold (20 messages)
- After each message, check if summarization should trigger
- If yes, summarize last N messages and replace in context
- Store summary in database for persistence
- Add summarization stats to monitoring

**Changes at**:
- Line 99-148: Add summarizer initialization
- Line 821-843: Add summarization check after message processing

**Rationale**: Automatically compacts long conversations while maintaining context continuity.

### 14. Update Environment Configuration

**File**: `apps/orchestrator_3_stream/.env.sample`

- Add TOKEN_MANAGEMENT_ENABLED=true
- Add MAX_CONTEXT_TOKENS=50000
- Add MAX_MESSAGES_IN_MEMORY=10
- Add RATE_LIMIT_TOKENS_PER_MINUTE=400000
- Add CACHE_TTL_MINUTES=60
- Add CACHE_MAX_SIZE_MB=100
- Add COST_ALERT_THRESHOLD_USD=10.0
- Add SUMMARIZATION_THRESHOLD_MESSAGES=20
- Document each setting with comments

**Rationale**: Provides clear documentation and default values for all optimization settings.

### 15. Create Integration Tests

**File**: `apps/orchestrator_3_stream/backend/tests/test_token_optimization.py`

- Test ContextManager with various message sizes
- Test ResponseCache hit/miss scenarios and TTL expiration
- Test RateLimiter throttling and window reset
- Test CostTracker threshold alerts
- Test ConversationSummarizer output quality
- Test integration with OrchestratorService
- Performance benchmarks showing token reduction

**Rationale**: Ensures all optimization modules work correctly and achieve token reduction goals.

### 16. Create Monitoring Dashboard Component

**File**: `apps/orchestrator_3_stream/frontend/src/components/TokenMetrics.vue`

- Display real-time token usage (current minute)
- Show cache hit rate and size
- Display cumulative costs with threshold indicator
- Show context window usage (percentage)
- Alert banner when approaching rate limits
- Alert banner when cost threshold exceeded
- Auto-refresh every 10 seconds

**Rationale**: Provides visibility into optimization effectiveness and early warning for issues.

### 17. Document Optimization Strategy

**File**: `apps/orchestrator_3_stream/app_docs/token-optimization-guide.md`

- Explain each optimization technique
- Provide configuration tuning guidelines
- Document monitoring and alerting
- Include troubleshooting section
- Show expected token reduction metrics
- Provide cost analysis examples

**Rationale**: Enables team to understand, maintain, and tune the optimization system.

## Testing Strategy

### Unit Tests

**Context Management**:
- Test token estimation accuracy (within 10% of actual)
- Test message windowing with various limits
- Test edge cases (empty context, single message, very long messages)

**Response Caching**:
- Test cache hit/miss behavior
- Test TTL expiration
- Test cache eviction at max size
- Test cache key collision resistance

**Rate Limiting**:
- Test throttling behavior when approaching limit
- Test window reset after 60 seconds
- Test exponential backoff on repeated limits

**Cost Tracking**:
- Test accurate cost calculation for different models
- Test threshold alert triggering
- Test daily reset functionality

### Integration Tests

**OrchestratorService Integration**:
- Test full message flow with all optimizations enabled
- Verify token reduction (target: 50-70% reduction)
- Verify no functionality regression
- Test cache effectiveness on repeated queries

**Database Optimization**:
- Test chat history loading with limits
- Verify summary-based loading for old messages
- Test query performance improvements

### Performance Tests

**Token Reduction**:
- Baseline: Measure current token usage over 100 requests
- Optimized: Measure token usage with optimizations enabled
- Target: 50-70% reduction in input tokens

**Rate Limiting**:
- Simulate sustained high load (500 messages/minute)
- Verify automatic throttling prevents rate limit errors
- Verify fair queuing under load

**Cache Effectiveness**:
- Measure hit rate with realistic usage patterns
- Target: 30-40% hit rate for repeated queries
- Measure latency improvement (should be <5ms for cached responses)

## Acceptance Criteria

1. **Token Usage Reduction**:
   - Input tokens per request reduced by 50-70%
   - No single request exceeds 50k tokens
   - Average context size below 30k tokens

2. **Rate Limiting**:
   - Zero rate limit errors under normal load
   - Automatic throttling keeps usage below 400k tokens/minute
   - Rate limiter activates with <5 second delay

3. **Caching**:
   - Cache hit rate exceeds 30% for repeated queries
   - Cache size stays below 100MB
   - TTL expiration works correctly

4. **Cost Tracking**:
   - Real-time cost tracking within 5% accuracy
   - Alerts trigger when threshold exceeded
   - Daily cost reports available

5. **Monitoring**:
   - /api/metrics/tokens endpoint returns accurate stats
   - Frontend dashboard displays real-time metrics
   - WebSocket alerts for cost/rate limit warnings

6. **Performance**:
   - No noticeable latency increase (<50ms overhead)
   - Database query optimization reduces load by 30%
   - Conversation summarization completes in <2 seconds

7. **Reliability**:
   - All existing functionality works unchanged
   - No errors or crashes under optimized load
   - Graceful degradation if cache/rate limiter fails

## Validation Commands

Execute these commands to validate the implementation:

```bash
# 1. Run unit tests for optimization modules
cd apps/orchestrator_3_stream/backend
uv run pytest tests/test_token_optimization.py -v

# 2. Verify configuration is loaded correctly
uv run python -c "from modules.config import *; print(f'Max context: {MAX_CONTEXT_TOKENS}, Rate limit: {RATE_LIMIT_TOKENS_PER_MINUTE}')"

# 3. Test context manager standalone
uv run python -c "from modules.context_manager import ContextManager; cm = ContextManager(50000); print('ContextManager initialized')"

# 4. Test response cache standalone
uv run python -c "from modules.response_cache import ResponseCache; cache = ResponseCache(); print('ResponseCache initialized')"

# 5. Test rate limiter standalone
uv run python -c "from modules.rate_limiter import RateLimiter; rl = RateLimiter(); print('RateLimiter initialized')"

# 6. Start backend with optimizations enabled
cd apps/orchestrator_3_stream
./start_be.sh

# 7. Test token metrics endpoint
curl http://localhost:9403/api/metrics/tokens | jq .

# 8. Test cache metrics endpoint
curl http://localhost:9403/api/metrics/cache | jq .

# 9. Test cost metrics endpoint
curl http://localhost:9403/api/metrics/costs | jq .

# 10. Run integration tests
cd apps/orchestrator_3_stream/backend
uv run pytest tests/ -v --cov=modules --cov-report=html

# 11. Verify frontend dashboard displays metrics
npm run dev  # Open frontend and check TokenMetrics component

# 12. Load test to verify rate limiting
ab -n 1000 -c 10 http://localhost:9403/api/metrics/tokens
```

## Notes

### Model Selection

The orchestrator already uses Claude Haiku for summaries (excellent!), which is the most cost-effective model. Continue using:
- **Haiku** for summaries, classifications, simple queries (already implemented)
- **Sonnet** for orchestrator main logic (current default)
- Consider **Opus** only for complex reasoning if needed

### Configuration Tuning

Start with conservative settings and tune based on actual usage:
- **MAX_CONTEXT_TOKENS**: Start at 50k (25% of 200k limit), adjust based on response quality
- **MAX_MESSAGES_IN_MEMORY**: Start at 10 messages, increase if context loss is observed
- **RATE_LIMIT_TOKENS_PER_MINUTE**: Start at 400k (40% of limit), increase if not hitting limits
- **CACHE_TTL_MINUTES**: Start at 60 minutes, adjust based on cache churn rate

### Monitoring Strategy

Set up alerts for:
- Token usage exceeding 350k/minute (85% of limit)
- Cost exceeding $9 (90% of threshold)
- Cache hit rate below 20% (indicates poor caching)
- Context trimming happening more than 50% of requests (limit too low)

### Future Enhancements

After initial implementation, consider:
1. **Semantic Compression**: Use LLM to compress context while preserving meaning
2. **Hybrid Storage**: Store full messages in database, load summaries in memory
3. **Predictive Throttling**: ML model to predict token usage and throttle proactively
4. **Multi-tier Caching**: Memory cache + Redis cache for distributed systems
5. **Context Prioritization**: Keep important messages, summarize/remove less important ones

### Dependencies

New Python packages required:
```bash
# Already have: asyncio, datetime, hashlib, json, pathlib
# No new dependencies needed - using stdlib only
```

### Backwards Compatibility

All optimizations are:
- **Transparent**: Existing code continues to work unchanged
- **Configurable**: Can be disabled via environment variables
- **Gradual**: Can enable features one at a time for testing

### Performance Impact

Expected overhead:
- Context management: <10ms per request
- Cache lookup: <5ms per request
- Rate limiting check: <1ms per request
- Cost tracking: <1ms per request
- **Total overhead**: <20ms per request (negligible)

### Cost Reduction Estimates

Expected cost savings with full optimization:
- **Context windowing**: 40-50% reduction
- **Response caching**: 10-20% reduction (depends on cache hit rate)
- **Rate limiting**: 0% direct savings (prevents overages)
- **Conversation summarization**: 20-30% reduction in long conversations
- **Total expected savings**: 50-70% reduction in API costs

At current usage levels:
- Before: ~$X/day with rate limit errors
- After: ~$0.3-0.5X/day with zero rate limit errors
- **ROI**: Pays for development effort within days

### Security Considerations

- Cache keys use MD5 hashes (not cryptographic, just for uniqueness)
- No sensitive data stored in cache (only prompt hashes and responses)
- Rate limiter prevents DoS by throttling excessive requests
- Cost tracker prevents budget overruns

### Scalability

This optimization architecture supports:
- Multiple concurrent orchestrators (each with own context manager)
- Horizontal scaling (add Redis cache for shared caching)
- High throughput (rate limiter ensures fair distribution)
- Long-running sessions (conversation summarization prevents context explosion)
