#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Branch Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: git branch          ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/git.sh" branch "$@"
result=$?
echo ""
print_navigation "/ → git → branch.sh" "tools/git/list.sh" "related commands"
save_navigation "tools/git/branch.sh $*"
exit $result
