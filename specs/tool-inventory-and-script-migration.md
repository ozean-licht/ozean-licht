# Plan: Tool Inventory System and Script-Based Migration

## Task Description
Create a comprehensive, state-managed tool inventory system that categorizes all tools in the Ozean Licht ecosystem. Migrate appropriate tools from MCP-based to script-based implementations to reduce friction for AI agents, while maintaining MCP integration for tools that require complex state management, authentication, or protocol handling.

## Objective
Establish a unified tool catalog that:
1. Documents all available tools and their capabilities
2. Provides clear criteria for MCP vs script-based implementation
3. Implements script-based wrappers for suitable tools (Coolify, Docker, etc.)
4. Maintains state tracking for tool execution and health
5. Reduces agent friction by using simpler, self-explanatory scripts where possible
6. Preserves MCP Gateway for tools requiring complex integration (Firecrawl, Mem0, etc.)

## Problem Statement
Currently, the ecosystem relies heavily on MCP Gateway for tool access, which adds unnecessary complexity for tools that could be accessed directly via CLI or simple REST APIs. This creates friction for agents that must:
- Understand MCP protocol for simple operations
- Route through an additional service layer
- Wait for MCP Gateway response times
- Debug MCP-specific issues

Some tools (like Coolify, Docker, Git) have well-documented CLIs or simple APIs that agents can execute directly with less overhead.

## Solution Approach
Create a **three-tier tool architecture**:

1. **Tier 1: Native Scripts** - Direct CLI/bash execution for simple tools
   - Examples: Docker, Git, Coolify CLI, system monitoring
   - Benefit: Zero latency, self-documenting, no middleware

2. **Tier 2: Lightweight API Scripts** - Curl-based wrappers for REST APIs
   - Examples: Coolify API, Prometheus queries, Grafana dashboards
   - Benefit: Simple HTTP calls, easy debugging, transparent

3. **Tier 3: MCP Services** - Complex integrations requiring state/auth
   - Examples: Firecrawl, Mem0, PostgreSQL connection pools, GitHub App
   - Benefit: Proper connection management, authentication, protocol handling

## Relevant Files

### Existing Files to Modify
- `tools/mcp-gateway/config/mcp-catalog.json` - Current MCP catalog (will extend, not replace)
- `tools/README.md` - Tool infrastructure documentation
- `CONTEXT_MAP.md` - Agent navigation guide
- `.claude/CLAUDE.md` - Agent instructions

### New Files to Create

#### Tool Inventory System
- `tools/inventory/tool-catalog.json` - **Master catalog** of all tools (MCP + scripts + native)
- `tools/inventory/tool-state.json` - State tracking (health, last execution, metrics)
- `tools/inventory/README.md` - Inventory system documentation

#### Script-Based Tool Wrappers
- `tools/scripts/coolify.sh` - Coolify operations (deploy, restart, list)
- `tools/scripts/docker.sh` - Docker operations (ps, logs, restart, stats)
- `tools/scripts/git.sh` - Git operations (status, commit, push, branch)
- `tools/scripts/monitoring.sh` - System monitoring (health checks, metrics)
- `tools/scripts/database.sh` - Database utilities (migrations, backups)
- `tools/scripts/ssh.sh` - SSH operations (exec, tunnel, file transfer)
- `tools/scripts/utils.sh` - Shared utilities (logging, error handling, state updates)

#### Documentation
- `tools/inventory/docs/tool-selection-guide.md` - Decision tree for tool selection
- `tools/inventory/docs/script-development-guide.md` - Guidelines for creating new scripts
- `tools/inventory/docs/state-management.md` - State tracking system documentation

## Implementation Phases

### Phase 1: Foundation - Tool Inventory System
**Goal:** Create the master tool catalog and state management infrastructure

**Deliverables:**
- `tool-catalog.json` schema with all existing tools
- `tool-state.json` tracking system
- Inventory README with usage guidelines

### Phase 2: Core Implementation - Script-Based Wrappers
**Goal:** Implement script wrappers for Tier 1 and Tier 2 tools

