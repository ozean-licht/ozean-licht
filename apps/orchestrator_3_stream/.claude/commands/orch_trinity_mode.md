---
description: Launch 3 parallel scout agents for comprehensive multi-faceted analysis
argument-hint: [analysis topic]
---

# Trinity Mode Analysis

Launch three specialized scout agents in parallel to perform comprehensive analysis from multiple perspectives. Each agent focuses on a different aspect of the topic to provide thorough, multi-dimensional insights.

## Variables

ANALYSIS_TOPIC: $1
OUTPUT_DIRECTORY: `specs/`
TRINITY_AGENTS: 3

## Instructions

- IMPORTANT: If no `ANALYSIS_TOPIC` is provided, stop and ask the user to provide it.
- Launch 3 specialized scout agents in PARALLEL, each with a different analytical focus
- Each agent should explore different aspects or perspectives of the topic
- Consolidate findings from all three agents into comprehensive analysis reports
- Save all reports to OUTPUT_DIRECTORY with descriptive filenames
- Provide summary of key insights from each perspective

## Workflow

1. **Parse Request** - Understand the analysis topic and determine the 3 best analytical perspectives
2. **Deploy Trinity Scouts** - Launch 3 @agent-scout-report-suggest agents in PARALLEL:
   - Agent 1: Current State Analysis (complexity, existing patterns, technical debt)
   - Agent 2: Requirements Analysis (features, user needs, specifications)
   - Agent 3: Strategic Analysis (architecture, scalability, future considerations)
3. **Gather Results** - Collect findings from all three agents
4. **Generate Reports** - Create comprehensive markdown reports for each perspective
5. **Cross-Reference** - Identify common themes and contradictions across perspectives
6. **Save Documentation** - Write all reports to OUTPUT_DIRECTORY
7. **Provide Summary** - Report key insights from each analytical perspective

## Trinity Perspectives

### Agent 1: Current State Analysis
Focus on:
- Existing codebase complexity
- Technical debt and pain points
- Current architecture patterns
- Files and components involved
- Refactoring opportunities

### Agent 2: Requirements Analysis
Focus on:
- Feature requirements
- User needs and use cases
- Functional specifications
- Critical vs nice-to-have features
- Implementation priorities

### Agent 3: Strategic Analysis
Focus on:
- Architecture decisions
- Scalability considerations
- Integration points
- Future extensibility
- Best practices and patterns

## Output Format

Each agent should produce a report with:

```md
# [Perspective] Analysis: [Topic]

**Generated:** [Date]
**By:** Trinity Mode - [Perspective] Agent
**Status:** Complete

## Executive Summary
<high-level overview of findings>

## Key Findings
<detailed analysis from this perspective>

## Recommendations
<actionable recommendations>

## Priority Actions
<ordered list of critical next steps>
```

## Report

After completing the trinity analysis, provide:

```
✅ Trinity Mode Analysis Complete

Topic: [ANALYSIS_TOPIC]
Agents Deployed: 3 parallel scouts

Generated Reports:
1. [Agent 1 Report]: [filename].md - [key insight]
2. [Agent 2 Report]: [filename].md - [key insight]
3. [Agent 3 Report]: [filename].md - [key insight]

Cross-Cutting Themes:
- [theme 1]
- [theme 2]
- [theme 3]

Strategic Recommendation: [main takeaway]
```

## Example Usage

```
/orch_trinity_mode admin app requirements analysis
```

This would deploy:
- Agent 1: Analyze current admin app complexity
- Agent 2: Gather admin requirements for both platforms
- Agent 3: Design strategic admin architecture approach
