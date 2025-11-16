# Claude Agent SDK: Hosting and Deployment

## Overview

The Claude Agent SDK differs fundamentally from stateless LLM APIs. Instead of simple request-response patterns, it maintains conversational state and executes commands within a persistent environment, requiring container-based hosting infrastructure.

## Hosting Requirements

### Container-Based Sandboxing

Security and isolation demand containerized deployment with:
- Process isolation per session
- Resource constraints (CPU, memory, storage)
- Network access controls
- Ephemeral filesystems for clean states

### System Requirements

Each SDK instance needs:
- **Runtime**: Python 3.10+ or Node.js 18+
- **CLI**: `npm install -g @anthropic-ai/claude-code`
- **Resources**: 1GB RAM, 5GB disk, 1 CPU (adjustable per task)
- **Network**: Outbound HTTPS to `api.anthropic.com`
- **API Access**: Valid Anthropic API key

## Production Deployment Patterns

### Pattern 1: Ephemeral Sessions

Create containers for single tasks, destroy upon completion. Ideal for discrete operations.

**Best For:**
- Bug fixes
- Invoice processing
- Media transformation
- One-time analysis tasks
- Code review requests

**Advantages:**
- Cost-efficient (pay only for execution time)
- Clean state for each task
- No state persistence needed
- Simple error recovery

**Example Implementation:**

```typescript
// AWS Lambda with Ephemeral Container
import { query } from "@anthropic-ai/claude-agent-sdk";

export async function handler(event: any) {
  const result = await processTask(event.taskDescription);
  return result;
}

async function processTask(description: string) {
  const response = query({
    prompt: description,
    options: {
      maxTurns: 5,
      allowedTools: ['Read', 'Edit', 'Bash']
    }
  });

  const results = [];
  for await (const message of response) {
    if (message.type === 'result') {
      results.push(message);
    }
  }

  return results;
}
```

### Pattern 2: Long-Running Sessions

Maintain persistent containers with multiple Claude Agent processes. Best for proactive agents.

**Best For:**
- Email triage agents
- Site hosting agents
- High-frequency chatbots
- Continuous monitoring tasks
- Project management agents

**Advantages:**
- Persistent context across days/weeks
- Cost-effective for continuous work
- Can maintain relationships with users
- Stateful decision-making

**Example Implementation:**

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";

interface AgentState {
  sessionId: string;
  lastUpdate: Date;
  context: string;
}

class PersistentAgent {
  private state: AgentState | null = null;
  private stateFile = "/persistent/agent-state.json";

  async initialize() {
    // Load previous state if exists
    if (fs.existsSync(this.stateFile)) {
      this.state = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
    }
  }

  async processMessages(messages: string[]) {
    let sessionId = this.state?.sessionId;

    for (const message of messages) {
      const response = query({
        prompt: message,
        options: {
          resume: sessionId,
          maxTurns: 10,
          allowedTools: ['Read', 'Edit', 'Write', 'Bash']
        }
      });

      for await (const msg of response) {
        if (msg.type === 'system' && msg.subtype === 'init') {
          sessionId = msg.session_id;
        }
      }
    }

    // Save state
    this.state = {
      sessionId: sessionId!,
      lastUpdate: new Date(),
      context: 'Processing emails...'
    };

    fs.writeFileSync(this.stateFile, JSON.stringify(this.state));
  }
}

// Main loop
const agent = new PersistentAgent();
await agent.initialize();

