# Skill Authoring Best Practices

## Core Principles

### Concise is Key

The context window is shared across system prompts, conversation history, other Skills' metadata, and your actual request. Only SKILL.md metadata pre-loads at startup; Claude reads the full file only when relevant. "Default assumption: Claude is already very smart" — avoid redundant explanations that waste tokens.

### Set Appropriate Degrees of Freedom

Match specificity to task fragility:
- **High freedom** (text instructions): Multiple valid approaches exist
- **Medium freedom** (pseudocode/scripts with parameters): Preferred patterns exist
- **Low freedom** (specific scripts): Operations are error-prone and require exact sequences

### Test with All Models

Skills effectiveness depends on the underlying model. Test with Haiku, Sonnet, and Opus before deployment.

## Skill Structure

### Naming Conventions

Use gerund form (verb + -ing) for clarity:
- Good: `processing-pdfs`, `analyzing-spreadsheets`
- Avoid: `helper`, `utils`, reserved words like `anthropic-helper`

### Writing Effective Descriptions

Descriptions enable Skill discovery. Write in third person and include what the Skill does plus when to use it.

> "Processes Excel files and generates reports. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files."

## Progressive Disclosure Patterns

Keep SKILL.md under 500 lines. Bundle additional content that Claude loads only when needed:

- **Pattern 1**: High-level guide with references to FORMS.md, REFERENCE.md, EXAMPLES.md
- **Pattern 2**: Domain-specific organization (separate files for finance, sales, product, marketing)
- **Pattern 3**: Conditional details (link to advanced features only when relevant)

Avoid deeply nested references (links within links). Structure longer reference files with tables of contents.

## Workflows and Feedback Loops

### Use Workflows for Complex Tasks

Provide checklists that Claude can copy and track:

```
- [ ] Step 1: Analyze the form
- [ ] Step 2: Create field mapping
- [ ] Step 3: Validate mapping
- [ ] Step 4: Fill the form
- [ ] Step 5: Verify output
```

### Implement Feedback Loops

Use validator scripts to catch errors early: Run validator → fix errors → repeat.

## Content Guidelines

### Avoid Time-Sensitive Information

Don't include dates or versioning that will become outdated. Use "Old patterns" sections instead.

### Use Consistent Terminology

Choose one term and stick with it throughout (e.g., always "API endpoint," not "URL" or "path").

## Common Patterns

### Template Pattern

For strict requirements, provide exact templates. For flexible guidance, show sensible defaults.

### Examples Pattern

Provide input/output pairs to demonstrate desired style and detail level.

### Conditional Workflow Pattern

Guide through decision points: Creating new content? Follow workflow A. Editing existing? Follow workflow B.

## Evaluation and Iteration

### Build Evaluations First

Create evaluations before extensive documentation to solve real problems rather than anticipated ones.

### Develop Skills Iteratively with Claude

1. Complete a task without the Skill, noting what context you repeatedly provide
2. Ask Claude to create a Skill capturing that pattern
3. Review for conciseness and information architecture
4. Test on similar tasks with fresh Claude instances
5. Iterate based on observed behavior

### Observe Navigation Patterns

Watch for unexpected exploration, missed connections, overreliance on certain sections, and ignored content to improve structure.

## Anti-Patterns to Avoid

- Use forward slashes in paths (`scripts/helper.py`), not backslashes
- Provide one default approach with escape hatches, not multiple options

## Advanced: Skills with Executable Code

### Solve, Don't Punt

Handle error conditions explicitly rather than leaving them for Claude. Document "magic numbers" and configuration parameters.

### Provide Utility Scripts

Pre-made scripts are more reliable, save tokens, and ensure consistency.

### Use Visual Analysis

Convert PDFs to images for Claude to analyze layouts and structures visually.

### Create Verifiable Intermediate Outputs

Use "plan-validate-execute" patterns: Claude creates a plan in structured format → validation script checks it → execution applies changes.

### Package Dependencies

List required packages and verify availability in code execution documentation.

## Runtime Environment

Skills run in a code execution environment with filesystem access and bash commands. At startup, only SKILL.md metadata loads; files are read on-demand. Organize files descriptively and with forward slashes. Bundle comprehensive resources knowing they consume zero context until accessed.

When referencing MCP tools, use fully qualified names: `ServerName:tool_name` (e.g., `BigQuery:bigquery_schema`).

## Technical Notes

### YAML Frontmatter Requirements

- `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only
- `description`: Maximum 1024 characters, non-empty, no XML tags

### Token Budgets

Keep SKILL.md body under 500 lines for optimal performance.

## Checklist for Effective Skills

**Core quality**: Specific description, under 500 lines, separate files for overflow, no time-sensitive info, consistent terminology, concrete examples, one-level-deep references

**Code and scripts**: Explicit error handling, justified constants, listed package dependencies, documented scripts, forward-slash paths, validation steps, feedback loops

**Testing**: At least three evaluations, tested across Haiku/Sonnet/Opus, real usage scenarios, team feedback incorporated
