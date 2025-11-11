# Claude Agent SDK Migration Guide

## Core Changes

The Claude Code SDK has been rebranded as the **Claude Agent SDK**, reflecting its expanded capabilities beyond coding tasks. The package names and documentation locations have been updated accordingly.

## Package Updates

**TypeScript/JavaScript:**
- Old: `@anthropic-ai/claude-code`
- New: `@anthropic-ai/claude-agent-sdk`

**Python:**
- Old: `claude-code-sdk`
- New: `claude-agent-sdk`

## Migration Process

For TypeScript projects, uninstall the legacy package, install the replacement, and update import statements from `@anthropic-ai/claude-code` to `@anthropic-ai/claude-agent-sdk`. Python developers should similarly swap `claude_code_sdk` for `claude_agent_sdk` and update type references from `ClaudeCodeOptions` to `ClaudeAgentOptions`.

## Breaking Changes

**Type Renaming (Python):** "The Python SDK type `ClaudeCodeOptions` has been renamed to `ClaudeAgentOptions`." This aligns with the new branding and naming conventions.

**System Prompt Behavior:** The SDK no longer applies Claude Code's default system prompt. Developers must explicitly specify either the `claude_code` preset or a custom system prompt via the options parameter.

**Settings Sources:** Filesystem configuration files (CLAUDE.md, settings.json) are no longer automatically loaded. Users requiring this functionality should explicitly set `settingSources: ['user', 'project', 'local']` in their options.

## Rationale

These modifications enhance predictability for deployed applications, CI/CD environments, and multi-tenant systems by removing dependencies on local filesystem configurations while allowing developers to customize behavior as needed.
