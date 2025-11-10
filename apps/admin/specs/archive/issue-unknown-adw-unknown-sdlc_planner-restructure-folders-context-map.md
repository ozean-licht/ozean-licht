# Chore: Restructure Folder Organization and Create Context Map

## Metadata
issue_number: `N/A (Direct command execution)`
adw_id: `N/A (Direct command execution)`
issue_json: `{"title": "Enhance and optimize folder structure", "body": "Projects are misleading -> Apps with Backend and Frontend are cleaner. Try to prepare yourself to craft a Context Map as a single source of truth. With Chapters like 224-312:MCP_Gateway -> So every agent can navigate fast and reliable."}`

## Chore Description

This chore involves two major improvements to the codebase organization:

1. **Rename "projects/" to "apps/"** - The current `projects/` directory is misleading because it contains actual applications (admin, kids-ascension, ozean-licht) rather than traditional "projects". Renaming to `apps/` provides clearer semantic meaning and aligns with modern monorepo conventions (Nx, Turborepo, Rush).

2. **Create Context Map** - Develop a single source of truth navigation document (`CONTEXT_MAP.md`) that provides line-number-based navigation for agents. This will include chapters with line ranges (e.g., `224-312:MCP_Gateway`) to enable fast, reliable navigation without needing to search or glob through files repeatedly.

### Goals:
- Improve semantic clarity of directory structure
- Reduce confusion for developers and AI agents
- Create deterministic navigation system for autonomous agents
- Minimize context loading by providing precise file locations
- Establish foundation for scaling to more applications

### Leveraged Best Practices from Memory:
- Pattern: TypeScript types for multi-tenant architecture
- Optimization: Connection pooling strategies
- Best Practice: Database migration strategy with transactions

## Relevant Files

### Files to Modify:

- **`README.md`** - Update all references from `projects/` to `apps/`, update repository structure diagram
  - Contains primary documentation and quick start guides
  - Referenced 14 times with hardcoded `projects/` paths

- **`CLAUDE.md`** - Update all references from `projects/` to `apps/`, update monorepo structure documentation
  - Core agent instruction file
  - Contains repository structure patterns and examples

- **`docs/architecture.md`** - Update architecture diagrams and path references
  - Complete system architecture documentation
  - Contains database migration paths and deployment configurations

- **`adws/README.md`** - Update any references to projects directory
  - ADW workflow documentation
  - May reference output paths in `projects/` subdirectories

- **All `.claude/commands/*.md` files** - Search and replace any hardcoded `projects/` references
  - 29 slash command files
  - May contain path references in examples or instructions

- **`adws/adw_modules/*.py`** - Update any hardcoded paths in Python workflow modules
  - 11 core module files
  - May contain path construction logic

- **All `adws/adw_*.py` files** - Update path references in workflow scripts
  - 13 isolated workflow scripts
  - May reference `projects/admin/specs/` or other project paths

- **`package.json`** (root) - Add workspace pattern for `apps/**` if using pnpm workspaces

- **`.gitignore`** - Update any project-specific ignore patterns if needed

### New Files:

- **`CONTEXT_MAP.md`** (root) - New single source of truth navigation document
  - Structure: Hierarchical chapters with line ranges
  - Format: `Lines XXX-YYY: Chapter Name`
  - Content: All major codebase sections with precise navigation
  - Purpose: Enable agents to quickly locate code without search

- **`apps/APPS_README.md`** - Overview of applications directory structure
  - Explain the apps/ organization
  - List all applications with their purposes
  - Provide quick navigation to each app

### Directories to Rename:

- **`projects/` → `apps/`** - Main directory rename
  - Contains: admin/, kids-ascension/, ozean-licht/, event-calendar/, video-translator/
  - Must preserve git history
  - Must update all symbolic links if any exist

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Pre-rename Audit and Backup
- Create a comprehensive list of all files containing `projects/` string references
- Run `grep -r "projects/" . --include="*.md" --include="*.py" --include="*.json" --include="*.yaml" --include="*.yml" > /tmp/projects-refs.txt`
- Count total occurrences to validate completeness later
- Document current directory structure with `tree -L 3 projects/ > /tmp/pre-rename-structure.txt`
- Verify no active worktrees are using the projects/ path: `git worktree list`

