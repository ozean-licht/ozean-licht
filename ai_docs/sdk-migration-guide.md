# Claude Agent SDK Migration Guide - Summary

## Overview
The Claude Code SDK has been renamed to the **Claude Agent SDK** to reflect its broader capabilities for building AI agents beyond coding tasks.

## Key Changes

| Aspect | Old | New |
|--------|-----|-----|
| **Package (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Python Package** | `claude-code-sdk` | `claude-agent-sdk` |
| **Documentation** | Claude Code docs | API Guide → Agent SDK section |

## Migration Steps

### TypeScript/JavaScript
1. Uninstall old: `npm uninstall @anthropic-ai/claude-code`
2. Install new: `npm install @anthropic-ai/claude-agent-sdk`
3. Update imports from `@anthropic-ai/claude-code` to `@anthropic-ai/claude-agent-sdk`
4. Update `package.json` dependencies

### Python
1. Uninstall: `pip uninstall claude-code-sdk`
2. Install: `pip install claude-agent-sdk`
3. Update imports from `claude_code_sdk` to `claude_agent_sdk`
4. Rename `ClaudeCodeOptions` to `ClaudeAgentOptions`

## Breaking Changes

**Three significant changes requiring attention:**

1. **Type Rename (Python)**: `ClaudeCodeOptions` → `ClaudeAgentOptions`

2. **System Prompt Behavior**: The SDK no longer uses Claude Code's default system prompt. Explicitly specify one using: `systemPrompt: { type: "preset", preset: "claude_code" }` or provide a custom prompt.

3. **Settings Sources**: Filesystem settings (user/project/local configurations, CLAUDE.md, slash commands) no longer load automatically. Enable with: `settingSources: ["user", "project", "local"]`

## Why This Matters

This change reflects the SDK's evolution to support diverse agent types—from business applications (legal, finance, support) to specialized coding agents—not just code automation.