# Claude Agent Skills API Guide

## Core Concepts

Agent Skills extend Claude's capabilities through organized collections of instructions, scripts, and resources. The documentation describes how to integrate both Anthropic-managed and custom Skills with the Claude API.

## Skill Types

**Anthropic Skills** include pre-built document tools:
- `pptx` (PowerPoint)
- `xlsx` (Excel)
- `docx` (Word)
- `pdf`

**Custom Skills** are user-uploaded and managed via the Skills API with generated IDs like `skill_01AbCdEfGhIjKlMnOpQrStUv`.

## Technical Requirements

Three beta headers enable Skills functionality:
- `code-execution-2025-08-25` (required for code execution)
- `skills-2025-10-02` (enables Skills API)
- `files-api-2025-04-14` (file operations)

Skills operate through the code execution tool and run in isolated containers without network access or runtime package installation.

## Key Operations

**Container Integration**: Skills are specified via a container parameter accepting up to 8 Skills per request, each with type, skill_id, and optional version.

**File Management**: Generated documents return file_ids accessible through the Files API for download and processing.

**Multi-turn Support**: Reuse containers across conversations by specifying their ID in subsequent requests.

**Versioning**: Anthropic Skills use date-based versions (e.g., `20251013`); custom Skills use epoch timestamps with "latest" option available.

## Skill Management

Create Skills by uploading directories containing a required `SKILL.md` file with YAML frontmatter specifying name (max 64 chars) and description (max 1024 chars). Maximum upload size is 8MB.

List, retrieve, delete, and create new versions of Skills through dedicated API endpoints.

## Best Practices

Pin specific versions for production stability; use "latest" during development. Changing Skills lists breaks prompt caching. Keep Skills list consistent across requests for optimal performance. Handle `pause_turn` stop reasons for long-running operations.