**Deliverables:**
- Coolify script wrapper (deploy, restart, list, status)
- Docker script wrapper (ps, logs, stats, restart)
- Monitoring script wrapper (health checks across all services)
- Shared utilities library

### Phase 3: Integration & Polish
**Goal:** Integrate script tools with existing MCP Gateway, update documentation

**Deliverables:**
- Updated CONTEXT_MAP.md with tool selection guidance
- Agent instructions in CLAUDE.md
- State tracking integration
- Testing and validation

## Step by Step Tasks

### 1. Design Tool Catalog Schema
- Create JSON schema defining tool structure (name, type, tier, capabilities, commands)
- Define tool types: `mcp`, `script-native`, `script-api`, `builtin`
- Define tool tiers: `tier1-native`, `tier2-api`, `tier3-mcp`
- Include metadata: version, status, location, dependencies, health-check
- Add command schema: syntax, parameters, examples, exit codes

### 2. Create Master Tool Catalog
- Import all 11 existing MCP services from `mcp-catalog.json`
- Add script-based tools: Docker, Git, SSH, Coolify CLI, monitoring
- Add built-in tools: file operations, text processing, network utilities
- Categorize each tool by tier and type
- Document decision rationale for each tool's tier assignment

### 3. Implement State Management System
- Create `tool-state.json` with schema: last_execution, status, health, metrics
- Add state update function in `utils.sh`
- Implement state reader/writer with file locking
- Add state cleanup (prune old executions after 7 days)
- Create state query functions (get tool status, health, last execution)

### 4. Create Coolify Script Wrapper
- Implement `coolify.sh` with functions:
  - `list_applications()` - List all apps
  - `deploy_application(app_id)` - Trigger deployment
  - `restart_application(app_id)` - Restart app
  - `get_application_status(app_id)` - Get app status
  - `list_databases()` - List databases
  - `get_logs(app_id, lines)` - Fetch application logs
- Use Coolify API (Bearer token auth via env var)
- Add error handling and state updates
- Include usage examples in comments

### 5. Create Docker Script Wrapper
- Implement `docker.sh` with functions:
  - `ps_containers(filter)` - List containers
  - `logs_container(name, lines, follow)` - Container logs
  - `stats_containers()` - Resource usage
  - `restart_container(name)` - Restart container
  - `exec_container(name, command)` - Execute command
  - `health_check(name)` - Container health
- Support both local and remote (SSH) execution
- Add JSON output option for parsing
- Update state after each operation

### 6. Create Monitoring Script Wrapper
- Implement `monitoring.sh` with functions:
  - `health_check_all()` - Check all services
  - `health_check_service(name)` - Check specific service
  - `get_metrics(service)` - Prometheus metrics query
  - `get_logs_errors(service, minutes)` - Recent errors
  - `resource_usage()` - CPU, memory, disk
  - `service_uptime(name)` - Service uptime
- Support remote monitoring via SSH
- Output in human-readable and JSON formats
- Update tool state with health status

### 7. Create Git Operations Script
- Implement `git.sh` with functions:
  - `status_enhanced()` - Enhanced git status with branch info
  - `commit_with_state(message)` - Commit and update state
  - `push_with_validation()` - Push with pre-flight checks
  - `branch_info()` - Current branch details
  - `recent_commits(count)` - Recent commit log
- Integrate with tool state tracking
- Add safety checks (uncommitted changes, diverged branches)

### 8. Create Database Operations Script
- Implement `database.sh` with functions:
  - `backup_database(db_name, output_path)` - Database backup
  - `restore_database(db_name, backup_path)` - Restore backup
  - `run_migrations(app)` - Run Prisma/migrations
  - `database_size(db_name)` - Get database size
  - `active_connections(db_name)` - Show active connections
- Support both PostgreSQL databases (KA and OL)
- Use connection URLs from environment
- Update state with backup/restore status

