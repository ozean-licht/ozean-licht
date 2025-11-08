# Code Review Report

**Generated**: 2025-01-08T21:30:00Z
**Reviewed Work**: Orchestrator Reboot Integration Implementation
**Git Diff Summary**: 5 files changed, 87 insertions(+), 8 deletions(-)
**Verdict**: ⚠️ FAIL

---

## Executive Summary

The orchestrator reboot integration successfully implements a backend endpoint, frontend service function, store logic, UI button, and tool registration. However, **critical issues prevent deployment**: hardcoded port mismatch in the reboot script (8002 vs actual 9403), missing authentication on the reboot endpoint allowing unauthorized access, and potential race condition where the backend kills itself while responding. The implementation is functional but requires security hardening and configuration fixes before production use.

---

## Quick Reference

| #   | Description                                      | Risk Level | Recommended Solution                              |
| --- | ------------------------------------------------ | ---------- | ------------------------------------------------- |
| 1   | Hardcoded ports don't match actual config        | HIGH       | Read ports from .env in reboot script             |
| 2   | No authentication on /api/orchestrator/reboot    | HIGH       | Add authentication middleware                     |
| 3   | Race condition - backend kills itself            | HIGH       | Use delayed execution with at/systemd             |
| 4   | pkill pattern may kill unintended processes      | HIGH       | Use PID file for precise process targeting        |
| 5   | Subprocess execution security concerns           | MEDIUM     | Add additional path validation                    |
| 6   | No audit trail of reboot actions                 | MEDIUM     | Log user/timestamp of reboot trigger              |
| 7   | No post-reboot health verification               | MEDIUM     | Add health check polling after reboot             |
| 8   | Frontend reconnection lacks retry backoff        | MEDIUM     | Implement exponential backoff for reconnection    |
| 9   | nohup may not work in all environments           | MEDIUM     | Use systemd service restart instead               |
| 10  | Missing TypeScript types for response            | LOW        | Add RebootOrchestratorResponse interface          |
| 11  | Console.log instead of structured logging        | LOW        | Use proper logging service                        |
| 12  | TODO comments for notifications not addressed    | LOW        | Implement toast notification system               |

---

## Issues by Risk Tier

### 🚨 BLOCKERS (Must Fix Before Merge)

No blockers identified. Core functionality works, but high-risk issues prevent safe deployment.

---

### ⚠️ HIGH RISK (Should Fix Before Merge)

#### Issue #1: Hardcoded Ports Don't Match Actual Configuration

**Description**: The reboot script (`scripts/reboot-orchestrator.sh`) has hardcoded ports 8002 (backend) and 5175 (frontend) in the status output, but the actual backend runs on port 9403 according to `.env`. This creates misleading status messages and could confuse operators.

**Location**:
- File: `/opt/ozean-licht-ecosystem/scripts/reboot-orchestrator.sh`
- Lines: `57-58`

**Offending Code**:
```bash
echo "   Backend:  http://localhost:8002 (PID: $BACKEND_PID)"
echo "   Frontend: http://localhost:5175 (PID: $FRONTEND_PID)"
```

**Actual Configuration**:
```env
# backend/.env
BACKEND_PORT=9403
FRONTEND_PORT=5175
```

**Recommended Solutions**:

1. **Source .env file in reboot script** (Preferred)
   - Read `BACKEND_PORT` and `FRONTEND_PORT` from `.env` file
   - Use `source` or parse with grep/awk
   - Display correct ports in status output
   - Rationale: Single source of truth, prevents drift between config and scripts

2. **Pass ports as environment variables** (Alternative)
   - Modify backend endpoint to pass ports to script
   - Set environment variables before executing subprocess
   - Trade-off: More complex but avoids file parsing

3. **Remove port display entirely** (Fallback)
   - Only show PIDs without URLs
   - Document correct ports in separate location
   - Trade-off: Less user-friendly but avoids incorrect information

---

#### Issue #2: No Authentication on Reboot Endpoint

