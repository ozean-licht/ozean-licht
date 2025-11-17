# Writing Effective Tools for AI Agents

Anthropic's engineering team published comprehensive guidance on creating high-quality tools for AI agents. The piece emphasizes that "agents are only as effective as the tools we give them," focusing on practical techniques for building, evaluating, and optimizing tools using the Model Context Protocol (MCP).

## Key Process: Build → Evaluate → Improve

The article outlines a three-phase workflow:

### 1. Prototyping

Start with quick prototypes using Claude Code. The authors recommend providing LLM-friendly documentation (often found in `llms.txt` files) for APIs and SDKs. Tools can be tested via local MCP servers, Desktop extensions, or direct API calls.

### 2. Comprehensive Evaluation

Generate realistic evaluation tasks requiring multiple tool calls. Examples include complex workflows like scheduling meetings with document attachments or investigating customer billing issues. Each task needs a verifiable outcome. The team recommends running evaluations programmatically with simple agentic loops, collecting metrics beyond accuracy: runtime, tool call frequency, token consumption, and error rates.

### 3. Iterative Refinement

Agents themselves can analyze evaluation transcripts and suggest improvements. The authors note that "most of the advice in this post came from repeatedly optimizing our internal tool implementations with Claude Code."

## Five Core Principles for Effective Tools

### Choosing the Right Tools

More tools don't necessarily improve outcomes. Rather than wrapping every API endpoint, build thoughtful tools addressing high-impact workflows. Tools should consolidate operations—for instance, a `schedule_event` tool finding availability beats separate `list_users`, `list_events`, and `create_event` tools. This respects agents' limited context windows.

### Namespacing

Group related tools under common prefixes (e.g., `asana_search`, `asana_projects_search`) to help agents distinguish between overlapping functionality and reduce confusion.

### Meaningful Context

Return high-signal information prioritizing contextual relevance over technical details. Replace cryptic UUIDs with semantic identifiers. Support flexible response formats via parameters like `response_format: ["detailed", "concise"]` to balance between natural language and technical IDs needed for downstream calls.

### Token Efficiency

Implement pagination, filtering, and truncation with sensible defaults. Claude Code restricts responses to 25,000 tokens by default. Use truncated responses with steering language encouraging targeted searches rather than broad retrieval.

### Prompt Engineering Tool Descriptions

Clear, precise tool descriptions significantly impact performance. Think of descriptions as onboarding documentation for new team members, making implicit context explicit and avoiding ambiguity.

## Real-World Results

The team demonstrated measurable improvements through evaluation-driven optimization. Their internal Slack and Asana tool implementations showed performance gains when optimized by Claude versus human-written baselines, validated against held-out test sets.

## Critical Implementation Details

Tool responses should support multiple formats (XML, JSON, Markdown) based on evaluation results. Error responses must provide actionable guidance rather than opaque codes. Agents require both reasoning and feedback blocks before tool responses to trigger chain-of-thought behaviors effectively.

The article emphasizes iterative evaluation against realistic data reflecting actual user workflows rather than simplified sandbox environments, ensuring tools handle sufficient complexity.

## Overview: Core Concept

Tools represent a new software paradigm—contracts between deterministic systems and non-deterministic agents. Unlike traditional APIs, tools must accommodate unpredictable agent behavior including occasional hallucinations or misuse.

## Key Development Process

**Three-Stage Approach:**

1. **Build Prototypes** — Create quick implementations using Claude Code, wrapping tools in local MCP servers or desktop extensions for testing

2. **Run Evaluations** — Generate realistic evaluation tasks mirroring actual workflows, then measure agent performance across multiple metrics (accuracy, token usage, error rates)

3. **Optimize with Agents** — Use Claude to analyze evaluation transcripts and refactor tool implementations systematically

The guide notes that "most of the advice in this post came from repeatedly optimizing our internal tool implementations with Claude Code."

## Real Results

Internal evaluations showed significant improvements when Claude optimized tools itself—for Slack tools, human-written implementations achieved ~78% accuracy while Claude-optimized versions reached ~92%.
