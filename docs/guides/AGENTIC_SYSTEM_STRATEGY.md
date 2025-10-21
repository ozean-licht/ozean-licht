# Agentic System Strategy
## Ozean Licht Ecosystem - Isolated ADW Architecture

> **For AI Agents**: This document defines our isolated workflow architecture, SDLC pipeline, and operational guidelines. Read this to understand how you execute development tasks in isolated environments with complete filesystem and port isolation.

---

## 🎯 System Philosophy

### Core Principles

**1. Zero-Touch Engineering (ZTE)**
- Humans define "what" in GitHub issues
- Agents figure out "how" through isolated workflows
- Complete SDLC automation: Plan → Build → Test → Review → Document → Ship
- Production deployment without human intervention (when ZTE enabled)

**2. Isolated Execution**
- Every workflow runs in its own Git worktree
- Complete filesystem isolation under `trees/{adw_id}/`
- Dedicated port ranges for parallel execution
- Support for 15 concurrent workflows

**3. State-Driven Workflows**
- Persistent state tracking via `agents/{adw_id}/adw_state.json`
- Data flows between workflow phases
- Worktree paths, ports, and metadata stored
- Enable resumption and debugging

**4. Memory-Driven Development**
- Every completed task stores learnings in Mem0
- Future tasks benefit from past patterns
- Institutional knowledge compounds over time

---

## 🏗️ Architectural Overview

```
┌─────────────────────────────────────────────────────────┐
│                    TRIGGER LAYER                         │
│  • GitHub Issues (webhook/cron)                          │
│  • Manual execution                                      │
│  • Comment triggers ("adw")                              │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│                 WORKFLOW SELECTION                       │
│  • adw_plan_iso - Planning only                          │
│  • adw_patch_iso - Quick patches                         │
│  • adw_plan_build_iso - Plan + Build                     │
│  • adw_plan_build_test_iso - Plan + Build + Test         │
│  • adw_sdlc_iso - Complete SDLC                          │
│  • adw_sdlc_zte_iso - SDLC + Auto-ship                   │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│              WORKTREE INITIALIZATION                     │
│  • Create: trees/{adw_id}/                               │
│  • Allocate ports: 9100-9114, 9200-9214                  │
│  • Generate .ports.env                                   │
│  • Copy .env from main repo                              │
│  • Complete repo copy with isolation                     │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│                  SDLC PIPELINE                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ PLAN (Entry Point)                                 │ │
│  │ • Classify issue (/chore, /bug, /feature)          │ │
│  │ • Create implementation spec                       │ │
│  │ • Initialize ADWState                              │ │
│  │ • Create feature branch                            │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ BUILD (Dependent)                                  │ │
│  │ • Validate worktree exists                         │ │
│  │ • Load ADWState                                    │ │
│  │ • Implement from spec                              │ │
│  │ • Commit changes in isolation                      │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ TEST (Dependent)                                   │ │
│  │ • Run unit tests with allocated ports              │ │
│  │ • Optional E2E tests                               │ │
│  │ • Auto-resolve failures                            │ │
│  │ • Commit test results                              │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ REVIEW (Dependent)                                 │ │
│  │ • Validate against spec                            │ │
│  │ • Capture screenshots                              │ │
│  │ • Auto-resolve blockers                            │ │
│  │ • Upload review artifacts                          │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ DOCUMENT (Dependent)                               │ │
│  │ • Analyze changes in worktree                      │ │
│  │ • Generate comprehensive docs                      │ │
│  │ • Commit to app_docs/                              │ │
│  │ • Link to original issue                           │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ SHIP (Dependent)                                   │ │
│  │ • Validate complete ADWState                       │ │
│  │ • Approve PR                                       │ │
│  │ • Merge to main (squash)                           │ │
│  │ • Trigger production deployment                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│                   MEMORY LAYER                           │
│  • Store learnings in Mem0                               │
│  • agents/{adw_id}/adw_state.json                        │
│  • Review screenshots and artifacts                      │
│  • Generated documentation in app_docs/                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Isolated Architecture

### Worktree Structure

```
trees/
├── abc12345/                    # Complete isolated repo
│   ├── .git/                   # Worktree git dir
│   ├── .env                    # Copied from main
│   ├── .ports.env              # Port config for this instance
│   │   ├── BACKEND_PORT=9107
│   │   └── FRONTEND_PORT=9207
│   ├── projects/
│   │   ├── kids-ascension/
│   │   ├── ozean-licht/
│   │   └── media-translation/
│   ├── infrastructure/
│   ├── adws/
│   ├── shared/
│   └── specs/
│       └── plan-abc12345-oauth.md
│
└── def67890/                    # Another isolated instance
    ├── .ports.env
    │   ├── BACKEND_PORT=9103
    │   └── FRONTEND_PORT=9203
    └── ...

