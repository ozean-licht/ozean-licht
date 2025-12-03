/**
 * Shared UI Compatibility Layer for Admin Dashboard
 *
 * Re-exports @shared/ui components from source (since dist lacks type declarations).
 * This allows gradual migration from local components to shared-ui.
 *
 * Usage:
 * ```typescript
 * import { Button, Card, Badge } from '@/lib/ui'
 * ```
 *
 * Migration: Replace `@/components/ui/*` imports with `@/lib/ui`
 */

// ============================================================================
// CossUI Components (from source)
// ============================================================================

// Card
export {
  Card,
  CardHeader,
  CardContent,
  CardPanel,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@shared/ui/src/cossui/card'

// Button
export {
  Button,
  buttonVariants,
  type ButtonProps,
} from '@shared/ui/src/cossui/button'

// Badge - use local component for proper type inference
export { Badge, badgeVariants } from '@/components/ui/badge'

// Input - use local component for proper type inference
export { Input } from '@/components/ui/input'

// Textarea
export { Textarea } from '@shared/ui/src/cossui/textarea'

// Label
export { Label } from '@shared/ui/src/cossui/label'

// Select
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectPopup as SelectContent, // Alias for shadcn compatibility
  SelectItem,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from '@shared/ui/src/cossui/select'

// Checkbox
export {
  Checkbox,
  CheckboxIndicator,
  CheckboxGroup,
} from '@shared/ui/src/cossui/checkbox'

// Radio Group
export {
  RadioGroup,
  Radio,
  Radio as RadioGroupItem, // Alias for shadcn compatibility
  RadioIndicator,
} from '@shared/ui/src/cossui/radio-group'

// Switch
export { Switch } from '@shared/ui/src/cossui/switch'

// Slider
export { Slider } from '@shared/ui/src/cossui/slider'

// Separator
export { Separator } from '@shared/ui/src/cossui/separator'

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@shared/ui/src/cossui/table'

// Tabs
export {
  Tabs,
  TabsList,
  TabsTab,
  TabsTab as TabsTrigger, // Alias for shadcn compatibility
  TabsPanel,
  TabsPanel as TabsContent, // Alias for shadcn compatibility
} from '@shared/ui/src/cossui/tabs'

// Alert
export {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@shared/ui/src/cossui/alert'

// Progress
export {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@shared/ui/src/cossui/progress'

// Skeleton
export { Skeleton } from '@shared/ui/src/cossui/skeleton'

// Spinner
export { Spinner } from '@shared/ui/src/cossui/spinner'

// Avatar
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@shared/ui/src/cossui/avatar'

// Dialog
export {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogPopup as DialogContent, // Alias for shadcn compatibility
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@shared/ui/src/cossui/dialog'

// AlertDialog
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogBackdrop as AlertDialogOverlay, // Alias for shadcn compatibility
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@shared/ui/src/cossui/alert-dialog'

// Popover
export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
  PopoverPopup as PopoverContent, // Alias for shadcn compatibility
  PopoverBackdrop,
  PopoverDescription,
  PopoverTitle,
  PopoverClose,
} from '@shared/ui/src/cossui/popover'

// Tooltip
export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
  TooltipPopup,
  TooltipPopup as TooltipContent, // Alias for shadcn compatibility
} from '@shared/ui/src/cossui/tooltip'

// Sheet
export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@shared/ui/src/cossui/sheet'

// ============================================================================
// ShadCN UI Components (from ui folder - not in CossUI)
// ============================================================================

// DropdownMenu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@shared/ui/src/ui/dropdown-menu'

// Command
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '@shared/ui/src/ui/command'

// Calendar
// NOTE: Calendar remains in ui/ folder (not yet migrated to cossui/)
// It uses react-day-picker and has not been rewritten for Base UI
export { Calendar } from '@shared/ui/src/ui/calendar'

// ============================================================================
// Branded Components
// ============================================================================

export { SpanBadge } from '@shared/ui/src/branded/span-badge'
export { default as SpanDesign } from '@shared/ui/src/branded/span-design'
export { LightRays, type RaysOrigin } from '@shared/ui/src/branded/light-rays'

// ============================================================================
// Chart Components (from ui folder)
// ============================================================================

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  type ChartConfig,
} from '@shared/ui/src/ui/chart'

// ============================================================================
// Utilities
// ============================================================================

export { cn } from '@shared/ui/src/utils/cn'
