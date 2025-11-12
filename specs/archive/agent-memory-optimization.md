# Plan: Agent Memory Optimization with Mem0

## Task Description
Optimize the agent memory layer (Mem0) to enable agents to proactively save valuable patterns for future friction reduction. Create helper scripts in the progressive disclosure system to make querying and saving memories easier, along with clear guidelines for when and what to remember.

## Objective
Create a streamlined memory system that:
1. Enables agents to easily identify and save valuable patterns
2. Provides intuitive CLI scripts for memory operations following the progressive disclosure pattern
3. Establishes clear guidelines for when agents should save learnings
4. Categorizes memories by type (patterns, decisions, solutions, errors) for better retrieval
5. Reduces friction in future agent workflows by leveraging institutional memory

## Problem Statement
Currently, while Mem0 is integrated into the MCP Gateway and used programmatically in ADW workflows, there are gaps:
- **No standardized patterns** for what constitutes a "valuable learning" worth saving
- **No easy CLI tools** for agents to quickly save/query memories during workflow execution
- **Limited categorization** - memories lack structured metadata for efficient retrieval
- **No proactive prompting** - agents must remember to use memory, rather than being guided
- **Missing documentation** - no clear guidelines on memory best practices for agents

This creates friction where agents repeatedly solve the same problems instead of learning from past experiences.

## Solution Approach
Implement a comprehensive memory enhancement system with three components:

### 1. Progressive Disclosure Integration
Add a new "memory" category to the tool system with scripts for:
- Quick memory saves with pattern categorization
- Semantic search across memories
- Memory listing and filtering
- Memory management (update, delete)

### 2. Pattern Library System
Create structured memory templates for common learning types:
- **Code Patterns**: Reusable implementation approaches
- **Decisions**: Architecture and design decisions with rationale
- **Solutions**: Problem-solution pairs for common issues
- **Errors**: Error patterns and their resolutions
- **Workflows**: Successful workflow sequences

### 3. Agent Guidelines Integration
Update agent documentation (`.claude/CLAUDE.md`) with:
- When to save memories (trigger conditions)
- What makes a pattern "valuable"
- How to categorize learnings
- Examples of good vs. poor memories

## Relevant Files

### Existing Files to Modify
- **`tools/what.sh`** - Add "memory" intent patterns for routing
- **`tools/discover.sh`** - Add memory category to main discovery menu
- **`.claude/CLAUDE.md`** - Add memory usage guidelines for agents
- **`CONTEXT_MAP.md`** - Document memory tools location and usage

### New Files to Create

#### Memory Category Scripts
- **`tools/memory/list.sh`** - Display all memory commands
- **`tools/memory/save.sh`** - Quick memory save with categorization
- **`tools/memory/search.sh`** - Semantic search through memories
- **`tools/memory/get.sh`** - Retrieve memories by agent/user ID
- **`tools/memory/patterns.sh`** - List saved patterns by category
- **`tools/memory/stats.sh`** - Memory usage statistics
- **`tools/memory/delete.sh`** - Delete specific memory
- **`tools/memory/health.sh`** - Check Mem0 service health

#### Documentation
- **`tools/memory/README.md`** - Memory category documentation
- **`tools/memory/PATTERNS.md`** - Pattern library templates
- **`specs/memory-guidelines-for-agents.md`** - Comprehensive agent guide

#### Integration
- **`tools/inventory/tool-catalog.json`** - Add memory tools to catalog

## Implementation Phases

### Phase 1: Foundation - Memory Category Setup
1. Create `tools/memory/` directory structure
2. Implement core memory scripts (save, search, get)
3. Add memory category to progressive disclosure system
4. Test basic functionality with MCP Gateway

### Phase 2: Pattern Library & Templates
1. Design memory categorization system (5 types: patterns, decisions, solutions, errors, workflows)
2. Create pattern templates with structured metadata
3. Implement pattern-specific save operations
4. Build pattern listing and filtering

