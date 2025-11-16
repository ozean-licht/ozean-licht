# Storybook UI Design Assistant - Claude Agent SDK Implementation Plan

**Document Version:** 1.0
**Status:** Ready for Implementation
**Last Updated:** 2025-11-14
**Author:** Planner Agent

---

## Executive Summary

This plan outlines the implementation of a production-grade **conversational UI design assistant** for Storybook, replacing the existing single-request MVP with a full Claude Agent SDK integration. The system will enable designers and developers to modify components through natural language while maintaining design system compliance and real-time visual feedback.

### Key Metrics

- **Objective**: Build conversational component modification system with session persistence
- **Scope**: WebSocket server, Agent SDK integration, Redis sessions, custom MCP tools, React chat UI
- **Timeline**: 3-4 weeks (6 development milestones)
- **Complexity**: **XL** (new architecture, streaming, custom tools, session management)
- **Primary Tech Stack**: Claude Agent SDK, Node.js, WebSocket, Redis, React, TypeScript

---

## Requirements Analysis

### Functional Requirements

1. **Conversational Interface**
   - Multi-turn conversations with full context history
   - Natural language component modification instructions
   - Real-time streaming responses to user prompts
   - Session persistence across browser refreshes
   - Keyboard shortcut (Cmd+K) to activate chat panel

2. **Component Modification**
   - Agent reads current component file contents
   - Makes precise edits to React component code
   - Validates TypeScript syntax before writing
   - Triggers Vite HMR reload automatically
   - Shows visual changes within 2 seconds

3. **Design System Enforcement**
   - Agent validates color usage against Ozean Licht palette
   - Enforces typography rules (Montserrat body, Cinzel headings)
   - Applies glass morphism effects correctly
   - Suggests compliant alternatives for violations
   - Custom validation tool prevents non-compliant code

4. **Session Management**
   - Automatically saves session state to Redis
   - Resumes conversations when page is refreshed
   - Tracks conversation history for context
   - Expires sessions after 24 hours of inactivity
   - Supports parallel conversations (one per browser tab)

5. **Error Handling**
   - Gracefully handles Redis unavailability
   - Auto-reconnects WebSocket with exponential backoff
   - Provides clear user feedback on failures
   - Falls back to new sessions if resume fails
   - Logs errors for debugging

### Technical Requirements

#### Infrastructure
- **WebSocket Server**: Node.js running on port 8101 (local) / proxied on production
- **Session Storage**: Redis (existing Coolify deployment)
- **API Key**: `ANTHROPIC_API_KEY` from root `.env`
- **File System**: Read/write access to component files in `shared/ui/src/`, `apps/*/components/`

#### Performance Targets
- WebSocket connection: < 1 second
- Agent response starts streaming: < 2 seconds
- File write + HMR reload: < 2 seconds total
- Session lookup from Redis: < 100ms
- Chat UI render: < 500ms
- Memory usage: < 150MB for server process

#### Security Requirements
- Path validation: Only allow editing in whitelisted directories
- File extension whitelist: `.tsx`, `.ts`, `.jsx`, `.js` only
- TypeScript syntax validation before writes
- Rate limiting: 10 requests per minute per session
- No secrets/API keys in generated code
- Input sanitization for all user prompts

### Constraints

- **Backwards Compatibility**: Old `ai-mvp/` implementation must remain functional during migration
- **Development Only**: Agent features disabled in production Storybook builds
- **Context Limits**: Agent SDK has context window limits; use aggressive context pruning
- **File System**: Can't modify files outside component directories (security)
- **MCP Tools**: Must use streaming async generators for prompt input

### Out of Scope (Phase 2+)

- Custom component generation (not modifying existing)
- Multi-file edits in single request
- Component preview in separate iframe
- Design token generation
- Accessibility audit automation
- Component analytics/usage tracking

---

