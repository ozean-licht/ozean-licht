#!/bin/bash
source "$(dirname "$0")/../templates/shared.sh"

print_header "Monitoring Tools - 9 commands"
cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Full system check:                       ║
║     bash tools/monitoring/health-all.sh    ║
║     bash tools/monitoring/resources.sh     ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ health.sh [service]                       ║
║   Check service health                     ║
║   Example: bash tools/monitoring/health.sh mcp-gateway ║
║                                            ║
║ health-all.sh                             ║
║   Check all services health                ║
║   Example: bash tools/monitoring/health-all.sh ║
║                                            ║
║ resources.sh                              ║
║   Check system resources                   ║
║   Example: bash tools/monitoring/resources.sh ║
║                                            ║
║ connectivity.sh <target>                  ║
║   Test network connectivity                ║
║   Example: bash tools/monitoring/connectivity.sh coolify.ozean-licht.dev ║
║                                            ║
║ report.sh                                 ║
║   Generate monitoring report               ║
║   Example: bash tools/monitoring/report.sh ║
COMMANDS
print_footer
echo ""
print_success_rate "monitoring" "health"
echo ""
print_navigation "/ → monitoring" "tools/discover.sh" "[command].sh"
save_navigation "tools/monitoring/list.sh"