### Phase 3: Integration & Documentation
1. Update `.claude/CLAUDE.md` with memory guidelines
2. Update `CONTEXT_MAP.md` with memory tools
3. Create comprehensive pattern library documentation
4. Add memory scripts to tool catalog
5. Test with real agent workflows

## Step by Step Tasks

### 1. Create Memory Category Directory Structure
- Create `tools/memory/` directory
- Copy template structure from existing categories
- Set up shared script dependencies

### 2. Implement Core Memory Scripts

#### `tools/memory/list.sh`
- Display all memory commands with descriptions
- Show common workflows
- Include success rates from tool-state.json
- Follow progressive disclosure template format

#### `tools/memory/save.sh`
- Accept content and optional category as parameters
- Auto-detect agent ID from environment or context
- Add structured metadata (timestamp, category, source)
- Support pattern types: `pattern`, `decision`, `solution`, `error`, `workflow`
- Use MCP Gateway Mem0 handler via localhost
- Provide clear success/failure feedback

#### `tools/memory/search.sh`
- Accept search query as parameter
- Support optional filters (agent_id, category, date range)
- Display results with relevance scores
- Show content preview (first 100 chars)
- Support pagination for large result sets

#### `tools/memory/get.sh`
- Retrieve all memories for specific agent/user ID
- Support filtering by category
- Display with metadata
- Sort by timestamp (newest first)

### 3. Implement Advanced Memory Scripts

#### `tools/memory/patterns.sh`
- List saved patterns grouped by category
- Show pattern count per category
- Display most recent patterns
- Support category filtering

#### `tools/memory/stats.sh`
- Show total memory count
- Break down by category
- Display memories per agent
- Show storage usage trends
- Connect to Mem0 health endpoint

#### `tools/memory/health.sh`
- Check Mem0 service availability
- Show Qdrant connection status
- Display latency metrics
- Verify MCP Gateway connectivity

#### `tools/memory/delete.sh`
- Delete specific memory by ID
- Require confirmation
- Show memory content before deletion
- Support bulk delete by criteria (with extra confirmation)

### 4. Create Pattern Library Documentation

#### `tools/memory/PATTERNS.md`
Define templates for each pattern type:

**Code Pattern Template:**
```
Category: pattern
Type: code
Context: [When to use]
Problem: [What it solves]
Solution: [Implementation approach]
Example: [Code snippet or description]
Related: [Related patterns/tools]
```

**Decision Template:**
```
Category: decision
Context: [Situation requiring decision]
Options: [Alternatives considered]
Chosen: [Selected option]
Rationale: [Why this was chosen]
Trade-offs: [Known limitations]
Date: [When decided]
```

**Solution Template:**
```
Category: solution
Problem: [Specific issue]
Symptoms: [How it manifests]
Root Cause: [Why it happens]
Solution: [How to fix]
Prevention: [How to avoid]
Files: [Related file paths]
```

**Error Template:**
```
Category: error
Error: [Error message/type]
Context: [When it occurred]
Resolution: [How fixed]
Prevention: [How to avoid]
Tools: [Tools used to debug]
```

**Workflow Template:**
```
Category: workflow
Task: [What was accomplished]
Steps: [Sequence of actions]
Tools: [Tools used]
Duration: [Time taken]
Success: [Outcome]
Learnings: [Key takeaways]
```

### 5. Integrate with Progressive Disclosure System

#### Update `tools/what.sh`
Add intent mapping patterns:
```bash
["memory|remember|pattern|learn|recall|search"]="memory"
```

#### Update `tools/discover.sh`
Add memory category to main menu:
```
║ 🧠 memory - Institutional memory          ║
║    Save patterns, search learnings        ║
║    → bash tools/memory/list.sh            ║
```

### 6. Update Agent Documentation

#### Modify `.claude/CLAUDE.md`
Add new section after "Tool Selection":

