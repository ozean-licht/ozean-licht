# Writing Effective Tools for AI Agents — Anthropic Engineering Blog

## Overview
Published September 11, 2025, this article explains how to design high-quality tools for LLM agents using the Model Context Protocol (MCP). The core insight is that "tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents."

## Key Process: Three Steps

**1. Building Prototypes**
Start with quick tool prototypes using Claude Code. Provide documentation for relevant APIs and SDKs. Test locally via MCP servers or Desktop extensions using commands like `claude mcp add <name> <command>`.

**2. Running Evaluations**
Create realistic evaluation tasks requiring multiple tool calls. Pair prompts with verifiable outcomes. Run evaluations programmatically using simple agentic loops. Collect metrics: accuracy, runtime, token consumption, and error rates.

**3. Collaborating with Claude**
Let Claude analyze evaluation transcripts and improve your tools automatically, ensuring consistency across implementations.

## Five Core Principles

**Choosing the Right Tools**
Implement fewer, thoughtful tools targeting high-impact workflows rather than simply wrapping all API endpoints. Tools should consolidate functionality—for example, a `schedule_event` tool instead of separate `list_users`, `list_events`, and `create_event` tools.

**Namespacing Tools**
Group related tools with consistent prefixes (e.g., `asana_projects_search`, `asana_users_search`) to help agents select appropriate tools and reduce context consumption.

**Returning Meaningful Context**
Prioritize human-readable fields (`name`, `image_url`) over technical identifiers (`uuid`, `mime_type`). Use `response_format` enum parameters allowing agents to request "concise" or "detailed" responses depending on needs.

**Token Efficiency**
Implement pagination, filtering, and truncation with sensible defaults. Claude Code restricts responses to 25,000 tokens by default. Provide helpful error messages guiding agents toward more efficient strategies rather than cryptic error codes.

**Prompt-Engineering Descriptions**
Write clear tool descriptions as if explaining to a new teammate. Unambiguously name parameters (use `user_id` not `user`). Small refinements dramatically improve performance—Claude Sonnet achieved state-of-the-art on SWE-bench Verified after precise tool description updates.

## Real-World Results

Internal testing showed Claude-optimized Slack and Asana MCP servers significantly outperformed human-written versions on held-out test sets, demonstrating the effectiveness of systematic evaluation and iterative improvement.
