# Slash Commands in the Claude Agent SDK

## Overview

Slash commands provide a mechanism to control Claude Code sessions through the SDK with special commands prefixed by `/`. They enable session management and can be discovered programmatically at initialization.

## Discovering Available Commands

The system initialization message contains information about available slash commands:

```typescript
if (message.type === "system" && message.subtype === "init") {
  console.log("Available slash commands:", message.slash_commands);
  // Example: ["/compact", "/clear", "/help"]
}
```

## Built-in Commands

### `/compact`
**Purpose:** Reduces conversation history size by summarizing older messages while preserving context.

**Usage:**
```typescript
for await (const message of query({ prompt: "/compact", options: { maxTurns: 1 } })) {
  if (message.subtype === "compact_boundary") {
    console.log("Pre-compaction tokens:", message.compact_metadata.pre_tokens);
  }
}
```

### `/clear`
**Purpose:** "Starts a fresh conversation by clearing all previous history"

**Usage:**
```typescript
for await (const message of query({ prompt: "/clear", options: { maxTurns: 1 } })) {
  if (message.subtype === "init") {
    console.log("Conversation cleared");
  }
}
```

## Custom Slash Commands

### File Structure

Store custom commands as markdown files:
- **Project-level:** `.claude/commands/`
- **Personal-level:** `~/.claude/commands/`

### Basic Format

Filename becomes the command name (without `.md` extension). Example: `refactor.md` creates `/refactor` command.

### With Configuration

Commands support optional YAML frontmatter for metadata:

```yaml
---
allowed-tools: Read, Grep, Glob
description: Run security vulnerability scan
model: claude-sonnet-4-5-20250929
---
```

## Advanced Features

### Arguments & Placeholders

Use `$1`, `$2` syntax for dynamic arguments:

```yaml
---
argument-hint: [issue-number] [priority]
---
Fix issue #$1 with priority $2.
```

### Bash Integration

Execute bash commands using backtick syntax:
```markdown
- Current status: !`git status`
```

### File References

Include file contents with `@` prefix:
```markdown
Package config: @package.json
```

### Namespacing

Organize commands in subdirectories (e.g., `.claude/commands/frontend/component.md`).

## SDK Integration

Custom commands automatically appear in the `slash_commands` list returned during session initialization and can be invoked like built-in commands through the query function.
