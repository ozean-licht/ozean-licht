# Writing Effective Tools for AI Agents

## Overview

Anthropic's guide on building high-quality tools for LLM agents emphasizes evaluation-driven development and collaboration with AI systems like Claude Code to optimize tool performance.

## Key Development Process

### Three-Stage Approach

**1. Prototyping**
Stand up quick tool implementations using Claude Code with proper documentation (like `llms.txt` files). Connect tools via local MCP servers or Desktop extensions for testing.

**2. Evaluation**
Generate realistic evaluation tasks and run agents programmatically through simple loops. Collect metrics beyond accuracy—track token usage, tool call counts, and error patterns.

**3. Optimization**
"Simply concatenate the transcripts from your evaluation agents and paste them into Claude Code" to identify and fix issues systematically.

## Core Principles for Tool Design

### Choosing the Right Tools

More tools don't guarantee better outcomes. Avoid merely wrapping existing APIs; instead, consolidate functionality into high-impact tools matching actual workflows. For example, implement `schedule_event` rather than separate `list_users`, `list_events`, and `create_event` tools.

### Namespacing

Group related tools with consistent prefixes (e.g., `asana_projects_search`, `asana_users_search`) to reduce agent confusion when accessing hundreds of tools.

### Meaningful Context

Return high-signal information prioritizing semantic relevance. Use natural language identifiers instead of technical ones (prefer `name` over `uuid`). Implement optional `response_format` parameters allowing agents to request "concise" versus "detailed" responses.

### Token Efficiency

Implement pagination, filtering, and truncation with sensible defaults. Provide actionable error messages steering agents toward better strategies rather than opaque error codes.

### Prompt Engineering

Craft clear, unambiguous tool descriptions. Refinements to specifications yielded dramatic improvements in Claude's task completion rates.

## Results

Internal testing showed Claude-optimized tools significantly outperformed manually-written implementations across Slack and Asana integrations.

---

**Source:** https://www.anthropic.com/engineering/writing-tools-for-agents
