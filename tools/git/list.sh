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
