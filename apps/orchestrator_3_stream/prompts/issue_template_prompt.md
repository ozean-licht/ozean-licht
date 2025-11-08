# Issue Template Generation Prompt

When creating a GitHub issue, structure it following these principles:

## Issue Scoping Guidelines

### 1. Single Responsibility
Each issue should address ONE specific problem or feature. If you find yourself using "and" multiple times in the objective, consider splitting into multiple issues.

### 2. Time Boxing
Target issues that can be completed in:
- **Small**: < 2 hours (preferred for ADW)
- **Medium**: 2-4 hours (acceptable)
- **Large**: 4-8 hours (should be split if possible)

### 3. Clear Boundaries
Always specify:
- **In Scope**: Exactly what will be done
- **Out of Scope**: What will NOT be done (prevents scope creep)

## Issue Structure Template

Generate issues using this format:

```markdown
## 🎯 Objective
[One clear sentence - what needs to be achieved]

## 📋 Scope

### In Scope
- [Specific deliverable 1]
- [Specific deliverable 2]
- [Specific deliverable 3]

### Out of Scope
- [What won't be included]
- [Save for future issue]

## ✅ Acceptance Criteria
1. [Testable requirement]
2. [Measurable outcome]
3. [Specific behavior]

## 🔧 Technical Approach
[Brief suggested implementation]

## 📦 Dependencies
- [Any blocking issues]

## ⚠️ Constraints
- Must maintain backward compatibility
- Should include tests
- [Other requirements]

## 🤖 ADW Instructions
estimated_effort: small
workflow_type: plan_build_iso
model_set: base
```

## Examples of Good vs Bad Issues

### ❌ BAD: Too Broad
"Improve the admin dashboard with better UI, performance optimizations, and add new features"

### ✅ GOOD: Well-Scoped
"Add dark mode toggle to admin dashboard header"
- In scope: Toggle button, theme switching, localStorage persistence
- Out of scope: Complex theme customization, color picker
- Acceptance criteria: Toggle switches theme, preference persists

### ❌ BAD: Vague
"Fix the bug in the system"

### ✅ GOOD: Specific
"Fix login timeout after 30 minutes of inactivity"
- In scope: Extend session timeout to 2 hours
- Out of scope: Remember-me functionality
- Acceptance criteria: Users stay logged in for 2 hours of inactivity

## Issue Decomposition Strategy

When faced with a large task, decompose it:

**Original**: "Add user management system"

**Decomposed**:
1. "Add user list view with pagination"
2. "Add create new user form with validation"
3. "Add user edit functionality"
4. "Add user delete with confirmation"
5. "Add user role assignment"

Each becomes a separate, manageable issue.

## ADW Workflow Selection

Choose workflow based on issue type:
- **Bug fixes** → `plan_build_test_iso` (needs testing)
- **New features** → `plan_build_iso` (standard)
- **UI changes** → `plan_build_review_iso` (needs review)
- **Refactoring** → `plan_build_test_iso` (needs tests)

## Model Set Selection

- **base**: Simple changes, clear requirements, straightforward implementation
- **heavy**: Complex logic, ambiguous requirements, architectural decisions

## Auto-Merge Criteria

Only set `auto_merge: true` when:
- Change is low risk
- Has comprehensive test coverage
- No user-facing API changes
- Documentation is included

## Issue Title Format

Use imperative mood with specific scope:
- ✅ "Add export button to user table"
- ✅ "Fix memory leak in WebSocket handler"
- ✅ "Update React to version 18"
- ❌ "User table improvements"
- ❌ "WebSocket issues"
- ❌ "Dependency updates"

## Remember

The goal is to create issues that:
1. Can be completed in one focused session
2. Have clear success criteria
3. Don't require extensive context switching
4. Can be tested independently
5. Provide value when merged

**When in doubt, make it smaller!**