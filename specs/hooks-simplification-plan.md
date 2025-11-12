# Hooks Simplification Implementation Plan

## Executive Summary

Transform the Claude Code hooks system from an over-engineered 120MB TypeScript monstrosity to a lean, fast, bash-based implementation following Claude Code best practices.

**Current State:** 120MB, 1.8 seconds per hook, 725 lines TypeScript, 46 npm dependencies
**Target State:** <50KB, <100ms per hook, 50-100 lines bash, zero npm dependencies

**Estimated Effort:** 4-6 hours spread across 3 phases
**Expected Benefit:** 360x faster hooks, 2,400x smaller footprint, 100% compliance with Claude Code standards

---

## Phase 1: Analysis & Design (45 minutes)

### Task 1.1: Functional Inventory - Document Current Behavior
**Time:** 20 minutes | **Owner:** Code Review | **Risk:** None

Extract what each hook currently does:

1. **pre-tool-use** (124 lines TypeScript)
   - Current: Validates tool existence, MCP Gateway availability, destructive ops, secret exposure, sensitive paths
   - Essential: Block `rm -rf /`, `git push --force main`, secret exposure
   - Non-essential: MCP Gateway async checks, complex validation chains

2. **post-tool-use** (150 lines TypeScript)
   - Current: Pattern detection (deployment, errors, database, git workflows), saves to memory
   - Essential: Log successful operations
   - Non-essential: Complex pattern detection, memory integration, async memory saving

3. **session-start** (90 lines TypeScript)
   - Current: Service health checks (Docker, MCP Gateway, PostgreSQL)
   - Essential: Inform user of critical issues
   - Non-essential: Async health checks, detailed metrics

4. **session-end** (60 lines TypeScript)
   - Current: Cleanup (process state, memory sync)
   - Essential: Minimal cleanup
   - Non-essential: Async memory operations, complex state management

5. **stop** (80 lines TypeScript)
   - Current: Saves session insights, pattern detection
   - Essential: Summary output
   - Non-essential: Complex insight generation, async memory

6. **user-prompt-submit** (85 lines TypeScript)
   - Current: Context injection, memory retrieval, service availability
   - Essential: Return JSON for context
   - Non-essential: Async memory retrieval, MCP calls

7. **pre-compact** (70 lines TypeScript)
   - Current: Context preservation, memory backup
   - Essential: Simple state preservation
   - Non-essential: Async backup operations, memory integration

**Deliverable:** Document showing essential vs. non-essential features for each hook
**Success Criteria:** Clear feature list per hook, decision on what stays

### Task 1.2: API Contract Definition
**Time:** 15 minutes | **Owner:** Architecture | **Risk:** Low

Define bash hook contracts based on Claude Code documentation:

```bash
# INPUT
# JSON via stdin with structure:
{
  "tool": "Bash|Write|Edit|etc",
  "args": {...},
  "result": {...},
  "error": {...}
}

# OUTPUT
# JSON to stdout:
{
  "continue": boolean,
  "stopReason": "string (optional)",
  "suppressOutput": boolean (optional),
  "systemMessage": "string (optional)"
}

# EXIT CODES
# 0 = success, continue
# 2 = block execution  
# other = error, non-blocking
```

**Deliverable:** Clear API specification for all hooks
**Success Criteria:** All team members understand input/output contract

### Task 1.3: Simplified Implementation Patterns
**Time:** 10 minutes | **Owner:** Architecture | **Risk:** Low

Define reusable bash patterns:

```bash
# Pattern 1: Simple validation
#!/usr/bin/env bash
set -euo pipefail
input=$(cat)
tool=$(echo "$input" | jq -r '.tool // ""')
# validation logic
echo '{"continue":true}'
exit 0

# Pattern 2: Blocking on condition
if [[ "$command" == *"rm -rf"* ]]; then
  echo '{"continue":false,"stopReason":"Dangerous command"}' >&2
  exit 2
fi

# Pattern 3: Context injection
context=$(echo "$input" | jq -r '.context')
echo '{"continue":true,"systemMessage":"'$context'"}'
exit 0
```

