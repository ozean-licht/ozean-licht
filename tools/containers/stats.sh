#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

# Explain mode
if [[ "$1" == "--explain" ]] || [[ "$2" == "--explain" ]] || [[ "$3" == "--explain" ]]; then
    print_header "Stats Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command wraps: docker stats          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} For full details run without --explain     ${V}"
    print_footer
    exit 0
fi

# Execute via docker.sh script with output wrapping
"${SCRIPT_DIR}/../scripts/docker.sh" stats_container "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" stats_containers "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" stats "$@"
result=$?

echo ""
print_navigation "/ → containers → stats.sh" "tools/containers/list.sh" "related commands"
save_navigation "tools/containers/stats.sh $*"
exit $result
