#!/bin/bash
# Shared UI templates for progressive disclosure
# Version: 1.0.0

# Box drawing characters
TL="╔" TR="╗" BL="╚" BR="╝" H="═" V="║" T="╠" B="╣"

# Colors - respect NO_COLOR environment variable (https://no-color.org/)
if [[ -n "${NO_COLOR}" ]] || [[ "${TERM}" == "dumb" ]]; then
    # No colors - clean output
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    CYAN=''
    NC=''
else
    # Colors enabled
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    NC='\033[0m'
fi

# Print formatted header
print_header() {
    local title="$1"
    local width=46
    echo "${TL}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${TR}"
    printf "${V}  %-42s ${V}\n" "$title"
    echo "${T}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${B}"
}

# Print footer
print_footer() {
    echo "${BL}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${H}${BR}"
}

# Print navigation breadcrumbs
print_navigation() {
    local current="$1"
    local previous="${2:-tools/discover.sh}"
    local next="${3:-}"

    echo ""
    if [[ -n "${NO_COLOR}" ]] || [[ "${TERM}" == "dumb" ]]; then
        echo "Current: $current"
        [ -n "$previous" ] && echo "Back: bash $previous"
        [ -n "$next" ] && echo "Next: $next"
    else
        echo -e "${CYAN}Current:${NC} $current"
        [ -n "$previous" ] && echo -e "${CYAN}Back:${NC} bash $previous"
        [ -n "$next" ] && echo -e "${CYAN}Next:${NC} $next"
    fi
    echo ""
}

# Print success rate from state
print_success_rate() {
    local tool_name="$1"
    local command="$2"
    local state_file="/opt/ozean-licht-ecosystem/tools/inventory/tool-state.json"

    if [ -f "$state_file" ] && command -v jq &> /dev/null; then
        local total=$(jq -r ".tools.\"${tool_name}\".metrics.total_executions // 0" "$state_file" 2>/dev/null)
        local successful=$(jq -r ".tools.\"${tool_name}\".metrics.successful_executions // 0" "$state_file" 2>/dev/null)

        if [ "$total" -gt 0 ]; then
            local rate=$((successful * 100 / total))
            if [ $rate -gt 90 ]; then
                echo -e "${GREEN}✓${NC} Used $total times (${rate}% success)"
            elif [ $rate -gt 70 ]; then
                echo -e "${YELLOW}⚠${NC} Used $total times (${rate}% success)"
            else
                echo -e "${RED}✗${NC} Used $total times (${rate}% success)"
            fi
        fi
    fi
}

# Record command usage (lightweight wrapper)
record_usage() {
    local category="$1"
    local command="$2"
    local success="$3"

    # This integrates with existing state management in utils.sh
    # The actual recording is done by execute_and_record in utils.sh
}

# Load state data for navigation history
save_navigation() {
    local current_path="$1"
    local state_file="/opt/ozean-licht-ecosystem/tools/inventory/tool-state.json"

    if [ -f "$state_file" ] && command -v jq &> /dev/null; then
        local tmp_file="${state_file}.tmp"
        jq ".navigation.last_command = \"$current_path\" | .navigation.timestamp = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"" "$state_file" > "$tmp_file" 2>/dev/null && mv "$tmp_file" "$state_file" || rm -f "$tmp_file"
    fi
}