agents/                          # Shared state (NOT in worktrees)
├── abc12345/
│   ├── adw_state.json          # Persistent workflow state
│   ├── planner/
│   │   └── raw_output.jsonl
│   ├── implementor/
│   │   └── raw_output.jsonl
│   ├── tester/
│   ├── reviewer/
│   │   └── review_img/
│   └── documenter/
└── def67890/
    └── adw_state.json

app_docs/                        # Generated documentation
└── features/
    └── oauth-login/
        ├── overview.md
        ├── technical-guide.md
        └── images/
```

### Port Allocation System

**Deterministic Port Assignment:**
```python
def get_ports_for_adw(adw_id: str) -> Tuple[int, int]:
    """
    Each ADW gets unique ports based on ID hash.
    
    Backend: 9100-9114 (15 ports)
    Frontend: 9200-9214 (15 ports)
    """
    index = int(adw_id[:8], 36) % 15
    backend_port = 9100 + index
    frontend_port = 9200 + index
    return backend_port, frontend_port
```

**Example Allocations:**
```
ADW abc12345: Backend 9107, Frontend 9207
ADW def67890: Backend 9103, Frontend 9203
ADW xyz45678: Backend 9112, Frontend 9212
```

**Benefits:**
- ✅ 15 concurrent workflows maximum
- ✅ No port conflicts
- ✅ Automatic fallback if ports busy
- ✅ Deterministic (same ADW ID = same ports)

---

## 🔄 ADW Workflow Types

### Entry Point Workflows (Create Worktrees)

These workflows create isolated environments:

**1. `adw_plan_iso.py` - Planning Only**
```bash
uv run adw_plan_iso.py 123 [adw-id]
```

**Creates:**
- Isolated worktree at `trees/{adw_id}/`
- Allocated ports in `.ports.env`
- Feature branch
- Implementation plan spec
- Initial ADWState

**Use When:**
- Want to review plan before building
- Complex feature requiring human approval
- Multiple implementation approaches possible

---

**2. `adw_patch_iso.py` - Quick Patches**
```bash
uv run adw_patch_iso.py 123 [adw-id]
```

**Triggered by:** Keyword `adw_patch` in issue/comments

**Creates:**
- Isolated worktree
- Targeted patch plan (focused changes)
- Direct implementation
- PR with patch

**Use When:**
- Small bug fixes
- Quick corrections
- Hotfix scenarios
- Typo fixes, minor adjustments

---

### Dependent Workflows (Require Existing Worktree)

These workflows require an existing isolated environment:

**3. `adw_build_iso.py` - Implementation**
```bash
uv run adw_build_iso.py 123 <adw-id>
```

**Requires:**
- Existing worktree from `adw_plan_iso` or `adw_patch_iso`
- ADW ID is **mandatory**

**Does:**
- Validates worktree exists
- Loads ADWState
- Implements from spec
- Commits in isolation

---

**4. `adw_test_iso.py` - Testing**
```bash
uv run adw_test_iso.py 123 <adw-id> [--skip-e2e]
```

**Requires:**
- Existing worktree
- ADW ID is **mandatory**

**Does:**
- Runs unit tests with allocated ports
- Optional E2E tests
- Auto-resolves failures
- Commits test results

---

**5. `adw_review_iso.py` - Code Review**
```bash
uv run adw_review_iso.py 123 <adw-id> [--skip-resolution]
```

**Requires:**
- Existing worktree
- ADW ID is **mandatory**

**Does:**
- Reviews against spec
- Captures screenshots using allocated ports
- Auto-resolves blockers
- Uploads review artifacts

---

**6. `adw_document_iso.py` - Documentation**
```bash
uv run adw_document_iso.py 123 <adw-id>
```

**Requires:**
- Existing worktree
- ADW ID is **mandatory**

**Does:**
- Analyzes changes in worktree
- Generates comprehensive docs
- Commits to `app_docs/features/`
- Links to original issue

---

**7. `adw_ship_iso.py` - Approve & Merge**
```bash
uv run adw_ship_iso.py 123 <adw-id>
```

**Requires:**
- Complete ADWState (all fields populated)
- Existing worktree and PR
- ADW ID is **mandatory**

**Does:**
- Validates state completeness
- Approves PR
- Merges to main (squash)
- Triggers deployment

---

### Orchestrator Workflows

**8. `adw_plan_build_iso.py` - Plan + Build**
```bash
uv run adw_plan_build_iso.py 123 [adw-id]
```

**Phases:**
1. Planning (creates worktree)
2. Building (in worktree)

---

**9. `adw_plan_build_test_iso.py` - Plan + Build + Test**
```bash
uv run adw_plan_build_test_iso.py 123 [adw-id]
```

**Phases:**
1. Planning
2. Building
3. Testing (unit + optional E2E)

---

**10. `adw_sdlc_iso.py` - Complete SDLC**
```bash
uv run adw_sdlc_iso.py 123 [adw-id] [--skip-e2e] [--skip-resolution]
```

**Full Pipeline:**
1. Plan
2. Build
3. Test
4. Review
5. Document

**Stops at PR creation** - requires manual merge

---

**11. `adw_sdlc_zte_iso.py` - Zero Touch Execution**
```bash
uv run adw_sdlc_zte_iso.py 123 [adw-id] [--skip-e2e] [--skip-resolution]
```

**⚠️ CRITICAL: Automatically merges to main!**

**Full Pipeline:**
1. Plan
2. Build
3. Test (stops on failure)
4. Review (stops on failure)
5. Document
6. **Ship** ← Automatic PR approval + merge

**Use When:**
- Trusted automation
- Non-critical changes
- Staging/development environments
- Proven workflow patterns

**DO NOT USE:**
- Production deployments (without extensive testing)
- Breaking changes
- Database migrations
- Security updates

---

## 🔐 ADWState Management

### State File Structure

Located at `agents/{adw_id}/adw_state.json`:

```json
{
  "adw_id": "abc12345",
  "issue_number": 123,
  "branch_name": "feat-123-abc12345-oauth-login",
  "plan_file": "specs/plan-abc12345-oauth.md",
  "issue_class": "/feature",
  "worktree_path": "/absolute/path/to/trees/abc12345",
  "backend_port": 9107,
  "frontend_port": 9207,
  "model_set": "base"
}
```

### State Fields

| Field | Type | Purpose | Set By |
|-------|------|---------|--------|
| `adw_id` | string | Unique workflow ID | All workflows |
| `issue_number` | int | GitHub issue number | Plan phase |
| `branch_name` | string | Git branch name | Plan phase |
| `plan_file` | string | Path to spec | Plan phase |
| `issue_class` | string | Issue type | Plan phase |
| `worktree_path` | string | Absolute worktree path | Plan phase |
| `backend_port` | int | Allocated backend port | Plan phase |
| `frontend_port` | int | Allocated frontend port | Plan phase |
| `model_set` | string | "base" or "heavy" | Plan phase |

### State Lifecycle

**1. Creation (Plan Phase):**
```python
state = ADWState(
    adw_id=generate_short_id(),
    issue_number=123,
    worktree_path="/path/to/trees/abc12345",
    backend_port=9107,
    frontend_port=9207
)
state.save()
```

**2. Loading (Dependent Phases):**
```python
state = ADWState.load(adw_id)

