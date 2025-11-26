# Claude Code Subagents Documentation

## Overview

Subagents are specialized AI assistants that Claude Code can delegate to for handling specific tasks. They operate with separate context windows and customized configurations.

## Core Characteristics

Each subagent features:
- A defined purpose and expertise domain
- Independent context isolation from main conversations
- Configurable tool access permissions
- Custom system prompts guiding behavior

## Key Advantages

The documentation highlights four primary benefits:

1. **Context Preservation** - Subagents maintain isolated contexts, preventing pollution of main conversations while focusing on high-level objectives.

2. **Specialized Expertise** - Fine-tuned instructions for specific domains result in higher success rates on designated tasks.

3. **Reusability** - Once created, subagents function across projects and can be shared with teams for consistent workflows.

4. **Flexible Permissions** - Different tool access levels allow limiting powerful capabilities to appropriate subagent types.

## Getting Started

Users can create subagents via the `/agents` command, which offers:
- Guided subagent creation
- Claude-assisted generation with customization options
- Tool selection from available capabilities
- Project or user-level scope selection

## Configuration Storage

Subagents are stored as Markdown files with YAML frontmatter in two locations:

- **Project-level**: `.claude/agents/` (highest priority, current project only)
- **User-level**: `~/.claude/agents/` (lower priority, all projects)

Project-level subagents override user-level ones with identical names.

## File Format Structure

```markdown
---
name: identifier-name
description: Usage context and purpose
tools: tool1, tool2
model: sonnet
permissionMode: default
skills: skill1, skill2
---

System prompt content defining role, capabilities, and approach.
```

### Required Fields
- `name` - Lowercase identifier with hyphens
- `description` - Natural language purpose statement

### Optional Fields
- `tools` - Comma-separated list (inherits all if omitted)
- `model` - Model alias or 'inherit'
- `permissionMode` - Permission handling approach
- `skills` - Auto-loaded skill names

## Built-in Subagents

### General-Purpose Agent
Uses Sonnet model with all tools available. Handles complex multi-step tasks requiring exploration and modification, including code changes and analysis.

### Plan Subagent
Operates in plan mode for codebase research. Uses Sonnet with Read, Glob, Grep, and Bash tools for gathering context before presenting plans.

### Explore Subagent
Lightweight, read-only agent using Haiku for fast codebase searches. Supports Quick, Medium, and Very Thorough thoroughness levels for various exploration depths.

## Invocation Methods

**Automatic**: Claude detects appropriate subagents based on task descriptions and context.

**Explicit**: Users request specific subagents directly:
- "Use the code-reviewer subagent to check my recent changes"
- "Have the debugger subagent investigate this error"

## Example Subagent: Code Reviewer

The documentation provides a code-reviewer subagent template that:
- Inherits the main conversation's model
- Accesses Read, Grep, Glob, and Bash tools
- Reviews code for quality, security, and maintainability
- Prioritizes feedback as Critical, Warning, or Suggestion levels

## Advanced Features

### Chaining
Multiple subagents can be combined for complex workflows: "First use code-analyzer, then use optimizer."

### Resumable Agents
Previous subagent executions can be continued using their unique agent ID, preserving full conversation context for iterative analysis.

### CLI Configuration
The `--agents` flag accepts JSON objects for dynamic, session-specific subagent definitions without persistent storage.

## Best Practices

- Generate initial subagents with Claude, then customize for specific needs
- Design focused agents with single clear responsibilities
- Write detailed system prompts with specific instructions and constraints
- Restrict tool access to necessary capabilities only
- Version control project subagents for team collaboration

## Plugin Integration

Plugins can provide custom subagents appearing in `/agents` alongside user-defined agents. Plugin agents function identically to manually created subagents.

## Performance Considerations

Subagents preserve main conversation context, enabling longer sessions. However, they start with clean context and may add latency as they gather necessary information.