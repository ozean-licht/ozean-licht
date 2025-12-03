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
export { Frame as CossUIFrame, FrameHeader as CossUIFrameHeader, FrameTitle as CossUIFrameTitle, FrameContent as CossUIFrameContent, FrameFooter as CossUIFrameFooter } from './frame'
export { Separator as CossUISeparator } from './separator'
export { ScrollArea, ScrollBar } from './scrollarea'
export { Accordion as CossUIAccordion, AccordionItem as CossUIAccordionItem, AccordionTrigger as CossUIAccordionTrigger, AccordionPanel as CossUIAccordionPanel } from './accordion'
export { CollapsibleRoot as CossUICollapsibleRoot, CollapsibleTrigger as CossUICollapsibleTrigger, CollapsiblePanel as CossUICollapsiblePanel } from './collapsible'
// Tabs are exported with CossUI prefix to avoid conflict with Radix UI Tabs from ./ui
export { Tabs as CossUITabs, TabsList as CossUITabsList, TabsTab as CossUITabsTab, TabsPanel as CossUITabsPanel } from './tabs'
export { Table as CossUITable, TableHeader as CossUITableHeader, TableBody as CossUITableBody, TableFooter as CossUITableFooter, TableRow as CossUITableRow, TableHead as CossUITableHead, TableCell as CossUITableCell, TableCaption as CossUITableCaption } from './table'
export { Breadcrumb as CossUIBreadcrumb, BreadcrumbList as CossUIBreadcrumbList, BreadcrumbItem as CossUIBreadcrumbItem, BreadcrumbLink as CossUIBreadcrumbLink, BreadcrumbPage as CossUIBreadcrumbPage, BreadcrumbSeparator as CossUIBreadcrumbSeparator, BreadcrumbEllipsis as CossUIBreadcrumbEllipsis } from './breadcrumb'
export { Pagination as CossUIPagination, PaginationContent as CossUIPaginationContent, PaginationItem as CossUIPaginationItem, PaginationLink as CossUIPaginationLink, PaginationPrevious as CossUIPaginationPrevious, PaginationNext as CossUIPaginationNext, PaginationEllipsis as CossUIPaginationEllipsis } from './pagination'

