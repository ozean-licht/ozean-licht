# Claude Code Subagents: Complete Documentation

## Overview

Subagents are specialized AI assistants in Claude Code that handle task-specific workflows with separate context windows. They enable "more efficient problem-solving by providing task-specific configurations with customized system prompts, tools and a separate context window."

## Core Characteristics

Each subagent features:
- A defined purpose and expertise area
- Independent context separate from main conversation
- Configurable tool access
- Custom system prompt guiding behavior

## Key Benefits

The documentation highlights four primary advantages:

1. **Context Preservation**: "Each subagent operates in its own context, preventing pollution of the main conversation"

2. **Specialized Expertise**: Subagents achieve "higher success rates on designated tasks" through domain-specific fine-tuning

3. **Reusability**: Created once, subagents work "across different projects and shared with your team"

4. **Flexible Permissions**: Individual "tool access levels" allow security-conscious configurations

## Creation Process

Users launch subagent creation via `/agents` command, then:
- Choose project-level or user-level scope
- Generate with Claude or build manually
- Select specific tools or inherit all
- Save for automatic or explicit invocation

## File Storage Locations

| Type | Location | Scope |
|------|----------|-------|
| Project subagents | `.claude/agents/` | Current project |
| User subagents | `~/.claude/agents/` | All projects |

Project-level subagents take precedence when naming conflicts occur.

## Configuration Format

Subagents use Markdown with YAML frontmatter:

```markdown
---
name: subagent-identifier
description: Purpose and invocation guidance
tools: Tool1, Tool2, Tool3  # Optional
model: sonnet  # Optional
---

System prompt describing role and approach
```

**Key fields:**
- `name`: Lowercase identifier with hyphens
- `description`: Natural language purpose
- `tools`: Comma-separated list (optional—inherits all if omitted)
- `model`: Model alias (`sonnet`, `opus`, `haiku`) or `'inherit'`

## Invocation Methods

**Automatic**: Claude proactively delegates tasks matching subagent expertise

**Explicit**: Users request specific subagents directly:
```
> Use the code-reviewer subagent to check my recent changes
```

## Built-in Subagents

### Plan Subagent
- Operates during plan mode (non-execution)
- "Searches files, analyzes code structure, and gathers context"
- Uses Sonnet model with Read, Glob, Grep, and Bash tools
- Prevents infinite agent nesting

### Example Custom Subagents

**Code Reviewer**: "Expert code review specialist" focusing on quality, security, and maintainability

**Debugger**: "Debugging specialist for errors, test failures, and unexpected behavior"

**Data Scientist**: "Data analysis expert for SQL queries, BigQuery operations, and data insights"

## Advanced Features

### Subagent Chaining
Complex workflows invoke multiple subagents sequentially for comprehensive solutions.

### CLI Configuration
Define subagents dynamically using the `--agents` flag with JSON:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer...",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

### Resumable Subagents
Agents can resume previous conversations using unique `agentId`, enabling:
- Long-running codebase analysis across sessions
- Iterative refinement without context loss
- Sequential multi-step workflows

Agent transcripts store in: `agent-{agentId}.jsonl`

## Best Practices

- **Start with Claude-generated agents**: "Generate your initial subagent with Claude and then iterating on it"
- Design focused subagents with single responsibilities
- Include specific instructions and constraints in prompts
- Limit tool access to necessary functions only
- Version control project subagents for team collaboration

## Performance Considerations

- Subagents preserve main context for longer overall sessions
- Initial invocations incur latency as agents gather required context
- Clean-slate approach ensures focused task execution

## Plugin Integration

Plugins provide custom subagents appearing in `/agents` interface alongside user-defined agents. Plugin agents function identically to manually-created subagents and support both explicit and automatic invocation.
