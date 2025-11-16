# Storybook Agent SDK Implementation - Quick Reference

**Full Plan**: `/opt/ozean-licht-ecosystem/specs/storybook-agent-sdk-implementation-plan.md`

---

## At a Glance

| Aspect | Details |
|--------|---------|
| **Scope** | Replace AI MVP with Claude Agent SDK integration |
| **Timeline** | 4-5 weeks (6 phases) |
| **Complexity** | XL - New architecture, streaming, custom tools |
| **Team Size** | 1-2 developers recommended |
| **Architecture** | WebSocket server (Node.js) + React client + Redis sessions |
| **Key Tech** | Claude Agent SDK, Node.js, WebSocket, Redis, React, TypeScript |

---

## Project Structure

```
storybook/ai-agent/
├── server/
│   ├── server.ts               # WebSocket + Express
│   ├── websocket-manager.ts    # Connection handling
│   ├── agent-query-manager.ts  # Agent SDK integration
│   ├── redis-session-store.ts  # Session persistence
│   └── error-handler.ts        # Error handling
├── tools/
│   ├── custom-tools.ts         # 3 MCP tools
│   ├── design-validator.ts     # Design system rules
│   ├── component-analyzer.ts   # AST parsing
│   └── types.ts                # TypeScript types
├── client/
│   ├── ChatPanel.tsx           # Main UI component
│   ├── MessageBubble.tsx       # Message display
│   ├── ChatInput.tsx           # Input field
│   ├── LoadingIndicator.tsx    # Streaming feedback
│   ├── useAgentChat.ts         # WebSocket hook
│   ├── types.ts                # Client types
│   └── utils.ts                # Utilities
├── prompts/
│   ├── system-prompt.ts        # Agent instructions
│   └── validators.ts           # Design rules
├── config/
│   ├── constants.ts            # Port, paths, limits
│   └── environment.ts          # Setup
├── index.ts                    # Entry point
├── package.json                # Dependencies
└── README.md                   # Documentation
```

---

## Key Files to Modify

1. **`storybook/config/main.ts`** (Vite plugin registration)
   - Add dynamic import of agent server
   - Register plugin in viteFinal
   - Start agent server on port 8101

2. **`storybook/config/preview.ts`** (Decorator injection)
   - Add ChatPanel component decorator
   - Inject Cmd+K shortcut handler
   - Development-only feature flag

---

## Implementation Phases

### Phase 1: Foundation (3-4 days)
- [ ] Project setup, directory structure, dependencies
- [ ] Redis session store with in-memory fallback
- [ ] WebSocket server skeleton
- [ ] Design system validator

### Phase 2: Agent Integration (3-4 days)
- [ ] 3 Custom MCP tools (get_component_context, validate_design_system, list_editable_components)
- [ ] Agent query manager with streaming
- [ ] System prompt and configuration

### Phase 3: Client Components (3-4 days)
- [ ] React chat components (ChatPanel, MessageBubble, ChatInput, LoadingIndicator)
- [ ] useAgentChat hook with WebSocket management
- [ ] Storybook integration (Vite plugin, preview decorator)

### Phase 4: Testing (2-3 days)
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests (WebSocket, agent, component modification)
- [ ] E2E tests (Playwright - full user flow)
- [ ] Manual testing checklist

### Phase 5: Documentation (1-2 days)
- [ ] README, Architecture, API documentation
- [ ] Troubleshooting guide
- [ ] Deployment runbook

### Phase 6: Migration (2-3 days)
- [ ] Feature flag implementation
- [ ] Gradual rollout plan (week 1-4)
- [ ] Production deployment
- [ ] Cleanup of old `ai-mvp/`

---

## Critical Success Criteria

### Functional
- [ ] Chat opens with Cmd+K
- [ ] Multi-turn conversations work
- [ ] Agent modifies components successfully
- [ ] Session persists across refresh
- [ ] Vite HMR updates < 2 seconds

### Design System
- [ ] Agent uses only #0ec2bc turquoise
- [ ] Montserrat font applied (no custom fonts)
- [ ] Glass morphism effects correct
- [ ] Rejects non-compliant code

### Performance
- [ ] WebSocket connect < 1s
- [ ] First response < 2s
- [ ] Memory usage < 150MB
- [ ] Session lookup < 100ms

### Quality
- [ ] Unit test coverage > 80%
- [ ] TypeScript strict mode (no `any`)
- [ ] All errors handled gracefully
- [ ] WCAG 2.1 AA accessibility

---

## Dependencies to Add

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

Optional:
- `react-markdown` (for message rendering)
- `react-syntax-highlighter` (for code blocks in chat)

---

## Key Architecture Decisions

### WebSocket Server (Port 8101)
- Separate Node.js process started by Storybook dev server
- Handles connections from browser
- Routes messages to Agent SDK
- Manages sessions via Redis

### Session Management
- **Storage**: Redis (existing Coolify deployment)
- **Fallback**: In-memory if Redis unavailable
- **TTL**: 24 hours from last access
- **Format**: Stored as JSON with conversation history

### Custom MCP Tools
```
get_component_context → Read component, extract metadata
validate_design_system → Check code against Ozean Licht rules
list_editable_components → Scan component directories
```

### Message Protocol (WebSocket)
Client → Server: `{ type: 'query', prompt: string }`
Server → Client: `{ type: 'message_content', content: string }` (streamed)

---

## Design System Rules (Critical for Agent)

### Colors
- **Primary**: #0ec2bc (turquoise - all primary actions)
- **Background**: #0A0F1A (cosmic dark)
- **Card**: #1A1F2E
- **Text**: #FFFFFF (main), #94A3B8 (secondary)

