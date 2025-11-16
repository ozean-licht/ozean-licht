# Writing Effective Tools for AI Agents: Complete Documentation

## Overview

Anthropic's engineering guide addresses how to create high-quality tools that LLM agents can use effectively. The approach differs fundamentally from traditional software development because agents are non-deterministic systems.

## Key Development Process

**Building Prototypes:**
Start by creating quick tool prototypes using Claude Code, providing documentation for relevant SDKs. Tools can be tested via local MCP servers, Desktop extensions, or direct API calls.

**Running Evaluations:**
Generate realistic evaluation tasks requiring multiple tool calls. Pair each prompt with verifiable outcomes. Run evaluations programmatically using simple agentic loops, collecting metrics beyond accuracy—including runtime, token consumption, and error rates.

**Collaborating with Agents:**
Concatenate evaluation transcripts and feed them into Claude Code to identify improvement opportunities. This iterative approach revealed that Claude-optimized tools outperformed human-written implementations on held-out test sets.

## Core Principles

**Tool Selection:**
Agents have limited context, unlike traditional systems with abundant memory. Rather than wrapping every API endpoint, build "thoughtful tools targeting specific high-impact workflows." Consolidate functionality—a single `schedule_event` tool beats separate `list_users`, `list_events`, and `create_event` tools.

**Namespacing:**
Group related tools under common prefixes (e.g., `asana_search`, `asana_projects_search`) to prevent confusion when agents access hundreds of tools.

**Meaningful Responses:**
Return high-signal information prioritizing contextual relevance. Use semantic identifiers over cryptic UUIDs. Support flexible response formats via parameters like `response_format` enums offering "detailed" or "concise" outputs.

**Token Efficiency:**
Implement pagination, filtering, and truncation with sensible defaults. Claude Code restricts responses to 25,000 tokens. Craft error messages with specific, actionable improvements rather than opaque codes.

**Description Engineering:**
"Small refinements to tool descriptions yield dramatic improvements." Describe tools as you would to new team members, making implicit context explicit. Use unambiguous parameter names like `user_id` instead of `user`.

## Results

Internal evaluations demonstrated significant performance gains. For example, Claude-optimized Slack and Asana MCP servers substantially outperformed baseline human-written implementations on test sets.
