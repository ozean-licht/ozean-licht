# Claude Code SDK: Headless Documentation

This documentation covers the Claude Agent SDK, which enables developers to build custom AI agents leveraging the infrastructure that powers Claude Code. The Agent SDK is designed for headless/programmatic access without a GUI.

## Overview

The Claude Agent SDK provides production-ready building blocks for agentic applications with automatic context management, a comprehensive tool ecosystem, fine-grained permissions control, and multi-language support.

### Key Features

- **Context Management**: Automatic compaction and context management to ensure your agent doesn't run out of context
- **Tool Ecosystem**: File operations, code execution, web search capabilities, and MCP extensibility for custom integrations
- **Permissions & Control**: Fine-grained tool access management through `allowedTools`, `disallowedTools`, and `permissionMode` settings
- **Production Essentials**: Built-in error handling, session management, and monitoring capabilities
- **Multi-Language Support**: TypeScript/JavaScript and Python SDKs available

### Available SDKs

- **TypeScript**: For Node.js and web applications (`npm install @anthropic-ai/claude-agent-sdk`)
- **Python**: For Python applications and data science workflows (`pip install claude-agent-sdk`)

### Authentication

Standard Claude API key via `ANTHROPIC_API_KEY` environment variable, with support for Amazon Bedrock and Google Vertex AI through environment flags.

## What You Can Build

The Agent SDK enables development of:

**Coding Agents:**
- SRE (Site Reliability Engineering) automation
- Security review and vulnerability scanning
- Incident triage and response automation
- Code refactoring and optimization

**Business Agents:**
- Legal document review and analysis
- Financial analysis and reporting
- Customer support automation
- Content creation and curation

---

## TypeScript Agent SDK Reference

The TypeScript Agent SDK provides comprehensive APIs for building AI agents with Node.js.

### Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Core Functions

#### `query()`

The primary function for Claude Code interaction, returning an async generator that streams messages.

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Your task here",
  options: {
    model: "claude-sonnet-4-5"
  }
})) {
  console.log(message);
}
```

**Parameters:**
- `prompt`: String or async iterable of messages
- `options`: Configuration object (see Key Configuration Options below)

**Returns:** Async generator yielding messages

#### `tool()`

Creates type-safe MCP tool definitions using Zod schemas for input validation and async handlers for execution logic.

```typescript
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const myTool = tool(
  "tool_name",
  "Tool description",
  {
    param1: z.string().describe("Parameter description"),
    param2: z.number().describe("Another parameter")
  },
  async (args) => {
    // Implementation
    return { content: [{ type: "text", text: "Result" }] };
  }
);
```

#### `createSdkMcpServer()`

Instantiates an MCP server running in the same process, configured with tools and version information.

```typescript
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";

const myServer = createSdkMcpServer({
  tools: [myTool, anotherTool],
  name: "my-tools",
  version: "1.0.0"
});
```

### Key Configuration Options

The `Options` type supports extensive customization via the options parameter:

```typescript
interface Options {
  // Model selection
  model?: string;  // Specify Claude model
  modelFallback?: string[];  // Fallback models

  // Tool management
  allowedTools?: string[];  // Specific tools to allow
  disallowedTools?: string[];  // Specific tools to disallow

  // Permission control
  permissionMode?: 'default' | 'acceptEdits' | 'plan' | 'bypassPermissions';
  canUseTool?: (name: string, input: unknown) => Promise<{
    behavior: 'allow' | 'deny';
    updatedInput?: unknown;
    message?: string;
  }>;

  // MCP servers
  mcpServers?: Record<string, MCPServerConfig>;

  // System prompt
  systemPrompt?: string | SystemPromptPreset;

  // Session management
  resume?: string;  // Session ID to resume
  forkSession?: boolean;  // Create new branch

  // Hooks
  hooks?: Hooks;

  // Other options
  maxTurns?: number;
  continue?: boolean;
}
```

### Message Types

The SDK returns a union of message types:

```typescript
type Message =
  | SDKSystemMessage      // Initialization and configuration
  | SDKUserMessage        // User input
  | SDKAssistantMessage   // Claude's responses
  | SDKPartialAssistantMessage  // Streaming events
  | SDKResultMessage;     // Final outcomes with usage metrics

interface SDKSystemMessage {
  type: 'system';
  subtype: 'init';
  session_id: string;
  mcp_servers: MCPServerStatus[];
}

interface SDKAssistantMessage {
  type: 'assistant';
  content: ContentBlock[];
  id: string;
  usage?: Usage;
}

