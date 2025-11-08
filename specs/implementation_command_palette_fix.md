# Implementation Plan: Fix Command Palette Access Issue

## Task Description

Implement a three-phase solution to fix the command palette access mismatch in the Ozean Licht megarepo. The issue occurs when users work in different directories (root, orchestrator, worktrees) and receive different slash commands in the command palette, creating confusion and reducing discoverability.

## Objective

Enable seamless command discovery across all working directories in the megarepo by implementing multi-root workspace support, project configuration metadata, and comprehensive documentation.

## Problem Statement

The command palette access issue creates three pain points:

1. **Discoverability**: Users don't find orchestrator-specific commands when working in that directory
2. **Context Mismatch**: Different commands available in different directories despite being the same repository
3. **Documentation Gap**: No clear guidance on expected command availability per context

## Solution Approach

Implement a three-tier solution:
- **Tier 1 (Immediate)**: VSCode multi-root workspace + documentation
- **Tier 2 (Short-term)**: Project configuration metadata + automation
- **Tier 3 (Long-term)**: Advocate for Claude SDK enhancement

## Relevant Files

### Current State Files
- `.claude/commands/` (29 root commands)
- `.claude/settings.json` (configuration)
- `apps/orchestrator_3_stream/.claude/commands/` (18 orchestrator commands)
- `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py` (discovery logic)

### New Files to Create
- `ozean-licht-ecosystem.code-workspace`
- `.claude/README.md`
- `.claude/project-config.yaml`
- `tools/claude-code-sync/` (directory with utilities)
- `specs/command-discovery-guide.md`

### Files to Update
- `CLAUDE.md` (add section on command discovery)
- `CONTEXT_MAP.md` (add reference)
- `README.md` (link to workspace file)

## Implementation Phases

### Phase 1: Foundation (Immediate)
Setup multi-root workspace and documentation for immediate UX improvement.

### Phase 2: Enhanced Discovery (1-2 weeks)
Implement project configuration registry and automation tooling.

### Phase 3: Long-term Architecture (Ongoing)
Advocate for Claude SDK enhancement and maintain command registry.

## Step by Step Tasks

### Phase 1: Foundation (Days 1-2)

#### Task 1.1: Create Multi-Root Workspace File
- **Location**: `ozean-licht-ecosystem.code-workspace`
- **Effort**: 30 minutes
- **Steps**:
  1. Create file with multi-root folder definitions
  2. Add each major project folder with descriptive names
  3. Include emoji prefixes for visual distinction
  4. Add settings for Python interpreters
  5. Validate JSON syntax
  6. Test opening with `code ozean-licht-ecosystem.code-workspace`

**Deliverable**: Working `.code-workspace` file

#### Task 1.2: Create Command Catalog Documentation
- **Location**: `.claude/README.md`
- **Effort**: 1-2 hours
- **Steps**:
  1. Document directory structure
  2. List all 47 commands with categories
  3. Explain command discovery mechanism
  4. Include troubleshooting section
  5. Add references to official docs
  6. Include command availability table

**Deliverable**: Complete `.claude/README.md` with full command inventory

#### Task 1.3: Update CLAUDE.md Engineering Rules
- **Location**: `CLAUDE.md`
- **Effort**: 1 hour
- **Steps**:
  1. Add "Command Discovery & Multi-Root Workspace" section
  2. Explain multi-root workspace usage
  3. Document command availability by context
  4. Add table showing which commands available where
  5. Include troubleshooting steps
  6. Reference `.claude/README.md`

**Deliverable**: CLAUDE.md updated with command guidance

#### Task 1.4: Update Context Map
- **Location**: `CONTEXT_MAP.md`
- **Effort**: 30 minutes
- **Steps**:
  1. Add entry for `.claude/` directory (Lines 1-50 reserved)
  2. Link to command discovery documentation
  3. Reference slash command files
  4. Include command palette tips

**Deliverable**: CONTEXT_MAP.md with new `.claude/` section

#### Task 1.5: Update Main README
- **Location**: `README.md`
- **Effort**: 30 minutes
- **Steps**:
  1. Add section "Opening in Multi-Root Workspace"
  2. Include command to open workspace
  3. Link to `ozean-licht-ecosystem.code-workspace`
  4. Add benefits list
  5. Link to CLAUDE.md command discovery section

**Deliverable**: README.md with workspace instructions

---

### Phase 2: Enhanced Discovery (Days 3-10)

#### Task 2.1: Create Project Configuration Registry
- **Location**: `.claude/project-config.yaml`
- **Effort**: 1.5 hours
- **Steps**:
  1. Define YAML schema for projects
  2. List all projects (root, orchestrator, apps, tools)
  3. Map each to command directory
  4. Define inheritance rules
  5. Add metadata (name, description, context)
  6. Document schema

**Deliverable**: `.claude/project-config.yaml` with all projects

#### Task 2.2: Implement Command Sync Utility
- **Location**: `tools/claude-code-sync/`
- **Effort**: 2 days
- **Steps**:
  1. Create directory: `tools/claude-code-sync/`
  2. Implement `config_loader.py` to parse project config
  3. Implement `command_syncer.py` to manage command availability
  4. Implement `__init__.py` with main entry point
  5. Create `README.md` with usage instructions
  6. Add validation and error handling
  7. Test with all projects

