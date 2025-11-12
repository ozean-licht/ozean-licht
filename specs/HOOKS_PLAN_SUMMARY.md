# Hooks Simplification Plan - Executive Summary

## Document Overview
A comprehensive 945-line implementation plan for transforming the Claude Code hooks system from an over-engineered 120MB TypeScript monstrosity to a lean, fast, bash-based implementation.

**Location:** `/opt/ozean-licht-ecosystem/specs/hooks-simplification-plan.md`

---

## The Problem (Current State)

### Statistics
- **Size:** 120MB total (119MB is just node_modules)
- **Execution Time:** 1.8 seconds per hook (should be < 100ms)
- **Code:** 725 lines of TypeScript
- **Dependencies:** 46 npm packages
- **Build Infrastructure:** TypeScript, Jest, ESLint, Prettier

### Root Cause
Hooks violate Claude Code best practices which specify:
- Simple bash scripts (not TypeScript applications)
- JSON input via stdin, JSON output via stdout
- Exit codes: 0=continue, 2=block, other=error
- No build steps, minimal dependencies
- < 100ms execution time

**Instead, the system uses:**
- Complex TypeScript handlers
- `npx tsx` runtime transpilation (0.5-0.8s per hook)
- 119MB node_modules
- Full development infrastructure

---

## The Solution (Target State)

### Architecture
- **Size:** < 50KB total (2,400x reduction)
- **Execution Time:** 5-20ms per hook (90x faster)
- **Code:** ~100 lines total bash (7 hooks × 15 lines avg)
- **Dependencies:** Zero (except jq for JSON parsing)
- **Build:** None required

### Why This Works
- Pure bash is 360x faster than TypeScript + npx tsx
- Bash is the only language Claude Code hooks support natively
- jq provides all needed JSON functionality
- Simple validation logic fits in 10-20 lines

---

## Implementation Plan Structure

### Phase 1: Analysis & Design (45 minutes)
**Tasks:**
1. Functional inventory of current hooks
2. API contract definition
3. Simplified implementation patterns

**Deliverables:**
- Clear feature list per hook (essential vs. non-essential)
- Bash hook API specification
- Reusable bash patterns

---

### Phase 2: Implementation (2-3 hours)
**Tasks:**
1. Create simplified pre-tool-use hook (20 min)
2. Create simplified post-tool-use hook (15 min)
3. Create simplified session-start hook (15 min)
4. Create simplified session-end hook (10 min)
5. Create simplified stop hook (10 min)
6. Create simplified user-prompt-submit hook (15 min)
7. Create simplified pre-compact hook (10 min)
8. Quality assurance & testing (30 min)

**Each Hook:**
- Reduces from 60-150 lines TS to 8-20 lines bash
- Goes from 1.8s execution to 5-20ms
- Keeps essential safety features
- Includes comprehensive testing

---

### Phase 3: Cleanup & Verification (1 hour)
**Tasks:**
1. Delete over-engineered infrastructure (10 min)
   - Remove node_modules (119MB)
   - Remove dist directory (1MB)
   - Remove src, tests, TypeScript configs
   - Keep git history for rollback

2. Update & verify configuration (15 min)
   - Run verification script
   - Validate all hooks work

3. Update documentation (20 min)
   - Create README-SIMPLIFIED.md
   - Document migration path
   - Add usage examples

4. Final integration testing (15 min)
   - Test hooks fire in Claude Code
   - Test blocking works
   - Measure performance
   - Validate all features

---

## The 7 Hooks (Detailed Breakdown)

### 1. pre-tool-use (20 lines bash)
**Current:** 124 lines TypeScript
**Essential Features:**
- Block `rm -rf /` and destructive operations → exit 2
- Block `git push --force main` → exit 2
- Block `.env` file edits → exit 2
- Warn on sensitive file operations → exit 0 with message
- Allow safe commands → exit 0

**Non-Essential (Removed):**
- MCP Gateway async validation
- Complex validation chains
- Tool existence verification

---

