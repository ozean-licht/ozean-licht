#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Test Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: remote test       ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/ssh.sh" test "$@"
result=$?
echo ""
print_navigation "/ → remote → test.sh" "tools/remote/list.sh" "related commands"
save_navigation "tools/remote/test.sh $*"
exit $result
