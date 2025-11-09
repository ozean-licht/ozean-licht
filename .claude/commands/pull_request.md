---
description: Create pull request with comprehensive description
argument-hint: [base-branch]
allowed-tools: Bash(git, gh), Read
---

# Pull Request

Create a comprehensive pull request with detailed description and context.

## Variables

BASE_BRANCH: $1
DEFAULT_BASE: main

## Instructions

- Review all commits in current branch
- Analyze full diff from base branch
- Generate comprehensive PR description
- Include testing instructions
- Reference related issues
- Create PR using GitHub CLI

## Workflow

1. **Check Branch** - Verify current branch and changes
2. **Review Commits** - Analyze commit history
3. **Review Changes** - Use `git diff BASE_BRANCH...HEAD`
4. **Generate Description** - Create structured PR description
5. **Create PR** - Use `gh pr create` with description
6. **Report** - Display PR URL and summary

## Pull Request Template

```markdown
## Summary
Brief description of what this PR accomplishes (2-3 sentences)

## Changes
- Bullet point list of major changes
- What was added
- What was modified
- What was removed

## Related Issues
- Closes #123
- Relates to #456

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test updates

## Testing
### Test Plan
- How to test the changes
- Steps to reproduce/verify

### Test Coverage
- Unit tests added/updated
- Integration tests added/updated
- E2E tests added/updated

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated and passing
- [ ] No new warnings generated
- [ ] Breaking changes documented

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## Additional Context
<!-- Any other context, technical decisions, or notes -->

---
🤖 Generated with Claude Code
```

## PR Creation Command

```bash
gh pr create \
  --base BASE_BRANCH \
  --title "type(scope): descriptive title" \
  --body "$(cat <<'EOF'
[Generated PR description]
EOF
)"
```

## Report

- Display PR URL
- Show PR number
- List files changed
- Note any CI/CD checks triggered
