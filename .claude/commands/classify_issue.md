---
description: Classify GitHub issue type and complexity
argument-hint: [issue-number]
allowed-tools: Bash(gh), Read
---

# Classify Issue

Analyze a GitHub issue and classify its type and complexity.

## Variables

ISSUE_NUMBER: $1

## Instructions

- IMPORTANT: If no ISSUE_NUMBER provided, ask user for the issue number
- Fetch issue details using GitHub CLI
- Analyze issue content, labels, and description
- Determine issue type (feature/fix/chore/refactor/enhancement)
- Assess complexity (simple/medium/complex)

## Workflow

1. **Fetch Issue** - Use `gh issue view ISSUE_NUMBER` to get details
2. **Analyze Content** - Review title, body, labels
3. **Classify Type** - Determine the nature of work required
4. **Assess Complexity** - Evaluate scope and difficulty
5. **Report Classification** - Output structured classification

## Classification Criteria

**Type:**
- **feature**: New functionality
- **fix**: Bug fixes
- **chore**: Maintenance tasks
- **refactor**: Code improvements
- **enhancement**: Improvements to existing features

**Complexity:**
- **simple**: Single file, < 50 lines, clear implementation
- **medium**: Multiple files, 50-200 lines, some design decisions
- **complex**: Significant changes, > 200 lines, architectural decisions

## Report

```json
{
  "issue_number": ISSUE_NUMBER,
  "type": "feature|fix|chore|refactor|enhancement",
  "complexity": "simple|medium|complex",
  "reasoning": "Brief explanation of classification"
}
```
