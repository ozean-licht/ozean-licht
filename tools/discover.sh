#!/bin/bash
# Main entry point for tool discovery
# Version: 1.0.0
# Description: Progressive disclosure starting point - shows all categories

source "$(dirname "$0")/templates/shared.sh"

print_header "Tool Discovery System - 6 Categories"

cat << 'CATEGORIES'
║                                            ║
║ 📦 deployment - Coolify app management     ║
║    Deploy, restart, monitor applications   ║
║    → bash tools/deployment/list.sh         ║
║                                            ║
║ 🐳 containers - Docker operations          ║
║    Manage containers, logs, resources      ║
║    → bash tools/containers/list.sh         ║
║                                            ║
║ 📊 monitoring - Health & metrics           ║
║    System health, resources, connectivity  ║
║    → bash tools/monitoring/list.sh         ║
║                                            ║
║ 🗄️  database - PostgreSQL operations       ║
║    Backup, restore, query databases        ║
║    → bash tools/database/list.sh           ║
║                                            ║
║ 📝 git - Version control                   ║
║    Commit, push, branch management         ║
║    → bash tools/git/list.sh                ║
║                                            ║
║ 🌐 remote - SSH & file transfer           ║
║    Remote execution, upload, download      ║
║    → bash tools/remote/list.sh             ║
CATEGORIES

print_footer

echo ""
echo "💡 Pro tip: Use 'bash tools/what.sh \"task\"' for smart routing"
echo "📊 Usage: This saves ~18k tokens vs loading all tools upfront"
echo ""

print_navigation "tools/discover.sh" "" "[category]/list.sh or tools/what.sh"

# Save navigation
save_navigation "tools/discover.sh"