**Deliverable:** 5-10 reusable bash patterns
**Success Criteria:** Patterns cover all 7 hook use cases

---

## Phase 2: Implementation (2-3 hours)

### Task 2.1: Create Simplified pre-tool-use Hook
**Time:** 20 minutes | **Owner:** Engineering | **Complexity:** Low | **Risk:** Medium

Replace 124-line TypeScript with 20-line bash:

```bash
#!/usr/bin/env bash
# PreToolUse Hook - Validate tool usage before execution
# Exit: 0=continue, 2=block, other=error

set -euo pipefail

# Read JSON from stdin
input=$(cat)
tool=$(echo "$input" | jq -r '.tool // ""')
command=$(echo "$input" | jq -r '.args.command // "" | @uri')

# Block dangerous bash operations
if [[ "$tool" == "Bash" ]]; then
  case "$command" in
    *"rm -rf"*|*"rm -rf /"*) 
      echo '{"continue":false,"stopReason":"Blocked: rm -rf operations"}' >&2
      exit 2
      ;;
    *"git push"*"--force"*"main"*|*"git push"*"--force"*"origin/main"*)
      echo '{"continue":false,"stopReason":"Blocked: Force push to main"}' >&2
      exit 2
      ;;
    *"git reset"*"--hard"*|*"git rebase"*"--force"*)
      echo '{"continue":false,"stopReason":"Blocked: Destructive git operation"}' >&2
      exit 2
      ;;
  esac
  
  # Warn about sensitive file operations
  if [[ "$command" =~ ".env"|"credentials.json"|".git/" ]]; then
    echo '{"continue":true,"systemMessage":"⚠️ Warning: Operating on sensitive files"}' >&2
  fi
fi

# Block write/edit operations on dangerous files
if [[ "$tool" == "Write" ]] || [[ "$tool" == "Edit" ]]; then
  file=$(echo "$input" | jq -r '.args.path // ""')
  case "$file" in
    *".env"|*"credentials"*|*".git"*)
      echo '{"continue":false,"stopReason":"Blocked: Cannot edit sensitive files"}' >&2
      exit 2
      ;;
  esac
fi

# Allow by default
echo '{"continue":true}' >&2
exit 0
```

**Testing:**
```bash
# Should block
echo '{"tool":"Bash","args":{"command":"rm -rf /"}}' | ./pre-tool-use
# expect: exit 2

# Should warn
echo '{"tool":"Bash","args":{"command":"git push origin main"}}' | ./pre-tool-use
# expect: exit 0 with warning

# Should allow
echo '{"tool":"Bash","args":{"command":"ls -la"}}' | ./pre-tool-use
# expect: exit 0
```

**Deliverable:** Executable bash hook (~20 lines)
**Success Criteria:**
- Blocks `rm -rf /` → exit 2
- Blocks `git push --force main` → exit 2
- Blocks `.env` edits → exit 2
- Allows safe commands → exit 0
- Execution < 10ms

### Task 2.2: Create Simplified post-tool-use Hook
**Time:** 15 minutes | **Owner:** Engineering | **Complexity:** Low | **Risk:** Low

Replace 150-line TypeScript with 15-line bash:

```bash
#!/usr/bin/env bash
# PostToolUse Hook - Log and track successful operations
# Simply logs successful operations for audit trail

set -euo pipefail

input=$(cat)
tool=$(echo "$input" | jq -r '.tool // ""')
success=$(echo "$input" | jq -r '.success // false')

# Log successful operations to audit trail
if [[ "$success" == "true" ]]; then
  log_dir="${CLAUDE_PROJECT_DIR:-.}/.claude/audit"
  mkdir -p "$log_dir"
  
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "{\"timestamp\":\"$timestamp\",\"tool\":\"$tool\",\"status\":\"success\"}" \
    >> "$log_dir/operations.jsonl"
fi

# Allow by default (post-execution)
echo '{"continue":true}' >&2
exit 0
```