## Architecture Design

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser (Storybook)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ChatPanel Component (React)                              │  │
│  │  - Message display                                       │  │
│  │  - Input field                                           │  │
│  │  - Streaming indicator                                   │  │
│  │  - Command history                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                                      │
│           │ WebSocket                                            │
│           ▼                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  useAgentChat Hook                                        │  │
│  │  - Session management                                    │  │
│  │  - WebSocket lifecycle                                   │  │
│  │  - Reconnection logic                                    │  │
│  │  - Message buffering                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────┘
                                       │
                          WebSocket over HTTP/HTTPS
                          (wss:// in production)
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│            Agent Server (Node.js, port 8101)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WebSocket Manager                                        │  │
│  │  - Connection handling                                   │  │
│  │  - Message routing                                       │  │
│  │  - Backpressure handling                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Agent Query Manager                                      │  │
│  │  - Session resume/creation                               │  │
│  │  - Message streaming                                     │  │
│  │  - Error handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                                      │
│           ├─ Built-in Tools                                     │
│           │  (Read, Write, Glob, Grep, Edit)                   │
│           │                                                      │
│           └─ Custom MCP Tools                                   │
│              ├─ get_component_context                           │
│              ├─ validate_design_system                          │
│              └─ list_editable_components                        │
│                                                                   │
└──────────────┬──────────────────────────────────────────────────┘
               │
       ┌───────┴──────────┐
       ▼                  ▼
  ┌─────────┐      ┌──────────────┐
  │ Redis   │      │ File System  │
  │ Session │      │ Components   │
  │ Store   │      │ (read/write) │
  └─────────┘      └──────────────┘
```

### Directory Structure

```
storybook/
├── ai-agent/                          # NEW - Agent SDK integration
│   ├── server/
│   │   ├── server.ts                 # Main WebSocket + Agent server
│   │   ├── websocket-manager.ts      # WebSocket connection handling
│   │   ├── agent-query-manager.ts    # Agent SDK query management
│   │   ├── redis-session-store.ts    # Redis persistence layer
│   │   └── error-handler.ts          # Error handling utilities
│   │
│   ├── tools/
│   │   ├── custom-tools.ts           # MCP tool definitions
│   │   ├── design-validator.ts       # Ozean Licht validation
│   │   ├── component-analyzer.ts     # Component introspection
│   │   └── types.ts                  # Tool types
│   │
│   ├── client/
│   │   ├── ChatPanel.tsx             # Main chat component
│   │   ├── MessageBubble.tsx         # Single message display
│   │   ├── ChatInput.tsx             # Input field + actions
│   │   ├── LoadingIndicator.tsx      # Streaming feedback
│   │   ├── useAgentChat.ts           # WebSocket hook
│   │   ├── types.ts                  # Client types
│   │   └── utils.ts                  # Client utilities
│   │
│   ├── prompts/
│   │   ├── system-prompt.ts          # Agent system instructions
│   │   └── validators.ts             # Design system rules
│   │
│   ├── config/
│   │   ├── constants.ts              # Constants (ports, paths)
│   │   └── environment.ts            # Environment setup
│   │
│   ├── index.ts                      # Server entry point
│   ├── package.json                  # Server dependencies
│   └── README.md                     # Setup & troubleshooting
│
├── ai-mvp/                            # LEGACY - To be deprecated
│   ├── vite-plugin.ts
│   ├── client.ts
│   ├── types.ts
│   └── README.md
│
├── config/
│   ├── main.ts                       # Storybook main config (MODIFY)
│   └── preview.ts                    # Preview config (MODIFY)
│
└── mocks/
    └── [existing mocks]
```

### Component Structure Details

#### ChatPanel.tsx (Main UI)
```typescript
// Features:
// - Floating panel with glass morphism styling
// - Message list with auto-scroll
// - Input field with command history
// - Loading indicator during streaming
// - Collapsible/draggable (optional)
// - Cmd+K keyboard shortcut
```

#### useAgentChat Hook
```typescript
// Features:
// - WebSocket connection management
// - Session persistence
// - Auto-reconnect with exponential backoff
// - Message buffering during reconnection
// - Error state management
// - Query function for sending messages
```

#### Custom MCP Tools

**1. get_component_context**
```typescript
// Input: componentPath: string
// Output: {
//   name: string
//   type: 'ui' | 'composition' | 'page'
//   imports: string[]
//   exports: string[]
//   propsInterface: string
//   description: string
// }
```

**2. validate_design_system**
```typescript
// Input: code: string
// Output: {
//   compliant: boolean
//   violations: [{
//     line: number
//     type: 'color' | 'font' | 'spacing' | 'effect'
//     message: string
//     suggestion: string
//   }]
// }
```

**3. list_editable_components**
```typescript
// Input: (none)
// Output: [{
//   path: string
//   name: string
//   type: string
//   lastModified: string
// }]
```

### Data Models

#### Session Model
```typescript
interface ChatSession {
  id: string                    // Unique session ID
  agentSessionId: string        // Agent SDK session ID
  createdAt: Date
  lastAccessedAt: Date
  expiresAt: Date              // 24 hours from creation
  messages: Message[]          // Full conversation history
  metadata: {
    componentPath?: string
    lastCommand?: string
    toolsUsed: string[]
    tokenCount: number
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  streaming?: boolean          // Still receiving chunks
  error?: string              // If message failed
}
```

#### WebSocket Message Protocol
```typescript
// Client → Server
type ClientMessage =
  | { type: 'init'; sessionId?: string }
  | { type: 'query'; prompt: string; options?: QueryOptions }
  | { type: 'cancel' }
  | { type: 'ping' }

// Server → Client
type ServerMessage =
  | { type: 'session_created'; sessionId: string }
  | { type: 'session_resumed'; sessionId: string }
  | { type: 'message_start'; messageId: string }
  | { type: 'message_content'; content: string; delta?: boolean }
  | { type: 'message_complete'; messageId: string; metadata: MessageMetadata }
  | { type: 'tool_call'; tool: string; input: Record<string, any> }
  | { type: 'tool_result'; tool: string; result: string }
  | { type: 'error'; code: string; message: string }
  | { type: 'pong' }
```

### API Endpoints

#### WebSocket Server
- **Development**: `ws://localhost:8101`
- **Production**: `wss://storybook.ozean-licht.dev/ai-agent` (proxied through Nginx)

#### Health Check (Optional HTTP endpoint)
- **Endpoint**: `GET /health`
- **Response**: `{ status: 'ok', uptime: number, connections: number }`

### System Prompt

```typescript
// File: storybook/ai-agent/prompts/system-prompt.ts

export const SYSTEM_PROMPT = `You are an expert UI designer and React component specialist for the Ozean Licht design system.

## Design System Rules (CRITICAL)

### Colors
- Primary: Turquoise #0ec2bc (use for actions, accents, focus states)
- Background: Cosmic dark #0A0F1A
- Card: #1A1F2E
- Always use design system colors - NEVER hardcode arbitrary colors
- Apply opacity for subtle effects: rgba(14, 194, 188, 0.1) - 0.3

### Typography
- Body/UI: Montserrat (default)
- Headings: Cinzel Decorative (use sparingly, only for H1)
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Never use non-system fonts without explicit request

### Effects
- Glass morphism: Use backdrop-filter: blur(8px) + rgba borders
- Shadows: Use Tailwind shadow utilities with turquoise tint
- Transitions: Smooth 0.2s - 0.3s ease for interactive elements
- Glows: rgba(14, 194, 188, 0.2-0.4) box-shadow for highlights

### Component Structure
- Use Radix UI primitives as base
- Extend with Tailwind CSS utilities
- Export named component + default export
- Include PropTypes or TypeScript interface
- Maintain React best practices

## Your Responsibilities

1. **Read First**: Always read the current component code before making changes
2. **Understand Context**: Use get_component_context to understand component role
3. **Design System Compliance**: Use validate_design_system after edits
4. **Explain Changes**: Describe modifications clearly to the user
5. **Preserve Functionality**: Only change visual aspects unless user asks otherwise
6. **Test Mentally**: Verify changes make sense for the component's purpose

## Workflow for Component Modifications

1. Request component context (imports, props, purpose)
2. Read current component file
3. Make targeted edits
4. Validate against design system
5. Explain changes and reasoning
6. Ask for feedback or iterate

## Important Constraints

- Never modify imports unless necessary
- Don't add new dependencies without asking
- Keep code concise and readable
- Maintain accessibility (WCAG 2.1 AA)
- Follow existing code style in component
- Use relative positioning/sizing when possible

## What You Cannot Do

- Create entirely new components (only modify existing)
- Edit files outside component directories
- Make breaking changes to component props
- Use external CDNs or unsafe scripts
- Commit changes to git

## Design System Validation

Always check:
- [ ] Uses only Ozean Licht colors
- [ ] Typography follows guidelines
- [ ] Effects are glass morphism or subtle shadows
- [ ] Spacing is consistent with Tailwind scale
- [ ] Accessibility is maintained
- [ ] Responsive design preserved

When validation fails, suggest fixes and ask user to approve before editing.

## Response Format

Keep responses concise:
1. Brief explanation of changes (1-2 sentences)
2. Key improvements made (bullet list)
3. Ask if user wants further adjustments

Example:
"I've updated the button to include the turquoise glow effect with glass morphism background. Changes:
- Added backdrop-filter: blur(8px)
- Updated border to use #0ec2bc with 30% opacity
- Smooth transition on hover
Ready for another iteration?"
`;
```

---

## Implementation Tasks

### Phase 1: Foundation & Server Setup (3-4 days)

#### 1.1: Project Setup & Dependencies (Size: M)
- [ ] Create `storybook/ai-agent/` directory structure
- [ ] Create `storybook/ai-agent/package.json` with dependencies:
  - `@anthropic-ai/claude-agent-sdk`
  - `ws` (WebSocket)
  - `redis` (session storage)
  - `zod` (validation)
  - `typescript`
  - `@types/node`
- [ ] Install dependencies: `cd storybook/ai-agent && npm install`
- [ ] Create `tsconfig.json` for server
- [ ] Set up build scripts in `package.json`
- [ ] Create `.env` template for server configuration

**Deliverable**: Fully working TypeScript project with dependencies

#### 1.2: Redis Session Store Implementation (Size: M)
- [ ] Create `/storybook/ai-agent/server/redis-session-store.ts`
- [ ] Implement `SessionStore` class with methods:
  - `createSession(options)`: Create new session
  - `getSession(sessionId)`: Retrieve session
  - `updateSession(sessionId, updates)`: Persist changes
  - `deleteSession(sessionId)`: Clean up
  - `getAllSessions(query)`: List sessions
- [ ] Configure Redis connection (host, port, password)
- [ ] Implement TTL (24-hour expiration)
- [ ] Add graceful fallback (in-memory if Redis unavailable)
- [ ] Add connection health checks
- [ ] Error handling and retry logic

**Testing Checklist**:
- Session creation/retrieval works
- Session updates persist
- TTL expires correctly
- Fallback to in-memory works
- Connection failures handled gracefully

#### 1.3: WebSocket Server Skeleton (Size: M)
- [ ] Create `/storybook/ai-agent/server/server.ts` entry point
- [ ] Set up WebSocket server on port 8101
- [ ] Create `/storybook/ai-agent/server/websocket-manager.ts`:
  - Connection lifecycle management
  - Message routing
  - Heartbeat (ping/pong)
  - Error handling
- [ ] Implement connection tracking
- [ ] Add graceful shutdown handler
- [ ] Create health check endpoint (HTTP GET /health)
- [ ] Set up proper logging infrastructure

**Testing Checklist**:
- Server starts without errors
- WebSocket connections accepted
- Messages can be sent/received
- Heartbeat works
- Health endpoint responds

#### 1.4: Design System Validator Tool (Size: M)
- [ ] Create `/storybook/ai-agent/tools/design-validator.ts`
- [ ] Implement validation rules:
  - Color usage check (only Ozean Licht colors)
  - Typography validation (Montserrat/Cinzel only)
  - Glass morphism pattern detection
  - Spacing consistency (Tailwind scale)
- [ ] Create rule engine with configurable rules
- [ ] Add suggestion generation for violations
- [ ] Implement safe code parsing (no eval)
- [ ] Add logging for validation results

**Validation Rules**:
```typescript
{
  colors: {
    allowed: ['#0ec2bc', '#0A0F1A', '#1A1F2E', ...],
    pattern: /rgba?\(.*?\)/g,
    severity: 'error' // vs 'warning'
  },
  fonts: {
    allowed: ['Montserrat', 'Cinzel Decorative'],
    pattern: /font-family:\s*['"](.+?)['"];?/g
  },
  // ... more rules
}
```

---

### Phase 2: Agent SDK Integration (3-4 days)

#### 2.1: Custom MCP Tools Definition (Size: M)
- [ ] Create `/storybook/ai-agent/tools/custom-tools.ts`
- [ ] Implement using `createSdkMcpServer` and `tool()`:

  **Tool 1: get_component_context**
  - Input: `{ componentPath: string }`
  - Read component file
  - Extract: imports, exports, prop types, JSDoc
  - Return structured context
  - Error handling for missing files

  **Tool 2: validate_design_system**
  - Input: `{ code: string }`
  - Run design validator
  - Return violations with suggestions
  - No file I/O, pure analysis

  **Tool 3: list_editable_components**
  - Input: none
  - Scan component directories
  - Return list of component metadata
  - Cache results with TTL

- [ ] Create `/storybook/ai-agent/tools/types.ts` with TypeScript interfaces
- [ ] Add input validation with Zod schemas
- [ ] Implement error handling in tool handlers
- [ ] Add comprehensive JSDoc for each tool

**Deliverable**: Fully functional MCP server with 3 custom tools

#### 2.2: Agent Query Manager (Size: L)
- [ ] Create `/storybook/ai-agent/server/agent-query-manager.ts`
- [ ] Implement `AgentQueryManager` class:

  ```typescript
  class AgentQueryManager {
    async executeQuery(
      prompt: string,
      sessionId?: string,
      options?: QueryOptions
    ): Promise<AsyncIterable<Message>>

    async resumeSession(sessionId: string): Promise<void>

    private async *generateMessages(prompt: string)

    private formatToolResult(tool: string, result: any): string
  }
  ```

- [ ] Handle streaming with async generators
- [ ] Implement session resume with `options.resume`
- [ ] Stream responses to client in real-time
- [ ] Track token usage and costs
- [ ] Implement context management (aggressive pruning if needed)
- [ ] Handle tool calls from Agent SDK
- [ ] Add error recovery (retry logic)
- [ ] Implement timeout protection (30-60 second max)

**Features**:
- Streaming responses (delta updates)
- Tool call interception
- Session management
- Error recovery
- Timeout handling
- Cost tracking

#### 2.3: System Prompt and Configuration (Size: S)
- [ ] Create `/storybook/ai-agent/prompts/system-prompt.ts`
- [ ] Translate design system to prompt format
- [ ] Create `/storybook/ai-agent/prompts/validators.ts` with rules
- [ ] Create `/storybook/ai-agent/config/constants.ts`:
  ```typescript
  export const CONSTANTS = {
    ALLOWED_PATHS: ['shared/ui/src', 'apps/admin/components', ...],
    ALLOWED_EXTENSIONS: ['.tsx', '.ts', '.jsx', '.js'],
    RESPONSE_TIMEOUT: 60000, // 60 seconds
    SESSION_TTL: 24 * 60 * 60 * 1000, // 24 hours
    RATE_LIMIT: { requests: 10, window: 60000 },
    DESIGN_SYSTEM: { /* colors, fonts, etc */ }
  }
  ```
- [ ] Create `/storybook/ai-agent/config/environment.ts` for setup

---

### Phase 3: Client Components (3-4 days)

#### 3.1: React Chat Components (Size: L)
- [ ] Create `/storybook/ai-agent/client/ChatPanel.tsx`:
  - Floating panel with glass morphism design
  - Message list with auto-scroll
  - Input field with send button
  - Loading indicator
  - Optional: Collapse/expand, drag, etc.
  - Styling with Tailwind + Ozean Licht colors
  - Responsive design

- [ ] Create `/storybook/ai-agent/client/MessageBubble.tsx`:
  - User vs assistant styling
  - Markdown rendering for assistant messages
  - Code syntax highlighting
  - Timestamp display
  - Error message styling

- [ ] Create `/storybook/ai-agent/client/ChatInput.tsx`:
  - Text input field
  - Send button
  - Command history (arrow up/down)
  - Keyboard shortcuts (Shift+Enter for new line)
  - Character counter (optional)
  - Focus management

- [ ] Create `/storybook/ai-agent/client/LoadingIndicator.tsx`:
  - Animated spinner
  - Dots animation
  - Message like "Claude is thinking..."
  - Turquoise/glass morphism styling

**Styling Details**:
```typescript
// Glass morphism for panel
className: `
  fixed bottom-6 right-6
  w-96 h-[600px]
  bg-[#1A1F2E]/80
  backdrop-blur-lg
  border border-[#0ec2bc]/30
  rounded-lg
  shadow-lg shadow-[#0ec2bc]/20
  flex flex-col
  dark
`
```

#### 3.2: useAgentChat Hook (Size: M)
- [ ] Create `/storybook/ai-agent/client/useAgentChat.ts`
- [ ] Implement custom hook:
  ```typescript
  interface UseAgentChatReturn {
    messages: Message[]
    isLoading: boolean
    error?: string
    sessionId?: string
    query: (prompt: string) => Promise<void>
    reset: () => void
  }

  export function useAgentChat(options?: ChatOptions): UseAgentChatReturn
  ```

- [ ] WebSocket connection management:
  - Auto-connect on mount
  - Session persistence with localStorage
  - Reconnection with exponential backoff (1s, 2s, 4s, max 30s)
  - Message buffering during disconnection

- [ ] Session handling:
  - Retrieve sessionId from localStorage
  - Resume session on mount
  - Create new if none exists
  - Update localStorage on session change

- [ ] Message management:
  - Append user message immediately
  - Stream assistant chunks
  - Update message as complete
  - Handle errors gracefully

- [ ] Error handling:
  - Connection errors → retry
  - API errors → display to user
  - Timeout → retry with backoff
  - Invalid session → create new

**Deliverable**: Production-ready React hook with full lifecycle management

#### 3.3: Client Types & Utilities (Size: S)
- [ ] Create `/storybook/ai-agent/client/types.ts`:
  ```typescript
  interface Message { /* defined */ }
  interface ChatSession { /* defined */ }
  type ClientMessage = /* defined */
  type ServerMessage = /* defined */
  interface ChatOptions { /* defined */ }
  ```

- [ ] Create `/storybook/ai-agent/client/utils.ts`:
  - URL builders (WebSocket URL based on environment)
  - Timestamp formatters
  - Message parsers
  - Error serialization

#### 3.4: Storybook Integration (Size: M)
- [ ] Modify `/storybook/config/main.ts`:
  - Add Vite plugin to start Agent server in dev mode
  - Register plugin conditionally in development only
  - Configure plugin options (project root, allowed paths)
  - Set environment for Agent server

- [ ] Modify `/storybook/config/preview.ts`:
  - Add decorator to inject ChatPanel
  - Development-only injection
  - Keyboard shortcut handler (Cmd+K)
  - Session ID from localStorage
  - Error boundary for robustness

**Plugin Code Pattern**:
```typescript
// In main.ts viteFinal
if (isDev) {
  config.plugins?.push({
    name: 'agent-server',
    apply: 'serve',
    configureServer(server) {
      // Start Agent server as child process
      // Or start separately and proxy to it
    }
  })
}
```

---

### Phase 4: Testing & Validation (2-3 days)

#### 4.1: Unit Tests (Size: M)
- [ ] Create tests for Redis session store:
  - `redis-session-store.test.ts`
  - Create/retrieve/update sessions
  - TTL expiration
  - Fallback to in-memory

- [ ] Create tests for design validator:
  - `design-validator.test.ts`
  - Color validation
  - Font validation
  - Violation detection

- [ ] Create tests for custom tools:
  - `custom-tools.test.ts`
  - Component context extraction
  - Tool result formatting

- [ ] Create tests for client utilities:
  - `useAgentChat.test.tsx`
  - Hook initialization
  - Message handling
  - Error scenarios

**Test Framework**: Vitest + @testing-library/react

#### 4.2: Integration Tests (Size: M)
- [ ] WebSocket communication:
  - Client connects to server
  - Messages sent/received correctly
  - Session created
  - Heartbeat works

- [ ] Agent query execution:
  - Full query flow works end-to-end
  - Tools are called correctly
  - Results returned to client
  - Errors handled

- [ ] Component modification:
  - Agent reads component
  - Validates design system
  - Modifies code
  - Triggers HMR

**Test Tools**: ws client library, mock Agent SDK

#### 4.3: E2E Tests (Size: M)
- [ ] Playwright tests for full user flow:
  - Open Storybook
  - Activate chat with Cmd+K
  - Type prompt
  - Receive response
  - See component update

- [ ] Error scenarios:
  - Redis unavailable
  - WebSocket disconnection
  - Invalid session
  - Rate limiting

- [ ] Design system compliance:
  - Agent applies turquoise colors
  - Uses Montserrat font
  - Adds glass morphism correctly
  - Rejects non-compliant code

**Coverage Goal**: >80% of critical paths

#### 4.4: Manual Testing Checklist (Size: M)
- [ ] **Functionality**
  - [ ] Chat opens with Cmd+K
  - [ ] Messages send and display
  - [ ] Agent responses stream in real-time
  - [ ] Component updates appear in < 2s
  - [ ] Refresh page resumes conversation

- [ ] **Performance**
  - [ ] WebSocket connects < 1s
  - [ ] First response chunk < 2s
  - [ ] Memory stays < 150MB
  - [ ] No memory leaks after 30 min

- [ ] **Design System**
  - [ ] Agent uses #0ec2bc for colors
  - [ ] Montserrat font applied
  - [ ] Glass morphism effects correct
  - [ ] Rejects hardcoded colors

- [ ] **Error Handling**
  - [ ] Graceful Redis failure
  - [ ] Reconnects on network loss
  - [ ] Shows errors to user
  - [ ] Recovers from session failure

- [ ] **Accessibility**
  - [ ] Keyboard navigation works
  - [ ] Focus management correct
  - [ ] Screen reader announcements
  - [ ] Color contrast WCAG AA

---

### Phase 5: Documentation & Runbooks (1-2 days)

#### 5.1: README Files (Size: M)
- [ ] `/storybook/ai-agent/README.md`:
  - Feature overview
  - Quick start guide
  - Configuration options
  - Troubleshooting section
  - Architecture diagram

- [ ] `/storybook/ai-agent/ARCHITECTURE.md`:
  - Detailed system design
  - Data flow diagrams
  - Component interactions
  - API contracts

- [ ] `/storybook/ai-agent/DEVELOPMENT.md`:
  - Local setup instructions
  - Running server in dev mode
  - Debug logging configuration
  - Testing procedures

#### 5.2: API Documentation (Size: S)
- [ ] WebSocket protocol documentation:
  - Message types and schemas
  - Examples for each message type
  - Error codes and meanings
  - Reconnection strategy

- [ ] MCP tools documentation:
  - Tool descriptions
  - Input/output schemas
  - Examples
  - Error cases

#### 5.3: Troubleshooting Guide (Size: S)
- [ ] Common issues:
  - "Chat won't open" → Check console, Cmd+K binding
  - "Agent won't respond" → Check Redis, API key
  - "Code changes don't appear" → Check HMR, file permissions
  - "Design system validation fails" → Check color values
  - "Session doesn't persist" → Check localStorage, Redis

---

### Phase 6: Migration & Production Rollout (2-3 days)

#### 6.1: Feature Flag Implementation (Size: M)
- [ ] Add `USE_AGENT_SDK` environment variable
- [ ] Create feature flag provider in preview
- [ ] Conditionally load ChatPanel vs old AI button
- [ ] Default to old system initially
- [ ] Allow easy toggle for testing

#### 6.2: Gradual Migration (Size: M)
- [ ] Week 1: New system available (flag off by default)
- [ ] Week 2: Enable for internal testing (10% users)
- [ ] Week 3: Enable for all users (flag on by default)
- [ ] Week 4: Remove old `ai-mvp/` completely

#### 6.3: Production Deployment (Size: M)
- [ ] Configure Nginx proxy for WebSocket
- [ ] Set up HTTPS/WSS certificates
- [ ] Configure environment variables on Coolify
- [ ] Deploy agent server container
- [ ] Health checks and monitoring
- [ ] Rollback plan if issues

#### 6.4: Cleanup (Size: S)
- [ ] Remove `ai-mvp/` directory
- [ ] Clean up old configuration in `main.ts`
- [ ] Remove feature flag code
- [ ] Archive old endpoint documentation

---

## Dependencies

### Technical Dependencies

#### Server Dependencies
```json
{
  "@anthropic-ai/claude-agent-sdk": "^latest",
  "ws": "^8.16.0",
  "redis": "^4.7.0",
  "zod": "^3.22.0",
  "typescript": "^5.3.0",
  "@types/node": "^20.0.0"
}
```

#### Client Dependencies
- React (already included)
- react-hook-form (already included)
- Tailwind CSS (already included)
- Optional: `react-markdown` for message rendering
- Optional: `react-syntax-highlighter` for code blocks

#### Development Dependencies
- Vitest (already included)
- @testing-library/react (already included)
- Playwright (for E2E tests)
- Mock WebSocket library

### External Service Dependencies

1. **Claude API (via Agent SDK)**
   - Requires `ANTHROPIC_API_KEY` from root `.env`
   - Model: `claude-sonnet-4-5-20250929` (or latest)
   - Streaming enabled
   - Session support required

2. **Redis Server**
   - Existing Coolify deployment
   - Configuration: Host, port, optional password
   - Connection pooling recommended

3. **File System**
   - Read/write access to component directories
   - Must be same machine as Storybook build

### Internal Dependencies

- `/storybook/config/` - Storybook configuration
- `/shared/ui/src/` - UI components to modify
- `/apps/*/components/` - App-specific components
- `/design-system.md` - Design system reference
- MCP Gateway (optional, for future integrations)

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Agent SDK context window exhaustion** | High | High | Aggressive context pruning, maxTurns limit (5), session forking for long conversations |
| **Redis connection failures** | Medium | Medium | Fallback to in-memory sessions, graceful degradation, health checks, automatic reconnection |
| **WebSocket connection drops** | Medium | Medium | Client-side reconnection with exponential backoff (max 30s), message buffering, user notification |
| **Component file modifications break build** | Medium | High | TypeScript validation before writes, syntax checking, limited scope (component files only) |
| **Design system validator misses violations** | Medium | Medium | Human review of validator rules, agent instructions emphasize compliance, suggestion-based fixes |
| **Performance degradation under load** | Low | High | Rate limiting (10 req/min), connection pooling, timeout protection, load testing before release |
| **Memory leaks in long-running server** | Low | Medium | Proper cleanup in disconnects, session expiration, monitoring memory usage |

### Security Risks

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Path traversal attacks** | Low | High | Strict whitelist of allowed directories, path normalization, no `..` in paths |
| **Arbitrary code execution via agent** | Low | High | Limited file extensions, syntax validation, design system constraints, no `eval()` usage |
| **API key exposure** | Low | Critical | API key in root `.env` only (not in storybook/), no logging of API calls, secure storage |
| **Session hijacking** | Low | Medium | Session IDs are random UUIDs, Redis-backed (server-side only), TTL expiration |
| **Denial of Service (WebSocket)** | Medium | Medium | Rate limiting per session, connection limits, timeout protection, authentication (optional) |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Agent SDK API changes** | Low | Medium | Pin SDK version, monitor changelog, test after updates, maintain adapter layer |
| **Redis deployment issues** | Low | Medium | Graceful fallback, clear error messages, operational runbook |
| **Storybook build breakage** | Low | High | Dev-only feature, no changes to production build, thorough testing |
| **Wide context window in long sessions** | Medium | Medium | Session forking, context pruning, user notifications about session age |

### Mitigation Strategies

1. **Testing**: Comprehensive unit, integration, and E2E tests before release
2. **Monitoring**: Error tracking (Sentry), performance monitoring, API usage tracking
3. **Rollback**: Feature flag allows disabling agent SDK instantly
4. **Runbooks**: Operational documentation for common issues
5. **Gradual Rollout**: 3-week phased rollout with user feedback gates
6. **Redundancy**: Fallback to old system, in-memory sessions if Redis fails

---

## Success Criteria

### Functional Acceptance

- [x] User opens Storybook, sees floating chat panel
- [x] User types "Make button 20% bigger with glass effect"
- [x] Agent reads component file
- [x] Agent modifies code
- [x] Component updates in Storybook within 2 seconds
- [x] User sees agent explanation in chat
- [x] Refresh page resumes conversation (session persists)

### Design System Compliance

- [x] Agent applies only #0ec2bc turquoise color
- [x] Agent uses Montserrat font (no custom fonts)
- [x] Agent adds glass morphism effects correctly
- [x] Agent rejects hardcoded colors/fonts
- [x] Validation tool catches 100% of common violations
- [x] Agent suggests compliant alternatives

### Performance Targets

- [x] WebSocket connection: < 1 second
- [x] First response chunk: < 2 seconds
- [x] File write + HMR reload: < 2 seconds
- [x] Session lookup from Redis: < 100ms
- [x] Memory usage: < 150MB steady state
- [x] No memory leaks over 8-hour session

### Code Quality

- [x] Unit test coverage: > 80% of critical paths
- [x] Integration tests: All major flows covered
- [x] E2E tests: Happy path + key error scenarios
- [x] TypeScript: No `any` types (except absolute necessity)
- [x] Error handling: All paths have proper error states
- [x] Accessibility: WCAG 2.1 AA compliance

### Documentation

- [x] README with setup instructions
- [x] Architecture documentation with diagrams
- [x] API documentation (WebSocket protocol)
- [x] Troubleshooting guide (>10 common issues)
- [x] Runbook for deployment and operations
- [x] Code comments on complex sections

### Release Readiness

- [x] Feature flag working correctly
- [x] Old `ai-mvp/` still functional
- [x] Can easily switch between old and new
- [x] No breaking changes to Storybook
- [x] Production build doesn't include agent features
- [x] Rollback plan documented and tested

---

## Implementation Timeline

### Week 1: Foundation
- **Days 1-2**: Project setup, dependencies, directory structure
- **Days 3-4**: Redis session store, WebSocket server skeleton
- **Day 5**: Design system validator tool

**Deliverable**: Working WebSocket server, Redis persistence, basic validation

### Week 2: Agent Integration
- **Days 1-2**: Custom MCP tools (3 tools complete)
- **Days 3-4**: Agent query manager with streaming
- **Day 5**: System prompt and configuration

**Deliverable**: Full Agent SDK integration, streaming responses

### Week 3: Client Components
- **Days 1-2**: React chat components (ChatPanel, MessageBubble, ChatInput, Loading)
- **Days 3-4**: useAgentChat hook with WebSocket management
- **Day 5**: Storybook integration (Vite plugin, preview decorator)

**Deliverable**: Fully functional chat UI in Storybook

### Week 4: Testing & Polish
- **Days 1-2**: Unit tests (session store, validator, tools)
- **Days 3-4**: Integration and E2E tests
- **Day 5**: Manual testing, bug fixes, performance optimization

**Deliverable**: Production-quality code with test coverage

### Week 5: Documentation & Migration
- **Days 1-2**: Documentation (README, Architecture, API)
- **Days 3-4**: Feature flag, gradual rollout plan
- **Day 5**: Cleanup, final testing, release preparation

**Deliverable**: Complete documentation, migration plan, ready for production

---

## Answers to Key Questions

### Agent Server Lifecycle

**Decision**: Separate Node.js process started as child of Storybook dev server

**Rationale**:
- Isolation from Vite hot reload cycles
- Can restart independently
- Better error handling
- Easier debugging

**Implementation**:
```typescript
// In main.ts Vite plugin
configureServer(server) {
  const agentProcess = spawn('node', ['storybook/ai-agent/dist/index.js'], {
    env: { ...process.env, PORT: '8101' },
    stdio: 'inherit'
  })

  // Cleanup on server exit
  server.httpServer?.on('close', () => {
    agentProcess.kill()
  })
}
```

**Production**: Run as separate systemd service or Docker container

---

### Error Handling Strategy

**Redis Unavailable**:
- Fallback to in-memory session storage
- Log warning with clear message
- In-memory sessions don't persist across server restarts
- Session expiration still works via timers

**WebSocket Disconnect**:
- Client-side reconnection: exponential backoff (1s → 2s → 4s → 30s max)
- Buffer user messages during disconnection
- Sync buffered messages when reconnected
- User notification: "Reconnecting..." → "Connected"

**Agent SDK Timeout**:
- 60-second timeout on queries
- User prompt on timeout: "Response took too long. Retry?"
- Fallback: Show previous message, let user try again
- Don't retry automatically (could be API issue)

**Invalid Session**:
- Try to resume session
- If fails, create new session
- Preserve conversation in UI until user confirms
- Log error for debugging

---

### UI/UX Details

**Chat Panel Design**:
- Position: Fixed bottom-right corner
- Size: 384px wide (w-96), 600px tall
- Styling: Glass morphism (backdrop-filter: blur, 80% opacity bg)
- Border: 1px turquoise (#0ec2bc) with 30% opacity
- Shadow: Turquoise glow shadow

**Keyboard Shortcuts**:
- **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux): Open/focus chat
- **Shift+Enter**: New line in input
- **Escape**: Close chat panel
- **Up/Down**: Command history navigation

**Visual Feedback**:
- User message: Turquoise bubble on right
- Agent message: White text on dark card, left-aligned
- Loading: Animated dots + "Claude is thinking..."
- Error: Red background with error icon
- Success: "Component updated! Changes visible ~1s" + checkmark

**Optional Features (Phase 2+)**:
- Collapse/expand panel
- Drag to reposition
- Message edit/delete
- Export conversation as markdown

---

### Testing Strategy Summary

**Unit Tests** (>80% coverage):
- Redis session store (CRUD, TTL, fallback)
- Design validator (rule engine, violation detection)
- Custom tools (input validation, output formatting)
- Client utils (URL builders, parsers, formatters)

**Integration Tests**:
- Full WebSocket flow (connect → auth → query → response)
- Agent query execution (streaming, tool calls, results)
- Component modification (read → validate → write → HMR)

**E2E Tests** (Playwright):
- Open Storybook, activate chat, send message, see response
- Component updates appear visually
- Session persists across refresh
- Error scenarios (Redis down, disconnect, timeout)

**Manual Testing**:
- Functional checklist (all features working)
- Performance checklist (timing targets)
- Design system checklist (colors, fonts, effects)
- Accessibility checklist (keyboard, screen reader)

---

### Documentation Outline

**1. README.md** (Getting started)
- What it does
- How to use (Cmd+K, chat interface)
- Quick start for developers
- Troubleshooting common issues

**2. ARCHITECTURE.md** (Design deep-dive)
- System diagram
- Component interactions
- Data flow
- API contracts

**3. API.md** (Technical reference)
- WebSocket message protocol
- MCP tools documentation
- Tool schemas and examples
- Error codes

**4. DEVELOPMENT.md** (For contributors)
- Local setup
- Running server in dev
- Debug logging
- Testing procedures

**5. OPERATIONS.md** (For deployment)
- Deployment checklist
- Configuration options
- Monitoring setup
- Troubleshooting guide

**6. MIGRATION.md** (For rollout)
- Feature flag usage
- Phased rollout plan
- Rollback procedures
- User communication

---

## File-by-File Breakdown

### Server Files

**`storybook/ai-agent/server/server.ts`** (200 lines)
- Express app setup
- WebSocket server initialization
- Health check endpoint
- Process lifecycle management

**`storybook/ai-agent/server/websocket-manager.ts`** (250 lines)
- Connection handling
- Message routing
- Heartbeat implementation
- Error handling

**`storybook/ai-agent/server/agent-query-manager.ts`** (400 lines)
- Query execution with streaming
- Tool call handling
- Session resume
- Error recovery

**`storybook/ai-agent/server/redis-session-store.ts`** (200 lines)
- CRUD operations
- TTL management
- Fallback to in-memory
- Health checks

**`storybook/ai-agent/server/error-handler.ts`** (100 lines)
- Error types
- Formatting functions
- Recovery strategies

### Tools Files

**`storybook/ai-agent/tools/custom-tools.ts`** (300 lines)
- MCP server creation
- 3 tool implementations
- Input validation
- Result formatting

**`storybook/ai-agent/tools/design-validator.ts`** (250 lines)
- Rule engine
- Color validation
- Font validation
- Suggestion generation

**`storybook/ai-agent/tools/component-analyzer.ts`** (150 lines)
- AST parsing
- Import extraction
- Export detection
- Metadata generation

**`storybook/ai-agent/tools/types.ts`** (50 lines)
- TypeScript interfaces
- Zod schemas
- Tool result types

### Client Files

**`storybook/ai-agent/client/ChatPanel.tsx`** (250 lines)
- Main chat component
- Message list with auto-scroll
- Input field
- Glass morphism styling

**`storybook/ai-agent/client/MessageBubble.tsx`** (150 lines)
- User/assistant styling
- Markdown rendering
- Timestamp
- Error display

**`storybook/ai-agent/client/ChatInput.tsx`** (200 lines)
- Textarea input
- Send button
- Command history
- Keyboard shortcuts

**`storybook/ai-agent/client/LoadingIndicator.tsx`** (80 lines)
- Animated spinner
- "Thinking..." message
- Turquoise styling

**`storybook/ai-agent/client/useAgentChat.ts`** (300 lines)
- WebSocket hook
- Session management
- Message handling
- Error recovery

**`storybook/ai-agent/client/types.ts`** (80 lines)
- TypeScript interfaces
- Message types
- Hook types

**`storybook/ai-agent/client/utils.ts`** (100 lines)
- URL builders
- Formatters
- Parsers

### Config Files

**`storybook/ai-agent/prompts/system-prompt.ts`** (250 lines)
- Full system prompt
- Design system rules
- Workflow instructions
- Examples

**`storybook/ai-agent/config/constants.ts`** (100 lines)
- Port numbers
- Timeouts
- Rate limits
- Design system colors

**`storybook/ai-agent/config/environment.ts`** (100 lines)
- Redis config
- API key loading
- Validation

**`storybook/ai-agent/index.ts`** (50 lines)
- Entry point
- Server startup

**`storybook/ai-agent/package.json`** (30 lines)
- Dependencies
- Build scripts
- Entry point

### Integration Points

**`storybook/config/main.ts`** (MODIFY)
- Add lines 64-72: Dynamic import of agent server plugin
- Add plugin registration in viteFinal

**`storybook/config/preview.ts`** (MODIFY)
- Add decorator (lines 272+) to inject ChatPanel component
- Add Cmd+K listener in useEffect
- Load chat client script from `/ai-agent-client.js`

---

## Code Examples

### Example 1: Custom Tool Implementation

```typescript
// storybook/ai-agent/tools/custom-tools.ts
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const customTools = createSdkMcpServer({
  name: 'storybook-ui-tools',
  version: '1.0.0',
  tools: [
    tool(
      'get_component_context',
      'Get context about a React component (imports, props, description)',
      {
        componentPath: z.string().describe('Path to component file')
      },
      async (args) => {
        try {
          const code = await fs.readFile(args.componentPath, 'utf-8')

          // Extract imports
          const imports = (code.match(/^import .+ from ['"].+['"];?$/gm) || [])
            .slice(0, 5)

          // Extract interface/props (simplified)
          const propsMatch = code.match(/interface\s+(\w+)Props\s*\{[\s\S]*?\}/m)

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                name: path.basename(args.componentPath),
                imports,
                propsInterface: propsMatch?.[0] || 'No props interface found',
                description: 'React component for UI'
              }, null, 2)
            }]
          }
        } catch (error) {
          return {
            content: [{
              type: 'text',
              text: `Error reading component: ${error.message}`
            }]
          }
        }
      }
    )
  ]
})
```

### Example 2: useAgentChat Hook

```typescript
// storybook/ai-agent/client/useAgentChat.ts
import { useEffect, useRef, useState, useCallback } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface UseAgentChatReturn {
  messages: Message[]
  isLoading: boolean
  error?: string
  sessionId?: string
  query: (prompt: string) => Promise<void>
  reset: () => void
}

export function useAgentChat(): UseAgentChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [sessionId, setSessionId] = useState<string>()

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const messageBufferRef = useRef<string[]>([])

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.hostname}:8101`

        wsRef.current = new WebSocket(wsUrl)

        wsRef.current.onopen = () => {
          // Resume session or create new
          const stored = localStorage.getItem('agent-session-id')
          wsRef.current?.send(JSON.stringify({
            type: 'init',
            sessionId: stored
          }))

          // Flush message buffer
          messageBufferRef.current.forEach(msg => {
            wsRef.current?.send(msg)
          })
          messageBufferRef.current = []
        }

        wsRef.current.onmessage = (event) => {
          const msg = JSON.parse(event.data)

          if (msg.type === 'session_created' || msg.type === 'session_resumed') {
            setSessionId(msg.sessionId)
            localStorage.setItem('agent-session-id', msg.sessionId)
          } else if (msg.type === 'message_content') {
            setMessages(prev => {
              const last = prev[prev.length - 1]
              if (last?.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: last.content + msg.content }
                ]
              }
              return prev
            })
          } else if (msg.type === 'error') {
            setError(msg.message)
            setIsLoading(false)
          }
        }

        wsRef.current.onerror = () => {
          setError('Connection error')
          attemptReconnect()
        }
      } catch (err) {
        setError(`Failed to connect: ${err.message}`)
      }
    }

    connectWebSocket()

    return () => {
      wsRef.current?.close()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  const attemptReconnect = useCallback(() => {
    reconnectTimeoutRef.current = setTimeout(() => {
      wsRef.current?.close()
      // Reconnect with exponential backoff
    }, 1000)
  }, [])

  const query = useCallback(async (prompt: string) => {
    setError(undefined)
    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Add assistant placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, assistantMessage])

    // Send query
    const queryMsg = JSON.stringify({
      type: 'query',
      prompt
    })

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(queryMsg)
    } else {
      messageBufferRef.current.push(queryMsg)
    }
  }, [])

  const reset = useCallback(() => {
    setMessages([])
    setSessionId(undefined)
    localStorage.removeItem('agent-session-id')
  }, [])

  return { messages, isLoading, error, sessionId, query, reset }
}
```

### Example 3: System Prompt

```typescript
// storybook/ai-agent/prompts/system-prompt.ts
export const SYSTEM_PROMPT = `You are an expert React component designer for the Ozean Licht design system.

## Core Design Rules (MANDATORY)

### Color Palette
- Primary: #0ec2bc (Turquoise - use for all primary actions, accents, focus states)
- Background: #0A0F1A (Cosmic dark)
- Card: #1A1F2E (Card backgrounds)
- Text: #FFFFFF (Main text), #94A3B8 (Secondary)
- Errors: #EF4444 (Red)
- Success: #10B981 (Green)

RULE: Never use hardcoded colors. Always use design system values or Tailwind utilities.

### Typography
- Body/UI: Montserrat (weights: 400, 500, 600, 700)
- Headings: Cinzel Decorative (ONLY for H1, use sparingly)
- Never import custom fonts

### Effects
- Glass Morphism: backdrop-filter: blur(8px) + rgba(14, 194, 188, 0.1-0.3) border
- Shadows: Use Tailwind shadow utilities with turquoise tint
- Glows: Box-shadow: 0 0 24px rgba(14, 194, 188, 0.2)
- Animations: Smooth 0.2s-0.3s ease transitions

## Workflow

1. Always READ the component first using the built-in Read tool
2. Use get_component_context to understand component structure
3. Make minimal, focused changes
4. Validate with validate_design_system tool
5. Explain changes clearly to user

## Safety Rules

- Never modify imports (unless explicitly asked)
- Never add new dependencies
- Never break existing props interface
- Never use eval() or dynamic code generation
- Keep code readable and maintainable

## Response Format

Be concise:
1. What changed (1-2 sentences)
2. Key improvements (bullet list)
3. Ask for feedback

Example:
"Updated button with turquoise glow effect:
- Added glass morphism background
- Turquoise border with 30% opacity
- Smooth hover animation

Ready for more changes?"
`
```

---

## References

### Related Documentation
- **Design System**: `/opt/ozean-licht-ecosystem/design-system.md`
- **Context Map**: `/opt/ozean-licht-ecosystem/CONTEXT_MAP.md`
- **Agent SDK Overview**: `/opt/ozean-licht-ecosystem/ai_docs/claude-agent-sdk-overview.md`
- **Agent SDK TypeScript**: `/opt/ozean-licht-ecosystem/ai_docs/claude-agent-sdk-typescript.md`
- **Session Management**: `/opt/ozean-licht-ecosystem/ai_docs/sdk-sessions-guide.md`
- **Custom Tools**: `/opt/ozean-licht-ecosystem/ai_docs/sdk-custom-tools-guide.md`

### Component Library
- **UI Components**: `/opt/ozean-licht-ecosystem/shared/ui/src/ui/`
- **Button Example**: `/opt/ozean-licht-ecosystem/shared/ui/src/ui/button.tsx`
- **Card Example**: `/opt/ozean-licht-ecosystem/shared/ui/src/ui/card.tsx`

### Existing Implementation
- **MVP Client**: `/opt/ozean-licht-ecosystem/storybook/ai-mvp/client.ts`
- **MVP Plugin**: `/opt/ozean-licht-ecosystem/storybook/ai-mvp/vite-plugin.ts`
- **Storybook Config**: `/opt/ozean-licht-ecosystem/storybook/config/main.ts`

### Development Setup
- **Project Root**: `/opt/ozean-licht-ecosystem/`
- **Package.json**: `/opt/ozean-licht-ecosystem/package.json`
- **Storybook Scripts**: Lines 86-88 in package.json

---

## Appendix A: Redis Session Schema

```typescript
// Redis key: `agent:session:{sessionId}`
// TTL: 24 hours

