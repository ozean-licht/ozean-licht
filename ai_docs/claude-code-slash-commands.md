# Slash Commands in Claude Code

Claude Code provides built-in and custom slash commands to control behavior during interactive sessions.

## Built-in Commands Overview

The platform includes over 30 built-in commands like `/clear` for clearing conversation history, `/cost` for token usage statistics, and `/model` for selecting AI models. These commands manage various aspects including project initialization (`/init`), code reviews (`/review`), and configuration (`/config`).

## Custom Slash Commands

Users can create personalized commands using Markdown files organized in two locations:

**Project-level**: Commands stored in `.claude/commands/` are shared with team members and marked "(project)" in help listings.

**Personal-level**: Commands in `~/.claude/commands/` are available across all projects and marked "(user)".

### Key Features

**Arguments**: Commands support dynamic values through `$ARGUMENTS` (captures all arguments) or positional parameters like `$1`, `$2` for individual arguments.

**Bash Integration**: Execute shell commands using the `!` prefix; output is included in command context.

**File References**: Include file contents using `@` prefix to reference specific files or directories.

**Namespacing**: Organize commands in subdirectories for better structure without affecting command names themselves.

### Frontmatter Configuration

Command files support metadata fields including `allowed-tools`, `description`, `model`, and `disable-model-invocation` to control behavior and capabilities.

## Plugin and MCP Commands

Plugins can provide custom commands distributed through marketplaces, using formats like `/plugin-name:command-name`. MCP servers expose prompts as slash commands following the pattern `/mcp__<server-name>__<prompt-name>`.

## Comparison: Slash Commands vs. Skills

Slash commands work best for "simple, frequently-used prompts you invoke explicitly," while Agent Skills suit "complex capabilities requiring multiple files or automatic discovery."