interface SDKResultMessage {
  type: 'result';
  subtype: 'success' | 'error' | 'interrupted';
  result: unknown;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
    total_cost_usd?: number;
  };
}
```

### Tool Ecosystem

Built-in tools available to the agent:

**File Operations:**
- `Read` - Read file contents
- `Write` - Write to files
- `Edit` - Edit file contents
- `Glob` - Find files by pattern
- `Grep` - Search file contents

**Code Execution:**
- `Bash` - Execute shell commands
- `NotebookEdit` - Jupyter notebook operations

**Search & Web:**
- `WebSearch` - Search the internet
- `WebFetch` - Fetch web page content

**Utilities:**
- `Task` - Create and manage tasks
- MCP resource utilities

### Advanced Features

#### Hooks System

Intercept and customize behavior at various lifecycle points:

```typescript
const options = {
  hooks: {
    preToolUse: async (tool, input) => {
      console.log(`About to use tool: ${tool}`);
      return input;
    },
    postToolUse: async (tool, input, result) => {
      console.log(`Tool ${tool} completed`);
      return result;
    },
    notification: async (message) => {
      console.log(`Notification: ${message}`);
    },
    userPrompt: async (message) => {
      // Handle permission requests
      return { approved: true };
    }
  }
};
```

#### Subagents

Define specialized agents programmatically with custom prompts and tool restrictions:

```typescript
const subagentDefinition = {
  name: "security-reviewer",
  systemPrompt: "You are a security expert...",
  allowedTools: ["Read", "Grep", "WebSearch"],
  maxTurns: 5
};
```

---

## Python Agent SDK Documentation

The Python Agent SDK enables building AI agents with Python.

### Installation

```bash
pip install claude-agent-sdk
```

### Core Functions

#### `query()`

Creates a new session each time, returning an `AsyncIterator[Message]`. Best for one-off tasks without conversation history.

```python
from claude_agent_sdk import query

async def main():
    async for message in query(
        prompt="Analyze this codebase",
        options={
            "allowed_tools": ["Read", "Grep"],
            "max_turns": 5
        }
    ):
        print(message)
```

#### `ClaudeSDKClient`

Maintains session continuity across multiple exchanges, allowing Claude to remember context and supporting interrupts, hooks, and custom tools.

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async with ClaudeSDKClient() as client:
    await client.connect({
        "model": "claude-sonnet-4-5"
    })

    async for message in client.query("Your prompt"):
        print(message)

    # Change permission mode
    await client.set_permission_mode("acceptEdits")

    # Continue conversation
    async for message in client.query("Follow-up prompt"):
        print(message)
```

### Key Classes & Configuration

#### `ClaudeAgentOptions`

Primary configuration dataclass:

```python
from claude_agent_sdk import ClaudeAgentOptions

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Write", "Bash"],
    disallowed_tools=["Edit"],
    permission_mode="default",  # 'default', 'acceptEdits', 'plan', 'bypassPermissions'
    system_prompt="You are a helpful assistant",
    mcp_servers={
        "my-tools": {
            "command": "python",
            "args": ["-m", "my_mcp_server"]
        }
    },
    max_turns=10,
    hooks={
        "pre_tool_use": async_pre_tool_hook,
        "post_tool_use": async_post_tool_hook
    }
)
```

#### `ClaudeSDKClient` Methods

```python
client = ClaudeSDKClient()

# Connection management
await client.connect(options)
await client.disconnect()

# Message handling
async for message in client.query(prompt):
    pass

async for message in client.receive_messages():
    # Get messages without sending new prompt
    pass

async for message in client.receive_response(timeout=30):
    # Wait for response to previous prompt
    pass

# Session control
await client.interrupt()
await client.set_permission_mode("acceptEdits")
```

### Message & Content Types

```python
from claude_agent_sdk import (
    UserMessage, AssistantMessage, SystemMessage, ResultMessage,
    TextBlock, ThinkingBlock, ToolUseBlock, ToolResultBlock
)

# Messages
message: UserMessage = {
    "role": "user",
    "content": "Your prompt"
}

# Content blocks
text_block: TextBlock = {
    "type": "text",
    "text": "Hello"
}

tool_use: ToolUseBlock = {
    "type": "tool_use",
    "id": "tool_123",
    "name": "Read",
    "input": {"path": "/path/to/file"}
}
```

### Built-in Tools Reference

