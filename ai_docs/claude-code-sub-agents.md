# Claude Code Subagents: Complete Documentation

## Core Concept

Subagents are "specialized AI assistants that can be invoked to handle specific types of tasks." Each operates with its own context window, custom system prompt, and configurable tool access.

## Key Features

**Four Main Benefits:**

1. **Context preservation** — each subagent maintains separate context from main conversation
2. **Specialized expertise** through fine-tuned instructions for specific domains
3. **Reusability** across projects and team sharing
4. **Flexible permissions** allowing differentiated tool access per subagent

## Configuration & Storage

Subagents exist as Markdown files with YAML frontmatter in two locations:

- **Project-level**: `.claude/agents/` (highest priority)
- **User-level**: `~/.claude/agents/` (lower priority)

### Required YAML Fields

- `name`: unique identifier (lowercase, hyphens)
- `description`: natural language purpose statement

### Optional Fields

- `tools`: comma-separated tool list (inherits all if omitted)
- `model`: specify alias (sonnet/opus/haiku) or "inherit"
- `permissionMode`: controls permission handling
- `skills`: auto-load specified skills

## Creation & Management

Access via `/agents` command for interactive management, or create files manually:

```bash
mkdir -p .claude/agents
# Create markdown file with YAML frontmatter and system prompt
```

CLI-based configuration using `--agents` flag accepts JSON object definitions for session-specific agents.

## Usage Patterns

### Automatic Delegation

Claude recognizes matching tasks based on descriptions and context

### Explicit Invocation

"Use the [subagent-name] to..." syntax

### Chaining

Multiple subagents for complex workflows

### Resumption

Continue previous conversations using agent IDs stored in transcript files

## Built-in Subagents

The Plan subagent operates automatically in plan mode for codebase research before presenting solutions.

## Best Practices

- Start with Claude-generated subagents, then customize
- Design focused agents with single responsibilities
- Include detailed system prompts with specific instructions
- Restrict tool access to necessary functions only
- Version control project subagents for team collaboration
