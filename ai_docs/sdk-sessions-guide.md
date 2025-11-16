# Claude Agent SDK: Session Management

## Overview

The Claude Agent SDK provides built-in session management for maintaining conversation state across multiple interactions. Sessions automatically capture and restore full context, enabling continuous development workflows.

## How Sessions Work

When initiating a query, the SDK automatically creates a session and returns a session ID through the initial system message. This ID can be captured for later resumption.

### Session Structure

Sessions maintain:
- Complete conversation history
- Tool execution state
- Variable bindings
- File system state
- Context window management

## Getting the Session ID

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

### Capturing Session IDs

Always capture session IDs early in your application:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

class ProjectAgent {
  private sessionId: string | undefined

  async initialize(task: string) {
    const response = query({
      prompt: task,
      options: { model: "claude-sonnet-4-5" }
    })

    for await (const message of response) {
      if (message.type === 'system' && message.subtype === 'init') {
        this.sessionId = message.session_id
        // Persist session ID to database or file
        await this.saveSessionId(this.sessionId)
      }
    }
  }

  private async saveSessionId(id: string) {
    // Store in database, file, or session storage
  }
}
```

## Resuming Sessions

Use the `resume` option with a previously captured session ID to continue conversations with full context preservation.

### Basic Resume

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

### Complete Resume Example

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

interface SessionState {
  sessionId: string
  timestamp: Date
  lastPrompt: string
}

class PersistentAgent {
  async resumeWork(sessionState: SessionState) {
    console.log(`Resuming session ${sessionState.sessionId}...`)

    const response = query({
      prompt: "Continue from where we left off",
      options: {
        resume: sessionState.sessionId,
        model: "claude-sonnet-4-5",
        allowedTools: [
          "Read",
          "Edit",
          "Write",
          "Glob",
          "Grep",
          "Bash"
        ]
      }
    })

    for await (const message of response) {
      console.log(message)

      if (message.type === 'result' && message.subtype === 'success') {
        // Update session state
        sessionState.lastPrompt = "Continue from where we left off"
        sessionState.timestamp = new Date()
        await this.persistSession(sessionState)
      }
    }
  }

  private async persistSession(state: SessionState) {
    // Save to database
  }
}
```

## Forking Sessions

Create branched conversations without modifying the original by using the `forkSession` option.

### Comparison

| Aspect | Default (`forkSession: false`) | Fork (`forkSession: true`) |
|--------|------|------|
| **Session ID** | Same as original | New ID generated |
| **History** | Appends to original | New branch from resume point |
| **Original Session** | Modified | Preserved |

### When to Fork

Forking is useful for:
- Exploring alternative approaches
- Testing changes without affecting original history
- Maintaining separate experimental paths
- A/B testing agent behavior
- Recovering from unwanted decisions

### Example: Forking a Session

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

async function exploreAlternatives(sessionId: string) {
  // Fork 1: Try a different approach
  const forkedResponse1 = query({
    prompt: "Let's redesign this as a GraphQL API instead",
    options: {
      resume: sessionId,
      forkSession: true,
      model: "claude-sonnet-4-5"
    }
  })

  let fork1Result: string | undefined

  for await (const message of forkedResponse1) {
    if (message.type === 'result' && message.subtype === 'success') {
      fork1Result = message.result
      console.log("Fork 1 (GraphQL) completed")
    }
  }

  // Fork 2: Try yet another approach
  const forkedResponse2 = query({
    prompt: "Let's try gRPC instead",
    options: {
      resume: sessionId,
      forkSession: true,
      model: "claude-sonnet-4-5"
    }
  })

  let fork2Result: string | undefined

  for await (const message of forkedResponse2) {
    if (message.type === 'result' && message.subtype === 'success') {
      fork2Result = message.result
      console.log("Fork 2 (gRPC) completed")
    }
  }

  // Original session remains unchanged and resumable
  const originalContinued = query({
    prompt: "Add authentication to the REST API",
    options: {
      resume: sessionId,
      forkSession: false,
      model: "claude-sonnet-4-5"
    }
  })

  for await (const message of originalContinued) {
    if (message.type === 'result' && message.subtype === 'success') {
      console.log("Original session continued")
    }
  }

  return { fork1Result, fork2Result }
}
```

## Use Cases

### 1. Continuous Development Sessions

Maintain a session across a development day:

```typescript
const mainSessionId = "session-abc123"

// Morning: Initial planning
await query({
  prompt: "Design a new feature for file uploads",
  options: { resume: mainSessionId }
})

// Afternoon: Implementation
await query({
  prompt: "Now implement the upload handler",
  options: { resume: mainSessionId }
})

// Evening: Testing
await query({
  prompt: "Write and run tests for the upload feature",
  options: { resume: mainSessionId }
})
```

### 2. Multi-Agent Coordination

Different agents working on the same session:

```typescript
const sharedSessionId = "session-def456"

