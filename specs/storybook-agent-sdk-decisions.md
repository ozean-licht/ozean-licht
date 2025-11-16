# Storybook Agent SDK - Architectural Decision Records

**Purpose**: Document key architectural decisions, trade-offs, and rationales

---

## ADR-001: Use Claude Agent SDK Instead of Direct API Calls

### Status: ACCEPTED

### Decision
Use the Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) for agent functionality instead of direct Anthropic API calls or custom orchestration.

### Rationale
1. **Built-in Tools**: SDK provides Read, Write, Glob, Grep, Bash out of the box
2. **Session Management**: Automatic session creation/resumption with context preservation
3. **Streaming Support**: Native async generators for real-time response streaming
4. **MCP Integration**: Seamless integration with custom tools via Model Context Protocol
5. **Error Handling**: Built-in error recovery and context management
6. **Future-Proof**: Anthropic's official tool, actively maintained, best practices baked in

### Trade-offs
- **Pro**: Rich feature set, less custom code
- **Pro**: Better context management for long conversations
- **Con**: Larger dependency footprint
- **Con**: Learning curve for SDK API
- **Decision**: Benefits outweigh costs; investing in SDK pays dividends

### Alternative Considered
**Direct API calls** (`@anthropic-ai/sdk`):
- Simpler dependency
- Full control over request/response
- Rejected: Loses session management, built-in tools, streaming complexity

---

## ADR-002: Separate WebSocket Server Process vs Embedded

### Status: ACCEPTED

### Decision
Run Agent server as separate Node.js process (port 8101) instead of embedding in Vite dev server.

### Rationale
1. **Isolation**: Agent server independent of Vite hot reload cycles
2. **Reliability**: Server restart doesn't require Storybook restart
3. **Scaling**: Can run on different machine or container in future
4. **Debugging**: Easier to debug with separate process/logs
5. **Production**: Aligns with Docker container deployment model

### Trade-offs
- **Pro**: Clean separation of concerns
- **Pro**: Better error isolation
- **Pro**: Easier to scale/deploy
- **Con**: Adds complexity (process management, IPC)
- **Con**: Extra port to manage in dev
- **Decision**: Complexity is justified by long-term benefits

### Implementation
```typescript
// In storybook/config/main.ts viteFinal
const agentProcess = spawn('node', ['storybook/ai-agent/dist/index.js'], {
  env: { ...process.env, PORT: '8101' }
})
```

### Production
- Deploy as systemd service or Docker container
- Health checks via HTTP GET `/health`
- Graceful shutdown handling

---

## ADR-003: Redis for Session Storage with In-Memory Fallback

### Status: ACCEPTED

### Decision
Use Redis (existing Coolify deployment) for session persistence, with graceful fallback to in-memory storage if unavailable.

### Rationale
1. **Existing Infrastructure**: Redis already deployed on Coolify
2. **Scalability**: Supports multiple server instances in future
3. **Persistence**: Sessions survive server restarts
4. **TTL Support**: Redis native TTL simplifies expiration
5. **Fallback**: In-memory mode keeps development fluid without Redis

### Trade-offs
- **Pro**: Leverages existing infrastructure
- **Pro**: Best-in-class session storage
- **Con**: Adds operational dependency
- **Con**: Need Redis in development (mitigated by fallback)
- **Decision**: Benefits for production far outweigh development friction

### TTL Strategy
```typescript
// 24 hours from last access, not creation
// Extends every time session is accessed
redis.expire(`agent:session:${sessionId}`, 24 * 60 * 60)
```

### Fallback Implementation
```typescript
// If Redis connection fails
if (redis.isConnected === false) {
  sessionStore = new InMemorySessionStore()
  logger.warn('Redis unavailable - using in-memory sessions')
}
```

---

## ADR-004: Custom MCP Tools for Storybook-Specific Operations

### Status: ACCEPTED

### Decision
Create 3 custom MCP tools (`get_component_context`, `validate_design_system`, `list_editable_components`) to give agent Storybook-specific capabilities.

### Rationale
1. **Context Awareness**: Agent understands component structure before modifying
2. **Design System Compliance**: Real-time validation against Ozean Licht rules
3. **Component Discovery**: Agent can list available components to work with
4. **Type Safety**: Zod schemas for input validation
5. **Extensibility**: Easy to add more tools in Phase 2