### 2. post-tool-use (15 lines bash)
**Current:** 150 lines TypeScript
**Essential Features:**
- Log successful operations to audit trail
- Simple JSONL format: `{"timestamp":"...", "tool":"...", "status":"success"}`

**Non-Essential (Removed):**
- Complex pattern detection (deployment, errors, database)
- Memory integration
- Async memory operations

---

### 3. session-start (15 lines bash)
**Current:** 90 lines TypeScript
**Essential Features:**
- Report missing tools (Docker, git)
- Provide status message to user
- Never block session (always exit 0)

**Non-Essential (Removed):**
- Async health checks
- MCP Gateway validation
- Detailed metrics collection

---

### 4. session-end (8 lines bash)
**Current:** 60 lines TypeScript
**Essential Features:**
- Record session end timestamp
- Minimal cleanup

**Non-Essential (Removed):**
- Async memory operations
- Complex state management

---

### 5. stop (10 lines bash)
**Current:** 80 lines TypeScript
**Essential Features:**
- Provide session success/failure summary
- Simple status message

**Non-Essential (Removed):**
- Complex insight generation
- Memory saving
- Pattern analysis

---

### 6. user-prompt-submit (15 lines bash)
**Current:** 85 lines TypeScript
**Essential Features:**
- Read recent errors from audit log
- Inject as context for Claude
- Return via hookSpecificOutput

**Non-Essential (Removed):**
- Async memory retrieval
- MCP calls
- Complex context building

---

### 7. pre-compact (8 lines bash)
**Current:** 70 lines TypeScript
**Essential Features:**
- Back up context before compacting
- Handle missing context gracefully

**Non-Essential (Removed):**
- Async backup operations
- Memory integration

---

## Key Numbers

### Effort Estimate
- **Phase 1:** 45 minutes (analysis & design)
- **Phase 2:** 2-3 hours (implementation)
- **Phase 3:** 1 hour (cleanup & verification)
- **Total:** 4-4.5 hours

### Performance Gains
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Per-hook execution | 1.8s | 10-20ms | 90-180x faster |
| 20 tool calls | 36s | 200-400ms | 90-180x faster |
| Directory size | 120MB | < 50KB | 2,400x smaller |
| Dependencies | 46 npm packages | 1 (jq) | 46x reduction |

### Code Metrics
| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| Total TypeScript lines | 725 | 0 | 100% removed |
| Total bash lines | 0 | ~100 | N/A |
| build steps | 1 (tsc) | 0 | 100% removed |

---

## Risk Management

### High Risk
- **Breaking Existing Functionality**
  - Mitigation: Comprehensive testing before deletion
  - Rollback: Git history preserved
  - Timeline: Thorough Phase 2 testing

- **Claude Code Version Incompatibility**
  - Current: v2.0.36 (limited hook support)
  - Mitigation: Verify upgrade path
  - Rollback: Can revert to TypeScript if needed

### Medium Risk
- **Hook Timing Issues** - Add delays if needed, test with strace
- **JSON Parsing Failures** - Add error handling, test with malformed JSON

### Low Risk
- **Audit Log Growth** - Document rotation strategy later

---

## Success Criteria (All Required)

### Phase 1
- [ ] Functional inventory completed
- [ ] API contracts defined
- [ ] Implementation patterns documented

### Phase 2
- [ ] All 7 hooks implemented
- [ ] Each hook < 20ms execution
- [ ] All 35 unit tests passing
- [ ] Zero npm dependencies
- [ ] < 50KB total size

### Phase 3
- [ ] Node_modules deleted (119MB freed)
- [ ] Dist directory deleted (1MB freed)
- [ ] TypeScript infrastructure removed
- [ ] Configuration verified and working
- [ ] Documentation updated
- [ ] Integration tests passing
- [ ] Hooks fire correctly in Claude Code

### Overall
- [ ] 360x faster hooks
- [ ] 2,400x smaller footprint
- [ ] 100% Claude Code compliant
- [ ] Zero dependencies (except jq)
- [ ] All functionality preserved
- [ ] Git history maintained

---

## Testing Strategy (35 Total Tests)

