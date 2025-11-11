#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Download Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: remote download       ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/ssh.sh" download "$@"
result=$?
echo ""
print_navigation "/ → remote → download.sh" "tools/remote/list.sh" "related commands"
save_navigation "tools/remote/download.sh $*"
exit $result