# Access fields
working_dir = state.worktree_path
plan_file = state.plan_file
backend_port = state.backend_port
```

**3. Updating:**
```python
state = ADWState.load(adw_id)
state.plan_file = "specs/plan-abc12345.md"
state.issue_class = "/feature"
state.save()
```

**4. Validation (Ship Phase):**
```python
# Ensures all fields populated before shipping
state.validate_complete()
# Raises if any field is None/empty
```

---

## 🧠 Model Selection System

### Base vs Heavy Models

**Base Set (Default):**
- Optimized for speed and cost
- Sonnet for most operations
- Fast iterations
- Standard complexity

**Heavy Set:**
- Optimized for complex tasks
- Opus for critical operations
- Deep reasoning
- High complexity scenarios

### Triggering Heavy Models

**In GitHub Issue:**
```
Title: Implement complex authentication system
Body: Need OAuth2 with multiple providers
Include workflow: adw_sdlc_iso model_set heavy
```

**In Comment:**
```
adw model_set heavy
```

### Model Mapping

```python
SLASH_COMMAND_MODEL_MAP = {
    "/implement": {
        "base": "sonnet",
        "heavy": "opus"
    },
    "/review": {
        "base": "sonnet", 
        "heavy": "opus"
    },
    "/resolve_failed_test": {
        "base": "sonnet",
        "heavy": "opus"
    },
    "/document": {
        "base": "sonnet",
        "heavy": "opus"
    },
    "/chore": {
        "base": "sonnet",
        "heavy": "opus"
    },
    "/bug": {
        "base": "sonnet",
        "heavy": "opus"
    },
    "/feature": {
        "base": "sonnet",
        "heavy": "opus"
    },
    "/patch": {
        "base": "sonnet",
        "heavy": "opus"
    }
}
```

**Commands Using Opus in Heavy Mode:**
- Complex implementations
- Test failure debugging
- E2E test resolution
- Documentation generation
- Issue-specific implementations

---

## 🤖 Agent Roles & Slash Commands

### Core Agents

**1. Classifier Agent**
- **Slash Command:** `/classify_issue`
- **Model:** Sonnet (both base/heavy)
- **Role:** Determine issue type
- **Output:** `/chore`, `/bug`, or `/feature`

**2. Planner Agents**
- **Slash Commands:** `/chore`, `/bug`, `/feature`
- **Models:** Sonnet (base), Opus (heavy)
- **Role:** Create implementation specs
- **Output:** Detailed plan in `specs/`

**3. Implementor Agent**
- **Slash Command:** `/implement`
- **Models:** Sonnet (base), Opus (heavy)
- **Role:** Execute implementation plan
- **Output:** Working code, git commits

**4. Patch Agent**
- **Slash Command:** `/patch`
- **Models:** Sonnet (base), Opus (heavy)
- **Role:** Quick targeted fixes
- **Output:** Focused patch commits

**5. Tester Agent**
- **Slash Command:** `/test`
- **Model:** Sonnet (both base/heavy)
- **Role:** Run test suites
- **Output:** Test results, auto-fixes

**6. Test Resolver Agents**
- **Slash Commands:** `/resolve_failed_test`, `/resolve_failed_e2e_test`
- **Models:** Sonnet (base), Opus (heavy)
- **Role:** Debug and fix test failures
- **Output:** Fixed tests, commits

**7. Reviewer Agent**
- **Slash Command:** `/review`
- **Models:** Sonnet (base), Opus (heavy)
- **Role:** Code quality review
- **Output:** Review comments, screenshots

**8. Documenter Agent**
- **Slash Command:** `/document`
- **Models:** Sonnet (base), Opus (heavy)
- **Role:** Generate documentation
- **Output:** Docs in `app_docs/`

---

## 🔄 Complete Workflow Example

### Scenario: User reports bug in issue #456

**1. Trigger**
```
Issue #456: Login button not working on mobile
Comment: "adw"
```

**2. Workflow Selection**
```bash
# Cron trigger picks it up
# Selects: adw_sdlc_iso (complete SDLC)
```

**3. Plan Phase (Entry Point)**
```bash
# Creates worktree
trees/abc12345/

