# Claude Agent SDK: Subagents

## Overview

Subagents are specialized AIs orchestrated by the main agent. They enable context isolation and parallel execution of specialized tasks within the SDK.

## Key Benefits

### Context Management

Subagents maintain separate conversation contexts, preventing specialized task details from cluttering the main agent's interaction space. This reduces context bloat and token usage.

```typescript
// Without subagents: main agent context polluted with details
// "Review code, analyze performance, check security, run tests..."
// All context mixed together

// With subagents: clean separation
// main: "Coordinate review process"
// code-reviewer: "Review code quality"
// security-checker: "Check security issues"
// performance-analyzer: "Analyze performance"
```

### Parallelization

Multiple subagents can execute simultaneously, dramatically accelerating complex workflows that would otherwise run sequentially.

```typescript
// Without subagents: sequential
// 1. Review code (5 min)
// 2. Check tests (3 min)
// 3. Security scan (4 min)
// Total: 12 minutes

// With subagents: parallel
// 1. Review code (5 min)
// 2. Check tests (3 min) - concurrent
// 3. Security scan (4 min) - concurrent
// Total: 5 minutes
```

### Specialized Instructions

Each subagent can have customized system prompts with domain-specific expertise and constraints tailored to its role.

### Tool Restrictions

Subagents can be limited to specific tools, reducing unintended action risks.

## Two Definition Approaches

### 1. Programmatic Definition (Recommended for SDK)

Define agents directly in code using the `agents` parameter. This is the recommended approach for SDK-based applications.

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = query({
  prompt: "Review the authentication module for security issues",
  options: {
    agents: {
      'code-reviewer': {
        description: 'Expert code review specialist',
        prompt: `You are a code review specialist with 10 years of experience.
Your job is to review code for:
- Code quality and maintainability
- Best practices
- Potential bugs
- Performance issues

Focus on providing constructive feedback.`,
        tools: ['Read', 'Grep', 'Glob'],
        model: 'sonnet'
      },
      'security-checker': {
        description: 'Security vulnerability analyst',
        prompt: `You are a security expert specializing in vulnerability analysis.
Review code for:
- Authentication weaknesses
- Authorization issues
- Input validation problems
- Data exposure risks

Be thorough and document findings clearly.`,
        tools: ['Read', 'Grep', 'Glob', 'Bash'],
        model: 'sonnet'
      }
    }
  }
});
```

### 2. Filesystem-Based Definition (Alternative)

Place markdown files with YAML frontmatter in `.claude/agents/`:

**File: `.claude/agents/code-reviewer.md`**

```markdown
---
name: code-reviewer
description: Expert code review specialist
tools: Read, Grep, Glob, Bash
---

You are a code review specialist with 10 years of experience.
Your job is to review code for:
- Code quality and maintainability
- Best practices
- Potential bugs
- Performance issues

Focus on providing constructive feedback.
```

**File: `.claude/agents/security-checker.md`**

```markdown
---
name: security-checker
description: Security vulnerability analyst
tools: Read, Grep, Glob, Bash
---

You are a security expert specializing in vulnerability analysis.
Review code for:
- Authentication weaknesses
- Authorization issues
- Input validation problems
- Data exposure risks

Be thorough and document findings clearly.
```

**Usage:**

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = query({
  prompt: "Review the authentication module for security issues",
  options: {
    // Agents automatically loaded from .claude/agents/
    workingDirectory: process.cwd()
  }
});
```

## AgentDefinition Configuration

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `description` | string | Yes | When to invoke this agent (used for auto-selection) |
| `prompt` | string | Yes | System instructions defining agent behavior |
| `tools` | string[] | No | Allowed tool names; inherits all if omitted |
| `model` | string | No | Model override ('sonnet', 'opus', 'haiku'); defaults to query model |

### Configuration Examples

#### Minimal Configuration

```typescript
agents: {
  'analyzer': {
    description: 'Data analysis specialist',
    prompt: 'You are an expert data analyst...'
    // Uses all tools and default model
  }
}
```

#### Full Configuration

```typescript
agents: {
  'reviewer': {
    description: 'Thorough code reviewer',
    prompt: 'You are an expert code reviewer...',
    tools: ['Read', 'Grep', 'Glob', 'Bash'], // Restrict to these tools
    model: 'sonnet' // Use Sonnet for this agent
  }
}
```