**File Operations:**
- `Bash` - Execute shell commands
- `Read` - Read file contents
- `Write` - Write to files
- `Edit` - Edit file contents
- `Glob` - Find files matching pattern
- `Grep` - Search file contents

**Search & Web:**
- `WebFetch` - Fetch web page content
- `WebSearch` - Search the internet

**Utilities:**
- `Task` - Create and manage tasks
- MCP resource utilities

### Custom Tools & MCP Servers

#### Tool Decorator

```python
from claude_agent_sdk import tool, create_sdk_mcp_server
from pydantic import BaseModel

class WeatherInput(BaseModel):
    latitude: float
    longitude: float

@tool(
    name="get_weather",
    description="Get current temperature for a location"
)
async def get_weather(latitude: float, longitude: float) -> dict:
    # Implementation
    return {"temperature": 72, "condition": "sunny"}
```

#### Create SDK MCP Server

```python
server = create_sdk_mcp_server(
    tools=[get_weather, other_tool],
    name="weather-tools",
    version="1.0.0"
)

# Use in agent options
options = ClaudeAgentOptions(
    mcp_servers={"weather": server}
)
```

### Advanced Features

#### Hooks

Intercept events like tool usage and user prompts:

```python
async def pre_tool_hook(tool_name: str, input_data: dict):
    print(f"Using tool: {tool_name}")
    return input_data

async def post_tool_hook(tool_name: str, result: dict):
    print(f"Tool result: {result}")
    return result

options = ClaudeAgentOptions(
    hooks={
        "pre_tool_use": pre_tool_hook,
        "post_tool_use": post_tool_hook
    }
)
```

#### Setting Sources

Control filesystem configuration loading:

```python
options = ClaudeAgentOptions(
    setting_sources=["user", "project", "local"]
    # Default: none (SDK isolation)
)
```

#### Subagents

Define specialized agents:

```python
from claude_agent_sdk import AgentDefinition

security_agent = AgentDefinition(
    name="security-reviewer",
    system_prompt="You are a security expert...",
    allowed_tools=["Read", "Grep"],
    max_turns=5
)
```

---

## Streaming vs Single Mode

The Claude Agent SDK provides two distinct input modes for interacting with agents.

### Streaming Input Mode (Recommended)

A persistent, interactive session that enables rich, long-lived agent interactions with full capability access.

#### Key Benefits

- **Image Uploads**: Attach images directly to messages
- **Queued Messages**: Send multiple sequential messages with interruption capability
- **Tool Integration**: Full access to all tools and custom MCP servers
- **Hooks Support**: Customize behavior at various lifecycle points
- **Real-time Feedback**: Stream responses as they generate
- **Context Persistence**: Maintain conversation context naturally across turns

#### Implementation (TypeScript)

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

  // Wait for conditions
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Follow-up with image
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

#### Implementation (Python)

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio
import base64

async def main():
    client = ClaudeSDKClient()

    async def message_generator():
        yield {
            "type": "user",
            "message": {
                "role": "user",
                "content": "Analyze this codebase"
            }
        }

        await asyncio.sleep(2)

        with open("diagram.png", "rb") as f:
            image_data = base64.b64encode(f.read()).decode()

        yield {
            "type": "user",
            "message": {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Review diagram"},
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": image_data
                        }
                    }
                ]
            }
        }

    await client.connect()
    async for message in client.query(message_generator()):
        if message["type"] == "result":
            print(message["result"])
```

### Single Message Input

A simpler approach for "one-shot queries that use session state and resuming."

#### When to Use

- One-shot responses needed
- Advanced features (images, hooks) unnecessary
- Stateless environments (e.g., Lambda functions)

#### Limitations

Single message input **does not** support:
- Direct image attachments
- Dynamic message queueing
- Real-time interruption
- Hook integration
- Natural multi-turn conversations

#### Implementation (TypeScript)

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Simple one-shot query
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

// Continue with session management
for await (const message of query({
  prompt: "Now explain the authorization process",
  options: {
    continue: true,
    maxTurns: 1
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

#### Implementation (Python)

```python
from claude_agent_sdk import query

async def main():
    # One-shot query
    async for message in query(
        prompt="Explain authentication flow",
        options={
            "max_turns": 1,
            "allowed_tools": ["Read", "Grep"]
        }
    ):
        if message["type"] == "result":
            print(message["result"])

    # Continue with session
    async for message in query(
        prompt="Explain authorization",
        options={
            "continue": True,
            "max_turns": 1
        }
    ):
        if message["type"] == "result":
            print(message["result"])
