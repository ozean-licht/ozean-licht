# Claude Agent SDK Python Documentation

## Overview

The Claude Agent SDK for Python provides tools for building applications that interact with Claude, Anthropic's AI assistant. The SDK supports both one-off queries and multi-turn conversations with customizable behavior through tools, hooks, and configuration options.

## Core Functions

### `query()`
Creates new sessions for one-off interactions. Returns an async iterator yielding messages as they arrive. Each call starts fresh without memory of previous exchanges.

### `tool()`
Decorator for defining MCP tools with type safety, supporting simple type mapping or JSON Schema validation formats.

### `create_sdk_mcp_server()`
Establishes in-process MCP servers within Python applications with custom tool definitions.

## Primary Class: ClaudeSDKClient

The main interface for maintaining conversation sessions across multiple exchanges. Key capabilities include:

- Session continuity with context preservation
- Multi-turn conversations where Claude remembers previous messages
- Interrupt support for stopping mid-execution
- Custom tools and hooks for behavior modification
- Explicit lifecycle control

### Methods:
- `connect()` - Initiate connection with optional prompt
- `query()` - Send requests in streaming mode
- `receive_messages()` / `receive_response()` - Process Claude's output
- `interrupt()` - Stop execution mid-task
- `disconnect()` - End session

## Key Configuration: ClaudeAgentOptions

Central dataclass managing Claude Code queries with properties including:
- `allowed_tools` - Permitted tool names
- `permission_mode` - Controls tool execution authorization
- `system_prompt` - Custom or preset instructions
- `mcp_servers` - MCP server configurations
- `setting_sources` - Filesystem configuration loading

## Message Architecture

The SDK structures communication through message types:

- **UserMessage** - Input content
- **AssistantMessage** - Response with content blocks
- **SystemMessage** - Metadata information
- **ResultMessage** - Final results with cost/usage data

## Content Blocks

Messages contain structured blocks:
- TextBlock, ThinkingBlock, ToolUseBlock, ToolResultBlock

## Advanced Features

### Hooks

Hooks support intercepting events like PreToolUse, PostToolUse, and UserPromptSubmit for custom behavior modification.

### Setting Sources

Setting sources control which configurations load (user, project, local) with defaults excluding filesystem settings for SDK isolation.

## Usage Patterns

### One-Off Queries

Use `query()` for independent tasks that don't require conversation context:

```python
from anthropic_sdk import query

async for message in query("What is the weather today?"):
    # Process streamed messages
    pass
```

### Interactive Applications

Use `ClaudeSDKClient` for applications requiring conversation continuity:

```python
from anthropic_sdk import ClaudeSDKClient

client = ClaudeSDKClient()
await client.connect()

# Multi-turn conversation
async for message in client.query("First question"):
    # Process messages
    pass

async for message in client.query("Follow-up question"):
    # Claude remembers context from previous exchange
    pass

await client.disconnect()
```

## Tool Definition

Define custom tools using the `@tool()` decorator:

```python
from anthropic_sdk import tool, ClaudeSDKClient

@tool()
def get_weather(location: str) -> str:
    """Get weather for a specific location"""
    # Implementation
    return f"Weather for {location}"

# Configure client to use tool
options = ClaudeAgentOptions(
    allowed_tools=["get_weather"],
    mcp_servers=[...]
)
```

## Configuration Management

### Setting Sources

Control configuration loading with `setting_sources`:
- `user` - User-level configuration
- `project` - Project-level configuration
- `local` - Local/session configuration

SDK defaults exclude filesystem settings for isolation:

```python
options = ClaudeAgentOptions(
    setting_sources=["project", "local"]
)
```

### MCP Servers

Integrate Model Context Protocol servers:

```python
options = ClaudeAgentOptions(
    mcp_servers=[
        {
            "type": "stdio",
            "command": "path/to/server",
            "args": ["--config"]
        }
    ]
)
```

## Permission Modes

The `permission_mode` property controls tool execution authorization:
- Manual approval required for each tool call
- Automatic execution within defined constraints
- Restricted execution with specific tool allowlists

## Advanced Usage

### Interrupt Support

Stop execution mid-task:

```python
client = ClaudeSDKClient()
await client.connect()

async for message in client.query("Long running task"):
    if some_condition:
        await client.interrupt()
        break
```

### Custom Hooks

Implement custom behavior through hooks:

```python
from anthropic_sdk import PreToolUse, PostToolUse

async def on_tool_use(hook: PreToolUse):
    print(f"About to call: {hook.tool_name}")
    # Custom logic

# Register hooks with client
```

### Streaming Responses

Process streamed messages as they arrive:

```python
async for message in client.query("Your question"):
    if hasattr(message, 'text'):
        print(message.text, end="", flush=True)
```

## Message Processing

### Handling Response Content

Messages contain content blocks that represent different types of output:

```python
async for message in client.query("Query"):
    if isinstance(message, AssistantMessage):
        for block in message.content:
            if isinstance(block, TextBlock):
                print(block.text)
            elif isinstance(block, ThinkingBlock):
                print(f"Thinking: {block.thinking}")
            elif isinstance(block, ToolUseBlock):
                print(f"Using tool: {block.name}")
```

### Result Messages

Final responses include metadata:

```python
if isinstance(message, ResultMessage):
    print(f"Cost: {message.cost}")
    print(f"Usage: {message.usage}")
```

## Best Practices

1. **Use `query()` for one-off tasks** - Simpler API for independent requests
2. **Use `ClaudeSDKClient` for conversations** - Maintains context across exchanges
3. **Define tools with clear schemas** - Enables proper type validation
4. **Handle interrupts gracefully** - Support cancellation in long-running tasks
5. **Manage setting sources carefully** - Balance security with configuration flexibility
6. **Stream responses when possible** - Improves perceived performance
7. **Respect permission modes** - Follow configured authorization policies

## Error Handling

The SDK provides structured error information through exceptions:

```python
from anthropic_sdk import ClaudeSDKError

try:
    async for message in client.query("Query"):
        pass
except ClaudeSDKError as e:
    print(f"SDK Error: {e}")
```

## Lifecycle Management

Always properly manage client lifecycle:

```python
client = ClaudeSDKClient()
try:
    await client.connect()
    async for message in client.query("Your query"):
        # Process messages
        pass
finally:
    await client.disconnect()
```

## Integration with MCP

The SDK integrates seamlessly with Model Context Protocol servers:

```python
# In-process MCP server with custom tools
from anthropic_sdk import create_sdk_mcp_server

@tool()
def custom_tool(param: str) -> str:
    return f"Processed: {param}"

server = create_sdk_mcp_server()
# Register tools with server
```

## Security Considerations

- Set `permission_mode` appropriately for your use case
- Use `allowed_tools` to restrict available functionality
- Consider `setting_sources` to control configuration access
- Validate tool inputs thoroughly
- Implement appropriate error handling
