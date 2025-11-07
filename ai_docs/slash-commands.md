# Slash Commands Documentation Summary

## Built-in Commands Overview

Claude Code provides 30+ built-in slash commands for controlling behavior during sessions. Key categories include:

**Conversation Management**: Commands like `/clear` remove history, while `/compact` streamlines conversations with optional focus instructions. The `/export` feature allows saving discussions to files.

**Configuration & Status**: Users can access `/config` for settings, `/status` for version/account information, and `/cost` to "show token usage statistics."

**Development Tools**: `/sandbox` enables "sandboxed bash tool with filesystem and network isolation," while `/review` requests code analysis.

## Custom Slash Commands

Users can create personalized commands through Markdown files organized by scope:

**Project Commands** (`.claude/commands/`): Shared with team members and labeled "(project)" in help listings.

**Personal Commands** (`~/.claude/commands/`): Available across all projects, marked "(user)" when displayed.

### Advanced Features

**Arguments**: Commands support dynamic values through `$ARGUMENTS` (captures all arguments) or positional parameters like `$1`, `$2` for granular access.

**Bash Integration**: Using the `!` prefix executes shell commands before execution. The frontmatter requires specifying `allowed-tools: Bash(...)` with permitted commands.

**File References**: The `@` prefix includes file contents, enabling commands to reference and compare multiple files.

**Frontmatter Options**: Commands support metadata including `allowed-tools`, `argument-hint`, `description`, and model selection.

## MCP & Plugin Commands

**MCP Integration**: Connected MCP servers expose prompts as slash commands following the pattern `/mcp__<server-name>__<prompt-name>`. Permissions notably don't support wildcards—use just the server name to approve all tools.

**Plugin Commands**: Distributed through marketplaces, plugins can provide custom commands using optional namespacing (`/plugin-name:command-name`).

## SlashCommand Tool

Claude can programmatically invoke custom commands via the `SlashCommand` tool when referenced in instructions. This requires commands to have populated `description` frontmatter fields. Users can disable specific commands with `disable-model-invocation: true` or restrict all command execution through permissions.

## Slash Commands vs. Skills

**Slash commands** suit quick, one-file prompts for manual invocation, while **Agent Skills** handle complex workflows with multiple resources and automatic discovery based on context.
