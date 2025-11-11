#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Connections Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: database connections     ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/database.sh" connections "$@"
result=$?
echo ""
print_navigation "/ → database → connections.sh" "tools/database/list.sh" "related commands"
save_navigation "tools/database/connections.sh $*"
exit $result
