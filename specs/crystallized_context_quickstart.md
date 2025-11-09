# Crystallized Context - Developer Quickstart Guide

**Target Audience**: Developers implementing pattern detection in orchestrator_3_stream
**Estimated Time**: 2-3 hours for Phase 1 foundation
**Prerequisites**: Familiarity with Python, asyncpg, FastAPI

---

## Overview

This guide walks you through implementing the **first working version** of crystallized context pattern detection. By the end, you'll have:

- ✅ Pattern detection running in background
- ✅ Patterns stored in database
- ✅ Basic unit tests passing

---

## Step 1: Create Pattern Detector Module (30 minutes)

### File: `apps/orchestrator_3_stream/backend/modules/pattern_detector.py`

```python
"""
Pattern Detector Module

Detects repeated tool sequences and crystallizes them into reusable patterns.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import UUID
import uuid


@dataclass
class ToolInvocation:
    """Single tool invocation with context"""
    tool_name: str
    params: Dict[str, Any]
    result_summary: str  # First 500 chars of result
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class ToolSequence:
    """A sequence of tool invocations from a single task"""
    agent_id: UUID
    task_slug: str
    tools: List[ToolInvocation] = field(default_factory=list)
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    success: bool = True

    def to_signature(self) -> str:
        """Generate signature for similarity comparison"""
        # Signature: tool names + key params (ignoring specific paths/values)
        sig_parts = []
        for tool in self.tools:
            sig_parts.append(tool.tool_name)
            # Add param keys (not values) for structural similarity
            sig_parts.extend(sorted(tool.params.keys()))
        return "|".join(sig_parts)


@dataclass
class CrystallizedPattern:
    """Immutable pattern definition"""
    id: str
    name: str
    description: str
    sequence: List[Dict[str, Any]]  # Simplified tool steps
    triggers: Dict[str, List[str]]  # keywords, paths, contexts
    statistics: Dict[str, Any]  # usage_count, success_rate, etc.
    learned_from: Dict[str, List[str]]  # task_slugs, session_ids
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class PatternDetector:
    """
    Detects repeated patterns in tool sequences.

    Algorithm:
    1. Record each tool use in sequence buffer
    2. After task completion, compare sequence to past sequences
    3. If similar sequence repeated >= threshold, crystallize pattern
    """

    def __init__(self, min_repetitions: int = 3, similarity_threshold: float = 0.75):
        """
        Initialize pattern detector.

        Args:
            min_repetitions: Minimum repetitions before crystallizing (default: 3)
            similarity_threshold: Similarity score for matching (default: 0.75)
        """
        self.min_repetitions = min_repetitions
        self.similarity_threshold = similarity_threshold

        # Buffer of sequences per agent
        self.sequences: Dict[UUID, List[ToolSequence]] = {}

        # Current sequence being built
        self.current_sequence: Dict[UUID, ToolSequence] = {}

        # Detected patterns (not yet stored in DB)
        self.detected_patterns: Dict[UUID, List[CrystallizedPattern]] = {}

    def start_sequence(self, agent_id: UUID, task_slug: str) -> None:
        """Start recording a new tool sequence"""
        self.current_sequence[agent_id] = ToolSequence(
            agent_id=agent_id,
            task_slug=task_slug,
            tools=[]
        )

    def record_tool_use(
        self,
        agent_id: UUID,
        tool_name: str,
        params: Dict[str, Any],
        result: str
    ) -> None:
        """
        Record a tool invocation in the current sequence.

        Args:
            agent_id: UUID of agent using the tool
            tool_name: Name of tool (Read, Glob, Grep, etc.)
            params: Tool parameters
            result: Tool result (truncated to 500 chars for storage)
        """
        if agent_id not in self.current_sequence:
            # No sequence started - skip (shouldn't happen)
            return

        invocation = ToolInvocation(
            tool_name=tool_name,
            params=params,
            result_summary=result[:500] if result else ""
        )

        self.current_sequence[agent_id].tools.append(invocation)

    def finish_sequence(
        self,
        agent_id: UUID,
        success: bool = True
    ) -> Optional[CrystallizedPattern]:
        """
        Finish current sequence and check for patterns.

        Args:
            agent_id: UUID of agent
            success: Whether task completed successfully

        Returns:
            CrystallizedPattern if new pattern detected, None otherwise
        """
        if agent_id not in self.current_sequence:
            return None

        sequence = self.current_sequence[agent_id]
        sequence.success = success

        # Add to sequence history
        if agent_id not in self.sequences:
            self.sequences[agent_id] = []
        self.sequences[agent_id].append(sequence)

        # Clear current sequence
        del self.current_sequence[agent_id]

        # Check for pattern
        return self._detect_pattern(agent_id, sequence)

    def _detect_pattern(
        self,
        agent_id: UUID,
        latest_sequence: ToolSequence
    ) -> Optional[CrystallizedPattern]:
        """
        Detect if latest sequence matches a repeated pattern.

        Returns:
            CrystallizedPattern if pattern detected, None otherwise
        """
        if len(latest_sequence.tools) < 2:
            # Too short to be a pattern
            return None

        # Find similar past sequences
        similar = self._find_similar_sequences(agent_id, latest_sequence)

        if len(similar) >= self.min_repetitions:
            # Pattern detected! Crystallize it
            return self._crystallize_pattern(agent_id, similar)

        return None

    def _find_similar_sequences(
        self,
        agent_id: UUID,
        target: ToolSequence
    ) -> List[ToolSequence]:
        """
        Find sequences similar to target.

        Uses signature-based similarity (tool names + param structure).
        """
        if agent_id not in self.sequences:
            return []

        similar = []
        target_sig = target.to_signature()

        for seq in self.sequences[agent_id]:
            if seq is target:
                continue  # Skip self

            seq_sig = seq.to_signature()

            # Calculate simple similarity (exact signature match for now)
            # TODO: Implement edit distance for fuzzy matching
            if seq_sig == target_sig:
                similar.append(seq)

        return similar

    def _crystallize_pattern(
        self,
        agent_id: UUID,
        sequences: List[ToolSequence]
    ) -> CrystallizedPattern:
        """
        Create a crystallized pattern from repeated sequences.

        Args:
            agent_id: UUID of agent
            sequences: List of similar sequences to merge

        Returns:
            CrystallizedPattern definition
        """
        # Use first sequence as template
        template = sequences[0]

        # Generate pattern name from tools
        tool_names = [tool.tool_name for tool in template.tools]
        pattern_name = " → ".join(tool_names[:3])  # First 3 tools

        # Build simplified sequence (generalize parameters)
        sequence_steps = []
        for i, tool in enumerate(template.tools):
            step = {
                "step": i + 1,
                "tool": tool.tool_name,
                "params": self._generalize_params(tool.params),
                "description": f"Step {i+1}: {tool.tool_name}"
            }
            sequence_steps.append(step)

        # Extract keywords from task slugs
        keywords = set()
        task_slugs = []
        for seq in sequences:
            task_slugs.append(seq.task_slug)
            # Simple keyword extraction from task slug
            words = seq.task_slug.lower().replace("-", " ").split()
            keywords.update(words)

        # Calculate statistics
        success_count = sum(1 for seq in sequences if seq.success)
        usage_count = len(sequences)
        success_rate = success_count / usage_count if usage_count > 0 else 0.0

        pattern = CrystallizedPattern(
            id=f"pattern_{uuid.uuid4().hex[:8]}",
            name=pattern_name,
            description=f"Repeated pattern: {pattern_name}",
            sequence=sequence_steps,
            triggers={
                "keywords": list(keywords)[:10],  # Top 10 keywords
                "paths": [],  # TODO: Extract from file paths
                "contexts": []
            },
            statistics={
                "usage_count": usage_count,
                "success_count": success_count,
                "success_rate": success_rate,
                "confidence": success_rate,  # Start with success rate
                "last_used": datetime.now(timezone.utc).isoformat()
            },
            learned_from={
                "task_slugs": task_slugs,
                "session_ids": []  # TODO: Track session IDs
            }
        )

        # Store in detected patterns
        if agent_id not in self.detected_patterns:
            self.detected_patterns[agent_id] = []
        self.detected_patterns[agent_id].append(pattern)

        return pattern

    def _generalize_params(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generalize parameters for pattern reuse.

        Example:
            {"file_path": "/backend/modules/database.py"}
        becomes:
            {"file_path": "**/*database.py"}  # Pattern for similar files
        """
        # For now, just return original params
        # TODO: Implement smart generalization
        return params

    def get_detected_patterns(self, agent_id: UUID) -> List[CrystallizedPattern]:
        """Get all detected patterns for agent"""
        return self.detected_patterns.get(agent_id, [])
```