# Allocates ports
Backend: 9107
Frontend: 9207

# Classifies issue
/classify_issue → "/bug"

# Creates plan
specs/plan-abc12345-fix-mobile-login.md

# Initializes state
agents/abc12345/adw_state.json
{
  "adw_id": "abc12345",
  "issue_number": 456,
  "branch_name": "fix-456-abc12345-mobile-login",
  "worktree_path": "/path/to/trees/abc12345",
  "backend_port": 9107,
  "frontend_port": 9207
}
```

**4. Build Phase (Dependent)**
```bash
# Loads state
state = ADWState.load("abc12345")

# Works in worktree
cd trees/abc12345/

# Implements fix
/implement specs/plan-abc12345-fix-mobile-login.md

# Commits
git commit -m "fix: mobile login touch events (abc12345)"
```

**5. Test Phase (Dependent)**
```bash
# Runs tests with allocated ports
BACKEND_PORT=9107 npm test

# Auto-resolves failures
/resolve_failed_test

# Commits results
git commit -m "test: fix mobile tests (abc12345)"
```

**6. Review Phase (Dependent)**
```bash
# Validates against spec
/review

# Captures screenshots
# Using frontend port 9207
review_img/mobile-login-after.png

# Uploads to GitHub
```

**7. Document Phase (Dependent)**
```bash
# Analyzes changes
/document