setInterval(async () => {
  const messages = await fetchNewMessages();
  await agent.processMessages(messages);
}, 5 * 60 * 1000); // Every 5 minutes
```

### Pattern 3: Hybrid Sessions

Ephemeral containers hydrated with historical state from databases or session resumption features.

**Best For:**
- Project management agents
- Research assistants
- Customer support agents
- Complex analysis workflows

**Advantages:**
- Scalability of ephemeral containers
- Context preservation across sessions
- Cost optimization (no idle containers)
- State recovery from failures

**Example Implementation:**

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
import { Database } from "sqlite3";

interface SessionContext {
  projectId: string;
  previousSessions: string[];
  lastSessionId: string;
}

class HybridAgent {
  private db: Database;

  async processWithContext(projectId: string, task: string) {
    // Load previous context
    const context = await this.loadContext(projectId);

    // Create agent with historical context
    const contextPrompt = `
      Previous work on this project:
      ${context.previousSessions.map(s => `- ${s}`).join('\n')}

      Last session ID: ${context.lastSessionId}

      New task: ${task}
    `;

    const response = query({
      prompt: contextPrompt,
      options: {
        resume: context.lastSessionId,
        forkSession: false,
        maxTurns: 15
      }
    });

    let newSessionId: string | undefined;

    for await (const message of response) {
      if (message.type === 'system' && message.subtype === 'init') {
        newSessionId = message.session_id;
      }
    }

    // Save new session
    if (newSessionId) {
      await this.saveSession(projectId, newSessionId);
    }
  }

  private async loadContext(projectId: string): Promise<SessionContext> {
    return new Promise((resolve) => {
      this.db.get(
        'SELECT * FROM projects WHERE id = ?',
        [projectId],
        (_, row) => {
          resolve({
            projectId,
            previousSessions: JSON.parse(row.previous_sessions),
            lastSessionId: row.last_session_id
          });
        }
      );
    });
  }

  private async saveSession(projectId: string, sessionId: string) {
    // Update database with new session
  }
}
```

### Pattern 4: Single Containers

Multiple SDK processes in one container for agent collaboration.

**Note:** Least common due to state management complexity.

**Best For:**
- Simple multi-agent scenarios
- Testing agent interactions
- Resource-constrained environments

**Challenges:**
- Complex state management
- Potential resource contention
- Harder to scale
- Debugging difficulties

## Sandbox Providers

### Comparison Table

| Provider | Features | Cost | Best For |
|----------|----------|------|----------|
| **Cloudflare Sandboxes** | Serverless, global | Per-execution | Low-latency global apps |
| **Modal** | GPU support, flexible | Hourly | ML/AI workloads |
| **Daytona** | Dev-focused, local | Free tier available | Development & testing |
| **E2B** | Code execution, isolated | Per-minute | Code generation |
| **Fly Machines** | Persistent storage | Hourly | Long-running agents |
| **Vercel Sandbox** | Edge-integrated | Included | Web integrations |

### Deployment Examples

#### Cloudflare Workers

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

