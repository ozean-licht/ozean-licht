# Prime Admin

Load admin dashboard context for fast session start.

## Read

Read these files to understand admin context:

1. `/apps/admin/README.md` - Admin dashboard overview
2. `/apps/admin/.claude/CLAUDE.md` - Agent patterns and invariants
3. `/design-system.md` - Official design system (colors, typography, effects)
4. `/shared/ui/component-index.json` - Available UI components (105 total)

## Current Focus: Project Management

If working on project management, also read:
5. `/apps/admin/app/dashboard/tools/projects/README.md` - Project management context map
6. `/apps/admin/types/projects.ts` - Project/Task/Template type definitions

## Report

Summarize:
1. Admin dashboard structure and patterns
2. Design system tokens (primary color, fonts, glass effects)
3. Available shared UI components by tier
4. Current focus area status

## Quick Reference

### Design Tokens
- Primary: `#0ec2bc` (turquoise)
- Background: `#00070F` (deep ocean)
- Card: `#00111A`
- Text: `#C4C8D4` (paragraphs), `#FFFFFF` (headings)

### Component Tiers
- **CossUI** (48): Form controls, layout, feedback, overlay
- **ShadCN** (14): Calendar, Chart, Command, Drawer
- **Branded** (28): CourseCard, Logo, AppSidebar, LightRays
- **Storage** (13): FileBrowser, FileDropzone, BucketSelector

### Fonts
- `font-decorative`: Cinzel Decorative (H1, H2 only)
- `font-sans`: Montserrat (main font)
- `font-alt`: Montserrat Alternates (labels)
