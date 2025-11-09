# Crystallized Context Integration Strategy
## Orchestrator 3 Stream Enhancement Plan

**Created**: 2025-01-XX
**Status**: Design Phase
**Target**: apps/orchestrator_3_stream/backend/
**Objective**: Zero-friction integration of crystallized context patterns for pattern detection and intelligent navigation

---

## Executive Summary

This document outlines a concrete strategy to enhance the orchestrator_3_stream service with crystallized context capabilities while maintaining 100% backward compatibility with existing workflows. The approach focuses on:

1. **Pattern Detection**: Automatically identify repeated navigation patterns in agent workflows
2. **Smart Navigation Commands**: New `/nav:*` and `/crystal-*` slash commands
3. **Observe Mode**: Non-intrusive learning from successful agent executions
4. **Zero-Friction Integration**: No breaking changes to existing agent_manager.py or orchestrator_service.py

---

## Table of Contents

- [1. Architecture Analysis](#1-architecture-analysis)
- [2. Integration Points](#2-integration-points)
- [3. New Components](#3-new-components)
- [4. Slash Command Implementation](#4-slash-command-implementation)
- [5. Database Schema Extensions](#5-database-schema-extensions)
- [6. Agent Workflow Enhancements](#6-agent-workflow-enhancements)
- [7. Implementation Phases](#7-implementation-phases)
- [8. Testing Strategy](#8-testing-strategy)
- [9. Rollout Plan](#9-rollout-plan)

---

## 1. Architecture Analysis

### 1.1 Current System Overview

```
orchestrator_3_stream/backend/
├── main.py                           # FastAPI server (1118 lines)
├── modules/
│   ├── orchestrator_service.py       # Core orchestrator logic (1477 lines)
│   ├── agent_manager.py              # Agent lifecycle (1406 lines)
│   ├── database.py                   # PostgreSQL operations (1801 lines)
│   ├── context_manager.py            # Token optimization (286 lines)
│   ├── slash_command_parser.py       # Command discovery (273 lines)
│   ├── websocket_manager.py          # Real-time streaming
│   ├── command_agent_hooks.py        # Hook system for events
│   └── file_tracker.py               # File operation tracking
```

### 1.2 Key Architectural Strengths

**✅ Hook-Based Event System**
The existing `command_agent_hooks.py` provides PreToolUse, PostToolUse, Stop, and SubagentStop hooks - perfect insertion points for pattern detection without modifying core logic.

**✅ PostgreSQL Backend with JSONB**
Tables like `agent_logs` already store `payload` as JSONB, enabling pattern storage without schema migrations.

**✅ WebSocket Streaming Architecture**
Real-time broadcasting via `websocket_manager.py` allows live pattern updates to frontend without polling.

**✅ Slash Command System**
18 existing orchestrator commands in `.claude/commands/` - extensible system for adding `/nav:*` and `/crystal-*` commands.

**✅ File Tracker Integration**
`FileTracker` class already monitors Read/Write/Edit operations - can be extended to detect navigation patterns.

### 1.3 Integration Challenges

| Challenge | Solution |
|-----------|----------|
| Pattern storage without schema changes | Use existing `metadata` JSONB fields |
| Non-intrusive pattern detection | Leverage PostToolUse hooks |
| Real-time pattern updates | WebSocket broadcasts via `broadcast_agent_log()` |
| Slash command registration | Add .md files to `.claude/commands/` |
| Agent context enrichment | Inject patterns in `_create_claude_agent_options()` |

---

## 2. Integration Points

### 2.1 Pattern Detection Hooks (agent_manager.py)

**Location**: `agent_manager.py::_build_hooks_for_agent()` (lines 895-1012)

**Current Implementation**:
```python
def _build_hooks_for_agent(
    self, agent_id, agent_name, task_slug, entry_counter
) -> Dict[str, Any]:
    return {
        "PreToolUse": [...],
        "PostToolUse": [
            create_post_tool_hook(...),
            create_post_tool_file_tracking_hook(...)  # Already tracks files
        ],
        "Stop": [...],
        "SubagentStop": [...],
    }
```

**Enhancement Strategy**:
```python
# NEW: Add pattern detection hook
from .pattern_detector import create_pattern_detection_hook

"PostToolUse": [
    create_post_tool_hook(...),
    create_post_tool_file_tracking_hook(...),
    create_pattern_detection_hook(
        agent_id=agent_id,
        pattern_manager=self.pattern_manager,  # NEW component
        logger=self.logger,
        observe_mode=self.observe_mode_enabled(agent_id)
    )
]
```

**Zero-Friction Guarantee**: Adding a new hook to existing list is 100% backward compatible.

---

### 2.2 Pattern Storage (database.py)

**Location**: `database.py` (1801 lines)

**Existing Tables**:
```sql
-- agents table already has metadata JSONB
CREATE TABLE agents (
    id UUID PRIMARY KEY,
    metadata JSONB DEFAULT '{}'::jsonb,
    ...
);

-- agent_logs table for pattern sequences
CREATE TABLE agent_logs (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    payload JSONB,  -- Store pattern data here
    ...
);
```

**Pattern Storage Strategy**:

```python
# Store patterns in agent.metadata
{
    "crystallized_patterns": {
        "file_navigation": [
            {
                "pattern_id": "nav_001",
                "name": "Backend Module Inspection",
                "sequence": [
                    {"tool": "Read", "file": "modules/__init__.py"},
                    {"tool": "Glob", "pattern": "modules/*.py"},
                    {"tool": "Read", "file": "modules/database.py"}
                ],
                "confidence": 0.85,
                "usage_count": 12,
                "success_rate": 0.92,
                "last_used": "2025-01-15T10:30:00Z"
            }
        ],
        "code_patterns": [...],
        "project_structure": {...}
    },
    "observe_mode": {
        "enabled": true,
        "learning_threshold": 3,  # Detect after 3 repetitions
        "auto_crystallize": false
    }
}
```

**Database Functions to Add**:
```python
async def get_agent_patterns(agent_id: UUID) -> Dict[str, Any]:
    """Fetch crystallized patterns for agent"""

async def update_agent_patterns(agent_id: UUID, patterns: Dict) -> bool:
    """Update agent's pattern metadata"""

async def record_pattern_usage(agent_id: UUID, pattern_id: str) -> None:
    """Increment pattern usage counter"""
```

**Impact**: No schema migration required - uses existing JSONB fields.

---

### 2.3 Slash Command Registration

**Location**: `apps/orchestrator_3_stream/.claude/commands/`

**Existing Commands**: 18 orchestrator-specific commands (plan, build, reset, etc.)

**New Commands to Add**:

#### `/nav:explore [path]`
```markdown
---
description: Navigate project structure using crystallized patterns
argument-hint: [path] [--pattern pattern_name]
model: haiku
---

# Navigation with Crystallized Context

Intelligent navigation using learned patterns.

## Usage
- `/nav:explore backend/` - Explore with pattern detection
- `/nav:explore modules/ --pattern backend_inspection` - Use specific pattern
- `/nav:explore .` - Full project navigation

## Behind the Scenes
1. Checks agent's crystallized patterns in metadata
2. Suggests relevant navigation shortcuts
3. Learns from successful sequences
4. Updates pattern confidence scores
```

#### `/crystal-learn [mode]`
```markdown
---
description: Control crystallized context learning mode
argument-hint: on | off | status
model: haiku
---

# Crystallized Context Learning

Enable/disable pattern learning for this agent.

## Modes
- `on` - Enable observe mode (learn from tool usage)
- `off` - Disable learning
- `status` - Show current patterns and statistics

## Example
```
User: /crystal-learn on
Agent: ✅ Observe mode enabled. Will detect patterns after 3 repetitions.
```
```

#### `/crystal-patterns`
```markdown
---
description: List detected navigation patterns for this agent
---

# Show Crystallized Patterns

Display all learned navigation patterns with statistics.

## Output
- Pattern ID and name
- Usage count
- Success rate
- Last used timestamp
- Confidence score
```

#### `/observe-mode [on|off|status]`
```markdown
---
description: Toggle pattern observation mode
argument-hint: on | off | status
---

# Observe Mode

Non-intrusive learning mode that watches agent tool usage without interrupting workflow.

When enabled:
- Tracks Read, Grep, Glob sequences
- Detects repeated patterns (threshold: 3x)
- Builds navigation shortcuts
- Does NOT modify agent behavior
```

---

## 3. New Components

### 3.1 Pattern Detector Module

**File**: `apps/orchestrator_3_stream/backend/modules/pattern_detector.py`

**Purpose**: Detect repeated tool usage patterns in agent workflows

**Key Classes**:

```python
class ToolSequence(BaseModel):
    """A sequence of tool invocations"""
    tools: List[ToolInvocation]
    timestamp: datetime
    task_slug: str
    success: bool

class ToolInvocation(BaseModel):
    """Single tool call with context"""
    tool_name: str
    params: Dict[str, Any]
    result_summary: str
    timestamp: datetime

class PatternDetector:
    """Detects repeated patterns in tool sequences"""

    def __init__(self, min_repetitions: int = 3):
        self.sequences: Dict[UUID, List[ToolSequence]] = {}
        self.min_repetitions = min_repetitions

    def record_tool_use(
        self,
        agent_id: UUID,
        tool_name: str,
        params: Dict,
        result: str
    ) -> Optional[DetectedPattern]:
        """
        Record tool usage and detect patterns.

        Returns DetectedPattern if pattern threshold reached.
        """

    def find_similar_sequences(
        self,
        sequence: ToolSequence,
        similarity_threshold: float = 0.75
    ) -> List[ToolSequence]:
        """Find similar sequences using edit distance"""

    def crystallize_pattern(
        self,
        sequences: List[ToolSequence]
    ) -> CrystallizedPattern:
        """Convert repeated sequences into reusable pattern"""
```

**Integration via Hook**:

```python
def create_pattern_detection_hook(
    agent_id: UUID,
    pattern_manager: PatternManager,
    logger: OrchestratorLogger,
    observe_mode: bool
) -> Callable:
    """
    Create PostToolUse hook for pattern detection.

    Runs AFTER each tool use to analyze patterns without
    interfering with agent execution.
    """
    async def pattern_detection_hook(
        tool_name: str,
        tool_input: Dict[str, Any],
        tool_result: str,
        context: Dict[str, Any]
    ) -> None:
        if not observe_mode:
            return

        # Record this tool use
        detected = pattern_manager.record_tool_use(
            agent_id=agent_id,
            tool_name=tool_name,
            params=tool_input,
            result=tool_result[:500]  # Truncate for storage
        )

        # If pattern detected, store and broadcast
        if detected:
            await store_pattern(agent_id, detected)
            await broadcast_pattern_learned(agent_id, detected)

    return pattern_detection_hook
```

---

### 3.2 Pattern Manager Module

**File**: `apps/orchestrator_3_stream/backend/modules/pattern_manager.py`

**Purpose**: Manage agent patterns (CRUD operations)

**Key Functions**:

```python
class PatternManager:
    """Manages crystallized patterns for agents"""

    def __init__(self, db_pool: asyncpg.Pool, logger: OrchestratorLogger):
        self.db = db_pool
        self.logger = logger
        self.detector = PatternDetector(min_repetitions=3)

    async def get_patterns(self, agent_id: UUID) -> List[CrystallizedPattern]:
        """Fetch all patterns for agent"""

    async def add_pattern(
        self,
        agent_id: UUID,
        pattern: CrystallizedPattern
    ) -> str:
        """Store new pattern in agent metadata"""

    async def update_pattern_stats(
        self,
        agent_id: UUID,
        pattern_id: str,
        success: bool
    ) -> None:
        """Update usage count and success rate"""

    async def suggest_patterns(
        self,
        agent_id: UUID,
        current_context: Dict[str, Any]
    ) -> List[PatternSuggestion]:
        """
        Suggest relevant patterns based on current agent context.

        Analyzes:
        - Current working directory
        - Recent tool usage
        - Task description
        - File paths in context
        """

    async def prune_low_confidence_patterns(
        self,
        agent_id: UUID,
        min_confidence: float = 0.5
    ) -> int:
        """Remove patterns with low confidence/usage"""
```

---

### 3.3 Navigation Assistant Module

**File**: `apps/orchestrator_3_stream/backend/modules/navigation_assistant.py`

**Purpose**: Provide intelligent navigation using crystallized patterns

**Key Functions**:

```python
class NavigationAssistant:
    """Assists agents with pattern-aware navigation"""

    def __init__(self, pattern_manager: PatternManager):
        self.patterns = pattern_manager

    async def navigate_with_patterns(
        self,
        agent_id: UUID,
        target_path: str,
        pattern_hint: Optional[str] = None
    ) -> NavigationResult:
        """
        Navigate using crystallized patterns.

        Steps:
        1. Fetch agent's patterns
        2. Filter relevant patterns for target_path
        3. Suggest most confident pattern
        4. Execute pattern sequence
        5. Update pattern statistics
        """

    async def explain_navigation(
        self,
        pattern: CrystallizedPattern
    ) -> str:
        """Generate human-readable explanation of pattern"""

    async def optimize_navigation(
        self,
        current_sequence: List[ToolInvocation]
    ) -> List[ToolInvocation]:
        """Suggest optimizations for current navigation sequence"""
```

---

## 4. Slash Command Implementation

### 4.1 Command Handler Integration

**Location**: `modules/orchestrator_service.py::_create_claude_agent_options()`

**Current Mechanism**: Slash commands loaded via `setting_sources=["project"]`

**Enhancement**: Commands automatically discovered from `.claude/commands/` - no code changes needed!

**Implementation Steps**:

1. Create `.md` files in `apps/orchestrator_3_stream/.claude/commands/`
2. Use proper frontmatter with `description` and `argument-hint`
3. Commands automatically available to orchestrator via SlashCommand tool

**Example**: `/nav:explore` command

```markdown
---
description: Navigate with crystallized patterns
argument-hint: [path] [--pattern pattern_name]
model: haiku
---

When user invokes `/nav:explore backend/`:

1. Fetch agent patterns via PatternManager
2. Filter patterns matching "backend/"
3. If patterns found:
   - Display top 3 suggestions
   - Ask user to confirm or select
   - Execute selected pattern
4. If no patterns:
   - Perform standard navigation (Glob + Read)
   - Enable observe mode to learn
5. Record usage for future learning
```

---

### 4.2 Pattern Command Handlers

**New Tool Registration** (add to orchestrator's management tools):

```python
# In agent_manager.py::create_management_tools()

@tool(
    "navigate_with_pattern",
    "Navigate codebase using crystallized patterns. REQUIRED: target_path.",
    {"target_path": str, "pattern_id": str}
)
async def navigate_with_pattern_tool(args: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute navigation using learned patterns.

    Integrates with PatternManager to fetch and apply patterns.
    """
    target = args.get("target_path")
    pattern_id = args.get("pattern_id")  # Optional

    # Get patterns for current agent
    patterns = await pattern_manager.get_patterns(agent_id)

    if pattern_id:
        # Use specific pattern
        pattern = next((p for p in patterns if p.id == pattern_id), None)
        if not pattern:
            return {"error": f"Pattern {pattern_id} not found"}
    else:
        # Auto-select best pattern
        suggestions = await pattern_manager.suggest_patterns(
            agent_id,
            {"target_path": target}
        )
        pattern = suggestions[0] if suggestions else None

    if pattern:
        result = await navigation_assistant.navigate_with_patterns(
            agent_id, target, pattern.id
        )
        return {"content": [{"type": "text", "text": result.summary}]}
    else:
        return {"content": [{"type": "text", "text": "No matching patterns found. Use standard navigation."}]}
```

---

## 5. Database Schema Extensions

### 5.1 No Schema Migrations Needed

**Strategy**: Use existing `metadata` JSONB columns

**Affected Tables**:
- `agents.metadata` - Store patterns
- `agent_logs.payload` - Store pattern usage logs

### 5.2 Pattern Metadata Structure

```json
{
  "crystallized_patterns": {
    "version": "1.0",
    "patterns": [
      {
        "id": "nav_backend_modules",
        "name": "Backend Module Inspection",
        "type": "navigation",
        "sequence": [
          {
            "step": 1,
            "tool": "Glob",
            "params": {"pattern": "backend/modules/*.py"},
            "description": "List all Python modules"
          },
          {
            "step": 2,
            "tool": "Read",
            "params": {"file_path": "backend/modules/__init__.py"},
            "description": "Check module exports"
          },
          {
            "step": 3,
            "tool": "Grep",
            "params": {
              "pattern": "class.*Service",
              "path": "backend/modules/"
            },
            "description": "Find service classes"
          }
        ],
        "triggers": {
          "keywords": ["backend", "modules", "services"],
          "paths": ["backend/", "modules/"],
          "contexts": ["code_exploration", "architecture_review"]
        },
        "statistics": {
          "created_at": "2025-01-15T10:00:00Z",
          "usage_count": 15,
          "success_count": 14,
          "success_rate": 0.93,
          "last_used": "2025-01-15T14:30:00Z",
          "confidence": 0.93
        },
        "learned_from": {
          "task_slugs": ["inspect-backend-20250115", "review-architecture-20250114"],
          "session_ids": ["abc123", "def456"]
        }
      }
    ],
    "observe_mode": {
      "enabled": true,
      "learning_threshold": 3,
      "auto_crystallize": false,
      "excluded_tools": ["WebSearch", "WebFetch"]
    }
  }
}
```

---

## 6. Agent Workflow Enhancements

### 6.1 Agent Creation with Pattern Support

**Location**: `agent_manager.py::create_agent()` (lines 599-764)

**Enhancement**:

```python
async def create_agent(
    self,
    name: str,
    system_prompt: str,
    model: Optional[str] = None,
    subagent_template: Optional[str] = None,
    working_dir_override: Optional[str] = None,
    enable_pattern_learning: bool = True  # NEW parameter
) -> Dict[str, Any]:

    # ... existing creation logic ...

    # Initialize pattern metadata
    metadata = {
        "crystallized_patterns": {
            "version": "1.0",
            "patterns": [],
            "observe_mode": {
                "enabled": enable_pattern_learning,
                "learning_threshold": 3,
                "auto_crystallize": False
            }
        }
    }

    # Create agent in database with pattern metadata
    agent_id = await create_agent(
        orchestrator_agent_id=self.orchestrator_agent_id,
        name=name,
        model=model or config.DEFAULT_AGENT_MODEL,
        system_prompt=system_prompt,
        working_dir=agent_working_dir,
        metadata=metadata,
    )

    # Initialize PatternDetector for this agent
    self.pattern_detectors[str(agent_id)] = PatternDetector(min_repetitions=3)
```

**Impact**: New agents get pattern learning by default, opt-out via parameter.

---

### 6.2 Command Agent with Pattern Injection

**Location**: `agent_manager.py::command_agent()` (lines 766-893)

**Enhancement**: Inject patterns into agent's system prompt

```python
async def command_agent(
    self,
    agent_id: uuid.UUID,
    command: str,
    task_slug: Optional[str] = None
) -> Dict[str, Any]:

    # ... fetch agent ...

    # NEW: Enrich system prompt with patterns
    enriched_prompt = await self._enrich_prompt_with_patterns(
        agent=agent,
        base_prompt=agent.system_prompt,
        command=command
    )

    # Build options with enriched prompt
    options = ClaudeAgentOptions(
        system_prompt=enriched_prompt,  # Enhanced with patterns
        model=agent.model,
        cwd=agent.working_dir,
        resume=agent.session_id,
        hooks=hooks_dict,
        # ... rest of options ...
    )
```

**Pattern Injection Logic**:

```python
async def _enrich_prompt_with_patterns(
    self,
    agent: Agent,
    base_prompt: str,
    command: str
) -> str:
    """
    Enrich agent's system prompt with relevant patterns.

    Analyzes command to suggest applicable patterns.
    """
    # Fetch agent's patterns
    patterns = await self.pattern_manager.get_patterns(agent.id)

    if not patterns:
        return base_prompt

    # Find relevant patterns for this command
    relevant = await self.pattern_manager.suggest_patterns(
        agent.id,
        {"command": command, "cwd": agent.working_dir}
    )

    if not relevant:
        return base_prompt

    # Build pattern context
    pattern_context = "\n\n## Available Navigation Patterns\n\n"
    pattern_context += "You have access to these learned navigation patterns:\n\n"

    for suggestion in relevant[:3]:  # Top 3
        pattern = suggestion.pattern
        pattern_context += f"**Pattern**: {pattern.name} (confidence: {pattern.statistics.confidence:.0%})\n"
        pattern_context += f"**Usage**: {pattern.statistics.usage_count} times\n"
        pattern_context += f"**Sequence**:\n"
        for step in pattern.sequence:
            pattern_context += f"  {step.step}. {step.tool}({step.params})\n"
        pattern_context += f"\n**When to use**: {', '.join(pattern.triggers.keywords)}\n\n"

    pattern_context += "\nTo use a pattern, reference it in your response or use the navigate_with_pattern tool.\n"

    return base_prompt + pattern_context
```

---

### 6.3 Pattern Learning Flow

**Trigger**: PostToolUse hook in agent execution

**Flow Diagram**:

```
Agent executes tool (Read, Glob, Grep)
         ↓
PostToolUse hook fires
         ↓
pattern_detection_hook() called
         ↓
PatternDetector.record_tool_use()
         ↓
    [Check: observe_mode enabled?] ----NO---→ Skip
         ↓ YES
    [Analyze recent tool sequence]
         ↓
    [Find similar past sequences]
         ↓
    [Count >= learning_threshold?] ----NO---→ Store sequence, continue
         ↓ YES
    [Crystallize into pattern]
         ↓
    [Store in agent.metadata]
         ↓
    [Broadcast to WebSocket]
         ↓
    Frontend displays: "✨ New pattern learned: Backend Module Inspection"
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Basic pattern detection without UI integration

**Tasks**:
1. ✅ Create `pattern_detector.py` module
   - ToolSequence, ToolInvocation models
   - PatternDetector class with sequence tracking
   - Similarity detection algorithm
2. ✅ Create `pattern_manager.py` module
   - CRUD operations for patterns
   - Pattern storage in agent.metadata
   - Query functions for pattern retrieval
3. ✅ Add pattern detection hook
   - Implement `create_pattern_detection_hook()`
   - Integrate in `agent_manager._build_hooks_for_agent()`
4. ✅ Unit tests
   - Test pattern detection with mock sequences
   - Test metadata storage/retrieval
   - Test hook integration

**Deliverable**: Pattern detection works in background, patterns stored in database

---

### Phase 2: Slash Commands (Week 2)

**Goal**: User-facing commands for pattern management

**Tasks**:
1. ✅ Create slash command files
   - `/nav:explore.md`
   - `/crystal-learn.md`
   - `/crystal-patterns.md`
   - `/observe-mode.md`
2. ✅ Implement navigation assistant
   - `navigation_assistant.py` module
   - `navigate_with_patterns()` function
   - Pattern suggestion logic
3. ✅ Register management tools
   - `navigate_with_pattern` tool
   - `manage_observe_mode` tool
   - `list_patterns` tool
4. ✅ Integration tests
   - Test slash command invocation
   - Test tool registration
   - Test pattern-based navigation

**Deliverable**: Users can invoke `/crystal-patterns` and see learned patterns

---

### Phase 3: Context Injection (Week 3)

**Goal**: Automatically enrich agent prompts with patterns

**Tasks**:
1. ✅ Implement `_enrich_prompt_with_patterns()`
2. ✅ Integrate in `command_agent()`
3. ✅ Add pattern suggestion algorithm
   - Keyword matching
   - Path similarity
   - Context relevance
4. ✅ WebSocket broadcasting
   - Broadcast pattern learned events
   - Broadcast pattern usage events
5. ✅ End-to-end tests
   - Create agent → Execute tasks → Detect patterns → Reuse patterns
   - Verify pattern confidence increases with usage

**Deliverable**: Agents automatically use patterns when relevant

---

### Phase 4: Frontend Integration (Week 4)

**Goal**: Visualize patterns in orchestrator UI

**Tasks**:
1. ✅ Add pattern visualization component
   - Display patterns in agent sidebar
   - Show usage statistics
   - Confidence indicators
2. ✅ Pattern management UI
   - Enable/disable observe mode
   - Delete low-confidence patterns
   - Export/import patterns
3. ✅ Real-time updates
   - WebSocket listeners for pattern events
   - Toast notifications for new patterns
4. ✅ Polish & documentation
   - User guide for crystallized context
   - Best practices
   - Pattern library examples

**Deliverable**: Full UI for pattern management and visualization

---

## 8. Testing Strategy

### 8.1 Unit Tests

**File**: `apps/orchestrator_3_stream/backend/tests/test_pattern_detection.py`

```python
import pytest
from modules.pattern_detector import PatternDetector, ToolSequence, ToolInvocation

class TestPatternDetector:
    def test_detects_repeated_sequence(self):
        detector = PatternDetector(min_repetitions=3)
        agent_id = uuid.uuid4()

        # Execute same sequence 3 times
        for i in range(3):
            detector.record_tool_use(
                agent_id, "Glob", {"pattern": "backend/*.py"}, "Found 5 files"
            )
            detector.record_tool_use(
                agent_id, "Read", {"file_path": "backend/__init__.py"}, "Module exports"
            )

        # Should detect pattern after 3rd repetition
        patterns = detector.get_detected_patterns(agent_id)
        assert len(patterns) == 1
        assert patterns[0].statistics.usage_count == 3

    def test_similarity_threshold(self):
        detector = PatternDetector()

        seq1 = ToolSequence(tools=[
            ToolInvocation(tool_name="Glob", params={"pattern": "*.py"}),
            ToolInvocation(tool_name="Read", params={"file_path": "main.py"})
        ])

        seq2 = ToolSequence(tools=[
            ToolInvocation(tool_name="Glob", params={"pattern": "*.js"}),  # Different pattern
            ToolInvocation(tool_name="Read", params={"file_path": "main.js"})
        ])

        similarity = detector.calculate_similarity(seq1, seq2)
        assert 0.5 <= similarity <= 0.75  # Same structure, different params
```

---

### 8.2 Integration Tests

**File**: `apps/orchestrator_3_stream/backend/tests/test_pattern_integration.py`

```python
import pytest
from modules.agent_manager import AgentManager
from modules.pattern_manager import PatternManager

@pytest.mark.asyncio
class TestPatternIntegration:
    async def test_pattern_learning_flow(self, db_pool):
        """Test complete pattern learning flow"""
        agent_manager = AgentManager(
            orchestrator_agent_id=uuid.uuid4(),
            ws_manager=mock_ws_manager,
            logger=mock_logger
        )

        # Create agent with observe mode enabled
        result = await agent_manager.create_agent(
            name="test-agent",
            system_prompt="Test agent",
            enable_pattern_learning=True
        )
        agent_id = uuid.UUID(result["agent_id"])

        # Execute same navigation 3 times
        for i in range(3):
            await agent_manager.command_agent(
                agent_id,
                "Explore the backend directory"
            )

        # Verify pattern was learned
        patterns = await pattern_manager.get_patterns(agent_id)
        assert len(patterns) >= 1
        assert patterns[0].statistics.usage_count >= 3
```

---

### 8.3 End-to-End Tests

**File**: `apps/orchestrator_3_stream/backend/tests/test_pattern_e2e.py`

```python
@pytest.mark.asyncio
async def test_full_crystallization_workflow():
    """
    Complete workflow test:
    1. Create agent
    2. Execute tasks → Learn patterns
    3. Execute similar task → Use pattern
    4. Verify pattern confidence increased
    """
    # ... implementation
```

---

## 9. Rollout Plan

### 9.1 Feature Flags

**Configuration**: Add to `modules/config.py`

```python
# Crystallized Context Feature Flags
CRYSTALLIZED_CONTEXT_ENABLED = bool(os.getenv("CRYSTALLIZED_CONTEXT_ENABLED", "false").lower() == "true")
PATTERN_LEARNING_DEFAULT = bool(os.getenv("PATTERN_LEARNING_DEFAULT", "true").lower() == "true")
PATTERN_DETECTION_THRESHOLD = int(os.getenv("PATTERN_DETECTION_THRESHOLD", "3"))
```

---

### 9.2 Gradual Rollout

**Week 1-2**: Internal testing with feature flag disabled by default
- Test with orchestrator team agents
- Collect feedback on pattern quality
- Tune detection threshold

**Week 3**: Opt-in beta
- Enable via `CRYSTALLIZED_CONTEXT_ENABLED=true`
- Documentation and training
- Monitor pattern storage usage

**Week 4**: General availability
- Enable by default for new agents
- Provide opt-out mechanism
- Monitor performance impact

---

### 9.3 Monitoring & Metrics

**Metrics to Track**:

```python
# Pattern Statistics
- patterns_learned_count
- patterns_used_count
- pattern_success_rate
- pattern_confidence_distribution

# Performance Metrics
- pattern_detection_latency_ms
- metadata_storage_size_bytes
- hook_execution_time_ms

# User Engagement
- agents_with_observe_mode_enabled
- slash_command_usage (nav:explore, crystal-*)
- pattern_reuse_rate
```

**Logging Strategy**:

```python
logger.info(
    f"[PatternDetection] Agent={agent_name} learned pattern '{pattern.name}' "
    f"after {pattern.statistics.usage_count} repetitions"
)

logger.debug(
    f"[PatternUsage] Agent={agent_name} using pattern '{pattern.id}' "
    f"(confidence={pattern.statistics.confidence:.2%})"
)
```

---

## 10. Success Criteria

### 10.1 Functional Requirements

✅ **Pattern Detection**
- [ ] Detects repeated tool sequences after N repetitions (default: 3)
- [ ] Stores patterns in agent.metadata without schema migrations
- [ ] Pattern detection adds < 50ms latency per tool use

✅ **Pattern Usage**
- [ ] Agents can reuse patterns via `/nav:explore`
- [ ] Pattern confidence increases with successful usage
- [ ] Failed patterns decrease in confidence

✅ **Slash Commands**
- [ ] `/nav:explore [path]` - Navigate with patterns
- [ ] `/crystal-learn [on|off|status]` - Control observe mode
- [ ] `/crystal-patterns` - List learned patterns
- [ ] `/observe-mode [on|off]` - Toggle observation

✅ **Zero-Friction Integration**
- [ ] No breaking changes to existing agent workflows
- [ ] Backward compatible with agents created before rollout
- [ ] Feature can be disabled via environment variable

---

### 10.2 Non-Functional Requirements

**Performance**
- Pattern detection hook execution: < 50ms p95
- Pattern retrieval from database: < 100ms p95
- Metadata storage size: < 100KB per agent

**Reliability**
- Pattern detection failure rate: < 1%
- No database deadlocks from pattern storage
- Graceful degradation if pattern detection fails

**Usability**
- Pattern names are human-readable
- Pattern suggestions are relevant (>70% acceptance rate)
- Observe mode can be toggled without agent restart

---

## 11. Future Enhancements

### 11.1 Cross-Agent Pattern Sharing

**Concept**: Share successful patterns across agents working on similar projects

```python
# Store patterns at orchestrator level
orchestrator_agents.metadata = {
    "shared_patterns": {
        "python_backend_inspection": {...},
        "react_component_navigation": {...}
    }
}

# Agents can inherit shared patterns
agent.metadata = {
    "inherited_patterns": ["python_backend_inspection"],
    "private_patterns": [...]
}
```

---

### 11.2 Pattern Evolution

**Concept**: Patterns improve over time through usage

```python
class PatternEvolution:
    async def refine_pattern(
        self,
        pattern: CrystallizedPattern,
        new_usage: ToolSequence
    ) -> CrystallizedPattern:
        """
        Refine pattern based on new usage.

        - Merge common steps
        - Remove unnecessary steps
        - Generalize parameters
        """
```

---

### 11.3 Pattern Templates

**Concept**: Pre-built patterns for common workflows

```yaml
# .claude/patterns/backend_inspection.yaml
name: Backend Module Inspection
description: Standard pattern for inspecting Python backend modules
sequence:
  - tool: Glob
    params: { pattern: "backend/modules/*.py" }
  - tool: Read
    params: { file_path: "backend/modules/__init__.py" }
  - tool: Grep
    params: { pattern: "class.*Service", path: "backend/modules/" }
triggers:
  keywords: [backend, modules, services, architecture]
  paths: [backend/, modules/]
```

---

## 12. Risk Mitigation

### 12.1 Identified Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Pattern detection slows down agents | Medium | Add 50ms timeout, async processing |
| Low-quality patterns learned | Medium | Confidence thresholds, manual review |
| Metadata bloat (100+ patterns per agent) | Low | Auto-prune patterns with <50% confidence |
| Hook integration breaks existing workflow | High | Extensive testing, feature flag |

---

### 12.2 Rollback Plan

**If major issues arise**:

1. Set `CRYSTALLIZED_CONTEXT_ENABLED=false`
2. Pattern hooks stop executing immediately
3. Existing patterns remain in database (no data loss)
4. Agents continue working without pattern support

**Database Rollback** (if needed):
```sql
-- Remove pattern metadata from all agents
UPDATE agents SET metadata = metadata - 'crystallized_patterns';
```

---

## 13. Documentation Requirements

### 13.1 User Documentation

**File**: `docs/features/crystallized_context.md`

Topics:
- What are crystallized patterns?
- How to enable/disable observe mode
- Using `/nav:*` commands
- Best practices for pattern learning
- Troubleshooting common issues

---

### 13.2 Developer Documentation

**File**: `docs/architecture/pattern_detection.md`

Topics:
- Pattern detection algorithm
- Hook integration points
- Database schema for patterns
- Extending pattern types
- Performance considerations

---

## 14. Conclusion

This strategy provides a **zero-friction, backward-compatible** approach to integrating crystallized context patterns into orchestrator_3_stream. Key strengths:

✅ **No Schema Migrations**: Uses existing JSONB metadata
✅ **Hook-Based Integration**: Non-intrusive pattern detection
✅ **Extensible Slash Commands**: Easy to add new commands
✅ **Feature-Flagged**: Safe gradual rollout
✅ **WebSocket Streaming**: Real-time pattern updates

**Next Steps**:
1. Review and approve this strategy
2. Create GitHub issues for Phase 1 tasks
3. Assign implementation team
4. Begin development with `pattern_detector.py`

---

**Document Version**: 1.0
**Last Updated**: 2025-01-XX
**Author**: Build Agent (via orchestrator_3_stream analysis)
**Status**: Ready for Review
