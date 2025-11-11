#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../templates/shared.sh"

if [[ "$1" == "--explain" ]]; then
    print_header "Commit Command - Explanation"
    echo "${V}                                            ${V}"
    echo "${V} This command performs: git commit          ${V}"
    print_footer
    exit 0
fi

"${SCRIPT_DIR}/../scripts/git.sh" commit "$@"
result=$?
echo ""
print_navigation "/ → git → commit.sh" "tools/git/list.sh" "related commands"
save_navigation "tools/git/commit.sh $*"
exit $result
