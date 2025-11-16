# Claude Code Slash Commands Documentation

## Built-in Commands Overview

Claude Code provides 30+ built-in slash commands for managing interactive sessions. These commands control behavior, configuration, and workspace management.

### Key Command Categories

**Session Management**
- `/clear` removes conversation history
- `/exit` terminates the REPL
- `/rewind` allows reverting conversation and code states

**Configuration & Settings**
- `/config` accesses the Settings interface
- `/model` switches between AI models
- `/status` displays version, model, and account information

**Development Tools**
- `/review` initiates code review requests
- `/export [filename]` saves conversations to files
- `/sandbox` enables isolated bash execution with network/filesystem restrictions

**Context & Usage**
- `/context` visualizes token consumption as a colored grid
- `/cost` displays token usage statistics
- `/usage` shows plan limits and rate status (subscription only)

**Project Management**
- `/init` creates a CLAUDE.md project guide
- `/todos` lists current todo items
- `/memory` edits CLAUDE.md memory files

## Custom Slash Commands

Users can define frequently-used prompts as Markdown files in two locations:

**Project Commands** (`.claude/commands/`)
- Shared with team members
- Show "(project)" in `/help` output

**Personal Commands** (`~/.claude/commands/`)
- Available across all projects
- Marked "(user)" in help documentation

### Argument Implementation

Commands support dynamic values through:

- `$ARGUMENTS`: "captures all arguments passed to the command"
- `$1`, `$2`, etc.: individual positional parameters (shell-script style)

### Advanced Features

**Bash Integration**: Commands can execute shell operations using the `!` prefix, though "you must include `allowed-tools` with the Bash tool"

**File References**: The `@` prefix incorporates file contents into commands

**Frontmatter Options**:
- `allowed-tools`: specify permitted tools
- `description`: brief command summary
- `model`: designate specific Claude model
- `argument-hint`: display expected parameters to users

## Plugin & MCP Commands

**Plugin Commands** integrate through installed plugins following the format `/plugin-name:command-name`

**MCP Commands** expose prompts from connected servers using the pattern `/mcp__<server-name>__<prompt-name>`

## SlashCommand Tool

Claude can programmatically execute custom commands via the SlashCommand tool. Users can restrict this via `/permissions` or disable specific commands with the `disable-model-invocation: true` frontmatter field.