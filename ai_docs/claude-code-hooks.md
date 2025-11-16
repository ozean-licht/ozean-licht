# Claude Code Hooks Documentation

## Overview

Claude Code hooks are automated scripts triggered by specific events in your development workflow. They're configured in settings files and enable custom validation, formatting, and context management.

## Configuration Files

Hooks are defined in a hierarchy:
- `~/.claude/settings.json` (user level)
- `.claude/settings.json` (project level)
- `.claude/settings.local.json` (local, uncommitted)
- Enterprise managed policies

## Hook Structure

Each hook configuration organizes handlers by event matchers. As the documentation states: "Hooks are organized by matchers, where each matcher can have multiple hooks."

Matchers support:
- Exact string matching (`Write` matches only Write tool)
- Regular expressions (`Edit|Write`, `Notebook.*`)
- Wildcard patterns (`*` for all tools)

## Hook Types

**Command Hooks** execute bash scripts with JSON input via stdin.

**Prompt-Based Hooks** (Stop/SubagentStop) send context to an LLM for intelligent decision-making, receiving structured JSON responses with approval or blocking decisions.

## Available Events

| Event | Purpose |
|-------|---------|
| PreToolUse | Before tool execution |
| PostToolUse | After successful tool completion |
| UserPromptSubmit | Before processing user input |
| Stop | When main agent finishes |
| SubagentStop | When subagent completes |
| SessionStart | Session initialization |
| SessionEnd | Session termination |
| Notification | System notifications |
| PreCompact | Before context compaction |

## Hook Input/Output

Hooks receive JSON via stdin containing `session_id`, `transcript_path`, `cwd`, and event-specific fields.

Output mechanisms:
- **Exit code 0**: Success (stdout visible in some contexts)
- **Exit code 2**: Blocking error (stderr feeds back to Claude)
- **Other codes**: Non-blocking errors
- **JSON output**: Structured responses for sophisticated control

## Key Features

**Environment Variables**: Access `$CLAUDE_PROJECT_DIR` for project-relative paths and `$CLAUDE_ENV_FILE` in SessionStart hooks to persist environment variables.

**Plugin Integration**: Plugins provide hooks via `hooks/hooks.json`, automatically merged with user configurations using `${CLAUDE_PLUGIN_ROOT}`.

**Parallelization**: Matching hooks execute simultaneously; identical commands are deduplicated.

**Timeout**: Default 60-second limit per hook, individually configurable.

## Security

The documentation emphasizes: "Claude Code hooks execute arbitrary shell commands on your system automatically." Users must validate inputs, quote variables properly, check for path traversal, use absolute paths, and avoid sensitive files.

## MCP Tool Integration

MCP tools follow naming pattern `mcp__<server>__<tool>`. Hooks can target specific tools using matchers like `mcp__memory__.*` or `mcp__.*__write.*`.

## Debugging

Use `/hooks` command to verify registration and `claude --debug` for detailed execution logs showing hook execution status and output.