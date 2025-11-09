# Crystallized Context Integration - Executive Summary

**Date**: 2025-01-XX
**Service**: orchestrator_3_stream
**Objective**: Add intelligent pattern detection and navigation without breaking existing workflows

---

## TL;DR

We can add crystallized context pattern learning to orchestrator_3_stream **without any database migrations or breaking changes** by:

1. **Leveraging existing hooks** - PostToolUse hook for pattern detection
2. **Using JSONB metadata** - Store patterns in `agents.metadata` (already exists)
3. **Adding slash commands** - New `.md` files in `.claude/commands/`
4. **Feature-flagged rollout** - Safe gradual deployment

**Estimated Timeline**: 4 weeks (Foundation → Commands → Injection → UI)

---

## Architecture Strengths for This Integration

### ✅ Hook System (Perfect for Pattern Detection)
```python
# apps/orchestrator_3_stream/backend/modules/agent_manager.py
# Lines 895-1012: _build_hooks_for_agent()

"PostToolUse": [
    create_post_tool_hook(...),
    create_post_tool_file_tracking_hook(...),
    create_pattern_detection_hook(...)  # ← NEW! Zero-friction addition
]
```

**Why This Works**: PostToolUse hooks run AFTER each tool invocation, allowing us to observe patterns without interfering with agent execution.

---

### ✅ JSONB Metadata (No Schema Changes Needed)
```sql
-- Already exists in database schema
CREATE TABLE agents (
    id UUID PRIMARY KEY,
    metadata JSONB DEFAULT '{}'::jsonb,  -- ← Store patterns here!
    ...
);
```

**Pattern Storage Structure**:
```json
{
  "crystallized_patterns": {
    "patterns": [
      {
        "id": "nav_backend_modules",
        "name": "Backend Module Inspection",
        "sequence": [
          {"tool": "Glob", "params": {"pattern": "modules/*.py"}},
          {"tool": "Read", "params": {"file_path": "modules/__init__.py"}}
        ],
        "statistics": {
          "usage_count": 15,
          "success_rate": 0.93,
          "confidence": 0.93
        }
      }
    ],
    "observe_mode": {"enabled": true, "learning_threshold": 3}
  }
}
```

---

### ✅ Slash Command System (Easy Extension)
```
apps/orchestrator_3_stream/.claude/commands/
├── existing_commands/ (18 commands)
│   ├── plan.md
│   ├── build.md
│   └── reset.md
└── NEW crystallized commands/
    ├── nav_explore.md           # /nav:explore [path]
    ├── crystal_learn.md         # /crystal-learn on|off|status
    ├── crystal_patterns.md      # /crystal-patterns
    └── observe_mode.md          # /observe-mode on|off
```

**No code changes needed** - just add `.md` files and they're automatically discovered!

---

## Key Integration Points

### 1. Pattern Detection Hook (agent_manager.py)

**Location**: `agent_manager.py::_build_hooks_for_agent()` (line 895)

**Addition**:
```python
def _build_hooks_for_agent(self, agent_id, agent_name, task_slug, entry_counter):
    # Existing hooks...
    file_tracker = self.file_trackers.get(str(agent_id))

    # NEW: Initialize pattern detector
    pattern_detector = self.pattern_detectors.get(str(agent_id))

    return {
        "PostToolUse": [
            create_post_tool_hook(...),
            create_post_tool_file_tracking_hook(file_tracker, ...),
            create_pattern_detection_hook(pattern_detector, ...)  # NEW
        ],
        # ... other hooks
    }
```

**Impact**: Zero - existing hooks still run, new hook is additive

---

### 2. Pattern Storage (database.py)

**Location**: `database.py` (1801 lines)

**New Functions to Add**:
```python
async def get_agent_patterns(agent_id: UUID) -> Dict[str, Any]:
    """Fetch crystallized patterns from agent.metadata"""
    async with get_connection() as conn:
        row = await conn.fetchrow(
            "SELECT metadata FROM agents WHERE id = $1", agent_id
        )
        if row:
            metadata = json.loads(row['metadata']) if isinstance(row['metadata'], str) else row['metadata']
            return metadata.get('crystallized_patterns', {})
        return {}

async def update_agent_patterns(agent_id: UUID, patterns: Dict) -> bool:
    """Update agent's pattern metadata"""
    async with get_connection() as conn:
        await conn.execute("""
            UPDATE agents
            SET metadata = jsonb_set(metadata, '{crystallized_patterns}', $1::jsonb)
            WHERE id = $2
        """, json.dumps(patterns), agent_id)
        return True
```

**Impact**: Zero - uses existing metadata column, no schema changes

---

### 3. Context Enrichment (orchestrator_service.py)

**Location**: `orchestrator_service.py::_load_system_prompt()` (line 300)

**Enhancement**: Inject patterns into system prompt