#### Read-Only Agent

```typescript
agents: {
  'auditor': {
    description: 'Read-only auditor',
    prompt: 'You are an auditor. Only read, never modify.',
    tools: ['Read', 'Grep', 'Glob', 'Bash'], // No Edit/Write/Delete
    model: 'haiku' // Smaller/faster model for simple reading
  }
}
```

## Integration Patterns

### Automatic Invocation

The SDK automatically selects appropriate subagents based on task context and agent descriptions:

```typescript
const result = query({
  prompt: `
    Review this code for:
    1. Quality and maintainability issues
    2. Security vulnerabilities
    3. Performance problems

    Submit findings from each review.
  `,
  options: {
    agents: {
      'code-quality-reviewer': {...},
      'security-checker': {...},
      'performance-analyst': {...}
    }
  }
});

// SDK automatically determines:
// - code-quality-reviewer for quality issues
// - security-checker for vulnerability analysis
// - performance-analyst for performance review
```

### Explicit Invocation

Users can request specific subagents directly:

```typescript
const result = query({
  prompt: `
    Ask the security-checker agent to review the authentication.ts file
    for potential vulnerabilities.
  `,
  options: {
    agents: {
      'security-checker': {
        description: 'Security vulnerability analyst',
        prompt: 'You specialize in security...',
        tools: ['Read', 'Grep', 'Glob']
      }
    }
  }
});
```

### Dynamic Configuration

Create agent configurations based on application requirements:

```typescript
function createReviewAgents(taskType: string) {
  const baseAgents = {
    'code-reviewer': {
      description: 'Code quality specialist',
      prompt: 'Review code for quality...',
      tools: ['Read', 'Grep', 'Glob']
    }
  };

  if (taskType === 'security-focused') {
    baseAgents['security-expert'] = {
      description: 'Security analyst',
      prompt: 'Focus on security issues...',
      tools: ['Read', 'Grep', 'Glob', 'Bash']
    };
  }

  if (taskType === 'performance-focused') {
    baseAgents['performance-analyst'] = {
      description: 'Performance specialist',
      prompt: 'Analyze performance metrics...',
      tools: ['Read', 'Bash', 'Grep']
    };
  }

  return baseAgents;
}

const taskType = 'security-focused';
const result = query({
  prompt: "Comprehensive code review",
  options: {
    agents: createReviewAgents(taskType)
  }
});
```

## Common Tool Combinations

### Read-Only Agents

For review, analysis, or auditing tasks:

```typescript
tools: ['Read', 'Grep', 'Glob']
```

Agents can:
- List files and directories
- Read file contents
- Search for patterns
- Analyze without modifying

### Test Execution Agents

For testing and validation:

```typescript
tools: ['Bash', 'Read', 'Grep']
```

Agents can:
- Run test suites
- Execute commands
- Read test results
- Analyze outputs

### Code Modification Agents

For development and refactoring:

```typescript
tools: ['Read', 'Edit', 'Write', 'Grep', 'Glob']
```

Agents can:
- Modify existing files
- Create new files
- Refactor code
- Apply changes based on analysis

## Complete Examples

### Multi-Agent Code Review

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

async function* generateReviewPrompt() {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: `
        Please conduct a comprehensive review of the authentication system:

        1. Code Quality: Have the code-reviewer check for best practices and maintainability
        2. Security: Have the security-checker review for vulnerabilities
        3. Performance: Have the performance-analyst check efficiency
        4. Testing: Have the test-reviewer verify test coverage

        Provide a summary of findings from each specialist.
      `
    }
  };
}

