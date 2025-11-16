# TypeScript Agent SDK Reference

The TypeScript Agent SDK provides a complete API for interacting with Claude Code programmatically.

## Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Core Functions

### `query()`

The primary function for Claude interaction that creates an async generator streaming messages.

```typescript
function query({
  prompt: string | AsyncIterable<SDKUserMessage>,
  options?: Options
}): Query
```

**Parameters:**
- `prompt` - Input text or async iterable of messages
- `options` - Configuration options (optional)

**Returns:** Query object with async iteration support

### `tool()`

Creates type-safe MCP tool definitions using Zod schemas.

```typescript
function tool(definition: ToolDefinition): MCP.Tool
```

### `createSdkMcpServer()`

Establishes MCP server instances running in the same process.

```typescript
function createSdkMcpServer(config: SDKMcpServerConfig): McpServerConfig
```

## Key Configuration Options

The Options interface supports critical settings:

```typescript
interface Options {
  // Model selection: Specify Claude model or use fallback
  model?: string;

  // Tool management: Allow/disallow specific tools
  allowedTools?: string[];
  disallowedTools?: string[];

  // Permission modes: "default", "acceptEdits", "bypassPermissions", or "plan"
  permissionMode?: PermissionMode;

  // MCP servers: Configure multiple server types
  mcpServers?: McpServerConfig[];

  // Hooks: Register callbacks
  hooks?: Hooks;

  // Settings sources: Load from 'user', 'project', or 'local' filesystem
  settingsSources?: SettingSource[];
}
```

## Message Types

The SDK returns a discriminated union of message types:

### SDKAssistantMessage
Model responses containing content blocks

### SDKUserMessage
User inputs from system or user

### SDKResultMessage
Final outcomes with usage metrics:
- `duration_ms` - Execution time
- `num_turns` - Number of interaction turns
- `session_id` - Unique session identifier
- `total_cost_usd` - API costs

### SDKSystemMessage
System initialization and context

### SDKPartialAssistantMessage
Streaming events (delta updates)

## Built-in Tools

The SDK exposes 16+ integrated tools:

### File Operations
- **Read** - Read file contents
- **Write** - Write file contents
- **Edit** - Edit specific lines
- **Glob** - Pattern-based file matching

### Search/Fetch
- **WebSearch** - Internet search queries
- **WebFetch** - Fetch web content
- **Grep** - Regex-based file search

### Execution
- **Bash** - Execute shell commands with timeout and background modes
- **NotebookEdit** - Jupyter notebook cell editing

### MCP Integration
- **ListMcpResources** - Enumerate available MCP resources
- **ReadMcpResource** - Access MCP resource content

### Task Delegation
- **Task** - Subagent execution for complex operations

## Type Safety

All tool inputs and outputs are fully typed, supporting:

```typescript
// Bash execution with timeout and background modes
bash: {
  command: string;
  timeout?: number;
  background?: boolean;
}

// File operations with line-based control
edit: {
  path: string;
  oldString: string;
  newString: string;
}

// Regex-based search with contextual output
grep: {
  pattern: string;
  paths: string[];
  contextLines?: number;
}

// Jupyter notebook cell editing
notebookEdit: {
  path: string;
  cellIndex: number;
  newContent: string;
}
```

## Permission Management

The SDK provides granular permission control through:

### CanUseTool Callback
```typescript
canUseTool?: (tool: Tool, input: unknown) => Promise<boolean>
```

### PermissionUpdate Operations
Control access for:
- Rules
- Directories
- Modes

Across three setting destinations:
- 'user' - User settings
- 'project' - Project settings
- 'local' - Local settings

## Usage Examples

### Basic Query

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

async function main() {
  const messages = await query({
    prompt: 'Create a simple Hello World program'
  });

  for await (const message of messages) {
    console.log(message);
  }
}
```

### With Custom Tools

```typescript
import { query, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';

const myTool = tool({
  name: 'custom_tool',
  description: 'My custom tool',
  inputSchema: z.object({
    text: z.string()
  })
});

const messages = await query({
  prompt: 'Use the custom tool',
  options: {
    allowedTools: ['custom_tool']
  }
});
```

### With MCP Servers

```typescript
import { query, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';

const server = createSdkMcpServer({
  name: 'my-server',
  version: '1.0.0',
  tools: [myTool]
});

const messages = await query({
  prompt: 'Execute a task',
  options: {
    mcpServers: [server]
  }
});
```

### With Hooks

```typescript
const messages = await query({
  prompt: 'Do something',
  options: {
    hooks: {
      preToolUse: async (tool) => {
        console.log(`About to use tool: ${tool.name}`);
      },
      postToolUse: async (tool, result) => {
        console.log(`Tool result: ${result}`);
      }
    }
  }
});
```

## Streaming Input

Process dynamic messages using async iterables:

```typescript
async function* generatePrompts() {
  yield { type: 'user', content: 'First prompt' };
  yield { type: 'user', content: 'Second prompt' };
}

const messages = await query({
  prompt: generatePrompts(),
  options: { /* config */ }
});
```

## Error Handling

Handle errors appropriately:

```typescript
try {
  const messages = await query({
    prompt: 'Do something'
  });

  for await (const message of messages) {
    if (message.type === 'error') {
      console.error('Error:', message.error);
    }
  }
} catch (error) {
  console.error('SDK error:', error);
}
```

## Performance Considerations

### Context Management
The SDK automatically compacts context to prevent window exhaustion. Monitor context usage with ResultMessage metrics.

### Timeout Configuration
Set appropriate timeouts for bash execution:

```typescript
// Individual command timeout
bash: {
  command: 'long-running-command',
  timeout: 30000 // 30 seconds
}
```

### Background Execution
Run long-running tasks in background:

```typescript
bash: {
  command: 'background-task',
  background: true
}
```

## Advanced Features

### Session Management
Sessions are created automatically with unique IDs tracked in ResultMessage.

### Usage Tracking
Monitor API costs with `total_cost_usd` in ResultMessage.

### Permission Modes

- **default** - User approval required for actions
- **acceptEdits** - Auto-approve file edits
- **bypassPermissions** - No approval needed
- **plan** - Propose actions before execution

## Reference

For complete API details, type definitions, and examples, visit the [Claude Agent SDK documentation](https://docs.claude.com/en/docs/agent-sdk/typescript).
