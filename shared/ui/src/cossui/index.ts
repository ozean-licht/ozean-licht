/**
 * Coss UI Components - Ozean Licht Edition
 *
 * Modern React components based on Base UI (not Radix UI)
 * Adapted for the Ozean Licht design system
 *
 * Key differences from shadcn/ui:
 * - Uses `render` prop instead of `asChild`
 * - CardPanel instead of CardContent
 * - AccordionPanel instead of AccordionContent
 * - Built on Base UI primitives
 */

// Layout Components
// Renamed to avoid conflicts with shadcn/ui components from ./ui
export { Card as CossUICard, CardHeader as CossUICardHeader, CardPanel as CossUICardPanel, CardFooter as CossUICardFooter } from './card'
export { Separator as CossUISeparator } from './separator'
export { Accordion as CossUIAccordion, AccordionItem as CossUIAccordionItem, AccordionTrigger as CossUIAccordionTrigger, AccordionPanel as CossUIAccordionPanel } from './accordion'
// Tabs are exported with CossUI prefix to avoid conflict with Radix UI Tabs from ./ui
export { Tabs as CossUITabs, TabsList as CossUITabsList, TabsTab as CossUITabsTab, TabsPanel as CossUITabsPanel } from './tabs'

// Form Components
// Renamed to avoid conflicts with shadcn/ui components from ./ui
export { Button as CossUIButton, buttonVariants as cossUIButtonVariants } from './button'
export { Input as CossUIInput } from './input'
export { Textarea as CossUITextarea } from './textarea'
export { Label as CossUILabel } from './label'
export { Select as CossUISelect, SelectTrigger as CossUISelectTrigger, SelectValue as CossUISelectValue, SelectPortal as CossUISelectPortal, SelectPositioner as CossUISelectPositioner, SelectPopup as CossUISelectPopup, SelectItem as CossUISelectItem, SelectSeparator as CossUISelectSeparator, SelectGroup as CossUISelectGroup, SelectLabel as CossUISelectLabel } from './select'
export { Checkbox as CossUICheckbox, CheckboxIndicator as CossUICheckboxIndicator, CheckboxGroup as CossUICheckboxGroup } from './checkbox'
export { RadioGroup as CossUIRadioGroup, Radio as CossUIRadio, RadioIndicator as CossUIRadioIndicator } from './radio-group'
export { Switch as CossUISwitch, SwitchThumb as CossUISwitchThumb } from './switch'
export { Slider as CossUISlider } from './slider'
export { Toggle as CossUIToggle } from './toggle'

// Feedback Components
// Renamed to avoid conflicts with shadcn/ui components from ./ui
export { Alert as CossUIAlert, AlertTitle as CossUIAlertTitle, AlertDescription as CossUIAlertDescription } from './alert'
export { Badge as CossUIBadge, badgeVariants as cossUIBadgeVariants } from './badge'
export { Progress as CossUIProgress } from './progress'
export { Spinner as CossUISpinner } from './spinner'
export { Skeleton as CossUISkeleton } from './skeleton'

// Overlay Components
// Renamed to avoid conflicts with shadcn/ui components from ./ui
export { Dialog as CossUIDialog, DialogTrigger as CossUIDialogTrigger, DialogPopup as CossUIDialogPopup, DialogHeader as CossUIDialogHeader, DialogFooter as CossUIDialogFooter, DialogTitle as CossUIDialogTitle, DialogDescription as CossUIDialogDescription, DialogClose as CossUIDialogClose } from './dialog'
export { Popover as CossUIPopover, PopoverTrigger as CossUIPopoverTrigger, PopoverPortal as CossUIPopoverPortal, PopoverPositioner as CossUIPopoverPositioner, PopoverPopup as CossUIPopoverPopup, PopoverBackdrop as CossUIPopoverBackdrop, PopoverDescription as CossUIPopoverDescription, PopoverTitle as CossUIPopoverTitle, PopoverClose as CossUIPopoverClose } from './popover'
export { Tooltip as CossUITooltip, TooltipProvider as CossUITooltipProvider, TooltipTrigger as CossUITooltipTrigger, TooltipArrow as CossUITooltipArrow, TooltipPopup as CossUITooltipPopup } from './tooltip'
export { Menu as CossUIMenu, MenuTrigger as CossUIMenuTrigger, MenuPortal as CossUIMenuPortal, MenuPositioner as CossUIMenuPositioner, MenuPopup as CossUIMenuPopup, MenuItem as CossUIMenuItem, MenuSeparator as CossUIMenuSeparator, MenuGroup as CossUIMenuGroup, MenuGroupLabel as CossUIMenuGroupLabel, MenuCheckboxItem as CossUIMenuCheckboxItem, MenuRadioGroup as CossUIMenuRadioGroup, MenuRadioItem as CossUIMenuRadioItem, MenuSub as CossUIMenuSub, MenuSubTrigger as CossUIMenuSubTrigger, MenuSubPopup as CossUIMenuSubPopup } from './menu'