**Description**: The `/api/orchestrator/reboot` endpoint has no authentication or authorization checks. Any user who can reach the endpoint (including malicious actors if exposed) can trigger a full orchestrator reboot, causing service disruption.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/main.py`
- Lines: `375-430`

**Offending Code**:
```python
@app.post("/api/orchestrator/reboot")
async def reboot_orchestrator():
    """Reboot the orchestrator service (backend + frontend)."""
    # No authentication check!
```

**Recommended Solutions**:

1. **Add authentication middleware** (Preferred)
   - Require API key or session token in Authorization header
   - Use existing auth system if available (check shared auth in monorepo)
   - Validate user has admin role before allowing reboot
   - Rationale: Standard security practice for destructive operations

2. **Restrict to localhost only** (Alternative)
   - Check `request.client.host` to ensure request is from 127.0.0.1
   - Prevents remote attacks but still vulnerable to local users
   - Trade-off: Simpler but weaker security

3. **Add confirmation token** (Defense in depth)
   - Require two-step process: request token, then reboot with token
   - Token expires after 30 seconds
   - Trade-off: Better UX for accidental clicks, but adds complexity

**Example Implementation**:
```python
from fastapi import Depends, HTTPException
from modules.auth import require_admin  # Hypothetical auth module

@app.post("/api/orchestrator/reboot")
async def reboot_orchestrator(user = Depends(require_admin)):
    """Reboot the orchestrator service (backend + frontend)."""
    logger.info(f"Reboot triggered by user: {user.email}")
    # ... rest of implementation
```

---

#### Issue #3: Race Condition - Backend Kills Itself While Responding

**Description**: The reboot script uses `pkill -f "uvicorn.*orchestrator_3_stream"` which immediately kills the backend process. However, the backend is still executing the HTTP response to the frontend. This creates a race condition where the response may not be received, leaving the frontend in an inconsistent state.

**Location**:
- File: `/opt/ozean-licht-ecosystem/scripts/reboot-orchestrator.sh`
- Lines: `19`
- Related: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/main.py` lines `410-416`

**Offending Code**:
```bash
# Script immediately kills the process
pkill -f "uvicorn.*orchestrator_3_stream" || echo "   Backend not running"
```

**Recommended Solutions**:

1. **Use delayed execution with `at` command** (Preferred)
   - Return HTTP response immediately
   - Schedule reboot script to run 3 seconds later with `at`
   - Frontend receives confirmation before backend dies
   - Rationale: Clean separation of response and reboot action
   - Example: `echo "/path/to/reboot-script.sh" | at now + 3 seconds`

2. **Use systemd service restart** (Alternative)
   - Create systemd service for orchestrator
   - Endpoint triggers `systemctl restart orchestrator.service`
   - Systemd handles graceful shutdown and restart
   - Trade-off: Requires systemd setup but more robust

3. **Return response before forking reboot** (Quick fix)
   - Move subprocess.Popen to async task after response is sent
   - Use asyncio.create_task with 2-second delay
   - Trade-off: Still risks killing mid-response if backend is slow

**Example Implementation (Option 1)**:
```python
# In main.py
import tempfile

# Create a delayed execution script
delay_script = f"""#!/bin/bash
sleep 3
{script_path}
"""
with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.sh') as f:
    f.write(delay_script)
    delay_script_path = f.name

os.chmod(delay_script_path, 0o755)
subprocess.Popen([delay_script_path], start_new_session=True)

return {"success": True, "message": "Reboot will commence in 3 seconds"}
```

---

#### Issue #4: pkill Pattern May Kill Unintended Processes

**Description**: The reboot script uses `pkill -f` with regex patterns that could match unintended processes. For example, if another developer has a test script or editor open with "orchestrator_3_stream" in the path, it would be killed. This is especially problematic in development environments.

**Location**:
- File: `/opt/ozean-licht-ecosystem/scripts/reboot-orchestrator.sh`
- Lines: `19, 22`

**Offending Code**:
```bash
pkill -f "uvicorn.*orchestrator_3_stream" || echo "   Backend not running"
pkill -f "vite.*orchestrator_3_stream" || echo "   Frontend not running"
```

**Recommended Solutions**:

1. **Use PID files for precise targeting** (Preferred)
   - Store PIDs in `/tmp/orchestrator_backend.pid` and `/tmp/orchestrator_frontend.pid` on startup
   - Read PID files and kill specific processes: `kill $(cat /tmp/orchestrator_backend.pid)`
   - Verify process still matches expected command before killing
   - Rationale: Precise targeting, no collateral damage

2. **Use process group IDs** (Alternative)
   - Start processes with `setsid` to create process groups
   - Kill entire process group with `pkill -g <pgid>`
   - Trade-off: More complex but handles child processes better

3. **Add process ownership checks** (Defense in depth)
   - Only kill processes owned by current user
   - Use `pkill -u $(whoami)` to restrict scope
   - Trade-off: Still risky if user has multiple orchestrator instances

**Example Implementation (Option 1)**:
```bash
# In reboot script
BACKEND_PID_FILE="/tmp/orchestrator_backend.pid"
FRONTEND_PID_FILE="/tmp/orchestrator_frontend.pid"

# Kill backend
if [ -f "$BACKEND_PID_FILE" ]; then
    BACKEND_PID=$(cat "$BACKEND_PID_FILE")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo "   Backend stopped (PID: $BACKEND_PID)"
    fi
    rm -f "$BACKEND_PID_FILE"
else
    echo "   Backend PID file not found"
fi
```

---

### ⚡ MEDIUM RISK (Fix Soon)

#### Issue #5: Subprocess Execution Security Concerns

**Description**: While the current implementation doesn't accept user input for the subprocess call, the pattern of executing shell scripts via `subprocess.Popen` is inherently risky. If future developers modify this code to accept parameters, it could become a command injection vulnerability.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/main.py`
- Lines: `396-416`

**Current Code**:
```python
script_path = Path(__file__).parent.parent.parent.parent / "scripts" / "reboot-orchestrator.sh"

subprocess.Popen(
    [str(script_path)],
    start_new_session=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    cwd=str(script_path.parent)
)
```

**Recommended Solutions**:

1. **Add strict path validation** (Preferred)
   - Verify script_path is within expected directory tree
   - Check script has correct permissions (not world-writable)
   - Validate script hash/checksum to prevent tampering
   - Rationale: Defense in depth against path traversal attacks

2. **Use absolute hardcoded path** (Alternative)
   - Define REBOOT_SCRIPT_PATH in config.py as absolute path
   - Avoid dynamic path construction
   - Trade-off: Less flexible but more secure

3. **Add security comment** (Documentation)
   - Add prominent comment warning against adding user input
   - Document security considerations for future maintainers
   - Trade-off: Doesn't prevent vulnerability but raises awareness

**Example Implementation (Option 1)**:
```python
import hashlib

# Validate script is in expected location
expected_dir = Path(__file__).parent.parent.parent.parent / "scripts"
if not script_path.is_relative_to(expected_dir):
    raise HTTPException(status_code=500, detail="Invalid script path")

# Check script is not world-writable
script_stat = script_path.stat()
if script_stat.st_mode & 0o002:
    raise HTTPException(status_code=500, detail="Script is world-writable (security risk)")

# Verify script hash (optional, requires maintaining hash)
# expected_hash = "abc123..."  # Store in config
# actual_hash = hashlib.sha256(script_path.read_bytes()).hexdigest()
# if actual_hash != expected_hash:
#     raise HTTPException(status_code=500, detail="Script hash mismatch")
```

---

#### Issue #6: No Audit Trail of Reboot Actions

**Description**: The reboot endpoint doesn't log who triggered the reboot, from what IP address, or at what time. This makes it impossible to audit system reboots or investigate unexpected downtime.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend/main.py`
- Lines: `375-430`

**Current Logging**:
```python
logger.info("🔄 Rebooting orchestrator (backend + frontend)...")
logger.success("✅ Reboot script triggered successfully")
```

**Recommended Solutions**:

1. **Log comprehensive audit information** (Preferred)
   - Include user identity (once auth is added), IP address, timestamp
   - Store in database audit_logs table for permanent record
   - Include reason/context if provided by user
   - Rationale: Essential for security auditing and compliance

