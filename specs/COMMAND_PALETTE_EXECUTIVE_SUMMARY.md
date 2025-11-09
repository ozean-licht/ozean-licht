# Command Palette Access Issue: Executive Summary

## The Problem in 30 Seconds

Users of the Ozean Licht megarepo see **different commands in the Claude Code command palette depending on which folder is open**, creating confusion and reducing productivity.

```
📍 Root folder (/opt/ozean-licht-ecosystem/)
   ➜ Command Palette shows: 29 root commands ✅
   ➜ Examples: /plan, /implement, /feature, /bug

📍 Orchestrator folder (apps/orchestrator_3_stream/)
   ➜ Command Palette shows: 18 commands ❌ (missing 29 root commands!)
   ➜ Examples: /orch_scout_and_build, /plan, /prime

📍 Same repo, different results! 😕
```

---

## Why It Happens

### Claude Code CLI Discovery
```
Claude Code looks for: $CLAUDE_PROJECT_DIR/.claude/commands/
$CLAUDE_PROJECT_DIR = VSCode workspace root
Result: Only finds commands in one folder
```

### Orchestrator Backend Discovery
```python
discover_slash_commands(working_dir):
    1. Load root commands from: /opt/ozean-licht-ecosystem/.claude/commands/
    2. Load app commands from: {working_dir}/.claude/commands/
    3. Merge with app commands taking precedence
    Result: All commands available programmatically ✅
```

**The Mismatch**: CLI can only see one folder, backend sees both. 🔀

---

## Impact Analysis

### Who's Affected?
- **Orchestrator developers** - Can't access root commands when working in `apps/orchestrator_3_stream/`
- **ADW users** - Commands change depending on active worktree
- **New contributors** - Confused about "missing" commands

### Severity
- **UX Impact**: 🔴 HIGH - Missing expected commands breaks workflow
- **System Risk**: 🟢 LOW - Everything still works, just harder to discover
- **Adoption Risk**: 🟡 MEDIUM - Users may think features are unavailable

---

## The Solution: Three Tiers

### 🟢 Tier 1: Immediate (This Week)
**Multi-root VSCode Workspace + Documentation**

```bash
# Users open this file instead:
code ozean-licht-ecosystem.code-workspace

# Result: All folders visible with correct commands for each!
```

**Files to create**:
- `ozean-licht-ecosystem.code-workspace`
- `.claude/README.md` (command catalog)
- Update `CLAUDE.md` (guidance)

**Effort**: 4.5 hours
**Risk**: None (additive only)
**Benefit**: Immediate UX improvement ⭐

---

### 🟡 Tier 2: Short-term (Next 2 Weeks)
**Project Configuration Registry + Automation**

```yaml
# .claude/project-config.yaml
projects:
  root:
    commands_dir: .claude/commands
    name: "Ozean Licht Root"
  orchestrator:
    commands_dir: apps/orchestrator_3_stream/.claude/commands
    parent: root  # Inherit root commands
    name: "Orchestrator"
```

**Tools to build**:
- `tools/claude-code-sync/` - Auto-sync commands
- Validation tests - Verify no conflicts
- Auto-sync hook - Runs on startup

**Effort**: 8-9 hours
**Risk**: Low
**Benefit**: Foundation for automation

---

### 🔴 Tier 3: Long-term (Ongoing)
**Advocate for Claude SDK Enhancement**

**Goal**: Make Claude Code CLI support hierarchical discovery like the orchestrator does

**Timeline**: 1-2 months to implement (external dependency)
**Benefit**: Permanent solution, supports any monorepo pattern

---

## Architecture Diagram

