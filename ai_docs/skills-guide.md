# Using Agent Skills with the API - Complete Documentation

## Overview

Agent Skills extend Claude's capabilities through organized folders containing instructions, scripts, and resources. The integration works identically whether using Anthropic's pre-built Skills or custom Skills uploaded to your workspace.

## Key Differences: Anthropic vs Custom Skills

| Aspect | Anthropic Skills | Custom Skills |
|--------|------------------|---------------|
| **Type value** | `anthropic` | `custom` |
| **Skill IDs** | Short names (pptx, xlsx, docx, pdf) | Generated IDs (skill_01AbCd...) |
| **Version format** | Date-based (20251013) or latest | Epoch timestamps or latest |
| **Management** | Maintained by Anthropic | User-managed via API |

## Prerequisites

Required components include:

- Anthropic API key from the Console
- Beta headers: `code-execution-2025-08-25`, `skills-2025-10-02`, `files-api-2025-04-14`
- Code execution tool enabled in requests

## Using Skills in Messages

### Container Parameter

Specify up to 8 Skills per request using the container parameter:

```python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a presentation about renewable energy"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

### Downloading Generated Files

When Skills create documents, extract file IDs from responses and use the Files API:

```python
# Extract file IDs
file_ids = []
for item in response.content:
    if item.type == 'bash_code_execution_tool_result':
        # Process files with file_id attribute

# Download files
file_content = client.beta.files.download(
    file_id=file_id,
    betas=["files-api-2025-04-14"]
)
file_content.write_to_file(filename)
```

### Multi-Turn Conversations

Reuse containers across messages:

```python
response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "id": response1.container.id,  # Reuse container
        "skills": [...]
    },
    messages=messages,
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}]
)
```

### Long-Running Operations

Handle `pause_turn` stop reasons for extended operations by resubmitting with the same container ID.

## Managing Custom Skills

### Creating Skills

Upload custom Skills using directory paths or file objects:

```python
from anthropic.lib import files_from_dir

skill = client.beta.skills.create(
    display_title="Financial Analysis",
    files=files_from_dir("/path/to/skill"),
    betas=["skills-2025-10-02"]
)
```

**Requirements:**
- Must include SKILL.md file at top level
- Total upload size under 8MB
- Name: max 64 characters (lowercase/numbers/hyphens only)
- Description: max 1024 characters

### Listing and Retrieving Skills

```python
# List all Skills
skills = client.beta.skills.list(betas=["skills-2025-10-02"])

# Filter by source
custom_skills = client.beta.skills.list(
    source="custom",
    betas=["skills-2025-10-02"]
)

# Retrieve specific Skill
skill = client.beta.skills.retrieve(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)
```

### Versioning

Delete all versions before deleting a Skill:

```python
versions = client.beta.skills.versions.list(
    skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
    betas=["skills-2025-10-02"]
)

for version in versions.data:
    client.beta.skills.versions.delete(
        skill_id="skill_01AbCdEfGhIjKlMnOpQrStUv",
        version=version.version,
        betas=["skills-2025-10-02"]
    )
```

## Use Cases

**Organizational:** Apply brand formatting, standardize communications, structure project notes, execute company-specific analyses.

**Personal:** Custom document templates, specialized data processing, domain-specific content generation.

**Example - Financial Modeling:** Combine Excel and custom DCF analysis Skills for comprehensive financial models.

## Limitations

**Request limits:**
- Maximum 8 Skills per request
- Maximum 8MB total upload size
- YAML frontmatter: name (64 chars max), description (1024 chars max)

**Environment constraints:**
- No network access
- No runtime package installation
- Isolated container per request

## Best Practices

1. **Multiple Skills:** Combine only when tasks involve multiple document types
2. **Version Management:** Pin specific versions for production, use "latest" for development
3. **Prompt Caching:** Changing Skills list breaks cache—maintain consistent configurations
4. **Error Handling:** Gracefully handle skill-specific errors with try-except blocks

## How Skills Load

"Claude sees metadata for each Skill (name, description) in the system prompt" before files are copied into the container at `/skills/{directory}/`. Claude automatically loads full instructions when relevant to requests.
