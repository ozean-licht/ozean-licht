# Claude Code SDK - TypeScript Documentation

## Overview

The Claude Agent SDK (formerly Claude Code SDK) is Anthropic's official toolset for building custom AI agents. It provides production-ready building blocks built on the agent harness powering Claude Code.

## Installation

For TypeScript/Node.js environments, install via npm:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Requirements

- **Node.js**: 18 or higher
- **Runtime**: Python 3.10+ (CLI requirement)
- **API Key**: Anthropic API key from Claude Console

## Authentication

Set up authentication via environment variable:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Uses ANTHROPIC_API_KEY environment variable
const response = query({
  prompt: "Your prompt here",
  options: {
    model: "claude-sonnet-4-5"
  }
});
```

## Streaming vs Single Message Input

The Claude Agent SDK provides two distinct input modes for agent interaction.

### Streaming Input Mode (Recommended)

Streaming input mode is the preferred way to use the Claude Agent SDK. It establishes a persistent, interactive session where the agent operates as a long-lived process.

#### Benefits

- **Image Attachments**: Attach images directly to messages for visual analysis
- **Message Queuing**: Send multiple messages sequentially with interruption capability
- **Tool Access**: Full integration with all tools and custom MCP servers
- **Lifecycle Hooks**: Customize behavior at various points
- **Real-time Feedback**: View responses as generated
- **Context Persistence**: Maintain conversation state across turns

#### TypeScript Example

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "fs";

async function* generateMessages() {
  // Initial message
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "Analyze this codebase for security issues"
    }
  };

  // Follow-up with image attachment
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: [
        {
          type: "text",
          text: "Review this architecture diagram"
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/png",
            data: readFileSync("diagram.png", "base64")
          }
        }
      ]
    }
  };
}

for await (const message of query({
  prompt: generateMessages(),
  options: {
    maxTurns: 10,
    allowedTools: ["Read", "Grep"]
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

### Single Message Input

Single message input suits scenarios requiring one-shot responses in stateless environments (e.g., Lambda functions).

#### Limitations

Single message input does **not** support:
- Direct image attachments
- Dynamic message queueing
- Real-time interruption
- Hook integration
- Multi-turn conversations naturally

#### TypeScript Example

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// One-shot query
for await (const message of query({
  prompt: "Explain the authentication flow",
  options: {
    maxTurns: 1,
    allowedTools: ["Read", "Grep"]
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

## Permissions and Tool Control

The Claude Agent SDK provides four complementary mechanisms for controlling tool usage:

1. **Permission Modes** - Global behavior settings affecting all tools
2. **`canUseTool` Callback** - Runtime handler for permission decisions
3. **Hooks** - Fine-grained control over tool execution
4. **Permission Rules (settings.json)** - Declarative allow/deny policies

### Permission Modes

Four modes govern how Claude uses tools:

| Mode | Purpose |
|------|---------|
| `default` | Standard permission checks apply |
| `plan` | Planning mode (read-only tools only) |
| `acceptEdits` | Auto-approves file edits and filesystem operations |
| `bypassPermissions` | Bypasses all permission checks |

#### Setting Permission Mode

```typescript
const result = await query({
  prompt: "Help me refactor this code",
  options: {
    permissionMode: 'default'
  }
});
```

#### Dynamic Changes (Streaming Only)

```typescript
const q = query({
  prompt: streamInput(),
  options: { permissionMode: 'default' }
});

await q.setPermissionMode('acceptEdits');
```

### Processing Order

The permission system evaluates in this sequence:

```
PreToolUse Hook → Deny Rules → Allow Rules → Ask Rules → Permission Mode Check → canUseTool Callback → PostToolUse Hook
```

### `canUseTool` Callback

This callback handles permission decisions for uncovered cases:

```typescript
const result = await query({
  prompt: "Analyze this codebase",
  options: {
    canUseTool: async (toolName, input) => {
      // Display tool request and get approval
      const approved = await getUserApproval();

      return approved
        ? { behavior: "allow", updatedInput: input }
        : { behavior: "deny", message: "User denied permission" };
    }
  }
});
```

### Best Practices

- Use `default` mode for controlled execution
- Switch to `acceptEdits` for rapid file iteration
- Avoid `bypassPermissions` in production environments
- Combine modes with hooks for granular control
- Progress modes as confidence increases during tasks

## Sessions and State Management

The Claude Agent SDK provides built-in session management for maintaining conversation state across multiple interactions.

### Getting the Session ID

Sessions automatically capture and restore full context. The SDK automatically creates a session and returns a session ID through the initial system message.

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

let sessionId: string | undefined

const response = query({
  prompt: "Help me build a web application",
  options: {
    model: "claude-sonnet-4-5"
  }
})

for await (const message of response) {
  if (message.type === 'system' && message.subtype === 'init') {
    sessionId = message.session_id
    console.log(`Session started with ID: ${sessionId}`)
  }
  console.log(message)
}
```

