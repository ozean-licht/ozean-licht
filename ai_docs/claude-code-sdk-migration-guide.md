# Claude Agent SDK Migration Guide

## Overview

The Claude Code SDK has been rebranded as the **Claude Agent SDK** to reflect its expanded capabilities beyond coding tasks. The documentation has relocated from Claude Code docs to the API Guide's dedicated Agent SDK section.

## Key Package Changes

| Platform | Old Package | New Package |
|----------|------------|------------|
| TypeScript/JavaScript | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| Python | `claude-code-sdk` | `claude-agent-sdk` |

## Migration Steps Summary

### TypeScript/JavaScript

1. Uninstall old package via npm
2. Install new package: `@anthropic-ai/claude-agent-sdk`
3. Update all import statements to reference the new package name
4. Modify package.json dependencies accordingly

### Python

1. Uninstall via pip
2. Install new package: `claude-agent-sdk`
3. Change imports from `claude_code_sdk` to `claude_agent_sdk`
4. Rename `ClaudeCodeOptions` to `ClaudeAgentOptions`

## Breaking Changes

### System Prompt Behavior

The SDK no longer applies Claude Code's default system prompt. Users must explicitly specify either a preset or custom prompt through options.

### Settings Loading

Filesystem-based settings (user/project configuration files) no longer load automatically. The `settingSources` parameter enables loading specific configuration sources when needed.

### Type Renaming

Python developers must update `ClaudeCodeOptions` to `ClaudeAgentOptions` for consistency with the new branding.

## Migration Rationale

The rename acknowledges the SDK's evolution into a versatile framework supporting diverse agent types across multiple domains—from business applications to specialized coding assistants—rather than remaining narrowly focused on coding tasks.
