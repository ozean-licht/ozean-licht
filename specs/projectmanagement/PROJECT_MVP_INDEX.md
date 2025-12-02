# Project Management MVP - Documentation Index

> **Version:** 2.0 - Content Production Focus
> **Last Updated:** 2025-12-02
> **Status:** Ready for Development

---

## Overview

This documentation set defines the enhanced Project Management MVP for Ozean Licht, pivoted from a dev-focused tool (Linear-style) to a **content production management system** for spiritual education teams.

### Key Changes in v2.0

| v1.0 (Dev-Focused) | v2.0 (Content-Focused) |
|--------------------|------------------------|
| GitHub integration | Publishing schedule |
| Bug/feature tickets | Video/Article/Course content |
| Sprint velocity | Content pipeline progress |
| Code review gates | Editorial approval gates |
| Single assignee | Multi-role assignments |
| Fixed statuses | Workflow-specific statuses |

### New Features in v2.0

- **Content items** as first-class deliverables (videos, articles, courses)
- **Flexible workflows** per project type (Video Production, Course Creation)
- **Role-based assignments** (Editor, Voice Artist, Translator, Reviewer)
- **Checklists & task guides** (SOPs for content production)
- **Approval gates** before publishing
- **Multi-platform publishing** (YouTube, Website, Newsletter, Spotify)
- **Spiritual categories** (Meditation, Prayer, Healing)

---

## Documentation Map

```
specs/projectmanagement/
├── PROJECT_MVP_INDEX.md           ← You are here (navigation)
├── PROJECT_MVP_SUMMARY.md         ← Quick reference (start here)
├── ENHANCED_DATA_MODEL.md         ← Database schema (NEW in v2.0)
├── MVP_TASK_CHECKLIST.md          ← Phase-by-phase tasks (42 tasks)
├── PROJECT_MVP_ARCHITECTURE.md    ← System diagrams & data flows
├── project-management-mvp-plan.md ← Original v1.0 technical spec
└── RESEARCH_PATTERNS.md           ← Linear, @dnd-kit, react-hook-form
```

---

## Quick Navigation

### For Builders (Start Implementation)

1. **Read first:** `PROJECT_MVP_SUMMARY.md` (10 min)
   - What we're building
   - Why content-focused
   - 5-week timeline
   - Success criteria

2. **Database work:** `ENHANCED_DATA_MODEL.md` (20 min)
   - Full SQL schema for 18 new tables
   - TypeScript types
   - Seed data examples
   - Migration strategy

3. **Day-to-day tasks:** `MVP_TASK_CHECKLIST.md` (reference)
   - 42 tasks across 5 phases
   - File locations
   - Test requirements
   - Definition of done

### For Architects (Understand the System)

1. **System overview:** `PROJECT_MVP_ARCHITECTURE.md` (15 min)
   - Architecture diagrams
   - Component hierarchy
   - 5 detailed data flow diagrams
   - Error handling patterns

2. **Patterns reference:** `RESEARCH_PATTERNS.md` (10 min)
   - @dnd-kit implementation
   - react-hook-form + Zod
   - Linear best practices

---

## Document Summaries

### PROJECT_MVP_SUMMARY.md (v2.0)
**Purpose:** Quick reference for what we're building and why

**Key Sections:**
- What we're building (content production system)
- Why content-focused (not dev teams)
- 5-phase timeline (5-6 weeks)
- Feature breakdown by phase
- Success criteria
- Risk assessment

**Read time:** 10 minutes

---

### ENHANCED_DATA_MODEL.md (NEW in v2.0)
**Purpose:** Complete database schema for content production

**Key Sections:**
- Phase 1 tables: workflows, content types, content items, roles, assignments, checklists
- Phase 2 tables: categories, labels, approvals, publishing schedule
- Phase 3 tables: translations, cycles, custom views
- TypeScript interfaces
- API endpoint list
- Migration strategy

**Tables defined:** 18 new tables
**Read time:** 20 minutes

---

### MVP_TASK_CHECKLIST.md (v2.0)
**Purpose:** Day-by-day implementation checklist

**Phases:**
- Phase 1: Database & APIs (7-8 days)
- Phase 2: Content & Workflow Components (6-7 days)
- Phase 3: Kanban Integration (6-7 days)
- Phase 4: Approvals & Publishing (5-6 days)
- Phase 5: Polish & Testing (4-5 days)

**Total tasks:** 42 tasks
**Read time:** Reference throughout development

---

### PROJECT_MVP_ARCHITECTURE.md (v2.0)
**Purpose:** System architecture and data flows

**Key Sections:**
- System architecture diagram
- Content production pipeline flow
- Component hierarchy (3 pages, 15+ components)
- 5 detailed data flow diagrams
- State management
- Error handling
- Performance targets

**Read time:** 15 minutes

---

### RESEARCH_PATTERNS.md
**Purpose:** Implementation patterns from research

**Key Sections:**
- Linear UI/UX patterns
- @dnd-kit drag-and-drop
- react-hook-form + Zod forms

**Read time:** 10 minutes

---

### project-management-mvp-plan.md (v1.0)
**Purpose:** Original technical specification

**Note:** This is the original v1.0 spec (dev-focused). Refer to v2.0 documents for the enhanced content-focused approach.

---

## Phase Overview

### Phase 1: Database & APIs (Week 1-2)
**Goal:** Create new tables and API endpoints