---

## Step 2: Add Pattern Manager (20 minutes)

### File: `apps/orchestrator_3_stream/backend/modules/pattern_manager.py`

```python
"""
Pattern Manager Module

Manages CRUD operations for crystallized patterns in database.
"""

from typing import List, Dict, Any, Optional
from uuid import UUID
import json
from datetime import datetime, timezone

from .pattern_detector import CrystallizedPattern, PatternDetector


class PatternManager:
    """
    Manages pattern storage and retrieval.

    Patterns are stored in agents.metadata JSONB field.
    """

    def __init__(self, db_pool, logger):
        """
        Initialize pattern manager.

        Args:
            db_pool: asyncpg connection pool
            logger: OrchestratorLogger instance
        """
        self.db = db_pool
        self.logger = logger
        self.detector = PatternDetector(min_repetitions=3)

    async def get_patterns(self, agent_id: UUID) -> List[Dict[str, Any]]:
        """
        Fetch all patterns for agent from database.

        Args:
            agent_id: UUID of agent

        Returns:
            List of pattern dicts
        """
        from .database import get_connection

        async with get_connection() as conn:
            row = await conn.fetchrow(
                "SELECT metadata FROM agents WHERE id = $1",
                agent_id
            )

            if not row:
                return []

            metadata = row['metadata']
            if isinstance(metadata, str):
                metadata = json.loads(metadata)

            patterns = metadata.get('crystallized_patterns', {}).get('patterns', [])
            return patterns

    async def add_pattern(
        self,
        agent_id: UUID,
        pattern: CrystallizedPattern
    ) -> bool:
        """
        Store new pattern in agent metadata.

        Args:
            agent_id: UUID of agent
            pattern: CrystallizedPattern to store

        Returns:
            True if successful
        """
        from .database import get_connection

        # Convert pattern to dict
        pattern_dict = {
            "id": pattern.id,
            "name": pattern.name,
            "description": pattern.description,
            "sequence": pattern.sequence,
            "triggers": pattern.triggers,
            "statistics": pattern.statistics,
            "learned_from": pattern.learned_from,
            "created_at": pattern.created_at.isoformat()
        }

        async with get_connection() as conn:
            # Fetch current patterns
            row = await conn.fetchrow(
                "SELECT metadata FROM agents WHERE id = $1",
                agent_id
            )

            if not row:
                self.logger.error(f"Agent {agent_id} not found")
                return False

            metadata = row['metadata']
            if isinstance(metadata, str):
                metadata = json.loads(metadata)

            # Initialize crystallized_patterns if not exists
            if 'crystallized_patterns' not in metadata:
                metadata['crystallized_patterns'] = {
                    "version": "1.0",
                    "patterns": [],
                    "observe_mode": {
                        "enabled": True,
                        "learning_threshold": 3,
                        "auto_crystallize": False
                    }
                }

            # Add new pattern
            metadata['crystallized_patterns']['patterns'].append(pattern_dict)

            # Update in database
            await conn.execute(
                """
                UPDATE agents
                SET metadata = $1::jsonb
                WHERE id = $2
                """,
                json.dumps(metadata),
                agent_id
            )

            self.logger.info(f"✨ Stored pattern '{pattern.name}' for agent {agent_id}")
            return True

    async def is_observe_mode_enabled(self, agent_id: UUID) -> bool:
        """Check if observe mode is enabled for agent"""
        patterns_data = await self.get_patterns(agent_id)
        # For now, default to True (can be made configurable)
        return True
```

