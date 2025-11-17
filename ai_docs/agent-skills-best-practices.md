# Agent Skills Best Practices

## Core Principles

**Conciseness is Critical**
The documentation emphasizes that "the context window is a public good." Skills should avoid unnecessary explanations, assuming Claude already possesses foundational knowledge. Only metadata loads at startup; SKILL.md loads when relevant, and additional files load as needed.

**Degrees of Freedom**
Match specificity to task requirements:
- *High freedom*: Multiple valid approaches (general guidance)
- *Medium freedom*: Preferred patterns exist (pseudocode with parameters)
- *Low freedom*: Operations are fragile (specific scripts, minimal variation)

**Multi-Model Testing**
Test Skills across Claude Haiku, Sonnet, and Opus, as effectiveness varies by model capability.

## Skill Structure & Naming

**YAML Frontmatter Requirements:**
- `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only
- `description`: Maximum 1024 characters, non-empty, no XML tags

**Naming Conventions:**
Use gerund form (verb + -ing) like `processing-pdfs`, `analyzing-spreadsheets`. Avoid vague names ("helper," "utils") and reserved words ("anthropic-*").

**Effective Descriptions:**
Include what the Skill does and when to use it. Write in third person. Be specific with key terms to enable proper discovery among potentially 100+ Skills.

## Progressive Disclosure Patterns

Keep SKILL.md under 500 lines. Use progressive disclosure by bundling additional files that load only when needed:

**Pattern 1: High-level with references**
Main instructions point to separate files (FORMS.md, REFERENCE.md, EXAMPLES.md) loaded conditionally.

**Pattern 2: Domain-specific organization**
Organize by domain (finance.md, sales.md, product.md) so users only load relevant content.

**Pattern 3: Conditional details**
Show basics inline, link to advanced content for specialized needs.

**Key Guidelines:**
- Keep references one level deep from SKILL.md
- Include table of contents in files longer than 100 lines
- Avoid deeply nested references

## Content Guidelines

**Avoid Time-Sensitive Information**
Don't include date-dependent instructions. Use "old patterns" sections for deprecated approaches.

**Consistent Terminology**
Choose one term and use it throughout (e.g., always "extract," never "pull" or "retrieve").

**Common Patterns:**
- Template pattern: Provide exact or flexible templates based on strictness needs
- Examples pattern: Show input/output pairs demonstrating desired style
- Conditional workflow: Guide users through decision points

## Workflows & Feedback Loops

**Complex Tasks:**
Provide step-by-step checklists that users copy and check off during execution, particularly for multi-step processes.

**Validation Loops:**
Implement "run validator → fix errors → repeat" patterns. Example: analyze form → create mapping → validate → fill → verify.

## Evaluation & Iteration

**Build Evaluations First**
Create test scenarios before extensive documentation to ensure Skills solve actual problems. Structure evaluations with specific expected behaviors.

**Iterative Development with Claude**
1. Complete tasks without Skills, noting repeated context
2. Identify reusable patterns
3. Ask Claude to create a Skill capturing the pattern
4. Test with fresh Claude instances on similar tasks
5. Observe behavior gaps and refine

**Observing Usage:**
Monitor how Claude navigates Skills—unexpected file ordering, missed connections, or ignored content indicate structural improvements needed.

## Advanced: Executable Code

**Solve, Don't Punt**
Handle errors explicitly rather than relying on Claude to fix problems. Document parameter choices ("why 30 seconds for timeout?").

**Utility Scripts**
Provide pre-made scripts for reliability and token efficiency. Clearly indicate whether Claude should execute or read as reference.

**Validation Strategy**
Use plan-validate-execute workflow: create intermediate outputs → validate with scripts → execute. This catches errors before applying destructive changes.

**Dependencies:**
List required packages and verify availability in the code execution environment.

**Runtime Environment:**
Skills use filesystem access and bash commands. Organize with descriptive file names, use forward slashes, and prefer scripts for deterministic operations.

**MCP Tool References:**
Use fully qualified tool names: `ServerName:tool_name` to avoid "tool not found" errors.

## Anti-Patterns to Avoid

- Windows-style paths (use forward slashes)
- Excessive options without defaults
- Assuming packages are installed
- Magic numbers without justification

## Quality Checklist

**Core Quality:**
- Specific, discoverable descriptions
- Under 500 lines in SKILL.md
- Consistent terminology
- Concrete examples
- One-level-deep file references

**Code & Scripts:**
- Explicit error handling
- Justified constants
- Clear package requirements
- No Windows paths
- Validation for critical operations

**Testing:**
- Minimum three evaluations
- Multi-model testing
- Real scenario validation