```markdown
## Memory & Pattern Recognition

Use Mem0 to build institutional memory. Save valuable patterns to reduce friction in future workflows.

### When to Save Memories

**Save a memory when you:**
- ✅ Solve a non-trivial problem that could recur
- ✅ Make an architectural decision with important trade-offs
- ✅ Discover a useful code pattern or implementation approach
- ✅ Resolve an error that wasn't immediately obvious
- ✅ Complete a complex workflow that worked well
- ✅ Learn something about the codebase structure

**Don't save when:**
- ❌ Following standard documented procedures
- ❌ Making trivial changes (typo fixes, formatting)
- ❌ Information already in documentation
- ❌ One-off, context-specific solutions

### How to Save Memories

**Quick Save (Recommended):**
```bash
# Save with auto-categorization
bash tools/memory/save.sh "Use connection pooling for database queries to avoid timeout errors"

# Save with specific category
bash tools/memory/save.sh "Admin dashboard uses NextAuth for authentication" --category=decision

# Save a pattern
bash tools/memory/save.sh "Pattern: Use progressive disclosure to reduce context usage by 85%" --category=pattern
```

**Structured Save (For Complex Learnings):**
```bash
# Use pattern templates from tools/memory/PATTERNS.md
bash tools/memory/save.sh "$(cat <<'EOF'
Category: solution
Problem: MCP Gateway container failing health checks
Symptoms: 500 errors on /health endpoint, container restarts
Root Cause: PostgreSQL connection pool exhausted
Solution: Increased DB_POOL_MAX from 10 to 20 in .env
Prevention: Monitor pool metrics at /metrics endpoint
Files: tools/mcp-gateway/.env, tools/mcp-gateway/src/config/environment.ts
EOF
)" --category=solution
```

### How to Query Memories

**Before starting work, search for relevant patterns:**
```bash
# Semantic search
bash tools/memory/search.sh "database connection issues"
bash tools/memory/search.sh "authentication implementation"

# List patterns by category
bash tools/memory/patterns.sh --category=pattern
bash tools/memory/patterns.sh --category=solution

# Get all memories for current context
bash tools/memory/get.sh agent_claude_code
```

### Memory Best Practices

1. **Be Specific**: Include concrete details (file paths, error messages, tool versions)
2. **Add Context**: Explain when/why this matters
3. **Link Related Info**: Reference related patterns, files, or tools
4. **Use Categories**: Proper categorization improves retrieval
5. **Update Don't Duplicate**: Search first, update existing memories when appropriate
6. **Quality Over Quantity**: One good memory > five vague ones
```

#### Update `CONTEXT_MAP.md`
Add memory tools section:
```markdown
### Memory & Learning (New)

**Purpose:** Institutional memory for agents to save and retrieve patterns

**Quick Start:**
```bash
bash tools/memory/save.sh "your learning"       # Save pattern
bash tools/memory/search.sh "query"             # Search memories
bash tools/memory/patterns.sh --category=pattern # List patterns
```

**Categories:** Deployment, Containers, Monitoring, Database, Git, Remote, **Memory**
```

### 7. Create Memory Tool Integration Examples

#### Example 1: During Deployment
```bash
# After successful deployment
bash tools/deployment/deploy.sh 3
# If deployment succeeds with new approach
bash tools/memory/save.sh "Deployment: Always run health check before marking deployment complete" --category=workflow
```

#### Example 2: During Debugging
```bash
# Search for similar errors
bash tools/memory/search.sh "connection refused postgres"

# After fixing
bash tools/memory/save.sh "Error: Connection refused on PostgreSQL - check DB_POOL_MAX in .env was too low" --category=error
```

#### Example 3: During Development
```bash
# Before implementing auth
bash tools/memory/search.sh "authentication implementation"

# After implementation decision
bash tools/memory/save.sh "Decision: Using NextAuth for admin dashboard due to built-in session management and JWT support" --category=decision
```

