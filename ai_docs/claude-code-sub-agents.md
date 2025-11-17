# Claude Code Subagents: Complete Documentation

## Overview

Subagents are specialized AI assistants within Claude Code that handle task-specific workflows. Each operates in its own context window with customized system prompts and tool configurations, enabling more efficient problem-solving while preserving the main conversation thread.

## Core Functionality

**Key characteristics of subagents:**
- Dedicated purpose and expertise area
- Independent context window separate from main conversation
- Configurable tool access permissions
- Custom system prompts guiding behavior

## Primary Benefits

The documentation outlines four main advantages:

1. **Context preservation**: "Each subagent operates in its own context, preventing pollution of the main conversation"
2. **Specialized expertise**: Fine-tuned configurations for specific domains improve success rates
3. **Reusability**: Once created, subagents work across projects and team workflows
4. **Flexible permissions**: Tool access can be granularly controlled per subagent

## Setup Process

Users create subagents via the `/agents` command with four steps:
1. Access the subagents interface
2. Select "Create New Agent"
3. Define purpose, tools, and system prompt
4. Save and deploy for automatic or explicit use

## Storage Architecture

Subagents are stored as Markdown files with YAML frontmatter:
- **Project-level**: `.claude/agents/` (highest priority, project-specific)
- **User-level**: `~/.claude/agents/` (available globally)
- **Plugin-based**: Integrated through plugin manifest configurations

When naming conflicts occur, project-level subagents take precedence.

## Configuration Structure

Each subagent file contains:

```markdown
---
name: identifier-name
description: Purpose and invocation context
tools: Tool1, Tool2, Tool3
model: sonnet
---

System prompt content defining role and behavior
```

**Required fields**: name, description
**Optional fields**: tools (inherits all if omitted), model (defaults to sonnet)

## Built-in Subagents

Claude Code includes the **Plan subagent**, which:
- Operates exclusively in plan mode (non-execution)
- Uses Sonnet model for enhanced analysis
- Accesses Read, Glob, Grep, and Bash tools
- Conducts codebase research before presenting plans

## Invocation Methods

**Automatic delegation**: Claude identifies matching tasks based on descriptions and context

**Explicit invocation**: Direct requests like "Use the code-reviewer subagent to check my changes"

## Practical Examples

The documentation provides three production-ready subagent templates:

**Code Reviewer**: Focuses on quality, security, and maintainability using git diff analysis

**Debugger**: Specializes in root cause analysis with structured reproduction and verification steps

**Data Scientist**: Handles SQL queries and BigQuery operations with optimization emphasis

## Advanced Features

**Subagent chaining**: Sequence multiple subagents for complex workflows

**Resume functionality**: Continue previous subagent conversations using stored agentId, useful for long-running analysis tasks

**CLI-based configuration**: Define subagents dynamically using the `--agents` flag with JSON formatting

## Best Practices

The documentation recommends:
- Generating initial subagents with Claude, then customizing
- Creating focused agents with single responsibilities
- Writing detailed, example-rich system prompts
- Restricting tool access to necessary functions
- Version-controlling project-level subagents

## Performance Considerations

Subagents preserve main conversation context for longer sessions but may introduce latency as they gather contextual information independently.