// Frontend agent
const frontendAgent = query({
  prompt: "Build the upload UI component",
  options: {
    resume: sharedSessionId,
    agents: { frontend: {...} }
  }
})

// Backend agent
const backendAgent = query({
  prompt: "Build the upload API endpoint",
  options: {
    resume: sharedSessionId,
    agents: { backend: {...} }
  }
})
```

### 3. Decision Exploration with Forks

Test multiple approaches in parallel:

```typescript
const baseSessionId = "session-ghi789"

async function compareApproaches() {
  const approaches = [
    { name: "async/await", prompt: "Implement using async/await" },
    { name: "promises", prompt: "Implement using promises" },
    { name: "generators", prompt: "Implement using generators" }
  ]

  const results = await Promise.all(
    approaches.map(async (approach) => {
      const response = query({
        prompt: approach.prompt,
        options: {
          resume: baseSessionId,
          forkSession: true,
          model: "claude-sonnet-4-5"
        }
      })

      for await (const message of response) {
        if (message.type === 'result' && message.subtype === 'success') {
          return { approach: approach.name, result: message.result }
        }
      }
    })
  )

  return results
}
```

## Session Best Practices

### 1. Store Session IDs Securely

```typescript
// Store in database with encryption
interface UserSession {
  userId: string
  sessionId: string
  createdAt: Date
  lastAccessedAt: Date
}

async function storeSession(userId: string, sessionId: string) {
  await db.sessions.create({
    userId,
    sessionId,
    createdAt: new Date(),
    lastAccessedAt: new Date()
  })
}
```

### 2. Implement Session Expiration

```typescript
async function isSessionValid(userId: string, sessionId: string) {
  const session = await db.sessions.findOne({ userId, sessionId })

  if (!session) return false

  const maxAge = 24 * 60 * 60 * 1000 // 24 hours
  const age = Date.now() - session.lastAccessedAt.getTime()

  return age < maxAge
}
```

### 3. Track Session Metadata

```typescript
interface SessionMetadata {
  sessionId: string
  startTime: Date
  tokenUsage: number
  toolsCalled: string[]
  status: 'active' | 'paused' | 'completed'
}

async function updateSessionMetadata(metadata: SessionMetadata) {
  await db.sessionMetadata.updateOne(
    { sessionId: metadata.sessionId },
    metadata
  )
}
```

### 4. Handle Session Failures

```typescript
async function resumeWithFallback(sessionId: string | undefined, fallbackPrompt: string) {
  try {
    if (sessionId) {
      const response = query({
        prompt: "Continue work",
        options: { resume: sessionId }
      })
      return response
    }
  } catch (error) {
    console.warn(`Failed to resume session ${sessionId}:`, error)
  }

  // Fallback to new session
  console.log("Starting fresh session")
  const response = query({
    prompt: fallbackPrompt,
    options: {}
  })
  return response
}
```

## Common Patterns

### Checkpoint-Based Development

```typescript
async function checkpointedDevelopment(task: string) {
  let sessionId: string | undefined

  const checkpoints = [
    "Design the architecture",
    "Implement core features",
    "Add error handling",
    "Write tests"
  ]

  for (const checkpoint of checkpoints) {
    const options = sessionId
      ? { resume: sessionId }
      : { model: "claude-sonnet-4-5" }

    const response = query({
      prompt: `${checkpoint}: ${task}`,
      options
    })

    for await (const message of response) {
      if (message.type === 'system' && message.subtype === 'init') {
        sessionId = message.session_id
      }
    }

    console.log(`Completed: ${checkpoint}`)
  }
}
```

### Branch and Merge Pattern

```typescript
async function branchAndMerge(mainSessionId: string, decision: string) {
  // Create experimental branch
  const experimentalResponse = query({
    prompt: `Try: ${decision}`,
    options: {
      resume: mainSessionId,
      forkSession: true
    }
  })

  // Review experimental results
  const experimentalResults = []
  for await (const message of experimentalResponse) {
    experimentalResults.push(message)
  }

  // If successful, continue main branch with insights
  const mergedResponse = query({
    prompt: `Based on experiments, ${decision}`,
    options: {
      resume: mainSessionId,
      forkSession: false
    }
  })

  return mergedResponse
}
```

## Session Limits and Considerations

- **No inherent timeout**: Sessions persist until explicitly ended
- **Context window**: Large sessions may approach token limits; use `maxTurns` to prevent issues
- **Storage**: Session state stored server-side by Anthropic
- **Concurrent access**: Not recommended; use forks for parallelization instead
- **Cleanup**: Old sessions consume minimal resources but should be archived for record-keeping

---

**Source**: https://docs.claude.com/en/docs/agent-sdk/sessions