interface RedisSession {
  id: string
  agentSessionId: string
  createdAt: string // ISO timestamp
  lastAccessedAt: string // ISO timestamp
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  metadata: {
    componentPath?: string
    lastCommand?: string
    toolsUsed: string[]
    tokenCount: number
    cost: number // in USD
  }
}

// Redis key: `agent:session:index:{sessionId}`
// Store for quick lookups
interface RedisSessionIndex {
  sessionId: string
  createdAt: string
  expiresAt: string
  messageCount: number
}
```

---

## Appendix B: WebSocket Protocol Specification

### Connection Flow

```
Client                          Server
  │                              │
  ├─ Connect WebSocket ────────────→
  │                              │
  │←────── Server accepts ───────┤
  │                              │
  ├─ Send: { type: 'init', sessionId?: 'xyz' } ──→
  │                              │
  │←── { type: 'session_created', sessionId: 'new' } ──
  │   (or session_resumed if sessionId was provided)
  │                              │
  │ (Connection ready)           │
  │                              │
  ├─ Send: { type: 'query', prompt: 'Make it bigger' } ──→
  │                              │
  │←── { type: 'message_start', messageId: '123' } ──
  │                              │
  │←── { type: 'message_content', content: 'I\'ll', delta: true } ──
  │←── { type: 'message_content', content: ' update', delta: true } ──
  │←── { type: 'message_content', content: ' that...', delta: true } ──
  │                              │
  │←── { type: 'tool_call', tool: 'validate_design_system' } ──
  │←── { type: 'tool_result', tool: 'validate_design_system' } ──
  │                              │
  │←── { type: 'message_complete', messageId: '123' } ──
  │                              │
  │ (New message cycle)          │
