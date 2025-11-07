# Claude Code Hooks: Complete Documentation Summary

## Overview

Claude Code hooks are automated workflows triggered by specific events during development sessions. They enable custom validation, formatting, and decision-making through bash commands or LLM-based evaluation.

## Configuration Structure

Hooks are defined in settings files with a matcher-based organization:

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

**Key configuration points:**
- Matchers use exact strings, regex patterns, or wildcards (`*`)
- Settings cascade: user → project → local → enterprise policies
- Environment variable `$CLAUDE_PROJECT_DIR` references project root

## Hook Types

### Command-Based Hooks
Execute bash scripts with configurable timeouts (default 60 seconds). Receive JSON input via stdin and communicate status through exit codes.

### Prompt-Based Hooks
Use Claude Haiku to evaluate decisions contextually. Currently available for `Stop`, `SubagentStop`, `UserPromptSubmit`, and `PreToolUse` events.

**Response schema:**
```json
{
  "decision": "approve" | "block",
  "reason": "explanation",
  "continue": false,
  "stopReason": "message",
  "systemMessage": "warning"
}
```

## Hook Events

| Event | Purpose | Supports Matchers |
|-------|---------|-------------------|
| **PreToolUse** | Before tool execution | Yes |
| **PostToolUse** | After tool completion | Yes |
| **UserPromptSubmit** | Before prompt processing | No |
| **Stop** | When agent finishes | No |
| **SubagentStop** | When subagent finishes | No |
| **SessionStart** | Session initialization | Yes (startup/resume/clear/compact) |
| **SessionEnd** | Session cleanup | No |
| **Notification** | Alert messages | No |
| **PreCompact** | Before context compaction | Yes (manual/auto) |

## Exit Code Behavior

- **0**: Success; stdout shown in transcript (except UserPromptSubmit, SessionStart)
- **2**: Blocking error; stderr feeds back to Claude
- **Other**: Non-blocking error; stderr shown to user

## Hook Input/Output

### Common Input Fields
```json
{
  "session_id": "string",
  "transcript_path": "path/to/session.jsonl",
  "cwd": "current/directory",
  "permission_mode": "default|plan|acceptEdits|bypassPermissions",
  "hook_event_name": "EventName"
}
```

### JSON Output Control

Hooks return structured JSON for sophisticated decisions:

```json
{
  "continue": true,
  "stopReason": "string",
  "suppressOutput": false,
  "systemMessage": "string",
  "hookSpecificOutput": {}
}
```

**PreToolUse** decisions: `"allow"`, `"deny"`, `"ask"` with optional `updatedInput` to modify parameters before execution.

**PostToolUse** decisions: `"block"` triggers Claude feedback; `additionalContext` provides information.

**UserPromptSubmit** decisions: `"block"` prevents processing; `additionalContext` adds context.

**Stop/SubagentStop** decisions: `"block"` prevents stopping; requires `reason` for Claude's guidance.

## MCP Tool Integration

Model Context Protocol tools appear as `mcp__<server>__<tool>`. Match them using patterns:

```json
{
  "matcher": "mcp__memory__.*"
}
```

## Plugin Hooks

Plugins provide hooks via `hooks/hooks.json` that merge with user configuration. They use `${CLAUDE_PLUGIN_ROOT}` for file references and execute alongside custom hooks in parallel.

## SessionStart Environment Persistence

Access `CLAUDE_ENV_FILE` to persist variables for subsequent commands:

```bash
echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
```

## Execution Details

- **Parallelization**: Matching hooks run concurrently
- **Deduplication**: Identical commands execute once
- **Timeout**: 60 seconds default, configurable per hook
- **Environment**: Access to `CLAUDE_PROJECT_DIR` and `CLAUDE_CODE_REMOTE`

## Security Considerations

**Critical warning:** "Claude Code hooks execute arbitrary shell commands on your system automatically." Users bear full responsibility for hook validation and potential system impacts.

**Best practices:**
- Validate and sanitize all inputs
- Quote shell variables: `"$VAR"`
- Block path traversal attempts
- Use absolute paths for scripts
- Avoid sensitive files (`.env`, `.git/`)

## Debugging

Run `/hooks` to verify registration. Use `claude --debug` for execution details. Common issues include quote escaping, tool name mismatches, and script permissions.