```python
def _load_system_prompt(self) -> str:
    prompt_text = # ... existing logic ...

    # NEW: Append crystallized patterns if available
    if self.agent_manager:
        patterns = await self.agent_manager.pattern_manager.get_top_patterns(
            agent_id=self.agent_id,
            limit=3
        )
        if patterns:
            prompt_text += "\n\n## Available Navigation Patterns\n\n"
            for p in patterns:
                prompt_text += f"- **{p.name}**: {p.description}\n"

    return prompt_text
```

**Impact**: Agents see relevant patterns in their system prompt automatically

---

## New Components to Build

### 1. Pattern Detector Module
**File**: `modules/pattern_detector.py` (~300 lines)

**Key Classes**:
- `ToolSequence` - Represents a sequence of tool invocations
- `PatternDetector` - Detects repeated sequences
- `CrystallizedPattern` - Immutable pattern definition

**Algorithm**:
```
For each tool use:
  1. Record in agent's sequence buffer
  2. Find similar past sequences (edit distance)
  3. If similarity > threshold AND count >= 3:
     → Crystallize into pattern
     → Store in agent.metadata
     → Broadcast to WebSocket
```

---

### 2. Pattern Manager Module
**File**: `modules/pattern_manager.py` (~250 lines)

**Key Functions**:
- `get_patterns(agent_id)` - Fetch all patterns
- `add_pattern(agent_id, pattern)` - Store new pattern
- `suggest_patterns(agent_id, context)` - Recommend patterns
- `update_pattern_stats(agent_id, pattern_id, success)` - Track usage

---

### 3. Navigation Assistant Module
**File**: `modules/navigation_assistant.py` (~200 lines)

**Key Functions**:
- `navigate_with_patterns(agent_id, path, pattern_hint)` - Execute pattern
- `explain_navigation(pattern)` - Human-readable pattern description
- `optimize_navigation(sequence)` - Suggest improvements

---

## Slash Commands to Add

### `/nav:explore [path] [--pattern pattern_name]`
Navigate project structure using crystallized patterns

**Example**:
```
User: /nav:explore backend/modules/
Agent:
✨ Found matching pattern: "Backend Module Inspection" (93% confidence)
  1. Glob backend/modules/*.py
  2. Read backend/modules/__init__.py
  3. Grep for 'class.*Service'

Would you like me to use this pattern? [Yes/No/Show alternatives]
```

---

### `/crystal-learn [on|off|status]`
Control pattern learning for current agent

**Example**:
```
User: /crystal-learn status
Agent:
📊 Observe Mode: ✅ Enabled
Learning Threshold: 3 repetitions
Patterns Learned: 5
Total Usage: 47 times
Success Rate: 91.5%
```

---

### `/crystal-patterns`
List all detected patterns with statistics

**Example**:
```
User: /crystal-patterns
Agent:
📋 Your Crystallized Patterns:

1. **Backend Module Inspection** (ID: nav_001)
   - Used: 15 times
   - Success: 93%
   - Last used: 2h ago
   - Sequence: Glob → Read → Grep

2. **React Component Navigation** (ID: nav_002)
   - Used: 8 times
   - Success: 87%
   - Last used: 5h ago
   - Sequence: Glob → Read → Edit
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal**: Pattern detection works in background

**Tasks**:
- [ ] Create `pattern_detector.py`
- [ ] Create `pattern_manager.py`
- [ ] Add pattern detection hook to `agent_manager.py`
- [ ] Add database functions for pattern CRUD
- [ ] Unit tests

**Deliverable**: Patterns detected and stored, no UI yet

---

### Phase 2: Slash Commands (Week 2)
**Goal**: User-facing pattern management

**Tasks**:
- [ ] Create `/nav:explore.md`
- [ ] Create `/crystal-learn.md`
- [ ] Create `/crystal-patterns.md`
- [ ] Create `/observe-mode.md`
- [ ] Implement navigation assistant
- [ ] Register management tools

**Deliverable**: Users can invoke commands and see patterns

---

### Phase 3: Context Injection (Week 3)
**Goal**: Automatic pattern usage

**Tasks**:
- [ ] Implement `_enrich_prompt_with_patterns()`
- [ ] Integrate in `command_agent()`
- [ ] Add pattern suggestion algorithm
- [ ] WebSocket broadcasting for pattern events
- [ ] End-to-end tests

**Deliverable**: Agents automatically suggest patterns

---

### Phase 4: Frontend Integration (Week 4)
**Goal**: Visualize patterns in UI

**Tasks**:
- [ ] Pattern visualization component
- [ ] Pattern management UI (enable/disable, delete)
- [ ] Real-time pattern updates via WebSocket
- [ ] Toast notifications for new patterns
- [ ] Documentation and user guide

**Deliverable**: Full UI for pattern management

---

## Success Metrics

### Functional
- ✅ Patterns detected after 3 repetitions
- ✅ Pattern reuse rate > 50% when available
- ✅ Pattern confidence increases with successful usage
- ✅ Zero breaking changes to existing workflows

### Performance
- ✅ Pattern detection adds < 50ms latency per tool use
- ✅ Pattern retrieval < 100ms p95
- ✅ Metadata storage < 100KB per agent

### User Engagement
- ✅ 70%+ of agents have observe mode enabled
- ✅ `/nav:explore` used in 30%+ of navigation tasks
- ✅ Pattern acceptance rate > 70%

---

## Risk Mitigation

### High-Risk: Hook Integration Breaks Workflow
**Mitigation**:
- Extensive testing with existing agents
- Feature flag (`CRYSTALLIZED_CONTEXT_ENABLED=false` by default)
- Rollback plan: disable via env var

### Medium-Risk: Low-Quality Patterns Learned
**Mitigation**:
- Confidence threshold (min 60% to suggest)
- Auto-prune patterns with <50% success rate
- Manual review interface

### Low-Risk: Metadata Bloat
**Mitigation**:
- Limit to 50 patterns per agent
- Prune least-used patterns automatically
- Compress pattern sequences

---

## Zero-Friction Integration Guarantee

**No Schema Migrations**:
- ✅ Uses existing `agents.metadata` JSONB column
- ✅ Uses existing `agent_logs.payload` for pattern usage logs

**No Breaking Changes**:
- ✅ New hooks added to existing hook system
- ✅ Slash commands are additive
- ✅ Feature flag for safe rollout

**Backward Compatible**:
- ✅ Existing agents work without pattern support
- ✅ Patterns optional - agents function normally without them
- ✅ Can disable entire feature via environment variable

---

## Example Usage Scenario

### Scenario: Agent Learning Backend Navigation

**Day 1**: Agent explores backend for first time
```
User: "Explore the backend directory structure"

