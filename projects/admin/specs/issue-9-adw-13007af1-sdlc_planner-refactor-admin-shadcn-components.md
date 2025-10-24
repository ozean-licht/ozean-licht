# Chore: Refactor admin dashboard to use ShadCN components

## Metadata
issue_number: `9`
adw_id: `13007af1`
issue_json: `{"number":9,"title":"Refactor admin dashboard to use ShadCN components - Replace custom implementations with design system","body":"## 🎯 Objective\n  Refactor the admin dashboard to properly utilize ShadCN UI components, replacing all custom HTML/Tailwind implementations with the design system\n  components. The dashboard was built without using ShadCN despite it being specified in the requirements, resulting in unnecessary custom code and\n  missing accessibility features.\n\n  ## 🔍 Current State\n  The admin dashboard is currently using:\n  - ❌ Custom form elements with plain HTML\n  - ❌ Manual dropdown state management\n  - ❌ Custom buttons with inline Tailwind classes\n  - ❌ Plain divs for alerts and cards\n  - ❌ No ShadCN components despite being in requirements\n\n  ## ✅ Desired Outcome\n  A fully refactored admin dashboard using:\n  - ✅ ShadCN Form, Input, Label components\n  - ✅ ShadCN Button with variants\n  - ✅ ShadCN Alert for notifications\n  - ✅ ShadCN Card for content sections\n  - ✅ ShadCN Dropdown-menu for user menus\n  - ✅ ShadCN Navigation-menu for sidebar\n  - ✅ ShadCN Select for entity switcher\n  - ✅ Consistent design system throughout\n\n  ## 📝 Technical Requirements\n\n  ### 1. Initialize ShadCN\n  - Run `npx shadcn-ui@latest init` in `/projects/admin`\n  - Configure with TypeScript, Tailwind CSS, and CSS variables\n  - Set up `components/ui` directory structure\n\n  ### 2. Component Replacements\n\n  #### LoginForm.tsx\n  - Replace custom form → `Form` component with react-hook-form\n  - Replace `<input>` → `Input` component\n  - Replace custom button → `Button` component\n  - Replace error div → `Alert` component\n\n  #### Header.tsx\n  - Replace custom button → `Button` for menu toggle\n  - Add `Avatar` for user display\n  - Replace custom dropdown → `Dropdown-menu`\n\n  #### Sidebar.tsx\n  - Replace custom nav → `Navigation-menu`\n  - Use `Accordion` or `Collapsible` for sections\n  - Replace custom badges → `Badge` component\n  - Add `Separator` between sections\n\n  #### EntitySwitcher.tsx\n  - Replace custom dropdown → `Select` or `Dropdown-menu`\n  - Add `Avatar` for entity logos\n\n  #### LogoutButton.tsx\n  - Replace custom button → `Button` with loading state\n\n  #### 2FA Settings Page\n  - Replace custom cards → `Card` component\n  - Replace warning div → `Alert` component\n  - Replace custom badges → `Badge` component\n\n  ### 3. Required ShadCN Components\n  ```bash\n  npx shadcn-ui@latest add button form input label alert card dropdown-menu navigation-menu select avatar badge separator accordion collapsible toast\n  dialog sheet\n\nInclude workflow: adw_sdlc_iso\n"}`

## Chore Description

The admin dashboard was built using custom HTML elements and manual Tailwind CSS styling instead of leveraging ShadCN UI components. This chore involves a comprehensive refactor to:

1. Initialize ShadCN UI in the `/projects/admin` directory
2. Install all required ShadCN components (button, form, input, label, alert, card, dropdown-menu, navigation-menu, select, avatar, badge, separator, accordion, collapsible, toast, dialog, sheet)
3. Replace all custom HTML implementations with corresponding ShadCN components across:
   - LoginForm.tsx - Form validation with react-hook-form
   - Header.tsx - Buttons, avatars, dropdown menus
   - Sidebar.tsx - Navigation menu with badges and separators
   - EntitySwitcher.tsx - Select/dropdown for entity switching
   - LogoutButton.tsx - Button with loading states
   - 2FA Settings Page - Cards, alerts, badges

