# Plan: Fix Orchestrator Context Display Not Updating

## Task Description

The orchestrator agent's context window display in the UI is stuck at "0/200k" and does not update when messages are processed. Users cannot see the real token usage of the orchestrator, making it impossible to monitor context consumption. The issue appears to be a data flow or reactivity problem where token updates from the backend are either not being sent, not being received, or not triggering UI updates.

## Objective

Ensure the orchestrator's token usage display (input_tokens + output_tokens / 200k) updates in real-time as the orchestrator processes messages, allowing users to monitor context window consumption accurately.

## Problem Statement

The orchestrator context display shows "0/200k" and never updates, even after the orchestrator processes multiple messages. This creates a critical blind spot for users who need to monitor token usage to:
- Avoid hitting the 200k context window limit
- Track costs associated with token consumption
- Understand when to reset the orchestrator session

The infrastructure exists (WebSocket broadcasts, database updates, frontend handlers), but something in the data flow is broken.

## Solution Approach

1. **Verify Data Flow** - Trace the complete path from database updates → WebSocket broadcast → frontend handler → UI display
2. **Add Comprehensive Logging** - Add console logs at each step to identify where the chain breaks
3. **Fix Reactivity Issues** - Ensure Vue reactivity is properly triggered when orchestrator data updates
4. **Add Visual Feedback** - Provide visual confirmation when token updates are received
5. **Validate End-to-End** - Test with real messages to confirm the entire flow works

## Relevant Files

**Backend:**
- `apps/orchestrator_3_stream/backend/modules/database.py` - Contains `update_orchestrator_costs()` which increments token counts in database
- `apps/orchestrator_3_stream/backend/modules/orchestrator_service.py` - Calls `broadcast_orchestrator_updated()` after cost updates (line 1261)
- `apps/orchestrator_3_stream/backend/modules/websocket_manager.py` - Contains `broadcast_orchestrator_updated()` that sends WebSocket messages
- `apps/orchestrator_3_stream/backend/main.py` - `/get_orchestrator` endpoint that returns initial orchestrator data (line 375)

**Frontend:**
- `apps/orchestrator_3_stream/frontend/src/components/OrchestratorChat.vue` - Displays context window (lines 47-49, 171-206)
- `apps/orchestrator_3_stream/frontend/src/stores/orchestratorStore.ts` - Handles WebSocket updates via `handleOrchestratorUpdated()` (lines 465-483)
- `apps/orchestrator_3_stream/frontend/src/services/chatService.ts` - Routes WebSocket messages to handlers (lines 149-150)
- `apps/orchestrator_3_stream/frontend/src/types.d.ts` - TypeScript interfaces for orchestrator data

## Implementation Phases

### Phase 1: Diagnostic Logging
Add comprehensive logging to trace data flow and identify the failure point.

### Phase 2: Fix Identified Issues
Address any bugs discovered through logging (reactivity, data structure mismatches, etc.).

### Phase 3: Enhanced UI Feedback
Add visual indicators for token updates and improve debugging capabilities.

## Step by Step Tasks

### 1. Add Backend Diagnostic Logging

- Add detailed logging in `update_orchestrator_costs()` to confirm token accumulation
- Add logging in `broadcast_orchestrator_updated()` to confirm WebSocket message structure
- Verify the exact data being sent in the WebSocket message includes `input_tokens` and `output_tokens`
- Add log statement showing total tokens before and after update

### 2. Add Frontend Diagnostic Logging

- Add console.log in `handleOrchestratorUpdated()` showing received data structure
- Add logging in OrchestratorChat.vue `currentTokens` computed property to show when it recalculates
- Add logging when `contextWindowDisplay` changes
- Log the orchestrator agent state before and after updates

### 3. Verify Initial Load

- Confirm `/get_orchestrator` endpoint returns correct `input_tokens` and `output_tokens`
- Verify `initialize()` in orchestratorStore properly sets `orchestratorAgent.value` with token data
- Add console.log showing initial orchestrator agent state after load

### 4. Fix Reactivity Issues

- Ensure `handleOrchestratorUpdated()` properly triggers Vue reactivity by creating a new object reference
- Verify the update pattern uses spread operator correctly: `orchestratorAgent.value = { ...orchestratorAgent.value, ...updates }`
- Consider using `ref.value = reactive({ ...ref.value, ...updates })` if issues persist
- Ensure `input_tokens` and `output_tokens` fields are properly typed and not undefined

### 5. Add Visual Update Indicator

- Add a small visual indicator (pulse/flash) in OrchestratorChat when tokens update
- Display last updated timestamp next to context window
- Add transition effect when context value changes
- Consider adding a progress bar showing context usage percentage

### 6. Enhance Error Handling

