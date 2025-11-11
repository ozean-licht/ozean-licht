# Writing Effective Tools for AI Agents

## Overview

This Anthropic engineering guide addresses how to design tools that work effectively with AI agents, particularly through the Model Context Protocol (MCP). The core insight is that "tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents."

## Three-Phase Development Approach

### 1. Building Prototypes

Start by creating quick implementations of your tools. Using Claude Code can accelerate this process when you provide documentation for relevant SDKs and APIs. Tools can connect via local MCP servers, Desktop extensions, or directly through the Anthropic API for testing.

### 2. Running Evaluations

Create realistic evaluation tasks grounded in actual workflows. Strong evaluation prompts require multiple tool calls and mirror real-world complexity. Examples include scheduling meetings with document attachments, investigating duplicate charges, and preparing customer retention offers.

The evaluation process involves:
- Generating diverse prompts paired with verifiable outcomes
- Running programmatic tests with alternating LLM API and tool calls
- Collecting metrics on accuracy, runtime, token consumption, and errors
- Using chain-of-thought reasoning to understand agent behavior

### 3. Collaborative Optimization

Agents themselves can analyze evaluation transcripts and suggest improvements, creating a feedback loop where Claude Code refactors tool implementations for consistency and performance.

## Five Core Principles for Effective Tools

**Intentional Tool Selection**: Not every API endpoint needs a corresponding tool. Since agents have limited context (unlike computer memory), build fewer, higher-impact tools that consolidate related operations. Instead of separate `list_users`, `list_events`, and `create_event` tools, consider one `schedule_event` tool handling the complete workflow.

**Strategic Namespacing**: Group related tools with consistent prefixes (e.g., `asana_search`, `asana_projects_search`) to help agents distinguish between functions and reduce cognitive load from tool descriptions.

**Meaningful Context Returns**: Prioritize semantically rich information over technical identifiers. Replace cryptic UUIDs with natural language names. Where needed, expose a `response_format` parameter allowing agents to request "concise" or "detailed" responses, balancing completeness with token efficiency.

**Token-Efficient Responses**: Implement pagination, filtering, and truncation with sensible defaults. Provide helpful guidance when tools return truncated results, directing agents toward more targeted searches rather than broad queries.

**Refined Descriptions**: Treat tool documentation as system prompts that steer agent behavior. Clear, unambiguous parameter names and explicit context about specialized query formats significantly improve performance. Small refinements to descriptions can yield dramatic improvements in task completion.

## Measuring Success

Performance improvements are quantifiable. Internal testing showed that Claude-optimized Slack and Asana MCP servers achieved meaningfully higher accuracy on held-out test sets compared to manually written versions, demonstrating the value of systematic evaluation and iteration.