```

### Message Specifications

See WebSocket Message Protocol section in Architecture Design above.

---

## Appendix C: Design System Validation Rules

```typescript
// storybook/ai-agent/tools/design-validator.ts

export const VALIDATION_RULES = {
  colors: {
    allowed: [
      '#0ec2bc', // Primary turquoise
      '#0A0F1A', // Background
      '#1A1F2E', // Card
      '#FFFFFF', // Text
      '#94A3B8', // Secondary
      '#EF4444', // Error red
      '#10B981', // Success green
      '#F59E0B', // Warning amber
      '#3B82F6', // Info blue
    ],
    patterns: [
      /rgb\(.*?\)/, // rgb()
      /rgba\(.*?\)/, // rgba()
      /hsl\(.*?\)/, // hsl()
      /hsla\(.*?\)/, // hsla()
    ],
    severity: 'error'
  },

  fonts: {
    allowed: ['Montserrat', 'Cinzel Decorative', 'system-ui', 'sans-serif'],
    patterns: [/font-family:\s*['"]?(.+?)['"]?;/],
    severity: 'error'
  },

  effects: {
    glassMorphism: {
      required: ['backdrop-filter: blur'],
      pattern: /backdrop-filter:\s*blur\(\d+px\)/,
      severity: 'warning'
    },
    shadows: {
      allowed: ['box-shadow', 'drop-shadow'],
      pattern: /box-shadow:|drop-shadow:/,
      severity: 'info'
    }
  }
}

export function validateCode(code: string): ValidationResult {
  const violations: Violation[] = []

  // Check colors
  const colorMatches = code.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || []
  colorMatches.forEach(color => {
    if (!VALIDATION_RULES.colors.allowed.includes(color.toLowerCase())) {
      violations.push({
        type: 'color',
        message: `Hardcoded color ${color} not in design system`,
        suggestion: `Use one of: ${VALIDATION_RULES.colors.allowed.join(', ')}`
      })
    }
  })

  return {
    compliant: violations.length === 0,
    violations
  }
}
```

---

## Appendix D: Deployment Checklist

- [ ] Redis deployed and running
- [ ] `ANTHROPIC_API_KEY` set in root `.env`
- [ ] Node.js ≥18.0.0 installed
- [ ] Agent server dependencies installed
- [ ] WebSocket port 8101 open (or proxied)
- [ ] Nginx reverse proxy configured for WSS
- [ ] SSL certificates installed
- [ ] Environment variables set on Coolify
- [ ] Docker image built and tested
- [ ] Health checks configured
- [ ] Monitoring and error tracking set up
- [ ] Runbook created and tested
- [ ] Rollback plan documented
- [ ] User communication prepared

---

**Document End**

*This implementation plan is comprehensive and ready for development. Use it as the single source of truth for the Agent SDK integration. Update as you learn and discover new requirements.*
