#!/bin/bash
#
# Setup Cursor Cache Cleanup Cron Job
# Configures automated weekly cleanup of Cursor server cache
#

set -euo pipefail

echo "════════════════════════════════════════════════════════════"
echo "Cursor Cache Cleanup - Cron Setup"
echo "════════════════════════════════════════════════════════════"

# Create log file with proper permissions
LOG_FILE="/var/log/cursor-cleanup.log"
sudo touch "$LOG_FILE"
sudo chmod 666 "$LOG_FILE"
echo "✅ Created log file: $LOG_FILE"

# Create cron job (runs every Sunday at 3 AM)
CRON_JOB="0 3 * * 0 /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh >> /var/log/cursor-cleanup.log 2>&1"

# Check if cron job already exists
if sudo crontab -l 2>/dev/null | grep -q "cursor-cache-cleanup.sh"; then
    echo "⚠️  Cron job already exists. Skipping..."
else
    # Add cron job to root crontab (required for /root/.cursor-server access)
    (sudo crontab -l 2>/dev/null || true; echo "$CRON_JOB") | sudo crontab -
    echo "✅ Added weekly cron job (Sundays at 3 AM)"
fi

# Show current cron configuration
echo ""
echo "Current cron jobs for root:"
echo "────────────────────────────────────────────────────────────"
sudo crontab -l | grep -E "cursor|^#" || echo "No cron jobs found"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Manual cleanup commands:"
echo "  Dry run:  sudo /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh --dry-run"
echo "  Execute:  sudo /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh"
echo "  Force:    sudo /opt/ozean-licht-ecosystem/scripts/cursor-cache-cleanup.sh --force"
echo ""
echo "Schedule: Every Sunday at 3:00 AM (when Cursor is typically closed)"
echo "Logs:     tail -f /var/log/cursor-cleanup.log"
echo "════════════════════════════════════════════════════════════"
