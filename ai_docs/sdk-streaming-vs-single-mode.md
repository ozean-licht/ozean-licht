# Claude Agent SDK: Streaming vs Single Message Input

## Overview

The Claude Agent SDK provides two distinct input modes for agent interaction:

1. **Streaming Input Mode** (recommended default)
2. **Single Message Input** (simpler, more limited)

## Streaming Input Mode

### Key Characteristics

Streaming input mode is the **preferred** way to use the Claude Agent SDK. It establishes a persistent, interactive session where the agent operates as a long-lived process.

### Benefits

- **Image Attachments**: Attach images directly to messages for visual analysis
- **Message Queuing**: Send multiple messages sequentially with interruption capability
- **Tool Access**: Full integration with all tools and custom MCP servers
- **Lifecycle Hooks**: Customize behavior at various points
- **Real-time Feedback**: View responses as generated
- **Context Persistence**: Maintain conversation state across turns

### TypeScript Example

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

## Single Message Input

### Use Cases

Single message input suits scenarios requiring:
- One-shot responses
- Stateless environments (e.g., Lambda functions)
- No image attachments or hooks needed

### Limitations

Single message input does **not** support:
- Direct image attachments
- Dynamic message queueing
- Real-time interruption
- Hook integration
- Multi-turn conversations naturally

### TypeScript Example

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

## Comparison Table

| Feature | Streaming | Single Message |
|---------|-----------|-----------------|
| **Image Attachments** | Yes | No |
| **Message Queuing** | Yes | No |
| **Tool Access** | All tools | Limited |
| **Real-time Interruption** | Yes | No |
| **Hooks** | Yes | No |
| **Context Persistence** | Yes | No |
| **Multi-turn Conversation** | Native | Sequential |
| **Ideal Use Case** | Interactive applications | Simple, stateless tasks |

## Recommendation

Use streaming input mode for interactive applications requiring full feature access. Reserve single message input for simple, stateless use cases where complexity isn't needed.

---

**Source**: https://docs.claude.com/en/docs/agent-sdk/streaming-vs-single-mode
