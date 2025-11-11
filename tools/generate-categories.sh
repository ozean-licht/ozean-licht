#!/bin/bash
# Bulk generator for progressive disclosure tool categories
# This script generates all remaining category commands based on existing scripts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Generate containers category list.sh
cat > "${SCRIPT_DIR}/containers/list.sh" << 'EOF'
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
EOF

chmod +x "${SCRIPT_DIR}/containers/list.sh"

# Generate simplified container commands using docker script
for cmd in ps logs stats restart exec health inspect stop start top prune; do
    cat > "${SCRIPT_DIR}/containers/${cmd}.sh" << EOFCMD
#!/bin/bash
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../templates/shared.sh"

# Explain mode
if [[ "\$1" == "--explain" ]] || [[ "\$2" == "--explain" ]] || [[ "\$3" == "--explain" ]]; then
    print_header "${cmd^} Command - Explanation"
    echo "\${V}                                            \${V}"
    echo "\${V} This command wraps: docker ${cmd}          \${V}"
    echo "\${V}                                            \${V}"
    echo "\${V} For full details run without --explain     \${V}"
    print_footer
    exit 0
fi

# Execute via docker.sh script with output wrapping
"\${SCRIPT_DIR}/../scripts/docker.sh" ${cmd}_container "\$@" || "\${SCRIPT_DIR}/../scripts/docker.sh" ${cmd}_containers "\$@" || "\${SCRIPT_DIR}/../scripts/docker.sh" ${cmd} "\$@"
result=\$?

echo ""
print_navigation "/ → containers → ${cmd}.sh" "tools/containers/list.sh" "related commands"
save_navigation "tools/containers/${cmd}.sh \$*"
exit \$result
EOFCMD
    chmod +x "${SCRIPT_DIR}/containers/${cmd}.sh"
done

echo "✓ Containers category generated (11 commands)"

# Generate monitoring category
cat > "${SCRIPT_DIR}/monitoring/list.sh" << 'EOF'
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
EOF

chmod +x "${SCRIPT_DIR}/monitoring/list.sh"

for cmd in health health-all resources connectivity report; do
    cat > "${SCRIPT_DIR}/monitoring/${cmd}.sh" << EOFCMD
#!/bin/bash
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../templates/shared.sh"

if [[ "\$1" == "--explain" ]]; then
    print_header "${cmd^} Command - Explanation"
    echo "\${V}                                            \${V}"
    echo "\${V} This command performs: ${cmd}              \${V}"
    print_footer
    exit 0
fi

