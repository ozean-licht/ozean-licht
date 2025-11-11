#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Query Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: database query     ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/database.sh" query "$@"
result=$?
echo ""
print_navigation "/ → database → query.sh" "tools/database/list.sh" "related commands"
save_navigation "tools/database/query.sh $*"
exit $result
