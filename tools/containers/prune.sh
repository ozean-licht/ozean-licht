#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

# Explain mode
if [[ "$1" == "--explain" ]] || [[ "$2" == "--explain" ]] || [[ "$3" == "--explain" ]]; then
    print_header "Prune Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command wraps: docker prune          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} For full details run without --explain     ${V}"
    print_footer
    exit 0
fi

# Execute via docker.sh script with output wrapping
"${SCRIPT_DIR}/../scripts/docker.sh" prune_container "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" prune_containers "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" prune "$@"
result=$?

echo ""
print_navigation "/ → containers → prune.sh" "tools/containers/list.sh" "related commands"
save_navigation "tools/containers/prune.sh $*"
exit $result
