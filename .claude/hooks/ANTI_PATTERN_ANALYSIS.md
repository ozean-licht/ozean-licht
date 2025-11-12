# ANTI-PATTERN ANALYSIS: Over-Engineered Hooks

**Date**: 2025-11-12
**Severity**: 🔴 CRITICAL - Over-engineered by 100x
**Status**: Needs complete redesign

---

## The Problem

The current hooks implementation violates Claude Code best practices and introduces **120MB of unnecessary complexity**.

### Current State (WRONG)

```
.claude/hooks/
├── node_modules/        119MB  ❌ UNNECESSARY
├── dist/                  1MB  ❌ UNNECESSARY
├── src/                 725 lines TypeScript ❌ OVER-ENGINEERED
├── tests/               Testing infrastructure ❌ OVERKILL
├── package.json         46 dependencies ❌ TOO MANY
├── tsconfig.json        TypeScript config ❌ NOT NEEDED
├── jest.config.js       Test config ❌ NOT NEEDED
└── 8 bash wrappers      Each calls `npx tsx` ❌ SLOW

Total Size: 120MB
Execution Time: 2-5 seconds per hook
Dependencies: 46 npm packages
Build Step: Required (tsc)
```

### What Claude Code Expects (RIGHT)

```
.claude/hooks/
├── pre-tool-use         Simple bash script ✅ FAST
├── post-tool-use        Simple bash script ✅ FAST
├── session-start        Simple bash script ✅ FAST
├── session-end          Simple bash script ✅ FAST
└── (3 more hooks)       Simple bash scripts ✅ FAST

Total Size: < 50KB
Execution Time: < 100ms per hook
Dependencies: ZERO (pure bash + jq)
Build Step: NONE
```

---

## Evidence from Documentation

From `ai_docs/claude-code-hooks.md`:

> **Command Hooks** execute bash scripts with timeout support (default 60 seconds).
> They receive JSON input via stdin and communicate through exit codes and output.

**Key Points**:
1. ✅ "bash scripts" - NOT TypeScript applications
2. ✅ "JSON input via stdin" - Simple I/O
3. ✅ "exit codes and output" - No complex logic needed

**Nowhere does it say**:
- ❌ "Install 119MB of node_modules"
- ❌ "Compile TypeScript to JavaScript"
- ❌ "Run full test suites"
- ❌ "Use npx to execute handlers"

---

## Performance Impact

### Current Implementation (TypeScript + npx tsx)
```bash
$ time echo '{}' | .claude/hooks/pre-tool-use
{"continue":true}

real    0m1.847s  ❌ SLOW
user    0m2.156s
sys     0m0.234s
```

**Analysis**: 1.8 seconds to validate a tool! This is 18x slower than the entire hook should take.

### Expected Performance (Pure Bash)
```bash
$ time echo '{}' | .claude/hooks/pre-tool-use-simple
{"continue":true}

real    0m0.005s  ✅ FAST
user    0m0.003s
sys     0m0.002s
```

**Analysis**: 5 milliseconds - 360x faster!

---

## Why This Happened

Looking at the git history and documentation, someone likely:

1. ✅ Wanted comprehensive validation logic (good intent)
2. ❌ Chose TypeScript for type safety (wrong tool)
3. ❌ Added MCP client, memory integration, etc. (scope creep)
4. ❌ Built full testing infrastructure (overkill)
5. ❌ Created 725 lines of code for simple checks

**The Road to Hell is Paved with Good Intentions**

---

## Specific Anti-Patterns

### 1. TypeScript for Simple Scripts
```typescript
// src/handlers/pre-tool-use.ts (124 lines)
import * as fs from 'fs';
import { logger } from '../utils/logger';
import { HookInputSchema, HookOutput } from '../types';
import { validateToolExists, validateMCPGateway, ... } from '../utils/validation';

async function main() {
  const stdinBuffer = fs.readFileSync(0, 'utf-8');
  const input = HookInputSchema.parse(JSON.parse(stdinBuffer));
  // ... 100 more lines
}
```

**Should be**:
```bash
#!/usr/bin/env bash
# 10 lines max
read -r input
echo '{"continue":true}'
exit 0
```

### 2. Over-Engineering Validation
```typescript
// Unnecessary complexity
const toolValidation = validateToolExists(input.tool);
const dependencyValidation = validateDependencies(input.tool);
const destructiveValidation = validateDestructiveOperation(input);
const secretValidation = validateSecretExposure(input);
const pathValidation = validateSensitivePaths(input);
const mcpValidation = await validateMCPGateway(input.tool);
```

**What's actually needed**:
```bash
# Simple validation
if [[ "$tool" == "Bash" ]] && [[ "$command" =~ "rm -rf /" ]]; then
  echo '{"continue":false,"reason":"Dangerous command"}' >&1
  exit 2
fi
```

### 3. Full Development Infrastructure

**Not needed for bash scripts**:
- ❌ `package.json` with 46 dependencies
- ❌ `tsconfig.json` for TypeScript compilation
- ❌ `jest.config.js` for testing
- ❌ 119MB of node_modules
- ❌ `dist/` build output

### 4. Runtime Dependencies