### Tool Specifications

#### Tool 1: get_component_context
```typescript
Input: { componentPath: string }
Output: {
  name: string
  type: 'ui' | 'composition' | 'page'
  imports: string[]
  exports: string[]
  propsInterface: string
  description: string
}
```
**Purpose**: Help agent understand component before modification

#### Tool 2: validate_design_system
```typescript
Input: { code: string }
Output: {
  compliant: boolean
  violations: [{
    line?: number
    type: 'color' | 'font' | 'spacing' | 'effect'
    message: string
    suggestion: string
  }]
}
```
**Purpose**: Ensure generated code follows Ozean Licht design rules

#### Tool 3: list_editable_components
```typescript
Input: (none)
Output: [{
  path: string
  name: string
  type: string
  lastModified: string
}]
```
**Purpose**: Help agent discover which components can be modified

### Trade-offs
- **Pro**: Gives agent necessary domain knowledge
- **Pro**: Prevents invalid modifications
- **Con**: Adds tool complexity
- **Con**: Validation rules must be maintained
- **Decision**: Safety and guidance justify complexity

---

## ADR-005: Streaming Responses with Delta Updates

### Status: ACCEPTED

### Decision
Implement real-time streaming of agent responses to client using WebSocket delta updates instead of waiting for complete response.

### Rationale
1. **UX**: Immediate feedback - user sees agent "thinking"
2. **Perceived Performance**: Feels faster even if actual latency is same
3. **Interactivity**: User can see reasoning process
4. **Alignment**: Matches user expectations from ChatGPT/Claude UI
5. **Bandwidth**: Efficient use of network (streaming > batching)

### Implementation
```typescript
// Server streams chunks as they arrive from Agent SDK
for await (const message of agentQuery) {
  if (message.type === 'assistant' && message.delta) {
    ws.send(JSON.stringify({
      type: 'message_content',
      content: message.delta.text,
      delta: true
    }))
  }
}

// Client accumulates deltas into message
setMessages(prev => {
  const last = prev[prev.length - 1]
  return [
    ...prev.slice(0, -1),
    { ...last, content: last.content + delta.content }
  ]
})
```

### WebSocket Message Protocol
```typescript
// Streaming message flow
{ type: 'message_start', messageId: 'msg-123' }
{ type: 'message_content', content: 'I ', delta: true }
{ type: 'message_content', content: 'will ', delta: true }
{ type: 'message_content', content: 'update...', delta: true }
{ type: 'message_complete', messageId: 'msg-123' }
```

### Trade-offs
- **Pro**: Superior user experience
- **Pro**: Matches modern AI UI expectations
- **Con**: More complex WebSocket protocol
- **Con**: Requires delta handling on client
- **Decision**: UX benefits justify added complexity

---

## ADR-006: Keyboard Shortcut (Cmd+K) vs Button

### Status: ACCEPTED

### Decision
Use Cmd+K keyboard shortcut as primary interaction method with optional floating button.

### Rationale
1. **Accessibility**: Keyboard-first for power users
2. **Non-Intrusive**: Shortcut-activated, doesn't clutter UI
3. **Standard**: Matches VS Code, Arc browser, ChatGPT conventions
4. **Efficiency**: Faster than clicking button
5. **Optional**: Floating button available for discoverability

### Implementation
```typescript
// In preview.ts decorator
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      openChatPanel()
    }
  }

  document.addEventListener('keydown', handler)
  return () => document.removeEventListener('keydown', handler)
}, [])
```

### UX Details
- **Mac**: Cmd+K
- **Windows/Linux**: Ctrl+K
- **Escape**: Close chat
- **Shift+Enter**: New line in input
- **Up/Down**: Command history

### Trade-offs
- **Pro**: Ergonomic keyboard-first design
- **Pro**: Non-intrusive, doesn't interfere with Storybook
- **Con**: Users must discover shortcut (mitigated by docs)
- **Decision**: Standard convention wins

---

## ADR-007: Glass Morphism Chat Panel Design

### Status: ACCEPTED

