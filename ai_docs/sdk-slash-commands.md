# Slash Commands in the SDK - Documentation Summary

## Overview

Slash commands are special directives prefixed with `/` that control Claude Code sessions through the SDK. They enable actions like clearing conversation history, compacting messages, or accessing help.

## Discovering Available Commands

The SDK provides available slash commands via the system initialization message. Access them when a session starts by checking for `message.type === "system"` and `message.subtype === "init"`, then reading `message.slash_commands`.

## Sending Commands

Transmit slash commands by including them directly in your prompt string, treating them as regular text input to the query function.

## Built-in Commands

**`/compact`** - Reduces conversation history size by summarizing older messages while maintaining essential context. The system returns compaction metadata including pre-compaction token count and the trigger that initiated compaction.

**`/clear`** - Starts a fresh conversation by clearing all previous interaction history and beginning a new session with a fresh session ID.

## Custom Slash Commands

Users can create filesystem-based custom commands stored in markdown files:

- **Project scope**: `.claude/commands/` directory
- **Personal scope**: `~/.claude/commands/` directory

The filename (without `.md` extension) becomes the command name. Content defines command behavior, with optional YAML frontmatter for configuration including allowed tools, descriptions, and model specifications.

### Advanced Features

Custom commands support:

- **Arguments**: Dynamic placeholders using `$1`, `$2` syntax with optional `argument-hint` configuration
- **Bash execution**: Run commands with `!`backtick syntax to embed output
- **File references**: Include file contents using `@filename` notation
- **Namespacing**: Organize commands in subdirectories for better structure

## Practical Applications

Commands can automate tasks like code reviews, test execution, security scanning, and git operations by combining allowed tools (Read, Bash, Edit, Grep, Glob) with specific instructions.
