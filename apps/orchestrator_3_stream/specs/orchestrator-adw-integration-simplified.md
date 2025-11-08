# Orchestrator-ADW Integration: Simplified Vision

**Date:** 2025-11-06
**Status:** Simplified Vision v2.0
**Principle:** Autonomous agents should handle complexity, not expose it

---

## 🎯 Core Mission

Transform the orchestrator from a command executor into an **intelligent task router** that:
- Understands intent, not just commands
- Routes work to the right system (ADW or direct agents)
- Maintains context across all operations
- Learns and improves continuously

---

## 🏗️ Architecture: Three Simple Layers

### 1. Intent Layer (What the user wants)
```yaml
User: "Fix issue #123"
Orchestrator: Understands this means → ADW bug workflow
```

### 2. Routing Layer (Where work happens)
```yaml
ADW Tasks: Complete workflows requiring isolation
- Feature development
- Bug fixes
- Code reviews

Direct Agent Tasks: Quick, contextual operations
- Answer questions
- Analyze code
- Generate documentation
```

### 3. Feedback Layer (What happened)
```yaml
Simple status: Started → In Progress → Complete
Key events only: Blockers, completions, failures
Actionable: Each notification includes next steps
```

---

## 💡 Key Innovation: Intent-Based Commands

Instead of exposing dozens of commands, use **natural language intent detection**:

### Traditional (Complex)
```
/adw-plan-build-test-review 123 --model heavy --skip-e2e
/team-assign builder implement-api
/analyze-impact changes
```

### Modern (Simple)
```
"Fix issue 123"           → Routes to ADW bug workflow
"Review PR 456"          → Routes to ADW review workflow
"What does this code do?" → Routes to direct agent
"Deploy to production"    → Routes to deployment workflow
```

---

## 🔄 Integration: Event-Driven Simplicity

### ADW Integration (One-Way Events)
```typescript
// ADW emits simple events
adw.emit('workflow.started', { id, type, issue })
adw.emit('workflow.progress', { id, phase, percent })
adw.emit('workflow.complete', { id, result, artifacts })

// Orchestrator subscribes and updates UI
orchestrator.on('workflow.*', updateUI)
```

### No Complex State Management
- ADW manages its own state
- Orchestrator only tracks what's needed for UI
- No bidirectional sync complexity

---

## 🎨 User Experience: Invisible Complexity

### What Users See
1. **Single Input** - Natural language or issue number
2. **Smart Routing** - System decides ADW vs direct execution
3. **Live Progress** - Simple status updates
4. **Clear Results** - What was done, what's next

### What Users Don't See
- Worktree management
- Port allocation
- Agent coordination
- Resource scheduling
- Memory updates

---

## 📊 Implementation: Start Small, Learn Fast

### Phase 1: Basic Routing (Week 1)
```typescript
class Orchestrator {
  async route(input: string) {
    const intent = await detectIntent(input)

    if (intent.requiresIsolation) {
      return await spawnADW(intent)
    } else {
      return await executeDirectly(intent)
    }
  }
}
```

### Phase 2: Event Pipeline (Week 2)
- Connect ADW event emitter
- Add progress tracking
- Show in UI

### Phase 3: Learn & Adapt (Week 3+)
- Track what users actually do
- Optimize common patterns
- Add intelligence gradually

---

## 🚀 Success = Simplicity

### Metrics That Matter
1. **Time to Intent** - How fast from thought to execution?
2. **Completion Rate** - Do tasks finish without intervention?
3. **User Friction** - How many retries/clarifications needed?

### Anti-Metrics (What We Don't Care About)
- Number of features
- Command coverage
- Configuration options

---

## 🧠 Agentic Principles

### 1. Autonomy First
Agents should figure out the "how" - users only provide the "what"

### 2. Context Awareness
System maintains context so users don't have to

### 3. Progressive Intelligence
Start simple, learn from usage, improve autonomously

### 4. Failure Recovery
Agents handle their own failures, only escalate when truly blocked

---

## 🔮 Future: Natural Evolution

As the system learns:
1. **Predictive Execution** - "You usually fix bugs after standup"
2. **Batch Intelligence** - "These 3 issues are related, fix together?"
3. **Workflow Optimization** - "This pattern works 90% faster"

But always maintaining the simple interface.

---

## ⚡ Quick Start Guide

### For Developers
```python
# 1. Add intent detection
def detect_intent(user_input: str) -> Intent:
    # Use Claude to understand what user wants
    pass

# 2. Route to appropriate system
def route(intent: Intent) -> Result:
    if needs_isolation(intent):
        return spawn_adw(intent)
    else:
        return execute_direct(intent)

# 3. Stream events back
async def handle_events():
    async for event in adw_events():
        await websocket.broadcast(simplify(event))
```

### For Users
```
Type what you want → Get it done
```

---

## 🎯 North Star

**If a user has to read documentation to use this, we've failed.**

The system should be so intuitive that:
- New users are productive in < 1 minute
- Complex tasks feel simple
- The system gets smarter without getting more complex

---

## 📋 Next Steps (Simplified)

1. **Build intent detector** using Claude
2. **Connect ADW events** to WebSocket
3. **Show progress** in UI
4. **Ship & learn** from real usage

Don't build features - build intelligence.