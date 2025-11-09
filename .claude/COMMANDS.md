# Slash Commands - Ozean Licht Ecosystem

> **Agent SDK Compatible Commands for Root Workspace**
>
> All commands follow Agent SDK best practices with proper front matter, tool restrictions, and structured workflows.

---

## Quick Reference

| Command | Purpose | Usage |
|---------|---------|-------|
| `/plan` | Create implementation plan | `/plan [user-prompt]` |
| `/build` | Implement a plan | `/build [path-to-plan]` |
| `/implement` | Direct implementation | `/implement [description]` |
| `/test` | Create tests | `/test [file-or-feature]` |
| `/review` | Code review | `/review [files-or-branch]` |
| `/commit` | Create commit | `/commit [message-hint]` |
| `/pull_request` | Create PR | `/pull_request [base-branch]` |
| `/classify_issue` | Classify issue | `/classify_issue [issue-number]` |
| `/generate_branch_name` | Generate branch name | `/generate_branch_name [issue-number]` |
| `/question` | Ask questions | `/question [your-question]` |

---

## Command Categories

### 📋 Planning & Analysis

#### `/plan [user-prompt]`
**Purpose**: Create detailed implementation plans in `specs/` directory

**Agent SDK Features**:
- Front matter: `description`, `argument-hint`
- Tool restrictions: `Read, Grep, Glob, Bash(git)`
- Structured workflow with 6 steps
- Comprehensive plan format template

**When to use**:
- Before implementing new features
- For complex refactoring tasks
- When architectural decisions needed
- To document implementation strategy

**Example**:
```bash
/plan Add user authentication with OAuth 2.0
```

---

#### `/question [your-question]`
**Purpose**: Answer questions about codebase without making changes

**Agent SDK Features**:
- Tool restrictions: `Bash(git ls-files:*)`, `Read` (read-only!)
- No write/edit tools allowed
- Focused on analysis and explanation

**When to use**:
- Understanding project structure
- Exploring codebase patterns
- Getting information without modifications
- Conceptual explanations

**Example**:
```bash
/question How does the authentication system work?
```

---

### 🔨 Implementation

#### `/implement [description]`
**Purpose**: Implement solutions following best practices

**Agent SDK Features**:
- Full tool access: `Read, Write, Edit, Grep, Glob, Bash`
- Security guidelines built-in
- Code quality checklist
- Documentation requirements

**Key Guidelines**:
- Follow existing code patterns
- Handle errors gracefully
- Add comprehensive documentation
- Consider security (OWASP)
- Write production-quality code

**Example**:
```bash
/implement Add email validation to user registration
```

---

#### `/build [path-to-plan]`
**Purpose**: Execute implementation from a plan file

**Agent SDK Features**:
- Tool access: `Read, Write, Edit, Grep, Glob, Bash`
- Sequential step execution
- Validation command execution
- Issue detection and fixing

**When to use**:
- After creating a plan with `/plan`
- For structured implementations
- When following detailed specifications

**Example**:
```bash
/build specs/add-user-authentication.md
```

---

### 🧪 Testing & Quality

#### `/test [file-or-feature]`
**Purpose**: Create comprehensive test coverage

**Agent SDK Features**:
- Tool access: `Read, Write, Edit, Grep, Glob, Bash`
- Test pattern discovery
- Coverage goals defined
- Multiple test types supported

**Test Types**:
- **Unit tests**: Individual function testing
- **Integration tests**: Component interactions
- **E2E tests**: Full workflow testing
- **Error testing**: Edge cases and errors

**Coverage Goals**:
- Statements: > 80%
- Branches: > 75%
- Functions: > 90%
- Lines: > 80%

**Example**:
```bash
/test src/modules/auth/user-authentication.ts
```

---

#### `/review [files-or-branch]`
**Purpose**: Comprehensive code review

**Agent SDK Features**:
- Tool restrictions: `Read, Bash(git)` (read-only)
- Structured checklist approach
- Risk-tiered feedback
- Actionable recommendations

**Review Areas**:
- Code quality and style
- Security vulnerabilities
- Best practices adherence
- Test coverage
- Documentation completeness

**Example**:
```bash
/review feat/add-authentication
```

---

### 🚀 Git Workflow

#### `/classify_issue [issue-number]`
**Purpose**: Classify GitHub issue type and complexity

**Agent SDK Features**:
- Tool restrictions: `Bash(gh), Read`
- JSON output format
- Classification criteria defined

