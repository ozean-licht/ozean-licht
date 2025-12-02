# Project Management MVP - Quick Summary

> **Version:** 2.0 - Content Production Focus
> **Date:** 2025-12-02
> **Status:** Ready for Development

## What We're Building

A **content production management system** for Ozean Licht's spiritual education teams that allows:

- Create and manage **content deliverables** (videos, courses, articles, meditations)
- Move content through **flexible workflows** (Script → Recording → Editing → Review → Publish)
- Assign work with **role-based assignments** (Editor, Translator, Voice Artist, Reviewer)
- Track progress with **checklists and task guides**
- Manage **multi-language content** with translation workflows
- Schedule **publishing** to multiple platforms (YouTube, Website, Newsletter)

## Why This Matters (Key Differences from Dev Tools)

| Linear/Jira (Dev-Focused) | Ozean Licht (Content-Focused) |
|---------------------------|-------------------------------|
| GitHub PR integration | Publishing schedule |
| Bug/feature tickets | Video/Article/Course content |
| Sprint velocity metrics | Content pipeline progress |
| Code review gates | Editorial approval gates |
| Single assignee | Multi-role assignments |
| Fixed statuses | Workflow-specific statuses |

**Current Gaps Being Addressed:**
- ProjectsDashboard shows stats (OK)
- TasksKanban uses mock data (need real data)
- No content deliverables linked to tasks (missing)
- No flexible workflows per project type (missing)
- No role-based assignments (missing)
- No checklists or SOPs (missing)
- No approval gates (missing)
- No publishing schedule (missing)

## Timeline: 5-6 Weeks

```
Week 1-2 (7-8 days):  Database migrations + Core APIs
Week 2-3 (6-7 days):  Content & Workflow components
Week 3-4 (6-7 days):  Kanban integration + Role assignments
Week 4-5 (5-6 days):  Checklists + Approvals + Publishing
Week 5-6 (4-5 days):  Testing, docs, polish
```

## Key Phases

### Phase 1: Foundation (Database & APIs)

**New Tables:**
- `workflow_definitions` - Different workflows per project type
- `workflow_statuses` - Flexible statuses per workflow
- `content_types` - Video, Blog, Course, Meditation, etc.
- `content_items` - The actual deliverables
- `project_roles` - Editor, Translator, Voice Artist, etc.
- `task_assignments` - Multi-role assignments
- `checklist_templates` - Reusable checklists
- `task_checklists` - Checklists on tasks
- `task_guides` - SOPs and instructions

**Files to Create:**
- `/lib/db/workflows.ts` - Workflow CRUD
- `/lib/db/content-items.ts` - Content item CRUD
- `/lib/db/roles.ts` - Role management
- `/lib/db/checklists.ts` - Checklist operations
- `/app/api/workflows/route.ts`
- `/app/api/content-items/route.ts`
- `/app/api/roles/route.ts`
- `/app/api/checklists/route.ts`

### Phase 2: Content & Workflow Components

**New Components:**
- `ContentItemCard.tsx` - Display video/article deliverable
- `ContentTypeSelector.tsx` - Pick content type
- `WorkflowStatusPicker.tsx` - Dynamic status based on workflow
- `ChecklistEditor.tsx` - Manage checklist items
- `RoleAssignmentPicker.tsx` - Assign user + role
- `TaskGuidePanel.tsx` - Display SOP

**Enhanced Components:**
- `TaskForm.tsx` - Add content item linking, workflow status
- `ProjectForm.tsx` - Add workflow selection
- `CreateTaskModal.tsx` - Include content type picker
- `TaskListItem.tsx` - Show role badges, checklist progress

### Phase 3: Integration (Connect UI to Data)

**Updates:**
- Real data in TasksKanban (no more mock)
- Drag-and-drop with workflow status transitions
- Content items displayed on task detail
- Role-based assignment UI
- Checklist completion tracking

### Phase 4: Approvals & Publishing

**New Tables:**
- `categories` - Spiritual content categorization
- `labels` - Tag management with CRUD
- `approvals` - Sign-off gates
- `publishing_schedule` - Multi-platform scheduling

**New Components:**
- `CategoryPicker.tsx` - Hierarchical category selection
- `LabelManager.tsx` - Create, edit, delete labels
- `ApprovalGate.tsx` - Review & approve UI
- `PublishingScheduler.tsx` - Schedule publish date/platform

