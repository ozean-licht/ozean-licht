#!/bin/bash
# git.sh - Enhanced git operations with state tracking
# Version: 1.0.0
# Description: Git wrapper with safety checks and state management

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils.sh"

# Tool configuration
TOOL_NAME="git"

# Check dependencies
require_command "git"

#######################################
# Enhanced Status
#######################################

status_enhanced() {
    log_info "Getting enhanced git status"

    echo ""
    echo "Git Repository Status:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Current branch
    local current_branch=$(git branch --show-current 2>/dev/null || echo "detached HEAD")
    printf "  Current Branch:     ${CYAN}%s${NC}\n" "$current_branch"

    # Remote tracking
    local remote_branch=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "no remote")
    printf "  Remote Tracking:    %s\n" "$remote_branch"

    # Commit status
    local ahead=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "0")
    local behind=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo "0")
    printf "  Commits Ahead:      %s\n" "$ahead"
    printf "  Commits Behind:     %s\n" "$behind"

    # Working directory status
    local modified=$(git diff --name-only | wc -l)
    local staged=$(git diff --cached --name-only | wc -l)
    local untracked=$(git ls-files --others --exclude-standard | wc -l)

    printf "  Modified Files:     %s\n" "$modified"
    printf "  Staged Files:       %s\n" "$staged"
    printf "  Untracked Files:    %s\n" "$untracked"

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Standard git status
    git status --short

    log_success "Enhanced status displayed"
}

#######################################
# Commit with State
#######################################

commit_with_state() {
    local message="$1"

    if [[ -z "$message" ]]; then
        handle_error 1 "Commit message required"
    fi

    log_info "Creating commit: $message"

    # Check for staged changes
    if [[ -z $(git diff --cached --name-only) ]]; then
        log_error "No staged changes to commit"
        return 1
    fi

    # Create commit
    local output=$(execute_and_record "$TOOL_NAME" git commit -m "$message" 2>&1)
    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        local commit_hash=$(git rev-parse --short HEAD)
        log_success "Commit created: $commit_hash"
        echo "$output"
        return 0
    else
        log_error "Commit failed"
        echo "$output"
        return 1
    fi
}

#######################################
# Push with Validation
#######################################

push_with_validation() {
    local force="${1:-false}"

    log_info "Validating before push"

    # Check if we're on a branch
    local current_branch=$(git branch --show-current 2>/dev/null)
    if [[ -z "$current_branch" ]]; then
        handle_error 1 "Cannot push from detached HEAD"
    fi

    # Check for uncommitted changes
    if [[ -n $(git status --porcelain) ]]; then
        log_warning "You have uncommitted changes"
        read -p "Continue with push anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Push cancelled"
            return 1
        fi
    fi

    # Check remote tracking
    local remote_branch=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)
    if [[ -z "$remote_branch" ]]; then
        log_warning "No remote tracking branch set"
        local remote="${2:-origin}"
        log_info "Setting upstream to: $remote/$current_branch"
        execute_and_record "$TOOL_NAME" git push -u "$remote" "$current_branch"
        return $?
    fi

    # Perform push
    log_info "Pushing to: $remote_branch"

    if [[ "$force" == "true" ]]; then
        log_warning "Force pushing..."
        execute_and_record "$TOOL_NAME" git push --force-with-lease
    else
        execute_and_record "$TOOL_NAME" git push
    fi

    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        log_success "Push completed successfully"
    else
        log_error "Push failed"
    fi

    return $exit_code
}

#######################################
# Branch Info
#######################################

branch_info() {
    log_info "Getting current branch information"

    local current_branch=$(git branch --show-current 2>/dev/null || echo "detached HEAD")

    echo ""
    echo "Branch Information: $current_branch"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Last commit
    echo "Last Commit:"
    git log -1 --format="  %h - %s" 2>/dev/null
    git log -1 --format="  Author: %an <%ae>" 2>/dev/null
    git log -1 --format="  Date: %ar" 2>/dev/null

    echo ""

    # Branch comparison with main/master
    local main_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")
    if [[ "$current_branch" != "$main_branch" ]]; then
        local commits_ahead=$(git rev-list --count ${main_branch}..HEAD 2>/dev/null || echo "0")
        local commits_behind=$(git rev-list --count HEAD..${main_branch} 2>/dev/null || echo "0")
        echo "Comparison with $main_branch:"
        echo "  Commits ahead: $commits_ahead"
        echo "  Commits behind: $commits_behind"
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    log_success "Branch info displayed"
}

#######################################
# Recent Commits
#######################################

recent_commits() {
    local count="${1:-10}"

    log_info "Showing last $count commits"

    echo ""
    git log -n "$count" --format="%C(yellow)%h%C(reset) - %s %C(green)(%ar)%C(reset) %C(blue)<%an>%C(reset)" --abbrev-commit

    echo ""
    log_success "Recent commits displayed"
}

