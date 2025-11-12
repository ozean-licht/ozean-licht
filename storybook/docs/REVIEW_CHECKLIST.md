# Storybook Story Review Checklist

**Version:** 1.0.0
**Last Updated:** 2025-11-12

---

## Purpose

This checklist ensures that all component stories meet quality standards before merging to main. Use it to review your own work and when reviewing PRs.

---

## Pre-Submission Checklist

### Story Author

Before creating a PR, verify:

- [ ] **Story generator used** (or manual story follows CSF 3.0 format)
- [ ] **Local dev server runs** without errors (`npm run storybook`)
- [ ] **Production build succeeds** (`npm run build-storybook`)
- [ ] **All checkboxes below are checked** in the appropriate sections

### PR Reviewer

When reviewing a story PR:

- [ ] **All items in this checklist are verified**
- [ ] **Story meets quality bar** (see Quality Gates section)
- [ ] **No critical issues** in accessibility or functionality
- [ ] **Screenshots provided** (if visual changes)
- [ ] **Documentation updated** (if needed)

---

## 1. File Structure & Naming

### Required

- [ ] Story file named correctly: `ComponentName.stories.tsx` (PascalCase)
- [ ] Story file in correct location:
  - [ ] Shared UI: `shared/ui-components/src/components/` or `shared/ui-components/src/ui/`
  - [ ] Admin: `apps/admin/components/ui/`
  - [ ] Ozean Licht: `apps/ozean-licht/components/`
- [ ] Component import path is correct
- [ ] File uses `.tsx` extension (TypeScript + JSX)

### Naming Conventions

- [ ] Meta title follows pattern: `'Shared UI/ComponentName'` or `'Admin/ComponentName'`
- [ ] Story exports are PascalCase: `export const Default: Story`
- [ ] Story names are descriptive: `AllVariants`, not `Story2`

---

## 2. Code Format & Structure

### CSF 3.0 Format (Required)

- [ ] Uses CSF 3.0 format with `satisfies` syntax
- [ ] Has default export: `export default meta;`
- [ ] Meta object defined with `satisfies Meta<typeof Component>`
- [ ] Story type defined: `type Story = StoryObj<typeof meta>;`
- [ ] No CSF 2.0 patterns (e.g., `Component.story = {...}`)

### TypeScript

- [ ] No TypeScript errors (`npm run build-storybook` passes)
- [ ] Props are properly typed (no `any` types)
- [ ] Component import has correct type
- [ ] ArgTypes match component prop types

### Code Quality

- [ ] Code is formatted with Prettier
- [ ] No unused imports
- [ ] No console.log statements (unless intentional for demo)
- [ ] No hardcoded values that should be props/args

---

## 3. Story Coverage

### Required Stories

- [ ] **Default** story exists with common props
- [ ] **All Variants** story showcases all visual variants
- [ ] At least **3 meaningful examples** provided

### Recommended Stories

- [ ] **Sizes** story (if component has size variants)
- [ ] **States** story (disabled, loading, error, etc.)
- [ ] **Real-World Examples** story with realistic usage
- [ ] **Interactive** story (if component has interactions)

### Edge Cases

- [ ] Long text content tested
- [ ] Empty/null props tested (if applicable)
- [ ] Error states shown (if applicable)
- [ ] Loading states shown (if applicable)

---

## 4. Documentation

### Component Description

- [ ] JSDoc comment above `meta` object
- [ ] Description explains what component does
- [ ] **Features** section lists key features
- [ ] **Usage** section shows import and example
- [ ] **Accessibility** section (if relevant considerations)

### Props Documentation

- [ ] All props documented in `argTypes`
- [ ] Each prop has `description` field
- [ ] Control types are appropriate:
  - [ ] `select` for enums/options
  - [ ] `boolean` for booleans
  - [ ] `text` for strings
  - [ ] `number` for numbers
  - [ ] `object` for complex types
- [ ] Default values specified in `table.defaultValue`

### Story Descriptions

- [ ] Each story has JSDoc comment explaining its purpose
- [ ] Complex stories include usage notes
- [ ] Real-world examples explain context

---

## 5. Accessibility (A11y)

### Testing

- [ ] **Accessibility tab checked** in Storybook
- [ ] No **Critical** violations
- [ ] No **Serious** violations
- [ ] Minor violations documented (if any)

### Required Practices

- [ ] Semantic HTML used (button, not div+onClick)
- [ ] ARIA labels provided where needed
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Keyboard navigation works:
  - [ ] Tab navigates through focusable elements
  - [ ] Enter/Space activate buttons/links
  - [ ] Escape closes modals/dialogs (if applicable)
- [ ] Focus indicators visible
- [ ] Screen reader text provided (if needed)

### Interactive Components

- [ ] Interactive elements have appropriate roles
- [ ] Form inputs have labels (visible or aria-label)
- [ ] Error messages associated with inputs (aria-describedby)
- [ ] Modal/Dialog focus management correct

---

## 6. Visual & Branding

### Ozean Licht Branding

