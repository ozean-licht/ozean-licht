---
description: Reset orchestrator context (clear session, cache, and reload fresh state)
---

# Reset Orchestrator Context

Execute a soft reset of the orchestrator's context and state **without restarting the backend**.

## What This Does

1. **Clears Claude SDK session** - Starts with fresh context on next interaction
2. **Clears response cache** - Forces fresh responses
3. **Resets rate limiter** - Resets token usage tracking
4. **Reloads from database** - Fetches fresh orchestrator data
5. **Frontend state refresh** - Clears and reloads UI state

## When to Use

- Orchestrator responses seem stale or incorrect
- Want to start a completely fresh conversation
- Testing with clean state
- After making configuration changes
- Recovering from errors or stuck states

## How It Works

**Backend:** Calls `/api/orchestrator/reset?clear_session=true`
- Resets all in-memory state
- Clears Claude SDK session_id in database
- Does **NOT** restart the backend process (Docker-safe!)

**Frontend:** Automatically reloads all data
- Clears chat messages, events, agents
- Reconnects WebSocket
- Fetches fresh data from database

## Expected Result

```
✅ Backend context reset: { success: true, session_cleared: true }
✅ State cleared
✅ Orchestrator context reset complete
```

Your next message will start with a completely fresh Claude SDK session.

## Technical Details

- **No backend restart required** - Works perfectly in Docker/Coolify deployments
- **~500ms reset time** - Much faster than full reboot (no 3s wait)
- **Session continuity maintained** - If clear_session=false, maintains conversation context
- **WebSocket auto-reconnects** - No manual intervention needed

## Comparison with Reboot

| Operation | Reset (`/reset`) | Reboot (`/reboot`) |
|-----------|------------------|---------------------|
| Backend restart | ❌ No | ✅ Yes |
| Session cleared | ✅ Yes | ✅ Yes |
| Cache cleared | ✅ Yes | ✅ Yes |
| Docker-safe | ✅ Yes | ❌ No (creates conflicts) |
| Time | ~500ms | ~3-5 seconds |
| Use in production | ✅ Recommended | ❌ Avoid |

## Usage

Just type `/reset` in the orchestrator chat and send. The system will handle everything automatically.

---

**Status:** ✅ Production-ready
**Docker-safe:** ✅ Yes
**Recommended:** ✅ Use this instead of reboot