# Generates docs
app_docs/features/mobile-login/
  ├── overview.md
  ├── technical-guide.md
  └── images/

# Commits
git commit -m "docs: mobile login fix (abc12345)"
```

**8. Manual Review & Merge**
```bash
# Human reviews PR
# Merges via GitHub UI

# OR: Use ship workflow
uv run adw_ship_iso.py 456 abc12345
```

**9. Cleanup**
```bash
# Remove worktree after merge
git worktree remove trees/abc12345
```

---

## 🚀 Automation Triggers

### Cron Trigger (Polling)

**`trigger_cron.py`**
```bash
uv run adw_triggers/trigger_cron.py
```

**Monitors:**
- New issues with no comments
- Issues where latest comment is "adw"
- Polls every 20 seconds

**Workflow Selection:**
- Checks issue body for workflow keyword
- Default: `adw_plan_build_iso`
- Supports: All isolated workflows

---

### Webhook Trigger (Real-time)

**`trigger_webhook.py`**
```bash
uv run adw_triggers/trigger_webhook.py
```

**Configuration:**
```bash
# Environment
GITHUB_WEBHOOK_SECRET=your_secret_here

# GitHub Settings
Payload URL: https://your-domain.com/gh-webhook
Content type: application/json
Events: Issues, Issue comments
```

**Endpoints:**
- `/gh-webhook` - GitHub event receiver
- `/health` - Health check

**Security:**
- Validates webhook signatures
- Prevents replay attacks
- Requires secret token

---

## 🧠 Memory Integration (Mem0)

### What Gets Stored

After each workflow phase completion:

```json
{
  "adw_id": "abc12345",
  "issue_number": 456,
  "workflow_type": "sdlc_iso",
  "issue_class": "/bug",
  "task_description": "Fix login button on mobile",
  "solution_approach": "Fixed touch event handlers in LoginButton component",
  "files_changed": [
    "projects/kids-ascension/web/components/LoginButton.tsx",
    "projects/kids-ascension/web/styles/mobile.css"
  ],
  "worktree_path": "trees/abc12345/",
  "ports_used": {
    "backend": 9107,
    "frontend": 9207
  },
  "lessons_learned": [
    "Mobile touch events need passive listeners",
    "Safari requires specific touch-action CSS",
    "Test on actual devices, not just DevTools"
  ],
  "patterns_used": [
    "React useEffect for event listeners",
    "CSS touch-action property",
    "React Testing Library for touch events"
  ],
  "test_results": {
    "unit_passed": 42,
    "unit_failed": 0,
    "e2e_passed": 5,
    "e2e_failed": 0
  },
  "review_passed": true,
  "screenshots_captured": 3,
  "documentation_generated": true,
  "model_set_used": "base",
  "branch_name": "fix-456-abc12345-mobile-login",
  "commit_hash": "a1b2c3d4",
  "duration_minutes": 23,
  "timestamp": "2025-10-21T15:45:00Z"
}
```

### Memory Lifecycle

**Before Planning:**
```python
# Query similar past work
similar_bugs = memory.recall_similar_work(
    query="mobile login touch events",
    issue_class="/bug",
    limit=5
)

# Incorporate learnings
for bug in similar_bugs:
    # Review solution approaches
    # Note patterns that worked
    # Avoid past pitfalls