This refactor will improve:
- Accessibility (ARIA attributes, keyboard navigation)
- Consistency (unified design system)
- Maintainability (less custom code)
- User experience (better interactions, animations)

## Relevant Files

### Existing Files to Modify

- **`projects/admin/components/auth/LoginForm.tsx`** - Replace custom form inputs, buttons, and error messages with ShadCN Form, Input, Button, and Alert components. Add react-hook-form integration for form validation.

- **`projects/admin/components/dashboard/Header.tsx`** - Replace custom menu toggle button with ShadCN Button. Add Avatar component for user display. Replace custom dropdown logic with ShadCN Dropdown-menu component.

- **`projects/admin/components/dashboard/Sidebar.tsx`** - Replace custom navigation with ShadCN Navigation-menu or a simpler link-based structure. Replace emoji badges with ShadCN Badge component. Add Separator components between sections. Consider using Accordion or Collapsible for expandable sections.

- **`projects/admin/components/dashboard/EntitySwitcher.tsx`** - Replace custom dropdown state management and UI with ShadCN Select or Dropdown-menu component. Add Avatar component for entity logos.

- **`projects/admin/components/auth/LogoutButton.tsx`** - Replace custom button with ShadCN Button component, ensuring loading state is properly handled.

- **`projects/admin/app/(dashboard)/settings/2fa/page.tsx`** - Replace custom card divs with ShadCN Card component (CardHeader, CardTitle, CardDescription, CardContent). Replace warning div with ShadCN Alert component. Replace custom badges with ShadCN Badge component.

- **`projects/admin/tailwind.config.js`** - Update to include ShadCN theme configuration (CSS variables, animations, etc.).

