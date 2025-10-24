# Document Feature

Generate concise markdown documentation for implemented features by analyzing code changes and specifications. This command creates documentation in the appropriate project's `app_docs/` directory based on git diff analysis against the main branch and the original feature specification.

## Variables

adw_id: $1
spec_path: $2 if provided, otherwise leave it blank
documentation_screenshots_dir: $3 if provided, otherwise leave it blank

## Instructions

### 1. Detect Project and Set Documentation Path
- Run `git diff origin/main --name-only` to see which files were changed
- Analyze the changed files to determine which project was modified:
  - If most changes are in `projects/admin/` → use `projects/admin/app_docs/`
  - If most changes are in `projects/kids-ascension/` → use `projects/kids-ascension/app_docs/`
  - If most changes are in `projects/ozean-licht/` → use `projects/ozean-licht/app_docs/`
  - If unclear or changes are outside projects/ → default to `projects/admin/app_docs/`
- Store the detected path as `DOCS_PATH` for use in subsequent steps

### 2. Analyze Changes
- Run `git diff origin/main --stat` to see files changed and lines modified
- Run `git diff origin/main --name-only` to get the list of changed files
- For significant changes (>50 lines), run `git diff origin/main <file>` on specific files to understand the implementation details

### 3. Read Specification (if provided)
- If `spec_path` is provided, read the specification file to understand:
  - Original requirements and goals
  - Expected functionality
  - Success criteria
- Use this to frame the documentation around what was requested vs what was built

### 4. Analyze and Copy Screenshots (if provided)
- If `documentation_screenshots_dir` is provided, list and examine screenshots
- Create `{DOCS_PATH}/assets/` directory if it doesn't exist
- Copy all screenshot files (*.png) from `documentation_screenshots_dir` to `{DOCS_PATH}/assets/`
  - Preserve original filenames
  - Use `cp` command to copy files
- Use visual context to better describe UI changes or visual features
- Reference screenshots in documentation using relative paths (e.g., `assets/screenshot-name.png`)

### 5. Generate Documentation
- Create a new documentation file in `{DOCS_PATH}/features/` directory
- Filename format: `{descriptive-name}.md` (without adw_id prefix for cleaner names)
  - Replace `{descriptive-name}` with a short feature name (e.g., "user-auth", "data-export", "search-ui")
- Follow the Documentation Format below
- Focus on:
  - What was built (based on git diff)
  - How it works (technical implementation)
  - How to use it (user perspective)
  - Any configuration or setup required

### 6. Update Conditional Documentation
- After creating the documentation file, read `.claude/commands/conditional_docs.md`
- Add an entry for the new documentation file with appropriate conditions
- Use the full project-scoped path (e.g., `projects/admin/app_docs/features/feature-name.md`)
- The entry should help future developers know when to read this documentation
- Format the entry following the existing pattern in the file

### 7. Final Output
- When you finish writing the documentation and updating conditional_docs.md, return exclusively the path to the documentation file created and nothing else
- The path should be relative to the repository root (e.g., `projects/admin/app_docs/features/feature-name.md`)

## Documentation Format

```md
# <Feature Title>

**ADW ID:** <adw_id>
**Date:** <current date>
**Specification:** <spec_path or "N/A">

## Overview

<2-3 sentence summary of what was built and why>

## Screenshots

<If documentation_screenshots_dir was provided and screenshots were copied>

![<Description>](assets/<screenshot-filename.png>)

## What Was Built

<List the main components/features implemented based on the git diff analysis>

- <Component/feature 1>
- <Component/feature 2>
- <etc>

## Technical Implementation

### Files Modified

<List key files changed with brief description of changes>

- `<file_path>`: <what was changed/added>
- `<file_path>`: <what was changed/added>

### Key Changes

<Describe the most important technical changes in 3-5 bullet points>

## How to Use

<Step-by-step instructions for using the new feature>

1. <Step 1>
2. <Step 2>
3. <etc>

## Configuration

<Any configuration options, environment variables, or settings>

## Testing

<Brief description of how to test the feature>

## Notes

<Any additional context, limitations, or future considerations>
```

## Conditional Docs Entry Format

After creating the documentation, add this entry to `.claude/commands/conditional_docs.md`:

```md
- projects/{project}/app_docs/features/<your_documentation_file>.md
  - Conditions:
    - When working with <feature area>
    - When implementing <related functionality>
    - When troubleshooting <specific issues>
```

Example:
```md
- projects/admin/app_docs/features/user-authentication.md
  - Conditions:
    - When working with admin user authentication
    - When implementing role-based access control
    - When troubleshooting admin login issues
```

## Report

- IMPORTANT: Return exclusively the path to the documentation file created and nothing else.