**Testing:**
```bash
# Log successful operation
echo '{"tool":"Bash","success":true}' | ./post-tool-use
# expect: exit 0, file created in .claude/audit/

# Non-successful operation (no log)
echo '{"tool":"Bash","success":false}' | ./post-tool-use
# expect: exit 0, no log entry
```

**Deliverable:** Executable bash hook (~15 lines)
**Success Criteria:**
- Creates audit log on success
- Handles missing .claude/audit directory
- Execution < 10ms

### Task 2.3: Create Simplified session-start Hook
**Time:** 15 minutes | **Owner:** Engineering | **Complexity:** Low | **Risk:** Low

Replace 90-line TypeScript with 12-line bash:

```bash
#!/usr/bin/env bash
# SessionStart Hook - Inform user of session status

set -euo pipefail

# Simple health checks (exit immediately on error, don't block)
checks_failed=()

# Quick Docker check
if ! command -v docker &> /dev/null; then
  checks_failed+=("Docker not found in PATH")
fi

# Quick git check
if ! command -v git &> /dev/null; then
  checks_failed+=("Git not found in PATH")
fi

# Build message if checks failed
if [[ ${#checks_failed[@]} -gt 0 ]]; then
  message="Session started with warnings:
$(printf '- %s\n' "${checks_failed[@]}")"
  echo "{\"continue\":true,\"systemMessage\":\"$message\"}" >&2
else
  echo '{"continue":true}' >&2
fi

exit 0
```

**Testing:**
```bash
# Should show checks passed or warnings
echo '{}' | ./session-start
# expect: exit 0 with status message
```

**Deliverable:** Executable bash hook (~15 lines)
**Success Criteria:**
- Reports missing tools
- Never blocks session (always exit 0)
- Execution < 10ms

### Task 2.4: Create Simplified session-end Hook
**Time:** 10 minutes | **Owner:** Engineering | **Complexity:** Low | **Risk:** Low

Replace 60-line TypeScript with 8-line bash:

```bash
#!/usr/bin/env bash
# SessionEnd Hook - Minimal cleanup

set -euo pipefail

# Optional: Update last session timestamp
if [[ -n "${CLAUDE_PROJECT_DIR:-}" ]]; then
  echo "$(date -u +%s)" > "${CLAUDE_PROJECT_DIR}/.claude/.last-session"
fi

echo '{"continue":true}' >&2
exit 0
```

**Deliverable:** Executable bash hook (~8 lines)
**Success Criteria:**
- Records session end time
- Execution < 5ms

### Task 2.5: Create Simplified stop Hook
**Time:** 10 minutes | **Owner:** Engineering | **Complexity:** Low | **Risk:** Low

Replace 80-line TypeScript with 10-line bash:

```bash
#!/usr/bin/env bash
# Stop Hook - Session summary

set -euo pipefail

input=$(cat)
success=$(echo "$input" | jq -r '.success // false')

if [[ "$success" == "true" ]]; then
  message="Session completed successfully"
else
  message="Session completed with errors - review logs"
fi

echo "{\"continue\":true,\"systemMessage\":\"$message\"}" >&2
exit 0
```

**Deliverable:** Executable bash hook (~10 lines)
**Success Criteria:**
- Provides session summary
- Execution < 5ms

### Task 2.6: Create Simplified user-prompt-submit Hook
**Time:** 15 minutes | **Owner:** Engineering | **Complexity:** Low | **Risk:** Low

Replace 85-line TypeScript with 12-line bash:

```bash
#!/usr/bin/env bash
# UserPromptSubmit Hook - Inject relevant context

set -euo pipefail

input=$(cat)
project_dir="${CLAUDE_PROJECT_DIR:-.}"

# Check for recent errors in logs
recent_errors=""
if [[ -f "$project_dir/.claude/audit/operations.jsonl" ]]; then
  recent_errors=$(grep -i "error" "$project_dir/.claude/audit/operations.jsonl" | tail -3 | jq -s '.' || echo "[]")
fi

# Return context (becomes part of system message)
if [[ "$recent_errors" != "[]" ]]; then
  echo "{\"continue\":true,\"hookSpecificOutput\":{\"recentErrors\":$recent_errors}}" >&2
else
  echo '{"continue":true}' >&2
fi

exit 0
```

