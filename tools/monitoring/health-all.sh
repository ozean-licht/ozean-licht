#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Health-all Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: health-all              ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/monitoring.sh" health_all "$@"
result=$?
echo ""
print_navigation "/ → monitoring → health-all.sh" "tools/monitoring/list.sh" "related commands"
save_navigation "tools/monitoring/health-all.sh $*"
exit $result
