# Slash Commands in the SDK - Documentation

## Overview
Slash commands are special commands starting with `/` that control Claude Code sessions through the SDK. They can perform actions like clearing conversation history, compacting messages, or accessing help.

## Discovering Available Commands
The system provides information about available slash commands during session initialization. Access this through the `message.slash_commands` property when `message.type === "system"` and `message.subtype === "init"`.

## Common Built-in Commands

**`/compact`** - Reduces conversation history size by summarizing older messages while preserving important context. Returns metadata about pre-compaction token count and compaction trigger.

**`/clear`** - Starts a fresh conversation by removing all previous history, essentially initiating a new session with a fresh session ID.

## Creating Custom Slash Commands

Custom commands are defined as markdown files in designated directories:
- **Project scope**: `.claude/commands/`
- **Personal scope**: `~/.claude/commands/`

The filename (without `.md` extension) becomes the command name.

### Basic Structure
Commands can include optional YAML frontmatter for configuration:
- `allowed-tools`: Specifies which tools the command can use
- `description`: Explains what the command does
- `model`: Specifies which Claude model to use

## Advanced Features

**Arguments**: Use `$1`, `$2` placeholders with `argument-hint` in frontmatter

**Bash Execution**: Include commands using `!` backticks syntax to execute and capture output

**File References**: Use `@filename` syntax to include file contents in the prompt

**Namespacing**: Organize commands in subdirectories for better structure (though subdirectories don't affect command names)

## Usage Example
Commands are sent through the SDK's `query()` function just like regular prompts, making them accessible during development workflows.
