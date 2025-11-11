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