```

### Key Takeaway

Streaming input mode is recommended for most applications as it enables the agent to "operate as a long lived process that takes in user input, handles interruptions, surfaces permission requests, and handles session management."

---

## Session Management

The Claude Agent SDK provides session management to maintain conversation state across multiple interactions.

### Key Concepts

**Session Creation**: When starting a new query, the SDK automatically creates a session and returns a session ID in the initial system message.

**Session ID Retrieval**: The first message received is a system initialization message containing the session identifier that can be saved for later use.

### Getting Started with Sessions

#### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

let sessionId: string | undefined

const response = query({
  prompt: "Help me build a web application",
  options: { model: "claude-sonnet-4-5" }
})

for await (const message of response) {
  if (message.type === 'system' && message.subtype === 'init') {
    sessionId = message.session_id
    console.log(`Session started with ID: ${sessionId}`)
  }
  console.log(message)
}
```

#### Python

```python
from claude_agent_sdk import query

async def main():
    session_id = None

    async for message in query(
        prompt="Help me build a web application",
        options={"model": "claude-sonnet-4-5"}
    ):
        if message["type"] == "system" and message["subtype"] == "init":
            session_id = message["session_id"]
            print(f"Session started: {session_id}")
        print(message)
```

### Resuming Conversations

Pass a saved session ID using the `resume` option to continue from where you left off:

#### TypeScript

```typescript
const resumedResponse = query({
  prompt: "Continue implementing the authentication system",
  options: {
    resume: "session-xyz",
    model: "claude-sonnet-4-5"
  }
})

for await (const message of resumedResponse) {
  console.log(message)
}
```

#### Python

```python
async for message in query(
    prompt="Continue implementing authentication",
    options={
        "resume": "session-xyz",
        "model": "claude-sonnet-4-5"
    }
):
    print(message)
```

The SDK automatically loads conversation history and context when resuming.

### Forking Sessions

Create a branching conversation path without modifying the original session using the `forkSession` option:

#### TypeScript

```typescript
const forkedResponse = query({
  prompt: "Now let's redesign this as a GraphQL API instead",
  options: {
    resume: sessionId,
    forkSession: true,  // Creates new session ID
    model: "claude-sonnet-4-5"
  }
})

for await (const message of forkedResponse) {
  console.log(message)
}
```

#### Python

```python
async for message in query(
    prompt="Redesign as GraphQL API",
    options={
        "resume": session_id,
        "fork_session": True,
        "model": "claude-sonnet-4-5"
    }
):
    print(message)
```

### When to Fork

- Explore alternative approaches from the same starting point
- Test changes without affecting original history
- Maintain separate conversation branches for different experiments
- Create multiple discussion paths in parallel

### Comparison: Forking vs Continuing

| Feature | Continue (default) | Fork |
|---------|-------------------|------|
| Session ID | Same as original | New ID generated |
| History | Appends to original | Creates new branch |
| Original | Modified | Preserved |

---

## Permissions

The Claude Agent SDK provides four complementary mechanisms for managing tool usage and preventing unintended actions.

### Permission Modes

Four modes control how Claude uses tools:

| Mode | Behavior |
|------|----------|
| `default` | Standard permission checks apply |
| `plan` | Read-only tools only (not currently supported in SDK) |
| `acceptEdits` | Auto-approves file edits and filesystem operations |
| `bypassPermissions` | All tools execute without prompts |

### Setting Permission Modes

#### Initial Configuration (TypeScript)

```typescript
const result = await query({
  prompt: "Help me refactor this code",
  options: {
    permissionMode: 'default'
  }
});
```

#### Initial Configuration (Python)

```python
from claude_agent_sdk import query

async for message in query(
    prompt="Help me refactor this code",
    options={"permission_mode": "default"}
):
    print(message)
```

#### Dynamic Changes (Streaming Only)

**TypeScript:**
```typescript
const q = query({
  prompt: streamInput(),
  options: {
    permissionMode: 'default'
  }
});

// Change mode during session
await q.setPermissionMode('acceptEdits');
```

**Python:**
```python
client = ClaudeSDKClient()
await client.set_permission_mode('acceptEdits')
```

### Mode Behaviors

**Accept Edits Mode**: Automatically approves file edits, filesystem operations (mkdir, touch, rm, mv, cp), and file creation/deletion while requiring normal permissions for other tools.

**Bypass Permissions Mode**: "ALL tool uses are automatically approved" with no permission prompts, though hooks still execute and can block operations.

