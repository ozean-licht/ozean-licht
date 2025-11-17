# Claude Code Hooks Reference

## Overview

Claude Code hooks are automated scripts that execute at specific points in your workflow, enabling custom validation, automation, and control over Claude's operations.

## Configuration Structure

Hooks are configured in JSON settings files across three levels:

- **User level**: `~/.claude/settings.json`
- **Project level**: `.claude/settings.json`
- **Local project level**: `.claude/settings.local.json`

Hooks are organized by matchers, where each matcher can have multiple hooks.

## Hook Types

### Command-based Hooks

Execute bash scripts for deterministic operations like validation or file checks.

### Prompt-based Hooks

Use an LLM (Haiku) for context-aware decisions. Currently support `Stop`, `SubagentStop`, and `UserPromptSubmit` events.

## Hook Events

| Event | Purpose |
|-------|---------|
| **PreToolUse** | Intercepts tool calls before execution; enables approval/denial/modification |
| **PostToolUse** | Runs after successful tool completion for validation |
| **UserPromptSubmit** | Validates or enriches user prompts before processing |
| **Stop/SubagentStop** | Controls whether Claude should conclude work |
| **SessionStart** | Loads context, environment setup at session initiation |
| **Notification** | Handles system notifications with custom logic |

## Matcher Patterns

- **Exact string matching**: `"Write"` matches only the Write tool
- **Regex patterns**: `"Edit|Write"` or `"Notebook.*"`
- **Wildcard**: `"*"` matches all tools
- **MCP tools**: `"mcp__memory__.*"` targets specific server operations

## Hook Output Control

Hooks communicate results through exit codes:

- **Exit code 0**: Success; JSON stdout enables structured control
- **Exit code 2**: Blocking error; stderr message blocks the action
- **Other codes**: Non-blocking errors with stderr feedback

JSON output is only processed when the hook exits with code 0.

## Security Requirements

Claude Code hooks execute arbitrary shell commands on your system automatically. Users must:

- Review commands thoroughly before deployment
- Avoid processing sensitive files or unvalidated inputs
- Understand the security implications of hook execution

## Advanced Features

### Environment Persistence

SessionStart hooks can write to `CLAUDE_ENV_FILE` to persist variables across subsequent bash commands.

### Plugin Integration

Plugins define hooks in `hooks/hooks.json` using variables like:

- `${CLAUDE_PLUGIN_ROOT}`
- `${CLAUDE_PROJECT_DIR}`

### Parallel Execution

Multiple matching hooks execute simultaneously, with identical commands automatically deduplicated.