export default {
  async fetch(request: Request) {
    const { task } = await request.json();

    const response = query({
      prompt: task,
      options: {
        maxTurns: 3,
        allowedTools: ['Read', 'Bash']
      }
    });

    const results = [];
    for await (const message of response) {
      if (message.type === 'result') {
        results.push(message);
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

#### Fly.io Machines

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}

EXPOSE 8080

CMD ["node", "server.ts"]
```

## Key Operational Insights

### Cost Estimation

- **Per-container hourly cost:** ~$0.05/hour
- **Dominant expense:** API tokens (not compute)
- **Optimization:** Token usage > Container cost

Token usage breakdown:
- Reading files: ~100-500 tokens
- Writing code: ~500-2000 tokens
- Analysis tasks: ~2000-5000 tokens
- Complex workflows: 10,000+ tokens

### Idle Management

Idle container handling is provider-dependent:

```typescript
// Implement timeout management
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

class IdleManager {
  private lastActivity = Date.now();

  resetIdleTimer() {
    this.lastActivity = Date.now();
  }

  isIdle(): boolean {
    return Date.now() - this.lastActivity > IDLE_TIMEOUT;
  }

  async shutdownIfIdle() {
    if (this.isIdle()) {
      console.log("Shutting down due to inactivity");
      process.exit(0);
    }
  }
}

const idleManager = new IdleManager();

// Reset timer on each request
app.use((req, res, next) => {
  idleManager.resetIdleTimer();
  next();
});

// Periodic idle check
setInterval(() => {
  idleManager.shutdownIfIdle();
}, 1 * 60 * 1000); // Every minute
```

### Session Limits

- **No inherent timeout:** Sessions persist indefinitely
- **Recommended `maxTurns`:** 5-20 per query to prevent infinite loops
- **Context limits:** Monitor token usage to avoid exhausting 200K context window

### Monitoring and Logging

Leverage existing backend logging infrastructure:

```typescript
import { createClient } from "@datadog/browser-rum";

const ddRum = createClient({
  applicationId: "YOUR_APP_ID",
  clientToken: "YOUR_CLIENT_TOKEN",
  site: "datadoghq.com",
  service: "agent-sdk",
  env: "production"
});

ddRum.startSessionReplayRecording();

class MonitoredAgent {
  async executeTask(task: string) {
    ddRum.addAction("agent_task_start", { task });

    try {
      const response = query({
        prompt: task,
        options: { maxTurns: 5 }
      });

      for await (const message of response) {
        if (message.type === 'result') {
          ddRum.addAction("agent_task_complete", {
            success: true,
            result: message.result
          });
        }
      }
    } catch (error) {
      ddRum.addAction("agent_task_error", {
        success: false,
        error: error.message
      });
      throw error;
    }
  }
}
```

## Security Considerations

### API Key Management

```typescript
// Use environment variables, never hardcode
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY not set");
}

// Rotate keys regularly
// Store in secure vault (AWS Secrets Manager, Vault, etc.)
```

### Container Isolation

```dockerfile
# Run as non-root user
RUN useradd -m -u 1000 agentuser
USER agentuser

# Limit capabilities
RUN echo "agentuser soft nproc 1024" >> /etc/security/limits.conf

# Read-only filesystem where possible
RUN chmod 555 /usr/local/bin
```

### Network Access Control

```typescript
// Whitelist allowed domains
const ALLOWED_DOMAINS = [
  'api.anthropic.com',
  'api.github.com',
  'docs.example.com'
];

function validateUrl(url: string): boolean {
  const hostname = new URL(url).hostname;
  return ALLOWED_DOMAINS.some(domain => hostname.endsWith(domain));
}
```

## Scaling Strategies

### Horizontal Scaling

```typescript
// Load balancer distributes requests
// Each instance has independent sessions
// Session state stored in database

import express from 'express';
import redis from 'redis';

const app = express();
const cache = redis.createClient();

app.post('/task', async (req, res) => {
  const { projectId, task } = req.body;

  // Check existing session
  let sessionId = await cache.get(`session:${projectId}`);

  const response = query({
    prompt: task,
    options: { resume: sessionId }
  });

  for await (const message of response) {
    if (message.type === 'system' && message.subtype === 'init') {
      sessionId = message.session_id;
      await cache.set(`session:${projectId}`, sessionId);
    }
  }

  res.json({ success: true });
});

app.listen(3000);
```

### Vertical Scaling

Increase resources for single instances:

```typescript
// Adjust resource allocation
const options = {
  maxTurns: 20, // More complex tasks
  maxTokens: 100000, // Larger context
  streamingMode: 'buffered' // Less frequent updates
};
```

## Production Checklist

- [ ] API key in environment variables or secrets manager
- [ ] Logging configured (Datadog, CloudWatch, etc.)
- [ ] Error handling and retry logic implemented
- [ ] Session state persistence configured
- [ ] Rate limiting configured
- [ ] Health checks implemented
- [ ] Container image security scanning
- [ ] Network policies configured
- [ ] Monitoring dashboards set up
- [ ] Alerting configured
- [ ] Backup/recovery procedures documented
- [ ] Load testing completed

---

**Source**: https://docs.claude.com/en/docs/agent-sdk/hosting
