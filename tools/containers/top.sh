#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

# Explain mode
if [[ "$1" == "--explain" ]] || [[ "$2" == "--explain" ]] || [[ "$3" == "--explain" ]]; then
    print_header "Top Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command wraps: docker top          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} For full details run without --explain     ${V}"
    print_footer
    exit 0
fi

# Execute via docker.sh script with output wrapping
"${SCRIPT_DIR}/../scripts/docker.sh" top_container "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" top_containers "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" top "$@"
result=$?

echo ""
print_navigation "/ → containers → top.sh" "tools/containers/list.sh" "related commands"
save_navigation "tools/containers/top.sh $*"
exit $result