**Deliverable**: Working sync utility with tests

**Code Structure**:
```python
# tools/claude-code-sync/config_loader.py
class ProjectConfig:
    def __init__(self, path: str):
        self.projects = self._load_yaml(path)

    def get_project(self, name: str) -> Project:
        """Get project by name"""

    def get_commands_for_project(self, name: str) -> List[str]:
        """Get all available commands for project"""

    def validate(self) -> List[str]:
        """Validate configuration, return errors"""

# tools/claude-code-sync/command_syncer.py
class CommandSyncer:
    def sync_for_project(self, project_name: str):
        """Ensure correct commands available for project"""

    def sync_all(self):
        """Sync all projects"""

    def validate_commands(self) -> Dict[str, List[str]]:
        """Check for missing or duplicate commands"""
```

#### Task 2.3: Add Auto-Sync Hook
- **Location**: `.claude/hooks/auto_sync_commands.py`
- **Effort**: 1.5 hours
- **Steps**:
  1. Create hook that runs on Claude Code startup
  2. Call `claude-code-sync` to verify commands
  3. Log any issues
  4. Add to `.claude/settings.json` if needed
  5. Test hook execution

**Deliverable**: Working auto-sync hook

#### Task 2.4: Create Command Discovery Guide
- **Location**: `specs/command-discovery-guide.md`
- **Effort**: 1 hour
- **Steps**:
  1. Document command discovery mechanism
  2. Explain hierarchical loading
  3. Include troubleshooting flowchart
  4. Reference implementation files
  5. Add examples of adding new commands
  6. Document override behavior

**Deliverable**: Comprehensive discovery guide

#### Task 2.5: Add Validation Tests
- **Location**: `tests/test_command_discovery.py`
- **Effort**: 2 hours
- **Steps**:
  1. Test all commands load without errors
  2. Verify no duplicate commands (except intentional overrides)
  3. Check command frontmatter validity
  4. Validate orchestrator hierarchical discovery
  5. Test project config validation
  6. Run in CI/CD pipeline

**Deliverable**: Test suite with >90% coverage

---

### Phase 3: Long-Term Architecture (Ongoing)

#### Task 3.1: Prepare Feature Request for Anthropic
- **Effort**: 2-3 hours
- **Steps**:
  1. Write comprehensive feature request
  2. Include links to scout report and implementation
  3. Propose API for hierarchical command discovery
  4. Include use cases from megarepo
  5. Submit to Anthropic community
  6. Track status and updates

**Deliverable**: Feature request filed with Anthropic

#### Task 3.2: Maintain Command Registry
- **Ongoing**: 30 minutes/week
- **Steps**:
  1. Monitor for new commands added
  2. Update project config
  3. Verify no duplicate names
  4. Update documentation
  5. Run validation tests

**Deliverable**: Maintained registry

#### Task 3.3: Community Documentation
- **Effort**: 1.5 hours
- **Steps**:
  1. Add example to Claude Code docs
  2. Create blog post on multi-root monorepo setup
  3. Share with Claude Code community
  4. Reference from related projects

**Deliverable**: Community documentation

---

## Testing Strategy

### Unit Tests
```bash
# Test command discovery
cd apps/orchestrator_3_stream && python -m pytest backend/tests/test_slash_commands.py

# Test project config loader
python -m pytest tools/claude-code-sync/tests/test_config_loader.py

# Test command sync
python -m pytest tools/claude-code-sync/tests/test_command_syncer.py
```

### Integration Tests
```bash
# Test workspace opens correctly
code ozean-licht-ecosystem.code-workspace

# Test commands available in each folder
# - Root: Run /health_check, expect all root commands
# - Orchestrator: Run /orch_scout_and_build, expect orchestrator command
# - Kids Ascension: Run /plan, expect root command with app context

# Test hooks fire correctly
# - Open Claude Code with hooks enabled
# - Check logs for sync execution
```

### Manual Testing
1. **Multi-root workspace**:
   - [ ] Open workspace file
   - [ ] Switch between folders
   - [ ] Verify correct commands in palette

2. **Command execution**:
   - [ ] Run root command from root folder
   - [ ] Run orchestrator command from orchestrator folder
   - [ ] Run shared command from both contexts

3. **Documentation**:
   - [ ] Follow workspace instructions in README
   - [ ] Reference CLAUDE.md section
   - [ ] Use `.claude/README.md` for troubleshooting

4. **Automation**:
   - [ ] Sync utility runs successfully
   - [ ] No errors logged
   - [ ] All commands discovered

## Acceptance Criteria

### Phase 1
- [ ] Multi-root workspace file created and tested
- [ ] All commands discoverable from root folder
- [ ] `.claude/README.md` documents all commands
- [ ] CLAUDE.md updated with command guidance
- [ ] README.md explains multi-root workspace usage
- [ ] No breaking changes to existing workflows

