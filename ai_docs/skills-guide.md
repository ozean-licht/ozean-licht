# Claude Agent Skills Guide: API Integration

## Overview

Agent Skills extend Claude's capabilities through organized collections of instructions, scripts, and resources. The documentation demonstrates how to use both Anthropic-managed and custom Skills via the Messages API.

## Key Integration Points

**Skill Sources:**
- **Anthropic Skills**: Pre-built solutions like `pptx`, `xlsx`, `docx`, `pdf` with date-based versions
- **Custom Skills**: User-uploaded with generated IDs and epoch timestamp versioning

Skills integrate identically regardless of source, executed through the code execution tool with a `container` parameter supporting up to 8 Skills per request.

## Container Parameter Structure

The implementation requires specifying Skills with:
- `type`: either "anthropic" or "custom"
- `skill_id`: short names for Anthropic or generated IDs for custom
- `version`: date-format (Anthropic) or timestamp (custom), or "latest"

## File Generation and Download

When Skills create documents, responses include `file_id` attributes. The Files API enables downloading generated content:

```
Extract file IDs → Use Files API retrieve_metadata() → Download with
Files API download() → Save locally
```

## Multi-Turn Conversations

Container reuse across conversation turns uses the container ID from previous responses, enabling context persistence without regenerating the Skills environment.

## Custom Skill Management

**Creation requirements:**
- Must include SKILL.md at root level
- Maximum 8MB total upload size
- YAML frontmatter with name (64 char max, lowercase/hyphens only) and description (1024 char max)

**Operations available:**
- Create new Skills from file collections
- List all workspace Skills (filter by source)
- Retrieve specific Skill details
- Delete Skills (after removing all versions first)

## Versioning Strategy

**Anthropic-managed**: Use specific date versions for stability in production
**Custom Skills**: Pin to epoch timestamps for predictable behavior, use "latest" during development

## Environment Constraints

Skills execute in isolated containers with:
- No external network access
- Pre-installed packages only (no runtime installation)
- Fresh container per request

## Best Practices

Combine Skills when workflows involve multiple document types. Maintain consistent Skills lists for prompt caching effectiveness. Handle `pause_turn` stop reasons for long-running operations by continuing the conversation with the same container ID.