```
CURRENT STATE (Problem)
═══════════════════════════════════════════════════════════

Claude Code CLI
     ↓
  $CLAUDE_PROJECT_DIR
     ↓
  Single Directory: .claude/commands/
     ↓
  ❌ Mismatch with Orchestrator Discovery


AFTER TIER 1 (Quick Fix)
═══════════════════════════════════════════════════════════

Multi-root Workspace
  ├── 🌍 Root
  │    ├── Command Palette: 29 commands ✅
  │    └── .claude/commands/ (root)
  │
  ├── 🤖 Orchestrator
  │    ├── Command Palette: 47 commands ✅ (29 root + 18 app)
  │    └── .claude/commands/ (orchestrator)
  │
  └── 📊 Admin / 🎓 Kids Ascension / etc.
       └── Appropriate commands for each


AFTER TIER 2 (Enhanced)
═══════════════════════════════════════════════════════════

Same as Tier 1, plus:
  + Project Config Registry (.claude/project-config.yaml)
  + Command Sync Utility (tools/claude-code-sync/)
  + Auto-sync Hook (runs on startup)
  + Validation Tests (catch conflicts)
  + Complete Documentation (discovery guide)


AFTER TIER 3 (Permanent)
═══════════════════════════════════════════════════════════

Claude Code CLI Enhanced
     ↓
  Hierarchical Discovery API
     ↓
  Root + App Commands
     ↓
  ✅ Same behavior as orchestrator backend
```

---

## Command Breakdown

### Root Commands (29 total)

**Core Development** (9):
- /plan, /implement, /test, /feature, /bug, /patch, /chore, /document, /review

**Workflows** (6):
- /classify_adw, /cleanup_worktrees, /install_worktree, /track_agentic_kpis, /classify_issue, /create_issue

**Infrastructure** (4):
- /health_check, /start, /tools, /memory

**Advanced** (10):
- /commit, /pull_request, /in_loop_review, /resolve_failed_test, /resolve_failed_e2e_test, /coolify, /coolify-deploy, /conditional_docs, /prepare_app, /generate_branch_name

### Orchestrator-Only Commands (18 additional)

**Multi-Agent Workflows**:
- /orch_scout_and_build, /orch_plan_w_scouts_build_review, /parallel_subagents, /build_in_parallel, /orch_trinity_mode

**Orchestrator Tools**:
- /orch_one_shot_agent, /find_and_summarize, /load_bundle, /load_ai_docs

**Overrides**:
- /plan (specialized version), /prime (specialized version)

**Others**:
- /all_tools, /build, /prime_3, /prime_cc, /question, /quick-plan

---

## Quick Wins (Immediate Actions)

### ✅ For Users (Now)
```bash
# To see all commands immediately:
code ozean-licht-ecosystem.code-workspace

# Result: Switch between folders, all commands available per context
```

### ✅ For Developers (Phase 1: This Week)
- Create `ozean-licht-ecosystem.code-workspace`
- Update `CLAUDE.md` with "Command Discovery" section
- Create `.claude/README.md` with full command catalog
- Add to `README.md` "Opening in Multi-Root Workspace"

### ✅ For Team Leads (Phase 2: Next 2 Weeks)
- Implement project configuration registry
- Create command sync utility
- Add validation tests to CI/CD
- Document in team guidelines

---

## Risk-Benefit Matrix

```
                           Benefit
                             ▲
                         ✨  │
                    ⭐⭐⭐  │ Tier 1: Multi-root + Docs
                   Tier 2  │ (Immediate relief)
                      ✨  │
          Tier 3 ⭐     │ Permanent solution
          (Advocacy)    │ (blocked on Anthropic)

        ✅ Low Risk    │    Tier 2 enhancement
        🟡 Med Risk    │    (automation)
        🔴 High Risk   │ (project config mgmt)
                       │
     ──────────────────┼─────────────────────────► Risk
          None         Low         Medium      High
```

---

## Decision Matrix

| Aspect | Tier 1 | Tier 2 | Tier 3 |
|--------|--------|--------|--------|
| **Effort** | 4.5 hrs | 8-9 hrs | 2-3 hrs |
| **Risk** | 🟢 None | 🟡 Low | 🟢 None |
| **Timeline** | This week | 2 weeks | Ongoing |
| **Blocks anyone?** | 🟢 No | 🟢 No | 🟢 No |
| **User impact** | 🔴 High (good) | 🟡 Medium | 🟢 None (backend) |
| **Maintenance** | 🟢 None | 🟡 Light | 🟢 Monitor |
| **Permanent fix?** | 🟡 Partial | 🟡 Partial | 🟢 Yes |