### Step 2: Rename Directory with Git
- Use git mv to preserve history: `git mv projects apps`
- Verify rename succeeded: `ls -la apps/`
- Check git status to confirm staging: `git status`
- Do NOT commit yet - we'll commit after updating all references

### Step 3: Update Root Documentation Files
- Update `README.md`:
  - Replace all `projects/` with `apps/`
  - Update repository structure diagram (line ~122-150)
  - Update project links (line ~216-246)
  - Update command examples that reference apps
- Update `CLAUDE.md`:
  - Replace all `projects/` with `apps/`
  - Update Project Structure Patterns section
  - Update documentation file paths in "Critical Files for Context"
  - Update Step 5 in `### Step 1: Planning` (line ~5)
- Update `docs/architecture.md`:
  - Replace all `projects/` with `apps/`
  - Update monorepo structure diagrams
  - Update deployment configuration examples

### Step 4: Update ADW Documentation
- Update `adws/README.md`:
  - Search for `projects/` references
  - Replace with `apps/` where found
  - Update any workflow output path examples

### Step 5: Update Slash Commands
- Update `.claude/commands/chore.md`:
  - Change plan output directory: `projects/admin/specs/` → `apps/admin/specs/`
  - Update Relevant Files section examples
- Update `.claude/commands/bug.md`:
  - Same changes as chore.md
- Update `.claude/commands/feature.md`:
  - Same changes as chore.md
- Update `.claude/commands/document.md`:
  - Update output path from `projects/{project}/app_docs/features/` to `apps/{app}/app_docs/features/`
- Update `.claude/commands/conditional_docs.md`:
  - Update all documentation paths from `projects/admin/app_docs/` to `apps/admin/app_docs/`
- Review all other command files for any `projects/` references

### Step 6: Update ADW Python Scripts
- Update `adws/adw_modules/workflow_ops.py`:
  - Search for any hardcoded `projects/` path construction
  - Replace with `apps/`
- Update all `adws/adw_*.py` workflow scripts:
  - Use grep to find any `projects/` references
  - Update plan file path construction if needed
  - Update spec directory references
- Update `adws/adw_modules/utils.py`:
  - Check for path utilities that might reference projects/

### Step 7: Update Package Configuration
- Check if `package.json` uses workspace patterns
- If using pnpm workspaces, verify workspaces pattern includes both `projects/**` and `apps/**` temporarily
- Add `apps/**` pattern to workspaces array
- Plan to remove `projects/**` after migration completes

### Step 8: Create CONTEXT_MAP.md
- Create comprehensive navigation document at repository root
- Structure with hierarchical chapters:
  ```markdown
  # Context Map - Ozean Licht Ecosystem

  Lines 1-100: Repository Overview & Quick Start
  Lines 101-250: Apps Directory Structure
    Lines 101-150: Admin Dashboard
    Lines 151-200: Kids Ascension
    Lines 201-250: Ozean Licht
  Lines 251-400: Infrastructure
    Lines 251-310: MCP Gateway
    Lines 311-350: Coolify Configuration
    Lines 351-400: Docker & Services
  Lines 401-550: Autonomous Development Workflows (ADW)
    Lines 401-450: Core Modules
    Lines 451-500: Workflow Scripts
    Lines 501-550: Triggers & Automation
  Lines 551-650: Shared Libraries
  Lines 651-750: Documentation
  Lines 751-850: Configuration Files
  ```
- For each chapter, include:
  - Precise line range
  - Chapter title and description
  - Key files with their purposes
  - Common operations for that section
- Target: Enable agents to jump directly to relevant code sections