**Deliverable:** Executable bash hook (~15 lines)
**Success Criteria:**
- Reads audit logs
- Injects error context
- Execution < 20ms

### Task 2.7: Create Simplified pre-compact Hook
**Time:** 10 minutes | **Owner:** Engineering | **Complexity:** Low | **Risk:** Low

Replace 70-line TypeScript with 8-line bash:

```bash
#!/usr/bin/env bash
# PreCompact Hook - Preserve important context

set -euo pipefail

project_dir="${CLAUDE_PROJECT_DIR:-.}"

# Backup current context if it exists
if [[ -f "$project_dir/.claude/.context" ]]; then
  cp "$project_dir/.claude/.context" "$project_dir/.claude/.context.backup"
fi

echo '{"continue":true}' >&2
exit 0
```

**Deliverable:** Executable bash hook (~8 lines)
**Success Criteria:**
- Backs up context
- Execution < 5ms

### Task 2.8: Quality Assurance & Testing
**Time:** 30 minutes | **Owner:** QA | **Risk:** Low

Create comprehensive test suite:

```bash
# tests/pre-tool-use.test.sh
test_block_rm_rf() {
  result=$(echo '{"tool":"Bash","args":{"command":"rm -rf /"}}' | ./pre-tool-use 2>&1)
  exit_code=$?
  assert_equals $exit_code 2 "Should block rm -rf /"
  assert_contains "$result" "continue" "false"
}

test_block_force_push() {
  result=$(echo '{"tool":"Bash","args":{"command":"git push --force main"}}' | ./pre-tool-use 2>&1)
  exit_code=$?
  assert_equals $exit_code 2 "Should block force push to main"
}

test_allow_safe_commands() {
  result=$(echo '{"tool":"Bash","args":{"command":"ls"}}' | ./pre-tool-use 2>&1)
  exit_code=$?
  assert_equals $exit_code 0 "Should allow safe commands"
}

# Similar tests for all other hooks
```

**Testing Strategy:**
- Unit tests for each hook (5 tests per hook = 35 total)
- Performance benchmarks (all hooks < 20ms)
- Integration tests with actual Claude Code
- Security validation (dangerous patterns blocked)

**Deliverable:** Comprehensive test suite
**Success Criteria:**
- All 35 unit tests passing
- All hooks < 20ms execution time
- No false positives/negatives

---

## Phase 3: Cleanup & Verification (1 hour)

### Task 3.1: Delete Over-Engineered Infrastructure
**Time:** 10 minutes | **Owner:** DevOps | **Risk:** Low | **Reversible:** Git history

Delete the following (keep in git for history, delete from working tree):

```bash
# Remove from filesystem
rm -rf /opt/ozean-licht-ecosystem/.claude/hooks/node_modules/    # 119MB
rm -rf /opt/ozean-licht-ecosystem/.claude/hooks/dist/            # 1MB
rm -rf /opt/ozean-licht-ecosystem/.claude/hooks/src/             # 725 lines TS
rm -rf /opt/ozean-licht-ecosystem/.claude/hooks/tests/           # Test files
rm /opt/ozean-licht-ecosystem/.claude/hooks/package.json
rm /opt/ozean-licht-ecosystem/.claude/hooks/package-lock.json
rm /opt/ozean-licht-ecosystem/.claude/hooks/tsconfig.json
rm /opt/ozean-licht-ecosystem/.claude/hooks/jest.config.js
rm /opt/ozean-licht-ecosystem/.claude/hooks/.env               # Keep .env.example

# Keep:
# - 7 bash hooks (executable)
# - .env.example
# - README.md
# - Documentation files (ANTI_PATTERN_ANALYSIS.md, etc.)
# - verify-installation.sh
```