Agent executes:
  1. Glob backend/**/*.py
  2. Read backend/__init__.py
  3. Grep "class.*Service" backend/modules/
  4. Read backend/modules/database.py

[Observe mode records sequence, count = 1]
```

**Day 2**: Agent explores backend again (different task)
```
User: "Review backend modules"

Agent executes similar sequence:
  1. Glob backend/modules/*.py
  2. Read backend/modules/__init__.py
  3. Grep "class" backend/modules/

[Observe mode detects similarity, count = 2]
```

**Day 3**: Third repetition triggers crystallization
```
User: "Check backend service implementations"

Agent executes:
  1. Glob backend/**/*.py
  2. Read backend/__init__.py

[Observe mode detects pattern, count = 3 → CRYSTALLIZE!]

✨ New pattern learned: "Backend Module Inspection"
   Sequence: Glob → Read → Grep
   Confidence: 75% (will improve with usage)
```

**Day 4**: Agent suggests pattern automatically
```
User: "Analyze backend architecture"

Agent's enriched system prompt now includes:
  "Available Pattern: Backend Module Inspection (75% confidence)
   Use this when exploring backend code structure."

Agent: "I can use the Backend Module Inspection pattern I learned.
        This will Glob all modules, read __init__.py, and grep for services.
        Shall I proceed?"

[User confirms → Pattern executed → Confidence increases to 80%]
```

---

## Next Steps

1. **Review Strategy Document**: `specs/crystallized_context_integration_strategy.md`
2. **Create GitHub Issues**: Break down Phase 1 tasks
3. **Assign Implementation Team**: 2 developers for 4 weeks
4. **Set Up Feature Flag**: Add to config before starting
5. **Begin Development**: Start with `pattern_detector.py` module

---

## Questions for Review

1. **Threshold Tuning**: Is 3 repetitions the right learning threshold?
   - **Suggestion**: Start with 3, make configurable via env var

2. **Pattern Scope**: Should patterns be agent-specific or shareable?
   - **Phase 1**: Agent-specific
   - **Future**: Cross-agent sharing at orchestrator level

3. **UI Priority**: Should we build backend-first or full-stack?
   - **Recommendation**: Backend-first (Phases 1-3), UI last (Phase 4)
   - **Rationale**: Easier to test pattern quality without UI complexity

4. **Performance Budget**: What's acceptable latency for pattern detection?
   - **Target**: < 50ms per tool use
   - **Fallback**: If > 100ms, disable and log warning

---

## Conclusion

This integration strategy provides a **production-ready, zero-friction approach** to adding crystallized context patterns to orchestrator_3_stream. The hook-based architecture, JSONB metadata, and slash command system make this a natural extension rather than a disruptive change.

**Key Takeaway**: We're **enhancing agents with memory**, not replacing existing workflows.

---

**Document Owner**: Orchestrator Team
**Technical Reviewer**: [Pending]
**Implementation Lead**: [Pending]
**Target Start Date**: [Pending]

**Full Strategy**: See `specs/crystallized_context_integration_strategy.md` (10,000+ words)