---

## Step 3: Create Pattern Detection Hook (20 minutes)

### File: `apps/orchestrator_3_stream/backend/modules/pattern_hooks.py`

```python
"""
Pattern Detection Hooks

Hooks for detecting patterns in agent tool usage.
"""

from typing import Callable, Dict, Any
from uuid import UUID

from .pattern_manager import PatternManager
from .logger import OrchestratorLogger
from .websocket_manager import WebSocketManager


def create_pattern_detection_hook(
    agent_id: UUID,
    agent_name: str,
    task_slug: str,
    pattern_manager: PatternManager,
    logger: OrchestratorLogger,
    ws_manager: WebSocketManager
) -> Callable:
    """
    Create PostToolUse hook for pattern detection.

    This hook runs AFTER each tool use to record patterns without
    interfering with agent execution.

    Args:
        agent_id: UUID of agent
        agent_name: Name of agent
        task_slug: Current task identifier
        pattern_manager: PatternManager instance
        logger: Logger instance
        ws_manager: WebSocket manager for broadcasting

    Returns:
        Async hook function
    """

    async def pattern_detection_hook(
        tool_name: str,
        tool_input: Dict[str, Any],
        tool_result: Any,
        **kwargs
    ) -> None:
        """
        Hook that runs after each tool use.

        Records tool usage and checks for patterns.
        """
        try:
            # Check if observe mode enabled
            observe_enabled = await pattern_manager.is_observe_mode_enabled(agent_id)
            if not observe_enabled:
                return

            # Only track certain tools (file operations, searches)
            trackable_tools = ["Read", "Glob", "Grep", "Edit", "Write"]
            if tool_name not in trackable_tools:
                return

            # Record tool use
            result_str = str(tool_result) if tool_result else ""
            pattern_manager.detector.record_tool_use(
                agent_id=agent_id,
                tool_name=tool_name,
                params=tool_input or {},
                result=result_str[:500]  # Truncate for storage
            )

            logger.debug(
                f"[PatternDetection] Agent={agent_name} used {tool_name}, "
                f"sequence length={len(pattern_manager.detector.current_sequence.get(agent_id, {}).get('tools', []))}"
            )

        except Exception as e:
            logger.error(f"[PatternDetection] Error in hook: {e}", exc_info=True)
            # Don't raise - pattern detection should never break agent execution

    return pattern_detection_hook


def create_pattern_stop_hook(
    agent_id: UUID,
    agent_name: str,
    task_slug: str,
    pattern_manager: PatternManager,
    logger: OrchestratorLogger,
    ws_manager: WebSocketManager
) -> Callable:
    """
    Create Stop hook to finalize pattern detection.

    Runs when agent completes a task - checks for patterns in sequence.
    """

    async def pattern_stop_hook(**kwargs) -> None:
        """
        Hook that runs when agent stops.

        Finalizes sequence and detects patterns.
        """
        try:
            # Finish current sequence and check for patterns
            detected_pattern = pattern_manager.detector.finish_sequence(
                agent_id=agent_id,
                success=True  # Assume success unless error handler sets false
            )

            if detected_pattern:
                # Pattern detected! Store in database
                success = await pattern_manager.add_pattern(agent_id, detected_pattern)

                if success:
                    logger.info(
                        f"✨ [PatternLearned] Agent={agent_name} learned pattern "
                        f"'{detected_pattern.name}' (confidence={detected_pattern.statistics['confidence']:.0%})"
                    )

                    # Broadcast to WebSocket
                    await ws_manager.broadcast({
                        "type": "pattern_learned",
                        "data": {
                            "agent_id": str(agent_id),
                            "agent_name": agent_name,
                            "pattern_id": detected_pattern.id,
                            "pattern_name": detected_pattern.name,
                            "confidence": detected_pattern.statistics['confidence'],
                            "usage_count": detected_pattern.statistics['usage_count']
                        }
                    })

        except Exception as e:
            logger.error(f"[PatternDetection] Error in stop hook: {e}", exc_info=True)

    return pattern_stop_hook
```