### Permission Flow Order

Processing sequence:
1. PreToolUse Hook
2. Deny Rules
3. Allow Rules
4. Ask Rules
5. Permission Mode Check
6. canUseTool Callback
7. PostToolUse Hook

### canUseTool Callback

Handles tool approval for uncovered cases:

#### TypeScript

```typescript
const result = await query({
  prompt: "Analyze this codebase",
  options: {
    canUseTool: async (toolName, input) => {
      console.log(`Tool Request: ${toolName}`);
      const approved = await getUserApproval();

      return approved
        ? { behavior: "allow", updatedInput: input }
        : { behavior: "deny", message: "User denied permission" };
    }
  }
});
```

#### Python

```python
async def can_use_tool(tool_name: str, input_data: dict) -> dict:
    print(f"Tool Request: {tool_name}")
    approved = await get_user_approval()

    if approved:
        return {"behavior": "allow", "updated_input": input_data}
    else:
        return {"behavior": "deny", "message": "User denied"}

options = ClaudeAgentOptions(
    can_use_tool=can_use_tool
)
```

### Best Practices

- Start in `default` mode for controlled execution
- Use `acceptEdits` for isolated file work
- Avoid `bypassPermissions` in production with sensitive data
- Combine modes with hooks for granular control
- Switch modes dynamically based on task confidence

---

## Custom Tools

The Claude Agent SDK enables building type-safe custom tools that extend capabilities through in-process MCP (Model Context Protocol) servers.

### Creating Tools

#### TypeScript

```typescript
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const weatherTool = tool(
  "get_weather",
  "Get current temperature for a location using coordinates",
  {
    latitude: z.number().describe("Latitude coordinate"),
    longitude: z.number().describe("Longitude coordinate")
  },
  async (args) => {
    const { latitude, longitude } = args;
    // Implementation
    const temp = await fetchWeatherData(latitude, longitude);
    return {
      content: [{
        type: "text",
        text: `Current temperature: ${temp}°F`
      }]
    };
  }
);
```

#### Python

```python
from claude_agent_sdk import tool
from pydantic import BaseModel

class WeatherInput(BaseModel):
    latitude: float
    longitude: float

@tool(
    name="get_weather",
    description="Get current temperature for a location"
)
async def get_weather(latitude: float, longitude: float) -> dict:
    # Implementation
    temp = await fetch_weather_data(latitude, longitude)
    return {
        "content": [{
            "type": "text",
            "text": f"Current temperature: {temp}°F"
        }]
    }
```

### Important Requirement

**Custom MCP tools require streaming input mode.** You must use an async generator/iterable for the `prompt` parameter.

### Tool Naming Convention

Tools follow the pattern: `mcp__{server_name}__{tool_name}`. For example, a weather tool in the "my-custom-tools" server becomes `mcp__my-custom-tools__get_weather`.

### Usage Pattern

Pass the custom server via the `mcpServers` option as an object dictionary, not an array. The `allowedTools` option controls which tools Claude can access.

#### TypeScript

```typescript
import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";

const customServer = createSdkMcpServer({
  tools: [weatherTool, anotherTool],
  name: "my-custom-tools",
  version: "1.0.0"
});

for await (const message of query({
  prompt: "What's the weather at latitude 40, longitude -74?",
  options: {
    mcpServers: {
      "my-custom-tools": customServer
    },
    allowedTools: ["mcp__my-custom-tools__get_weather"]
  }
})) {
  console.log(message);
}
```

#### Python

```python
from claude_agent_sdk import create_sdk_mcp_server, query

custom_server = create_sdk_mcp_server(
    tools=[get_weather, another_tool],
    name="my-custom-tools",
    version="1.0.0"
)

async for message in query(
    prompt="What's the weather at latitude 40, longitude -74?",
    options={
        "mcp_servers": {
            "my-custom-tools": custom_server
        },
        "allowed_tools": ["mcp__my-custom-tools__get_weather"]
    }
):
    print(message)
```

### Example Tool Categories

#### Database Query Tool

Execute SQL queries with parameter support and error handling.

#### API Gateway Tool

Make authenticated requests to external services (Stripe, GitHub, OpenAI, Slack).

#### Calculator Tool

Perform mathematical calculations and compound interest computations.

---

## MCP Integration

Extend Claude Code with custom tools using Model Context Protocol (MCP) servers. MCPs can operate as external processes, connect via HTTP/SSE, or execute directly within SDK applications.

### Configuration Methods