2. **Emit reboot event via WebSocket** (Complementary)
   - Broadcast reboot notification to all connected clients
   - Show banner in UI: "System rebooting, initiated by [user]"
   - Trade-off: Real-time visibility but not permanent record

3. **Write to separate audit log file** (Fallback)
   - Append to `/var/log/orchestrator-audit.log`
   - Use structured format (JSON) for easy parsing
   - Trade-off: File-based, no query capability

**Example Implementation (Option 1)**:
```python
from fastapi import Request

@app.post("/api/orchestrator/reboot")
async def reboot_orchestrator(request: Request, user = Depends(require_admin)):
    # Log audit information
    audit_entry = {
        "action": "orchestrator_reboot",
        "user_id": user.id,
        "user_email": user.email,
        "ip_address": request.client.host,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_agent": request.headers.get("user-agent"),
    }

    await database.insert_audit_log(audit_entry)
    logger.info(f"🔄 Reboot triggered by {user.email} from {request.client.host}")

    # ... rest of implementation
```

---

#### Issue #7: No Post-Reboot Health Verification

**Description**: After triggering the reboot, there's no verification that services actually started successfully. The script reports PIDs but doesn't check if the services are healthy and responding to requests.

**Location**:
- File: `/opt/ozean-licht-ecosystem/scripts/reboot-orchestrator.sh`
- Lines: `36-51`

**Current Code**:
```bash
# Start backend
nohup uv run python main.py > /tmp/orchestrator_backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Start frontend
nohup npm run dev > /tmp/orchestrator_frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
# No health check!
```

**Recommended Solutions**:

1. **Add health check polling** (Preferred)
   - After starting services, poll health endpoints (e.g., `/health`)
   - Retry up to 30 seconds with exponential backoff
   - Exit with error if services don't become healthy
   - Rationale: Ensures reboot actually succeeded

2. **Check process status after delay** (Alternative)
   - Wait 5 seconds, then verify processes still running
   - Check if PIDs are still active with `ps -p $PID`
   - Trade-off: Faster but doesn't verify actual service health

3. **Parse log files for startup messages** (Complementary)
   - Grep logs for "Backend initialization complete" or similar
   - Timeout after 30 seconds if not found
   - Trade-off: Depends on consistent log messages

**Example Implementation (Option 1)**:
```bash
# After starting services
echo "⏳ Waiting for services to become healthy..."

# Check backend health
BACKEND_HEALTHY=false
for i in {1..10}; do
    if curl -sf http://localhost:9403/health > /dev/null 2>&1; then
        BACKEND_HEALTHY=true
        echo "   ✅ Backend is healthy"
        break
    fi
    echo "   Attempt $i/10: Backend not ready yet..."
    sleep 3
done

if [ "$BACKEND_HEALTHY" = false ]; then
    echo "   ❌ Backend failed to start!"
    echo "   Check logs: tail -f /tmp/orchestrator_backend.log"
    exit 1
fi
```

---

#### Issue #8: Frontend Reconnection Lacks Retry Backoff

**Description**: The `refreshContext()` function in the store disconnects the WebSocket and immediately calls `initialize()` which tries to reconnect. If the backend is still rebooting, the reconnection will fail immediately without retry logic. This could leave users with a broken connection.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/frontend/src/stores/orchestratorStore.ts`
- Lines: `1038-1041`

**Current Code**:
```typescript
// Disconnect WebSocket
disconnectWebSocket()

