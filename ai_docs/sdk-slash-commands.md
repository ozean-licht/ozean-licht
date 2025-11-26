# Claude Agent SDK Slash Commands Documentation

## Overview
Slash commands are special instructions prefixed with `/` that control Claude Code sessions through the SDK. They enable actions like clearing conversation history, compacting messages, and accessing help features.

## Discovering Available Commands

The SDK provides slash command information in system initialization messages. Access this when a session starts:

**TypeScript Example:**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Hello Claude",
  options: { maxTurns: 1 }
})) {
  if (message.type === "system" && message.subtype === "init") {
    console.log("Available slash commands:", message.slash_commands);
    // Example: ["/compact", "/clear", "/help"]
  }
}
```

## Sending Commands

Include slash commands directly in prompt strings:

```typescript
for await (const message of query({
  prompt: "/compact",
  options: { maxTurns: 1 }
})) {
  if (message.type === "result") {
    console.log("Command executed:", message.result);
  }
}
```

## Common Built-in Commands

### `/compact`
Reduces conversation history size by summarizing older messages while preserving context. Returns metadata about tokens saved and compaction trigger.

### `/clear`
Clears all previous conversation history and starts a fresh session with a new session ID.

## Creating Custom Slash Commands

### File Structure
Store custom commands as markdown files in:
- **Project scope:** `.claude/commands/`
- **User scope:** `~/.claude/commands/`

### Basic Format
Filename (without `.md`) becomes the command name. File content defines command behavior.

**Example:** `.claude/commands/refactor.md`
```
Refactor the selected code to improve readability and maintainability.
Focus on clean code principles and best practices.
```

Creates the `/refactor` command.

### Advanced Configuration

Commands support YAML frontmatter for options:

```yaml
---
allowed-tools: Read, Grep, Glob, Bash
description: Run security vulnerability scan
model: claude-sonnet-4-5-20250929
---

Analyze codebase for security vulnerabilities...
```

### Dynamic Arguments

Use placeholders for parameterized commands:

```yaml
---
argument-hint: [issue-number] [priority]
---

Fix issue #$1 with priority $2.
```

Usage: `/fix-issue 123 high`

### Advanced Features

- **Bash execution:** Include output with `!`git status``
- **File references:** Include content using `@filename`
- **Namespacing:** Organize in subdirectories (affects descriptions only, not command names)

## Practical Examples

### Code Review Command
```markdown
---
allowed-tools: Read, Grep, Glob, Bash(git diff:*)
---

## Changed Files
!`git diff --name-only HEAD~1`

Review for code quality, security, performance, testing, and documentation.
```

### Test Runner Command
```markdown
---
allowed-tools: Bash, Read, Edit
argument-hint: [test-pattern]
---

Run tests matching pattern: $ARGUMENTS
Detect framework and fix failing tests.
```

## Integration with SDK

Custom commands automatically integrate into SDK sessions:

```typescript
for await (const message of query({
  prompt: "/code-review",
  options: { maxTurns: 3 }
})) {
  // Process review feedback
}
```

Custom commands appear in the `slash_commands` list alongside built-in commands.