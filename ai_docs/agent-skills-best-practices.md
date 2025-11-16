# Skill Authoring Best Practices

## Core Principles

**Conciseness**: "The context window is a public good." Skills should assume Claude is intelligent and only include essential context. The SKILL.md body should stay under 500 lines, with additional content in separate files loaded on-demand.

**Degrees of Freedom**: Match specificity to task fragility:
- High freedom (text instructions) for multi-approach tasks
- Medium freedom (pseudocode) for preferred patterns
- Low freedom (specific scripts) for fragile operations

**Cross-Model Testing**: Verify Skills work with Haiku, Sonnet, and Opus, since effectiveness varies by model capability.

## Skill Structure

Skills use YAML frontmatter requiring:
- **name**: 64 characters max, lowercase/hyphens only, no reserved words
- **description**: 1024 characters max, specifying what the Skill does and when to use it

### Naming Conventions
Use gerund form (verb + -ing): `processing-pdfs`, `analyzing-spreadsheets`. Avoid vague names like `helper` or `utils`.

### Descriptions
Write in third person. Include both functionality and trigger contexts. "Processes Excel files and generates reports" beats generic phrases like "Helps with documents."

## Progressive Disclosure Pattern

Structure Skills like a table of contents:
1. Keep SKILL.md as overview (under 500 lines)
2. Link to separate files: FORMS.md, REFERENCE.md, EXAMPLES.md
3. Organize by domain when handling multiple datasets
4. Keep reference links one level deep from SKILL.md
5. Include table of contents in longer reference files

Example structure:
```
pdf-skill/
├── SKILL.md (overview)
├── FORMS.md (form-filling guide)
├── reference.md (API reference)
└── scripts/
    ├── analyze_form.py
    └── fill_form.py
```

## Workflows and Feedback Loops

**Use checklists for complex tasks**: Provide copyable progress trackers that Claude can check off step-by-step.

**Implement validation loops**: Pattern: run validator → fix errors → repeat. This catches problems early, especially for batch operations or destructive changes.

## Content Guidelines

- **Avoid time-sensitive information**: Use "old patterns" sections instead of date-based conditionals
- **Consistent terminology**: Pick one term and use it throughout (avoid mixing "field," "box," "element")

## Common Patterns

**Template Pattern**: Provide exact output structure for strict requirements

**Examples Pattern**: Show input/output pairs demonstrating desired style and detail level

**Conditional Workflows**: Guide Claude through decision points with clear branching

## Evaluation and Iteration

Build evaluations first, before extensive documentation. Create test scenarios measuring baseline performance without the Skill, then verify improvements. Develop Skills iteratively with Claude—have one instance (Claude A) create/refine the Skill while another (Claude B) tests it on real tasks.

## Advanced: Executable Code

- **Solve, don't punt**: Handle errors explicitly rather than asking Claude to fix problems
- **Provide utility scripts**: Pre-made scripts are more reliable than generated code
- **Use visual analysis**: Convert PDFs to images for layout understanding
- **Create verifiable outputs**: Use plan-validate-execute patterns
- **Package dependencies**: List required packages and verify availability

## Anti-Patterns to Avoid

- Windows-style paths (use forward slashes: `scripts/helper.py`)
- Too many options (provide defaults with escape hatches)
- Magic constants without justification
- Deeply nested file references (keep one level deep)

## Technical Notes

- Scripts execute without loading full contents into context
- Files are read on-demand, consuming tokens only when accessed
- Metadata loads at startup; SKILL.md loads when relevant
- Use fully qualified MCP tool names: `ServerName:tool_name`

## Final Checklist

**Core Quality**: Specific descriptions, clear workflows, consistent terminology, concrete examples, progressive disclosure

**Code & Scripts**: Error handling, justified constants, listed dependencies, no Windows paths, validation steps

**Testing**: At least three evaluations, cross-model testing, real usage scenarios, team feedback incorporated
