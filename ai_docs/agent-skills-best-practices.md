# Agent Skills Best Practices

## Core Principles

**Conciseness is essential.** The context window is shared across system prompts, conversation history, and other Skills. Claude only loads SKILL.md when the Skill becomes relevant, reading additional files as needed. Default assumption: "Claude is already very smart. Only add context Claude doesn't already have."

**Degrees of freedom should match task fragility:**
- High freedom (text instructions): Multiple valid approaches exist
- Medium freedom (pseudocode): Preferred patterns with some variation
- Low freedom (specific scripts): Fragile operations requiring exact sequences

**Test across all models.** Skills effectiveness depends on the underlying model, so validation across Claude Haiku, Sonnet, and Opus is necessary.

## Skill Structure

YAML frontmatter requires two fields:
- `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only
- `description`: Maximum 1024 characters, specifying what the Skill does and when to use it

Descriptions should use third person and include specific triggers for when Claude should activate the Skill.

## Key Organizational Patterns

**Progressive Disclosure:** Keep SKILL.md under 500 lines, with additional content in separate files loaded only when needed. Files should be referenced one level deep from SKILL.md to ensure complete reads.

**Pattern 1 - High-level guide with references:** Main SKILL.md points to FORMS.md, REFERENCE.md, and EXAMPLES.md

**Pattern 2 - Domain-specific organization:** Organize by domain (finance, sales, product) so irrelevant context isn't loaded

**Pattern 3 - Conditional details:** Show basic content with links to advanced materials

## Content Guidelines

Avoid time-sensitive information. Use consistent terminology throughout. Include workflows with clear sequential steps and checklists for complex tasks.

## Code and Executable Scripts

Scripts should solve problems rather than defer to Claude. Include explicit error handling, justify configuration values, and provide utility scripts for deterministic operations. Use forward slashes in file paths universally.

## Evaluation and Iteration

Build evaluations before extensive documentation. Work iteratively with Claude to create Skills, testing real usage patterns rather than hypothetical scenarios.

## Anti-patterns to Avoid

- Windows-style paths (use forward slashes)
- Offering too many implementation options
- Time-sensitive content without deprecated sections
- Deeply nested file references