### Phase 2
- [ ] Project configuration registry complete
- [ ] Sync utility implemented and tested
- [ ] Validation tests pass (>90% coverage)
- [ ] Auto-sync hook working
- [ ] No duplicate commands in any context
- [ ] Discovery guide complete

### Phase 3
- [ ] Feature request submitted to Anthropic
- [ ] Command registry maintained
- [ ] Community documentation published
- [ ] Documentation links updated

## Validation Commands

Execute these commands to validate implementation:

```bash
# 1. Verify workspace file syntax
cd /opt/ozean-licht-ecosystem
python3 -m json.tool ozean-licht-ecosystem.code-workspace > /dev/null && echo "✅ Workspace valid"

# 2. Count commands by category
echo "=== Command Count ===" && \
echo "Root commands: $(find .claude/commands -name '*.md' | wc -l)" && \
echo "Orchestrator commands: $(find apps/orchestrator_3_stream/.claude/commands -name '*.md' | wc -l)"

# 3. Test command discovery
cd apps/orchestrator_3_stream && \
python3 -c "
from backend.modules.slash_command_parser import discover_slash_commands
cmds = discover_slash_commands('.')
print(f'✅ Discovered {len(cmds)} commands')
print(f'  - Root: {len([c for c in cmds if c[\"source\"] == \"global\"])}')
print(f'  - App: {len([c for c in cmds if c[\"source\"] == \"app\"])}')
"

# 4. Verify documentation
test -f .claude/README.md && echo "✅ Command documentation exists"
grep -q "Command Palette\|Multi-Root" CLAUDE.md && echo "✅ CLAUDE.md updated"

# 5. Test project config (Phase 2)
python3 -m pytest tests/test_command_discovery.py -v 2>/dev/null && echo "✅ Tests pass" || echo "❌ Tests fail"
```

## Notes

### Dependencies
- VSCode (latest)
- Python 3.8+
- PyYAML for config parsing (add via `uv add pyyaml`)
- pytest for tests (already in project)

### Migration Path
1. **Backward Compatibility**: All changes are additive, no breaking changes
2. **Opt-in**: Multi-root workspace is optional, existing workflows still work
3. **Gradual Adoption**: Can adopt Phase 2 without Phase 1

### Known Limitations
1. Claude Code CLI doesn't support hierarchical discovery (will be fixed in Phase 3)
2. ADW worktrees in `trees/{adw_id}/` won't auto-discover commands (documented workaround)
3. Multi-root workspace requires VSCode (WebStorm and others not supported yet)

### Future Enhancements
- Command palette filtering by context
- Auto-completion for command arguments
- Command dependency graph visualization
- Integration with orchestrator agent creation
- Dynamic command generation based on project state

---

## Related Issues

- Feature request with Anthropic: (pending)
- Orchestrator command discovery: `apps/orchestrator_3_stream/backend/modules/slash_command_parser.py`
- ADW integration: `adws/adw_modules/orchestrator_integration.py`
- Command documentation: `.claude/README.md` (to be created)

## References

- Scout Report: `SCOUT_REPORT_COMMAND_PALETTE_ACCESS.md`
- Claude Code Slash Commands: https://docs.anthropic.com/en/docs/claude-code/slash-commands
- Claude Code Configuration: https://docs.anthropic.com/en/docs/claude-code/configuration
- Orchestrator Backend: `apps/orchestrator_3_stream/backend/`

---

## Estimations

| Task | Effort | Risk | Priority |
|------|--------|------|----------|
| 1.1: Workspace file | 0.5 hrs | 🟢 None | 🔴 P0 |
| 1.2: Command documentation | 1.5 hrs | 🟢 None | 🔴 P0 |
| 1.3: Update CLAUDE.md | 1 hr | 🟢 None | 🔴 P0 |
| 1.4: Update CONTEXT_MAP | 0.5 hrs | 🟢 None | 🔴 P0 |
| 1.5: Update README | 0.5 hrs | 🟢 None | 🔴 P0 |
| 2.1: Project config | 1.5 hrs | 🟡 Low | 🟡 P1 |
| 2.2: Sync utility | 2 days | 🟡 Low | 🟡 P1 |
| 2.3: Auto-sync hook | 1.5 hrs | 🟡 Low | 🟡 P1 |
| 2.4: Discovery guide | 1 hr | 🟢 None | 🟡 P1 |
| 2.5: Validation tests | 2 hrs | 🟡 Low | 🟡 P1 |
| 3.1: Feature request | 2-3 hrs | 🟢 None | 🟢 P2 |
| 3.2: Registry maintenance | 0.5 hrs/wk | 🟢 None | 🟢 P2 |
| **Phase 1 Total** | **4.5 hrs** | **🟢 Low** | **Critical** |
| **Phase 2 Total** | **8-9 hrs** | **🟡 Medium** | **High** |
| **Phase 3 Total** | **2-3 hrs** | **🟢 Low** | **Medium** |
| **GRAND TOTAL** | **14-16 hrs** | **🟡 Medium** | - |

---

**Implementation Plan End**

*Status: Ready for execution | Target Completion: 3 weeks*
