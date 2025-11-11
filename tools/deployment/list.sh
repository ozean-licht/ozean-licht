#!/bin/bash
# Deployment Tools - Command list
# Version: 1.0.0

source "$(dirname "$0")/../templates/shared.sh"

print_header "Deployment Tools - 6 commands"

cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Deploy & verify:                         ║
║     bash tools/deployment/deploy.sh 3 &&   ║
║     bash tools/deployment/status.sh 3      ║
║                                            ║
║   Check health first:                      ║
║     bash tools/deployment/health.sh &&     ║
║     bash tools/deployment/deploy.sh 3      ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ list-apps.sh                              ║
║   List all Coolify applications            ║
║   Example: bash tools/deployment/list-apps.sh  ║
║                                            ║
║ deploy.sh <app_id>                        ║
║   Deploy application to production         ║
║   Example: bash tools/deployment/deploy.sh 3   ║
║   Add --explain for detailed info          ║
║                                            ║
║ restart.sh <app_id>                       ║
║   Restart running application              ║
║   Example: bash tools/deployment/restart.sh 3  ║
║   Add --explain for detailed info          ║
║                                            ║
║ status.sh <app_id>                        ║
║   Check deployment status                  ║
║   Example: bash tools/deployment/status.sh 3   ║
║   Add --explain for detailed info          ║
║                                            ║
║ logs.sh <app_id> [lines]                  ║
║   View deployment logs                     ║
║   Example: bash tools/deployment/logs.sh 3 50  ║
║   Add --explain for detailed info          ║
║                                            ║
║ health.sh                                 ║
║   Check Coolify API health                 ║
║   Example: bash tools/deployment/health.sh     ║
║   Add --explain for detailed info          ║
COMMANDS

print_footer

echo ""
print_success_rate "coolify" "deployment"
echo ""

print_navigation "/ → deployment" "tools/discover.sh" "[command].sh or [command].sh --explain"

save_navigation "tools/deployment/list.sh"