// Form Components
// Renamed to avoid conflicts with shadcn/ui components from ./ui
export { Button as CossUIButton, buttonVariants as cossUIButtonVariants } from './button'
export { Input as CossUIInput } from './input'
export { InputGroupRoot as CossUIInputGroupRoot, InputGroupAddon as CossUIInputGroupAddon, InputGroupInput as CossUIInputGroupInput, InputGroupButton as CossUIInputGroupButton, SearchIcon as CossUISearchIcon, UserIcon as CossUIUserIcon, MailIcon as CossUIMailIcon, CopyIcon as CossUICopyIcon, XIcon as CossUIXIcon, PhoneIcon as CossUIPhoneIcon, GlobeIcon as CossUIGlobeIcon } from './input-group'
export { Textarea as CossUITextarea } from './textarea'
export { Label as CossUILabel } from './label'
export { Select as CossUISelect, SelectTrigger as CossUISelectTrigger, SelectValue as CossUISelectValue, SelectPortal as CossUISelectPortal, SelectPositioner as CossUISelectPositioner, SelectPopup as CossUISelectPopup, SelectItem as CossUISelectItem, SelectSeparator as CossUISelectSeparator, SelectGroup as CossUISelectGroup, SelectLabel as CossUISelectLabel } from './select'
export { ComboboxRoot as CossUIComboboxRoot, ComboboxInput as CossUIComboboxInput, ComboboxTrigger as CossUIComboboxTrigger, ComboboxIcon as CossUIComboboxIcon, ComboboxPortal as CossUIComboboxPortal, ComboboxPositioner as CossUIComboboxPositioner, ComboboxPopup as CossUIComboboxPopup, ComboboxList as CossUIComboboxList, ComboboxItem as CossUIComboboxItem, ComboboxItemIndicator as CossUIComboboxItemIndicator, ComboboxGroup as CossUIComboboxGroup, ComboboxGroupLabel as CossUIComboboxGroupLabel, ComboboxSeparator as CossUIComboboxSeparator, ComboboxEmpty as CossUIComboboxEmpty, ComboboxClear as CossUIComboboxClear, ComboboxChips as CossUIComboboxChips, ComboboxChip as CossUIComboboxChip, ComboboxChipRemove as CossUIComboboxChipRemove, ComboboxValue as CossUIComboboxValue, ComboboxStatus as CossUIComboboxStatus } from './combobox'
export { CossUIAutocompleteRoot, CossUIAutocompleteInput, CossUIAutocompleteTrigger, CossUIAutocompleteIcon, CossUIAutocompletePortal, CossUIAutocompletePositioner, CossUIAutocompletePopup, CossUIAutocompleteList, CossUIAutocompleteItem, CossUIAutocompleteItemIndicator, CossUIAutocompleteGroup, CossUIAutocompleteGroupLabel, CossUIAutocompleteSeparator, CossUIAutocompleteEmpty, CossUIAutocompleteClear, CossUIAutocompleteChips, CossUIAutocompleteChip, CossUIAutocompleteChipRemove, CossUIAutocompleteValue, CossUIAutocompleteStatus, AutocompleteRoot, AutocompleteInput, AutocompleteTrigger, AutocompleteIcon, AutocompletePortal, AutocompletePositioner, AutocompletePopup, AutocompleteList, AutocompleteItem, AutocompleteItemIndicator, AutocompleteGroup, AutocompleteGroupLabel, AutocompleteSeparator, AutocompleteEmpty, AutocompleteClear, AutocompleteChips, AutocompleteChip, AutocompleteChipRemove, AutocompleteValue, AutocompleteStatus } from './autocomplete'
export { Checkbox as CossUICheckbox, CheckboxIndicator as CossUICheckboxIndicator, CheckboxGroup as CossUICheckboxGroup } from './checkbox'
export { RadioGroup as CossUIRadioGroup, Radio as CossUIRadio, RadioIndicator as CossUIRadioIndicator } from './radio-group'
export { Switch as CossUISwitch } from './switch'
export { Slider as CossUISlider } from './slider'
export { Toggle as CossUIToggle } from './toggle'
export { NumberField as CossUINumberField, NumberFieldRoot as CossUINumberFieldRoot, NumberFieldInput as CossUINumberFieldInput, NumberFieldIncrement as CossUINumberFieldIncrement, NumberFieldDecrement as CossUINumberFieldDecrement, NumberFieldLabel as CossUINumberFieldLabel } from './number-field'
export { FieldRoot as CossUIFieldRoot, FieldLabel as CossUIFieldLabel, FieldControl as CossUIFieldControl, FieldError as CossUIFieldError, FieldHelper as CossUIFieldHelper, FieldDescription as CossUIFieldDescription, FieldValidity as CossUIFieldValidity } from './field'
export { Toolbar as CossUIToolbar, ToolbarGroup as CossUIToolbarGroup, ToolbarButton as CossUIToolbarButton, ToolbarSeparator as CossUIToolbarSeparator } from './toolbar'
export { FieldsetRoot as CossUIFieldsetRoot, FieldsetLegend as CossUIFieldsetLegend, FieldsetContent as CossUIFieldsetContent, FieldsetDescription as CossUIFieldsetDescription, FieldsetHelper as CossUIFieldsetHelper, fieldsetVariants as cossUIFieldsetVariants } from './fieldset'
export { GroupRoot as CossUIGroupRoot, GroupLabel as CossUIGroupLabel, GroupContent as CossUIGroupContent, GroupItem as CossUIGroupItem, groupRootVariants as cossUIGroupRootVariants } from './group'

// Feedback Components
// Renamed to avoid conflicts with shadcn/ui components from ./ui
export { Alert as CossUIAlert, AlertTitle as CossUIAlertTitle, AlertDescription as CossUIAlertDescription } from './alert'
export { Badge as CossUIBadge, badgeVariants as cossUIBadgeVariants } from './badge'
export { Kbd as CossUIKbd, kbdVariants as cossUIKbdVariants } from './kbd'
export { Progress as CossUIProgress, ProgressLabel as CossUIProgressLabel, ProgressValue as CossUIProgressValue } from './progress'
export { Meter as CossUIMeter, MeterTrack as CossUIMeterTrack, MeterIndicator as CossUIMeterIndicator, MeterLabel as CossUIMeterLabel, MeterValue as CossUIMeterValue } from './meter'
export { Spinner as CossUISpinner } from './spinner'
export { Skeleton as CossUISkeleton } from './skeleton'
export { Avatar as CossUIAvatar, AvatarImage as CossUIAvatarImage, AvatarFallback as CossUIAvatarFallback } from './avatar'
export { ToastProvider as CossUIToastProvider, ToastViewport as CossUIToastViewport, Toast as CossUIToast, ToastTitle as CossUIToastTitle, ToastDescription as CossUIToastDescription, ToastClose as CossUIToastClose, ToastAction as CossUIToastAction, ToastIcon as CossUIToastIcon, ToastContent as CossUIToastContent, ToastProgress as CossUIToastProgress, SuccessIcon as CossUIToastSuccessIcon, WarningIcon as CossUIToastWarningIcon, ErrorIcon as CossUIToastErrorIcon, InfoIcon as CossUIToastInfoIcon, DefaultIcon as CossUIToastDefaultIcon } from './toast'
export { EmptyRoot as CossUIEmptyRoot, EmptyIcon as CossUIEmptyIcon, EmptyTitle as CossUIEmptyTitle, EmptyDescription as CossUIEmptyDescription, EmptyAction as CossUIEmptyAction, InboxIcon as CossUIInboxIcon, SearchIcon as CossUIEmptySearchIcon, FileIcon as CossUIFileIcon, FolderIcon as CossUIFolderIcon, PackageIcon as CossUIPackageIcon, BellIcon as CossUIBellIcon, ShoppingCartIcon as CossUIShoppingCartIcon, MessageSquareIcon as CossUIMessageSquareIcon, StarIcon as CossUIStarIcon, AlertCircleIcon as CossUIAlertCircleIcon, LockIcon as CossUILockIcon, ClockIcon as CossUIClockIcon } from './empty'