const result = query({
  prompt: generateReviewPrompt(),
  options: {
    agents: {
      'code-reviewer': {
        description: 'Code quality and maintainability expert',
        prompt: `You are a senior code reviewer focused on quality and maintainability.
Evaluate code for:
- Design patterns and architecture
- Code clarity and documentation
- Modularity and reusability
- Adherence to best practices`,
        tools: ['Read', 'Grep', 'Glob']
      },
      'security-checker': {
        description: 'Security vulnerability specialist',
        prompt: `You are a security expert analyzing code for vulnerabilities.
Check for:
- Authentication and authorization issues
- Input validation problems
- Sensitive data exposure
- Injection vulnerabilities`,
        tools: ['Read', 'Grep', 'Glob', 'Bash']
      },
      'performance-analyst': {
        description: 'Performance optimization specialist',
        prompt: `You are a performance optimization expert.
Identify:
- Performance bottlenecks
- Inefficient algorithms
- Resource waste
- Optimization opportunities`,
        tools: ['Read', 'Bash', 'Grep', 'Glob']
      },
      'test-reviewer': {
        description: 'Testing and quality assurance specialist',
        prompt: `You are a QA expert focused on test coverage.
Evaluate:
- Test coverage completeness
- Test quality and assertions
- Edge case handling
- Test maintainability`,
        tools: ['Read', 'Bash', 'Grep']
      }
    },
    maxTurns: 15
  }
});

for await (const message of result) {
  if (message.type === 'result') {
    console.log("Review Summary:", message.result);
  }
}
```

### Parallel Development Task

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

async function developFeature(featureDescription: string) {
  async function* generateMessages() {
    yield {
      type: "user" as const,
      message: {
        role: "user" as const,
        content: `
          Implement the following feature:
          ${featureDescription}

          Work in parallel:
          - Backend Developer: Implement API endpoints
          - Frontend Developer: Implement UI components
          - Database Designer: Set up schema

          Coordinate your work and ensure integration points are compatible.
        `
      }
    };
  }

  const result = query({
    prompt: generateMessages(),
    options: {
      agents: {
        'backend-dev': {
          description: 'Backend API developer',
          prompt: 'You are an expert backend developer. Implement API endpoints.',
          tools: ['Read', 'Edit', 'Write', 'Bash', 'Grep'],
          model: 'sonnet'
        },
        'frontend-dev': {
          description: 'Frontend UI developer',
          prompt: 'You are an expert frontend developer. Implement React components.',
          tools: ['Read', 'Edit', 'Write', 'Bash', 'Grep'],
          model: 'sonnet'
        },
        'db-designer': {
          description: 'Database schema designer',
          prompt: 'You are a database expert. Design efficient schemas.',
          tools: ['Read', 'Edit', 'Write', 'Bash'],
          model: 'sonnet'
        }
      },
      maxTurns: 20
    }
  });

  const results = [];
  for await (const message of result) {
    results.push(message);
  }

  return results;
}

// Usage
const featureDesc = `
  Add user profile management:
  - View/edit profile info
  - Change password
  - Manage preferences
  - Profile picture upload
`;

const results = await developFeature(featureDesc);
console.log("Development complete:", results);
```

## Best Practices

### 1. Clear Descriptions

Descriptions are crucial for auto-invocation:

```typescript
// Good - specific and actionable
description: 'Security vulnerability analyst for authentication systems'

// Poor - too vague
description: 'Security expert'
```

### 2. Focused Tool Restriction

Limit tools to what each agent needs:

```typescript
// Good - minimal required tools
agents: {
  'auditor': {
    tools: ['Read', 'Grep'] // Only needs to review
  }
}

// Risky - unnecessary permissions
agents: {
  'auditor': {
    tools: ['Read', 'Edit', 'Write', 'Bash', 'Bash'] // Can modify everything
  }
}
```

### 3. Detailed System Prompts

Clear instructions improve agent performance:

```typescript
// Good - detailed instructions
prompt: `You are a security expert. Your job is to:
1. Identify authentication vulnerabilities
2. Check for authorization issues
3. Look for data exposure risks
4. Suggest mitigations

Use a structured format for findings.`,

// Poor - vague instructions
prompt: 'Check security'
```

### 4. Model Selection

Choose appropriate models for each agent:

```typescript
agents: {
  'quick-reviewer': {
    model: 'haiku' // Fast, good for simple reviews
  },
  'detailed-analyzer': {
    model: 'sonnet' // Balanced for complex analysis
  },
  'expert-reviewer': {
    model: 'opus' // Best for expert-level analysis
  }
}
```

## Related Resources

- TypeScript SDK Reference
- Python SDK Reference
- Session Management Guide
- Permissions and Tool Control
- Custom Tools and MCP Integration

---

**Source**: https://docs.claude.com/en/docs/agent-sdk/subagents
