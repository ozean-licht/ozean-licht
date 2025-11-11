/**
 * Shared UI Components Export
 *
 * All Ozean Licht branded components (Tier 2) available for import.
 * These components extend shadcn primitives with Ozean Licht branding,
 * glass morphism effects, and turquoise color scheme.
 *
 * @example
 * import { Button, Card, Badge } from '@ozean-licht/shared-ui'
 */

// ==================== Button ====================
export { Button, buttonVariants, type ButtonProps } from './Button'

// ==================== Card ====================
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
} from './Card'

// ==================== Badge ====================
export { Badge, badgeVariants, type BadgeProps } from './Badge'

// ==================== Input / Textarea / Label ====================
export {
  Input,
  Textarea,
  Label,
  inputVariants,
  textareaVariants,
  labelVariants,
  type InputProps,
  type TextareaProps,
  type LabelProps,
} from './Input'

// ==================== Dialog ====================
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  contentVariants as dialogContentVariants,
  overlayVariants as dialogOverlayVariants,
  type DialogContentProps,
  type DialogOverlayProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
} from './Dialog'

// ==================== Select (existing) ====================
export {
  Select,
  FormGroup,
  type SelectProps,
  type FormGroupProps,
} from './Select'
