# Plan: TypeScript Hooks for Agentic Layer Enhancement

## Task Description

Implement a comprehensive Claude Code hooks system using TypeScript to enhance the agentic layer in the Ozean Licht ecosystem. The hooks will integrate with existing infrastructure (54+ tools, 15 slash commands, 8 subagents, MCP Gateway, Mem0 memory system) to provide automated validation, memory persistence, code review enforcement, and intelligent workflow orchestration.

## Objective

Create a production-ready hooks infrastructure in `/.claude/hooks/` using TypeScript that:
- Validates tool usage and prevents errors before execution
- Automatically saves valuable patterns to institutional memory (Mem0)
- Enforces code quality through pre-commit validation
- Monitors MCP Gateway operations and resource usage
- Provides context-aware session lifecycle management
- Integrates seamlessly with the progressive disclosure tool system
- Supports the Phase 1 admin dashboard deployment workflow

## Problem Statement

Currently, the ecosystem lacks automated guardrails and learning mechanisms:
1. **No pre-flight validation**: Tools can be misused without warnings
2. **Manual memory management**: Valuable patterns aren't automatically captured
3. **Missing code quality gates**: Changes can bypass review requirements
4. **Limited visibility**: MCP Gateway and tool operations lack automated monitoring
5. **Context pollution**: No automated cleanup or session optimization
6. **TypeScript gap**: Existing hook examples are bash/Python, not aligned with TS migration

## Solution Approach

Build a modular TypeScript-based hooks system with:
- **Type-safe hook handlers** using Zod for JSON validation
- **Shared utilities** for common operations (MCP calls, memory saves, git ops)
- **Event-driven architecture** matching Claude Code's lifecycle events
- **Progressive disclosure integration** leveraging the existing tool catalog
- **Graceful degradation** with proper error handling and exit codes
- **Development tooling** for testing and debugging hooks locally

## Relevant Files

### Existing Infrastructure to Integrate With
- `.claude/commands/*.md` - 15 slash commands that will trigger hooks
- `.claude/agents/*.md` - 8 subagents whose lifecycle hooks can enhance
- `tools/memory/*.sh` - Memory system hooks should integrate with
- `tools/mcp-gateway/` - TypeScript patterns to follow for hooks
- `tools/inventory/tool-catalog.json` - Tool metadata for validation hooks
- `ai_docs/claude-code-hooks.md` - Hook system reference documentation
- `CONTEXT_MAP.md` - Navigation guide for hook context awareness

### New Files to Create

#### Core Hook Infrastructure
- `/.claude/hooks/README.md` - Hook system documentation
- `/.claude/hooks/package.json` - TypeScript dependencies and scripts
- `/.claude/hooks/tsconfig.json` - TypeScript configuration
- `/.claude/hooks/.env.example` - Environment configuration template
- `/.claude/hooks/src/types/index.ts` - Shared TypeScript types
- `/.claude/hooks/src/utils/logger.ts` - Structured logging utility
- `/.claude/hooks/src/utils/mcp-client.ts` - MCP Gateway client wrapper
- `/.claude/hooks/src/utils/memory.ts` - Mem0 integration helpers
- `/.claude/hooks/src/utils/git.ts` - Git operations helpers
- `/.claude/hooks/src/utils/validation.ts` - Common validation logic

#### Hook Handlers (Event-Specific)
- `/.claude/hooks/src/handlers/pre-tool-use.ts` - Pre-execution validation
- `/.claude/hooks/src/handlers/post-tool-use.ts` - Post-execution learning
- `/.claude/hooks/src/handlers/user-prompt-submit.ts` - Context injection
- `/.claude/hooks/src/handlers/stop.ts` - Memory persistence
- `/.claude/hooks/src/handlers/session-start.ts` - Environment setup
- `/.claude/hooks/src/handlers/session-end.ts` - Cleanup operations
- `/.claude/hooks/src/handlers/pre-compact.ts` - Context optimization

#### Hook Entry Points (Executable Scripts)
- `/.claude/hooks/pre-tool-use` - Bash wrapper calling TypeScript handler
- `/.claude/hooks/post-tool-use` - Bash wrapper calling TypeScript handler
- `/.claude/hooks/user-prompt-submit` - Bash wrapper calling TypeScript handler
- `/.claude/hooks/stop` - Bash wrapper calling TypeScript handler
- `/.claude/hooks/session-start` - Bash wrapper calling TypeScript handler
- `/.claude/hooks/session-end` - Bash wrapper calling TypeScript handler
- `/.claude/hooks/pre-compact` - Bash wrapper calling TypeScript handler

