---
description: Create comprehensive tests for implementation
argument-hint: [file-or-feature]
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Test

Create comprehensive test coverage for implemented features or files.

## Variables

TARGET: $ARGUMENTS

## Instructions

- Identify code that needs testing
- Analyze functionality and edge cases
- Write unit tests for individual functions
- Create integration tests for workflows
- Test error scenarios and edge cases
- Follow existing test patterns

## Workflow

1. **Analyze Code** - Read implementation to understand functionality
2. **Identify Test Cases** - List happy path, edge cases, errors
3. **Find Test Patterns** - Use Grep to find similar tests
4. **Write Tests** - Create comprehensive test suite
5. **Run Tests** - Execute tests and verify they pass
6. **Report Coverage** - Summarize test coverage

## Testing Strategy

### Unit Tests
- Test individual functions/methods
- Mock external dependencies
- Test return values and side effects
- Cover edge cases and boundaries

### Integration Tests
- Test component interactions
- Test API endpoints
- Test database operations
- Test external service calls

### Error Testing
- Test invalid inputs
- Test error handling
- Test timeout scenarios
- Test edge cases

### Test Organization
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/           # End-to-end tests
```

## Test Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 90%
- **Lines**: > 80%

## Report

- List test files created/modified
- Summarize test cases added
- Report test execution results
- Note test coverage metrics
- Highlight any failing tests