**Verification:**
```bash
# Before: 120MB
du -sh /opt/ozean-licht-ecosystem/.claude/hooks/
# After: < 50KB

# Expected structure:
ls -lh /opt/ozean-licht-ecosystem/.claude/hooks/
# pre-tool-use (executable)
# post-tool-use (executable)
# session-start (executable)
# session-end (executable)
# stop (executable)
# user-prompt-submit (executable)
# pre-compact (executable)
# .env.example
# README.md
# verify-installation.sh
```

**Deliverable:** Cleaned-up hooks directory
**Success Criteria:**
- Directory size < 50KB
- All 7 hooks executable
- No npm dependencies
- Git history preserved

### Task 3.2: Update & Verify Configuration
**Time:** 15 minutes | **Owner:** Engineering | **Risk:** Low

Verify `.claude/settings.json` is correct:

```bash
# Run verification script
bash /opt/ozean-licht-ecosystem/.claude/hooks/verify-installation.sh

# Expected output:
# ✓ Settings JSON valid
# ✓ All 7 hooks executable
# ✓ No npm dependencies
# ✓ All hooks < 20ms execution time
# ✓ Test safety rules blocking properly
# ✓ Audit logs being created
```

**Deliverable:** Verified configuration
**Success Criteria:**
- All checks pass
- No errors or warnings
- Hooks fire correctly

### Task 3.3: Update Documentation
**Time:** 20 minutes | **Owner:** Documentation | **Risk:** Low

Create new documentation:

**File:** `/opt/ozean-licht-ecosystem/.claude/hooks/README-SIMPLIFIED.md`

```markdown
# Claude Code Hooks - Simplified Implementation

## Overview
7 lightweight bash hooks for Claude Code integration following Claude Code v2.1+ standards.

## Architecture
- **Size:** < 50KB total (120MB reduction)
- **Performance:** < 20ms per hook (90x improvement)
- **Dependencies:** jq only (bash + core utils)
- **Build:** None required

## Hooks

### pre-tool-use
Validates tool execution before running:
- Blocks `rm -rf /` and similar destructive operations
- Blocks `git push --force main` and force pushes
- Warns on sensitive file operations

### post-tool-use
Logs successful operations:
- Creates audit trail in `.claude/audit/operations.jsonl`
- Simple JSON log format

### session-start
Reports session health:
- Checks for required tools (docker, git)
- Non-blocking (always allows session to start)

### session-end
Minimal cleanup:
- Records session end time
- Preserves state for next session

### stop
Session summary:
- Reports success/failure
- Simple status message

### user-prompt-submit
Context injection:
- Reads recent errors from audit log
- Injects as context for Claude

### pre-compact
Context preservation:
- Backs up context before compacting
- Minimal operation

## Testing

Run verification:
```bash
bash verify-installation.sh
```

Run performance benchmark:
```bash
for hook in pre-tool-use post-tool-use session-start session-end stop user-prompt-submit pre-compact; do
  echo "Testing $hook..."
  time echo '{}' | ./$hook > /dev/null 2>&1
done
```

## Migration from TypeScript

Old hooks called `npx tsx` which required:
- 119MB node_modules
- 46 npm dependencies
- TypeScript compilation
- 1-2 second execution time

New hooks are pure bash:
- No dependencies except jq
- Direct execution
- 5-20ms execution time
- 100% Claude Code compliant

## Configuration

In `.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{"type": "command", "command": "/path/to/.claude/hooks/pre-tool-use"}]
      }
    ],
    ...
  }
}
```

See `.claude/settings.json` for complete configuration.
```

**Deliverable:** Updated documentation
**Success Criteria:**
- Clear migration notes
- Usage examples
- Verification procedures

### Task 3.4: Final Integration Testing
**Time:** 15 minutes | **Owner:** QA | **Risk:** Medium

Test hooks in actual Claude Code environment:

1. **Test Hook Firing:**
   - Make a Bash tool call in Claude Code
   - Verify pre-tool-use hook fires (should be instantaneous)
   - Verify post-tool-use hook fires
   - Check audit log created

2. **Test Blocking:**
   - Try to run `rm -rf /` via Bash tool
   - Should be blocked with exit code 2
   - Claude should see block message