#### Configuration & Testing
- `/.claude/hooks/src/config/rules.ts` - Validation rules and policies
- `/.claude/hooks/src/config/patterns.ts` - Memory pattern templates
- `/.claude/hooks/tests/unit/` - Unit test directory
- `/.claude/hooks/tests/integration/` - Integration test directory
- `/.claude/hooks/tests/fixtures/` - Test data and mocks

#### Settings Integration
- `/.claude/settings.json` - Hook configuration and matchers

## Implementation Phases

### Phase 1: Foundation (Hours 1-3)

**Setup TypeScript infrastructure**
- Initialize npm project with TypeScript, tsx, Zod, axios
- Configure tsconfig for Node.js ES modules with strict mode
- Create type definitions matching Claude Code hook JSON schema
- Build shared utilities (logger, MCP client, memory helpers)
- Implement bash wrapper pattern for executable hooks

**Deliverables:**
- Working TypeScript build system
- Reusable utility functions
- Logger with structured output
- MCP Gateway integration client

### Phase 2: Core Hooks (Hours 4-8)

**Implement essential event handlers**
- **PreToolUse**: Validate tool usage against catalog, check MCP Gateway health
- **PostToolUse**: Capture successful patterns, log metrics
- **Stop**: Auto-save valuable insights to Mem0 when complex tasks complete
- **SessionStart**: Initialize environment, check service availability
- **SessionEnd**: Generate session summary, cleanup temp resources

**Deliverables:**
- 5 working hook handlers with TypeScript implementation
- Bash wrapper scripts for each hook
- JSON output matching Claude Code's expected schema
- Proper exit code handling (0 = success, 2 = block, other = warn)

### Phase 3: Integration & Polish (Hours 9-12)

**Advanced features and optimization**
- **UserPromptSubmit**: Inject context from memory system based on task
- **PreCompact**: Identify and preserve critical context before compacting
- Settings.json configuration with matchers for specific tools
- Error recovery and graceful degradation
- Performance optimization (caching, async operations)
- Comprehensive testing suite

**Deliverables:**
- Complete hook system with all events covered
- Settings.json with intelligent matchers
- Test suite with 80%+ coverage
- Documentation and examples

## Step by Step Tasks

### 1. Initialize TypeScript Hook Infrastructure

- Create `/.claude/hooks/` directory structure
- Run `npm init -y` in hooks directory
- Install dependencies: `npm install tsx typescript zod axios dotenv @types/node`
- Install dev dependencies: `npm install -D jest @types/jest ts-jest`
- Configure `tsconfig.json` with strict mode and ES2022 target
- Create `.env.example` with `MCP_GATEWAY_URL=http://localhost:8100`
- Add npm scripts: `build`, `dev`, `test`, `type-check`

### 2. Define Core Types and Interfaces

- Create `src/types/index.ts` with hook input/output interfaces
- Define `HookInput` type matching stdin JSON schema from docs
- Define `HookOutput` type with `continue`, `stopReason`, `suppressOutput`, etc.
- Create `ToolMetadata` type aligned with tool-catalog.json structure
- Define `MemoryPattern` type for structured memory saving
- Export all types for handler consumption

### 3. Build Shared Utility Functions

