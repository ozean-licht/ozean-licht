#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Resources Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: resources              ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/monitoring.sh" resources "$@"
result=$?
echo ""
print_navigation "/ → monitoring → resources.sh" "tools/monitoring/list.sh" "related commands"
save_navigation "tools/monitoring/resources.sh $*"
exit $result
