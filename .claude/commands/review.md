---
description: Perform comprehensive code review
argument-hint: [files-or-branch]
allowed-tools: Read, Bash(git)
---

# Review

Perform a comprehensive code review analyzing quality, security, and best practices.

## Variables

TARGET: $ARGUMENTS

## Instructions

- Analyze code changes using git diff
- Check for code quality issues
- Identify security vulnerabilities
- Verify best practices followed
- Review test coverage
- Provide actionable feedback

## Workflow

1. **Analyze Changes** - Use `git diff` to see modifications
2. **Code Quality Review** - Check style, patterns, complexity
3. **Security Analysis** - Identify security concerns
4. **Best Practices** - Verify conventions followed
5. **Test Coverage** - Ensure adequate tests
6. **Generate Report** - Provide structured feedback

## Review Checklist

### Code Quality
- [ ] Follows existing code style
- [ ] Proper naming conventions
- [ ] No unnecessary complexity
- [ ] DRY (Don't Repeat Yourself)
- [ ] Clear and readable
- [ ] Proper error handling

### Security
- [ ] Input validation present
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] No command injection risks
- [ ] Secrets not hardcoded
- [ ] Authentication/authorization proper

### Best Practices
- [ ] TypeScript types properly used
- [ ] Async/await for promises
- [ ] Proper logging added
- [ ] Documentation included
- [ ] Edge cases handled
- [ ] No console.log in production

### Testing
- [ ] Unit tests included
- [ ] Integration tests added
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Tests actually pass

### Documentation
- [ ] Functions documented
- [ ] Complex logic explained
- [ ] README updated if needed
- [ ] API docs updated

## Report Format

```markdown
## Code Review Summary

### ✅ Strengths
- List positive aspects

### ⚠️ Issues Found
**Priority: High/Medium/Low**
- Issue description
- Location: file:line
- Recommendation: How to fix

### 📋 Recommendations
- Suggested improvements
- Performance optimizations
- Refactoring opportunities

### 🔒 Security Notes
- Any security concerns
- Mitigation recommendations
```