### 9. Create Shared Utilities Library
- Implement `utils.sh` with functions:
  - `log_info(message)`, `log_error(message)`, `log_success(message)` - Logging
  - `update_tool_state(tool, status, metadata)` - State updates
  - `get_tool_state(tool)` - State queries
  - `check_dependencies(tool)` - Dependency validation
  - `execute_remote(command)` - Remote SSH execution
  - `parse_json(file, query)` - JSON parsing with jq
  - `handle_error(code, message)` - Error handling
- Source this in all other scripts
- Add color output for terminal readability

### 10. Update Tool Catalog with Script Tools
- Add all new script tools to `tool-catalog.json`
- Include complete command documentation
- Add examples for each operation
- Define health check endpoints/commands
- Document dependencies and prerequisites

### 11. Create Tool Selection Guide
- Write `tool-selection-guide.md` with decision tree
- **Use Script (Tier 1)** when:
  - Tool has stable CLI interface
  - No complex state/auth required
  - Direct system access available
  - Operation is one-shot or stateless
- **Use API Script (Tier 2)** when:
  - Tool has REST API with simple auth
  - State is managed server-side
  - Lightweight HTTP wrapper sufficient
- **Use MCP (Tier 3)** when:
  - Complex authentication (OAuth, GitHub App)
  - Connection pooling required
  - Protocol translation needed
  - Stateful session management
  - Rate limiting/cost tracking essential
- Include examples for each scenario

### 12. Update Agent Documentation
- Update `CONTEXT_MAP.md` with three-tier tool architecture
- Update `.claude/CLAUDE.md` with tool selection guidelines
- Add tool catalog location and usage instructions
- Document state management system
- Provide quick reference for common operations

### 13. Implement Tool Health Monitoring
- Create periodic health check script
- Check health of all tools (MCP services + script tools)
- Update `tool-state.json` with health status
- Send alerts for unhealthy tools
- Integrate with existing monitoring infrastructure

### 14. Integration Testing
- Test all script wrappers locally and remotely
- Verify state updates are working correctly
- Test error handling and edge cases
- Validate JSON output parsing
- Ensure MCP Gateway still functions correctly
- Test tool selection decision tree with real scenarios

### 15. Create Agent Usage Examples
- Write comprehensive examples in each script's README
- Document common workflows using multiple tools
- Show mixed usage (scripts + MCP services)
- Include troubleshooting scenarios
- Add performance comparisons (script vs MCP latency)

## Testing Strategy

### Unit Testing
- Test each script function independently
- Mock external dependencies (API calls, SSH)
- Validate JSON schema compliance
- Test error handling paths

### Integration Testing
- Test script execution in actual environment
- Verify state updates persist correctly
- Test remote execution via SSH
- Validate Coolify API interactions
- Ensure Docker operations work correctly

### System Testing
- Full workflow tests (deploy → monitor → restart)
- State consistency across multiple tool executions
- Concurrent tool execution handling
- Fallback to MCP when scripts unavailable

### Edge Cases
- Network failures during API calls
- File locking conflicts in state updates
- Missing dependencies (jq, curl, docker)
- Invalid API tokens/credentials
- SSH key authentication failures
- Malformed JSON in catalog/state files

## Acceptance Criteria

1. **Tool Catalog Completeness**
   - ✅ All 11 existing MCP services documented
   - ✅ At least 8 new script-based tools added
   - ✅ Each tool has complete metadata (type, tier, commands, examples)
   - ✅ Tool catalog is valid JSON with proper schema

2. **Script Implementation**
   - ✅ Coolify script with 6+ operations
   - ✅ Docker script with 6+ operations
   - ✅ Monitoring script with 6+ operations
   - ✅ All scripts have proper error handling
   - ✅ All scripts update tool state
   - ✅ All scripts have usage examples in comments

3. **State Management**
   - ✅ State file tracks tool execution history
   - ✅ State updates are atomic (file locking)
   - ✅ State includes health status for all tools
   - ✅ State cleanup removes entries older than 7 days

4. **Documentation**
   - ✅ Tool selection guide with decision tree
   - ✅ Script development guide for creating new tools
   - ✅ State management documentation
   - ✅ Updated CONTEXT_MAP.md with tool architecture
   - ✅ Updated CLAUDE.md with tool selection rules