// Overlay Components
// Renamed to avoid conflicts with shadcn/ui components from ./ui
export { Dialog as CossUIDialog, DialogTrigger as CossUIDialogTrigger, DialogPopup as CossUIDialogPopup, DialogHeader as CossUIDialogHeader, DialogFooter as CossUIDialogFooter, DialogTitle as CossUIDialogTitle, DialogDescription as CossUIDialogDescription, DialogClose as CossUIDialogClose } from './dialog'
export { Sheet as CossUISheet, SheetTrigger as CossUISheetTrigger, SheetContent as CossUISheetContent, SheetHeader as CossUISheetHeader, SheetFooter as CossUISheetFooter, SheetTitle as CossUISheetTitle, SheetDescription as CossUISheetDescription, SheetClose as CossUISheetClose } from './sheet'
export { AlertDialog as CossUIAlertDialog, AlertDialogTrigger as CossUIAlertDialogTrigger, AlertDialogPortal as CossUIAlertDialogPortal, AlertDialogBackdrop as CossUIAlertDialogBackdrop, AlertDialogContent as CossUIAlertDialogContent, AlertDialogHeader as CossUIAlertDialogHeader, AlertDialogFooter as CossUIAlertDialogFooter, AlertDialogTitle as CossUIAlertDialogTitle, AlertDialogDescription as CossUIAlertDialogDescription, AlertDialogAction as CossUIAlertDialogAction, AlertDialogCancel as CossUIAlertDialogCancel } from './alert-dialog'
export { Popover as CossUIPopover, PopoverTrigger as CossUIPopoverTrigger, PopoverPortal as CossUIPopoverPortal, PopoverPositioner as CossUIPopoverPositioner, PopoverPopup as CossUIPopoverPopup, PopoverBackdrop as CossUIPopoverBackdrop, PopoverDescription as CossUIPopoverDescription, PopoverTitle as CossUIPopoverTitle, PopoverClose as CossUIPopoverClose } from './popover'
export { Tooltip as CossUITooltip, TooltipProvider as CossUITooltipProvider, TooltipTrigger as CossUITooltipTrigger, TooltipArrow as CossUITooltipArrow, TooltipPopup as CossUITooltipPopup, TooltipContent as CossUITooltipContent } from './tooltip'
export { Menu as CossUIMenu, MenuTrigger as CossUIMenuTrigger, MenuPortal as CossUIMenuPortal, MenuPositioner as CossUIMenuPositioner, MenuPopup as CossUIMenuPopup, MenuItem as CossUIMenuItem, MenuSeparator as CossUIMenuSeparator, MenuGroup as CossUIMenuGroup, MenuGroupLabel as CossUIMenuGroupLabel, MenuCheckboxItem as CossUIMenuCheckboxItem, MenuRadioGroup as CossUIMenuRadioGroup, MenuRadioItem as CossUIMenuRadioItem, MenuSub as CossUIMenuSub, MenuSubTrigger as CossUIMenuSubTrigger, MenuSubPopup as CossUIMenuSubPopup } from './menu'
export { PreviewCardRoot as CossUIPreviewCardRoot, PreviewCardTrigger as CossUIPreviewCardTrigger, PreviewCardContent as CossUIPreviewCardContent } from './preview-card'
export { FormRoot as CossUIFormRoot, FormField as CossUIFormField, FormLabel as CossUIFormLabel, FormControl as CossUIFormControl, FormDescription as CossUIFormDescription, FormMessage as CossUIFormMessage, FormSubmit as CossUIFormSubmit, useFormHandler as useCossUIFormHandler } from './form'
