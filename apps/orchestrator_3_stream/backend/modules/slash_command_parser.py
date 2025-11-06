"""
Slash Command Frontmatter Parser

Parses YAML frontmatter from slash command .md files with special handling
for the argument-hint field, which should always be treated as a plain string.

Reference: https://docs.anthropic.com/en/docs/claude-code/slash-commands
"""

import re
import yaml
import logging
from pathlib import Path
from typing import Optional, List
from pydantic import BaseModel, Field

# Module-level logger
logger = logging.getLogger(__name__)


class SlashCommandFrontmatter(BaseModel):
    """
    Pydantic model for slash command frontmatter.

    All fields are optional per the Claude Code specification.
    """

    allowed_tools: Optional[List[str]] = Field(
        default=None,
        description="Tools the command can use. Inherits from conversation if not specified.",
    )

    argument_hint: Optional[str] = Field(
        default=None,
        alias="argument-hint",
        description="Arguments expected for slash command. Example: 'add [tagId] | remove [tagId] | list'",
    )

    description: Optional[str] = Field(
        default=None, description="Brief description. Uses first line if not specified."
    )

    model: Optional[str] = Field(
        default=None,
        description="Specific model string. Inherits from conversation if not specified.",
    )

    disable_model_invocation: Optional[bool] = Field(
        default=False,
        alias="disable-model-invocation",
        description="Prevent SlashCommand tool from calling this command.",
    )

    class Config:
        populate_by_name = True  # Allow both 'argument_hint' and 'argument-hint'


def parse_slash_command_frontmatter(
    frontmatter_text: str,
) -> Optional[SlashCommandFrontmatter]:
    """
    Parse slash command YAML frontmatter with special handling for argument-hint.

    The argument-hint field can contain square brackets like [tagId] which are NOT
    YAML list syntax - they're just documentation notation. This parser ensures
    argument-hint is always treated as a plain string.

    Args:
        frontmatter_text: Raw YAML frontmatter text (without --- delimiters)

    Returns:
        SlashCommandFrontmatter model or None if parsing fails

    Example:
        >>> frontmatter = '''
        ... description: Add or remove tags
        ... argument-hint: add [tagId] | remove [tagId] | list
        ... model: sonnet
        ... '''
        >>> result = parse_slash_command_frontmatter(frontmatter)
        >>> result.argument_hint
        'add [tagId] | remove [tagId] | list'
    """
    if not frontmatter_text or not frontmatter_text.strip():
        return None

    # Pre-process the frontmatter to auto-quote argument-hint values
    processed_text = _preprocess_argument_hint(frontmatter_text)

    # Parse with YAML
    try:
        data = yaml.safe_load(processed_text)
        if data is None:
            return None

        # Convert to Pydantic model
        return SlashCommandFrontmatter(**data)

    except (yaml.YAMLError, ValueError) as e:
        # If parsing fails, return None (caller should handle)
        return None


def _preprocess_argument_hint(frontmatter_text: str) -> str:
    """
    Pre-process frontmatter to ensure argument-hint values are quoted.

    This allows argument-hint to contain square brackets and other special
    characters without YAML interpreting them as syntax.

    Args:
        frontmatter_text: Raw YAML frontmatter text

    Returns:
        Processed YAML with argument-hint values properly quoted

    Example:
        >>> text = "argument-hint: add [tagId] | remove [tagId]"
        >>> _preprocess_argument_hint(text)
        'argument-hint: "add [tagId] | remove [tagId]"'
    """
    lines = frontmatter_text.split("\n")
    processed_lines = []

    for line in lines:
        # Match lines like: "argument-hint: <value>"
        # Capture the key and value separately
        match = re.match(r"^(\s*argument-hint\s*:\s*)(.+?)(\s*)$", line)

        if match:
            indent = match.group(1)  # "argument-hint: "
            value = match.group(2)  # The actual value
            trailing = match.group(3)  # Trailing whitespace

            # Check if value is already quoted
            if value.startswith('"') and value.endswith('"'):
                # Already quoted, keep as-is
                processed_lines.append(line)
            elif value.startswith("'") and value.endswith("'"):
                # Already quoted with single quotes, keep as-is
                processed_lines.append(line)
            else:
                # Not quoted - check if it needs quoting
                # Quote if it contains special YAML characters: [ ] { } : | > etc.
                needs_quoting = any(
                    char in value for char in ["[", "]", "{", "}", ":", "|", ">", "#"]
                )

                if needs_quoting:
                    # Escape any existing quotes in the value
                    escaped_value = value.replace('"', '\\"')
                    # Add quotes around the value
                    processed_lines.append(f'{indent}"{escaped_value}"{trailing}')
                else:
                    # No special characters, keep as-is
                    processed_lines.append(line)
        else:
            # Not an argument-hint line, keep as-is
            processed_lines.append(line)

    return "\n".join(processed_lines)


