---
description: Create conventional commit with proper message
argument-hint: [message-hint]
allowed-tools: Bash(git), Read
---

# Commit

Create a conventional commit with a properly formatted message following best practices.

## Variables

MESSAGE_HINT: $ARGUMENTS

## Instructions

- Review staged changes with `git diff --staged`
- Analyze the nature of changes
- Generate conventional commit message
- Include issue reference if applicable
- Add detailed body if needed
- Create commit with proper format

## Workflow

1. **Check Status** - Run `git status` to see staged changes
2. **Review Diff** - Use `git diff --staged` to analyze changes
3. **Classify Changes** - Determine commit type
4. **Generate Message** - Create conventional commit message
5. **Create Commit** - Execute git commit with message
6. **Verify** - Confirm commit created successfully

## Conventional Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Scope (optional)
- Component or module name
- Examples: auth, api, ui, db

### Subject
- Short description (max 50 chars)
- Imperative mood ("add" not "added")
- No period at end
- Lowercase start

### Body (optional)
- Detailed explanation
- Why the change was made
- Any breaking changes
- References to issues

### Footer (optional)
- Issue references: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

```bash
# Simple feature
feat: add user authentication

# With scope and issue
fix(api): resolve timeout error in user endpoint

Fixes issue where API requests would timeout after 30s.
Increased timeout to 60s and added retry logic.

Closes #456

# Breaking change
feat(auth)!: migrate to OAuth 2.0

BREAKING CHANGE: All authentication now uses OAuth 2.0.
Previous API token authentication is no longer supported.
```

## Report

- Display commit message used
- Show commit SHA
- Confirm files included in commit
