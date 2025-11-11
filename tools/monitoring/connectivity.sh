#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Connectivity Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: connectivity              ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/monitoring.sh" connectivity "$@"
result=$?
echo ""
print_navigation "/ → monitoring → connectivity.sh" "tools/monitoring/list.sh" "related commands"
save_navigation "tools/monitoring/connectivity.sh $*"
exit $result