#### Basic Setup (.mcp.json)

MCPs are configured in `.mcp.json` at your project root:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_PATHS": "/Users/me/projects"
      }
    }
  }
}
```

#### SDK Integration

To use MCP servers within your application:

##### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "List files in my project",
  options: {
    mcpServers: {
      "filesystem": {
        command: "npx",
        args: ["@modelcontextprotocol/server-filesystem"],
        env: {
          ALLOWED_PATHS: "/Users/me/projects"
        }
      }
    },
    allowedTools: ["mcp__filesystem__list_files"]
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}
```

##### Python

```python
from claude_agent_sdk import query

async for message in query(
    prompt="List files in my project",
    options={
        "mcp_servers": {
            "filesystem": {
                "command": "npx",
                "args": ["@modelcontextprotocol/server-filesystem"],
                "env": {"ALLOWED_PATHS": "/Users/me/projects"}
            }
        },
        "allowed_tools": ["mcp__filesystem__list_files"]
    }
):
    if message["type"] == "result":
        print(message["result"])
```

### Transport Types

**stdio Servers**: External processes communicating via standard input/output for local tool execution.

**HTTP/SSE Servers**: Remote servers using network communication with header-based authentication support.

**SDK MCP Servers**: In-process servers running directly within your application (see Custom Tools guide for details).

### Authentication Approaches

#### Environment Variables

Configuration supports variable substitution with fallback defaults:

```json
{
  "mcpServers": {
    "secure-api": {
      "type": "sse",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-API-Key": "${API_KEY:-default-key}"
      }
    }
  }
}
```

#### OAuth2 Status

OAuth2 MCP authentication in-client is not currently supported according to the documentation.

### Resource Management

MCPs expose resources that Claude can discover:

#### TypeScript

```typescript
for await (const message of query({
  prompt: "What resources are available?",
  options: {
    mcpServers: {
      "database": {
        command: "npx",
        args: ["@modelcontextprotocol/server-database"]
      }
    },
    allowedTools: ["mcp__list_resources", "mcp__read_resource"]
  }
})) {
  if (message.type === "result") console.log(message.result);
}
```

#### Python

```python
async for message in query(
    prompt="What resources are available?",
    options={
        "mcp_servers": {
            "database": {
                "command": "npx",
                "args": ["@modelcontextprotocol/server-database"]
            }
        }
    }
):
    if message["type"] == "result":
        print(message["result"])
```

### Error Handling

Monitor connection status during initialization:

#### TypeScript

```typescript
if (message.type === "system" && message.subtype === "init") {
  const failedServers = message.mcp_servers.filter(
    s => s.status !== "connected"
  );
  if (failedServers.length > 0) {
    console.warn("Failed to connect:", failedServers);
  }
}
```

#### Python

```python
if message["type"] == "system" and message["subtype"] == "init":
    failed_servers = [s for s in message["mcp_servers"] if s["status"] != "connected"]
    if failed_servers:
        print(f"Failed to connect: {failed_servers}")
```

---

## Hosting the Agent SDK

The Claude Agent SDK requires a fundamentally different hosting approach than traditional stateless LLM APIs. It maintains conversational state and executes commands in persistent environments.

### Container-Based Sandboxing

The SDK must run within sandboxed containers to ensure security and isolation. This architecture provides:

- **Process isolation** - Separate execution environments per session
- **Resource limits** - CPU, memory, and storage constraints
- **Network control** - Restricted outbound connections
- **Ephemeral filesystems** - Clean state for each session

### System Requirements

Each SDK instance needs:

- **Runtime dependencies**: Python 3.10+ (Python SDK) or Node.js 18+ (TypeScript SDK), plus Claude Code CLI via `npm install -g @anthropic-ai/claude-code`
- **Resource allocation**: Minimum 1GiB RAM, 5GiB disk, 1 CPU (adjustable based on tasks)
- **Network access**: Outbound HTTPS to `api.anthropic.com` and optional MCP server access

### SDK Architecture

Unlike stateless APIs, the SDK operates as a long-running process that executes commands in persistent shell environments, manages file operations, and handles tool execution with contextual awareness from previous interactions.

### Sandbox Provider Options

Several specialized providers support AI code execution:

- Cloudflare Sandboxes
- Modal Sandboxes
- Daytona
- E2B
- Fly Machines
- Vercel Sandbox

### Four Production Deployment Patterns

#### Pattern 1: Ephemeral Sessions