| Task | Size | Key Files |
|------|------|-----------|
| Database migrations | L | `/lib/db/migrations/` |
| Seed reference data | M | `/lib/db/seeds/` |
| Workflow API | M | `/app/api/workflows/` |
| Content Types API | S | `/app/api/content-types/` |
| Content Items API | L | `/app/api/content-items/` |
| Project Roles API | S | `/app/api/roles/` |
| Task Assignments API | M | `/app/api/tasks/{id}/assignments/` |
| Checklists API | M | `/app/api/tasks/{id}/checklists/` |

### Phase 2: Components (Week 2-3)
**Goal:** Build content production UI components

| Component | Size | Purpose |
|-----------|------|---------|
| ContentTypeSelector | M | Select video, blog, course |
| WorkflowStatusPicker | M | Dynamic status per workflow |
| ContentItemCard | M | Display deliverable |
| RoleAssignmentPicker | L | Assign user + role |
| ChecklistEditor | L | Manage checklist items |
| TaskGuidePanel | M | Display SOP |
| Enhanced TaskForm | L | Add content & roles |
| Enhanced ProjectForm | M | Add workflow selector |

### Phase 3: Integration (Week 3-4)
**Goal:** Connect components to real data

| Task | Size | Purpose |
|------|------|---------|
| Kanban real data | L | Remove mock data |
| Kanban drag-drop | L | @dnd-kit integration |
| Project detail content | M | Content items section |
| Task detail enhancements | M | Roles, checklists inline |
| CreateTaskModal update | M | Include content type |

### Phase 4: Approvals & Publishing (Week 4-5)
**Goal:** Add approval gates and scheduling

| Task | Size | Purpose |
|------|------|---------|
| Categories API | M | Spiritual categories |
| CategoryPicker | M | Hierarchical picker |
| Labels API | M | Tag management |
| LabelManager | M | CRUD labels |
| Approvals API | M | Sign-off gates |
| ApprovalGate | M | Review & approve UI |
| Publishing Schedule API | M | Multi-platform |
| PublishingScheduler | M | Calendar scheduling |

### Phase 5: Polish (Week 5-6)
**Goal:** Testing, validation, documentation

| Task | Size | Purpose |
|------|------|---------|
| Form validation | M | Zod schemas |
| Loading states | M | Skeletons, disabled |
| Activity log | M | Real events |
| Testing | L | Unit + E2E |
| Documentation | S | API docs, README |

---

## Quick Start for Builder

```bash
# 1. Read the summary
cat specs/projectmanagement/PROJECT_MVP_SUMMARY.md

# 2. Review the enhanced data model
cat specs/projectmanagement/ENHANCED_DATA_MODEL.md

# 3. Check existing database code
cat apps/admin/lib/db/projects.ts
cat apps/admin/lib/db/tasks.ts

# 4. Start with Phase 1.1 - Database Migrations
# Create migration files per ENHANCED_DATA_MODEL.md

# 5. Follow MVP_TASK_CHECKLIST.md task-by-task
```

---

## Dependencies to Add

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

Install: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @hookform/resolvers react-hook-form zod`

---

## Critical Path

```
Phase 1.1 (Database Migrations)
  ↓
Phase 1.2 (Seed Data)
  ↓
Phase 1.3-1.8 (APIs) [can parallelize]
  ↓
Phase 2 (Components) [can start after 1.3]
  ↓
Phase 3 (Integration) [must wait for Phase 2]
  ↓
Phase 4 (Approvals & Publishing)
  ↓
Phase 5 (Polish & Testing)
```

**Bottleneck:** Phase 1.1 (migrations) must complete first

---

## Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Admin Dashboard Guide | `apps/admin/.claude/CLAUDE.md` | Patterns, RBAC, auth |
| Projects Structure | `apps/admin/app/dashboard/tools/projects/README.md` | Current implementation |
| Design System | `/design-system.md` | Colors, typography, effects |
| Component Library | `shared/ui/component-index.json` | Available 105 components |
| Types | `apps/admin/types/projects.ts` | Existing types (extend) |

---

## Success Criteria

### Must Have (MVP Complete)
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

### Nice to Have (Post-MVP)
- [ ] Translation workflow
- [ ] Cycles/Sprints
- [ ] Custom Views
- [ ] Keyboard shortcuts (Cmd+K)
- [ ] Metrics/velocity

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-30 | Initial MVP spec (dev-focused) |
| 2.0 | 2025-12-02 | Pivot to content production focus |

**v2.0 Major Changes:**
- Added 18 new database tables
- Added content items as first-class entities
- Added flexible workflow statuses
- Added role-based multi-assignments
- Added checklists and task guides
- Added approval gates
- Added publishing schedule
- Added spiritual categories
- Updated all components for content focus
- Increased timeline from 4-5 weeks to 5-6 weeks
- Increased tasks from 30 to 42

---

## How to Use This Index

1. **First time?** Read this document, then `PROJECT_MVP_SUMMARY.md`
2. **Starting development?** Go to `MVP_TASK_CHECKLIST.md` Phase 1.1
3. **Need database schema?** See `ENHANCED_DATA_MODEL.md`
4. **Understanding architecture?** See `PROJECT_MVP_ARCHITECTURE.md`
5. **Implementing drag-drop?** See `RESEARCH_PATTERNS.md`

---

**Status:** Ready for Development
**Next Step:** Begin Phase 1.1 (Database Migrations)