### Decision
Use glass morphism design for chat panel UI to align with Ozean Licht aesthetic.

### Rationale
1. **Brand Alignment**: Matches design system's cosmic elegance
2. **Visual Hierarchy**: Floating panel stands out without feeling heavy
3. **Performance**: Backdrop filter is performant in modern browsers
4. **Accessibility**: High contrast with dark background
5. **Polish**: Elevates perception of quality

### Implementation
```css
/* Glass morphism effect */
background: rgba(26, 31, 46, 0.8);           /* Card color at 80% opacity */
backdrop-filter: blur(8px);
border: 1px solid rgba(14, 194, 188, 0.3);   /* Turquoise at 30% opacity */
box-shadow: 0 8px 32px rgba(14, 194, 188, 0.15);

/* Hover glow */
box-shadow: 0 8px 32px rgba(14, 194, 188, 0.25);
transition: all 0.3s ease;
```

### Trade-offs
- **Pro**: Aligns with design system
- **Pro**: Modern, polished appearance
- **Con**: Requires modern browser (backdrop-filter)
- **Con**: Slightly more GPU usage
- **Decision**: Acceptable for modern development UI

---

## ADR-008: Timeout Strategy (60 seconds max)

### Status: ACCEPTED

### Decision
Implement 60-second timeout on Agent queries with user-facing error and retry option.

### Rationale
1. **API Reliability**: Prevents hanging requests from long context windows
2. **User Experience**: Don't leave user waiting indefinitely
3. **Resource Management**: Prevent resource exhaustion from slow agents
4. **Graceful Degradation**: Better to fail fast than timeout
5. **Observable**: Clear error message tells user what happened

### Implementation
```typescript
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Agent query timeout')), 60000)
})

const result = await Promise.race([
  agentQuery,
  timeoutPromise
])
```

### User Experience
```
"Agent response took longer than expected (60s timeout).
This usually means the context window is full.
Try again or shorten your request."

[Retry] [Start New Conversation]
```

### Trade-offs
- **Pro**: Prevents hung connections
- **Pro**: Clear failure mode
- **Con**: Might cut off valid long-running operations
- **Decision**: 60s is reasonable for development UI

---

## ADR-009: Rate Limiting (10 requests/minute)

### Status: ACCEPTED

### Decision
Implement per-session rate limiting: 10 requests per minute per session.

### Rationale
1. **Cost Control**: Prevents runaway API usage from buggy scripts
2. **Fairness**: Prevents single user from monopolizing resources
3. **DDoS Prevention**: Limits attack surface
4. **Graceful Feedback**: User receives clear rate limit message
5. **Development Only**: Not critical for internal dev tool

### Implementation
```typescript
const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute'
})

if (!(await limiter.removeTokens(1))) {
  return ws.send(JSON.stringify({
    type: 'error',
    code: 'RATE_LIMITED',
    message: 'Rate limit exceeded: 10 requests per minute'
  }))
}
```

### Trade-offs
- **Pro**: Prevents accidental abuse
- **Pro**: Simple to understand
- **Con**: Might frustrate power users in debugging sessions
- **Decision**: Can be tuned if feedback suggests otherwise

---

## ADR-010: Design System Validator as Custom Tool vs Vite Plugin

### Status: ACCEPTED (Tool > Plugin)

### Decision
Implement design system validation as custom MCP tool (not Vite plugin or linter).

### Rationale
1. **Agent Awareness**: Agent can check its own code in real-time
2. **Consistency**: Same validator used by agent and user-facing API
3. **Flexibility**: Can evolve rules without rebuilding
4. **Integration**: Naturally fits into agent workflow
5. **Observability**: Tool calls logged for debugging

### Alternative Considered
**ESLint Plugin**:
- Would validate at build time
- Better IDE integration
- Rejected: Agent needs real-time feedback during generation

### Validation Rules
```typescript
// Colors: Only Ozean Licht palette
const colors = {
  allowed: ['#0ec2bc', '#0A0F1A', '#1A1F2E', '#FFFFFF', ...],
  pattern: /#[0-9A-Fa-f]{6}/,
  severity: 'error'
}

// Fonts: No imports of custom fonts
const fonts = {
  allowed: ['Montserrat', 'Cinzel Decorative'],
  pattern: /font-family:\s*['"](.+?)['"]/,
  severity: 'error'
}

// Effects: Glass morphism recommended
const effects = {
  glassMorphism: {
    pattern: /backdrop-filter:\s*blur/,
    severity: 'warning'
  }
}
```

