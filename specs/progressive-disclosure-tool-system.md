# Plan: Progressive Disclosure Tool System for Agent Experience

## Task Description

Implement a hierarchical, progressive disclosure system for tool discovery and execution throughout the Ozean Licht Ecosystem. The current flat command structure requires agents to load massive context (50+ commands across 6 scripts, ~20k tokens) upfront. This plan redesigns the tool architecture to enable agents to progressively discover and use tools through a natural, self-documenting flow that loads minimal context at each stage.

## Objective

Create a three-level hierarchical tool system that:
1. **Reduces context pollution** by 80-90% (from ~20k to ~2-4k tokens per interaction)
2. **Improves agent navigation** through progressive disclosure (Discover → Explore → Execute)
3. **Maintains backwards compatibility** with existing monolithic scripts
4. **Provides first-class Agent Experience (AX)** through self-documenting, intuitive interfaces
5. **Enables natural tool discovery** without requiring prior knowledge of available commands

## Problem Statement

**Current State:**
- Agents must load comprehensive knowledge of all 19 tools and 50+ commands upfront
- Flat command structure with no natural discovery mechanism
- High context usage (~20k tokens) for basic tool navigation
- Poor Agent Experience - no guidance on what tools are available or how to use them
- Difficult to extend - adding new tools increases context burden on all agents

**User Pain Points:**
- Agents struggle to find the right tool for a task
- Massive context consumption for simple operations
- No clear entry point for tool discovery
- Friction in tool navigation reduces agent efficiency

**Business Impact:**
- Slower agent task completion
- Higher API costs due to context usage
- Reduced agent effectiveness
- Difficulty onboarding new autonomous workflows

## Solution Approach

Implement a **three-level hierarchical discovery system** inspired by Unix philosophy and modern CLI design:

### Level 1: Entry Point (Minimal Context ~500 tokens)
```bash
tools/discover.sh
# Lists 5-6 tool categories with one-line descriptions
# Example output:
#   deployment     - Coolify application deployment and management
#   containers     - Docker container operations and monitoring
#   monitoring     - System health checks and metrics
```

### Level 2: Category Exploration (Medium Context ~1-2k tokens)
```bash
tools/deployment/list.sh
# Lists available commands in category with brief descriptions
# Example output:
#   deploy.sh <app_id>        Deploy application to Coolify
#   restart.sh <app_id>       Restart running application
#   status.sh <app_id>        Get application status
```

### Level 3: Command Execution (Targeted Context ~1-3k tokens)
```bash
tools/deployment/deploy.sh 3
# Executes specific command with full parameter validation
# Only loads context needed for this specific operation
```

**Key Design Principles:**
1. **Progressive Disclosure** - Show minimal info, reveal more on demand
2. **Self-Documenting** - Each level explains the next
3. **Context Efficiency** - Load only what's needed
4. **Natural Flow** - Intuitive discovery path
5. **Consistency** - Same patterns across all categories
6. **Backwards Compatible** - Existing scripts continue to work

## Relevant Files

### Existing Files to Reference
- `tools/scripts/utils.sh` - Shared utilities library (17KB) - will be reused
- `tools/scripts/coolify.sh` - Deployment management (8.7KB) - extract commands
- `tools/scripts/docker.sh` - Container management (10KB) - extract commands
- `tools/scripts/monitoring.sh` - Health checks (15KB) - extract commands
- `tools/scripts/database.sh` - PostgreSQL utilities (12KB) - extract commands
- `tools/scripts/git.sh` - Version control (12KB) - extract commands
- `tools/scripts/ssh.sh` - Remote operations (12KB) - extract commands
- `tools/inventory/tool-catalog.json` - Master catalog - update with new structure
- `CLAUDE.md` - AI agent instructions - update with new patterns
- `CONTEXT_MAP.md` - Navigation guide - update with hierarchy

### New Files to Create

#### Entry Points
- `tools/discover.sh` - Main entry point for tool discovery
- `tools/README.md` - Overview of new hierarchical structure

#### Deployment Category
- `tools/deployment/list.sh` - List deployment commands
- `tools/deployment/deploy.sh` - Deploy application
- `tools/deployment/restart.sh` - Restart application
- `tools/deployment/status.sh` - Get application status
- `tools/deployment/logs.sh` - Get application logs
- `tools/deployment/health.sh` - Check Coolify API health