3. **Test Performance:**
   - Measure time for 10 sequential hooks
   - Should be < 200ms total (20ms per hook)
   - No noticeable lag in Claude Code

4. **Test Each Hook Type:**
   - PreToolUse: Dangerous command blocked
   - PostToolUse: Audit log created
   - SessionStart: Status reported
   - SessionEnd: Cleanup executed
   - Stop: Summary shown
   - UserPromptSubmit: Context injected
   - PreCompact: Backup created

**Deliverable:** Test results report
**Success Criteria:**
- All hooks fire correctly
- Blocking works properly
- Performance acceptable
- No errors in Claude Code

---

## Risk Assessment

### High Risk Items
1. **Breaking Existing Functionality** (Medium Risk)
   - Mitigation: Comprehensive testing before deletion
   - Rollback: Keep git history, can restore from commits
   - Timeline: Test thoroughly in Phase 2

2. **Claude Code Version Incompatibility** (Low Risk)
   - Current: v2.0.36 (limited hook support)
   - Required: v2.1+ (full bash hook support)
   - Mitigation: Verify version before going live
   - Rollback: Revert to TypeScript hooks if needed

### Medium Risk Items
1. **Hook Timing Issues**
   - Risk: Hooks might not fire if too fast
   - Mitigation: Add small delays if needed
   - Test: Run with strace to verify execution

2. **JSON Parsing**
   - Risk: jq might not parse malformed JSON
   - Mitigation: Add error handling in each hook
   - Test: Feed malformed JSON in tests

### Low Risk Items
1. **Audit Log Disk Space**
   - Risk: Operations log grows unbounded
   - Mitigation: Add rotation logic later
   - Immediate: Document in README

---

## Dependencies & Prerequisites

### Required
- Bash 4.0+ (already available)
- jq (lightweight JSON parser)
  - Install: `apt-get install jq` or `brew install jq`
  - Size: ~300KB (vs 119MB node_modules)

### Optional
- Claude Code v2.1+ (for full hook support)
  - v2.0.36 has limited hook support
  - Upgrade recommended but not required

### Development/Testing
- bash test harness (no external tools)
- Standard Unix tools (grep, sed, awk)

---

## Success Criteria

### Phase 1 (Design)
- [x] Functional inventory completed
- [x] API contracts defined
- [x] Implementation patterns documented

### Phase 2 (Implementation)
- [ ] All 7 hooks implemented and tested
- [ ] Each hook < 20ms execution time
- [ ] All unit tests passing (35/35)
- [ ] No npm dependencies
- [ ] < 50KB total directory size

### Phase 3 (Cleanup)
- [ ] Node_modules deleted (119MB freed)
- [ ] Dist directory deleted (1MB freed)
- [ ] TypeScript infrastructure removed
- [ ] Configuration verified and working
- [ ] Documentation updated
- [ ] Integration tests passing
- [ ] Hooks fire correctly in Claude Code

### Overall Success
- [ ] 360x faster hook execution
- [ ] 2,400x smaller footprint
- [ ] 100% Claude Code compliant
- [ ] Zero dependencies (except jq)
- [ ] Comprehensive test coverage
- [ ] All functionality preserved
- [ ] Git history maintained

---

## Timeline & Resource Allocation

### Phase 1: Analysis & Design (45 min)
```
Mon 13 Nov
9:00 - 9:20  Task 1.1: Functional inventory
9:20 - 9:35  Task 1.2: API contract definition
9:35 - 9:45  Task 1.3: Implementation patterns
```

### Phase 2: Implementation (2-3 hours)
```
Mon 13 Nov
10:00 - 10:20  Task 2.1: pre-tool-use (20 min)
10:20 - 10:35  Task 2.2: post-tool-use (15 min)
10:35 - 10:50  Task 2.3: session-start (15 min)
10:50 - 11:00  Task 2.4: session-end (10 min)
11:00 - 11:10  Task 2.5: stop (10 min)
11:10 - 11:25  Task 2.6: user-prompt-submit (15 min)
11:25 - 11:35  Task 2.7: pre-compact (10 min)
11:35 - 12:05  Task 2.8: Testing (30 min)
```

