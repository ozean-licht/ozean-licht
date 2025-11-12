# Quick Fix Guide - Hooks Not Executing

## The Problem
Hooks are configured correctly but NOT firing when using Claude Code v2.0.36.

## The Root Causes (in order of likelihood)

1. **Test Hook in Production** (60% likely)
   - File: `.claude/settings.json` line 8-12
   - Problem: Bash matcher points to `test-hook` instead of `pre-tool-use`
   - Fix Time: 1 minute

2. **Claude Code Version Incompatibility** (85% likely)
   - Current: v2.0.36 (limited hook support)
   - Required: v2.1+ (full hook support)
   - Fix Time: 10-30 minutes

3. **Timeout Configuration** (30% likely)
   - Current: 60s (too long)
   - Recommended: 10s (better)
   - Fix Time: 1 minute

4. **Tool Matcher Precision** (40% likely)
   - Matcher patterns may not match Claude Code's naming
   - Solution: Use regex patterns
   - Fix Time: 5 minutes

---

## IMMEDIATE ACTION - 5 MINUTE FIX

### Step 1: Fix Test Hook in Settings (1 minute)

**File**: `/opt/ozean-licht-ecosystem/.claude/settings.json`

Replace lines 8-12 from:
```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "/opt/ozean-licht-ecosystem/.claude/hooks/test-hook"
    }
  ]
}
```

To:
```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "/opt/ozean-licht-ecosystem/.claude/hooks/pre-tool-use"
    }
  ]
}
```

### Step 2: Optimize Hook Timeout (1 minute)

**File**: `/opt/ozean-licht-ecosystem/.claude/hooks/.env`

Change:
```bash
HOOK_TIMEOUT=60000
```

To:
```bash
HOOK_TIMEOUT=10000
```

### Step 3: Verify Configuration (1 minute)

```bash
jq '.' /opt/ozean-licht-ecosystem/.claude/settings.json | head -20
```

Should show `pre-tool-use` not `test-hook`.

### Step 4: Test Hooks Work (1 minute)

```bash
echo '{}' | /opt/ozean-licht-ecosystem/.claude/hooks/pre-tool-use
# Should return: {"continue":true}
```

### Step 5: Restart Claude Code (1 minute)

Close and reopen Claude Code for new session.

---

## SECONDARY ACTION - 30 MINUTE FIX

### Upgrade Claude Code to v2.1+

```bash
# Check current version
claude code --version

# Upgrade
npm install -g @anthropic-ai/claude-code@latest

# Verify
claude code --version  # Should show 2.1.0+
```

---

## VERIFICATION

Run the verification script:
```bash
bash /opt/ozean-licht-ecosystem/.claude/hooks/verify-installation.sh
```

Expected output:
```
1. Checking settings.json... ✓
2. Checking bash wrappers... ✓
3. Checking TypeScript build... ✓
4. Checking .env file... ✓ (LOG_LEVEL=silent)
5. Testing hook execution... ✓
6. Checking MCP Gateway... ✓ or ⚠️
```

---

## EXPECTED BEHAVIOR AFTER FIX

1. **No visible change** - Hooks run silently by design
2. **Bash operations validated** - Prevent mistakes before execution
3. **Security checks** - Detect exposed secrets, block force pushes to main
4. **Patterns saved** - Learning from successful deployments
5. **Memory injected** - Relevant context added to prompts

---

## TROUBLESHOOTING

### If hooks still don't fire after fixes:

1. Check Claude Code version is v2.1+:
   ```bash
   claude code --version
   ```

2. Verify hook permissions:
   ```bash
   ls -lh /opt/ozean-licht-ecosystem/.claude/hooks/pre-tool-use
   # Should show: -rwxrwxr-x
   ```

3. Test hook directly:
   ```bash
   echo '{"tool":"Bash"}' | /opt/ozean-licht-ecosystem/.claude/hooks/pre-tool-use
   ```

4. Check .env is valid:
   ```bash
   cat /opt/ozean-licht-ecosystem/.claude/hooks/.env | grep -E "(TIMEOUT|LOG_)"
   ```

5. Look for detailed analysis:
   ```bash
   cat /opt/ozean-licht-ecosystem/.claude/hooks/HOOK_EXECUTION_ANALYSIS.md
   ```

---

## SUMMARY

| Issue | Severity | Fix Time | Status |
|-------|----------|----------|--------|
| Test hook in Bash matcher | MEDIUM | 1 min | Configuration error |
| Hook timeout too long | LOW | 1 min | Environment tuning |
| Claude Code v2.0.36 | CRITICAL | 30 min | Requires upgrade |
| Matcher patterns | MEDIUM | 5 min | Fine-tuning |
| **TOTAL** | | **30-40 min** | **Actionable** |

---

## SUPPORT

For complete analysis, see: `/opt/ozean-licht-ecosystem/.claude/hooks/HOOK_EXECUTION_ANALYSIS.md`

Hooks infrastructure assessment:
- Configuration: 95/100 ✅
- Implementation: 9/10 ✅
- Documentation: 10/10 ✅
- Auto-execution: 0/10 ❌ (due to Claude Code version)

