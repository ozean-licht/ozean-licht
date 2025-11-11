# Claude Code Slash Commands Documentation

## Overview
Slash commands control Claude's behavior during interactive sessions. They include built-in commands, custom user-defined commands, plugin commands, and MCP server commands.

## Built-in Commands
Claude Code provides 30+ built-in commands including:
- **Conversation management**: `/clear`, `/compact`, `/rewind`, `/export`
- **Configuration**: `/config`, `/model`, `/status`, `/settings`
- **Analysis tools**: `/context`, `/cost`, `/review`, `/doctor`
- **Advanced features**: `/sandbox`, `/agents`, `/hooks`, `/mcp`

## Custom Slash Commands

### Project vs. Personal Scope
Commands can be stored in project-specific (`.claude/commands/`) or personal (`~/.claude/commands/`) directories. Project commands are shared with teams; personal commands work across all projects.

### Key Features
**Arguments**: Commands support dynamic values using `$ARGUMENTS` (all arguments) or `$1`, `$2` (positional parameters).

**Bash execution**: The `!` prefix allows bash commands to execute before the command runs, with their output included as context.

**File references**: The `@` prefix enables referencing file contents directly within commands.

**Thinking mode**: Extended thinking can be triggered through specific keywords in command definitions.

### Frontmatter Configuration
Commands support metadata fields including:
- `allowed-tools` - Specifies which tools the command can use
- `description` - Brief command description displayed in help
- `argument-hint` - Expected argument format shown during autocomplete
- `model` - Specific model selection for that command
- `disable-model-invocation` - Prevents automated command execution

## Plugin and MCP Commands
Plugins can provide custom commands following the pattern `/plugin-name:command-name`. MCP servers expose prompts as dynamically discovered commands using the format `/mcp__<server>__<prompt>`.

## SlashCommand Tool
This tool allows Claude to programmatically execute custom commands during conversations. It requires descriptions in frontmatter and respects permission rules. A character budget (default 15,000) limits command metadata size.

## Slash Commands vs. Agent Skills
Slash commands suit simple, frequently-used prompts, while Skills handle complex workflows requiring multiple files, scripts, and comprehensive structure.