#### Containers Category
- `tools/containers/list.sh` - List container commands
- `tools/containers/ps.sh` - List containers
- `tools/containers/logs.sh` - Container logs
- `tools/containers/stats.sh` - Resource statistics
- `tools/containers/restart.sh` - Restart container
- `tools/containers/exec.sh` - Execute in container
- `tools/containers/health.sh` - Check container health

#### Monitoring Category
- `tools/monitoring/list.sh` - List monitoring commands
- `tools/monitoring/health.sh` - Health check service
- `tools/monitoring/health-all.sh` - Check all services
- `tools/monitoring/resources.sh` - System resource usage
- `tools/monitoring/connectivity.sh` - Network connectivity test
- `tools/monitoring/report.sh` - Generate health report

#### Database Category
- `tools/database/list.sh` - List database commands
- `tools/database/backup.sh` - Backup database
- `tools/database/restore.sh` - Restore database
- `tools/database/size.sh` - Database size
- `tools/database/connections.sh` - Active connections
- `tools/database/query.sh` - Execute query

#### Git Category
- `tools/git/list.sh` - List git commands
- `tools/git/status.sh` - Enhanced status
- `tools/git/commit.sh` - Commit with tracking
- `tools/git/push.sh` - Push with validation
- `tools/git/history.sh` - Recent commits
- `tools/git/branch.sh` - Branch information

#### Remote Category
- `tools/remote/list.sh` - List remote commands
- `tools/remote/exec.sh` - Execute remote command
- `tools/remote/upload.sh` - Upload file
- `tools/remote/download.sh` - Download file
- `tools/remote/test.sh` - Test connection

## Implementation Phases

### Phase 1: Foundation (Structure & Templates)
Create the directory structure, entry point, and templates that will be used for all categories. Establish patterns and conventions.

**Deliverables:**
- Directory structure for all 6 categories
- `tools/discover.sh` entry point
- Template for category `list.sh` scripts
- Template for individual command scripts
- Shared utilities extensions
- Testing framework

**Duration:** ~1-2 hours

### Phase 2: Core Implementation (Command Extraction)
Extract commands from monolithic scripts into individual command scripts. Maintain all existing functionality while organizing into new structure.

**Deliverables:**
- 35+ individual command scripts
- All commands functional and tested
- State tracking integrated
- Help systems consistent
- Backwards compatibility validated

**Duration:** ~3-4 hours

### Phase 3: Documentation & Integration (Agent Experience)
Update all documentation to reflect new structure, create agent usage examples, and integrate with existing systems.

**Deliverables:**
- Updated CLAUDE.md with discovery patterns
- Updated CONTEXT_MAP.md with hierarchy
- Agent usage examples
- Migration guide for developers
- Performance benchmarks
- Tool catalog updates

**Duration:** ~1-2 hours

### Phase 4: Validation & Optimization (Quality Assurance)
Comprehensive testing, performance validation, and agent experience optimization.

**Deliverables:**
- All commands tested
- Performance benchmarks met (<1s for discovery)
- Agent navigation flow validated
- Context reduction verified (80-90%)
- Production readiness confirmed

**Duration:** ~1 hour

**Total Estimated Time:** 6-9 hours

## Step by Step Tasks

### 1. Create Directory Structure and Foundation
- Create base directory structure for all 6 categories (deployment, containers, monitoring, database, git, remote)
- Create `tools/discover.sh` as main entry point with category listing
- Create `tools/templates/list-template.sh` for category listers
- Create `tools/templates/command-template.sh` for individual commands
- Extend `tools/scripts/utils.sh` with helper functions for hierarchical navigation
- Create `tools/testing/validate-structure.sh` for testing

### 2. Implement Entry Point (tools/discover.sh)
- Display ASCII banner/header for visual appeal
- List all 6 tool categories with one-line descriptions
- Show usage instructions for next level
- Add color-coded output for better readability
- Include examples of common workflows
- Implement `--help` flag
- Track usage in state file
- Keep output under 500 tokens

