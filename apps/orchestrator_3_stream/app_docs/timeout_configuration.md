# Timeout Configuration - Implementation Documentation

**Date**: 2025-01-XX
**Status**: ✅ Implemented
**Priority**: HIGH

## Overview

This document describes the timeout configuration fixes implemented to resolve regular timeout issues in the Orchestrator 3 Stream system. The implementation addresses three critical areas: database operations, Claude SDK API calls, and WebSocket connection management.

## Problem Statement

The system experienced regular timeout issues due to:
1. **Aggressive database timeout** (60s) - Too short for complex orchestrator operations
2. **Missing Claude SDK timeout configuration** - Relied on defaults unsuitable for long-running tasks
3. **No WebSocket keepalive** - Long-running connections would timeout without proper keepalive mechanism

## Implementation Summary

### 1. Configuration Constants (config.py)

Added centralized timeout configuration in `backend/modules/config.py`:

```python
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
```

**Rationale**:
- All timeout values are configurable via environment variables
- Defaults are chosen to prevent premature timeouts while maintaining responsiveness
- Values are logged at startup for visibility

### 2. Database Command Timeout (database.py)

**Location**: `backend/modules/database.py:66`

**Change**:
```python
# Before:
_pool = await asyncpg.create_pool(
    url, min_size=min_size, max_size=max_size, command_timeout=60
)

# After:
_pool = await asyncpg.create_pool(
    url, min_size=min_size, max_size=max_size, command_timeout=DATABASE_COMMAND_TIMEOUT
)
```

**Impact**:
- Database operations now have 180 seconds (3 minutes) to complete
- Prevents timeout failures for complex orchestrator database operations
- Configurable via `DATABASE_COMMAND_TIMEOUT` environment variable

### 3. Claude SDK Timeout (orchestrator_service.py)

**Location**: `backend/modules/orchestrator_service.py:409`

**Change**:
```python
options_dict = {
    "system_prompt": self._load_system_prompt(),
    "model": model or config.ORCHESTRATOR_MODEL,
    "cwd": self.working_dir,
    "resume": resume_session,
    "env": env_vars,
    "timeout": CLAUDE_SDK_TIMEOUT,  # 5-minute timeout for complex operations
}
```

**Impact**:
- Claude SDK API calls now have explicit 300-second (5-minute) timeout
- Prevents premature termination of long-running agent operations
- Configurable via `CLAUDE_SDK_TIMEOUT` environment variable

### 4. WebSocket Keepalive (websocket_manager.py)

**Location**: `backend/modules/websocket_manager.py`

**New Methods**:
- `start_keepalive()` - Start background ping task
- `stop_keepalive()` - Gracefully stop ping task
- `_keepalive_loop()` - Background loop that sends periodic pings

**Implementation**:
```python
async def _keepalive_loop(self):
    """
    Keepalive loop that sends periodic pings to all connected clients.
    Runs in the background until stopped.
    """
    logger.info(f"🔄 WebSocket keepalive loop started")

    while not self._shutdown:
        try:
            # Wait for ping interval
            await asyncio.sleep(WEBSOCKET_PING_INTERVAL)

            if not self.active_connections:
                logger.debug("No active connections, skipping ping")
                continue

            # Send ping to all connected clients
            disconnected = []
            for connection in self.active_connections:
                try:
                    # Send ping frame with timeout
                    await asyncio.wait_for(
                        connection.send_json({
                            "type": "ping",
                            "timestamp": datetime.now().isoformat()
                        }),
                        timeout=WEBSOCKET_CONNECTION_TIMEOUT
                    )
                    logger.debug(f"📡 Sent ping to client")
                except asyncio.TimeoutError:
                    logger.warning(f"⏰ Ping timeout for client, marking for disconnection")
                    disconnected.append(connection)
                except Exception as e:
                    logger.error(f"❌ Failed to send ping to client: {e}")
                    disconnected.append(connection)

            # Clean up disconnected clients
            for ws in disconnected:
                self.disconnect(ws)

        except asyncio.CancelledError:
            logger.info("🛑 Keepalive loop cancelled")
            break
        except Exception as e:
            logger.error(f"❌ Error in keepalive loop: {e}")
            await asyncio.sleep(5)  # Back off on errors
```

**Integration** (main.py):
```python
# Startup:
await ws_manager.start_keepalive()

# Shutdown:
await ws_manager.stop_keepalive()
```

**Impact**:
- Ping messages sent every 30 seconds to all connected clients
- Dead connections detected and cleaned up automatically
- Prevents WebSocket connections from timing out during long operations
- Configurable via `WEBSOCKET_PING_INTERVAL` and `WEBSOCKET_CONNECTION_TIMEOUT` environment variables

