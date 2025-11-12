# Component Catalog

**Version:** 1.0.0
**Last Updated:** 2025-11-12
**Total Components Documented:** 14

---

## Overview

This catalog lists all components documented in Storybook, categorized by type, with their current status, usage guidelines, and maturity level.

**Quick Stats:**
- ✅ **Documented:** 14 components
- 📦 **Total in Codebase:** ~60 components
- 📊 **Coverage:** ~23%
- 🎯 **Target:** 100% coverage by Phase 5

---

## Table of Contents

1. [Form Components](#form-components)
2. [Feedback Components](#feedback-components)
3. [Layout Components](#layout-components)
4. [Navigation Components](#navigation-components)
5. [Overlay Components](#overlay-components)
6. [Data Display Components](#data-display-components)
7. [Component Maturity Levels](#component-maturity-levels)
8. [Adding New Components](#adding-new-components)

---

## Form Components

Components for user input and forms.

### Button
**Path:** `shared/ui-components/src/components/Button.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** Very High
**Last Updated:** 2025-11-10

**Variants:**
- Primary (CTA)
- Secondary
- Ghost
- Outline
- Destructive
- Link

**Sizes:** sm, md, lg, icon
**States:** Default, Hover, Active, Disabled, Loading

**Use Cases:**
- Primary actions (submit, confirm)
- Secondary actions (cancel, back)
- Navigation links
- Destructive actions (delete, remove)

**Documentation:** Complete ✅
- 17 story variants
- All sizes and states covered
- Accessibility tested
- Real-world examples included

---

### Input
**Path:** `shared/ui-components/src/components/Input.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** Very High
**Last Updated:** 2025-11-10

**Types:**
- Text
- Email
- Password
- Number
- URL
- Tel
- Search

**Features:**
- Icon support (before/after)
- Label integration
- Error states
- Required indicator
- Help text

**Use Cases:**
- Form fields
- Search bars
- Data entry
- Filters

**Documentation:** Complete ✅
- 15 story variants
- All input types covered
- Label and error examples
- Icon integration shown

---

### Select
**Path:** `shared/ui-components/src/components/Select.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** High
**Last Updated:** 2025-11-10

**Features:**
- Array format options
- Children format options
- Optgroup support
- Label integration
- Error states
- Help text

**Sizes:** sm, md, lg

**Use Cases:**
- Dropdown selection
- Form fields
- Filters
- Navigation

**Documentation:** Complete ✅
- 14 story variants
- Multiple option formats
- Size variants
- Real-world examples (country selector)

---

### Textarea
**Path:** `shared/ui-components/src/ui/textarea.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** Medium
**Last Updated:** 2025-11-11

**Features:**
- Auto-resize support
- Character count
- Label integration
- Error states
- Placeholder text

**Use Cases:**
- Multi-line text input
- Comments
- Messages
- Descriptions

**Documentation:** Complete ✅
- Multiple size variants
- Error states
- Label integration

---

### Checkbox
**Path:** `shared/ui-components/src/ui/checkbox.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** High
**Last Updated:** 2025-11-11

**Features:**
- Checked state
- Indeterminate state
- Disabled state
- Label integration

**Use Cases:**
- Form options
- Multi-select
- Settings toggles
- Agreement checkboxes

**Documentation:** Complete ✅
- 7 story variants
- All states covered
- Label integration
- Accessibility tested

---

### Radio Group
**Path:** `shared/ui-components/src/ui/radio-group.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** High
**Last Updated:** 2025-11-11

**Features:**
- Single selection
- Disabled state
- Label integration
- Orientation (vertical/horizontal)

**Use Cases:**
- Mutually exclusive options
- Settings
- Surveys
- Wizards

**Documentation:** Complete ✅
- 10 story variants
- Vertical and horizontal layouts
- Disabled states
- Real-world examples

---

## Feedback Components

Components for providing user feedback.

### Alert
**Path:** `shared/ui-components/src/ui/alert.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** High
**Last Updated:** 2025-11-11

**Variants:**
- Default
- Destructive
- Success (custom)
- Warning (custom)
- Info (custom)

**Features:**
- Icon support
- Title and description
- Dismissable (customizable)
- Semantic role="alert"

**Use Cases:**
- Error messages
- Success feedback
- Warnings
- Information notices
- System notifications

**Documentation:** Complete ✅
- 9 story variants
- All semantic types
- With/without icons
- Real-world examples

---

### Badge
**Path:** `shared/ui-components/src/components/Badge.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** Very High
**Last Updated:** 2025-11-10

**Variants:**
- Default
- Success
- Warning
- Destructive
- Info
- Outline
- Gradient

**Sizes:** sm, md, lg

**Features:**
- Dot indicator
- Icon support
- Glow effects

**Use Cases:**
- Status indicators
- Tags
- Categories
- Notifications
- Counts

**Documentation:** Complete ✅
- 17 story variants
- All colors and sizes
- Special effects (glow, gradient)
- Collection examples

---

### Tooltip
**Path:** `shared/ui-components/src/ui/tooltip.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** High
**Last Updated:** 2025-11-11

**Features:**
- Multiple positions (top, right, bottom, left)
- Auto-positioning
- Delay customization
- Accessible with ARIA

**Use Cases:**
- Additional information
- Help text
- Icon labels
- Truncated text

**Documentation:** Complete ✅
- 9 story variants
- All positions
- Delay examples
- Icon integration

---

## Layout Components

Components for structuring content.

### Card
**Path:** `shared/ui-components/src/components/Card.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** Very High
**Last Updated:** 2025-11-10

**Variants:**
- Default
- Strong
- Subtle
- Solid

**Features:**
- Header, Body, Footer sections
- Hover effects
- Glow effects
- Glass morphism

**Use Cases:**
- Content containers
- Dashboard widgets
- List items
- Feature showcases

**Documentation:** Complete ✅
- 11 story variants
- All visual variants
- Complete card anatomy
- Interactive effects

---

### Accordion
**Path:** `shared/ui-components/src/ui/accordion.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** Medium
**Last Updated:** 2025-11-11

**Features:**
- Single or multiple open
- Collapsible sections
- Icon indicators
- Keyboard navigation

**Use Cases:**
- FAQs
- Settings panels
- Expandable lists
- Navigation menus

**Documentation:** Complete ✅
- 8 story variants
- Single and multiple modes
- Keyboard navigation tested
- Real-world FAQ example

---

### Tabs
**Path:** `shared/ui-components/src/ui/tabs.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** High
**Last Updated:** 2025-11-11

**Features:**
- Multiple tab panels
- Keyboard navigation
- Active state indicator
- Accessible with ARIA

**Use Cases:**
- Content organization
- Settings screens
- Dashboard views
- Multi-step forms

**Documentation:** Complete ✅
- 12 story variants
- Multiple tab examples
- Keyboard navigation
- Icon integration

---

## Overlay Components

Components that overlay content.

### Dialog
**Path:** `shared/ui-components/src/ui/dialog.stories.tsx`
**Maturity:** ✅ Stable
**Usage Frequency:** High
**Last Updated:** 2025-11-11

**Features:**
- Modal overlay
- Close on backdrop click
- Close on Escape key
- Focus management
- Accessible with ARIA

**Sizes:** sm, md, lg, full

**Use Cases:**
- Confirmations
- Forms
- Details view
- Alerts

**Documentation:** Complete ✅
- 8 story variants
- All sizes
- Header, body, footer sections
- Accessibility tested

---

## Data Display Components

### Not Yet Documented

The following components exist in the codebase but don't have stories yet:

**High Priority:**
- Table
- DataTable
- Skeleton
- Avatar
- Progress
- Spinner

**Medium Priority:**
- Label
- Separator
- Breadcrumb
- Pagination
- Calendar
- Command

**Low Priority:**
- AspectRatio
- ScrollArea
- Sheet
- Popover
- ContextMenu
- HoverCard
- Menubar
- NavigationMenu
- DropdownMenu
- Toast/Toaster
- Slider
- Switch
- Toggle
- ToggleGroup

---

## Component Maturity Levels

### ✅ Stable
**Definition:** Production-ready, fully tested, well-documented
**Count:** 14 components
**Criteria:**
- All variants documented
- Accessibility tested (no critical/serious violations)
- Real-world examples provided
- Used in production

**Components:**
- Button, Input, Select, Checkbox, Radio Group, Textarea
- Alert, Badge, Tooltip
- Card, Accordion, Tabs
- Dialog

### 🚧 Beta
**Definition:** Functional but may have minor issues or incomplete documentation
**Count:** 0 components
**Criteria:**
- Basic documentation exists
- Core functionality works
- May have minor A11y issues
- Limited real-world usage

**Components:** None currently

### 🆕 Alpha
**Definition:** Recently added, experimental, limited testing
**Count:** 0 components
**Criteria:**
- Minimal documentation
- Core concept proven
- Not recommended for production
- Breaking changes possible

**Components:** None currently

### ⚠️ Deprecated
**Definition:** Scheduled for removal, use alternatives
**Count:** 0 components
**Criteria:**
- Marked for removal
- Better alternative exists
- Migration path documented
- Removal date set

**Components:** None currently

---

## Usage Frequency

### Very High (Daily Use)
Components used extensively across the application:
- Button
- Input
- Badge
- Card

### High (Multiple Times Per Week)
Frequently used components:
- Select
- Checkbox
- Radio Group
- Alert
- Tabs
- Dialog
- Tooltip

### Medium (Weekly)
Regularly used but not constantly:
- Textarea
- Accordion

### Low (Occasional)
Used for specific features:
- None currently documented

---

## Quick Reference

### Form Building
- Text input: `Input`
- Selection: `Select`, `Radio Group`, `Checkbox`
- Multi-line: `Textarea`
- Submit: `Button`

### Feedback
- Notifications: `Alert`, `Toast` (not yet documented)
- Status: `Badge`
- Help: `Tooltip`
- Loading: `Spinner`, `Skeleton` (not yet documented)

### Layout
- Containers: `Card`
- Organization: `Tabs`, `Accordion`
- Overlays: `Dialog`

### Actions
- Buttons: `Button`
- Toggles: `Switch` (not yet documented), `Checkbox`

---

## Adding New Components

### Process

1. **Create component** in appropriate directory
2. **Generate story** using template:
   ```bash
   npm run generate-story ComponentName
   ```
3. **Document thoroughly** (see CONTRIBUTING.md)
4. **Test accessibility** (A11y addon)
5. **Add to this catalog** in appropriate category
6. **Update coverage metrics** at top of file

### Categorization Guidelines

**Form Components:** User input, data entry
**Feedback Components:** Messages, notifications, status
**Layout Components:** Structure, organization
**Navigation Components:** Movement between views
**Overlay Components:** Modal, popover, tooltip
**Data Display Components:** Tables, lists, charts

---

## Coverage Roadmap

### Phase 4 (Current): 14 components (23%)
✅ Core form components
✅ Basic feedback components
✅ Essential layout components

### Phase 5 (Next): +20 components (56%)
🎯 Data display components (Table, Skeleton, Avatar)
🎯 Additional overlays (Popover, Sheet, Toast)
🎯 Navigation components (Breadcrumb, Pagination)

### Phase 6 (Future): +26 components (100%)
🎯 Advanced components (Calendar, Command)
🎯 Specialized inputs (Slider, Switch)
🎯 Admin-specific components

---

## Questions?

- **Can't find a component?** Check if it exists in codebase but lacks story
- **Component not working?** See STORYBOOK_RUNBOOK.md troubleshooting
- **Want to add component?** Follow STORYBOOK_CONTRIBUTING.md guide
- **Need help?** Ask in #storybook-help Slack channel

---

**Maintained By:** Frontend Team Lead
**Last Updated:** 2025-11-12
**Next Update:** After adding 5+ new components