### 3. Build Deployment Category Commands
- Create `tools/deployment/list.sh` with all available commands
- Extract `deploy_application` → `tools/deployment/deploy.sh`
- Extract `restart_application` → `tools/deployment/restart.sh`
- Extract `get_application_status` → `tools/deployment/status.sh`
- Extract `get_logs` → `tools/deployment/logs.sh`
- Extract `health_check` → `tools/deployment/health.sh`
- Implement consistent parameter validation across all commands
- Add state tracking to each command
- Create help text for each command

### 4. Build Containers Category Commands
- Create `tools/containers/list.sh` with all available commands
- Extract `ps_containers` → `tools/containers/ps.sh`
- Extract `logs_container` → `tools/containers/logs.sh`
- Extract `stats_containers` → `tools/containers/stats.sh`
- Extract `restart_container` → `tools/containers/restart.sh`
- Extract `exec_container` → `tools/containers/exec.sh`
- Extract `health_check` → `tools/containers/health.sh`
- Add support for both local and remote execution (via `--remote` flag)
- Implement consistent error handling

### 5. Build Monitoring Category Commands
- Create `tools/monitoring/list.sh` with all available commands
- Extract `health_check_service` → `tools/monitoring/health.sh`
- Extract `health_check_all` → `tools/monitoring/health-all.sh`
- Extract `resource_usage` → `tools/monitoring/resources.sh`
- Extract `connectivity_test` → `tools/monitoring/connectivity.sh`
- Extract `generate_health_report` → `tools/monitoring/report.sh`
- Ensure all health checks have consistent output format
- Add JSON output option for programmatic consumption

### 6. Build Database Category Commands
- Create `tools/database/list.sh` with all available commands
- Extract `backup_database` → `tools/database/backup.sh`
- Extract `restore_database` → `tools/database/restore.sh` (with safety confirmations)
- Extract `database_size` → `tools/database/size.sh`
- Extract `active_connections` → `tools/database/connections.sh`
- Extract `execute_query` → `tools/database/query.sh`
- Maintain all safety checks for destructive operations
- Add dry-run options where applicable

### 7. Build Git Category Commands
- Create `tools/git/list.sh` with all available commands
- Extract `status_enhanced` → `tools/git/status.sh`
- Extract `commit_with_state` → `tools/git/commit.sh`
- Extract `push_with_validation` → `tools/git/push.sh`
- Extract `recent_commits` → `tools/git/history.sh`
- Extract `branch_info` → `tools/git/branch.sh`
- Maintain all git safety features (pre-flight checks, validation)
- Keep state tracking for all operations

### 8. Build Remote Category Commands
- Create `tools/remote/list.sh` with all available commands
- Extract `exec_remote` → `tools/remote/exec.sh`
- Extract `file_upload` → `tools/remote/upload.sh`
- Extract `file_download` → `tools/remote/download.sh`
- Extract `test_connection` → `tools/remote/test.sh`
- Handle SSH configuration consistently
- Add clear error messages for connection issues

### 9. Implement Backwards Compatibility Layer
- Keep all existing monolithic scripts in `tools/scripts/`
- Add deprecation notices to monolithic scripts
- Create wrapper functions that delegate to new commands
- Document migration path in each legacy script
- Ensure existing workflows continue to work without changes
- Add logging to track usage of legacy vs new commands

### 10. Update Tool Catalog and State Management
- Update `tools/inventory/tool-catalog.json` with new hierarchical structure
- Add metadata for each category (path, commands, context_size)
- Update state tracking to record usage patterns (which paths agents take)
- Create analytics for context savings
- Add discovery path tracking (entry → category → command)
- Generate usage reports for optimization

### 11. Update Agent Documentation (CLAUDE.md)
- Add section on "Progressive Tool Discovery"
- Provide examples of discovery flow (discover → list → execute)
- Update decision rules for when to use hierarchical vs direct access
- Add best practices for agent navigation
- Include context-saving tips
- Document backwards compatibility approach
- Add troubleshooting section for common navigation issues

### 12. Update Context Map (CONTEXT_MAP.md)
- Replace flat tool list with hierarchical structure
- Add visual diagram of three-level hierarchy
- Update quick reference examples with new paths
- Add "Agent Navigation Flow" section
- Document context savings per level
- Include migration guide for existing workflows

