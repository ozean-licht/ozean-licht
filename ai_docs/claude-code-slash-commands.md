# Comprehensive Guide to Claude Code Slash Commands

## Overview

Slash commands control Claude's behavior during interactive sessions. They include built-in commands for system functions and custom commands for frequently-used prompts.

## Built-in Slash Commands

The platform provides 40+ built-in commands including:

- **Navigation & Management**: `/clear`, `/exit`, `/rewind`, `/compact`
- **Configuration**: `/config`, `/model`, `/privacy-settings`, `/permissions`
- **Diagnostics**: `/doctor`, `/status`, `/context`, `/cost`, `/usage`
- **Development**: `/review`, `/sandbox`, `/init`, `/export`
- **Integration**: `/mcp`, `/agents`, `/hooks`

Notable commands include `/compact` for "Compact conversation with optional focus instructions" and `/sandbox` which enables "sandboxed bash tool with filesystem and network isolation."

## Custom Slash Commands

Users create custom commands by storing Markdown files in designated directories:

**Project Commands** (`.claude/commands/`): Shared with team, marked "(project)" in help.

**Personal Commands** (`~/.claude/commands/`): Available across all projects, marked "(user)" in help.

### Syntax & Parameters

```
/<command-name> [arguments]
```

Commands support three argument mechanisms:

1. **`$ARGUMENTS`** - Captures all passed arguments
2. **Positional parameters** (`$1`, `$2`, etc.) - Access specific arguments individually
3. **File references** (using `@` prefix) - Include file contents directly

### Features

**Namespacing**: Organize commands in subdirectories. For example, `.claude/commands/frontend/component.md` creates `/component` with "(project:frontend)" designation.

**Bash Integration**: Execute shell commands using `!` prefix within the command. Requires `allowed-tools` specification:

```markdown
---
allowed-tools: Bash(git status:*), Bash(git commit:*)
---
```

**Frontmatter Options**:

| Field | Purpose |
|-------|---------|
| `allowed-tools` | Specify usable tools |
| `argument-hint` | Show expected arguments in autocomplete |
| `description` | Brief command description |
| `model` | Override default model |
| `disable-model-invocation` | Prevent SlashCommand tool execution |

## Plugin Commands

Plugins provide integrated custom commands via `/plugin-name:command-name` format. Commands are "Automatically available" once plugins are enabled and appear in `/help`.

## MCP Slash Commands

MCP servers expose prompts as commands following the pattern: `/mcp__<server-name>__<prompt-name>`. These integrate "Prompts through the MCP protocol" when servers connect successfully.

Important: MCP permission rules don't support wildcards. Use `mcp__servername` to approve all tools from a server, or list specific tools individually.

## SlashCommand Tool

Claude can invoke custom slash commands programmatically via the `SlashCommand` tool. Only commands with populated `description` frontmatter are supported.

Disable via `/permissions` (deny `SlashCommand`) or add `disable-model-invocation: true` to individual commands. The tool maintains a character budget (default 15,000 characters) limiting command descriptions shown to Claude.

## Skills vs. Slash Commands

| Aspect | Slash Commands | Agent Skills |
|---|---|---|
| **Best for** | Quick, single-file prompts | Complex workflows, multiple files |
| **Invocation** | Explicit (`/command`) | Automatic (context-based) |
| **Structure** | Single .md file | SKILL.md + resources directory |
| **Complexity** | Simple snippets | Structured capabilities |

Use slash commands for frequently-repeated single prompts; employ Skills for comprehensive, multi-file capabilities requiring automatic discovery.