Create new containers for individual user tasks, destroying them upon completion. Ideal for:
- Bug fixes
- Invoice processing
- Translation tasks
- Media transformations

```typescript
// Example: Lambda-style deployment
export async function handler(event) {
  const container = await createEphemeralContainer();
  try {
    const result = await query({
      prompt: event.prompt,
      options: { maxTurns: 1 }
    });
    return result;
  } finally {
    await container.destroy();
  }
}
```

#### Pattern 2: Long-Running Sessions

Maintain persistent container instances for ongoing work, often running multiple Claude Agent processes within each container. Suited for:
- Email agents
- Site builders
- High-frequency chatbots requiring rapid responses

#### Pattern 3: Hybrid Sessions

Ephemeral containers hydrated with history and state from databases or session resumption features. Effective for:
- Project managers
- Research tasks
- Customer support agents handling multi-interaction workflows

#### Pattern 4: Single Containers

Run multiple Claude Agent SDK processes in one global container for collaborative agents. Least common pattern due to state management complexity; primarily used in simulations and interactive environments.

### Operational Considerations

**Communication**: Expose container ports for HTTP/WebSocket endpoints while running the SDK internally.

**Costs**: Container hosting varies by provider; minimum operating cost approximately $0.05/hour.

**Idle Management**: Tune idle timeout thresholds based on expected user interaction frequency.

**Updates**: Claude Code CLI uses semantic versioning; breaking changes are version-marked.

**Monitoring**: Standard backend logging infrastructure works for container health and performance tracking.

**Session Duration**: Sessions don't timeout but setting a `maxTurns` property prevents endless loops.

### Example Deployment (TypeScript)

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
import express from "express";

const app = express();

