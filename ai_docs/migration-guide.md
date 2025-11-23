# Claude Agent SDK Migration Guide - Complete Documentation

## Overview

The Claude Code SDK has been renamed to the **"Claude Agent SDK"** to reflect its broader capabilities for building AI agents beyond coding tasks alone.

## Package Name Changes

| Component | Old Name | New Name |
|-----------|----------|----------|
| TypeScript/JavaScript | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| Python | `claude-code-sdk` | `claude-agent-sdk` |
| Documentation | Claude Code docs | Agent SDK section in API Guide |

## TypeScript/JavaScript Migration Steps

1. **Uninstall old package**: `npm uninstall @anthropic-ai/claude-code`
2. **Install new package**: `npm install @anthropic-ai/claude-agent-sdk`
3. **Update imports**: Replace all references to `@anthropic-ai/claude-code` with `@anthropic-ai/claude-agent-sdk`
4. **Update package.json**: Modify dependency entries to reflect the new package name

## Python Migration Steps

1. **Uninstall old package**: `pip uninstall claude-code-sdk`
2. **Install new package**: `pip install claude-agent-sdk`
3. **Update imports**: Change `claude_code_sdk` to `claude_agent_sdk`
4. **Rename types**: Update `ClaudeCodeOptions` to `ClaudeAgentOptions`

## Breaking Changes

### System Prompt No Longer Default

Previously, the SDK automatically applied Claude Code's system prompt. Now you must explicitly specify it:

```typescript
// New approach - explicit system prompt
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});
```

### Settings Sources No Longer Auto-Loaded

The SDK no longer reads filesystem settings by default (CLAUDE.md, settings.json, slash commands). To restore this behavior:

```typescript
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});
```

**Rationale**: This change ensures predictable behavior in CI/CD environments, deployed applications, and prevents settings leakage in multi-tenant systems.

### Python: ClaudeCodeOptions → ClaudeAgentOptions

Update type names in Python projects:

```python
# Before
from claude_agent_sdk import query, ClaudeCodeOptions
options = ClaudeCodeOptions(model="claude-sonnet-4-5")

# After
from claude_agent_sdk import query, ClaudeAgentOptions
options = ClaudeAgentOptions(model="claude-sonnet-4-5")
```

## Why the Rename?

The SDK evolved beyond its original coding-focused purpose to support diverse agent applications: business assistance, specialized coding agents, and domain-specific solutions.

## Troubleshooting

- Verify all imports reference `@anthropic-ai/claude-agent-sdk` (TypeScript) or `claude_agent_sdk` (Python)
- Confirm package.json/requirements.txt reflect new package names
- Run `npm install` or `pip install` to ensure dependencies update properly