### Trade-offs
- **Pro**: Agent can validate itself
- **Pro**: Dynamic rules without rebuild
- **Con**: Not part of build pipeline
- **Con**: User changes aren't pre-validated
- **Decision**: Right tool for agent; could add ESLint later

---

## ADR-011: localStorage for Session ID vs Cookies

### Status: ACCEPTED (localStorage)

### Decision
Use `localStorage` to persist session ID on client, not HTTP-only cookies.

### Rationale
1. **Simplicity**: No server-side cookie handling needed
2. **WebSocket**: HTTP-only cookies don't work with WebSocket
3. **Client Control**: User can manually clear sessions
4. **Security**: Can't be transmitted in requests (mitigates CSRF)
5. **Development**: Easier debugging (visible in DevTools)

### Implementation
```typescript
// On session created
localStorage.setItem('agent-session-id', sessionId)

// On mount
const stored = localStorage.getItem('agent-session-id')
ws.send({ type: 'init', sessionId: stored })
```

### Session Recovery Flow
```
1. User opens Storybook
2. Component mounts, reads localStorage
3. Sends sessionId to server
4. Server resumes session with full history
5. Chat continues where it left off
```

### Trade-offs
- **Pro**: Works with WebSocket
- **Pro**: Client-controlled
- **Con**: Not transmitted in requests (design choice)
- **Decision**: Right choice for development tool

---

## ADR-012: Feature Flag for Gradual Rollout

### Status: ACCEPTED

### Decision
Implement `USE_AGENT_SDK` feature flag for gradual migration from old `ai-mvp/` system.

### Rationale
1. **Safety**: Can disable agent SDK instantly if issues
2. **Testing**: Run both systems in parallel for comparison
3. **Confidence**: Gradual rollout reduces risk
4. **User Control**: Developers can choose which system
5. **Cleanup**: Clear migration path from old → new

### Implementation
```typescript
// In preview.ts decorator
const useNewSystem = process.env.USE_AGENT_SDK !== 'false'

if (useNewSystem) {
  return <ChatPanel />  // New Agent SDK system
} else {
  return <OldAIButton />  // Old MVP system
}
```

### Rollout Timeline
```
Week 1: Feature flag OFF (old system default)
Week 2: Flag OFF, new system available for opt-in
Week 3: Flag ON (10% users) with monitoring
Week 4: Flag ON (100% users) - production ready
```

### Trade-offs
- **Pro**: Instant rollback capability
- **Pro**: Reduces risk significantly
- **Con**: Code duplication temporarily
- **Con**: Adds complexity
- **Decision**: Worth it for production safety

---

## ADR-013: 24-Hour Session Expiration

### Status: ACCEPTED

### Decision
Sessions expire 24 hours after last access (not creation).

### Rationale
1. **Development Sessions**: Typical dev session is < 24 hours
2. **Resource Management**: Cleans up abandoned sessions
3. **Freshness**: Old contexts don't accumulate
4. **Memory Efficiency**: Redis doesn't grow unbounded
5. **Simplicity**: No session archive needed for development

### Implementation
```typescript
// Update TTL on every access
redis.expire(`agent:session:${sessionId}`, 24 * 60 * 60)

// Alternatively: last-access-based expiration
if (Date.now() - session.lastAccessedAt > 24 * 60 * 60 * 1000) {
  deleteSession(sessionId)
}
```

### Trade-offs
- **Pro**: Simple to understand
- **Pro**: Prevents stale context
- **Con**: Users lose history if inactive 24h (unlikely in dev)
- **Decision**: Reasonable for development tool

### Future: Production might want longer TTL or archive

---

## ADR-014: Agent System Prompt as TypeScript File

### Status: ACCEPTED

### Decision
Store agent system prompt in TypeScript file (`prompts/system-prompt.ts`) with comments, not plain text.

