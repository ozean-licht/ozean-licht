#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Upload Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: remote upload       ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/ssh.sh" upload "$@"
result=$?
echo ""
print_navigation "/ → remote → upload.sh" "tools/remote/list.sh" "related commands"
save_navigation "tools/remote/upload.sh $*"
exit $result
