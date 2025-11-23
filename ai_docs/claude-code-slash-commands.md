# Claude Code Slash Commands Documentation

## Overview

The documentation describes Claude Code's system for controlling Claude's behavior during interactive sessions through slash commands. This includes built-in commands, custom user-defined commands, plugin commands, and MCP server-exposed commands.

## Built-in Commands Summary

Claude Code provides 33 built-in slash commands including:
- Session management: `/clear`, `/exit`, `/rewind`
- Configuration: `/config`, `/model`, `/status`, `/login`, `/logout`
- Code operations: `/review`, `/compact`, `/export`
- System tools: `/doctor`, `/help`, `/cost`, `/usage`
- Advanced features: `/sandbox`, `/vim`, `/agents`, `/mcp`

## Custom Slash Commands

### Definition

User-created prompts stored as Markdown files that Claude Code executes.

### Syntax

```
/<command-name> [arguments]
```

### Storage Locations

- **Project-level**: `.claude/commands/` (shared with team)
- **Personal-level**: `~/.claude/commands/` (available across all projects)

### Key Features

- Argument support using `$ARGUMENTS` or positional parameters (`$1`, `$2`)
- Bash command execution with `!` prefix
- File references using `@` prefix
- Extended thinking capability
- Directory-based namespacing for organization

### Frontmatter Options

- `allowed-tools`: Specifies permitted tools
- `argument-hint`: Shows expected arguments during auto-completion
- `description`: Brief command summary
- `model`: Designate specific AI model
- `disable-model-invocation`: Prevents programmatic execution

## Plugin & MCP Commands

### Plugin Commands

Distributed through marketplaces, support namespacing via `plugin-name:command-name` format.

### MCP Commands

Dynamically discovered from connected servers using pattern `/mcp__<server-name>__<prompt-name>`. Support arguments and multiple protocols.

## SlashCommand Tool

The `SlashCommand` tool enables Claude to programmatically invoke custom slash commands. Requirements include:
- User-defined commands only (not built-in)
- Populated `description` frontmatter field
- Character budget limit (default 15,000, customizable via environment variable)

Disable via permissions: Add `SlashCommand` to deny rules.

## Slash Commands vs. Skills

### Slash Commands

"Simple prompt snippets you use often" for "quick, frequently-used prompts."

### Agent Skills

Complex workflows across multiple files for "comprehensive capabilities with structure."

Use slash commands for manual invocation of single-file templates; use Skills for automatic context-based discovery requiring multiple resources.

## Built-in Commands Overview

Claude Code provides 30+ built-in slash commands for controlling behavior during interactive sessions. Key categories include:

**Session Management**: Commands like `/clear`, `/exit`, and `/rewind` help manage conversation history and state.

**Configuration**: `/config`, `/status`, and `/model` allow users to adjust settings and select AI models.

**Analysis Tools**: "/context" visualizes token usage as a colored grid, while "/cost" displays usage statistics and "/doctor" checks installation health.

**Development Features**: "/sandbox" enables "filesystem and network isolation for safer, more autonomous execution," and "/review" requests code reviews.

## Custom Slash Commands - Advanced Features

### Bash Execution

Using the `!` prefix executes bash commands before the slash command runs, with output included in context. The `allowed-tools` frontmatter field must specify permitted bash operations.

### File References

The `@` prefix references file contents, enabling commands to work with specific or multiple files.

### Extended Thinking

Slash commands can trigger extended thinking by including relevant keywords.

## Frontmatter Configuration

Command files support metadata fields:
- `description`: Brief command overview
- `allowed-tools`: Permitted tools (inherits from conversation if unspecified)
- `argument-hint`: Expected arguments for auto-completion
- `model`: Specific model selection
- `disable-model-invocation`: Prevents SlashCommand tool execution

## Plugin and MCP Integration

### Plugin Commands

Distributed through marketplaces using format `/plugin-name:command-name` (prefix optional unless conflicts exist).

### MCP Commands

Exposed as slash commands following pattern `/mcp__<server-name>__<prompt-name>`. These are dynamically discovered from connected servers.

## SlashCommand Tool Details

This tool enables Claude to programmatically execute custom slash commands during conversations. It supports permission rules using exact match (`SlashCommand:/commit`) or prefix match (`SlashCommand:/review-pr:*`) patterns. A 15,000-character default budget limits command metadata visibility.

## Skills vs. Slash Commands

Slash commands suit quick, frequently-used prompts in single files, while Agent Skills handle comprehensive capabilities requiring multiple files and complex workflows. Both can coexist within projects.
