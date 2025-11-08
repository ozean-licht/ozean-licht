# Custom Slash Commands in Claude Code

## Overview

Claude Code supports creating reusable slash commands that streamline specific workflows. These commands can be shared across teams or kept personal.

## Project-Specific Commands

**Setup Process:**

1. Create a commands directory: `mkdir -p .claude/commands`
2. Generate Markdown files for each command (filenames become command names)
3. Invoke commands in Claude sessions using the `/` prefix

**Example:**
```bash
echo "Analyze the performance of this code and suggest three specific optimizations:" > .claude/commands/optimize.md
```

Then use: `> /optimize`

**Key Features:**
- Command names derive from filenames (e.g., `optimize.md` → `/optimize`)
- Organize commands in subdirectories for categorization
- Markdown content becomes the executed prompt
- Team members access commands after repository cloning

## Personal Commands

Personal commands remain private to individual users across all projects:

```bash
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities..." > ~/.claude/commands/security-review.md
```

Personal commands display "(user)" in help listings and work universally across different codebases.

## Dynamic Commands with Arguments

Commands accept user input via the `$ARGUMENTS` placeholder:

```bash
echo 'Find and fix issue #$ARGUMENTS. Follow these steps: 1. Understand the issue...' > .claude/commands/fix-issue.md
```

Usage: `> /fix-issue 123`

The placeholder substitutes with provided arguments anywhere within the template.

## Best Practices

- Use descriptive filenames for clarity
- Position arguments strategically in prompts
- Create team commands for consistent workflows
- Consider applications: test generation, documentation, code review, content translation