### Typography
- **Body/UI**: Montserrat (weights: 400, 500, 600, 700)
- **Headings**: Cinzel Decorative (H1 only, use sparingly)
- **Never import**: Custom fonts

### Effects
- **Glass Morphism**: `backdrop-filter: blur(8px)` + turquoise border
- **Glows**: `0 0 24px rgba(14, 194, 188, 0.2)`
- **Shadows**: Tailwind utilities with turquoise tint
- **Transitions**: 0.2s-0.3s smooth ease

---

## Risk Mitigation

### Top Risks & Solutions

| Risk | Mitigation |
|------|-----------|
| Context window exhaustion | Aggressive pruning, maxTurns=5, session forking |
| Redis unavailable | Fallback to in-memory, graceful degradation |
| WebSocket disconnect | Client reconnect (exponential backoff, max 30s) |
| Component file corruption | TypeScript validation, syntax checks, dry-run |
| API key exposure | Root `.env` only, not logged, secure storage |

---

## Testing Strategy

### Unit Tests (>80%)
- Redis session store (CRUD, TTL, fallback)
- Design validator (rules, violations, suggestions)
- Custom tools (parsing, validation, output)

### Integration Tests
- Full WebSocket flow (connect → query → response)
- Agent execution (streaming, tools, results)
- Component modification (read → validate → write)

### E2E Tests (Playwright)
- Open Storybook, Cmd+K, send message, see response
- Component updates visually
- Session persists on refresh
- Error scenarios (disconnect, timeout, Redis down)

### Manual Testing
- Functional checklist
- Performance checklist
- Design system checklist
- Accessibility checklist

---

## Environment Setup

### Root `.env` (Already exists)
```
ANTHROPIC_API_KEY=sk-...
```

### Agent Server Config
```
PORT=8101
REDIS_HOST=redis.coolify.ozean-licht.dev
REDIS_PORT=6379
REDIS_PASSWORD=...
NODE_ENV=development
DEBUG=true
```

### Feature Flag (Optional)
```
USE_AGENT_SDK=true  # Switch between old and new system
```

---

## Rollout Strategy

### Week 1: Development & Testing
- Build all components
- Comprehensive testing
- Internal QA

### Week 2: Beta Release
- Feature flag OFF by default
- Available for opt-in testing
- Monitor error tracking
- Gather feedback

### Week 3: Staged Rollout
- Feature flag ON for 10% of users
- Monitor performance metrics
- Scale to 50% if stable

### Week 4: Full Release
- Feature flag ON by default
- Monitor 24/7 for issues
- Be ready to rollback instantly

### Week 5: Cleanup
- Remove old `ai-mvp/` code
- Archive documentation
- Final performance tuning

---

## Common Commands

### Development
```bash
# Terminal 1: Start Storybook (includes agent server)
pnpm storybook

# Terminal 2: Watch server changes
cd storybook/ai-agent && npm run dev

# Terminal 3: Watch client changes (via Storybook HMR)
```

### Testing
```bash
# All tests
pnpm test

# Specific test file
pnpm test storybook/ai-agent/server/redis-session-store.test.ts

# With coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e
```

### Building
```bash
# Build server
cd storybook/ai-agent && npm run build

# Build Storybook with agent
pnpm build-storybook
```

---

## Troubleshooting Checklist

### Chat Won't Open
- [ ] Check browser console for errors
- [ ] Verify Cmd+K listener is registered
- [ ] Check Storybook is in development mode
- [ ] Look for script error in DevTools

### Agent Won't Respond
- [ ] Check `ANTHROPIC_API_KEY` is set in root `.env`
- [ ] Verify WebSocket connection is established
- [ ] Check Redis is running (or fallback in-memory mode)
- [ ] Look at server logs for errors

### Component Changes Don't Appear
- [ ] Verify file was actually written
- [ ] Check Vite HMR is working
- [ ] Look for TypeScript errors in console
- [ ] Check file permissions

### Design System Violations
- [ ] Verify validator rules are loaded
- [ ] Check agent system prompt is complete
- [ ] Look at validation tool output
- [ ] Review design-system.md for latest rules

---

## Key Metrics to Track

### Performance
- WebSocket latency (target: < 1s)
- Agent response time (target: < 2s first chunk)
- HMR reload time (target: < 2s total)
- Memory usage (target: < 150MB)
- Redis query time (target: < 100ms)

### Reliability
- Uptime (target: > 99.5%)
- Error rate (target: < 0.5%)
- Reconnect success rate (target: > 99%)
- Session recovery (target: 100%)

### Usage
- Total conversations per day
- Average message count per session
- Most used components
- Tool call frequency

---

## References

- **Full Plan**: `/opt/ozean-licht-ecosystem/specs/storybook-agent-sdk-implementation-plan.md`
- **Design System**: `/opt/ozean-licht-ecosystem/design-system.md`
- **Agent SDK Docs**: `/opt/ozean-licht-ecosystem/ai_docs/claude-agent-sdk-*.md`
- **Component Examples**: `/opt/ozean-licht-ecosystem/shared/ui/src/ui/`
- **Storybook Config**: `/opt/ozean-licht-ecosystem/storybook/config/`

---

## Next Steps

1. **Review** the full implementation plan document
2. **Validate** architecture with team
3. **Set up** development environment (Node.js, Redis local setup)
4. **Create** GitHub issues for each phase
5. **Assign** tasks to team members
6. **Begin** Phase 1: Foundation

---

*Last Updated: 2025-11-14*
*Document Version: 1.0*