// Re-initialize store (fetches fresh data from backend)
await initialize()
```

**Recommended Solutions**:

1. **Implement exponential backoff for reconnection** (Preferred)
   - Retry connection with delays: 1s, 2s, 4s, 8s, 16s
   - Show connection status in UI: "Reconnecting... (attempt 3/10)"
   - Give up after 10 attempts or 2 minutes
   - Rationale: Gracefully handles backend startup time

2. **Poll health endpoint before reconnecting** (Alternative)
   - Check `/health` endpoint until it responds
   - Only attempt WebSocket connection once backend is up
   - Trade-off: More reliable but adds HTTP polling overhead

3. **Add delay before initialize** (Quick fix)
   - Wait 5 seconds after triggering reboot before reconnecting
   - Simple but assumes fixed startup time
   - Trade-off: Easy to implement but not robust

**Example Implementation (Option 1)**:
```typescript
async function reconnectWithBackoff(maxAttempts = 10) {
  let attempt = 0
  let delay = 1000 // Start with 1 second

  while (attempt < maxAttempts) {
    attempt++
    console.log(`🔄 Reconnection attempt ${attempt}/${maxAttempts}...`)

    try {
      await initialize()
      console.log('✅ Reconnected successfully')
      return true
    } catch (error) {
      console.error(`❌ Reconnection attempt ${attempt} failed:`, error)

      if (attempt < maxAttempts) {
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay = Math.min(delay * 2, 16000) // Exponential backoff, max 16s
      }
    }
  }

  console.error('❌ Failed to reconnect after maximum attempts')
  return false
}
```

---

#### Issue #9: nohup May Not Work in All Environments

**Description**: The reboot script uses `nohup` to start processes in the background. This is unreliable in modern containerized environments, systemd-managed systems, or when run from non-interactive shells. Processes may be killed when the parent shell exits.

**Location**:
- File: `/opt/ozean-licht-ecosystem/scripts/reboot-orchestrator.sh`
- Lines: `38, 48`

**Current Code**:
```bash
nohup uv run python main.py > /tmp/orchestrator_backend.log 2>&1 &
nohup npm run dev > /tmp/orchestrator_frontend.log 2>&1 &
```

**Recommended Solutions**:

1. **Use systemd service units** (Preferred)
   - Create orchestrator-backend.service and orchestrator-frontend.service
   - Reboot endpoint triggers `systemctl restart orchestrator-*.service`
   - systemd handles logging, restart policies, and process management
   - Rationale: Industry standard for service management on Linux

2. **Use screen or tmux sessions** (Alternative)
   - Start processes in detached screen sessions
   - `screen -dmS orchestrator-backend uv run python main.py`
   - Trade-off: More portable but less robust than systemd

3. **Use setsid with double fork** (Fallback)
   - Properly daemonize processes with `setsid` and double fork
   - Ensures processes survive parent shell exit
   - Trade-off: More complex but doesn't require systemd

**Example Implementation (Option 1)**:

```ini
# /etc/systemd/system/orchestrator-backend.service
[Unit]
Description=Orchestrator 3 Stream Backend
After=network.target postgresql.service

[Service]
Type=simple
User=adw-user
WorkingDirectory=/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/backend
ExecStart=/usr/bin/uv run python main.py
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Then in reboot endpoint:
```python
subprocess.run(["systemctl", "restart", "orchestrator-backend.service"])
subprocess.run(["systemctl", "restart", "orchestrator-frontend.service"])
```

---

### 💡 LOW RISK (Nice to Have)

#### Issue #10: Missing TypeScript Types for Response

**Description**: The `rebootOrchestrator()` function returns `response.data` with an implicit `any` type. This loses type safety and makes it harder for developers to know what properties are available.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/frontend/src/services/chatService.ts`
- Lines: `37-40`

**Current Code**:
```typescript
export async function rebootOrchestrator() {
  const response = await apiClient.post('/api/orchestrator/reboot')
  return response.data  // Implicit 'any' type
}
```

**Recommended Solutions**:

1. **Define interface and use generic** (Preferred)
   ```typescript
   interface RebootOrchestratorResponse {
     success: boolean
     message: string
     timestamp: string
   }

   export async function rebootOrchestrator(): Promise<RebootOrchestratorResponse> {
     const response = await apiClient.post<RebootOrchestratorResponse>('/api/orchestrator/reboot')
     return response.data
   }
   ```

---

#### Issue #11: Console.log Instead of Structured Logging

**Description**: The store uses `console.log` and `console.error` for logging instead of a proper logging service. This makes it harder to filter logs, track errors in production, and integrate with monitoring tools.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/frontend/src/stores/orchestratorStore.ts`
- Lines: `1026, 1031, 1033, 1043, 1048`