### Resuming Sessions

Use the `resume` option with a previously captured session ID to continue conversations with full context preservation:

```typescript
const response = query({
  prompt: "Continue implementing the authentication system",
  options: {
    resume: "session-xyz",
    model: "claude-sonnet-4-5",
    allowedTools: ["Read", "Edit", "Write", "Glob", "Grep", "Bash"]
  }
})
```

### Forking Sessions

Create branched conversations without modifying the original by using the `forkSession` option:

| Aspect | Default (`forkSession: false`) | Fork (`forkSession: true`) |
|--------|------|------|
| **Session ID** | Same as original | New ID generated |
| **History** | Appends to original | New branch from resume point |
| **Original Session** | Modified | Preserved |

#### When to Fork

Forking is useful for:
- Exploring alternative approaches
- Testing changes without affecting original history
- Maintaining separate experimental paths

#### Example: Forking a Session

```typescript
// Fork to try a different approach
const forkedResponse = query({
  prompt: "Now let's redesign this as a GraphQL API instead",
  options: {
    resume: sessionId,
    forkSession: true,
    model: "claude-sonnet-4-5"
  }
})

// Original session remains unchanged and resumable
const originalContinued = query({
  prompt: "Add authentication to the REST API",
  options: {
    resume: sessionId,
    forkSession: false,
    model: "claude-sonnet-4-5"
  }
})
```

## Custom Tools and MCP Integration

Custom tools extend Claude's capabilities through in-process MCP (Model Context Protocol) servers. The SDK provides helper functions `createSdkMcpServer` and `tool` to define type-safe custom implementations.

### Creating Custom Tools

Tools are defined using the `tool` function with Zod schemas for type safety:

```typescript
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const customServer = createSdkMcpServer({
  name: "my-custom-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "Get current temperature for a location using coordinates",
      {
        latitude: z.number().describe("Latitude coordinate"),
        longitude: z.number().describe("Longitude coordinate")
      },
      async (args) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m`
        );
        const data = await response.json();
        return {
          content: [{
            type: "text",
            text: `Temperature: ${data.current.temperature_2m}°F`
          }]
        };
      }
    )
  ]
});
```

### Key Integration Requirements

**Streaming Input Mode Required:** MCP tools demand async generators for the prompt parameter—simple strings won't work.

**Tool Naming Convention:** Tools follow the pattern `mcp__{server_name}__{tool_name}`. A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`.

### Using Custom Tools

Pass servers to the `query` function via the `mcpServers` option:

```typescript
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "What's the weather in San Francisco?"
    }
  };
}

for await (const message of query({
  prompt: generateMessages(),
  options: {
    mcpServers: {
      "my-custom-tools": customServer
    },
    allowedTools: [
      "mcp__my-custom-tools__get_weather"
    ],
    maxTurns: 3
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}
```

### Error Handling Pattern

```typescript
tool(
  "fetch_data",
  "Fetch data from an API",
  { endpoint: z.string().url() },
  async (args) => {
    try {
      const response = await fetch(args.endpoint);
      if (!response.ok) {
        return {
          content: [{
            type: "text",
            text: `API error: ${response.status} ${response.statusText}`
          }]
        };
      }
      const data = await response.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Failed to fetch data: ${error.message}`
        }]
      };
    }
  }
)
```

### Multiple Tools Example

Create servers with several tools and selectively enable them:

```typescript
const multiToolServer = createSdkMcpServer({
  name: "utilities",
  version: "1.0.0",
  tools: [
    tool("calculate", "Perform mathematical calculations", {...}),
    tool("translate", "Translate text", {...}),
    tool("search_web", "Search the web", {...})
  ]
});

