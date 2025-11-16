# Claude Agent SDK: Permissions and Tool Control

## Overview

The Claude Agent SDK provides four complementary mechanisms for controlling tool usage:

1. **Permission Modes** - Global behavior settings affecting all tools
2. **`canUseTool` Callback** - Runtime handler for permission decisions
3. **Hooks** - Fine-grained control over tool execution
4. **Permission Rules (settings.json)** - Declarative allow/deny policies

## Permission Modes

Four modes govern how Claude uses tools:

| Mode | Purpose |
|------|---------|
| `default` | Standard permission checks apply |
| `plan` | Planning mode (read-only tools only) |
| `acceptEdits` | Auto-approves file edits and filesystem operations |
| `bypassPermissions` | Bypasses all permission checks |

### Setting Permission Mode

**Initial Configuration:**

```typescript
const result = await query({
  prompt: "Help me refactor this code",
  options: {
    permissionMode: 'default'
  }
});
```

**Dynamic Changes (Streaming Only):**

```typescript
const q = query({
  prompt: streamInput(),
  options: { permissionMode: 'default' }
});

await q.setPermissionMode('acceptEdits');
```

## Processing Order

The permission system evaluates in this sequence:

```
PreToolUse Hook
  → Deny Rules
  → Allow Rules
  → Ask Rules
  → Permission Mode Check
  → canUseTool Callback
  → PostToolUse Hook
```

Understanding this order helps debug permission issues and understand which mechanism takes precedence.

## `canUseTool` Callback

This callback handles permission decisions for uncovered cases. It's invoked when a tool request doesn't match any predefined rules or permissions.

### Basic Example

```typescript
const result = await query({
  prompt: "Analyze this codebase",
  options: {
    canUseTool: async (toolName, input) => {
      // Display tool request and get approval
      const approved = await getUserApproval();

      return approved
        ? { behavior: "allow", updatedInput: input }
        : { behavior: "deny", message: "User denied permission" };
    }
  }
});
```

### Advanced Implementation

```typescript
const result = await query({
  prompt: "Help me with my project",
  options: {
    canUseTool: async (toolName, input) => {
      // Tool-specific handling
      if (toolName === "Bash") {
        // More restrictive for shell commands
        const confirmed = await userConfirm(`Execute: ${input.command}?`);
        return confirmed
          ? { behavior: "allow", updatedInput: input }
          : { behavior: "deny", message: "Command execution denied" };
      }

      if (toolName === "Read") {
        // Allow all reads
        return { behavior: "allow", updatedInput: input };
      }

      // Default deny for unknown tools
      return { behavior: "deny", message: `${toolName} is not allowed` };
    }
  }
});
```

### Return Value Options

```typescript
// Allow the tool to execute
{ behavior: "allow", updatedInput: input }

// Deny the tool execution
{ behavior: "deny", message: "Reason for denial" }

// Allow but with modified input
{ behavior: "allow", updatedInput: { ...input, modified: true } }
```

## Best Practices

### 1. Use `default` Mode for Controlled Execution

Start with the `default` permission mode which enforces standard permission checks:

```typescript
const result = await query({
  prompt: "Review this code",
  options: {
    permissionMode: 'default',
    allowedTools: ['Read', 'Grep']
  }
});
```

### 2. Switch to `acceptEdits` for Rapid Iteration

When you're confident in your agent's behavior and want faster execution:

```typescript
const result = await query({
  prompt: "Refactor this code and apply changes",
  options: {
    permissionMode: 'acceptEdits',
    allowedTools: ['Read', 'Edit', 'Write']
  }
});
```

### 3. Avoid `bypassPermissions` in Production

Only use for development/testing:

```typescript
// Development only - DANGEROUS in production
const result = await query({
  prompt: "Do whatever you need",
  options: {
    permissionMode: 'bypassPermissions'
  }
});
```

### 4. Combine Modes with Hooks

Use hooks for granular logging and monitoring:

```typescript
const result = await query({
  prompt: "Build my application",
  options: {
    permissionMode: 'default',
    hooks: {
      PreToolUse: async (tool) => {
        console.log(`Tool execution requested: ${tool.name}`);
      },
      PostToolUse: async (result) => {
        console.log(`Tool execution completed: ${result.name}`);
      }
    }
  }
});
```

### 5. Progress Modes as Confidence Increases

Gradually increase permissions as you verify agent behavior:

```typescript
let permissionMode = 'plan'; // Start read-only

// Phase 1: Planning only
let response1 = await query({
  prompt: task,
  options: { permissionMode: 'plan' }
});

// Phase 2: Review results, then allow execution
if (reviewResults(response1)) {
  permissionMode = 'default';
}

// Phase 3: Execute with confirmations
let response2 = await query({
  prompt: "Now execute the plan",
  options: { permissionMode: 'default' }
});

// Phase 4: Auto-approve edits for speed
if (response2.success) {
  permissionMode = 'acceptEdits';
}
```

## Declarative Rules (settings.json)

Define rules in `.claude/settings.json`:

```json
{
  "permissions": {
    "deny": ["Bash"],
    "allow": ["Read", "Grep", "Glob"],
    "ask": ["Edit", "Write"]
  }
}
```

## Tool-Specific Examples

### Restricting Shell Commands

```typescript
canUseTool: async (toolName, input) => {
  if (toolName === "Bash") {
    // Dangerous patterns
    if (input.command.includes("rm -rf") || input.command.includes("sudo")) {
      return { behavior: "deny", message: "Dangerous command detected" };
    }
  }
  return { behavior: "allow", updatedInput: input };
}
```

### Restricting File Operations

```typescript
canUseTool: async (toolName, input) => {
  if (toolName === "Write" || toolName === "Edit") {
    // Only allow modifying specific directories
    const allowedPaths = ['/home/user/projects', '/tmp'];
    const isAllowed = allowedPaths.some(p => input.path.startsWith(p));

    if (!isAllowed) {
      return { behavior: "deny", message: `Cannot modify ${input.path}` };
    }
  }
  return { behavior: "allow", updatedInput: input };
}
```

### Restricting External Access

```typescript
canUseTool: async (toolName, input) => {
  if (toolName === "WebFetch" || toolName === "WebSearch") {
    // Only allow specific domains
    const allowed = ['api.github.com', 'docs.anthropic.com'];
    const url = new URL(input.url);

    if (!allowed.includes(url.hostname)) {
      return { behavior: "deny", message: `Access to ${url.hostname} denied` };
    }
  }
  return { behavior: "allow", updatedInput: input };
}
```

## Summary

Effective permission management balances security and functionality:

- Start restrictive with `default` mode
- Use `canUseTool` callbacks for fine-grained control
- Monitor with hooks for visibility
- Gradually increase permissions as trust builds
- Never use `bypassPermissions` in production
- Combine multiple mechanisms for defense in depth

---

**Source**: https://docs.claude.com/en/docs/agent-sdk/permissions