### Step 9: Create apps/APPS_README.md
- Document the apps/ directory structure
- Explain the semantic difference from "projects"
- List all applications:
  - `admin/` - Unified admin dashboard (NextAuth + MCP)
  - `kids-ascension/` - Educational video platform
  - `ozean-licht/` - Content platform for courses
  - `event-calendar/` - Shared event management
  - `video-translator/` - Video translation service
- Provide navigation links to each app's README
- Explain relationship to monorepo structure

### Step 10: Update Conditional Documentation References
- Update `.claude/commands/conditional_docs.md`:
  - Change all `projects/admin/app_docs/` to `apps/admin/app_docs/`
  - Ensure documentation conditions still apply correctly

### Step 11: Verify All Changes
- Run comprehensive grep to find any remaining `projects/` references:
  ```bash
  grep -r "projects/" . \
    --include="*.md" \
    --include="*.py" \
    --include="*.json" \
    --include="*.yaml" \
    --include="*.yml" \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=trees \
    --exclude-dir=agents
  ```
- Compare count with pre-rename audit
- Manually review any remaining references to determine if intentional
- Check that all workspace references work correctly

### Step 12: Git Commit
- Stage all modified files: `git add .`
- Commit with descriptive message:
  ```
  chore: restructure projects/ to apps/ and add context map

  - Rename projects/ directory to apps/ for semantic clarity
  - Update all documentation references (README, CLAUDE.md, architecture)
  - Update ADW workflow scripts and slash commands
  - Create CONTEXT_MAP.md for deterministic agent navigation
  - Create apps/APPS_README.md to document application structure
  - Preserve git history through git mv

  This improves codebase navigation and aligns with monorepo conventions.
  ```

### Step 13: Validation Commands
- Run all validation commands (see section below)

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `git status` - Verify all changes are committed
- `ls -la apps/` - Confirm apps directory exists with all applications
- `ls -la projects/ 2>/dev/null || echo "projects/ successfully removed"` - Confirm projects/ no longer exists
- `grep -r "projects/" README.md CLAUDE.md docs/architecture.md adws/ .claude/commands/ --include="*.md" --include="*.py" | wc -l` - Should return 0 or only intentional references
- `test -f CONTEXT_MAP.md && echo "CONTEXT_MAP.md created" || echo "ERROR: CONTEXT_MAP.md missing"` - Verify context map exists
- `test -f apps/APPS_README.md && echo "apps/APPS_README.md created" || echo "ERROR: apps/APPS_README.md missing"` - Verify apps readme exists
- `git log --follow apps/admin/package.json` - Verify git history preserved through rename
- `pnpm install` - Verify package manager still works with new structure
- `pnpm --filter @admin/dashboard build || echo "Admin build check (may fail if deps missing)"` - Test workspace references

## Notes

### Why "apps/" instead of "projects/"?

1. **Semantic Accuracy**: These are deployed applications, not development projects
2. **Industry Convention**: Nx, Turborepo, Rush all use `apps/` for applications
3. **Clear Distinction**: `apps/` clearly indicates runnable applications vs shared packages
4. **Reduces Confusion**: "Project" is overloaded (GitHub projects, project management, etc.)

### Context Map Benefits

The `CONTEXT_MAP.md` provides several key advantages:

1. **Deterministic Navigation**: Agents can jump directly to line ranges instead of searching
2. **Reduced API Calls**: Fewer grep/glob operations needed
3. **Faster Onboarding**: New agents understand structure immediately
4. **Consistent Mental Model**: All agents use the same navigation structure
5. **Scalability**: Easy to extend as codebase grows

### Migration Safety

- Using `git mv` preserves full file history and blame
- All references are updated simultaneously to prevent broken links
- Validation commands ensure completeness
- Can be rolled back with `git revert` if issues arise

### Future Enhancements

After this chore, consider:
- Adding line number comments in CONTEXT_MAP.md for key functions
- Creating app-specific context maps in each app's directory
- Implementing automated context map updates via pre-commit hooks
- Adding visual diagrams to context map for complex relationships
