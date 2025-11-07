"""
Simple Slash Command Parser for Orchestrator

Scans ONLY the orchestrator's .claude/commands/ directory.
No hierarchical loading, no complex logic - just basic command discovery.
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
    """Pydantic model for slash command frontmatter."""

    allowed_tools: Optional[List[str]] = Field(default=None)
    argument_hint: Optional[str] = Field(default=None, alias="argument-hint")
    description: Optional[str] = Field(default=None)
    model: Optional[str] = Field(default=None)
    disable_model_invocation: Optional[bool] = Field(default=False, alias="disable-model-invocation")

    class Config:
        populate_by_name = True


def parse_slash_command_frontmatter(frontmatter_text: str) -> Optional[SlashCommandFrontmatter]:
    """Parse YAML frontmatter with special handling for argument-hint."""
    if not frontmatter_text or not frontmatter_text.strip():
        return None

    # Auto-quote argument-hint values to handle special characters
    processed_text = _preprocess_argument_hint(frontmatter_text)

    try:
        data = yaml.safe_load(processed_text)
        if data is None:
            return None
        return SlashCommandFrontmatter(**data)
    except (yaml.YAMLError, ValueError):
        return None


def _preprocess_argument_hint(frontmatter_text: str) -> str:
    """Ensure argument-hint values are quoted for YAML parsing."""
    lines = []
    for line in frontmatter_text.split("\n"):
        match = re.match(r"^(\s*argument-hint\s*:\s*)(.+?)(\s*)$", line)
        if match:
            indent, value, trailing = match.groups()
            # Check if already quoted
            if not (value.startswith('"') and value.endswith('"')) and \
               not (value.startswith("'") and value.endswith("'")):
                # Quote if contains special YAML characters
                if any(char in value for char in ["[", "]", "{", "}", ":", "|", ">", "#"]):
                    escaped_value = value.replace('"', '\\"')
                    lines.append(f'{indent}"{escaped_value}"{trailing}')
                    continue
        lines.append(line)
    return "\n".join(lines)


def parse_slash_command_file(file_content: str) -> Optional[SlashCommandFrontmatter]:
    """Parse a complete slash command .md file and extract frontmatter."""
    if not file_content.startswith("---"):
        return None

    parts = file_content.split("---", 2)
    if len(parts) < 3:
        return None

    return parse_slash_command_frontmatter(parts[1])


def discover_slash_commands(orchestrator_dir: str) -> List[dict]:
    """
    Discover slash commands from orchestrator's .claude/commands/ directory.

    Simple and direct - no hierarchical loading, no complex logic.
    Just scans the orchestrator's own commands directory.

    Args:
        orchestrator_dir: Path to orchestrator app directory (apps/orchestrator_3_stream)

    Returns:
        List of command dicts with name, description, arguments, model
    """
    try:
        commands = []
        commands_dir = Path(orchestrator_dir) / ".claude" / "commands"

        logger.info(f"🔍 Attempting to load commands from: {commands_dir}")
        logger.info(f"📂 Directory exists: {commands_dir.exists()}")
        logger.info(f"📂 Is absolute: {commands_dir.is_absolute()}")

        if not commands_dir.exists():
            logger.error(f"❌ Commands directory not found: {commands_dir}")
            logger.error(f"   Orchestrator dir: {orchestrator_dir}")
            logger.error(f"   Resolved path: {commands_dir.resolve()}")
            return []

        logger.info(f"✅ Loading slash commands from: {commands_dir}")

        # Scan all .md files
        for file_path in sorted(commands_dir.glob("*.md")):
            try:
                content = file_path.read_text()
                frontmatter = parse_slash_command_file(content)

                command_dict = {
                    "name": file_path.stem,
                    "description": frontmatter.description if frontmatter else "",
                    "arguments": frontmatter.argument_hint if frontmatter else "",
                    "model": frontmatter.model if frontmatter else "",
                    "allowed_tools": frontmatter.allowed_tools if frontmatter else [],
                    "disable_model_invocation": frontmatter.disable_model_invocation if frontmatter else False,
                    "source": "orchestrator",
                }
                commands.append(command_dict)

            except Exception as e:
                logger.error(f"Failed to parse command file {file_path.name}: {e}")
                continue

        logger.info(f"✅ Loaded {len(commands)} slash commands from {commands_dir}")
        return commands

    except Exception as e:
        logger.error(f"❌ Error in discover_slash_commands: {e}", exc_info=True)
        return []
