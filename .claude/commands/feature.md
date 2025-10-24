# Feature Planning

Create a new plan to implement the `Feature` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Variables
issue_number: $1
adw_id: $2
issue_json: $3

## Instructions

- IMPORTANT: You're writing a plan to implement a feature based on the `Feature` that will add value to the application.
- IMPORTANT: The `Feature` describes what will be implemented but remember we're not implementing it yet, we're creating the plan that will be used to implement the feature based on the `Plan Format` below.
- You're writing a plan to implement a feature, it should be thorough and precise so we build it correctly the first time.
- Create the plan in the `projects/admin/specs/` directory with filename: `issue-{issue_number}-adw-{adw_id}-sdlc_planner-{descriptive-name}.md`
  - Replace `{descriptive-name}` with a short, descriptive name based on the feature (e.g., "database-schema-mcp-client", "user-authentication", "video-upload")
- Use the plan format below to create the plan.
- Research the codebase and put together a comprehensive plan to implement the feature.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to implement the feature correctly.
- Use your reasoning model: THINK HARD about the feature requirements, dependencies, and implementation steps.

## Relevant Files

Read these files to understand context:
- `CLAUDE.md` - Repository overview and architecture
- `docs/AGENT-INDEX.md` - Codebase navigation
- `projects/admin/WEEK-1-STRATEGY.md` - Week 1 implementation strategy (if working on admin dashboard)
- `projects/admin/docs/foundation-setup.md` - Admin dashboard foundation plan (if working on admin dashboard)

## Feature

```json
$3
```

## Plan Format

Use this exact format for the plan:

```markdown
# Feature Implementation Plan: <Feature Title>

**Issue:** #{issue_number}
**ADW ID:** {adw_id}
**Type:** Feature
**Created:** <current date>

---

## Overview

<Brief 2-3 sentence summary of what this feature does and why it's needed>

## Context

<1-2 paragraphs explaining:
- Current state of the codebase relevant to this feature
- Where this feature fits in the architecture
- Any related features or dependencies>

## Requirements

### Functional Requirements
- <Requirement 1: What the feature must do>
- <Requirement 2>
- <Requirement 3>
- ...

### Technical Requirements
- <Technical constraint or requirement 1>
- <Technical constraint 2>
- ...

### Non-Functional Requirements (if applicable)
- <Performance requirements>
- <Security requirements>
- <Scalability requirements>

## Architecture & Design

### High-Level Design
<Explain the overall approach:
- Which components will be created/modified
- How they interact
- Data flow diagram (in text/markdown)>

### Database Changes (if applicable)
```sql
-- SQL schema changes
-- Include all tables, columns, indexes, constraints
```

### API Changes (if applicable)
```typescript
// New API endpoints or modifications
// Request/response types
```

### Component Structure
```
path/to/new/files/
├── component1.ts      # Purpose
├── component2.tsx     # Purpose
└── tests/
    └── component.test.ts
```

## Implementation Steps

### Step 1: <Step Title>
**Goal:** <What this step accomplishes>

**Files to Create:**
- `path/to/file1.ts` - <Purpose>
- `path/to/file2.tsx` - <Purpose>

**Files to Modify:**
- `path/to/existing.ts` - <What changes>

**Implementation Details:**
<Detailed explanation of what to do in this step>

**Acceptance Criteria:**
- [ ] <Specific criteria 1>
- [ ] <Specific criteria 2>

---

### Step 2: <Step Title>
**Goal:** <What this step accomplishes>

**Files to Create:**
- ...

**Files to Modify:**
- ...

**Implementation Details:**
...

**Acceptance Criteria:**
- [ ] ...

---

### Step 3: <Step Title>
...

(Continue for all implementation steps)

## Testing Strategy

### Unit Tests
<Describe what unit tests are needed>

**Test Files:**
- `tests/unit/feature.test.ts` - <What to test>

**Key Test Cases:**
- [ ] Test case 1
- [ ] Test case 2

### Integration Tests (if applicable)
<Describe integration tests needed>

### E2E Tests (if applicable)
<Describe end-to-end tests needed>

## Security Considerations

- <Security concern 1 and how it's addressed>
- <Security concern 2>
- ...

## Performance Considerations

- <Performance consideration 1>
- <Performance consideration 2>

## Rollout Plan

1. **Development:** Implement in isolated worktree
2. **Testing:** Run unit + integration + E2E tests
3. **Review:** Code review + screenshot validation
4. **Deployment:** Merge to main → auto-deploy

## Success Criteria

- [ ] All functional requirements met
- [ ] All tests passing
- [ ] Code follows repository conventions
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Performance meets requirements

## Potential Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| <Risk 1> | High/Med/Low | High/Med/Low | <How to mitigate> |
| <Risk 2> | ... | ... | ... |

## Notes

<Any additional notes, assumptions, or considerations>

---

**End of Plan**
```

## Report

After completing the plan, report back using this format:

```
✅ Feature implementation plan created successfully!

**Plan File:** `projects/admin/specs/issue-{issue_number}-adw-{adw_id}-sdlc_planner-{descriptive-name}.md`
**Feature:** <Feature title>
**Implementation Steps:** <Number of steps>
**Estimated Complexity:** Low | Medium | High
**Key Files to Create:** <Number>
**Key Files to Modify:** <Number>

The plan is ready for the implementation phase.
```
