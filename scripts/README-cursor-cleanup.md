# Cursor Cache Cleanup Automation

Automated cleanup system for Cursor server cache to prevent buildup and maintain optimal performance.

## Files

- **cursor-cache-cleanup.sh** - Main cleanup script
- **setup-cursor-cleanup-cron.sh** - One-time setup for automated scheduling
- **README-cursor-cleanup.md** - This documentation

## Quick Start

### Initial Setup (run once)

```bash
# Setup automated weekly cleanup
./scripts/setup-cursor-cleanup-cron.sh
```

This will:
1. Create log file `/var/log/cursor-cleanup.log`
2. Add cron job to run every Sunday at 3 AM
3. Display current configuration

### Manual Cleanup

```bash
# Test run (no changes)
sudo ./scripts/cursor-cache-cleanup.sh --dry-run

# Clean cache (safe - checks if Cursor is running)
sudo ./scripts/cursor-cache-cleanup.sh

# Force cleanup (even if Cursor is running)
sudo ./scripts/cursor-cache-cleanup.sh --force
```

## What Gets Cleaned

### 1. Workspace Storage (Full Clean)
- **Location:** `/root/.cursor-server/data/User/workspaceStorage/*`
- **Content:** Extension state, workspace cache, session data
- **Action:** Complete removal (rebuilds on next launch)
- **Impact:** ~100-500 MB freed

### 2. Logs (Keep Recent)
- **Location:** `/root/.cursor-server/data/logs/*`
- **Content:** Extension logs, debug output, error traces
- **Action:** Remove files older than 3 days
- **Impact:** ~50-200 MB freed

### 3. Cached Data (Clean Old)
- **Location:** `/root/.cursor-server/data/CachedData/*`
- **Content:** Downloaded extension files, node modules
- **Action:** Remove files older than 7 days
- **Impact:** ~100-300 MB freed

### 4. Temporary Files (Full Clean)
- **Location:** `/root/.cursor-server/data/tmp/*`
- **Content:** Temporary processing files
- **Action:** Complete removal
- **Impact:** ~10-50 MB freed

## Safety Features

✅ **Checks if Cursor is running** - Skips cleanup unless `--force` flag provided
✅ **Preserves configuration** - User settings, extensions remain intact
✅ **Keeps recent logs** - Last 3 days of logs retained for debugging
✅ **Dry-run mode** - Test before executing with `--dry-run`
✅ **Detailed logging** - All operations logged to `/var/log/cursor-cleanup.log`

## Schedule

**Default:** Every Sunday at 3:00 AM (when Cursor is typically closed)

**Modify schedule:**
```bash
# Edit root crontab
sudo crontab -e

# Examples:
# Daily at 3 AM:    0 3 * * * /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh
# Twice weekly:     0 3 * * 0,3 /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh
# Monthly (1st):    0 3 1 * * /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh
```

## Monitoring

```bash
# View cleanup logs
tail -f /var/log/cursor-cleanup.log

# Check last cleanup
tail -20 /var/log/cursor-cleanup.log

# Check cron execution
grep cursor-cleanup /var/log/syslog
```

## Troubleshooting

### "Cursor server is currently running"
**Solution:** Close Cursor or use `--force` flag
```bash
sudo ./scripts/cursor-cache-cleanup.sh --force
```

### "Permission denied"
**Solution:** Script must run as root to access `/root/.cursor-server`
```bash
sudo ./scripts/cursor-cache-cleanup.sh
```

### Extension Host still using high CPU after cleanup
**Solution:** Full Cursor restart required
```bash
# Kill all Cursor processes
sudo pkill -9 -f cursor-server

# Restart Cursor from your launcher
```

## Performance Impact

**Expected improvements:**
- 📉 Extension Host CPU: 9% → 0.5% (after restart)
- 💾 Cache size: 500 MB → 50 MB
- ⚡ Startup time: -20% faster
- 🧠 Memory: -200 MB freed

**Safe to run:** Yes - only removes cache, preserves all settings and extensions

