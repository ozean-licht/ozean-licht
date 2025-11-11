#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Restore Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: database restore     ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/database.sh" restore "$@"
result=$?
echo ""
print_navigation "/ → database → restore.sh" "tools/database/list.sh" "related commands"
save_navigation "tools/database/restore.sh $*"
exit $result