**Output**:
```json
{
  "issue_number": 123,
  "type": "feature|fix|chore|refactor|enhancement",
  "complexity": "simple|medium|complex",
  "reasoning": "Brief explanation"
}
```

**Example**:
```bash
/classify_issue 123
```

---

#### `/generate_branch_name [issue-number]`
**Purpose**: Create conventional branch names

**Agent SDK Features**:
- Tool restrictions: `Bash(gh), Read`
- Convention enforcement
- Git command output

**Branch Format**: `<type>/<issue-number>-<kebab-case-summary>`

**Example Output**:
```bash
feat/123-add-user-authentication

# Command to create:
git checkout -b feat/123-add-user-authentication
```

---

#### `/commit [message-hint]`
**Purpose**: Create conventional commits

**Agent SDK Features**:
- Tool restrictions: `Bash(git), Read`
- Conventional commit format
- Change analysis
- Issue reference support

**Commit Format**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore, ci

**Example**:
```bash
/commit Add user authentication
# Generates: feat(auth): add user authentication with OAuth 2.0
```

---

#### `/pull_request [base-branch]`
**Purpose**: Create comprehensive pull requests

**Agent SDK Features**:
- Tool restrictions: `Bash(git, gh), Read`
- Structured PR template
- Testing instructions
- Checklist included

**PR Template Sections**:
- Summary
- Changes
- Related issues
- Type of change
- Testing plan
- Checklist
- Screenshots (if applicable)

**Example**:
```bash
/pull_request main
```

---

## Agent SDK Best Practices

All commands follow these Agent SDK patterns:

### 1. Front Matter
```markdown
---
description: Brief command description
argument-hint: [arg-name]
allowed-tools: Tool1, Tool2, Tool3
---
```

### 2. Variable Substitution
```markdown
USER_INPUT: $1
ALL_ARGS: $ARGUMENTS
```

### 3. Clear Structure
```markdown
## Variables
## Instructions
## Workflow
## Report
```

### 4. Tool Restrictions
- **Read-only**: `Read, Bash(git), Grep, Glob`
- **Implementation**: Add `Write, Edit`
- **Git operations**: Specify `Bash(git, gh)`

---

## SDLC Workflow Example

Complete software development lifecycle using commands:

```bash
# 1. Analyze issue
/classify_issue 123

# 2. Create branch
/generate_branch_name 123
git checkout -b feat/123-add-feature

# 3. Plan implementation
/plan Implement feature X with Y requirements

# 4. Implement
/build specs/implement-feature-x.md

# 5. Test
/test src/new-feature.ts

# 6. Review
/review feat/123-add-feature

# 7. Commit
/commit Implement feature X

# 8. Create PR
/pull_request main
```

---

## Command Development Guidelines

### Creating New Commands

Follow this template:

```markdown
---
description: Brief description (50 chars max)
argument-hint: [arg-name]
allowed-tools: Tool1, Tool2
---

# Command Name

Purpose statement

## Variables

VAR_NAME: $1

## Instructions

- IMPORTANT: Key requirement
- Bullet point guidelines

## Workflow

1. **Step 1** - Description
2. **Step 2** - Description

## Report

- What to output
- Format specifications
```

### Tool Access Levels

**Level 1: Read-Only**
```yaml
allowed-tools: Read, Bash(git ls-files), Grep, Glob
```

**Level 2: Implementation**
```yaml
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
```

**Level 3: Git Operations**
```yaml
allowed-tools: Read, Write, Edit, Bash(git, gh)
```

---

## Troubleshooting

### Command Not Found
```bash
# Check command exists
ls .claude/commands/

# Verify Claude Code can scan commands
# Check workspace settings:
"claude.commands.scanWorkspace": true
```

### Command Doesn't Execute
- Verify front matter syntax
- Check tool restrictions
- Ensure proper markdown formatting
- Validate YAML in front matter

### Tool Access Denied
- Review `allowed-tools` in front matter
- Check if tool is in allowed list
- Verify tool name spelling

---

## Migration Notes

### From Old Command System

**Changes**:
- ✅ Removed `o-commands` and `a-commands` separation
- ✅ All commands now in `.claude/commands/`
- ✅ Agent SDK front matter required
- ✅ Tool restrictions explicit
- ✅ Structured workflow format

**Breaking Changes**:
- Symlink `.claude/commands -> a-commands` removed
- Commands now directly in `.claude/commands/`
- Old parallel execution commands deprecated

---

**Last Updated**: 2025-11-09
**Status**: ✅ Agent SDK Compatible
**Commands**: 10 total (3 core + 7 SDLC)