### 8. Add Memory Tools to Tool Catalog

Update `tools/inventory/tool-catalog.json`:
```json
{
  "memory-cli": {
    "tier": 1,
    "category": "development",
    "speed": "instant",
    "use_cases": [
      "Save valuable patterns for future reference",
      "Search institutional memory",
      "Build agent knowledge base"
    ],
    "when_to_use": "Always use before and after solving non-trivial problems",
    "commands": {
      "save": "bash tools/memory/save.sh \"content\" --category=type",
      "search": "bash tools/memory/search.sh \"query\"",
      "patterns": "bash tools/memory/patterns.sh"
    }
  }
}
```

### 9. Create README Documentation

Create `tools/memory/README.md` with:
- Overview of memory system
- Quick start guide
- Command reference
- Pattern templates
- Best practices
- Examples from real workflows
- Troubleshooting

### 10. Test Memory System End-to-End

Test all scripts:
```bash
# 1. Test discovery
bash tools/discover.sh | grep memory

# 2. Test intent routing
bash tools/what.sh "save pattern"

# 3. Test save
bash tools/memory/save.sh "Test memory" --category=pattern

# 4. Test search
bash tools/memory/search.sh "test"

# 5. Test patterns listing
bash tools/memory/patterns.sh

# 6. Test health
bash tools/memory/health.sh

# 7. Test stats
bash tools/memory/stats.sh
```

### 11. Validate with Real Agent Workflow

Run a complete agent workflow and test memory integration:
1. Agent searches memory before starting task
2. Agent saves decision during planning
3. Agent saves pattern during implementation
4. Agent saves solution after debugging
5. Agent saves workflow after completion
6. Verify all memories are searchable and retrievable

## Testing Strategy

### Unit Tests
- Each memory script should handle:
  - Missing parameters (show usage)
  - Invalid categories (show valid options)
  - Mem0 service unavailable (graceful error)
  - Empty search results (helpful message)
  - Successful operations (clear confirmation)

### Integration Tests
- Test complete workflow: save → search → retrieve
- Test pattern categorization and filtering
- Test MCP Gateway integration
- Test progressive disclosure navigation
- Test tool catalog integration

### End-to-End Tests
- Real agent workflow with memory integration
- Verify memories persist across sessions
- Test search relevance and ranking
- Verify metadata is correctly stored
- Test concurrent memory operations

### Edge Cases
- Very long content (>10KB)
- Special characters in content
- Concurrent saves from multiple agents
- Search with no results
- Deleting non-existent memory
- Service downtime scenarios

## Acceptance Criteria

1. **Memory Category Created**
   - ✅ `tools/memory/` directory exists with 8+ scripts
   - ✅ All scripts follow progressive disclosure template
   - ✅ Scripts use MCP Gateway Mem0 handler

2. **Core Operations Work**
   - ✅ Can save memory with auto-generated metadata
   - ✅ Can search memories with semantic matching
   - ✅ Can retrieve memories by agent ID
   - ✅ Can list patterns by category
   - ✅ Can view memory statistics

3. **Progressive Disclosure Integration**
   - ✅ Memory category appears in `tools/discover.sh`
   - ✅ Intent routing works: `bash tools/what.sh "save pattern"`
   - ✅ Navigation works: discover → memory → list → command

4. **Pattern Library Established**
   - ✅ 5 pattern templates defined (pattern, decision, solution, error, workflow)
   - ✅ Template documentation in `tools/memory/PATTERNS.md`
   - ✅ Examples for each pattern type

5. **Agent Documentation Updated**
   - ✅ `.claude/CLAUDE.md` includes memory guidelines
   - ✅ Clear "when to save" criteria documented
   - ✅ Usage examples provided
   - ✅ Best practices listed

