#!/bin/bash
# Navigation helper - shows current position and options
# Version: 1.0.0

source "$(dirname "$0")/templates/shared.sh"

# Read last command from state
state_file="/opt/ozean-licht-ecosystem/tools/inventory/tool-state.json"
last_command="tools/discover.sh"

if [ -f "$state_file" ] && command -v jq &> /dev/null; then
    last_command=$(jq -r '.navigation.last_command // "tools/discover.sh"' "$state_file" 2>/dev/null || echo "tools/discover.sh")
fi

print_header "Navigation Helper"
echo "${V}                                            ${V}"
echo "${V} Last command: $last_command"
printf "${V} %-42s ${V}\n" ""
echo "${V}                                            ${V}"
echo "${V} Quick jumps:                               ${V}"
echo "${V}   Home:       bash tools/discover.sh       ${V}"
echo "${V}   Intent:     bash tools/what.sh \"task\"   ${V}"
echo "${V}   Learning:   bash tools/learn.sh \"task\"  ${V}"
echo "${V}                                            ${V}"
print_footer

print_navigation "tools/nav.sh" "$last_command" "tools/discover.sh"
