# Claude Agent SDK Migration Guide

## Overview
The Claude Code SDK has been rebranded as the Claude Agent SDK to reflect its expanded capabilities for building various AI agents beyond coding tasks.

## Key Changes

**Package Names:**
- TypeScript/JavaScript: `@anthropic-ai/claude-code` → `@anthropic-ai/claude-agent-sdk`
- Python: `claude-code-sdk` → `claude-agent-sdk`

## Migration Steps

### TypeScript/JavaScript
1. Uninstall old package: `npm uninstall @anthropic-ai/claude-code`
2. Install new package: `npm install @anthropic-ai/claude-agent-sdk`
3. Update imports to use the new package name
4. Modify package.json dependencies

### Python
1. Uninstall: `pip uninstall claude-code-sdk`
2. Install: `pip install claude-agent-sdk`
3. Change imports from `claude_code_sdk` to `claude_agent_sdk`
4. Rename `ClaudeCodeOptions` to `ClaudeAgentOptions`

## Breaking Changes

**System Prompt Behavior:** "The SDK no longer uses Claude Code's system prompt by default." Specify custom prompts explicitly through options if needed.

**Settings Loading:** The SDK no longer automatically reads from filesystem settings (settings.json, CLAUDE.md files). To restore this functionality, explicitly set `settingSources` in your configuration options.

**Type Renaming:** Python developers must update `ClaudeCodeOptions` references to `ClaudeAgentOptions` throughout their codebase.

## Benefits of Migration
The rebrand acknowledges the SDK's evolution into a comprehensive framework supporting business agents, specialized coding assistants, and domain-specific tools with enhanced predictability and configuration control.
