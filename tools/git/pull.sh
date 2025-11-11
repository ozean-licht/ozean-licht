#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Pull Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: git pull          ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/git.sh" pull "$@"
result=$?
echo ""
print_navigation "/ → git → pull.sh" "tools/git/list.sh" "related commands"
save_navigation "tools/git/pull.sh $*"
exit $result