def parse_slash_command_file(file_content: str) -> Optional[SlashCommandFrontmatter]:
    """
    Parse a complete slash command .md file and extract frontmatter.

    Args:
        file_content: Full content of the .md file

    Returns:
        SlashCommandFrontmatter model or None if no valid frontmatter found

    Example:
        >>> content = '''---
        ... description: My command
        ... argument-hint: [arg1] [arg2]
        ... ---
        ...
        ... # Command content here
        ... '''
        >>> result = parse_slash_command_file(content)
        >>> result.argument_hint
        '[arg1] [arg2]'
    """
    if not file_content.startswith("---"):
        return None

    # Split by --- to extract frontmatter
    parts = file_content.split("---", 2)

    if len(parts) < 3:
        return None

    frontmatter_text = parts[1]

    return parse_slash_command_frontmatter(frontmatter_text)


def _load_commands_from_dir(commands_dir, source: str = "unknown") -> List[dict]:
    """
    Helper function to load commands from a specific directory.

    Args:
        commands_dir: Path to .claude/commands/ directory
        source: Source of the commands ("global" or "app")

    Returns:
        List of command dicts with source metadata
    """
    commands = []
    commands_dir = Path(commands_dir)
    if not commands_dir.exists():
        return commands

    # Find all .md files
    for file_path in commands_dir.glob("*.md"):
        try:
            content = file_path.read_text()
            frontmatter = parse_slash_command_file(content)

            if frontmatter:
                commands.append(
                    {
                        "name": file_path.stem,
                        "description": frontmatter.description or "",
                        "arguments": frontmatter.argument_hint or "",
                        "model": frontmatter.model or "",
                        "allowed_tools": frontmatter.allowed_tools or [],
                        "disable_model_invocation": frontmatter.disable_model_invocation
                        or False,
                        "source": source,  # Add source metadata
                    }
                )
            else:
                commands.append(
                    {
                        "name": file_path.stem,
                        "description": "",
                        "arguments": "",
                        "model": "",
                        "allowed_tools": [],
                        "disable_model_invocation": False,
                        "source": source,  # Add source metadata
                    }
                )
        except Exception as e:
            logger.error(
                f"Failed to parse slash command file {file_path.name} from {source}: {e}",
                exc_info=True
            )
            # Don't raise, continue loading other commands

    return commands


def discover_slash_commands(working_dir: str) -> List[dict]:
    """
    Discover slash commands from both root and app-specific .claude/commands/ directories.

    Implements hierarchical loading with precedence:
    1. Load commands from root repository (/opt/ozean-licht-ecosystem/.claude/commands/)
    2. Load commands from app-specific directory (working_dir/.claude/commands/)
    3. App-specific commands override root commands with the same name

    Args:
        working_dir: Working directory containing app-specific .claude/commands/

    Returns:
        List of dicts with name, description, arguments, model, and source metadata

    Example:
        >>> commands = discover_slash_commands("/opt/ozean-licht-ecosystem/apps/orchestrator_3_stream")
        >>> commands[0]
        {
            "name": "my-command",
            "description": "Does something cool",
            "arguments": "[arg1] [arg2]",
            "model": "sonnet",
            "source": "global"
        }
    """

    # 1. Load root commands from /opt/ozean-licht-ecosystem/.claude/commands/
    root_commands = []
    try:
        root_commands_dir = Path("/opt/ozean-licht-ecosystem/.claude/commands")
        if root_commands_dir.exists():
            root_commands = _load_commands_from_dir(root_commands_dir, "global")
            logger.info(f"Loaded {len(root_commands)} root commands from {root_commands_dir}")
        else:
            logger.debug(f"Root commands directory not found: {root_commands_dir}")
    except Exception as e:
        logger.warning(f"Failed to load root commands: {e}")
        # Continue without root commands

    # 2. Load app-specific commands from working_dir/.claude/commands/
    app_commands = []
    try:
        app_commands_dir = Path(working_dir) / ".claude" / "commands"
        if app_commands_dir.exists():
            app_commands = _load_commands_from_dir(app_commands_dir, "app")
            logger.info(f"Loaded {len(app_commands)} app-specific commands from {app_commands_dir}")
        else:
            logger.debug(f"App commands directory not found: {app_commands_dir}")
    except Exception as e:
        logger.warning(f"Failed to load app commands: {e}")
        # Continue without app commands

    # 3. Merge with precedence: app-specific overrides root
    merged = {cmd['name']: cmd for cmd in root_commands}

    # Track conflicts for logging
    conflicts = []
    for cmd in app_commands:
        if cmd['name'] in merged:
            conflicts.append(cmd['name'])
        merged[cmd['name']] = cmd

    if conflicts:
        logger.info(f"App-specific commands overriding root commands: {', '.join(conflicts)}")

    commands = list(merged.values())

    # Sort by name for consistent ordering
    commands.sort(key=lambda x: x["name"])

    logger.info(f"Total commands available: {len(commands)} ({len(root_commands)} global + {len(app_commands)} app - {len(conflicts)} duplicates)")

    return commands
