# Claude Code Hooks Reference Documentation

## Overview

Claude Code hooks enable automated responses to system events through bash commands or LLM-based evaluations. They're configured in settings files and execute during specific lifecycle moments like tool use or session management.

## Configuration Structure

Hooks organize around matchers and events in JSON format:

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [{"type": "command", "command": "bash-command"}]
      }
    ]
  }
}
```

**Key configuration details:**
- Matchers support exact strings, regex patterns, and wildcards
- Stored in `~/.claude/settings.json` (user), `.claude/settings.json` (project), or `.claude/settings.local.json` (local)
- Some events like `UserPromptSubmit` omit matchers entirely

## Hook Types

**Command Hooks** execute bash scripts with timeout support (default 60 seconds). They receive JSON input via stdin and communicate through exit codes and output.

**Prompt Hooks** query Claude Haiku for context-aware decisions, returning structured JSON with approval/block decisions. Currently available for `Stop`, `SubagentStop`, and `UserPromptSubmit` events.

## Available Events

| Event | Purpose |
|-------|---------|
| `PreToolUse` | Before Claude executes a tool |
| `PostToolUse` | After successful tool completion |
| `UserPromptSubmit` | When user submits prompt |
| `Stop` / `SubagentStop` | When Claude finishes responding |
| `SessionStart` / `SessionEnd` | Session lifecycle |
| `Notification` | System notifications |
| `PreCompact` | Before context compacting |

## Hook Output & Exit Codes

**Exit Code 0:** Success. Output shown in transcript (except `UserPromptSubmit` where stdout becomes context).

**Exit Code 2:** Blocking error. Stderr fed to Claude for processing.

**Other codes:** Non-blocking. Stderr shown to user; execution continues.

## JSON Output Format

Hooks can return structured responses for sophisticated control:

```json
{
  "continue": true,
  "stopReason": "explanation",
  "suppressOutput": true,
  "systemMessage": "warning",
  "hookSpecificOutput": {
    "hookEventName": "EventType",
    "additionalContext": "context for Claude"
  }
}
```

## Security Considerations

**Critical Warning:** "Claude Code hooks execute arbitrary shell commands...you are solely responsible for configured commands."

Essential practices include:
- Validating and sanitizing all input data
- Using absolute paths and quoting variables properly
- Blocking path traversal attempts
- Avoiding sensitive files like `.env` or `.git`

## Special Features

**Environment Variables:**
- `CLAUDE_PROJECT_DIR`: Project root path (available in all hooks)
- `CLAUDE_ENV_FILE`: SessionStart hooks can persist variables here
- `CLAUDE_CODE_REMOTE`: Indicates web vs. local execution environment

**MCP Tool Integration:** Tools follow pattern `mcp__<server>__<tool>` and can be targeted with regex matchers.

**Plugin Hooks:** Automatically merge with user/project hooks using `${CLAUDE_PLUGIN_ROOT}` variable reference.

## Practical Examples

Hook commands can implement validation, auto-approval, notifications, and context injection. Common patterns include file-type-based access control, command linting with alternative tool suggestions, and permission automation for trusted operations.
