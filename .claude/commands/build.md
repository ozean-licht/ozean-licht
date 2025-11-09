---
description: Implement codebase changes based on a plan
argument-hint: [path-to-plan]
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Build

Implement the plan specified in PATH_TO_PLAN following the implementation steps exactly.

## Variables

PATH_TO_PLAN: $ARGUMENTS

## Instructions

- IMPORTANT: If no PATH_TO_PLAN provided, ask user for the plan file path
- Read and analyze the plan thoroughly
- Implement all steps in order from top to bottom
- Do not skip steps or stop mid-implementation
- Run validation commands from the plan
- Fix any issues before completing

## Workflow

1. **Validate Input** - Ensure PATH_TO_PLAN is provided
2. **Read Plan** - Load and analyze the implementation plan
3. **Execute Steps** - Implement each step sequentially
4. **Validate Work** - Run validation commands from plan
5. **Fix Issues** - Address any problems found during validation

## Report

- Summarize completed work as bullet points
- Report files and lines changed with `git diff --stat`
- Note any deviations from the plan