### 13. Create Agent Usage Examples
- Create `tools/examples/discovery-flow.md` with walkthrough
- Add example for common workflows (deploy, monitor, troubleshoot)
- Document context usage at each level with token counts
- Show before/after context comparisons
- Include best practices for efficient navigation
- Add anti-patterns to avoid

### 14. Performance Testing and Optimization
- Benchmark all commands for execution time (<1s for discovery/list)
- Measure context reduction (target: 80-90% reduction)
- Test agent navigation flow with real scenarios
- Optimize slow commands
- Validate backwards compatibility works
- Load test with concurrent executions

### 15. Comprehensive Validation
- Execute all commands to ensure they work
- Test all discovery paths (entry → category → command)
- Verify state tracking is recording correctly
- Validate help systems are consistent
- Confirm backwards compatibility with legacy scripts
- Review all documentation for accuracy
- Generate performance report
- Create acceptance test suite

## Testing Strategy

### Unit Testing
- Test each individual command script independently
- Validate parameter parsing and validation
- Test error handling for invalid inputs
- Verify state tracking records correctly
- Ensure help text is displayed properly

### Integration Testing
- Test full discovery flow (discover → list → execute)
- Verify backwards compatibility with legacy scripts
- Test state management across command hierarchy
- Validate shared utilities work at all levels
- Test remote execution flags work consistently

### Performance Testing
- Benchmark discovery time (target: <100ms)
- Benchmark category list time (target: <200ms)
- Benchmark command execution (existing baseline)
- Measure context token reduction (target: 80-90%)
- Load test with concurrent agent executions

### Agent Experience Testing
- Simulate agent discovery flow without prior knowledge
- Measure time to find and execute specific command
- Validate error messages are helpful
- Test navigation with incomplete information
- Measure context usage across different workflows

### Edge Cases
- Test with missing environment variables
- Test with invalid command parameters
- Test with unavailable services (graceful degradation)
- Test concurrent state file access
- Test with malformed inputs

## Acceptance Criteria

### Functional Requirements
- ✅ Entry point (`discover.sh`) lists all 6 categories with descriptions
- ✅ Each category has a `list.sh` that shows available commands
- ✅ All 35+ individual commands execute successfully
- ✅ Backwards compatibility maintained - existing scripts continue to work
- ✅ Help text available at all three levels (entry, category, command)
- ✅ State tracking records usage at all levels
- ✅ All commands have consistent error handling

### Performance Requirements
- ✅ Discovery operation completes in <100ms
- ✅ Category listing completes in <200ms
- ✅ Command execution matches existing baseline (<1s for scripts)
- ✅ Context reduction of 80-90% achieved vs flat structure
- ✅ No performance regression for direct command execution

### Quality Requirements
- ✅ All documentation updated (CLAUDE.md, CONTEXT_MAP.md, README.md)
- ✅ Agent usage examples created and validated
- ✅ Consistent help format across all levels
- ✅ Color-coded output for better readability
- ✅ Clear error messages with suggested actions
- ✅ Tool catalog reflects new structure

### Agent Experience Requirements
- ✅ Agent can discover tools without prior knowledge
- ✅ Natural progression from discovery to execution
- ✅ Minimal context loaded at each level
- ✅ Self-documenting - each level explains the next
- ✅ Consistent patterns across all categories
- ✅ Clear usage examples at each level

## Validation Commands

Execute these commands to validate the implementation is complete:

### Structure Validation
```bash
# Verify directory structure exists
test -d tools/deployment && test -d tools/containers && test -d tools/monitoring && test -d tools/database && test -d tools/git && test -d tools/remote && echo "✅ All category directories exist"

# Verify entry point exists and is executable
test -x tools/discover.sh && echo "✅ Entry point is executable"

# Count command scripts (should be 35+)
find tools/deployment tools/containers tools/monitoring tools/database tools/git tools/remote -name "*.sh" -type f | wc -l
```

### Functional Validation
```bash
# Test entry point
bash tools/discover.sh

# Test category listers
bash tools/deployment/list.sh
bash tools/containers/list.sh
bash tools/monitoring/list.sh

# Test sample commands from each category
bash tools/containers/ps.sh
bash tools/monitoring/resources.sh
bash tools/git/status.sh
```