### Phase 5: Polish (Testing & Documentation)

- Form validation
- Loading states
- Error handling
- Unit and E2E tests
- Documentation updates

## Architecture Overview

```
Content Production Pipeline:

[Script Draft] → [Review] → [Voice Recording] → [Video Edit] → [Thumbnail] → [Final Review] → [Publish]
      ↓             ↓              ↓                ↓              ↓              ↓              ↓
   Creator       Reviewer      Voice Artist      Editor       Designer       Reviewer       Publisher
      ↓             ↓              ↓                ↓              ↓              ↓              ↓
   Checklist    Approval      Checklist        Checklist     Checklist     Approval       Schedule
```

```
Database Structure:

Projects (containers)
├── Workflow (video_production, course_creation, etc.)
├── Category (meditation, prayer, healing)
├── Labels (tags)
└── Tasks (work items)
    ├── Workflow Status (dynamic per workflow)
    ├── Content Item (the deliverable)
    │   ├── Content Type (video, article, course)
    │   ├── Translations (language variants)
    │   └── Publishing Schedule (platforms, dates)
    ├── Assignments (user + role)
    │   └── Role (editor, translator, reviewer)
    ├── Checklists (from template or custom)
    └── Approvals (sign-off gates)
```

## Technical Stack

**Frontend:**
- React 18 + Next.js 14
- TypeScript
- TailwindCSS + Ozean Licht design system
- CossUI & shadcn components
- `@dnd-kit` for drag-and-drop
- `react-hook-form` + `zod` for forms

**Backend:**
- Next.js API routes
- PostgreSQL (direct connection)
- NextAuth v5 (authentication)
- Zod (validation)

**New Dependencies:**
```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "@hookform/resolvers": "^3.3.2",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.4"
}
```

## What It Enables

**Before:** "We have a project management system" (incomplete, dev-focused)

**After:** "We can manage our entire content production pipeline"

Users can:
1. Create a project with a specific workflow (Video Production)
2. Add tasks with content items attached (YouTube video)
3. Assign roles (Voice Artist: Maria, Editor: Thomas)
4. Track progress with checklists
5. Move content through workflow stages
6. Get approvals before publishing
7. Schedule multi-platform publishing
8. Track translations for each piece of content

## Success Criteria (MVP Complete When)

### Must Have (Phase 1-3)
- [ ] Content items linked to tasks
- [ ] Flexible workflow statuses per project type
- [ ] Role-based task assignments
- [ ] Checklists on tasks
- [ ] Real data in kanban (no mock)
- [ ] Drag-drop with workflow transitions

### Should Have (Phase 4)
- [ ] Categories for spiritual content
- [ ] Label management (CRUD)
- [ ] Approval gates
- [ ] Publishing schedule

### Nice to Have (Future)
- [ ] Translation workflow
- [ ] Cycles/Sprints
- [ ] Custom Views
- [ ] Keyboard shortcuts (Cmd+K)
- [ ] Metrics/velocity

## What's NOT in This MVP

These are planned for Phase 2 (post-MVP):
- Subtasks
- Time tracking
- Sprint/cycle management
- File attachments (beyond existing storage)
- @mentions in comments
- Real-time notifications
- Advanced filtering
- Bulk operations
- Archive/restore
- Recurring tasks (automated)

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Schema migration complexity | Medium | Non-breaking migrations, seed data |
| Workflow flexibility vs simplicity | Medium | Start with 3 predefined workflows |
| Role confusion | Low | Clear role definitions, UI tooltips |
| Performance with many content items | Low | Pagination, lazy loading |
| Publishing integration complexity | Medium | Start with manual URL entry, automate later |

## Related Documentation

- `/specs/projectmanagement/ENHANCED_DATA_MODEL.md` - Full database schema
- `/specs/projectmanagement/project-management-mvp-plan.md` - Original technical spec
- `/specs/projectmanagement/MVP_TASK_CHECKLIST.md` - Task breakdown
- `/specs/projectmanagement/PROJECT_MVP_ARCHITECTURE.md` - Architecture diagrams
- `apps/admin/.claude/CLAUDE.md` - Admin dashboard patterns
- `shared/ui/README.md` - Available components

---

**Version:** 2.0
**Date:** 2025-12-02
**Status:** Ready for Development
**Next Step:** Begin Phase 1 (Database migrations)
