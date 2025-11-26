# Claude Code Hooks Reference - Comprehensive Overview

## Core Concept

Claude Code hooks enable automated responses to specific events during development sessions. They execute bash commands or LLM-based evaluations to control tool usage, validate inputs, and manage workflow automation.

## Configuration Structure

Hooks are defined in settings files across three levels:
- User settings: `~/.claude/settings.json`
- Project settings: `.claude/settings.json`
- Local settings: `.claude/settings.local.json`

The basic structure organizes hooks by event names and matchers:

```
hooks → EventName → matcher → hook array (type + command/prompt)
```

## Key Hook Types

**Matchers** (case-sensitive patterns for tool targeting):
- Exact matches: `"Write"` matches only the Write tool
- Regex patterns: `"Edit|Write"` or `"Notebook.*"`
- Wildcards: `"*"` or `""` for all tools

**Hook Execution Types**:
- `"command"`: Executes bash scripts
- `"prompt"`: Uses Claude Haiku for intelligent LLM-based decisions

## Available Events

| Event | Purpose | Supports Matchers |
|-------|---------|-------------------|
| **PreToolUse** | Before tool execution | Yes |
| **PermissionRequest** | During permission dialogs | Yes |
| **PostToolUse** | After successful tool completion | Yes |
| **UserPromptSubmit** | When user submits prompts | No |
| **Stop/SubagentStop** | When agents finish | No |
| **Notification** | For system notifications | Yes |
| **SessionStart/End** | Session lifecycle | Yes (startup/resume/clear) |
| **PreCompact** | Before context compaction | Yes (manual/auto) |

## Input/Output Mechanisms

### Input Format
Hooks receive JSON via stdin containing:
- `session_id`, `transcript_path`, `cwd`
- `permission_mode` (default/plan/acceptEdits/bypassPermissions)
- Event-specific fields (tool_name, tool_input, etc.)

### Output Control
Hooks communicate via:
- **Exit code 0**: Success (JSON parsed for structured control)
- **Exit code 2**: Blocking error (stderr shows reason to Claude)
- **Other codes**: Non-blocking errors (displayed in verbose mode)

## Decision Control Examples

**PreToolUse decisions**:
- `"allow"`: Bypass permission system
- `"deny"`: Block tool execution
- `"ask"`: Request user confirmation
- `"updatedInput"`: Modify parameters before execution

**UserPromptSubmit decisions**:
- `"block"`: Prevent prompt processing
- Plain stdout: Add context automatically

**Stop/SubagentStop decisions**:
- `"block"`: Force continuation with provided reasoning

## Prompt-Based Hooks

For sophisticated context-aware decisions, `type: "prompt"` sends input to Claude Haiku, which responds with structured JSON:

```json
{
  "decision": "approve" | "block",
  "reason": "explanation",
  "continue": false,
  "stopReason": "custom message"
}
```

## Environment Variables

- `CLAUDE_PROJECT_DIR`: Project root path
- `CLAUDE_ENV_FILE`: SessionStart-only file for persisting environment variables
- `CLAUDE_PLUGIN_ROOT`: Plugin directory path
- `CLAUDE_CODE_REMOTE`: Indicates remote (web) vs local execution

## Advanced Features

**Plugin Hooks**: Automatically merged from plugin `hooks/hooks.json`, using `${CLAUDE_PLUGIN_ROOT}` for file references.

**MCP Tool Integration**: Target Model Context Protocol tools using pattern `"mcp__<server>__<tool>"` or `"mcp__.*__write.*"` for wildcards.

**Project-Specific Scripts**: Reference project scripts via `"$CLAUDE_PROJECT_DIR"/.claude/hooks/script.sh"`.

## Execution Characteristics

- **Timeout**: 60 seconds default (configurable per command)
- **Parallelization**: Matching hooks run simultaneously
- **Deduplication**: Identical commands execute once
- **Input delivery**: JSON passed to stdin
- **Output visibility**: Varies by event type and verbose mode

## Security Considerations

Hooks execute arbitrary commands with user account permissions. Critical safeguards include:

- Validate and sanitize all inputs
- Use quoted shell variables: `"$VAR"`
- Block path traversal attempts
- Employ absolute paths
- Avoid sensitive files (.env, .git, credentials)

Configuration changes are captured at startup and require explicit review via `/hooks` menu before runtime application.

## Debugging Workflow

Access hook diagnostics through:
- `/hooks` command: View registered hooks
- `claude --debug`: Detailed execution logs
- Manual script testing before integration
- Permission verification for executables
- Verbose mode (ctrl+o) for progress visibility
