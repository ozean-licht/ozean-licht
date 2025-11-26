# Claude Code Slash Commands Documentation

## Overview

Slash commands provide an interface to manage Claude's behavior during interactive sessions. They include built-in commands for system operations and customizable commands for frequently-used workflows.

## Built-in Commands

Claude Code offers approximately 40 built-in commands covering:

- **Session management**: `/clear`, `/exit`, `/resume`, `/rewind`
- **Configuration**: `/config`, `/status`, `/model`, `/output-style`
- **Development tools**: `/review`, `/security-review`, `/bug`, `/sandbox`
- **Context management**: `/context`, `/cost`, `/usage`, `/compact`
- **Integration**: `/mcp`, `/ide`, `/hooks`, `/plugin`
- **Account management**: `/login`, `/logout`, `/permissions`

Key examples include `/help` for usage guidance, `/export` for conversation export, and `/doctor` for installation health checks.

## Custom Slash Commands

Users can create personalized commands stored as Markdown files in two locations:

**Project commands** (`.claude/commands/`) are repository-specific and shared with teams.

**Personal commands** (`~/.claude/commands/`) are available across all projects.

### Command Structure

Commands use the syntax `/<command-name> [arguments]`. The filename (minus `.md`) becomes the command name.

### Advanced Features

**Arguments**: Commands support both `$ARGUMENTS` (all args) and positional parameters (`$1`, `$2`, etc.).

**Bash execution**: Commands can run bash scripts using the `!` prefix, with output included in context.

**File references**: The `@` prefix includes file contents in commands.

**Thinking mode**: Extended thinking can be triggered through command definitions.

### Frontmatter Configuration

Commands support metadata fields:
- `description`: Brief command overview
- `allowed-tools`: Permitted tools for execution
- `argument-hint`: Expected parameters (displayed during auto-completion)
- `model`: Specific model selection
- `disable-model-invocation`: Prevents programmatic execution

## Advanced Command Types

**Plugin commands** distribute custom slash commands through plugin marketplaces with automatic namespacing using formats like `/plugin-name:command-name`.

**MCP slash commands** expose prompts from connected MCP servers using the pattern `/mcp__<server-name>__<prompt-name>`.

## SlashCommand Tool

This tool enables Claude to execute custom slash commands programmatically during conversations. It requires:
- Commands with populated `description` frontmatter
- User-defined commands only (built-in commands excluded)
- Optional permission configuration via `/permissions`

The tool includes a 15,000-character budget limit for command descriptions, adjustable through the `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable.

## Skills vs. Slash Commands

**Slash commands** suit simple, frequently-used prompts requiring explicit invocation.

**Agent Skills** handle complex workflows with multiple files, automatic discovery, and team standardization.

Use slash commands for quick templates; choose Skills for comprehensive, multi-file capabilities requiring structured workflows.
