# Subagents in Claude Code

Subagents are specialized AI assistants that Claude Code can delegate to for handling specific tasks. They operate with separate context windows and custom configurations, enabling more efficient problem-solving.

## Core Features

Subagents provide four main advantages:

1. **Context Preservation**: Each subagent operates in its own context, preventing pollution of the main conversation
2. **Specialized Expertise**: Custom instructions for specific domains improve success rates
3. **Reusability**: Once created, subagents work across different projects and team workflows
4. **Flexible Permissions**: Different tool access levels per subagent type

## Configuration

Subagents are stored as Markdown files with YAML frontmatter in two locations:

| Location | Scope |
|----------|-------|
| `.claude/agents/` | Current project (highest priority) |
| `~/.claude/agents/` | All projects |

### Required Fields

- `name`: Unique lowercase identifier
- `description`: Purpose and invocation context
- `tools` (optional): Inherited from main thread if omitted
- `model` (optional): Defaults to Sonnet if unspecified

## Getting Started

You can create subagents by running the `/agents` command, which provides an interactive interface for:

- Viewing existing agents
- Creating new agents
- Editing agent configurations
- Managing custom agents with guided setup

## Built-in Examples

Claude Code includes three pre-configured subagent templates:

1. **Code Reviewer**: Focuses on code quality and security review
2. **Debugger**: Performs root cause analysis for issues
3. **Data Scientist**: Handles SQL and BigQuery operations

## Setup Process

Users can create subagents via the `/agents` command, which provides an interactive interface for viewing, creating, editing, and managing custom agents with guided setup.

## Dynamic Configuration

Subagents can also be defined dynamically using the CLI with the `--agents` flag for flexible deployment scenarios.

## Best Practices

When creating subagents, consider the following guidance:

1. **Focused Responsibility**: Create subagents with single, well-defined purposes
2. **Detailed Instructions**: Write comprehensive system prompts for each subagent
3. **Appropriate Tool Access**: Limit tool access based on subagent requirements
4. **Version Control**: Leverage version control for team collaboration on agent definitions

## Built-in Capabilities

Claude Code includes a Plan subagent for research during plan mode, providing specialized capabilities for planning workflows.

## Subagent Context

Each subagent:
- Operates independently with its own context window
- Maintains separate conversation history
- Has customizable tool access
- Can be invoked from the main agent or other subagents
- Preserves context separation to avoid conversation pollution
