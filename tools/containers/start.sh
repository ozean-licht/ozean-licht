#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

# Explain mode
if [[ "$1" == "--explain" ]] || [[ "$2" == "--explain" ]] || [[ "$3" == "--explain" ]]; then
    print_header "Start Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command wraps: docker start          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} For full details run without --explain     ${V}"
    print_footer
    exit 0
fi

# Execute via docker.sh script with output wrapping
"${SCRIPT_DIR}/../scripts/docker.sh" start_container "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" start_containers "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" start "$@"
result=$?

echo ""
print_navigation "/ → containers → start.sh" "tools/containers/list.sh" "related commands"
save_navigation "tools/containers/start.sh $*"
exit $result
