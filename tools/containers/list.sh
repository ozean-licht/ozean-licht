#!/bin/bash
source "$(dirname "$0")/../templates/shared.sh"

print_header "Container Tools - 11 commands"
cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Check MCP Gateway:                       ║
║     bash tools/containers/ps.sh mcp-gateway ║
║     bash tools/containers/logs.sh mcp-gateway ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ ps.sh [filter]                            ║
║   List all containers                      ║
║   Example: bash tools/containers/ps.sh     ║
║            bash tools/containers/ps.sh mcp ║
║                                            ║
║ logs.sh <container> [lines] [follow]      ║
║   View container logs                      ║
║   Example: bash tools/containers/logs.sh mcp-gateway 100 ║
║                                            ║
║ stats.sh                                  ║
║   View resource usage statistics           ║
║   Example: bash tools/containers/stats.sh  ║
║                                            ║
║ restart.sh <container>                    ║
║   Restart a container                      ║
║   Example: bash tools/containers/restart.sh mcp-gateway ║
║                                            ║
║ exec.sh <container> <command>             ║
║   Execute command in container             ║
║   Example: bash tools/containers/exec.sh mcp-gateway "npm --version" ║
║                                            ║
║ health.sh [container]                     ║
║   Check Docker/container health            ║
║   Example: bash tools/containers/health.sh ║
║                                            ║
║ inspect.sh <container>                    ║
║   Inspect container details                ║
║   Example: bash tools/containers/inspect.sh mcp-gateway ║
║                                            ║
║ stop.sh <container> [timeout]             ║
║   Stop a container                         ║
║   Example: bash tools/containers/stop.sh mcp-gateway ║
║                                            ║
║ start.sh <container>                      ║
║   Start a container                        ║
║   Example: bash tools/containers/start.sh mcp-gateway ║
║                                            ║
║ top.sh <container>                        ║
║   Show container processes                 ║
║   Example: bash tools/containers/top.sh mcp-gateway ║
║                                            ║
║ prune.sh [type]                           ║
║   Remove unused resources                  ║
║   Example: bash tools/containers/prune.sh containers ║
COMMANDS
print_footer
echo ""
print_success_rate "docker" "containers"
echo ""
print_navigation "/ → containers" "tools/discover.sh" "[command].sh or [command].sh --explain"
save_navigation "tools/containers/list.sh"