### Backwards Compatibility Validation
```bash
# Verify legacy scripts still work
bash tools/scripts/docker.sh ps_containers
bash tools/scripts/monitoring.sh resource_usage
bash tools/scripts/git.sh status_enhanced
```

### Performance Validation
```bash
# Benchmark discovery time
time bash tools/discover.sh

# Benchmark category listing time
time bash tools/deployment/list.sh

# Measure context (manually verify in agent interaction)
# Entry point should be ~500 tokens
# Category list should be ~1-2k tokens
# Full command help should be ~1-3k tokens
```

### Documentation Validation
```bash
# Verify all help flags work
bash tools/discover.sh --help
bash tools/deployment/list.sh --help
bash tools/deployment/deploy.sh --help

# Check documentation files updated
grep -q "Progressive Tool Discovery" .claude/CLAUDE.md && echo "✅ CLAUDE.md updated"
grep -q "hierarchical structure" CONTEXT_MAP.md && echo "✅ CONTEXT_MAP.md updated"
test -f tools/examples/discovery-flow.md && echo "✅ Usage examples created"
```

### State Tracking Validation
```bash
# Verify state file records new command structure
jq '.tools.deployment' tools/inventory/tool-state.json

# Check execution history includes hierarchical commands
jq '.tools.deployment.execution_history[-1]' tools/inventory/tool-state.json
```

## Notes

### Design Decisions

**Why Three Levels (not two or four)?**
- Two levels still requires loading all commands upfront
- Four levels adds unnecessary complexity
- Three levels provides optimal balance: Category → List → Execute

**Why Individual Scripts (not functions)?**
- Scripts are discoverable via filesystem (ls, find, glob)
- Each script has independent help documentation
- Easier to test and maintain independently
- Clearer separation of concerns
- Better for agent file system navigation

**Why Keep Monolithic Scripts?**
- Backwards compatibility for existing workflows
- Gradual migration path
- Some power users prefer monolithic interface
- Deprecation with clear migration timeline

### Context Savings Calculation

**Current State:**
- Loading all 50+ commands: ~20k tokens
- Agent must know all tools upfront
- High cognitive load

**New State:**
- Level 1 (Entry): ~500 tokens (95% reduction)
- Level 2 (Category): ~1-2k tokens (90% reduction)
- Level 3 (Command): ~1-3k tokens (85% reduction)

**Average Interaction:**
- Before: 20k tokens to find and execute command
- After: 500 + 1.5k + 2k = 4k tokens (80% reduction)

### Future Enhancements

**Phase 2 Improvements:**
- Interactive mode for guided discovery
- Fuzzy search across all commands
- Command aliases for common operations
- Auto-complete support
- Command history and favorites
- Usage analytics dashboard
- AI-powered command suggestions
- Natural language command parsing

**Potential Extensions:**
- Web UI for visual discovery
- GraphQL API for programmatic access
- IDE extensions for autocomplete
- Metrics dashboard showing context savings
- A/B testing framework for AX improvements

### Dependencies

**No New Dependencies Required:**
- Bash 4.0+ (already available)
- jq (already available for JSON manipulation)
- All existing utilities maintained

**Environment Variables:**
- All existing env vars continue to work
- No new required env vars
- Optional: `TOOL_DISCOVERY_STYLE=minimal|detailed` for output verbosity

### Migration Strategy

**Week 1:** Deploy new structure, keep legacy scripts
**Week 2-3:** Monitor usage patterns, gather feedback
**Week 4:** Add deprecation notices to legacy scripts
**Month 2:** Update all documentation to prefer new structure
**Month 3:** Consider removing legacy scripts (based on usage data)

### Success Metrics

**Quantitative:**
- Context reduction: 80-90% vs baseline
- Discovery time: <5 seconds from entry to execution
- Adoption rate: 70%+ of agent interactions use new structure within 2 weeks
- Error rate: <2% for command discovery/execution

**Qualitative:**
- Agent developers report improved navigation
- Reduced confusion about available tools
- Faster onboarding for new autonomous workflows
- Positive feedback on self-documenting nature

---

**Plan Created:** 2025-11-11
**Estimated Effort:** 6-9 hours
**Priority:** High - Foundational improvement for all agent workflows
**Risk Level:** Low - Backwards compatible, incremental deployment
