# Agent Skills Best Practices

## Core Principles

**Conciseness**: Context windows are shared resources. Assume Claude already understands foundational concepts. Only include information Claude genuinely needs. The documentation states that "being concise in SKILL.md still matters: once Claude loads it, every token competes with conversation history."

**Appropriate Freedom Levels**: Match specificity to task fragility:
- High freedom for tasks with multiple valid approaches
- Medium freedom when preferred patterns exist but variation is acceptable
- Low freedom for error-prone operations requiring exact sequences

**Multi-Model Testing**: Test Skills across Claude Haiku, Sonnet, and Opus since effectiveness varies by model capability.

## Skill Structure Requirements

**Metadata Fields**:
- `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only
- `description`: Maximum 1024 characters, should explain both what the Skill does and when to use it

**Naming Conventions**: Use gerund form (verb + -ing) like `processing-pdfs` or `analyzing-spreadsheets` for clarity.

## Progressive Disclosure

Organize content hierarchically:
- Keep SKILL.md under 500 lines
- Reference additional files only as needed (FORMS.md, REFERENCE.md, etc.)
- Keep references one level deep from SKILL.md to ensure complete file reading
- Include table of contents in longer reference files

## Workflows and Feedback

Implement explicit workflows with checklists for complex tasks. Include validation steps where critical—particularly for batch operations or destructive changes.

## Common Patterns

**Template Pattern**: Provide strict templates for format-critical outputs; flexible guidance otherwise.

**Examples Pattern**: Show concrete input/output pairs demonstrating desired style and detail levels.

**Conditional Workflows**: Guide Claude through decision trees directing toward appropriate processes.

## Testing and Iteration

Create evaluations before extensive documentation. Develop Skills iteratively by alternating between:
- Working with Claude to refine instruction content
- Testing with Claude using actual tasks
- Observing behavior and identifying gaps

## Anti-Patterns to Avoid

- Windows-style file paths (use forward slashes universally)
- Offering excessive options without clear defaults
- Time-sensitive information embedded in content
- Inconsistent terminology throughout documentation

## Advanced: Executable Code

Scripts should solve problems rather than defer to Claude. Justify all configuration parameters. Handle errors explicitly instead of failing and leaving Claude to troubleshoot.

**Verification Pattern**: For critical operations, implement plan-validate-execute workflows where Claude creates structured intermediate outputs before applying changes.