```

**After Each Phase:**
```python
# Extract phase-specific learnings
phase_learnings = extract_phase_summary(
    adw_id="abc12345",
    phase="review",
    outputs=agent_outputs
)

# Update state with new insights
state.add_learnings(phase_learnings)
```

**After Completion:**
```python
# Store complete workflow memory
memory.store_completed_workflow(WorkflowMemory(
    adw_id=state.adw_id,
    issue_number=state.issue_number,
    workflow_type="sdlc_iso",
    all_phases_data=state.to_dict(),
    learnings=extract_all_learnings(state)
))

# Tag for future retrieval
memory.add_tags([
    "mobile",
    "login",
    "touch-events",
    "bug-fix",
    "kids-ascension"
])
```

---

## 🎯 Best Practices

### For Agents

**Before Starting:**
1. ✅ Load ADWState if dependent workflow
2. ✅ Query Mem0 for similar tasks
3. ✅ Verify worktree exists (dependent only)
4. ✅ Check allocated ports are available
5. ✅ Read implementation plan (build phase)

**During Execution:**
1. ✅ Work only in assigned worktree
2. ✅ Use allocated ports for servers
3. ✅ Follow patterns from memory
4. ✅ Test continuously
5. ✅ Commit meaningful changes

**After Completion:**
1. ✅ Update ADWState with results
2. ✅ Extract learnings
3. ✅ Store in Mem0
4. ✅ Commit to worktree branch
5. ✅ Report status to GitHub

### For Humans

**Workflow Selection:**
- ❓ Not sure what's needed? → `adw_plan_iso` (plan first)
- 🐛 Quick bug fix? → `adw_patch_iso`
- ⚡ Standard feature? → `adw_plan_build_test_iso`
- 🔬 Complex feature? → `adw_sdlc_iso` + manual review
- 🤖 Trusted automation? → `adw_sdlc_zte_iso` (auto-ship)

**Complexity Selection:**
- 📝 Standard tasks → model_set base (default)
- 🧠 Complex logic → model_set heavy
- 🔧 Debugging hard failures → model_set heavy
- 📚 Detailed documentation → model_set heavy

**Cleanup:**
```bash
# After PR merge
git worktree remove trees/{adw_id}

# Periodic cleanup
git worktree prune

