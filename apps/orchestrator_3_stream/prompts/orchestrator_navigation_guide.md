# 🧭 Orchestrator Navigation Guide

## Quick Reference - Main Commands

### 🚀 Primary Actions (Use These First)
```typescript
// Create & Execute
create_github_issue(title, body, trigger_adw?)  // Create issue → Optional ADW
command_agent(name, command)                     // Send task to agent

// Status & Information
list_agents()                                    // See available agents
check_agent_status(name)                        // Check agent progress
report_cost()                                    // See total costs
```

### 🤖 When You Type in Chat

**For Issues/Tasks:**
- "Fix issue #123" → Auto-triggers ADW
- "Create issue for..." → Uses create_github_issue
- "Work on..." → Suggests appropriate workflow

**For Agent Management:**
- "Create agent..." → Guides agent creation
- "Check..." → Shows status
- "Stop..." → Interrupts agent

---

## 📚 Command Categories

### 1️⃣ **MAIN COMMANDS** (90% of usage)

#### Create & Track Work
- `create_github_issue` - Document and optionally implement
- `trigger_adw_workflow` - Start autonomous development
- `list_adw_worktrees` - See active work

#### Agent Operations
- `create_agent` - Spawn specialized agent
- `command_agent` - Send task to agent
- `list_agents` - See all agents
- `check_agent_status` - Monitor progress

#### System Info
- `report_cost` - Token usage and costs

### 2️⃣ **SECONDARY COMMANDS** (As needed)

#### Maintenance
- `cleanup_adw_worktree` - Clean up after work
- `delete_agent` - Remove agent
- `interrupt_agent` - Stop agent task

#### Debugging
- `read_system_logs` - Check logs
- `get_adw_logs` - ADW specific logs
- `check_adw_status` - Detailed ADW status

---

## 🎯 Common Workflows

### Creating and Fixing Issues
```
1. User: "We need export functionality"
2. Orchestrator: create_github_issue(
     title="Add CSV export",
     body="...",
     trigger_adw=true
   )
3. Result: Issue created → ADW starts → PR in ~30min
```

### Working with Agents
```
1. User: "Analyze the codebase"
2. Orchestrator: create_agent("analyzer", template="codebase_explorer")
3. Orchestrator: command_agent("analyzer", "Find all API endpoints")
4. Check progress: check_agent_status("analyzer")
```

### Quick Fixes
```
1. User: "Fix #123"
2. Auto-triggers ADW workflow
3. No commands needed!
```

---

## 💡 Pro Tips

### Natural Language First
- Just describe what you need
- Orchestrator will choose the right tool
- Only use commands directly for specific control

### Issue Mentions
- "#123" or "issue 123" → Auto-triggers ADW
- Add keywords for workflow type:
  - "fix" → plan_build_iso
  - "review" → plan_build_review_iso
  - "test" → plan_build_test_iso

### Agent Templates
When creating agents, use templates:
- `code_reviewer` - Code review specialist
- `test_writer` - Test creation
- `documenter` - Documentation
- `codebase_explorer` - Analysis

---

## 🔄 Navigation Flow

```
User Intent
    ↓
Orchestrator Understands
    ↓
Chooses Tool:
    ├── Direct Execution (simple tasks)
    ├── Create Issue + ADW (new work)
    ├── Create Agent (specialized work)
    └── Check Status (monitoring)
    ↓
Execution & Feedback
```

---

## 📊 Command Visibility Strategy

### Always Visible (Main)
- Core creation commands
- Primary agent operations
- Status checking

### Suggested While Typing
- Maintenance commands
- Debug utilities
- Advanced options

### Hidden Unless Needed
- Internal tools
- System administration
- Recovery operations

---

## 🆘 Quick Help

**"I want to..."**

- **Fix a bug** → Just mention the issue number
- **Add a feature** → Create issue with description
- **Check progress** → Use status commands
- **Clean up** → Use cleanup commands
- **Debug** → Check logs

**"What's happening?"**
- `list_agents()` - Active agents
- `list_adw_worktrees()` - Active workflows
- `report_cost()` - Resource usage

**"Something's wrong"**
- `read_system_logs()` - Recent errors
- `interrupt_agent(name)` - Stop runaway agent
- `cleanup_adw_worktree(id)` - Clean failed workflow

---

## 🎓 Learning Path

1. **Start Simple**
   - Mention issue numbers
   - Let auto-trigger work

2. **Then Explore**
   - Create issues proactively
   - Spawn specialized agents

3. **Advanced Usage**
   - Custom workflows
   - Complex orchestration
   - Multi-agent coordination

Remember: The orchestrator is designed to understand intent, not just commands!