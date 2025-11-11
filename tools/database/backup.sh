#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Backup Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: database backup     ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/database.sh" backup "$@"
result=$?
echo ""
print_navigation "/ → database → backup.sh" "tools/database/list.sh" "related commands"
save_navigation "tools/database/backup.sh $*"
exit $result