# Check disk usage
du -sh trees/*
```

---

## 🔐 Security & Safety

### Environment Variables

**Required:**
```bash
GITHUB_REPO_URL="https://github.com/owner/repo"
ANTHROPIC_API_KEY="sk-ant-..."
CLAUDE_CODE_PATH="/path/to/claude"
GITHUB_PAT="ghp_..."  # Optional
```

**Optional:**
```bash
GITHUB_WEBHOOK_SECRET="..."  # For webhooks
E2B_API_KEY="..."  # For sandbox execution
```

### Isolation Benefits

**Filesystem:**
- ✅ Each worktree is complete repo copy
- ✅ Changes isolated to worktree
- ✅ Easy rollback (remove worktree)
- ✅ No interference between workflows

**Network:**
- ✅ Dedicated ports per workflow
- ✅ No port conflicts
- ✅ Parallel dev servers
- ✅ Safe for concurrent execution

**Git:**
- ✅ Separate branches per workflow
- ✅ Independent commits
- ✅ Isolated git operations
- ✅ Clean merge history

### ZTE Safeguards

When using `adw_sdlc_zte_iso`:

**Built-in Stops:**
- ❌ Test phase fails → workflow stops
- ❌ Review phase fails → workflow stops
- ❌ Any phase errors → workflow stops

**Manual Override:**
```bash
# Skip auto-ship, stop at PR
uv run adw_sdlc_iso.py 456

# Manually review and merge
# Then cleanup
git worktree remove trees/{adw_id}
```

**When to Use ZTE:**
- ✅ Development/staging environments
- ✅ Non-critical features
- ✅ Proven workflow patterns
- ✅ Automated testing in place

**When NOT to Use ZTE:**
- ❌ Production deployments
- ❌ Database migrations
- ❌ Breaking API changes
- ❌ Security-related code
- ❌ Infrastructure changes

---

## 📊 Monitoring & Debugging

### Check Workflow Status

```bash
# List all worktrees
git worktree list

# Check ADW state
cat agents/{adw_id}/adw_state.json | jq .

# View agent outputs
tail -f agents/{adw_id}/planner/raw_output.jsonl | jq .

# Check allocated ports
cat trees/{adw_id}/.ports.env
```

### Debug Failed Workflows

```bash
# View full agent output
cat agents/{adw_id}/{agent}/raw_output.jsonl | jq .

# Check git status in worktree
cd trees/{adw_id}
git status
git log --oneline

# Verify ports are free
lsof -i :9107
lsof -i :9207

# Manually run phase
cd trees/{adw_id}
uv run adw_build_iso.py 456 {adw_id}
```

### Cleanup Stuck Worktrees

```bash
# Remove specific worktree
git worktree remove trees/{adw_id}

# Force remove if needed
git worktree remove --force trees/{adw_id}

# Clean orphaned entries
git worktree prune

# Manual directory cleanup
rm -rf trees/{adw_id}
```

---

## 🚀 Quick Start Guide

### First Time Setup

```bash
# 1. Install dependencies
brew install gh  # GitHub CLI
# Install Claude Code CLI (see docs)
curl -LsSf https://astral.sh/uv/install.sh | sh  # uv

# 2. Authenticate
gh auth login

# 3. Set environment
export GITHUB_REPO_URL="https://github.com/owner/repo"
export ANTHROPIC_API_KEY="sk-ant-..."
export CLAUDE_CODE_PATH="/path/to/claude"

# 4. Test basic workflow
cd adws/
uv run adw_plan_iso.py 123
```

### Daily Workflow

**Option 1: Manual Execution**
```bash
# Process specific issue
uv run adw_sdlc_iso.py 456

# Check result
git worktree list
```

**Option 2: Automated (Cron)**
```bash
# Start monitoring
uv run adw_triggers/trigger_cron.py

# Users comment "adw" on issues
# System auto-processes
```

**Option 3: Automated (Webhook)**
```bash
# Start webhook server
uv run adw_triggers/trigger_webhook.py

# Configure in GitHub
# Real-time processing
```

---

## 📚 Key Files Reference

### For Understanding System
- **This Document** - Strategic overview
- **`adws/README.md`** - Detailed ADW docs
- **`.claude/commands/*.md`** - Slash commands
- **`agents/{adw_id}/adw_state.json`** - Workflow state

### For Execution
- **Entry Points:** `adw_plan_iso.py`, `adw_patch_iso.py`
- **Dependent:** `adw_build_iso.py`, `adw_test_iso.py`, etc.
- **Orchestrators:** `adw_sdlc_iso.py`, `adw_sdlc_zte_iso.py`
- **Triggers:** `trigger_cron.py`, `trigger_webhook.py`

### For Debugging
- **Agent Outputs:** `agents/{adw_id}/{agent}/raw_output.jsonl`
- **Plans:** `specs/plan-{adw_id}-*.md`
- **Screenshots:** `agents/{adw_id}/reviewer/review_img/`
- **Documentation:** `app_docs/features/`

---

## ✨ Remember

> "We build in isolation, test with confidence, review with rigor, document with care, and ship with certainty. Every workflow is tracked, every learning is stored, every pattern is reused."

**Core Values:**

🏗️ **Isolation** - Complete filesystem and port separation

🧪 **Testing** - Automated testing at every stage

👀 **Review** - AI-powered code review with screenshots

📚 **Documentation** - Auto-generated comprehensive docs

🚀 **Automation** - From issue to production, minimal human touch

🧠 **Learning** - Every workflow improves the next

**The Isolated ADW Way:**
- Human creates issue → System creates isolated worktree
- Plan in isolation → Build in isolation → Test in isolation
- Review with screenshots → Document automatically
- Ship with confidence → Learn from results
- Repeat with more intelligence each time

**Concurrency Limits:**
- Maximum 15 concurrent workflows
- Ports: 9100-9114 (backend), 9200-9214 (frontend)
- Each workflow: Complete repo copy + dedicated ports
- Clean isolation: No interference between workflows

---

**Version**: 3.0.0 (Isolated Architecture)  
**Last Updated**: 2025-10-21  
**Status**: Production-Ready - Battle-Tested System  
**Next Evolution**: Multi-project support, Cross-repo learning