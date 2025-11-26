# Claude Agent SDK Overview

The Claude Agent SDK enables developers to construct production-ready AI agents. Built from the agent infrastructure powering Claude Code, it provides essential tools for agent development across multiple programming languages.

## Installation

The SDK supports two primary languages:

**TypeScript/Node.js:**
```bash
npm install @anthropic-ai/claude-agent-sdk
```

**Python:**
```bash
pip install claude-agent-sdk
```

## Core Capabilities

The documentation highlights five main advantages:

1. **Automatic Context Management** - The system compacts and manages context to prevent overflow situations
2. **Extensive Tool Library** - Includes file operations, code execution, web search, and Model Context Protocol (MCP) extensibility
3. **Fine-Grained Permissions** - Developers control which tools agents can access
4. **Production-Ready Features** - Built-in error handling, session persistence, and usage monitoring
5. **Optimized Performance** - Implements prompt caching and performance enhancements automatically

## Authentication Options

The SDK supports three authentication methods:

- Direct API key via `ANTHROPIC_API_KEY` environment variable
- Amazon Bedrock integration (set `CLAUDE_CODE_USE_BEDROCK=1`)
- Google Vertex AI (set `CLAUDE_CODE_USE_VERTEX=1`)

## Agent Applications

The documentation describes two primary use cases:

**Technical Domain**: SRE automation, security auditing, incident triage, code review enforcement

**Business Domain**: Legal analysis, financial reporting, technical support, marketing content generation

## Key Features

The SDK integrates several Claude Code capabilities:
- Subagents defined as Markdown files
- Specialized agent skills via `SKILL.md` files
- Custom commands through slash commands
- Plugin system for extensibility
- Memory via `CLAUDE.md` project files

## Branding Guidelines

Partners building with the SDK should note naming conventions. The term "Claude Code" refers to Anthropic's official product line. Acceptable alternatives include "Claude Agent" or "{ProductName} Powered by Claude."

---

# Claude Agent SDK - TypeScript Reference

## Installation

Install via npm:
```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Primary Functions

**`query()`** - Main entry point for Claude Code interaction. Accepts a prompt string or async iterable and returns an async generator streaming `SDKMessage` objects.

**`tool()`** - Creates type-safe MCP tool definitions using Zod schemas with async handlers.

**`createSdkMcpServer()`** - Instantiates an in-process MCP server with tool definitions.

## Essential Configuration (`Options`)

Key parameters include:
- `model`: Claude model selection
- `cwd`: Working directory (defaults to `process.cwd()`)
- `permissionMode`: Controls tool execution ("default" | "acceptEdits" | "bypassPermissions" | "plan")
- `allowedTools`/`disallowedTools`: Tool access control
- `mcpServers`: MCP server configurations
- `agents`: Programmatic subagent definitions
- `systemPrompt`: Custom or preset ("claude_code") system instructions
- `settingSources`: Filesystem config sources ("user" | "project" | "local")

## Message Types

The SDK streams `SDKMessage` union types:
- `SDKAssistantMessage`: Claude's responses
- `SDKUserMessage`: User input
- `SDKResultMessage`: Final execution results with usage/cost data
- `SDKSystemMessage`: Session initialization details

## Built-in Tools

Standard tools include: **Bash**, **Read**, **Write**, **Edit**, **Glob**, **Grep**, **WebFetch**, **WebSearch**, **NotebookEdit**, and **Task** (subagent delegation).

Each tool has typed input/output schemas documenting parameters and response structures.

## Permissions & Hooks

- `CanUseTool`: Custom permission function for granular tool control
- `hooks`: Event callbacks for "PreToolUse", "PostToolUse", "SessionStart", etc.

This reference provides comprehensive type definitions and function signatures for TypeScript-based Agent SDK implementations.

---

# Claude Agent SDK - Python Reference

## Installation & Quick Start

The Python SDK installs via pip:
```
pip install claude-agent-sdk
```

## Two Main Approaches

**`query()`** - Creates a fresh session each time, ideal for one-off tasks:
```python
async for message in query(prompt="Your task", options=options):
    print(message)