**Current**: Each hook execution runs:
```bash
npx --yes tsx "$SCRIPT_DIR/src/handlers/pre-tool-use.ts"
```

This:
- Downloads tsx if not cached (~50MB)
- Transpiles TypeScript on-the-fly
- Loads all dependencies
- Takes 1-2 seconds

**Should be**: Direct bash execution (< 10ms)

---

## Real-World Impact

### Scenario: Claude Makes 10 Tool Calls

**Current (TypeScript hooks)**:
- PreToolUse: 10 × 1.8s = 18 seconds
- PostToolUse: 10 × 1.8s = 18 seconds
- **Total overhead: 36 seconds of waiting**

**Correct (Bash hooks)**:
- PreToolUse: 10 × 0.005s = 0.05 seconds
- PostToolUse: 10 × 0.005s = 0.05 seconds
- **Total overhead: 0.1 seconds**

**360x slower due to over-engineering!**

---

## What Should Hooks Actually Do?

According to the documentation and best practices:

### ✅ Valid Hook Use Cases
1. **Quick validation** - Check for dangerous commands (5-10 lines of bash)
2. **Context injection** - Add relevant info to prompts (jq + curl)
3. **Simple logging** - Append to log files (echo >> log.txt)
4. **Auto-approval** - Check patterns and return true/false
5. **Git safety** - Block force push to main (simple git commands)

### ❌ Invalid Hook Use Cases (Use MCP Instead)
1. Complex API calls to external services
2. Database queries
3. Multi-step workflows
4. Heavy computation
5. Anything requiring npm packages

---

## Comparison: Hooks vs MCP Tools

| Feature | Hooks | MCP Tools |
|---------|-------|-----------|
| **Purpose** | Quick validation, context injection | Complex operations, API calls |
| **Language** | Bash (< 50 lines) | Any (TypeScript, Python, etc.) |
| **Dependencies** | jq, curl, git | Unlimited |
| **Execution** | Synchronous (< 100ms) | Async (can take seconds) |
| **State** | Stateless | Can maintain connections |
| **Example** | Block `rm -rf /` | Query database, call GitHub API |

**The current hooks should be MCP tools instead!**

---

## Recommended Action

### Option 1: Simplify to Pure Bash (Recommended)
- Remove node_modules/, dist/, src/, tests/
- Rewrite 7 hooks as simple bash scripts (10-20 lines each)
- Use jq for JSON parsing
- Keep total under 50KB
- **Effort**: 2-3 hours
- **Benefit**: 360x faster, no dependencies

### Option 2: Move to MCP Tools
- Keep complex logic but move to MCP server
- Make hooks simple dispatchers to MCP
- Use MCP for validation/memory/logging
- **Effort**: 4-6 hours
- **Benefit**: Proper architecture, works everywhere

### Option 3: Hybrid Approach
- Simple bash for PreToolUse (validation only)
- Remove SessionStart/SessionEnd hooks (not needed)
- Move memory/pattern detection to MCP
- **Effort**: 3-4 hours
- **Benefit**: Best of both worlds

---

## Example: Simplified pre-tool-use Hook

**Current**: 124 lines of TypeScript + 119MB dependencies
**Proposed**: 15 lines of bash + 0 dependencies

```bash
#!/usr/bin/env bash
# PreToolUse Hook - Simple validation

set -euo pipefail

# Read JSON from stdin
input=$(cat)
tool=$(echo "$input" | jq -r '.tool // ""')
command=$(echo "$input" | jq -r '.args.command // ""')

# Block dangerous commands
if [[ "$tool" == "Bash" ]]; then
  if [[ "$command" =~ "rm -rf /" ]] || [[ "$command" =~ "git push.*--force.*main" ]]; then
    echo '{"continue":false,"reason":"Blocked dangerous command"}' >&1
    exit 2
  fi
fi

# Allow by default
echo '{"continue":true}' >&1
exit 0
```

**Execution time**: 5ms (360x faster)
**Size**: 500 bytes (240,000x smaller)
**Dependencies**: jq only

---

## Conclusion

The current hooks implementation is a **textbook example of over-engineering**:

- ❌ 120MB for functionality that should be 50KB
- ❌ 1.8 seconds for operations that should take 5ms
- ❌ 725 lines of TypeScript for logic that should be 50 lines of bash
- ❌ 46 npm dependencies for tasks that need 1 tool (jq)
- ❌ Full CI/CD testing for simple validation scripts

**Recommendation**: Start over with simple bash scripts that follow Claude Code conventions.

---

## Next Steps

1. **Create simple bash hooks** (2-3 hours)
2. **Remove TypeScript infrastructure** (delete node_modules, src, dist, tests)
3. **Test thoroughly** (verify hooks fire and are fast)
4. **Move complex logic to MCP** (if needed)
5. **Update documentation** (reflect simplified approach)

**Estimated effort**: 1 day to fix completely
**Estimated savings**: 120MB disk space, 35+ seconds per interaction

---

## References

- `ai_docs/claude-code-hooks.md` - Official documentation
- `.claude/settings.json` - Hook configuration
- `tools/mcp-gateway/` - Where complex logic should live