---

## Step 4: Integrate Hooks into Agent Manager (15 minutes)

### File: `apps/orchestrator_3_stream/backend/modules/agent_manager.py`

**Add imports** (top of file):
```python
from .pattern_manager import PatternManager
from .pattern_hooks import create_pattern_detection_hook, create_pattern_stop_hook
```

**Update `__init__` method** (around line 70):
```python
def __init__(
    self,
    orchestrator_agent_id: uuid.UUID,
    ws_manager: WebSocketManager,
    logger: OrchestratorLogger,
    working_dir: Optional[str] = None,
):
    # ... existing initialization ...

    # File tracking registry (keyed by agent_id)
    self.file_trackers: Dict[str, FileTracker] = {}

    # NEW: Pattern management
    self.pattern_manager = PatternManager(db_pool=None, logger=self.logger)
    # Note: db_pool will be set from database.get_pool() when needed

    self.logger.info(f"AgentManager initialized with pattern detection support")
```

**Update `_build_hooks_for_agent` method** (around line 895):
```python
def _build_hooks_for_agent(
    self,
    agent_id: uuid.UUID,
    agent_name: str,
    task_slug: str,
    entry_counter: Dict[str, int],
) -> Dict[str, Any]:
    """Build hooks dictionary for agent."""

    # Get file tracker for this agent
    file_tracker = self.file_trackers.get(str(agent_id))

    # Build PostToolUse hooks list
    post_tool_hooks = [
        create_post_tool_hook(...),  # Existing
    ]

    # Add file tracking hook if available
    if file_tracker:
        post_tool_hooks.append(
            create_post_tool_file_tracking_hook(...)  # Existing
        )

    # NEW: Add pattern detection hook
    post_tool_hooks.append(
        create_pattern_detection_hook(
            agent_id=agent_id,
            agent_name=agent_name,
            task_slug=task_slug,
            pattern_manager=self.pattern_manager,
            logger=self.logger,
            ws_manager=self.ws_manager
        )
    )

    return {
        "PreToolUse": [...],  # Existing
        "PostToolUse": [HookMatcher(hooks=post_tool_hooks)],
        "UserPromptSubmit": [...],  # Existing
        "Stop": [
            HookMatcher(hooks=[
                create_stop_hook(...),  # Existing
                create_pattern_stop_hook(  # NEW
                    agent_id=agent_id,
                    agent_name=agent_name,
                    task_slug=task_slug,
                    pattern_manager=self.pattern_manager,
                    logger=self.logger,
                    ws_manager=self.ws_manager
                )
            ])
        ],
        # ... other hooks
    }
```

