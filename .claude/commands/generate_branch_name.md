---
description: Generate conventional branch name from issue
argument-hint: [issue-number]
allowed-tools: Bash(gh), Read
---

# Generate Branch Name

Create a conventional branch name based on GitHub issue details.

## Variables

ISSUE_NUMBER: $1

## Instructions

- IMPORTANT: If no ISSUE_NUMBER provided, ask user for the issue number
- Fetch issue details using GitHub CLI
- Extract issue type and summary
- Generate branch name following convention: `<type>/<issue-number>-<kebab-case-summary>`

## Workflow

1. **Fetch Issue** - Get issue title and labels via `gh issue view`
2. **Determine Type** - Extract or infer issue type
3. **Extract Summary** - Get concise description from title
4. **Format Name** - Create kebab-case branch name
5. **Validate** - Ensure name follows git branch conventions

## Branch Name Convention

```
<type>/<issue-number>-<kebab-case-summary>

Examples:
- feat/123-add-user-authentication
- fix/456-resolve-login-error
- chore/789-update-dependencies
- refactor/101-improve-api-structure
```

## Report

- Display generated branch name
- Provide git command to create branch:
  ```bash
  git checkout -b <branch-name>
  ```
