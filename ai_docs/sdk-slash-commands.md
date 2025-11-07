# Slash Commands in the Claude Agent SDK

## Overview

Slash commands provide a mechanism to control Claude Code sessions through special commands prefixed with `/`. These commands can be sent via the SDK to manage conversation state and perform specific actions.

## Discovering Available Commands

The SDK includes slash command information in system initialization messages. Access this by listening for `system` messages with `subtype === "init"`:

```typescript
if (message.type === "system" && message.subtype === "init") {
  console.log("Available slash commands:", message.slash_commands);
}
```

## Built-in Commands

### `/compact`
Reduces conversation history size by summarizing older messages while preserving context. Triggered through a query with `prompt: "/compact"`.

### `/clear`
Clears all previous conversation history and initiates a fresh session, resetting the conversation state entirely.

### `/help`
Provides information about available commands and their usage.

## Creating Custom Slash Commands

Custom commands are defined as markdown files stored in project or personal directories:

- **Project scope**: `.claude/commands/`
- **Personal scope**: `~/.claude/commands/`

### File Format

The filename (minus `.md` extension) becomes the command name. Files support optional YAML frontmatter for configuration:

```yaml
---
allowed-tools: Read, Grep, Glob
description: Brief command description
model: claude-sonnet-4-5-20250929
---

Command implementation and instructions here.
```

## Advanced Features

**Arguments**: Use `$1`, `$2` placeholders and `argument-hint` frontmatter field for dynamic parameters.

**Bash execution**: Include shell commands using `!`backtick` syntax to capture output.

**File references**: Use `@filename` to include file contents directly in commands.

**Namespacing**: Organize commands in subdirectories within `.claude/commands/` for better structure.

## Integration with SDK

Custom commands automatically appear in the `slash_commands` list alongside built-in commands and are invoked identically to native commands through the query interface.
