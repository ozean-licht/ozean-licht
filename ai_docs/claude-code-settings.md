# Claude Code Configuration and Tools Documentation

## Settings Architecture

Claude Code employs a hierarchical configuration system using `settings.json` files. The system applies settings in this precedence order:

1. **Enterprise managed policies** (cannot be overridden)
2. **Command line arguments** (temporary session overrides)
3. **Local project settings** (`.claude/settings.local.json`)
4. **Shared project settings** (`.claude/settings.json`)
5. **User settings** (`~/.claude/settings.json`)

Settings can be configured through the `/config` command in the interactive REPL.

## Configuration File Locations

**User level:** `~/.claude/settings.json` applies globally across all projects.

**Project level:** Teams use `.claude/settings.json` for shared configurations, while `.claude/settings.local.json` stores personal preferences without version control.

**Enterprise deployments** support managed policies at:
- macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
- Linux/WSL: `/etc/claude-code/managed-settings.json`
- Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`

## Core Configuration Options

Key settings include:

- **`apiKeyHelper`**: Custom script generating authentication values sent as headers
- **`cleanupPeriodDays`**: Retention period for chat transcripts (default: 30 days)
- **`companyAnnouncements`**: Startup messages cycling randomly through an array
- **`env`**: Environment variables applied to every session
- **`model`**: Overrides the default Claude model
- **`permissions`**: Controls tool access through allow/deny rules
- **`includeCoAuthoredBy`**: Adds Claude byline to commits (default: true)

## Permissions System

The permissions structure includes:

**`allow`** array: Grants tool use permissions. "Bash rules use prefix matching, not regex."

**`deny`** array: Blocks tool access and hides sensitive files. Recommended for `.env` files and secrets directories.

**`ask`** array: Prompts for confirmation before tool execution.

**`additionalDirectories`**: Specifies extra working directories Claude can access.

**`defaultMode`**: Sets permission handling (e.g., "acceptEdits").

**`disableBypassPermissionsMode`**: Prevents permission bypass when set to "disable".

## Sensitive File Protection

To prevent accidental exposure, configure denial rules:

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

Files matching these patterns become completely invisible to Claude Code.

## Sandbox Configuration

Sandboxing isolates bash commands from filesystem and network (macOS/Linux):

- **`enabled`**: Activates sandboxing (default: false)
- **`autoAllowBashIfSandboxed`**: Auto-approves sandboxed commands (default: true)
- **`excludedCommands`**: Commands running outside the sandbox
- **`allowUnsandboxedCommands`**: Permits escaping via `dangerouslyDisableSandbox` (default: true)
- **`network` settings**: Configure Unix sockets, localhost binding, and proxy ports

Filesystem access uses Read/Edit rules; network access uses WebFetch rules.

## Environment Variables

Notable variables for customization:

- **`ANTHROPIC_API_KEY`**: Authentication for Claude SDK
- **`ANTHROPIC_MODEL`**: Selects model configuration
- **`BASH_DEFAULT_TIMEOUT_MS`**: Timeout for long-running commands
- **`CLAUDE_CODE_MAX_OUTPUT_TOKENS`**: Limits output token count
- **`DISABLE_TELEMETRY`**: Opts out of analytics (set to 1)
- **`MAX_THINKING_TOKENS`**: Enables extended thinking with token budget
- **`MCP_TIMEOUT`**: MCP server startup timeout in milliseconds

All environment variables can be configured in settings.json for automatic session application.

## Available Tools

Claude Code provides these tools with varying permission requirements:

| Tool | Function | Requires Permission |
|------|----------|---------------------|
| **Bash** | Executes shell commands | Yes |
| **Edit** | Makes targeted file edits | Yes |
| **Read** | Views file contents | No |
| **Write** | Creates or overwrites files | Yes |
| **Glob** | Pattern-based file discovery | No |
| **Grep** | Searches file patterns | No |
| **WebFetch** | Retrieves URL content | Yes |
| **WebSearch** | Performs web queries | Yes |
| **NotebookRead** | Views Jupyter notebooks | No |
| **NotebookEdit** | Modifies notebook cells | Yes |
| **SlashCommand** | Executes custom commands | Yes |
| **Task** | Delegates to sub-agents | No |
| **TodoWrite** | Manages task lists | No |

## Advanced Features

**Hooks** enable custom scripts before/after tool execution—for example, automatically formatting Python after edits or preventing production file modifications.

**Subagents** store specialized AI assistants with custom prompts at `~/.claude/agents/` (user-level) or `.claude/agents/` (project-level).

**Plugins** extend functionality through marketplaces, configurable via `enabledPlugins` and `extraKnownMarketplaces` in settings.json.

**MCP Servers** integrate additional tools; enterprise deployments can manage these through `managed-mcp.json` with allowlist/denylist controls.