---

## Implementation Timeline

```
WEEK 1 (Phase 1: Foundation)
├─ Mon-Tue:  Create workspace file + test
├─ Wed:       Create .claude/README.md catalog
├─ Thu:       Update CLAUDE.md + README.md
└─ Fri:       Deploy + validate

  ✅ Result: Users can see all commands

WEEK 2-3 (Phase 2: Enhanced Discovery)
├─ Create project-config.yaml
├─ Build claude-code-sync utility
├─ Implement auto-sync hook
├─ Add validation tests
└─ Deploy to CI/CD

  ✅ Result: Automated command management

ONGOING (Phase 3: Long-term)
├─ Write Anthropic feature request
├─ Monitor Claude Code releases
├─ Maintain command registry
└─ Community engagement

  ✅ Result: Permanent solution in future SDK
```

---

## Success Metrics

### Phase 1 Completion ✅
- [ ] Multi-root workspace file created and tested
- [ ] All 29 root commands documented
- [ ] Users report can see orchestrator commands
- [ ] CLAUDE.md updated with clear guidance
- [ ] No regression in existing workflows

### Phase 2 Completion ✅
- [ ] Project config registry populated
- [ ] Sync utility working (tests pass)
- [ ] No duplicate command conflicts
- [ ] Auto-sync hook runs on startup
- [ ] Discovery guide published

### Phase 3 Completion ✅
- [ ] Feature request filed with Anthropic
- [ ] Community feedback gathered
- [ ] Command registry maintained
- [ ] Documentation linked from Claude Code docs

---

## FAQ

**Q: Why is this happening?**
> Claude Code CLI discovers commands by scanning one directory, while the orchestrator backend loads from multiple directories. This creates a mismatch.

**Q: Will this break existing workflows?**
> No. All proposed changes are additive and backward compatible.

**Q: How long will this take?**
> Phase 1 (immediate relief): 1 day. Phase 2 (full automation): 2 weeks. Phase 3 (SDK enhancement): ongoing.

**Q: Do I have to use the multi-root workspace?**
> No, it's optional. You can still open folders individually, but you'll only see commands for that folder.

**Q: Will this work with ADW worktrees?**
> Phase 1-2: Not automatically (documented workaround). Phase 3: Yes (pending SDK enhancement).

**Q: What's the difference between Tier 1, 2, and 3?**
> Tier 1 = quick fix (users pick folder). Tier 2 = automation (sync happens automatically). Tier 3 = SDK enhancement (permanent solution from Anthropic).

---

## Next Steps

### Immediate (This Week)
1. **Review** this summary with team
2. **Approve** Phase 1 implementation
3. **Assign** to developer (4.5 hour task)
4. **Deploy** workspace file and docs

### Short-term (Next 2 Weeks)
1. **Plan** Phase 2 implementation
2. **Review** project config design
3. **Build** sync utility and tests
4. **Deploy** automation

### Long-term (Ongoing)
1. **Monitor** Claude Code SDK updates
2. **Prepare** feature request for Anthropic
3. **Maintain** command registry
4. **Gather** team feedback

---

## Deliverables Summary

| Deliverable | Owner | Deadline | Status |
|-------------|-------|----------|--------|
| Scout Report | Scout Agent | ✅ Complete | Ready |
| Implementation Plan | Scout Agent | ✅ Complete | Ready |
| `.code-workspace` | Developer | This week | TBD |
| `.claude/README.md` | Developer | This week | TBD |
| `CLAUDE.md` update | Developer | This week | TBD |
| `project-config.yaml` | Developer | Week 2-3 | TBD |
| Sync utility | Developer | Week 2-3 | TBD |
| Validation tests | QA | Week 2-3 | TBD |
| Anthropic feature request | Tech Lead | Week 3+ | TBD |

---

**Report Status**: ✅ Investigation Complete, Ready for Implementation

*Generated by Scout Agent | 2025-11-07*