- [ ] Uses Ozean Licht color palette (see `BRANDING.md`)
  - [ ] Primary: Turquoise (#0ec2bc)
  - [ ] Background: Cosmic Dark (#0A0F1A)
  - [ ] Card: Elevated Layer (#1A1F2E)
- [ ] Uses correct typography:
  - [ ] Cinzel Decorative for H1/H2
  - [ ] Montserrat for body text
- [ ] Dark theme applied correctly
- [ ] Glass card effects used where appropriate

### Visual Quality

- [ ] Component renders correctly in all variants
- [ ] No visual glitches or overlaps
- [ ] Spacing/padding looks intentional
- [ ] Responsive behavior tested (if applicable)
- [ ] Icons are appropriate size and color

### Consistency

- [ ] Follows patterns from existing components
- [ ] Matches design system conventions
- [ ] No one-off custom styles (use tokens)

---

## 7. Interactions & Play Functions

### If Component Has Interactions

- [ ] Play function added for key interactions
- [ ] Uses `@storybook/test` utilities:
  - [ ] `within()` to scope queries
  - [ ] `userEvent` for interactions
  - [ ] `expect()` for assertions
- [ ] Play function tests complete successfully
- [ ] No flaky tests (run multiple times to verify)

### Example Interactions to Test

- [ ] Click handlers work
- [ ] Form submissions work
- [ ] Modal/dialog opens and closes
- [ ] Dropdown expands and collapses
- [ ] Tooltip shows on hover
- [ ] Input validation works

---

## 8. Build & Tests

### Local Tests

- [ ] Dev server starts: `npm run storybook`
- [ ] Story loads without errors
- [ ] Controls work as expected
- [ ] No console errors in browser
- [ ] No warnings (address if any)

### Production Build

- [ ] Build completes: `npm run build-storybook`
- [ ] No build errors
- [ ] Bundle size reasonable (check warning messages)
- [ ] Static site serves correctly:
  ```bash
  npx http-server storybook-static -p 6006
  ```

### Automated Tests

- [ ] TypeScript check passes (included in build)
- [ ] Interaction tests pass (if play functions added):
  ```bash
  npm run test-storybook
  ```

---

## 9. Performance

### Story Performance

- [ ] Story loads in < 2 seconds
- [ ] No large images (> 100 KB) without optimization
- [ ] No large inline data (use mocks/fixtures)
- [ ] No expensive computations in render

### Best Practices

- [ ] Uses code splitting where beneficial
- [ ] Lazy loads heavy components (if applicable)
- [ ] No unnecessary re-renders
- [ ] Memoization used appropriately (if needed)

---

## 10. Git & PR

### Commit Message

- [ ] Follows conventional commits format:
  ```
  feat(storybook): add ComponentName story
  ```
- [ ] Includes description of what was added
- [ ] References issue number (if applicable)

### PR Description

- [ ] Lists changes made
- [ ] Includes screenshot/GIF of story
- [ ] Notes any accessibility considerations
- [ ] Links to relevant documentation
- [ ] Mentions breaking changes (if any)

### Branch & Merge

- [ ] Feature branch named appropriately: `feature/add-component-story`
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] Ready to squash and merge

---

## Quality Gates

Stories must meet these gates to be merged:

### Gate 1: Functionality
- ✅ Story loads without errors
- ✅ All variants render correctly
- ✅ Controls work as expected

### Gate 2: Accessibility
- ✅ No Critical or Serious A11y violations
- ✅ Keyboard navigation works
- ✅ Color contrast meets WCAG AA

### Gate 3: Documentation
- ✅ Component description provided
- ✅ All props documented
- ✅ Usage examples included

### Gate 4: Code Quality
- ✅ CSF 3.0 format used
- ✅ TypeScript types correct
- ✅ Code formatted with Prettier

### Gate 5: Testing
- ✅ Production build succeeds
- ✅ No console errors
- ✅ Interaction tests pass (if applicable)

---

## Common Issues & Solutions

### Issue: Build Fails

**Check:**
- TypeScript errors (run `npm run build-storybook`)
- Import paths (use relative imports in shared UI)
- Missing dependencies

### Issue: Accessibility Violations

**Check:**
- Semantic HTML used
- ARIA labels provided
- Color contrast sufficient
- Keyboard navigation works

### Issue: Story Not Appearing

**Check:**
- File name ends with `.stories.tsx`
- File in correct directory (matching glob in `.storybook/main.ts`)
- Default export exists

### Issue: Controls Not Working

**Check:**
- `argTypes` defined for props
- Control type is appropriate for prop type
- Props are actually used by component

---

## Review Process

### Author Checklist

1. **Self-review:** Complete checklist above
2. **Test locally:** Run dev server and build
3. **Fix issues:** Address all critical items
4. **Create PR:** Include screenshots
5. **Request review:** Tag frontend team lead

### Reviewer Checklist

1. **Checkout branch:** Test locally
2. **Run Storybook:** View story in browser
3. **Check accessibility:** Review A11y tab
4. **Review code:** Check for quality and consistency
5. **Test interactions:** Click, type, navigate
6. **Provide feedback:** Be specific and constructive
7. **Approve or request changes**

---

## Severity Levels

Use these to prioritize issues:

**Critical (Must Fix Before Merge):**
- Story doesn't load/render
- Build fails
- Critical A11y violations
- Security issues

**High (Should Fix Before Merge):**
- Serious A11y violations
- Missing required stories
- TypeScript errors
- No documentation

**Medium (Fix Soon):**
- Minor A11y violations
- Incomplete documentation
- Missing edge cases
- Performance issues

**Low (Nice to Have):**
- Additional variants
- More examples
- Code optimizations
- Extra polish

---

## Questions?

- **Need help?** Check `STORYBOOK_CONTRIBUTING.md`
- **Unclear requirement?** Ask in PR comments
- **Disagree with checklist?** Discuss with team lead

---

**Remember:** Quality over speed. A well-documented, accessible story is worth the extra time.

---

**Maintained By:** Frontend Team Lead
**Last Updated:** 2025-11-12
**Next Review:** Quarterly
