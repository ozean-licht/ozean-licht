# Slash Commands in the SDK

Slash commands are special commands prefixed with `/` that control Claude Code sessions through the SDK. They enable actions like clearing conversation history, compacting messages, and accessing help.

## Discovering Available Commands

Access available slash commands through the system initialization message:

```typescript
if (message.type === "system" && message.subtype === "init") {
  console.log("Available slash commands:", message.slash_commands);
}
```

## Built-In Commands

### `/compact`

"Reduces the size of your conversation history by summarizing older messages while preserving important context." The command provides metadata about pre-compaction token counts and what triggered the action.

### `/clear`

"Starts a fresh conversation by clearing all previous history." Returns a new session ID upon execution.

## Custom Slash Commands

Users can create personalized commands stored as markdown files in designated directories:

**File Locations:**
- Project-level: `.claude/commands/`
- User-level: `~/.claude/commands/`

**File Format:**

The filename (without `.md` extension) becomes the command name. Optional YAML frontmatter provides configuration like allowed tools and model selection.

## Advanced Features

**Arguments & Placeholders:** Commands support dynamic arguments using `$1`, `$2` syntax with optional `argument-hint` frontmatter.

**Bash Execution:** Commands can execute bash operations using the syntax `` !`command` `` within markdown files.

**File References:** Include file contents using `@` prefix (e.g., `@package.json`).

**Namespacing:** Organize commands in subdirectories for better structure without affecting command names.

## Integration with SDK

"Once defined in the filesystem, custom commands are automatically available through the SDK," appearing in the `slash_commands` list alongside built-in options.