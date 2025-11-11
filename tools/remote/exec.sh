#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Exec Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: remote exec       ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/ssh.sh" exec "$@"
result=$?
echo ""
print_navigation "/ → remote → exec.sh" "tools/remote/list.sh" "related commands"
save_navigation "tools/remote/exec.sh $*"
exit $result