- **`projects/admin/package.json`** - Add new dependencies: `react-hook-form`, `@hookform/resolvers`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` (for icons).

- **`projects/admin/app/globals.css`** (or create if doesn't exist) - Add ShadCN base styles and CSS variable definitions.

### New Files to Create

- **`projects/admin/components.json`** - ShadCN configuration file (generated by `npx shadcn-ui@latest init`).

- **`projects/admin/lib/utils.ts`** - Utility function for className merging (cn helper), required by ShadCN components.

- **`projects/admin/components/ui/button.tsx`** - ShadCN Button component.

- **`projects/admin/components/ui/input.tsx`** - ShadCN Input component.

- **`projects/admin/components/ui/label.tsx`** - ShadCN Label component.

- **`projects/admin/components/ui/form.tsx`** - ShadCN Form component with react-hook-form integration.

- **`projects/admin/components/ui/alert.tsx`** - ShadCN Alert component.

- **`projects/admin/components/ui/card.tsx`** - ShadCN Card component.

- **`projects/admin/components/ui/dropdown-menu.tsx`** - ShadCN Dropdown Menu component.

- **`projects/admin/components/ui/select.tsx`** - ShadCN Select component.

- **`projects/admin/components/ui/avatar.tsx`** - ShadCN Avatar component.

- **`projects/admin/components/ui/badge.tsx`** - ShadCN Badge component.

- **`projects/admin/components/ui/separator.tsx`** - ShadCN Separator component.

- **`projects/admin/components/ui/accordion.tsx`** - ShadCN Accordion component (optional, if needed for sidebar).

- **`projects/admin/components/ui/collapsible.tsx`** - ShadCN Collapsible component (optional, if needed for sidebar).

- **`projects/admin/components/ui/toast.tsx`** - ShadCN Toast component (for future notifications).

- **`projects/admin/components/ui/dialog.tsx`** - ShadCN Dialog component (for future modals).

- **`projects/admin/components/ui/sheet.tsx`** - ShadCN Sheet component (for mobile sidebar).

- **`projects/admin/app/globals.css`** - If it doesn't exist, create it to include Tailwind directives and ShadCN CSS variables.

## Step by Step Tasks

### Step 1: Initialize ShadCN UI and Install Dependencies

- Navigate to `/projects/admin` directory
- Run `npx shadcn-ui@latest init` to initialize ShadCN UI
  - Select TypeScript when prompted
  - Choose CSS variables for theming
  - Accept default paths (components in `components/ui`)
- Verify `components.json` is created with correct configuration
- Install additional required dependencies:
  - `npm install react-hook-form @hookform/resolvers zod` (for form validation)
  - `npm install class-variance-authority clsx tailwind-merge` (utilities)
  - `npm install lucide-react` (icons for ShadCN components)
- Verify `lib/utils.ts` is created with the `cn` helper function
- Update `tailwind.config.js` with ShadCN theme configuration (should be auto-updated by init command)
- Create or update `app/globals.css` with Tailwind directives and ShadCN CSS variables

### Step 2: Install Required ShadCN Components

- Run `npx shadcn-ui@latest add button` to add Button component
- Run `npx shadcn-ui@latest add input` to add Input component
- Run `npx shadcn-ui@latest add label` to add Label component
- Run `npx shadcn-ui@latest add form` to add Form component
- Run `npx shadcn-ui@latest add alert` to add Alert component
- Run `npx shadcn-ui@latest add card` to add Card component
- Run `npx shadcn-ui@latest add dropdown-menu` to add Dropdown Menu component
- Run `npx shadcn-ui@latest add select` to add Select component
- Run `npx shadcn-ui@latest add avatar` to add Avatar component
- Run `npx shadcn-ui@latest add badge` to add Badge component
- Run `npx shadcn-ui@latest add separator` to add Separator component
- Run `npx shadcn-ui@latest add accordion` to add Accordion component (optional)
- Run `npx shadcn-ui@latest add collapsible` to add Collapsible component (optional)
- Run `npx shadcn-ui@latest add toast` to add Toast component (for future use)
- Run `npx shadcn-ui@latest add dialog` to add Dialog component (for future use)
- Run `npx shadcn-ui@latest add sheet` to add Sheet component (for mobile sidebar)
- Verify all components are created in `components/ui/` directory
- Verify TypeScript types are correct and no compilation errors

### Step 3: Refactor LoginForm.tsx

- Open `components/auth/LoginForm.tsx`
- Import ShadCN components: `Button`, `Input`, `Label`, `Form` from `@/components/ui/*`
- Import `Alert` from `@/components/ui/alert`
- Import react-hook-form: `useForm`, `FormProvider` from `react-hook-form`
- Import zod for validation schema
- Replace custom form HTML with ShadCN Form component structure:
  - Create zod validation schema for email and password
  - Use `useForm` hook with zodResolver
  - Wrap form in `FormProvider` or use `Form` components (FormField, FormItem, FormLabel, FormControl, FormMessage)
  - Replace `<input>` elements with ShadCN `Input` components
  - Replace `<label>` elements with ShadCN `Label` components
  - Replace custom button with ShadCN `Button` component
  - Replace error div with ShadCN `Alert` component (variant="destructive")
- Maintain all existing functionality (login logic, loading states, error handling)
- Test that form validation works correctly
- Test that login flow still works as expected

### Step 4: Refactor Header.tsx

- Open `components/dashboard/Header.tsx`
- Import ShadCN components: `Button`, `Avatar`, `AvatarFallback` from `@/components/ui/*`
- Replace mobile menu toggle button with ShadCN `Button` component (variant="ghost" or "outline")
- Add `Avatar` component for user display:
  - Use `AvatarFallback` with user initials (e.g., extract from email)
  - Position avatar next to user info
- Consider adding a dropdown menu for user actions (future enhancement, can use existing LogoutButton for now)
- Maintain responsive design and mobile menu toggle functionality
- Test mobile menu toggle works correctly
- Test that user info displays properly

### Step 5: Refactor Sidebar.tsx

- Open `components/dashboard/Sidebar.tsx`
- Import ShadCN components: `Badge`, `Separator` from `@/components/ui/*`
- Replace custom close button with ShadCN `Button` component (variant="ghost")
- Replace custom badges (text with bg-gray-200) with ShadCN `Badge` component
- Add `Separator` components between navigation sections for better visual hierarchy
- Maintain existing navigation logic (active route detection, entity filtering)
- Maintain mobile overlay and slide-in animation
- Consider using Sheet component for mobile sidebar (optional enhancement)
- Test navigation links work correctly
- Test mobile sidebar opens/closes properly
- Test entity-scoped section visibility

### Step 6: Refactor EntitySwitcher.tsx

- Open `components/dashboard/EntitySwitcher.tsx`
- Import ShadCN components: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` from `@/components/ui/select`
- Import `Avatar`, `AvatarImage`, `AvatarFallback` from `@/components/ui/avatar`
- Replace custom dropdown state management with ShadCN `Select` component:
  - Use `Select` with `value` and `onValueChange` props
  - Map `availableEntities` to `SelectItem` components
  - Add `Avatar` in each `SelectItem` for entity logos
- Remove manual `isOpen` state and click-outside logic (handled by Select)
- Maintain entity switching functionality via `onEntitySwitch` callback
- Maintain conditional rendering (hide if only one entity)
- Test entity switching works correctly
- Test avatar/logo display works properly

### Step 7: Refactor LogoutButton.tsx

- Open `components/auth/LogoutButton.tsx`
- Import ShadCN `Button` component from `@/components/ui/button`
- Replace custom button with ShadCN `Button` component:
  - Use variant="destructive" for red styling
  - Use `disabled` prop for loading state
  - Use `loading` prop or custom loading state with spinner icon
- Consider using lucide-react icons for spinner (e.g., `Loader2` with `animate-spin`)
- Maintain logout functionality
- Test logout flow works correctly
- Test loading state displays properly

### Step 8: Refactor 2FA Settings Page

- Open `app/(dashboard)/settings/2fa/page.tsx`
- Import ShadCN components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Alert`, `AlertDescription`, `Badge`, `Button` from `@/components/ui/*`
- Replace custom card divs with ShadCN `Card` component structure:
  - Wrap main content in `Card` component
  - Use `CardHeader`, `CardTitle`, `CardDescription` for headers
  - Use `CardContent` for body content
- Replace yellow warning div with ShadCN `Alert` component (variant="warning" or "default" with custom styling)
- Replace status badges with ShadCN `Badge` component (variant="destructive" for "Disabled", variant="secondary" for "Not Active")
- Replace disabled button with ShadCN `Button` component (variant="secondary", disabled)
- Maintain page layout and responsive design
- Test page renders correctly
- Test all visual elements display properly

### Step 9: Update Global Styles

- Open or create `app/globals.css`
- Ensure Tailwind directives are present:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Add ShadCN CSS variable definitions (should be added by init command):
  - Base layer with CSS variables for colors (background, foreground, primary, secondary, etc.)
  - Dark mode support (if needed)
- Remove any conflicting custom styles
- Test that styles are applied correctly across all pages

### Step 10: Type Checking and Linting

- Run `npm run typecheck` to ensure no TypeScript errors
- Fix any type issues related to component prop changes
- Run `npm run lint` to check for linting errors
- Fix any linting issues
- Verify all imports are correct and components are properly typed

### Step 11: Run Validation Commands

- Execute all validation commands listed below to ensure zero regressions
- Fix any issues discovered during validation
- Re-run validation commands until all pass successfully

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `cd /opt/ozean-licht-ecosystem/trees/13007af1/projects/admin && npm run typecheck` - Verify TypeScript compilation succeeds with no errors
- `cd /opt/ozean-licht-ecosystem/trees/13007af1/projects/admin && npm run lint` - Verify no linting errors
- `cd /opt/ozean-licht-ecosystem/trees/13007af1/projects/admin && npm run build` - Verify production build succeeds
- `cd /opt/ozean-licht-ecosystem/trees/13007af1/projects/admin && npm run test:unit` - Run unit tests to verify no regressions
- `cd /opt/ozean-licht-ecosystem/trees/13007af1/projects/admin && npm run test:integration` - Run integration tests to verify authentication flows still work
- `cd /opt/ozean-licht-ecosystem/trees/13007af1/projects/admin && npm run dev &` - Start dev server and manually test all pages:
  - Login page renders correctly with ShadCN components
  - Form validation works on login page
  - Login flow works (can sign in with test credentials)
  - Dashboard loads after login
  - Sidebar navigation works
  - Entity switcher works (if user has multiple entities)
  - Header displays correctly with user info
  - Logout button works
  - 2FA settings page renders correctly with ShadCN components
  - Mobile responsive design works (test sidebar, header on mobile viewport)
  - All interactive elements (buttons, dropdowns, inputs) have proper hover/focus states

## Notes

### Design System Consistency

- Ensure all components use consistent spacing (ShadCN's built-in spacing)
- Use ShadCN's color palette via CSS variables (don't hardcode Tailwind colors)
- Maintain existing color scheme where possible (indigo primary, red for logout/errors)

### Accessibility Improvements

- ShadCN components come with ARIA attributes built-in
- Ensure keyboard navigation works for all interactive elements
- Test screen reader compatibility (basic verification)
- Maintain existing focus indicators or use ShadCN's improved ones

### Form Validation

- Use zod for schema validation in LoginForm
- Provide clear error messages for form validation failures
- Maintain existing validation logic (required fields, email format)

### Loading States

- Ensure loading states are visually clear (spinners, disabled states)
- Use ShadCN Button's disabled state consistently
- Consider using lucide-react icons for loading indicators

### Mobile Responsiveness

- Maintain existing mobile breakpoints (md:, lg:, etc.)
- Test sidebar slide-in animation on mobile
- Consider using ShadCN Sheet component for mobile sidebar (optional enhancement)

### Future Enhancements

- Toast component is installed for future notification system
- Dialog component is installed for future modal dialogs
- Sheet component can replace custom mobile sidebar logic
- Navigation-menu component could be used for more complex navigation (if needed)

### Breaking Changes to Avoid

- Do not change any authentication logic or flows
- Do not modify API routes or middleware
- Do not change database queries or MCP client usage
- Maintain all existing props and callbacks for components
- Ensure all existing tests pass without modification (unless testing implementation details)

### Dependencies

- `react-hook-form` - Form state management and validation
- `@hookform/resolvers` - Zod resolver for react-hook-form
- `zod` - Schema validation
- `class-variance-authority` - CVA for component variants
- `clsx` - Conditional className utility
- `tailwind-merge` - Merge Tailwind classes without conflicts
- `lucide-react` - Icon library for ShadCN components

### Component Mapping Reference

| Current Implementation | ShadCN Component | Notes |
|------------------------|------------------|-------|
| Custom `<button>` | `Button` | Use variants: default, destructive, outline, ghost |
| Custom `<input>` | `Input` | Combine with `Label` and `FormField` |
| Custom dropdown state | `Select` or `Dropdown-menu` | Select for form inputs, Dropdown-menu for actions |
| Custom error div | `Alert` | Use variant="destructive" for errors |
| Custom card div | `Card` | Use CardHeader, CardTitle, CardContent structure |
| Custom badge span | `Badge` | Use variants: default, secondary, destructive, outline |
| Plain `<hr>` | `Separator` | Better semantics and styling |
| User info display | `Avatar` | With AvatarFallback for initials |

### Testing Checklist

After implementation, verify:
- [ ] Login form works with validation
- [ ] Error messages display correctly
- [ ] Dashboard loads after successful login
- [ ] Sidebar navigation works on desktop and mobile
- [ ] Entity switcher works (if applicable)
- [ ] Logout button works
- [ ] All pages render without console errors
- [ ] TypeScript compilation succeeds
- [ ] Build completes successfully
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Visual regression check (manual comparison)