app.post("/api/agent", async (req, res) => {
  const { prompt } = req.body;

  try {
    let result = null;

    for await (const message of query({
      prompt,
      options: {
        model: "claude-sonnet-4-5",
        maxTurns: 10
      }
    })) {
      if (message.type === "result") {
        result = message.result;
      }
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

---

## Cost Tracking

The Claude Agent SDK provides detailed token usage information for billing purposes.

### Core Concepts

**Steps vs Messages**: A step is a single request/response pair. Multiple messages can exist within one step (text, tool uses, results).

**Usage Reporting**: Token consumption data attaches to assistant messages and reports identically across all messages sharing the same ID within a step.

### Critical Rules

#### 1. Same ID = Same Usage

"All messages with the same `id` field report identical usage." When Claude sends multiple outputs in one turn, they share the message ID and usage data. Process only once per unique ID.

#### 2. Charge Once Per Step

Only charge once per step, regardless of how many individual messages appear. When multiple assistant messages share an ID, use that shared usage figure.

#### 3. Result Message Contains Cumulative Usage

The final result object includes `total_cost_usd` and aggregate token counts from the entire conversation, serving as the authoritative billing record.

### Implementation Pattern

Deduplicate by tracking processed message IDs in a Set. For each unique ID with usage data:
- Record the usage metrics
- Calculate cost using token rates
- Add to step usage array
- Only process once per ID

#### TypeScript

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const processedIds = new Set<string>();
const stepUsage = [];

for await (const message of query({
  prompt: "Your task",
  options: { model: "claude-sonnet-4-5" }
})) {
  if (message.type === "assistant" && message.usage && !processedIds.has(message.id)) {
    processedIds.add(message.id);
    stepUsage.push({
      messageId: message.id,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      cacheCreationTokens: message.usage.cache_creation_input_tokens || 0,
      cacheReadTokens: message.usage.cache_read_input_tokens || 0
    });
  }

  if (message.type === "result") {
    console.log(`Total cost: $${message.usage?.total_cost_usd}`);
    console.log(`Step usage:`, stepUsage);
  }
}
```

#### Python

```python
from claude_agent_sdk import query

processed_ids = set()
step_usage = []

async for message in query(
    prompt="Your task",
    options={"model": "claude-sonnet-4-5"}
):
    if (message["type"] == "assistant" and
        "usage" in message and
        message["id"] not in processed_ids):

        processed_ids.add(message["id"])
        step_usage.append({
            "messageId": message["id"],
            "inputTokens": message["usage"]["input_tokens"],
            "outputTokens": message["usage"]["output_tokens"],
            "cacheCreationTokens": message["usage"].get("cache_creation_input_tokens", 0),
            "cacheReadTokens": message["usage"].get("cache_read_input_tokens", 0)
        })

    if message["type"] == "result":
        print(f"Total cost: ${message['usage']['total_cost_usd']}")
        print(f"Step usage: {step_usage}")
```

### Token Types to Track

- `input_tokens`: Base input processed
- `output_tokens`: Generated tokens
- `cache_creation_input_tokens`: Cache creation
- `cache_read_input_tokens`: Cache reads
- `total_cost_usd`: Authoritative cost (result message only)

### Pricing Model

Token rates vary by model. For current pricing, consult the Anthropic pricing page.

### Edge Cases

For rare output token discrepancies across same-ID messages, use the highest value and verify against `total_cost_usd`. Report inconsistencies to the Claude Code repository.

---

## Integration Example: Complete Agent Application

Here's a complete example of building a custom coding agent with the TypeScript SDK:

```typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Define custom tools
const listProjectTool = tool(
  "list_project_structure",
  "List all files in the project directory",
  {},
  async () => {
    const files = await fs.readdir(".", { recursive: true });
    return {
      content: [{ type: "text", text: files.join("\n") }]
    };
  }
);

const runTestsTool = tool(
  "run_tests",
  "Run project tests",
  {},
  async () => {
    // Implementation would run actual tests
    return {
      content: [{ type: "text", text: "All tests passed!" }]
    };
  }
);

// Create MCP server with custom tools
const customServer = createSdkMcpServer({
  tools: [listProjectTool, runTestsTool],
  name: "project-tools",
  version: "1.0.0"
});

// Main agent function
async function runCodingAgent() {
  let sessionId: string | undefined;

  for await (const message of query({
    prompt: "Review my project and suggest improvements for code quality",
    options: {
      model: "claude-sonnet-4-5",
      mcpServers: {
        "project-tools": customServer
      },
      allowedTools: [
        "Read",
        "Write",
        "Bash",
        "mcp__project-tools__list_project_structure",
        "mcp__project-tools__run_tests"
      ],
      permissionMode: "default",
      maxTurns: 10,
      hooks: {
        preToolUse: async (toolName, input) => {
          console.log(`[TOOL] Using: ${toolName}`);
          return input;
        }
      }
    }
  })) {
    if (message.type === "system" && message.subtype === "init") {
      sessionId = message.session_id;
      console.log(`[SESSION] Started with ID: ${sessionId}`);
    }

    if (message.type === "assistant") {
      console.log(`[CLAUDE]\n${message.content.map(c =>
        c.type === "text" ? c.text : `[${c.type}]`
      ).join("\n")}`);
    }

    if (message.type === "result") {
      console.log(`[RESULT] ${message.subtype}`);
      if (message.usage) {
        console.log(`[COST] $${message.usage.total_cost_usd}`);
      }
    }
  }

  // Can resume session later
  if (sessionId) {
    console.log(`\n[RESUME] Continuing with session: ${sessionId}`);
    for await (const message of query({
      prompt: "Based on your suggestions, should I implement framework-agnostic testing?",
      options: {
        resume: sessionId,
        model: "claude-sonnet-4-5"
      }
    })) {
      if (message.type === "result") {
        console.log(`[RESULT] ${JSON.stringify(message.result)}`);
      }
    }
  }
}

// Run the agent
runCodingAgent().catch(console.error);
```

---

## Troubleshooting & Best Practices

### Common Issues

**Tool Not Found**: Ensure tool names follow the pattern `mcp__server_name__tool_name` and are included in `allowedTools`.

**Missing Session ID**: Check that the first message received is a system initialization message and extract `session_id` correctly.

**Permission Denied**: Adjust `permissionMode` or implement custom `canUseTool` callback logic.

**MCP Server Connection Failed**: Verify server configuration, environment variables, and command paths.

### Best Practices

1. **Always capture session IDs** for resumable workflows
2. **Use streaming mode** for complex interactions requiring images or interruption
3. **Implement proper error handling** in custom tools
4. **Monitor token usage** for cost control
5. **Test with `maxTurns: 1`** before enabling longer conversations
6. **Use hooks** for observability and debugging
7. **Start with `default` permission mode** and increase as needed
8. **Deduplicate usage** tracking by message ID in cost calculations

---

## Resources

- [Claude Agent SDK Overview](https://docs.claude.com/en/docs/agent-sdk/overview)
- [TypeScript SDK Reference](https://docs.claude.com/en/docs/agent-sdk/typescript)
- [Python SDK Reference](https://docs.claude.com/en/docs/agent-sdk/python)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Code Repository](https://github.com/anthropics/claude-code)