**Update `command_agent` method** to start sequence (around line 790):
```python
async def command_agent(
    self,
    agent_id: uuid.UUID,
    command: str,
    task_slug: Optional[str] = None
) -> Dict[str, Any]:
    # ... existing setup ...

    # NEW: Start pattern detection sequence
    self.pattern_manager.detector.start_sequence(agent_id, task_slug)

    # Execute agent
    async with ClaudeSDKClient(options=options) as client:
        # ... existing execution ...
```

---

## Step 5: Write Unit Tests (30 minutes)

### File: `apps/orchestrator_3_stream/backend/tests/test_pattern_detection.py`

```python
"""
Unit tests for pattern detection.
"""

import pytest
from uuid import uuid4
from datetime import datetime, timezone

from modules.pattern_detector import (
    PatternDetector,
    ToolSequence,
    ToolInvocation,
    CrystallizedPattern
)


class TestPatternDetector:
    """Test PatternDetector class"""

    def test_records_tool_use(self):
        """Test recording tool invocations"""
        detector = PatternDetector(min_repetitions=3)
        agent_id = uuid4()
        task_slug = "test-task"

        # Start sequence
        detector.start_sequence(agent_id, task_slug)

        # Record tools
        detector.record_tool_use(agent_id, "Glob", {"pattern": "*.py"}, "Found 5 files")
        detector.record_tool_use(agent_id, "Read", {"file_path": "main.py"}, "Contents...")

        # Check sequence
        current = detector.current_sequence.get(agent_id)
        assert current is not None
        assert len(current.tools) == 2
        assert current.tools[0].tool_name == "Glob"
        assert current.tools[1].tool_name == "Read"

    def test_detects_pattern_after_threshold(self):
        """Test pattern detection after min repetitions"""
        detector = PatternDetector(min_repetitions=3)
        agent_id = uuid4()

        # Execute same sequence 3 times
        for i in range(3):
            task_slug = f"task-{i}"
            detector.start_sequence(agent_id, task_slug)
            detector.record_tool_use(agent_id, "Glob", {"pattern": "*.py"}, "Found files")
            detector.record_tool_use(agent_id, "Read", {"file_path": "main.py"}, "Contents")

            pattern = detector.finish_sequence(agent_id, success=True)

            if i < 2:
                # First 2 times - no pattern yet
                assert pattern is None
            else:
                # 3rd time - pattern detected!
                assert pattern is not None
                assert pattern.name == "Glob → Read"
                assert pattern.statistics['usage_count'] == 3
                assert pattern.statistics['success_rate'] == 1.0

    def test_signature_matching(self):
        """Test sequence signature generation"""
        seq1 = ToolSequence(
            agent_id=uuid4(),
            task_slug="test",
            tools=[
                ToolInvocation("Glob", {"pattern": "*.py"}, "result"),
                ToolInvocation("Read", {"file_path": "a.py"}, "result")
            ]
        )

        seq2 = ToolSequence(
            agent_id=uuid4(),
            task_slug="test",
            tools=[
                ToolInvocation("Glob", {"pattern": "*.js"}, "result"),  # Different value
                ToolInvocation("Read", {"file_path": "b.js"}, "result")  # Different file
            ]
        )

        # Same structure, different values → same signature
        assert seq1.to_signature() == seq2.to_signature()

    def test_ignores_short_sequences(self):
        """Test that single-tool sequences are ignored"""
        detector = PatternDetector(min_repetitions=3)
        agent_id = uuid4()

        for i in range(5):
            detector.start_sequence(agent_id, f"task-{i}")
            detector.record_tool_use(agent_id, "Read", {"file_path": "test.py"}, "Contents")
            pattern = detector.finish_sequence(agent_id)

            # Single-tool sequences should not create patterns
            assert pattern is None


@pytest.mark.asyncio
class TestPatternManager:
    """Test PatternManager class"""

    async def test_stores_pattern_in_metadata(self, mock_db):
        """Test pattern storage in agent metadata"""
        from modules.pattern_manager import PatternManager

        manager = PatternManager(mock_db, mock_logger)
        agent_id = uuid4()

        # Create test pattern
        pattern = CrystallizedPattern(
            id="test_pattern",
            name="Test Pattern",
            description="Test",
            sequence=[{"tool": "Glob"}, {"tool": "Read"}],
            triggers={"keywords": ["test"]},
            statistics={"usage_count": 3, "success_rate": 1.0},
            learned_from={"task_slugs": ["task1"]}
        )

        # Store pattern
        success = await manager.add_pattern(agent_id, pattern)
        assert success

        # Retrieve patterns
        patterns = await manager.get_patterns(agent_id)
        assert len(patterns) == 1
        assert patterns[0]['name'] == "Test Pattern"
```

