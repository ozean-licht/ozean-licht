# Primary Slash Commands Configuration

This file defines which slash commands should be shown as PRIMARY (main) commands in the UI.

## PRIMARY Commands (Show by Default)

These are the most commonly used commands that should be visible:

### Work Management
- `/create_issue` - Create GitHub issue with optional ADW trigger
- `/bug` - Report and fix bugs
- `/feature` - Implement new features

### Status & Information
- `/health_check` - System health status

### Development
- `/implement` - Direct implementation
- `/test` - Run tests

## SECONDARY Commands (Available but Hidden)

These remain available but don't clutter the main UI:

### ADW Specific
- `/classify_adw` - Classify ADW workflows
- `/classify_issue` - Classify issue types
- `/cleanup_worktrees` - Maintenance

### Specialized
- `/chore` - Maintenance tasks
- `/patch` - Quick patches
- `/review` - Code review
- `/document` - Documentation

### Advanced
- `/commit` - Git operations
- `/pull_request` - PR management
- `/install` - Dependencies
- `/install_worktree` - Worktree setup

### Utilities
- `/generate_branch_name` - Naming helper
- `/memory` - Memory operations
- `/track_agentic_kpis` - Metrics

### Low-level
- `/prime` - System prime
- `/start` - Start services
- `/tools` - Tool management
- `/in_loop_review` - Review loop
- `/resolve_failed_test` - Test fixing
- `/resolve_failed_e2e_test` - E2E fixing

## Display Strategy

1. **Main UI**: Show only PRIMARY commands
2. **Type-ahead**: Suggest SECONDARY as user types
3. **Help**: Show all with categories
4. **Context**: Show relevant commands based on current task

## Notes

- Commands can be promoted/demoted based on usage patterns
- User preferences can override defaults
- Context-aware display improves discoverability