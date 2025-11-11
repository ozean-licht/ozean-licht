# Claude Code Subagents Documentation

## Overview

Subagents are specialized AI assistants that Claude Code can delegate to for specific tasks. As stated in the documentation, they "enable more efficient problem-solving by providing task-specific configurations with customized system prompts, tools and a separate context window."

## Core Characteristics

Each subagent features:
- Dedicated expertise in a specific domain
- Independent context window separate from main conversations
- Configurable tool access permissions
- Custom system prompts guiding behavior

## Primary Benefits

The documentation highlights four main advantages:

1. **Context Preservation** - "Each subagent operates in its own context, preventing pollution of the main conversation"
2. **Specialized Expertise** - Fine-tuned instructions improve success rates on designated tasks
3. **Reusability** - Can be deployed across projects and shared with teams
4. **Flexible Permissions** - Granular tool access control for security

## Configuration & Storage

Subagents are Markdown files with YAML frontmatter stored in two locations:
- `.claude/agents/` (project-level, highest priority)
- `~/.claude/agents/` (user-level, lower priority)

Key configuration fields include `name`, `description`, `tools`, and `model` selection (with options like `sonnet`, `opus`, or `inherit`).

## Management & Usage

The `/agents` command provides an interactive interface for creating, editing, and managing subagents. Users can invoke them explicitly ("Use the code-reviewer subagent") or allow Claude to delegate automatically based on task matching.

## Built-in Examples

Claude Code includes example subagents for code review, debugging, and data analysis, each with specific tool access and focused purposes.

## Best Practices

The documentation recommends generating initial subagents with Claude, designing focused responsibilities, writing detailed prompts, and limiting tool access to necessary functions only.