5. **Integration**
   - ✅ Scripts execute successfully in local environment
   - ✅ Scripts execute successfully via SSH
   - ✅ MCP Gateway continues to function
   - ✅ Health monitoring operational for all tools
   - ✅ No breaking changes to existing agent workflows

## Validation Commands

Execute these commands to validate the implementation:

```bash
# 1. Validate tool catalog schema
jq empty tools/inventory/tool-catalog.json
echo "✅ Tool catalog is valid JSON"

# 2. Count tools in catalog
jq '.tools | length' tools/inventory/tool-catalog.json
echo "Expected: 19+ tools (11 MCP + 8 scripts)"

# 3. Test Coolify script
bash tools/scripts/coolify.sh list_applications
bash tools/scripts/coolify.sh get_application_status 3

# 4. Test Docker script
bash tools/scripts/docker.sh ps_containers
bash tools/scripts/docker.sh stats_containers

# 5. Test monitoring script
bash tools/scripts/monitoring.sh health_check_all
bash tools/scripts/monitoring.sh resource_usage

# 6. Verify state file updates
ls -la tools/inventory/tool-state.json
jq '.tools.coolify.last_execution' tools/inventory/tool-state.json

# 7. Test remote execution
bash tools/scripts/docker.sh --remote ps_containers

# 8. Verify MCP Gateway still works
curl http://localhost:8100/health
curl http://localhost:8100/mcp/catalog | jq

# 9. Run integration test suite
bash tools/inventory/tests/integration-test.sh

# 10. Validate documentation completeness
ls tools/inventory/docs/tool-selection-guide.md
ls tools/inventory/docs/script-development-guide.md
ls tools/inventory/docs/state-management.md
```

## Notes

### Dependencies
All scripts require these utilities (install if missing):
```bash
# Check and install dependencies
command -v jq >/dev/null || echo "Install: sudo apt install jq"
command -v curl >/dev/null || echo "Install: sudo apt install curl"
command -v docker >/dev/null || echo "Install: docker.io"
command -v ssh >/dev/null || echo "Install: openssh-client"
```

### Environment Variables Required
```bash
# Coolify API
COOLIFY_API_URL=http://coolify.ozean-licht.dev:8000/api/v1
COOLIFY_API_TOKEN=your_token_here

# SSH (for remote operations)
SSH_KEY_PATH=$HOME/.ssh/ozean-automation
SSH_HOST=138.201.139.25
SSH_USER=root

# Database connections (for database.sh)
POSTGRES_KA_URL=postgresql://...
POSTGRES_OL_URL=postgresql://...
```

### Security Considerations
- All scripts must validate input parameters
- API tokens must be stored in environment variables only
- SSH key should be dedicated automation key with limited permissions
- State file should have restricted permissions (600)
- Remote execution should log all commands for audit trail
- Never log sensitive data (tokens, passwords) in state or logs

### Performance Expectations
- **Script execution**: < 2s for local, < 5s for remote
- **MCP execution**: 2-10s depending on operation
- **Expected speedup**: 3-5x faster for simple operations using scripts
- **State updates**: < 100ms (atomic file operations)

### Migration Path
This is **additive, not replacive**:
- Existing MCP services remain operational
- Scripts provide alternative access path
- Agents can choose optimal tool based on context
- No breaking changes to existing workflows
- Gradual adoption of script-based tools

### Future Enhancements
1. Auto-generate tool catalog from script annotations
2. Tool usage analytics and recommendations
3. Automatic script vs MCP routing based on performance
4. Tool dependency graph visualization
5. Distributed state management (Redis/PostgreSQL)
6. Tool versioning and compatibility checks
7. Generated TypeScript/Python clients for scripts
8. Web UI for tool catalog exploration

### References
- MCP Catalog: `tools/mcp-gateway/config/mcp-catalog.json`
- Existing monitoring script: `tools/automation/autonomous-monitor.sh`
- Coolify API docs: `http://coolify.ozean-licht.dev:8000/api/documentation`
- Docker CLI docs: `https://docs.docker.com/engine/reference/commandline/cli/`
