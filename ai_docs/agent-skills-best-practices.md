# Agent Skills Best Practices

## Core Principles

**Conciseness is Critical**
The context window is shared with system prompts, conversation history, and other Skills. Claude assumes competence, so avoid explaining basic concepts. "Does Claude really need this explanation?" should guide your content decisions.

**Degrees of Freedom**
Match specificity to task fragility:
- **High freedom** (text instructions): Multiple valid approaches exist
- **Medium freedom** (pseudocode): Preferred patterns with configuration options
- **Low freedom** (specific scripts): Fragile operations requiring exact sequences

**Multi-Model Testing**
Test Skills across Claude Haiku, Sonnet, and Opus, as effectiveness varies by model capability.

## Skill Structure Requirements

**YAML Frontmatter:**
- `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only
- `description`: Maximum 1024 characters, must indicate what the Skill does and when to use it

**Naming Conventions**
Use gerund form (verb + -ing): `processing-pdfs`, `analyzing-spreadsheets`. Avoid vague names like "helper" or "utils."

**Effective Descriptions**
Write in third person, be specific with key terms, and include both functionality and usage triggers: "Extracts text and tables from PDF files. Use when working with PDFs or document extraction."

## Progressive Disclosure Architecture

Keep SKILL.md under 500 lines. Bundle related content in separate files loaded only when needed:

- Main instructions in SKILL.md
- Advanced features in FORMS.md, REFERENCE.md
- Domain-specific data in organized subdirectories
- One level deep from SKILL.md (no nested references)
- Include table of contents in files exceeding 100 lines

## Workflows and Feedback Loops

**Checklist Pattern**
For complex multi-step tasks, provide copyable checklists that Claude can track:

```
- [ ] Step 1: Analyze input
- [ ] Step 2: Validate structure
- [ ] Step 3: Apply transformations
- [ ] Step 4: Verify output
```

**Validation Loops**
Implement run-validator-fix-repeat patterns using scripts or reference documents to catch errors early.

## Content Guidelines

**Avoid Time-Sensitive Information**
Use "Old Patterns" sections for deprecated approaches rather than date-based conditionals.

**Terminology Consistency**
Choose one term per concept and maintain it throughout (e.g., always "API endpoint," never "URL" or "path").

## Common Patterns

**Templates**: Provide exact structures for strict requirements; offer flexible templates for contextual tasks.

**Examples**: Include concrete input/output pairs demonstrating desired style and detail level.

**Conditional Workflows**: Guide Claude through decision points with clear branching logic.

## Evaluation and Iteration

**Build Evaluations First**
Create test scenarios before extensive documentation to solve real problems rather than anticipating needs.

**Iterative Development with Claude**
Work with one instance (Claude A) creating the Skill while testing with another (Claude B) on real tasks. Observe usage patterns and refine based on actual behavior, not assumptions.

## Anti-Patterns

Avoid Windows-style paths (`\`) — use forward slashes universally. Don't present excessive options; provide sensible defaults with escape hatches.

## Advanced: Executable Code

**Problem-Solving Scripts**
Write utilities that handle errors explicitly rather than punting to Claude. Justify configuration values ("Three retries balances reliability vs speed").

**Utility Scripts**
Pre-made, reliable scripts save tokens and ensure consistency. Make clear whether Claude should execute or read them for reference.

**Verifiable Outputs**
For complex operations, use plan-validate-execute patterns: Claude creates structured intermediate files, validators verify them, then execution proceeds.

## Technical Requirements

Keep SKILL.md under 500 lines. Reference packages available in code execution environments. Use fully qualified MCP tool names (`ServerName:tool_name`). Avoid assuming packages are pre-installed.

## Pre-Submission Checklist

- Description is specific with key terms and usage triggers
- SKILL.md body under 500 lines with separate reference files
- No time-sensitive information
- Consistent terminology throughout
- Concrete examples provided
- One-level-deep file references only
- Scripts solve problems, don't punt
- Explicit error handling in code
- Tested with Haiku, Sonnet, and Opus
- Three minimum evaluations created
