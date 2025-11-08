"""
Slash Command Filter Module

Filters slash commands to show only primary commands by default,
reducing UI clutter while keeping all commands available.
"""

from typing import List, Dict, Any

# Primary commands that should always be visible
PRIMARY_COMMANDS = {
    # Work Management
    "create_issue",
    "bug",
    "feature",

    # Core Development
    "implement",
    "test",

    # Status
    "health_check",
}

# Command categories for organized display
COMMAND_CATEGORIES = {
    "Work Management": ["create_issue", "bug", "feature"],
    "Development": ["implement", "test", "review"],
    "System": ["health_check", "cleanup_worktrees"],
    "Advanced": ["commit", "pull_request", "document"],
}


def filter_slash_commands(commands: List[Dict[str, Any]], show_all: bool = False) -> List[Dict[str, Any]]:
    """
    Filter slash commands to show only primary ones by default.

    Args:
        commands: List of command dictionaries from filesystem
        show_all: If True, return all commands (for help/documentation)

    Returns:
        Filtered list of commands
    """
    if show_all:
        return commands

    # Filter to only show primary commands
    filtered = []
    for cmd in commands:
        cmd_name = cmd.get("name", "").replace("/", "")
        if cmd_name in PRIMARY_COMMANDS:
            # Mark as primary for UI styling
            cmd["is_primary"] = True
            filtered.append(cmd)

    return filtered


def get_command_suggestions(partial: str, commands: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Get command suggestions based on partial input.

    Shows both primary and secondary commands when user starts typing.

    Args:
        partial: Partial command string
        commands: Full list of commands

    Returns:
        Matching commands with relevance scoring
    """
    if not partial:
        # No input - show only primary
        return filter_slash_commands(commands)

    # Clean the partial input
    partial = partial.lower().strip().replace("/", "")

    suggestions = []
    for cmd in commands:
        cmd_name = cmd.get("name", "").replace("/", "").lower()

        # Check for match
        if cmd_name.startswith(partial):
            # Exact prefix match - highest priority
            cmd["match_score"] = 100
            cmd["is_primary"] = cmd_name in PRIMARY_COMMANDS
            suggestions.append(cmd)
        elif partial in cmd_name:
            # Contains match - lower priority
            cmd["match_score"] = 50
            cmd["is_primary"] = cmd_name in PRIMARY_COMMANDS
            suggestions.append(cmd)

    # Sort by: primary first, then match score, then alphabetical
    suggestions.sort(key=lambda x: (
        not x.get("is_primary", False),
        -x.get("match_score", 0),
        x.get("name", "")
    ))

    return suggestions[:10]  # Limit to top 10 suggestions


def get_categorized_commands(commands: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Organize commands by category for help display.

    Args:
        commands: Full list of commands

    Returns:
        Dictionary mapping category names to command lists
    """
    categorized = {}
    uncategorized = []

    # First, assign commands to known categories
    for category, category_commands in COMMAND_CATEGORIES.items():
        categorized[category] = []
        for cmd in commands:
            cmd_name = cmd.get("name", "").replace("/", "")
            if cmd_name in category_commands:
                cmd["is_primary"] = cmd_name in PRIMARY_COMMANDS
                categorized[category].append(cmd)

    # Find uncategorized commands
    all_categorized = set()
    for cmds in COMMAND_CATEGORIES.values():
        all_categorized.update(cmds)

    for cmd in commands:
        cmd_name = cmd.get("name", "").replace("/", "")
        if cmd_name not in all_categorized:
            uncategorized.append(cmd)

    if uncategorized:
        categorized["Other"] = uncategorized

    # Remove empty categories
    categorized = {k: v for k, v in categorized.items() if v}

    return categorized