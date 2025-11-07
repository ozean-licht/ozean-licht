# Claude Skills Guide - API Documentation

## Overview

Agent Skills extend Claude's capabilities through organized collections of instructions, scripts, and resources. They integrate with the Messages API via the code execution tool, supporting both Anthropic pre-built Skills and custom user-created Skills.

## Key Distinctions

**Anthropic-Managed Skills:**
- Type: `anthropic`
- IDs: Short names (`pptx`, `xlsx`, `docx`, `pdf`)
- Versions: Date-based (`20251013`) or `latest`

**Custom Skills:**
- Type: `custom`
- IDs: Generated identifiers (`skill_01AbCdEfGhIjKlMnOpQrStUv`)
- Versions: Epoch timestamps or `latest`

## Prerequisites

Required for implementation:
- Anthropic API key from Console
- Beta headers: `code-execution-2025-08-25`, `skills-2025-10-02`, `files-api-2025-04-14`
- Code execution tool enabled

## Using Skills in Messages

Skills are specified via the `container` parameter, supporting up to 8 Skills per request:

```
container={
    "skills": [
        {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
    ]
}
```

## Core Operations

**Creating Custom Skills:**
Files must include a SKILL.md with YAML frontmatter specifying name (max 64 chars, lowercase) and description (max 1024 chars). Maximum upload size: 8MB.

**Managing Versions:**
Create new versions for updates; pin to specific versions for production stability; use `latest` for development environments.

**Multi-Turn Conversations:**
Reuse containers by specifying container ID across multiple requests to maintain state.

**Long-Running Operations:**
Handle `pause_turn` stop reasons by providing responses back to continue interrupted operations.

## Files API Integration

Skills generating documents (Excel, PowerPoint, PDF, Word) return `file_id` attributes. Use Files API to retrieve metadata and download content locally.

## Limits and Constraints

- Maximum 8 Skills per request
- 8MB total upload limit per Skill
- No network access in execution environment
- No runtime package installation
- Fresh isolated container per request

## Best Practices

1. Combine Skills only when handling multiple document types
2. Avoid including unused Skills to maintain performance
3. Pin versions for production; use `latest` during development
4. Changing Skills list breaks prompt cache—maintain consistency
5. Handle errors gracefully with try-catch blocks

## Common Use Cases

- Financial modeling combining Excel and DCF analysis
- Data analysis with presentation generation
- Brand-consistent document creation
- Specialized domain workflows

The documentation emphasizes that Skills work identically whether sourced from Anthropic or uploaded as custom Skills, enabling seamless composition for complex workflows.