// Allow only specific tools
allowedTools: [
  "mcp__utilities__calculate",
  "mcp__utilities__translate"
  // search_web is NOT available
]
```

## Hosting and Deployment

The Claude Agent SDK differs fundamentally from stateless LLM APIs. Instead of simple request-response patterns, it maintains conversational state and executes commands within a persistent environment, requiring container-based hosting infrastructure.

### Hosting Requirements

#### Container-Based Sandboxing

Security and isolation demand containerized deployment with:
- Process isolation per session
- Resource constraints (CPU, memory, storage)
- Network access controls
- Ephemeral filesystems for clean states

#### System Requirements

Each SDK instance needs:
- **Runtime**: Python 3.10+ or Node.js 18+
- **CLI**: `npm install -g @anthropic-ai/claude-code`
- **Resources**: 1GB RAM, 5GB disk, 1 CPU (adjustable per task)
- **Network**: Outbound HTTPS to `api.anthropic.com`

### Production Deployment Patterns

#### Pattern 1: Ephemeral Sessions

Create containers for single tasks, destroy upon completion. Ideal for discrete operations like bug fixes, invoice processing, or media transformation.

#### Pattern 2: Long-Running Sessions

Maintain persistent containers with multiple Claude Agent processes. Best for proactive agents handling email triage, site hosting, or high-frequency chatbots.

#### Pattern 3: Hybrid Sessions

Ephemeral containers hydrated with historical state from databases or session resumption features. Suits project management, research tasks, or customer support agents.

#### Pattern 4: Single Containers

Multiple SDK processes in one container for agent collaboration (least common due to state management complexity).

### Sandbox Providers

- Cloudflare Sandboxes
- Modal Sandboxes
- Daytona
- E2B
- Fly Machines
- Vercel Sandbox

### Key Operational Insights

**Cost**: Approximately 5 cents per hour per container; tokens remain the dominant expense.

**Idle Management**: Provider-dependent; tune timeout thresholds based on expected user interaction frequency.

**Session Limits**: No inherent timeouts, but implement `maxTurns` to prevent infinite loops.

**Monitoring**: Leverage existing backend logging infrastructure for container health and performance tracking.

## Subagents

Subagents are specialized AIs orchestrated by the main agent. They enable context isolation and parallel execution of specialized tasks within the SDK.

### Key Benefits

**Context Management**: Subagents maintain separate conversation contexts, preventing specialized task details from cluttering the main agent's interaction space.

**Parallelization**: Multiple subagents can execute simultaneously, dramatically accelerating complex workflows that would otherwise run sequentially.

**Specialized Instructions**: Each subagent can have customized system prompts with domain-specific expertise and constraints tailored to its role.

**Tool Restrictions**: Subagents can be limited to specific tools, reducing unintended action risks.

### Programmatic Definition (Recommended for SDK)

Define agents directly in code using the `agents` parameter:

```typescript
const result = query({
  prompt: "Review the authentication module for security issues",
  options: {
    agents: {
      'code-reviewer': {
        description: 'Expert code review specialist',
        prompt: `You are a code review specialist...`,
        tools: ['Read', 'Grep', 'Glob'],
        model: 'sonnet'
      }
    }
  }
});
```

### Filesystem-Based Definition (Alternative)

Place markdown files with YAML frontmatter in `.claude/agents/`:

```markdown
---
name: code-reviewer
description: Expert code review specialist
tools: Read, Grep, Glob, Bash
---

Your subagent's system prompt goes here.
```

### AgentDefinition Configuration

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `description` | string | Yes | When to invoke this agent |
| `prompt` | string | Yes | System instructions defining behavior |
| `tools` | string[] | No | Allowed tool names; inherits all if omitted |
| `model` | string | No | Model override ('sonnet', 'opus', 'haiku') |

### Common Tool Combinations

- **Read-only agents**: `['Read', 'Grep', 'Glob']`
- **Test execution**: `['Bash', 'Read', 'Grep']`
- **Code modification**: `['Read', 'Edit', 'Write', 'Grep', 'Glob']`

## Key Features & Capabilities

### Context Management

The SDK automatically compacts and manages context to prevent agents from exhausting token limits.

### Tool Ecosystem

Includes built-in tools:
- File operations (Read, Edit, Write, Glob)
- Code execution (Bash, Python)
- Web search and fetching
- MCP extensibility for custom tools

### Production Features

Built-in error handling, session management, and monitoring capabilities for production deployments.

### Claude Code Integration

Leverages the same harness powering Claude Code, including automatic prompt caching and performance optimizations.

## Models Available

- `claude-sonnet-4-5` (Recommended for most agents)
- `claude-opus-4-1`
- `claude-haiku-3-5`

## Full Feature Support

Agents access:
- Subagents
- Agent Skills
- Hooks
- Slash commands
- Plugins
- Memory (through `.claude/` directory configuration)

## Support & Resources

- Report bugs on GitHub (separate repos for TypeScript and Python SDKs)
- Access changelogs via official repository CHANGELOG.md files
- Review CLI reference, GitHub Actions integration, and MCP documentation for additional guidance
- Official Agent SDK documentation at https://docs.claude.com

---

**Last Updated**: 2025-11-14
**Source**: https://docs.claude.com/en/docs/agent-sdk/