- **Logger** (`src/utils/logger.ts`):
  - Structured logging to stderr (won't pollute stdout)
  - Log levels: DEBUG, INFO, WARN, ERROR
  - JSON formatting for easy parsing
  - Environment-based verbosity control

- **MCP Client** (`src/utils/mcp-client.ts`):
  - Axios-based client for MCP Gateway at localhost:8100
  - Health check function: `checkHealth()`
  - Memory operations: `saveMemory()`, `searchMemory()`
  - Error handling with retry logic (3 attempts, exponential backoff)
  - Timeout configuration (default 5s)

- **Memory Helpers** (`src/utils/memory.ts`):
  - Pattern detection from tool usage sequences
  - Auto-categorization (pattern, decision, solution, error, workflow)
  - Deduplication check before saving
  - Structured metadata generation

- **Git Helpers** (`src/utils/git.ts`):
  - Execute git commands safely with proper escaping
  - Parse git status and diff output
  - Detect staged changes and file types
  - Branch and commit information extraction

- **Validation** (`src/utils/validation.ts`):
  - Load tool catalog from `tools/inventory/tool-catalog.json`
  - Validate tool names against catalog
  - Check required parameters
  - Suggest alternatives for deprecated tools

### 4. Implement PreToolUse Hook

- Create `src/handlers/pre-tool-use.ts`
- Read and parse stdin JSON (tool name, arguments, etc.)
- Validate tool exists in catalog and is not deprecated
- Check MCP Gateway health if tool requires it
- Verify required environment variables for tool
- Block execution (exit 2) if critical issues found
- Return structured JSON with validation results
- Create bash wrapper `pre-tool-use` that calls `tsx src/handlers/pre-tool-use.ts`

**Validation Rules:**
- Block direct database access without MCP Gateway
- Warn on deprecated tool usage with migration path
- Prevent destructive git operations on main branch
- Require confirmation for production deployments

### 5. Implement PostToolUse Hook

- Create `src/handlers/post-tool-use.ts`
- Parse tool execution results from stdin
- Detect successful patterns (e.g., deploy → health check → success)
- Log metrics (execution time, error rates) to stderr
- Auto-save to Mem0 if pattern is valuable
- Return success with optional context message
- Create bash wrapper `post-tool-use`

**Pattern Detection Logic:**
- Successful deployments → save deployment pattern
- Error resolutions → save solution pattern
- Tool combinations → save workflow pattern
- Performance optimizations → save optimization pattern

### 6. Implement Stop Hook (Memory Persistence)

- Create `src/handlers/stop.ts`
- Analyze conversation history from stdin (if available)
- Identify completed complex tasks (multi-step workflows)
- Extract key decisions and patterns
- Save to Mem0 with proper categorization
- Generate session summary for user
- Return success with summary message
- Create bash wrapper `stop`

**Auto-Save Triggers:**
- Completed feature implementation → save decision pattern
- Resolved complex error → save solution pattern
- Successful deployment workflow → save workflow pattern
- Architecture decision made → save decision pattern

### 7. Implement SessionStart Hook

- Create `src/handlers/session-start.ts`
- Check MCP Gateway availability
- Verify database connections
- Load relevant memories from previous sessions
- Set environment variables in `$CLAUDE_ENV_FILE`
- Initialize session tracking (start time, session ID)
- Return context with service status
- Create bash wrapper `session-start`

**Health Checks:**
- MCP Gateway health endpoint (localhost:8100/health)
- PostgreSQL connection via MCP
- Mem0 service availability
- Required environment variables present

### 8. Implement SessionEnd Hook

- Create `src/handlers/session-end.ts`
- Generate session summary (tasks completed, tools used)
- Save session insights to Mem0 if valuable
- Cleanup temporary resources
- Log final metrics
- Return success with session summary
- Create bash wrapper `session-end`

**Session Summary Includes:**
- Duration and tool usage statistics
- Successful completions vs errors
- Memory patterns saved
- Recommendations for next session

### 9. Implement UserPromptSubmit Hook

- Create `src/handlers/user-prompt-submit.ts`
- Parse user prompt from stdin
- Search Mem0 for relevant patterns matching prompt intent
- Inject top 3 relevant memories as context (via stdout)
- Return context that enhances Claude's response
- Create bash wrapper `user-prompt-submit`

**Context Injection Strategy:**
- Semantic search against Mem0 using prompt keywords
- Prioritize recent patterns (recency bias)
- Category-based filtering (prefer decisions for architecture questions)
- Format as structured markdown for easy parsing

### 10. Implement PreCompact Hook

- Create `src/handlers/pre-compact.ts`
- Analyze conversation context from stdin
- Identify critical information to preserve
- Mark important tool results for retention
- Return guidance for compaction strategy
- Create bash wrapper `pre-compact`

**Preservation Rules:**
- Keep error messages and resolutions
- Preserve deployment confirmations
- Retain architecture decisions
- Save important file paths and references

### 11. Configure Settings.json with Matchers

- Create `/.claude/settings.json`
- Define PreToolUse matchers for critical tools
- Configure PostToolUse for pattern learning
- Set up Stop hook for all conversations
- Enable SessionStart/End for lifecycle management
- Add UserPromptSubmit for context injection

**Example Matchers:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{"type": "command", "command": "/.claude/hooks/pre-tool-use"}]
      },
      {
        "matcher": "mcp__.*",
        "hooks": [{"type": "command", "command": "/.claude/hooks/pre-tool-use"}]
      }
    ],
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [{"type": "command", "command": "/.claude/hooks/post-tool-use"}]
      }
    ],
    "Stop": [
      {
        "hooks": [{"type": "command", "command": "/.claude/hooks/stop"}]
      }
    ],
    "SessionStart": [
      {
        "hooks": [{"type": "command", "command": "/.claude/hooks/session-start"}]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [{"type": "command", "command": "/.claude/hooks/session-end"}]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{"type": "command", "command": "/.claude/hooks/user-prompt-submit"}]
      }
    ]
  }
}
```

### 12. Create Validation Rules Configuration

- Create `src/config/rules.ts`
- Define tool validation policies
- Configure blocked operations (e.g., force push to main)
- Set warning thresholds (e.g., large file writes)
- Define auto-approval patterns (e.g., read-only operations)

**Rule Categories:**
- **Security**: Block exposed secrets, SQL injection patterns
- **Safety**: Warn on destructive operations, require confirmation
- **Performance**: Flag operations that may be slow or expensive
- **Best Practices**: Suggest better alternatives when available

### 13. Create Memory Pattern Templates

- Create `src/config/patterns.ts`
- Define pattern templates for each category
- Configure auto-save thresholds (when to save automatically)
- Set deduplication rules (prevent saving similar patterns)

**Pattern Templates:**
```typescript
export const PATTERN_TEMPLATES = {
  deployment: {
    category: 'workflow',
    requiredFields: ['service', 'steps', 'validation'],
    autoSave: true
  },
  error_resolution: {
    category: 'solution',
    requiredFields: ['error', 'cause', 'fix'],
    autoSave: true
  },
  architecture_decision: {
    category: 'decision',
    requiredFields: ['context', 'options', 'choice', 'rationale'],
    autoSave: true
  }
}
```

### 14. Write Comprehensive Tests

- Create unit tests for each utility function
- Test hook handlers with mock stdin inputs
- Integration tests for MCP Gateway communication
- End-to-end tests simulating real hook execution
- Test error handling and graceful degradation
- Verify exit codes and JSON output format

**Test Coverage Goals:**
- Utils: 90%+ coverage
- Handlers: 85%+ coverage
- Integration: Key workflows covered
- Error paths: All error branches tested

### 15. Create Documentation and Examples

- Write `/.claude/hooks/README.md` with:
  - Architecture overview
  - Hook execution flow diagrams
  - Configuration guide
  - Development workflow
  - Troubleshooting guide
  - Example use cases

- Document environment variables needed
- Provide example hook outputs for each event
- Create troubleshooting section for common issues
- Add performance tuning recommendations

### 16. Validate and Test Complete System

- Run all hooks in development mode with debug logging
- Test with actual Claude Code sessions
- Verify MCP Gateway integration works correctly
- Confirm memory patterns are saved appropriately
- Check that validations properly block/warn
- Ensure bash wrappers execute TypeScript correctly
- Test timeout handling (hooks complete within 60s)
- Verify no stdout pollution (only stderr for logs)

## Testing Strategy

### Unit Tests
- Test each utility function in isolation
- Mock external dependencies (MCP Gateway, file system, git)
- Verify type safety with TypeScript compiler
- Test edge cases and error conditions

### Integration Tests
- Test hook handlers with real stdin JSON inputs
- Verify MCP Gateway communication
- Test Mem0 integration with test data
- Validate git operations in test repository

### End-to-End Tests
- Simulate complete hook lifecycle
- Test PreToolUse → PostToolUse sequences
- Verify SessionStart → SessionEnd flow
- Test UserPromptSubmit context injection
- Validate Stop hook memory persistence

### Performance Tests
- Measure hook execution time (target < 2s for most hooks)
- Test concurrent hook execution
- Verify no memory leaks in long-running sessions
- Test timeout handling (60s limit)

## Acceptance Criteria

- [ ] TypeScript hook infrastructure successfully builds and runs
- [ ] All 7 hook handlers implemented with proper TypeScript types
- [ ] Bash wrapper scripts execute TypeScript handlers correctly
- [ ] Settings.json configured with intelligent matchers
- [ ] PreToolUse validates tools against catalog and blocks invalid usage
- [ ] PostToolUse automatically saves valuable patterns to Mem0
- [ ] Stop hook generates session summaries and persists insights
- [ ] SessionStart checks MCP Gateway and service health
- [ ] UserPromptSubmit injects relevant context from memory
- [ ] Hooks complete within timeout (< 60s, typically < 5s)
- [ ] Proper exit codes (0 = success, 2 = block, other = warn)
- [ ] JSON output matches Claude Code's expected schema
- [ ] No stdout pollution (only stderr for logging)
- [ ] Test suite achieves 80%+ coverage
- [ ] Documentation complete with examples and troubleshooting
- [ ] Successfully integrates with existing tool system and MCP Gateway
- [ ] Validated in real Claude Code sessions during Phase 1 admin deployment

## Validation Commands

Execute these commands to validate the implementation:

```bash
# TypeScript compilation
cd /.claude/hooks && npm run build