**Output includes:**
- System disk usage before/after
- RAM usage before/after
- Per-category breakdown (Workspace → Logs → Cached Data)
- Clear summary: Before → Cleaned → After

## When to Run Manually

- **Extension Host high CPU** - Before restarting Cursor
- **Slow startup** - Clear workspace cache
- **Disk space low** - Free up 300-500 MB
- **After large refactoring** - Clear stale workspace state
- **Extension issues** - Reset extension cache

## Configuration

**Workspace cleanup retention:** Change line 200+ in script
```bash
# Keep last N workspace caches (default: 0 = clean all)
find "$CURSOR_SERVER_DIR/data/User/workspaceStorage" -mindepth 1 -maxdepth 1 | head -n -N | xargs rm -rf
```

**Log retention:** Change line 150+ in script
```bash
# Keep last N days (default: 3)
find "$CURSOR_SERVER_DIR/data/logs" -type f -mtime +N -delete
```

## Logs Format

```
[2025-11-11 14:30:01] ════════════════════════════════════════════════════════════
[2025-11-11 14:30:01] Cursor Server Cache Cleanup
[2025-11-11 14:30:01] ════════════════════════════════════════════════════════════
[2025-11-11 14:30:01] System Resources:
[2025-11-11 14:30:01]   - Disk: 145G used / 458G total (32% usage)
[2025-11-11 14:30:01]   - RAM: 8.2G used / 62G total
[2025-11-11 14:30:01]
[2025-11-11 14:30:02] Calculating current cache sizes...
[2025-11-11 14:30:02] Current cache sizes:
[2025-11-11 14:30:02]   - Workspace Storage: 325 MiB
[2025-11-11 14:30:02]   - Logs: 142 MiB
[2025-11-11 14:30:02]   - Cached Data: 87 MiB
[2025-11-11 14:30:02]   - Total: 554 MiB
[2025-11-11 14:30:02]
[2025-11-11 14:30:03] Starting cleanup...
[2025-11-11 14:30:05] ✅ Cleaned 15 workspace cache directories
[2025-11-11 14:30:06] ✅ Removed 42 old log files
[2025-11-11 14:30:07] ✅ Removed 128 cached files
[2025-11-11 14:30:08] ════════════════════════════════════════════════════════════
[2025-11-11 14:30:08] ✅ Cleanup Complete!
[2025-11-11 14:30:08]
[2025-11-11 14:30:08] 📊 Cache Cleanup Summary:
[2025-11-11 14:30:08]   Before:  554 MiB
[2025-11-11 14:30:08]   Cleaned: 487 MiB
[2025-11-11 14:30:08]   After:   67 MiB
[2025-11-11 14:30:08]
[2025-11-11 14:30:08] 📁 Breakdown by Category:
[2025-11-11 14:30:08]   Workspace Storage: 325 MiB → 12 MiB
[2025-11-11 14:30:08]   Logs: 142 MiB → 38 MiB
[2025-11-11 14:30:08]   Cached Data: 87 MiB → 17 MiB
[2025-11-11 14:30:08]
[2025-11-11 14:30:08] 💻 System Resources After Cleanup:
[2025-11-11 14:30:08]   - Disk: 144G used / 458G total (32% usage)
[2025-11-11 14:30:08]   - RAM: 8.1G used / 62G total
[2025-11-11 14:30:08] ════════════════════════════════════════════════════════════
```

## Uninstall

```bash
# Remove cron job
sudo crontab -l | grep -v cursor-cache-cleanup | sudo crontab -

# Remove scripts
rm -f /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh
rm -f /opt/ozean-licht-ecosystem/scripts/setup-cursor-cleanup-cron.sh
rm -f /opt/ozean-licht-ecosystem/scripts/README-cursor-cleanup.md

# Remove logs
sudo rm -f /var/log/cursor-cleanup.log
```

---

**Last Updated:** 2025-11-11
**Tested On:** Ubuntu 22.04 LTS, Cursor Server c6d93c13
**Recent Changes:** Added system resource monitoring (disk/RAM) and enhanced summary output