6. **Quality Checks**
   - ✅ All scripts have `--explain` support
   - ✅ Error messages are helpful
   - ✅ Success messages are clear
   - ✅ Scripts respect NO_COLOR environment variable
   - ✅ Performance is acceptable (<2s for operations)

7. **Real-World Validation**
   - ✅ Successfully used in at least one complete agent workflow
   - ✅ Memories are searchable and relevant
   - ✅ Agents can find and reuse saved patterns
   - ✅ Reduces friction in recurring problems

## Validation Commands

Execute these commands to validate the task is complete:

```bash
# 1. Verify directory structure
ls -la tools/memory/
# Expected: list.sh, save.sh, search.sh, get.sh, patterns.sh, stats.sh, health.sh, delete.sh, README.md, PATTERNS.md

# 2. Test progressive disclosure integration
bash tools/discover.sh | grep memory
# Expected: Memory category listed

# 3. Test intent routing
bash tools/what.sh "save pattern" | grep memory
# Expected: Routes to memory category

# 4. Test save operation
bash tools/memory/save.sh "Test pattern: Always validate inputs" --category=pattern
# Expected: Success message with memory ID

# 5. Test search operation
bash tools/memory/search.sh "validate inputs"
# Expected: Returns the saved test pattern

# 6. Test pattern listing
bash tools/memory/patterns.sh --category=pattern
# Expected: Lists patterns including test pattern

# 7. Test health check
bash tools/memory/health.sh
# Expected: Mem0 service status (healthy/unhealthy)

# 8. Test stats
bash tools/memory/stats.sh
# Expected: Memory count statistics

# 9. Verify documentation
cat .claude/CLAUDE.md | grep -A 20 "Memory & Pattern Recognition"
# Expected: Memory guidelines section present

# 10. Verify CONTEXT_MAP
cat CONTEXT_MAP.md | grep -A 10 "Memory & Learning"
# Expected: Memory tools documented

# 11. Test all scripts have explain mode
bash tools/memory/save.sh --explain
bash tools/memory/search.sh --explain
bash tools/memory/patterns.sh --explain
# Expected: Each shows detailed explanation

# 12. Test complete workflow
bash tools/memory/save.sh "Workflow test: Complete memory system" --category=workflow && \
bash tools/memory/search.sh "workflow test" && \
bash tools/memory/stats.sh
# Expected: All three commands succeed
```

## Notes

### Technical Considerations
- **MCP Gateway Integration**: All memory scripts use the existing MCP Gateway Mem0 handler (localhost bypass authentication)
- **No New Dependencies**: Uses existing MCP infrastructure, no additional services required
- **Metadata Strategy**: Structured metadata enables filtering and categorization
- **Performance**: Semantic search may take 2-5s depending on corpus size
- **Storage**: Qdrant backend handles vector storage, no size limits in MVP

### Pattern Library Growth
The pattern library will grow organically as agents use the system:
- Start with 5 core categories
- Add specialized categories as patterns emerge
- Periodically review and consolidate duplicate patterns
- Consider automated pattern mining from successful workflows

### Future Enhancements (Out of Scope)
- **Pattern Analytics**: Track which patterns are most frequently searched/used
- **Smart Recommendations**: Proactively suggest relevant patterns during workflows
- **Pattern Validation**: Community voting on pattern quality
- **Pattern Versioning**: Track pattern evolution over time
- **Cross-Agent Learning**: Share patterns between different agent instances
- **Pattern Synthesis**: AI-assisted pattern generation from multiple memories

### Integration with ADW
The ADW system (Autonomous Development Workflows) should:
1. Automatically save patterns at workflow completion
2. Search memory before planning phase
3. Include relevant patterns in agent context
4. Track pattern usage in workflow metrics

This requires updating ADW scripts (future task).

### Memory Hygiene
Consider implementing (future task):
- Periodic memory cleanup (remove outdated patterns)
- Memory deduplication (merge similar memories)
- Memory versioning (update instead of duplicate)
- Memory archival (move old memories to cold storage)