# Type checking
cd /.claude/hooks && npm run type-check

# Run tests
cd /.claude/hooks && npm test

# Test coverage
cd /.claude/hooks && npm run test -- --coverage

# Test individual hook in isolation
echo '{"tool":"Bash","args":{"command":"ls"}}' | /.claude/hooks/pre-tool-use

# Test MCP Gateway integration
cd /.claude/hooks && tsx src/utils/mcp-client.ts

# Validate settings.json syntax
cat /.claude/settings.json | jq '.'

# Test hook execution speed
time echo '{}' | /.claude/hooks/session-start

# Verify bash wrappers are executable
ls -la /.claude/hooks/ | grep -E '^-rwxr'

# Test memory saving
cd /.claude/hooks && tsx -e "import {saveMemory} from './src/utils/memory'; saveMemory('Test pattern').then(console.log)"

# Validate against tool catalog
cd /.claude/hooks && tsx -e "import {validateTool} from './src/utils/validation'; console.log(validateTool('Bash'))"
```

## Notes

### Dependencies to Install

```bash
# Core dependencies
npm install tsx typescript zod axios dotenv
npm install -D @types/node

# Testing dependencies
npm install -D jest @types/jest ts-jest

# Additional utilities
npm install uuid
npm install -D @types/uuid
```

### Environment Variables Required

Create `/.claude/hooks/.env`:
```bash
MCP_GATEWAY_URL=http://localhost:8100
HOOK_TIMEOUT=60000
LOG_LEVEL=info
MEMORY_AUTO_SAVE=true
MEMORY_MIN_COMPLEXITY=medium
```

### Integration with Existing Systems

**Tool Catalog Integration:**
- Hooks read from `tools/inventory/tool-catalog.json`
- Validation uses catalog metadata (tier, speed, auth requirements)
- Suggests alternatives from progressive disclosure system

**MCP Gateway Integration:**
- Hooks use MCP client wrapper for consistency
- Health checks before tool execution
- Metrics collection for monitoring

**Memory System Integration:**
- Auto-save patterns follow existing categories (pattern, decision, solution, error, workflow)
- Uses agent ID `agent_claude_code` for attribution
- Integrates with existing `tools/memory/*.sh` scripts

**Phase 1 Admin Deployment Support:**
- Pre-deployment validation hooks
- Auto-save successful deployment patterns
- Health check automation
- Error tracking and pattern learning

### Performance Considerations

- Hooks should complete in < 5s for most operations
- Use async/await for concurrent operations
- Cache tool catalog in memory
- Lazy-load MCP Gateway client
- Debounce memory saves to prevent duplicates

### Security Considerations

- Sanitize all inputs from stdin
- Validate JSON schema with Zod
- Escape shell commands in git operations
- Never log sensitive data (API keys, tokens)
- Use environment variables for secrets

### Future Enhancements

- Prompt hooks (LLM-based decisions) for complex validations
- Notification integration for critical events
- Dashboard for hook metrics and analytics
- A/B testing framework for hook rules
- Machine learning for pattern detection improvement