### Unit Tests (5 per hook = 35 total)
- **pre-tool-use:** Blocking, warnings, safe commands, path validation, edge cases
- **post-tool-use:** Success logging, failure handling, log creation, format validation, timing
- **session-start:** Tool detection, message formatting, no blocking, multiple failures, clean state
- **session-end:** Timestamp recording, missing dir handling, state preservation, cleanup, edge cases
- **stop:** Success message, failure message, JSON formatting, edge cases, async safety
- **user-prompt-submit:** Error detection, context injection, missing logs, formatting, multiple errors
- **pre-compact:** Backup creation, missing context, overwrite handling, cleanup, edge cases

### Performance Tests
- Each hook < 20ms
- 10 sequential hooks < 200ms
- No memory leaks

### Security Tests
- `rm -rf /` blocked
- Force push blocked
- `.env` edits blocked
- Sensitive files protected

### Integration Tests
- Hooks fire in Claude Code
- Blocking prevents execution
- Audit logs created
- Context injected
- Session lifecycle works

---

## Dependencies & Prerequisites

### Required
- **Bash 4.0+** (already available)
- **jq** (lightweight JSON parser, ~300KB)
  - Install: `apt-get install jq` or `brew install jq`
  - Alternative: Any JSON CLI tool

### Optional
- **Claude Code v2.1+** (recommended)
  - Current: v2.0.36 (works but limited)
  - Upgrade path: `npm install -g @anthropic-ai/claude-code@latest`

### Development/Testing
- Standard bash test harness
- Unix tools (grep, sed, date, mkdir)

---

## Timeline

### Phase 1: 9:00 - 9:45 (45 min)
```
9:00 - 9:20   Task 1.1: Functional inventory (20 min)
9:20 - 9:35   Task 1.2: API contract definition (15 min)
9:35 - 9:45   Task 1.3: Implementation patterns (10 min)
```

### Phase 2: 10:00 - 12:05 (2h 5min)
```
10:00 - 10:20  Task 2.1: pre-tool-use (20 min)
10:20 - 10:35  Task 2.2: post-tool-use (15 min)
10:35 - 10:50  Task 2.3: session-start (15 min)
10:50 - 11:00  Task 2.4: session-end (10 min)
11:00 - 11:10  Task 2.5: stop (10 min)
11:10 - 11:25  Task 2.6: user-prompt-submit (15 min)
11:25 - 11:35  Task 2.7: pre-compact (10 min)
11:35 - 12:05  Task 2.8: Testing (30 min)
```

### Phase 3: 1:00 - 2:00 (1 hour)
```
1:00 - 1:10   Task 3.1: Delete infrastructure (10 min)
1:10 - 1:25   Task 3.2: Verify configuration (15 min)
1:25 - 1:45   Task 3.3: Update documentation (20 min)
1:45 - 2:00   Task 3.4: Integration testing (15 min)
```

**Total: 4-4.5 hours**

---

## Implementation Next Steps

1. **Review the full plan:** `/opt/ozean-licht-ecosystem/specs/hooks-simplification-plan.md`
2. **Start Phase 1:** Functional inventory and API contract design
3. **Implement Phase 2:** Create simplified bash hooks one by one
4. **Execute Phase 3:** Cleanup and final verification
5. **Commit changes:** Save as git commit with full implementation record

---

## Related Documentation

- `ai_docs/claude-code-hooks.md` - Official Claude Code hooks documentation
- `.claude/hooks/ANTI_PATTERN_ANALYSIS.md` - Detailed problem analysis
- `.claude/hooks/HOOK_EXECUTION_ANALYSIS.md` - Technical execution investigation
- `.claude/hooks/QUICK_FIX_GUIDE.md` - Quick fixes (superseded by this plan)

---

## References

- Claude Code Hooks: https://claude.ai/schemas/settings-v1.json
- Bash Best Practices: https://mywiki.wooledge.org/BashGuide
- JSON in Bash: https://stedolan.github.io/jq/manual/
- Security Practices: https://cheatsheetseries.owasp.org/
