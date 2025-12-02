#!/bin/bash
# setup-cron.sh - Install backup cron jobs
# Version: 1.0.0

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup.sh"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Ozean Licht Backup - Cron Setup${NC}"
echo "================================="
echo ""

# Check if backup script exists
if [[ ! -x "${BACKUP_SCRIPT}" ]]; then
    echo -e "${YELLOW}[WARNING]${NC} Backup script not executable. Fixing..."
    chmod +x "${BACKUP_SCRIPT}"
fi

# Create cron entries
CRON_DB="0 * * * * ${BACKUP_SCRIPT} db >> /dev/null 2>&1"
CRON_FULL="0 3 * * * ${BACKUP_SCRIPT} full >> /dev/null 2>&1"

echo "Proposed cron schedule:"
echo ""
echo "  Hourly database backups (every hour on the hour):"
echo -e "  ${GREEN}${CRON_DB}${NC}"
echo ""
echo "  Daily full backups (3 AM):"
echo -e "  ${GREEN}${CRON_FULL}${NC}"
echo ""

read -p "Install these cron jobs? (yes/NO) " -r
echo

if [[ $REPLY == "yes" ]]; then
    # Get current crontab
    CURRENT_CRON=$(crontab -l 2>/dev/null || echo "")

    # Check if already installed
    if echo "$CURRENT_CRON" | grep -q "ozean-licht-ecosystem/tools/backup"; then
        echo -e "${YELLOW}[WARNING]${NC} Backup cron jobs already exist. Removing old entries..."
        CURRENT_CRON=$(echo "$CURRENT_CRON" | grep -v "ozean-licht-ecosystem/tools/backup")
    fi

    # Add new cron jobs
    NEW_CRON="${CURRENT_CRON}
# Ozean Licht Backup System
${CRON_DB}
${CRON_FULL}
"

    echo "$NEW_CRON" | crontab -

    echo -e "${GREEN}[SUCCESS]${NC} Cron jobs installed!"
    echo ""
    echo "Current crontab:"
    crontab -l | grep -A2 "Ozean Licht"
else
    echo "Cron installation cancelled."
    echo ""
    echo "To install manually, add these lines to your crontab (crontab -e):"
    echo ""
    echo "# Ozean Licht Backup System"
    echo "${CRON_DB}"
    echo "${CRON_FULL}"
fi

echo ""
echo "You can also run backups manually:"
echo "  ${BACKUP_SCRIPT} full   # Full backup now"
echo "  ${BACKUP_SCRIPT} db     # Database backup only"
echo "  ${BACKUP_SCRIPT} list   # List all backups"