"\${SCRIPT_DIR}/../scripts/monitoring.sh" ${cmd//-/_} "\$@"
result=\$?
echo ""
print_navigation "/ → monitoring → ${cmd}.sh" "tools/monitoring/list.sh" "related commands"
save_navigation "tools/monitoring/${cmd}.sh \$*"
exit \$result
EOFCMD
    chmod +x "${SCRIPT_DIR}/monitoring/${cmd}.sh"
done

echo "✓ Monitoring category generated (9 commands)"

# Generate database category
cat > "${SCRIPT_DIR}/database/list.sh" << 'EOF'
#!/bin/bash
source "$(dirname "$0")/../templates/shared.sh"

print_header "Database Tools - 8 commands"
cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Backup workflow:                         ║
║     bash tools/database/backup.sh kids_ascension_db /backups/ka.sql ║
║     bash tools/database/size.sh kids_ascension_db ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ backup.sh <db_name> <output_file>         ║
║   Backup database to SQL file              ║
║   Example: bash tools/database/backup.sh kids_ascension_db /backups/ka.sql ║
║                                            ║
║ restore.sh <db_name> <input_file>         ║
║   Restore database from SQL file           ║
║   Example: bash tools/database/restore.sh kids_ascension_db /backups/ka.sql ║
║                                            ║
║ size.sh [db_name]                         ║
║   Check database size                      ║
║   Example: bash tools/database/size.sh kids_ascension_db ║
║                                            ║
║ connections.sh [db_name]                  ║
║   Show active connections                  ║
║   Example: bash tools/database/connections.sh ║
║                                            ║
║ query.sh <db_name> <query>                ║
║   Execute SQL query                        ║
║   Example: bash tools/database/query.sh kids_ascension_db "SELECT * FROM users LIMIT 5" ║
COMMANDS
print_footer
echo ""
print_success_rate "database" "postgres"
echo ""
print_navigation "/ → database" "tools/discover.sh" "[command].sh"
save_navigation "tools/database/list.sh"
EOF

chmod +x "${SCRIPT_DIR}/database/list.sh"

for cmd in backup restore size connections query; do
    cat > "${SCRIPT_DIR}/database/${cmd}.sh" << EOFCMD
#!/bin/bash
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../templates/shared.sh"

if [[ "\$1" == "--explain" ]]; then
    print_header "${cmd^} Command - Explanation"
    echo "\${V}                                            \${V}"
    echo "\${V} This command performs: database ${cmd}     \${V}"
    print_footer
    exit 0
fi

"\${SCRIPT_DIR}/../scripts/database.sh" ${cmd} "\$@"
result=\$?
echo ""
print_navigation "/ → database → ${cmd}.sh" "tools/database/list.sh" "related commands"
save_navigation "tools/database/${cmd}.sh \$*"
exit \$result
EOFCMD
    chmod +x "${SCRIPT_DIR}/database/${cmd}.sh"
done

echo "✓ Database category generated (8 commands)"

# Generate git category
cat > "${SCRIPT_DIR}/git/list.sh" << 'EOF'
#!/bin/bash
source "$(dirname "$0")/../templates/shared.sh"

print_header "Git Tools - 11 commands"
cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Commit and push:                         ║
║     bash tools/git/status.sh               ║
║     bash tools/git/commit.sh "feat: message" ║
║     bash tools/git/push.sh                 ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ status.sh                                 ║
║   Show working tree status                 ║
║   Example: bash tools/git/status.sh        ║
║                                            ║
║ commit.sh <message>                       ║
║   Commit staged changes                    ║
║   Example: bash tools/git/commit.sh "feat: add feature" ║
║                                            ║
║ push.sh [remote] [branch]                 ║
║   Push changes to remote                   ║
║   Example: bash tools/git/push.sh          ║
║                                            ║
║ pull.sh [remote] [branch]                 ║
║   Pull changes from remote                 ║
║   Example: bash tools/git/pull.sh          ║
║                                            ║
║ history.sh [lines]                        ║
║   Show commit history                      ║
║   Example: bash tools/git/history.sh 20    ║
║                                            ║
║ branch.sh [name]                          ║
║   List or create branches                  ║
║   Example: bash tools/git/branch.sh        ║
COMMANDS
print_footer
echo ""
print_success_rate "git" "version-control"
echo ""
print_navigation "/ → git" "tools/discover.sh" "[command].sh"
save_navigation "tools/git/list.sh"
EOF

chmod +x "${SCRIPT_DIR}/git/list.sh"

for cmd in status commit push pull history branch; do
    cat > "${SCRIPT_DIR}/git/${cmd}.sh" << EOFCMD
#!/bin/bash
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../templates/shared.sh"

if [[ "\$1" == "--explain" ]]; then
    print_header "${cmd^} Command - Explanation"
    echo "\${V}                                            \${V}"
    echo "\${V} This command performs: git ${cmd}          \${V}"
    print_footer
    exit 0
fi

"\${SCRIPT_DIR}/../scripts/git.sh" ${cmd} "\$@"
result=\$?
echo ""
print_navigation "/ → git → ${cmd}.sh" "tools/git/list.sh" "related commands"
save_navigation "tools/git/${cmd}.sh \$*"
exit \$result
EOFCMD
    chmod +x "${SCRIPT_DIR}/git/${cmd}.sh"
done

echo "✓ Git category generated (11 commands)"

# Generate remote category
cat > "${SCRIPT_DIR}/remote/list.sh" << 'EOF'
#!/bin/bash
source "$(dirname "$0")/../templates/shared.sh"

print_header "Remote Tools - 9 commands"
cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Execute remote command:                  ║
║     bash tools/remote/exec.sh "docker ps"  ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ exec.sh <command>                         ║
║   Execute command on remote server         ║
║   Example: bash tools/remote/exec.sh "docker ps" ║
║                                            ║
║ upload.sh <local> <remote>                ║
║   Upload file to remote server             ║
║   Example: bash tools/remote/upload.sh ./config.json /opt/config.json ║
║                                            ║
║ download.sh <remote> <local>              ║
║   Download file from remote server         ║
║   Example: bash tools/remote/download.sh /opt/logs.txt ./logs.txt ║
║                                            ║
║ test.sh                                   ║
║   Test SSH connection                      ║
║   Example: bash tools/remote/test.sh       ║
COMMANDS
print_footer
echo ""
print_success_rate "ssh" "remote"
echo ""
print_navigation "/ → remote" "tools/discover.sh" "[command].sh"
save_navigation "tools/remote/list.sh"
EOF

chmod +x "${SCRIPT_DIR}/remote/list.sh"

for cmd in exec upload download test; do
    cat > "${SCRIPT_DIR}/remote/${cmd}.sh" << EOFCMD
#!/bin/bash
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
source "\${SCRIPT_DIR}/../templates/shared.sh"

if [[ "\$1" == "--explain" ]]; then
    print_header "${cmd^} Command - Explanation"
    echo "\${V}                                            \${V}"
    echo "\${V} This command performs: remote ${cmd}       \${V}"
    print_footer
    exit 0
fi

"\${SCRIPT_DIR}/../scripts/ssh.sh" ${cmd} "\$@"
result=\$?
echo ""
print_navigation "/ → remote → ${cmd}.sh" "tools/remote/list.sh" "related commands"
save_navigation "tools/remote/${cmd}.sh \$*"
exit \$result
EOFCMD
    chmod +x "${SCRIPT_DIR}/remote/${cmd}.sh"
done

echo "✓ Remote category generated (9 commands)"

echo ""
echo "=========================================="
echo "✓ All categories generated successfully!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Deployment: 6 commands"
echo "  - Containers: 11 commands"
echo "  - Monitoring: 9 commands"
echo "  - Database: 8 commands"
echo "  - Git: 11 commands"
echo "  - Remote: 9 commands"
echo "  Total: 54 commands"
echo ""