- Add try-catch in `handleOrchestratorUpdated()` with detailed error logging
- Validate received data structure matches expected TypeScript interface
- Add fallback values if `input_tokens` or `output_tokens` are undefined
- Log warnings if WebSocket message has unexpected structure

### 7. Add Debug Panel (Optional)

- Create a collapsible debug panel showing:
  - Current orchestrator agent state (full object)
  - Last WebSocket message received
  - Token update history (last 5 updates)
  - WebSocket connection status
- Add keyboard shortcut (e.g., Cmd+Shift+D) to toggle debug panel

### 8. Validate Complete Flow

- Send a test message to orchestrator
- Verify backend logs show token update and WebSocket broadcast
- Verify frontend logs show WebSocket message received and state updated
- Verify UI displays updated token count
- Test with multiple messages to confirm accumulation works
- Test page refresh to confirm tokens persist and reload correctly

## Testing Strategy

**Manual Testing:**
1. Open browser console to view all diagnostic logs
2. Send a message to orchestrator agent
3. Verify each step in the logs:
   - Backend: "Updating orchestrator costs..."
   - Backend: "Broadcasting orchestrator_updated..."
   - Frontend: "Orchestrator updated:" with data
   - Frontend: "currentTokens computed:" with new value
4. Visually confirm context display updates (e.g., from "0/200k" to "5k/200k")
5. Refresh page and verify tokens persist
6. Send multiple messages and verify accumulation

**Edge Cases:**
- Very first message (tokens go from 0 to some value)
- Large message (tokens jump significantly)
- Multiple rapid messages (ensure all updates are reflected)
- Page refresh during message processing
- WebSocket disconnect/reconnect scenarios

**Browser DevTools Checks:**
- Network tab: Verify WebSocket messages contain `orchestrator_updated` events
- Vue DevTools: Inspect `orchestratorStore` state to see `orchestratorAgent.input_tokens` and `output_tokens`
- Console: Review all diagnostic logs for errors or unexpected values

## Acceptance Criteria

- [ ] Context window display shows "0/200k" initially for new orchestrator
- [ ] After sending a message, display updates to show actual token usage (e.g., "5k/200k")
- [ ] Display continues to update with each subsequent message (accumulating tokens)
- [ ] Token count persists across page refreshes
- [ ] Console logs clearly show data flow from backend → WebSocket → frontend → UI
- [ ] No errors or warnings in console related to token updates
- [ ] Visual feedback (flash/pulse) confirms when updates are received
- [ ] Debug panel (if implemented) shows accurate real-time state

## Validation Commands

Execute these commands to validate the fix:

```bash
# 1. Start the application
cd apps/orchestrator_3_stream
./start_be.sh  # Terminal 1
./start_fe.sh  # Terminal 2

# 2. Open browser to http://localhost:5175
# 3. Open browser console (F12)
# 4. Send test message to orchestrator
# 5. Verify logs show:
#    - Backend: Token update logs
#    - Backend: WebSocket broadcast logs
#    - Frontend: WebSocket message received logs
#    - Frontend: State update logs
#    - Frontend: Computed property recalculation logs

# 6. Visually verify context display updates in UI

# 7. Refresh page and verify tokens persist

# 8. Check database directly to confirm tokens are being stored:
# Connect to database and run:
SELECT id, input_tokens, output_tokens, total_cost
FROM orchestrator_agents
WHERE archived = false
ORDER BY updated_at DESC
LIMIT 1;
```

## Notes

**Root Cause Hypotheses:**
1. **Reactivity Issue**: Frontend state is updating but Vue isn't detecting the change (unlikely given spread operator usage)
2. **WebSocket Message Not Sent**: Backend isn't actually broadcasting updates (possible if WebSocket manager isn't connected)
3. **WebSocket Message Not Received**: Frontend handler isn't being called (possible if callback routing is broken)
4. **Data Structure Mismatch**: WebSocket message has different structure than expected (possible)
5. **Initial State Issue**: Orchestrator agent is loaded with undefined/null tokens and updates aren't overwriting (possible)
6. **Type Coercion Issue**: Tokens are being stored as strings instead of numbers (unlikely but possible)

**Dependencies:**
- No new libraries needed
- Existing WebSocket infrastructure is sufficient
- Use existing logging infrastructure (logger.py for backend, console.log for frontend)

**Performance Considerations:**
- Diagnostic logging should be removed or made conditional (debug mode) in production
- WebSocket broadcasts are already efficient (single message to all clients)
- Vue reactivity updates are optimized and shouldn't cause performance issues

**Follow-up Enhancements:**
- Add token usage warnings (e.g., at 70%, 90% of 200k limit)
- Add automatic session reset when approaching token limit
- Display token breakdown (input vs output) on hover
- Add historical token usage chart
- Store token usage metrics for analytics