### Rationale
1. **Versionability**: Track changes in git with context
2. **Linting**: Catch string syntax errors early
3. **Organization**: Group with other prompt-related code
4. **Maintainability**: Comments explain design rules
5. **Reusability**: Can export for documentation

### Implementation
```typescript
// storybook/ai-agent/prompts/system-prompt.ts
export const SYSTEM_PROMPT = `
You are an expert React component designer...

## Design System Rules
- Primary color: Turquoise #0ec2bc
- ...
`

// Usage
query({
  prompt,
  systemPrompt: SYSTEM_PROMPT,
  options: { /* ... */ }
})
```

### Trade-offs
- **Pro**: Easier to maintain and track changes
- **Pro**: Can validate with TypeScript
- **Con**: Large template strings can be unwieldy
- **Decision**: Benefits outweigh downsides

---

## ADR-015: Error Handling Strategy (Fail Gracefully)

### Status: ACCEPTED

### Decision
Implement comprehensive error handling with user-facing messages and graceful degradation rather than failing fast.

### Rationale
1. **Development Workflow**: Errors shouldn't halt user work
2. **Debugging**: Clear error messages help identify issues
3. **Recovery**: Provide actionable next steps
4. **Logging**: Internal logging for support/debugging
5. **Trust**: Users trust tools that handle errors well

### Error Categories & Responses

#### Category 1: Connection Errors
```
User sees: "Lost connection. Attempting to reconnect..."
System does: Exponential backoff (1s, 2s, 4s, max 30s)
Then: Offer to start new conversation
```

#### Category 2: API Errors
```
User sees: "Agent API error: [specific error]. Try again?"
System logs: Full error with stack trace
Retry: Up to 2 times automatically, then ask user
```

#### Category 3: Validation Errors
```
User sees: "Design system validation failed: [violation]"
System suggests: "Use #0ec2bc instead of hardcoded color"
Action: Show suggestion, ask to modify
```

#### Category 4: Timeout
```
User sees: "Request took too long (60s). Context may be full."
Suggestion: "Try a simpler request or start a new conversation"
Action: Offer retry or reset
```

### Trade-offs
- **Pro**: User never blocked by errors
- **Pro**: Clear guidance on recovery
- **Con**: More error handling code to write
- **Decision**: Worth it for user experience

---

## Summary Table

| ADR | Decision | Alternative | Key Insight |
|-----|----------|-------------|------------|
| 001 | Agent SDK | Direct API | Built-in tools & sessions |
| 002 | Separate server | Embedded | Isolation beats simplicity |
| 003 | Redis + fallback | In-memory only | Scales + graceful degrades |
| 004 | Custom MCP tools | Built-in only | Agent needs domain knowledge |
| 005 | Streaming deltas | Batch responses | Better perceived performance |
| 006 | Cmd+K shortcut | Floating button | Matches user expectations |
| 007 | Glass morphism | Flat design | Aligns with brand |
| 008 | 60s timeout | No timeout | Prevent hanging requests |
| 009 | 10 req/min limit | No limit | Prevent abuse |
| 010 | Custom tool | ESLint | Agent-aware validation |
| 011 | localStorage | Cookies | Works with WebSocket |
| 012 | Feature flag | Big bang migration | Risk mitigation |
| 013 | 24h expiration | Permanent | Manage memory/context |
| 014 | TS file | Markdown | Versionable, lintable |
| 015 | Graceful errors | Fail fast | Better UX |

---

## Revisiting Decisions

These decisions should be revisited if:

1. **Agent SDK API changes significantly** (ADR-001)
2. **Performance issues arise** (ADR-002, ADR-005)
3. **Redis becomes unreliable** (ADR-003)
4. **Design rules change fundamentally** (ADR-010)
5. **User feedback contradicts assumptions** (ADR-006, ADR-012)
6. **Production requirements emerge** (ADR-013, ADR-015)

### Decision Review Process
1. Identify issue/requirement
2. Review original ADR rationale
3. Evaluate alternatives with new data
4. Document revised decision as new ADR
5. Implement changes gradually (with feature flags if needed)
6. Update this document

---

**Document Version**: 1.0
**Last Updated**: 2025-11-14
**Decisions**: 15
**Review Cadence**: Quarterly or as-needed