```

**`ClaudeSDKClient`** - Maintains conversation context across multiple exchanges, supporting interrupts, hooks, and custom tools.

## Core Classes

**ClaudeSDKClient** maintains persistent sessions with methods for:
- `connect()` - Initialize connection
- `query()` - Send requests in streaming mode
- `receive_messages()` - Get async iterator of responses
- `interrupt()` - Stop mid-execution
- Works as async context manager

## Key Configuration: ClaudeAgentOptions

Essential parameters include:
- `allowed_tools` - Specify which tools Claude can use
- `system_prompt` - Custom instructions or preset configurations
- `permission_mode` - Control tool execution ("acceptEdits", "plan", etc.)
- `mcp_servers` - Integrate MCP tool servers
- `cwd` - Set working directory
- `can_use_tool` - Custom permission callback function

## Custom Tools with @tool Decorator

Define reusable tools with type safety:
```python
@tool("name", "description", {"param": type})
async def tool_handler(args: dict) -> dict:
    return {"content": [{"type": "text", "text": "result"}]}
```

## Message Types

SDK yields various message objects:
- **UserMessage** - Input prompts
- **AssistantMessage** - Claude's responses with content blocks
- **SystemMessage** - Metadata and system events
- **ResultMessage** - Final results including costs and usage stats

## Built-in Tools Available

The SDK exposes 20+ tools including Read, Write, Bash, Edit, Glob, Grep, WebFetch, WebSearch, and more—each with defined input/output schemas.

## Error Handling

Key exception classes:
- `CLINotFoundError` - Claude Code CLI missing
- `ProcessError` - Process execution failed
- `CLIJSONDecodeError` - Response parsing error

## Advanced Features

- **Hooks** - Intercept PreToolUse, PostToolUse, UserPromptSubmit events
- **Structured Outputs** - Validate responses against JSON schemas
- **Session Management** - Resume, fork, or continue conversations
- **Settings Control** - Load from user, project, or local configuration sources

---

# Agent SDK Hosting and Deployment Guide

## Core Architecture

The Claude Agent SDK operates as a **long-running process** that maintains conversational state and executes commands in a persistent environment, unlike stateless LLM APIs. It manages shell execution, file operations, and tool handling with context persistence.

## Hosting Requirements

### Container-Based Sandboxing
The SDK must run in sandboxed containers providing:
- Process isolation per session
- Resource constraints (CPU, memory, storage)
- Network restrictions
- Ephemeral filesystems for clean state

### System Requirements
Each instance needs:
- **Runtime**: Python 3.10+ or Node.js 18+
- **Resources**: 1GiB RAM, 5GiB disk, 1 CPU (adjustable)
- **Network**: Outbound HTTPS to `api.anthropic.com`; optional MCP/external tool access

## Sandbox Providers

The guide lists specialized container providers: Cloudflare Sandboxes, Modal, Daytona, E2B, Fly Machines, and Vercel Sandbox.

## Four Deployment Patterns

**Pattern 1: Ephemeral Sessions** — New container per task, destroyed on completion. Ideal for one-off work like bug fixes, invoice processing, translations, and media handling.

**Pattern 2: Long-Running Sessions** — Persistent instances supporting multiple SDK processes. Suits proactive agents, email triage, site builders, and high-frequency chatbots.

**Pattern 3: Hybrid Sessions** — Ephemeral containers hydrated with saved history/state. Best for intermittent user interaction with work resumption (project management, research, support tickets).

**Pattern 4: Single Containers** — Multiple SDK processes in one global container. Used primarily for agent simulations requiring close collaboration.

## Key Operational Insights

- **Communication**: Expose ports for HTTP/WebSocket endpoints while SDK runs internally
- **Costs**: Approximately 5¢/hour per container; tokens dominate expenses
- **Idle Management**: Set provider-specific timeouts based on expected user response frequency
- **Monitoring**: Standard backend logging works for container health tracking
- **Session Duration**: No timeout enforced; use `maxTurns` to prevent loops
- **CLI Updates**: Semver versioning ensures backward compatibility
