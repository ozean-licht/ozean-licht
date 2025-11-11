#!/bin/bash
# Learning Mode - Natural language help with explanations
# Version: 1.0.0
# Description: Educational mode that explains choices and differences

source "$(dirname "$0")/templates/shared.sh"

query="${*:-}"

if [ -z "$query" ]; then
    print_header "Learning Mode - Natural Language Help"
    echo "${V}                                            ${V}"
    echo "${V} Usage: tools/learn.sh \"what you want\"    ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Examples:                                  ${V}"
    echo "${V}   tools/learn.sh \"is mcp running\"        ${V}"
    echo "${V}   tools/learn.sh \"deploy vs restart\"     ${V}"
    echo "${V}   tools/learn.sh \"check database\"        ${V}"
    echo "${V}                                            ${V}"
    print_footer
    print_navigation "tools/learn.sh" "" "tools/discover.sh"
    exit 0
fi

query_lower=$(echo "$query" | tr '[:upper:]' '[:lower:]')

print_header "Learning: $query"
echo "${V}                                            ${V}"

# Pattern matching with educational explanations
matched=false

# Check if MCP is running
if [[ "$query_lower" =~ "mcp" ]] && [[ "$query_lower" =~ "running|up|status|check" ]]; then
    matched=true
    echo "${V} ${CYAN}Recommended approaches:${NC}                     ${V}"
    echo "${V}                                            ${V}"
    echo "${V} 1. Check container status:                 ${V}"
    echo "${V}    bash tools/containers/ps.sh mcp-gateway ${V}"
    echo "${V}                                            ${V}"
    echo "${V} 2. Check service health:                   ${V}"
    echo "${V}    bash tools/monitoring/health.sh         ${V}"
    echo "${V}                                            ${V}"
    echo "${V} ${CYAN}Difference:${NC}                                 ${V}"
    echo "${V} - Option 1: Shows if container exists      ${V}"
    echo "${V}   and is running (Docker level)            ${V}"
    echo "${V} - Option 2: Checks if service responds     ${V}"
    echo "${V}   to health checks (Application level)     ${V}"
    echo "${V}                                            ${V}"
fi

# Deploy vs restart
if [[ "$query_lower" =~ "deploy" ]] && [[ "$query_lower" =~ "vs|versus|or|difference" ]] && [[ "$query_lower" =~ "restart" ]]; then
    matched=true
    echo "${V} ${CYAN}Deploy vs Restart - Key Differences:${NC}       ${V}"
    echo "${V}                                            ${V}"
    echo "${V} ${GREEN}Deploy${NC} (bash tools/deployment/deploy.sh):  ${V}"
    echo "${V}   - Pulls latest code from repository      ${V}"
    echo "${V}   - Rebuilds Docker image                  ${V}"
    echo "${V}   - Recreates containers                   ${V}"
    echo "${V}   - Takes 45-90 seconds                    ${V}"
    echo "${V}   - Use when: code changes pushed          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} ${YELLOW}Restart${NC} (bash tools/deployment/restart.sh):${V}"
    echo "${V}   - Stops and starts existing containers   ${V}"
    echo "${V}   - No code pull or rebuild                ${V}"
    echo "${V}   - Takes 5-10 seconds                     ${V}"
    echo "${V}   - Use when: app stuck, config reload     ${V}"
    echo "${V}                                            ${V}"
fi

# Database backup
if [[ "$query_lower" =~ "database|db|postgres" ]] && [[ "$query_lower" =~ "backup|dump|export" ]]; then
    matched=true
    echo "${V} ${CYAN}Database Backup Options:${NC}                   ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Single database:                           ${V}"
    echo "${V}   bash tools/database/backup.sh \\          ${V}"
    echo "${V}     kids_ascension_db /backups/ka.sql      ${V}"
    echo "${V}                                            ${V}"
    echo "${V} All databases:                             ${V}"
    echo "${V}   bash tools/database/backup-all.sh \\      ${V}"
    echo "${V}     /backups/                              ${V}"
    echo "${V}                                            ${V}"
    echo "${V} ${CYAN}Important:${NC}                                  ${V}"
    echo "${V}   - Backups are SQL dumps (text format)    ${V}"
    echo "${V}   - Compress large databases (.gz)         ${V}"
    echo "${V}   - Test restore periodically              ${V}"
    echo "${V}                                            ${V}"
fi

# Container logs
if [[ "$query_lower" =~ "logs|log" ]] && [[ "$query_lower" =~ "container|docker" ]]; then
    matched=true
    echo "${V} ${CYAN}Viewing Container Logs:${NC}                    ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Last 50 lines:                             ${V}"
    echo "${V}   bash tools/containers/logs.sh \\          ${V}"
    echo "${V}     mcp-gateway                            ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Last 200 lines:                            ${V}"
    echo "${V}   bash tools/containers/logs.sh \\          ${V}"
    echo "${V}     mcp-gateway 200                        ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Follow logs (real-time):                   ${V}"
    echo "${V}   bash tools/containers/logs.sh \\          ${V}"
    echo "${V}     mcp-gateway 50 follow                  ${V}"
    echo "${V}                                            ${V}"
fi

if [ "$matched" = false ]; then
    echo "${V} ${YELLOW}No specific guidance for this query${NC}    ${V}"
    echo "${V}                                            ${V}"
    echo "${V} Try these discovery options:               ${V}"
    echo "${V}   bash tools/what.sh \"$query\"             ${V}"
    echo "${V}   bash tools/discover.sh                   ${V}"
    echo "${V}                                            ${V}"
fi

print_footer
print_navigation "tools/learn.sh" "" "suggested commands or tools/discover.sh"

save_navigation "tools/learn.sh \"$query\""