---

## Step 6: Run Tests and Verify (15 minutes)

```bash
cd apps/orchestrator_3_stream/backend

# Run pattern detection tests
uv run pytest tests/test_pattern_detection.py -v

# Expected output:
# test_records_tool_use PASSED
# test_detects_pattern_after_threshold PASSED
# test_signature_matching PASSED
# test_ignores_short_sequences PASSED
# test_stores_pattern_in_metadata PASSED
```

---

## Step 7: Manual Testing (20 minutes)

### Start Orchestrator with Pattern Detection

```bash
cd apps/orchestrator_3_stream

# Start backend
cd backend
uv run python main.py

# Start frontend (separate terminal)
cd frontend
npm run dev
```

### Create Test Agent

In orchestrator frontend:

```
User: create_agent(name="pattern-test", system_prompt="You are a test agent for pattern detection", model="haiku")

Agent: ✅ Created agent 'pattern-test'
```

### Execute Repetitive Tasks

```
User: command_agent(agent_name="pattern-test", command="Read the backend modules directory. First glob for Python files, then read __init__.py")

Agent: [Executes: Glob backend/modules/*.py → Read backend/modules/__init__.py]

# Repeat 2 more times with slight variations
User: command_agent(agent_name="pattern-test", command="Check the backend modules - glob all Python files and read the init file")

User: command_agent(agent_name="pattern-test", command="Inspect backend modules structure")

# After 3rd execution, check logs for:
# ✨ [PatternLearned] Agent=pattern-test learned pattern 'Glob → Read' (confidence=100%)
```