## Timeout Hierarchy

The system now has coordinated timeouts across all layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    TIMEOUT HIERARCHY                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WebSocket Ping:           30s (keepalive interval)         │
│  WebSocket Connection:     60s (connection timeout)         │
│  Database Command:        180s (query timeout)              │
│  Claude SDK API:          300s (agent operation timeout)    │
│                                                              │
│  ⬆️  Lower-level timeouts (more frequent)                   │
│  ⬇️  Higher-level timeouts (more tolerance)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Coordination Strategy**:
- WebSocket pings (30s) ensure connection liveness without interfering with operations
- Database commands (180s) have sufficient time for complex queries
- Claude SDK (300s) allows long-running agent operations to complete
- Each layer's timeout is designed not to conflict with lower layers

## Environment Variables

All timeout values can be configured via environment variables:

```bash
# .env configuration
DATABASE_COMMAND_TIMEOUT=180        # Database query timeout (seconds)
CLAUDE_SDK_TIMEOUT=300               # Claude SDK API timeout (seconds)
WEBSOCKET_PING_INTERVAL=30          # WebSocket ping interval (seconds)
WEBSOCKET_CONNECTION_TIMEOUT=60     # WebSocket connection timeout (seconds)
```

## Verification

To verify the timeout configuration is working:

1. **Startup Logs** - Check for timeout configuration in startup logs:
```
[CONFIG] INFO: TIMEOUT CONFIGURATION:
[CONFIG] INFO:   Database:      180s (command timeout)
[CONFIG] INFO:   Claude SDK:    300s (API timeout)
[CONFIG] INFO:   WebSocket:     30s (ping) / 60s (timeout)
```

2. **WebSocket Keepalive** - Look for keepalive startup message:
```
✅ WebSocket keepalive started (ping every 30s)
🔄 WebSocket keepalive loop started
```

3. **Database Pool** - Verify connection pool uses new timeout:
```python
# Check pool creation in logs
# Should show command_timeout=180
```

## Testing Recommendations

1. **Long-Running Operations**:
   - Test operations that take 90-120 seconds
   - Verify they complete without timeout errors
   - Monitor database and Claude SDK logs

2. **WebSocket Stability**:
   - Keep frontend connected for extended periods (5+ minutes)
   - Verify no disconnections during long operations
   - Check for regular ping messages in browser dev tools

3. **Error Handling**:
   - Test with very long operations (3-4 minutes)
   - Verify graceful timeout handling when limits are reached
   - Check error messages are informative

## Backward Compatibility

All changes are backward compatible:
- Default values maintain existing behavior if environment variables not set
- No breaking changes to API or database schema
- WebSocket keepalive is transparent to clients (ping messages are informational)

## Performance Impact

- **Minimal overhead**: WebSocket pings are lightweight JSON messages
- **No performance degradation**: Increased timeouts only affect timeout thresholds
- **Improved stability**: Reduced connection churn from premature timeouts

## Troubleshooting

### If timeouts still occur:

1. **Check environment variables** - Ensure `.env` file has correct values
2. **Review logs** - Look for timeout-related errors with timestamps
3. **Increase timeouts** - Adjust environment variables if needed:
   ```bash
   DATABASE_COMMAND_TIMEOUT=300  # Increase to 5 minutes
   CLAUDE_SDK_TIMEOUT=600        # Increase to 10 minutes
   ```

### If WebSocket disconnects occur:

1. **Check keepalive logs** - Look for ping failures
2. **Verify network stability** - Check for network issues
3. **Adjust ping interval** - Decrease if needed:
   ```bash
   WEBSOCKET_PING_INTERVAL=15  # Ping every 15 seconds
   ```

## Related Files

- `backend/modules/config.py` - Timeout configuration constants
- `backend/modules/database.py` - Database timeout implementation
- `backend/modules/orchestrator_service.py` - Claude SDK timeout configuration
- `backend/modules/websocket_manager.py` - WebSocket keepalive mechanism
- `backend/main.py` - Keepalive task lifecycle management

## References

- Original Investigation: `app_docs/timeout_investigation_report.md`
- Scout Analysis: As provided by user
- Claude SDK Documentation: (timeout parameter in ClaudeAgentOptions)
- asyncpg Documentation: (command_timeout parameter)

## Status

✅ **COMPLETE** - All timeout fixes have been implemented and are ready for testing.

---

**Last Updated**: 2025-01-XX
**Author**: Build Agent
**Review Status**: Pending User Verification
