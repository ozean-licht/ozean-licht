# Claude Code Hooks: Complete Reference

## Overview

Claude Code hooks are automation mechanisms configured in settings files that execute in response to specific events during Claude's operation. They enable custom workflows, validation, permission handling, and context management throughout sessions.

## Configuration Structure

Hooks are organized hierarchically across three settings levels:
- `~/.claude/settings.json` (user-wide)
- `.claude/settings.json` (project-level)
- `.claude/settings.local.json` (local, uncommitted)

The basic format groups hooks by event type with matchers and execution rules:

```
Matchers define target patterns (exact strings, regex, or wildcards)
Hooks specify execution type and parameters
```

## Hook Types

**Command Hooks** (`type: "command"`)
Execute bash scripts with access to hook input via stdin and context through environment variables like `$CLAUDE_PROJECT_DIR`.

**Prompt-Based Hooks** (`type: "prompt"`)
Send evaluation tasks to Claude Haiku for context-aware decisions. These work with `Stop`, `SubagentStop`, `UserPromptSubmit`, `PreToolUse`, and `PermissionRequest` events. The LLM responds with structured JSON containing approval/blocking decisions.

## Event Categories

**Tool-Related Events:**
- `PreToolUse` - Before tool execution, allows blocking or modification
- `PostToolUse` - After successful tool completion
- `PermissionRequest` - When permission dialogs appear

**Session Events:**
- `SessionStart` - New or resumed sessions; can inject context and set persistent environment variables via `CLAUDE_ENV_FILE`
- `SessionEnd` - Cleanup when sessions terminate
- `UserPromptSubmit` - Validates user input before processing

**Agent Control:**
- `Stop` - Main agent completion
- `SubagentStop` - Subagent task completion
- `PreCompact` - Before context compaction

**Other:**
- `Notification` - System notifications with type-based filtering

## Input/Output Specification

### Input Format
Hooks receive JSON via stdin containing:
- `session_id`, `transcript_path`, `cwd`
- `permission_mode` (default/plan/acceptEdits/bypassPermissions)
- Event-specific fields like `tool_name`, `tool_input`, `prompt`

### Output Control

**Exit Codes:**
- `0` = Success (stdout shown in verbose mode, context for UserPromptSubmit/SessionStart)
- `2` = Blocking error (stderr shown to Claude, prevents action)
- Other = Non-blocking error (shown in verbose mode only)

**JSON Response Structure:**
```
decision: "approve"/"block"/"allow"/"deny"
reason: explanation shown to Claude
continue: false stops processing
permissionDecision: for PreToolUse control
additionalContext: injected into conversation
```

## Advanced Features

**Tool Input Modification:** PreToolUse hooks can alter parameters via `updatedInput` before execution.

**MCP Tools:** Support pattern matching like `mcp__memory__.*` for Model Context Protocol tools.

**Plugin Hooks:** Plugins contribute hooks merged with user configuration, using `${CLAUDE_PLUGIN_ROOT}` environment variable.

**Parallelization:** Matching hooks execute simultaneously; identical commands deduplicate automatically.

## Security Model

Hooks capture a snapshot at startup, preventing mid-session modifications from affecting current sessions. Best practices include validating inputs, quoting variables properly, checking for path traversal attempts, and avoiding sensitive file access.

**Default timeout is 60 seconds per hook** (configurable individually).

## Practical Applications

- **Automatic formatting** post-tool execution
- **Permission automation** for known-safe operations
- **Prompt validation** blocking sensitive input
- **Context injection** loading project state at startup
- **Environment setup** persisting configuration across commands
- **Notifications** for permission requests and idle states