#######################################
# Stash Operations
#######################################

stash_changes() {
    local message="${1:-WIP: stashed changes}"

    log_info "Stashing changes: $message"

    execute_and_record "$TOOL_NAME" git stash push -m "$message"

    if [[ $? -eq 0 ]]; then
        log_success "Changes stashed"
    else
        log_error "Stash failed"
        return 1
    fi
}

list_stashes() {
    log_info "Listing stashes"

    echo ""
    git stash list
    echo ""

    log_success "Stashes listed"
}

apply_stash() {
    local stash_id="${1:-0}"

    log_info "Applying stash: stash@{$stash_id}"

    execute_and_record "$TOOL_NAME" git stash apply "stash@{$stash_id}"

    if [[ $? -eq 0 ]]; then
        log_success "Stash applied"
    else
        log_error "Failed to apply stash"
        return 1
    fi
}

#######################################
# Clean Operations
#######################################

clean_untracked() {
    local dry_run="${1:-true}"

    if [[ "$dry_run" == "true" ]]; then
        log_info "Dry run: showing files that would be removed"
        git clean -n -d
    else
        log_warning "Removing untracked files"
        execute_and_record "$TOOL_NAME" git clean -f -d
    fi
}

#######################################
# Checkout Operations
#######################################

checkout_branch() {
    local branch="$1"
    local create="${2:-false}"

    if [[ -z "$branch" ]]; then
        handle_error 1 "Branch name required"
    fi

    if [[ "$create" == "true" ]]; then
        log_info "Creating and checking out branch: $branch"
        execute_and_record "$TOOL_NAME" git checkout -b "$branch"
    else
        log_info "Checking out branch: $branch"
        execute_and_record "$TOOL_NAME" git checkout "$branch"
    fi

    if [[ $? -eq 0 ]]; then
        log_success "Checked out: $branch"
    else
        log_error "Checkout failed"
        return 1
    fi
}

#######################################
# Pull with Rebase
#######################################

pull_rebase() {
    log_info "Pulling with rebase"

    # Check for uncommitted changes
    if [[ -n $(git status --porcelain) ]]; then
        log_error "You have uncommitted changes. Stash or commit them first."
        return 1
    fi

    execute_and_record "$TOOL_NAME" git pull --rebase

    if [[ $? -eq 0 ]]; then
        log_success "Pull with rebase completed"
    else
        log_error "Pull failed - may have conflicts"
        return 1
    fi
}

#######################################
# Main Function
#######################################

main() {
    local operation="${1:-help}"
    shift || true

    case "$operation" in
        status_enhanced)
            status_enhanced "$@"
            ;;
        commit_with_state)
            commit_with_state "$@"
            ;;
        push_with_validation)
            push_with_validation "$@"
            ;;
        branch_info)
            branch_info "$@"
            ;;
        recent_commits)
            recent_commits "$@"
            ;;
        stash_changes)
            stash_changes "$@"
            ;;
        list_stashes)
            list_stashes "$@"
            ;;
        apply_stash)
            apply_stash "$@"
            ;;
        clean_untracked)
            clean_untracked "$@"
            ;;
        checkout_branch)
            checkout_branch "$@"
            ;;
        pull_rebase)
            pull_rebase "$@"
            ;;
        help|--help|-h)
            cat <<EOF
Git Operations Script - Enhanced Git Workflow
Version: 1.0.0

Usage: $0 <operation> [arguments]

Operations:
  status_enhanced                        Enhanced git status with branch info
  commit_with_state <message>            Commit changes with state tracking
  push_with_validation [force]           Push with pre-flight checks
  branch_info                            Get current branch information
  recent_commits [count]                 Show recent commits (default: 10)
  stash_changes [message]                Stash working directory changes
  list_stashes                           List all stashes
  apply_stash [id]                       Apply stash (default: stash@{0})
  clean_untracked [dry_run]              Remove untracked files
  checkout_branch <name> [create]        Checkout or create branch
  pull_rebase                            Pull with rebase
  help                                   Show this help message

Examples:
  $0 status_enhanced
  $0 commit_with_state "feat: Add new feature"
  $0 push_with_validation
  $0 branch_info
  $0 recent_commits 20
  $0 stash_changes "WIP: testing feature"
  $0 checkout_branch feature/new-feature true
  $0 pull_rebase

Safety Features:
  - Checks for uncommitted changes before push/pull
  - Validates remote tracking before push
  - Dry-run option for dangerous operations
  - State tracking for all operations

EOF
            ;;
        *)
            log_error "Unknown operation: $operation"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function if script is executed (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
