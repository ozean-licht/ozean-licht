# Writing Effective Tools for AI Agents

## Overview

This Anthropic engineering blog post explains how to create high-quality tools for AI agents using the Model Context Protocol (MCP), emphasizing an evaluation-driven approach to tool development.

## What is a Tool?

The article distinguishes tools as software mediating between deterministic systems and non-deterministic agents. Unlike traditional function calls that produce identical outputs, agents may use tools variably or even misunderstand them.

## How to Write Tools

The post recommends a three-stage process:

### 1. Building Prototypes

Start with quick tool prototypes using Claude Code. Provide LLM-friendly documentation for APIs and SDKs. Wrap tools in local MCP servers or Desktop extensions for testing.

As the article notes: "It can be difficult to anticipate which tools agents will find ergonomic" without hands-on prototyping.

Key aspects:
- Create early versions using Claude Code
- Provide clear LLM-friendly documentation (like `llms.txt` files)
- Test locally by wrapping tools in MCP servers or desktop extensions

### 2. Running Evaluations

Create realistic evaluation tasks grounded in actual workflows. Strong tasks require multiple tool calls and reflect real-world complexity.

The guidance states: "Strong evaluation tasks might require multiple tool calls—potentially dozens."

Key aspects:
- Generate realistic evaluation tasks from actual workflows
- Pair prompts with verifiable outcomes
- Use programmatic evaluation loops with API calls
- Collect metrics tracking:
  - Tool calls count
  - Runtime
  - Token consumption
  - Error rates
  - Accuracy

### 3. Collaborating with Agents

Use Claude Code to analyze evaluation results and refactor tools automatically. This iterative process revealed performance improvements beyond manually written implementations.

Key aspects:
- Let Claude analyze evaluation transcripts
- Identify improvements systematically
- Refactor tools based on AI analysis
- Iterate on tool implementations

## Core Principles for Tool Design

### 1. Choose Thoughtfully

More tools aren't always better. Rather than wrapping every API endpoint, focus on agent-specific affordances.

The article explains that "agents have distinct affordances to traditional software—that is, they have different ways of perceiving potential actions."

**Recommendations:**
- Implement fewer, more purposeful tools
- Focus on high-impact tools targeting specific workflows
- Consolidate related operations into single tools
- Avoid wrapping every API endpoint

### 2. Use Clear Namespacing

Group related tools with consistent prefixes (e.g., `asana_search`, `jira_search`). This reduces confusion when agents access hundreds of tools across multiple servers.

**Example patterns:**
- `asana_search`, `asana_create_task`, `asana_update_task`
- `jira_search`, `jira_create_issue`, `jira_update_issue`
- `slack_send_message`, `slack_search_channels`

### 3. Return Meaningful Context

Prioritize semantic field names over technical identifiers. Replace UUIDs with human-readable alternatives. Enable flexible response formats using enum parameters like `response_format` (concise vs. detailed).

**Best practices:**
- Use semantic identifiers instead of cryptic UUIDs
- Return high-signal information with relevance prioritized
- Offer flexible response formats controlling verbosity
- Include human-readable names and descriptions

### 4. Optimize Token Efficiency

Implement pagination, filtering, and truncation with sensible defaults. Claude Code restricts responses to 25,000 tokens by default. Guide agents toward efficient strategies through clear error messages and helpful truncation notices.

**Key strategies:**
- Implement pagination with sensible defaults
- Add filtering capabilities
- Use truncation wisely
- Provide helpful error messages guiding agents toward efficient strategies
- Include truncation notices that are helpful and informative

### 5. Engineer Tool Descriptions

Precise, detailed descriptions dramatically improve performance. The article states: "Even small refinements to tool descriptions can yield dramatic improvements."

**Best practices:**
- Craft clear descriptions treating tools like explaining to new team members
- Make implicit context explicit
- Provide concrete examples in descriptions
- Explain expected inputs and outputs clearly
- Guide agents toward effective usage patterns

## Notable Results

Internal testing showed Claude-optimized tools achieved:
- **Higher accuracy** on held-out test sets
- **Better performance** than manually written versions
- **Improved efficiency** for both Slack and Asana integrations

This validates the evaluation-driven approach and collaborative optimization process with AI agents.

## Key Takeaways

1. **Systematic approach**: Use prototyping, evaluation, and optimization as a structured process
2. **Evaluation-driven**: Building evaluations allows you to systematically measure tool performance
3. **Agent collaboration**: Let AI agents themselves help improve and refactor tools
4. **Thoughtful design**: Focus on agent-specific affordances rather than comprehensive API wrapping
5. **Iterative refinement**: Even small improvements to tool design and descriptions yield significant gains

## Conclusion

By following this systematic, evaluation-driven approach and adhering to core design principles, developers can create tools that work effectively with AI agents. The key is to balance comprehensiveness with purposefulness, prioritize meaningful context and efficiency, and use AI agents themselves to drive continuous improvement.