**Current Code**:
```typescript
console.log('🔄 Rebooting orchestrator (backend + frontend)...')
console.log('✅ Backend reboot triggered:', rebootResult)
console.error('⚠️  Backend reboot failed, continuing with frontend reset:', error)
```

**Recommended Solutions**:

1. **Use logging service** (Preferred)
   ```typescript
   import { logger } from '@/services/logger'

   logger.info('Rebooting orchestrator', { component: 'orchestratorStore' })
   logger.success('Backend reboot triggered', { result: rebootResult })
   logger.error('Backend reboot failed', { error })
   ```

---

#### Issue #12: TODO Comments Not Addressed

**Description**: The store has TODO comments for showing success/error notifications to users, but these were not implemented. Users won't receive visual feedback about reboot success or failure.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream/frontend/src/stores/orchestratorStore.ts`
- Lines: `1046, 1049`

**Current Code**:
```typescript
// Optional: Show success notification in UI
// TODO: Add toast notification component

// TODO: Show error notification
```

**Recommended Solutions**:

1. **Implement toast notification system** (Preferred)
   ```typescript
   import { useToast } from '@/composables/useToast'

   const toast = useToast()

   // On success
   toast.success('Orchestrator rebooted successfully')

   // On error
   toast.error('Failed to reboot orchestrator', { description: error.message })
   ```

---

## Verification Checklist

- [ ] All blockers addressed (N/A - no blockers)
- [x] High-risk issues identified and documented
- [ ] Hardcoded ports fixed to read from config
- [ ] Authentication added to reboot endpoint
- [ ] Race condition resolved with delayed execution
- [ ] Process targeting improved with PID files
- [x] Security vulnerabilities documented
- [x] Integration points validated
- [ ] Post-reboot health checks implemented
- [ ] Frontend reconnection logic improved
- [x] Code follows repository patterns
- [ ] Documentation updated for security considerations

---

## Final Verdict

**Status**: ⚠️ FAIL

**Reasoning**: While the orchestrator reboot integration is functionally complete and demonstrates good code organization, it contains **4 high-risk issues** that prevent safe deployment:

1. **Configuration mismatch**: Hardcoded ports in script don't match actual backend port (9403 vs 8002)
2. **Security vulnerability**: Unauthenticated endpoint allows anyone to trigger system reboot
3. **Race condition**: Backend may die before sending response to frontend
4. **Unsafe process management**: pkill patterns could kill unintended processes

These issues create operational risks (misleading status messages), security risks (unauthorized reboots), and reliability risks (inconsistent state after reboot). The implementation works in ideal conditions but is not production-ready.

**Next Steps**:

1. **CRITICAL**: Fix hardcoded port in reboot script (Issue #1) - read from .env
2. **CRITICAL**: Add authentication to reboot endpoint (Issue #2) - use existing auth system
3. **CRITICAL**: Resolve race condition (Issue #3) - use delayed execution with `at` command
4. **HIGH PRIORITY**: Replace pkill with PID file approach (Issue #4) - precise process targeting
5. **RECOMMENDED**: Add audit logging (Issue #6) - track who triggered reboots
6. **RECOMMENDED**: Implement health checks (Issue #7) - verify services started successfully
7. **RECOMMENDED**: Add reconnection backoff (Issue #8) - improve frontend resilience
8. **OPTIONAL**: Consider systemd services (Issue #9) - more robust service management
9. **POLISH**: Add TypeScript types (Issue #10) - improve type safety
10. **POLISH**: Implement toast notifications (Issue #12) - better user feedback

**Estimated Effort**:
- Critical fixes (Issues #1-4): 4-6 hours
- Recommended improvements (Issues #6-8): 3-4 hours
- Optional enhancements (Issues #9-12): 2-3 hours
- **Total**: 9-13 hours

Once high-risk issues are resolved, this feature will be safe for production deployment.

---

**Report File**: `app_review/review_orchestrator_reboot_20250108.md`