### Verify Pattern Stored

```bash
# Query database
psql $DATABASE_URL -c "SELECT metadata->'crystallized_patterns' FROM agents WHERE name = 'pattern-test';"

# Should show:
# {
#   "version": "1.0",
#   "patterns": [
#     {
#       "id": "pattern_abc123",
#       "name": "Glob → Read",
#       "sequence": [...],
#       "statistics": {"usage_count": 3, ...}
#     }
#   ]
# }
```

---

## Troubleshooting

### Hook Not Firing

**Symptom**: No pattern detection logs

**Solution**:
```python
# Add debug logging in pattern_hooks.py
logger.info(f"🔍 Pattern hook fired: tool={tool_name}, agent={agent_name}")
```

### Pattern Not Stored

**Symptom**: Pattern detected but not in database

**Solution**:
```python
# Check database connection in pattern_manager.py
from .database import get_pool
self.db = get_pool()  # Ensure pool is set
```

### Tests Failing

**Symptom**: Import errors or test failures

**Solution**:
```bash
# Ensure dependencies installed
uv pip install pytest pytest-asyncio

# Run with verbose output
uv run pytest tests/test_pattern_detection.py -vv
```

---

## Next Steps

After completing Phase 1 foundation:

1. **Create slash commands** (Phase 2)
   - `/nav:explore.md`
   - `/crystal-patterns.md`

2. **Implement pattern usage** (Phase 3)
   - Navigation assistant
   - Context injection

3. **Build frontend UI** (Phase 4)
   - Pattern visualization
   - Observe mode toggle

---

## Success Criteria

✅ **Pattern Detection Working**
```bash
# Check logs for pattern learning
tail -f logs/orchestrator.log | grep PatternLearned
```

✅ **Patterns Stored in Database**
```sql
SELECT name, metadata->'crystallized_patterns'->'patterns'
FROM agents
WHERE name = 'pattern-test';
```

✅ **Tests Passing**
```bash
uv run pytest tests/test_pattern_detection.py -v
# All tests should pass
```

✅ **No Performance Degradation**
- Agent execution time should not increase
- Hook latency < 50ms

---

## Estimated Time Breakdown

| Step | Time | Cumulative |
|------|------|------------|
| 1. Pattern Detector | 30 min | 30 min |
| 2. Pattern Manager | 20 min | 50 min |
| 3. Hooks | 20 min | 70 min |
| 4. Integration | 15 min | 85 min |
| 5. Unit Tests | 30 min | 115 min |
| 6. Run Tests | 15 min | 130 min |
| 7. Manual Testing | 20 min | 150 min |

**Total**: ~2.5 hours for complete Phase 1 implementation

---

## Questions?

Refer to:
- **Strategy Document**: `specs/crystallized_context_integration_strategy.md`
- **Executive Summary**: `specs/crystallized_context_executive_summary.md`
- **Architecture Docs**: `docs/architecture.md`

---

**Status**: Ready to implement
**Phase**: 1 (Foundation)
**Target**: First working pattern detection
