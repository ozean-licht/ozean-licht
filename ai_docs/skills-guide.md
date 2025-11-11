# Using Agent Skills with the API - Complete Documentation

## Overview

Agent Skills extend Claude's capabilities through organized folders of instructions, scripts, and resources. They integrate with the Messages API via the code execution tool and come from two sources: Anthropic-managed Skills or custom Skills you upload.

## Key Concepts

**Skill Sources:**
- **Anthropic Skills**: Pre-built by Anthropic (pptx, xlsx, docx, pdf) with date-based versions
- **Custom Skills**: User-uploaded with generated IDs and epoch timestamp versions

## Using Skills in Messages

### Container Parameter

Skills are specified via the `container` parameter supporting up to 8 Skills per request:

```python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    messages=[{"role": "user", "content": "Create a spreadsheet"}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

### File Management

When Skills generate documents, extract file IDs from responses and download via the Files API:

```python
file_ids = [item.file_id for item in response.content
            if hasattr(item, 'file_id')]
for file_id in file_ids:
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )
    file_content.write_to_file(metadata.filename)
```

## Managing Custom Skills

### Creating Skills

```python
from anthropic.lib import files_from_dir

skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=files_from_dir("/path/to/skill"),
    betas=["skills-2025-10-02"]
)
```

**Requirements:**
- Include SKILL.md at top level
- Total size under 8MB
- Name: max 64 characters, lowercase/numbers/hyphens only
- Description: max 1024 characters, non-empty

### Listing & Retrieving Skills

```python
# List all Skills
skills = client.beta.skills.list(betas=["skills-2025-10-02"])

# Filter by source
custom = client.beta.skills.list(source="custom", betas=["skills-2025-10-02"])

# Retrieve specific Skill
skill = client.beta.skills.retrieve(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)
```

### Versioning

Custom Skills use epoch timestamps. Create new versions when updating files:

```python
new_version = client.beta.skills.versions.create(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    files=files_from_dir("/path/to/updated_skill"),
    betas=["skills-2025-10-02"]
)
```

### Deletion

Delete all versions before removing a Skill:

```python
versions = client.beta.skills.versions.list(skill_id=skill_id)
for v in versions.data:
    client.beta.skills.versions.delete(skill_id=skill_id, version=v.version)
client.beta.skills.delete(skill_id=skill_id)
```

## Advanced Features

### Multi-Turn Conversations

Reuse containers across messages by specifying container ID:

```python
response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={"id": response1.container.id, "skills": [...]},
    messages=messages,
    tools=[{"type": "code_execution_20250825"}]
)
```

### Long-Running Operations

Handle `pause_turn` stop reason for multi-step operations:

```python
for i in range(max_retries):
    if response.stop_reason != "pause_turn":
        break
    messages.append({"role": "assistant", "content": response.content})
    response = client.beta.messages.create(...)
```

## Limits & Constraints

- **Maximum Skills per request**: 8
- **Maximum upload size**: 8MB combined
- **No network access** in execution environment
- **No runtime package installation**
- Each request gets a fresh container

## Best Practices

**Version Management:**
- Production: Pin to specific versions for stability
- Development: Use "latest" for active work

**Prompt Caching:**
Changing Skills list breaks cache. Keep Skills consistent across requests.

**Error Handling:**
```python
try:
    response = client.beta.messages.create(...)
except anthropic.BadRequestError as e:
    if "skill" in str(e):
        # Handle skill-specific errors
```

## Use Cases

- **Organizational**: Brand-consistent documents, project management, financial reports
- **Personal**: Content templates, data analysis pipelines, development workflows
- **Financial**: Combine Excel with custom DCF analysis for modeling
