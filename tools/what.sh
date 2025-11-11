#!/bin/bash
# Intent Router - Maps natural language to tool categories
# Version: 1.0.0
# Description: Smart routing based on natural language queries

source "$(dirname "$0")/templates/shared.sh"

# Intent mapping patterns
declare -A INTENT_MAP=(
    ["deploy|deployment|release|rollout|publish|coolify"]="deployment"
    ["docker|container|ps|image|compose|pod"]="containers"
    ["health|monitor|metrics|cpu|memory|disk|status|check|uptime"]="monitoring"
    ["backup|restore|database|postgres|sql|query|migration|db"]="database"
    ["git|commit|push|pull|branch|merge|stash|diff|clone"]="git"
    ["ssh|remote|upload|download|tunnel|scp|rsync|sftp"]="remote"
)

# Main function
main() {
    local query="${1:-}"

    if [ -z "$query" ]; then
        print_header "Intent Router - What do you want to do?"
        echo "${V}                                            ${V}"
        echo "${V} Usage: tools/what.sh \"your task\"          ${V}"
        echo "${V}                                            ${V}"
        echo "${V} Examples:                                  ${V}"
        echo "${V}   tools/what.sh \"deploy application\"      ${V}"
        echo "${V}   tools/what.sh \"check system health\"     ${V}"
        echo "${V}   tools/what.sh \"backup database\"         ${V}"
        echo "${V}   tools/what.sh \"view container logs\"     ${V}"
        echo "${V}                                            ${V}"
        print_footer
        print_navigation "tools/what.sh" "" "tools/discover.sh"
        exit 0
    fi

    # Convert to lowercase for matching
    query_lower=$(echo "$query" | tr '[:upper:]' '[:lower:]')

    print_header "Analyzing: $query"
    echo "${V}                                            ${V}"

    local found=false
    local categories=()

    for pattern in "${!INTENT_MAP[@]}"; do
        if [[ "$query_lower" =~ $pattern ]]; then
            local category="${INTENT_MAP[$pattern]}"
            if [[ ! " ${categories[@]} " =~ " ${category} " ]]; then
                categories+=("$category")
            fi
            found=true
        fi
    done

    if [ "$found" = true ]; then
        echo "${V} ${GREEN}✓${NC} Found ${#categories[@]} matching categor$([ ${#categories[@]} -eq 1 ] && echo "y" || echo "ies"):        ${V}"
        echo "${V}                                            ${V}"
        for category in "${categories[@]}"; do
            echo "${V}   ${CYAN}→${NC} tools/$category/                      ${V}"
            echo "${V}     bash tools/$category/list.sh           ${V}"
            echo "${V}                                            ${V}"
        done
    else
        echo "${V} ${YELLOW}?${NC} No exact match found                   ${V}"
        echo "${V}                                            ${V}"
        echo "${V} Browse all categories:                     ${V}"
        echo "${V}   bash tools/discover.sh                   ${V}"
        echo "${V}                                            ${V}"
    fi

    print_footer
    print_navigation "tools/what.sh" "" "suggested category or tools/discover.sh"

    # Save navigation
    save_navigation "tools/what.sh \"$query\""
}

main "$@"