### Phase 3: Cleanup (1 hour)
```
Mon 13 Nov
1:00 - 1:10   Task 3.1: Delete infrastructure (10 min)
1:10 - 1:25   Task 3.2: Verify configuration (15 min)
1:25 - 1:45   Task 3.3: Update documentation (20 min)
1:45 - 2:00   Task 3.4: Integration testing (15 min)
```

**Total Timeline:** 4-4.5 hours (assuming parallel work possible)

---

## Appendix A: Simplified Hook Examples

### Example 1: Blocking Dangerous Command
```bash
if [[ "$command" == *"rm -rf /"* ]]; then
  echo '{"continue":false,"stopReason":"Blocked: Destructive operation"}' >&2
  exit 2
fi
```

### Example 2: Logging Success
```bash
echo "{\"timestamp\":\"$(date -u +%s)\",\"tool\":\"$tool\"}" >> "$log_file"
```

### Example 3: Context Injection
```bash
context="Recent errors:\n$(tail -5 audit.log)"
echo "{\"continue\":true,\"systemMessage\":\"$context\"}" >&2
```

---

## Appendix B: Performance Comparison

### Before (TypeScript + npx tsx)
```
Hook execution: 1.8 seconds
Breakdown:
- npm resolve: 0.5s
- tsx transpile: 0.8s
- Handler logic: 0.3s
- npm cleanup: 0.2s
Total overhead: 36s for 20 tool calls
```

### After (Pure Bash)
```
Hook execution: 5-20 milliseconds
Breakdown:
- Bash parse: 1ms
- jq parse JSON: 2-5ms
- Handler logic: 2-10ms
- Output format: 1ms
Total overhead: 0.1s for 20 tool calls
```

### Performance Gain: 360x faster

---

## Appendix C: Dependency Analysis

### Before
```
46 npm dependencies:
- typescript (5.3.2) - 50MB
- tsx (4.6.2) - 15MB
- zod (3.22.4) - 10MB
- jest (29.7.0) - 30MB
- eslint (8.54.0) - 5MB
- @types/* - 10MB
Total: 119MB
```

### After
```
1 system dependency:
- jq (JSON query) - 300KB
Total: 300KB
Reduction: 396x smaller
```

---

## Appendix D: Testing Checklist

### Unit Tests (35 total)
- [ ] pre-tool-use: 5 tests
- [ ] post-tool-use: 5 tests
- [ ] session-start: 5 tests
- [ ] session-end: 5 tests
- [ ] stop: 5 tests
- [ ] user-prompt-submit: 5 tests
- [ ] pre-compact: 5 tests

### Performance Tests
- [ ] Each hook < 20ms
- [ ] 10 sequential hooks < 200ms
- [ ] No memory leaks

### Security Tests
- [ ] `rm -rf /` blocked
- [ ] Force push blocked
- [ ] `.env` edits blocked
- [ ] Sensitive files protected

### Integration Tests
- [ ] Hooks fire in Claude Code
- [ ] Blocking prevents execution
- [ ] Audit logs created
- [ ] Context injected
- [ ] Session lifecycle works

---

## Related Documentation

- `ai_docs/claude-code-hooks.md` - Official Claude Code documentation
- `.claude/hooks/ANTI_PATTERN_ANALYSIS.md` - Problem analysis
- `.claude/hooks/HOOK_EXECUTION_ANALYSIS.md` - Execution investigation
- `.claude/hooks/QUICK_FIX_GUIDE.md` - Quick fixes (superseded by this plan)

---

## Approval & Sign-Off

**Document:** Hooks Simplification Implementation Plan
**Version:** 1.0
**Date:** 2025-11-12
**Status:** Ready for Implementation

**Reviewers:**
- [ ] Architecture Review
- [ ] Security Review
- [ ] Performance Review
- [ ] QA Approval

**Sign-Off:**
- [ ] Project Lead Approval
- [ ] Ready to Begin Phase 1

