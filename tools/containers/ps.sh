#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

# Explain mode
if [[ "$1" == "--explain" ]] || [[ "$2" == "--explain" ]] || [[ "$3" == "--explain" ]]; then
    print_header "Ps Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command wraps: docker ps          ${V}"
    echo "${V}                                            ${V}"
    echo "${V} For full details run without --explain     ${V}"
    print_footer
    exit 0
fi

# Execute via docker.sh script with output wrapping
"${SCRIPT_DIR}/../scripts/docker.sh" ps_container "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" ps_containers "$@" || "${SCRIPT_DIR}/../scripts/docker.sh" ps "$@"
result=$?

echo ""
print_navigation "/ → containers → ps.sh" "tools/containers/list.sh" "related commands"
save_navigation "tools/containers/ps.sh $*"
exit $result
