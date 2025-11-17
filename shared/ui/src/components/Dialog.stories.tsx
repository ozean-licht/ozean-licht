import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './Dialog';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from '../ui/label';

/**
 * Dialog component with Ozean Licht branding.
 * Features glass morphism, cosmic overlays, and turquoise accents.
 *
 * ## Features
 * - Glass morphism variants (default, glass, solid)
 * - Cosmic gradient overlay option
 * - Glow effects for emphasis
 * - Accessible modal with proper focus management
 * - Backdrop overlay with blur effect
 * - Smooth open/close animations
 * - Escape key and click outside to close
 */
const meta = {
  title: 'Tier 2: Branded/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ozean Licht branded dialog with glass morphism effects, extending shadcn Dialog primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default dialog with glass morphism
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ozean Licht Dialog</DialogTitle>
          <DialogDescription>
            This is a branded dialog with glass morphism effects and cosmic theme.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Dialog content goes here. This dialog uses the default glass morphism variant.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Glass variant with lighter effect
 */
export const GlassVariant: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Glass Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="glass">
        <DialogHeader>
          <DialogTitle>Glass Variant</DialogTitle>
          <DialogDescription>
            Lighter glass morphism effect for subtle modals.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This variant has a more transparent glass effect.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Solid variant without transparency
 */
export const SolidVariant: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Solid Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="solid">
        <DialogHeader>
          <DialogTitle>Solid Variant</DialogTitle>
          <DialogDescription>
            No transparency for better readability in bright contexts.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This variant has a solid background without glass effects.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with glow effect
 */
export const WithGlow: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta" glow>
          Open Glowing Dialog
        </Button>
      </DialogTrigger>
      <DialogContent glow>
        <DialogHeader>
          <DialogTitle>Glowing Dialog</DialogTitle>
          <DialogDescription>
            Dialog with turquoise glow effect for emphasis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This dialog has a subtle glow effect around its border.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with cosmic overlay
 */
export const CosmicOverlay: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta">Open Cosmic Dialog</Button>
      </DialogTrigger>
      <DialogContent cosmic glow>
        <DialogHeader>
          <DialogTitle>Cosmic Experience</DialogTitle>
          <DialogDescription>
            Full cosmic theme with gradient overlay and glow effects.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This dialog features the cosmic gradient overlay backdrop for the ultimate Ozean Licht experience.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Dialog with footer actions
 */
export const WithFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Maria Schneider" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value="maria@ozean-licht.dev" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Confirmation dialog
 */
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Form dialog example
 */
export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta">Create Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create new course</DialogTitle>
          <DialogDescription>
            Add a new course to your platform. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="course-name">Course name</Label>
            <Input id="course-name" placeholder="Introduction to Meditation" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-description">Description</Label>
            <Input
              id="course-description"
              placeholder="A brief description of your course"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-duration">Duration (hours)</Label>
            <Input
              id="course-duration"
              type="number"
              placeholder="8"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="cta">Create Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Success notification dialog
 */
export const SuccessDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta" glow>
          Complete Enrollment
        </Button>
      </DialogTrigger>
      <DialogContent glow>
        <DialogHeader>
          <DialogTitle className="text-[var(--primary)]">Enrollment Successful!</DialogTitle>
          <DialogDescription>
            You have been successfully enrolled in the course.
            A confirmation email has been sent to your inbox.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="cta">View Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Scrollable content dialog
 */
export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[50vh] space-y-4 text-sm">
          <p>
            Welcome to Ozean Licht. By accessing our platform, you agree to be bound by these terms and conditions.
          </p>
          <p>
            Our services are designed to provide educational content and spiritual guidance
            through various courses, workshops, and community features.
          </p>
          <p>
            All content on the platform is protected by copyright and may not be reproduced
            without explicit permission from Ozean Licht.
          </p>
          <p>
            Users are responsible for maintaining the confidentiality of their account
            information and for all activities that occur under their account.
          </p>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the
            platform constitutes acceptance of any modifications.
          </p>
          <p>
            For questions about these terms, please contact us at support@ozean-licht.dev
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button variant="primary">Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Default</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Default Variant</DialogTitle>
            <DialogDescription>Glass morphism strong</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Glass</Button>
        </DialogTrigger>
        <DialogContent variant="glass">
          <DialogHeader>
            <DialogTitle>Glass Variant</DialogTitle>
            <DialogDescription>Lighter glass effect</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Solid</Button>
        </DialogTrigger>
        <DialogContent variant="solid">
          <DialogHeader>
            <DialogTitle>Solid Variant</DialogTitle>
            <DialogDescription>No transparency</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="cta">Glow</Button>
        </DialogTrigger>
        <DialogContent glow>
          <DialogHeader>
            <DialogTitle>With Glow</DialogTitle>
            <DialogDescription>Turquoise glow effect</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="cta" glow>
            Cosmic
          </Button>
        </DialogTrigger>
        <DialogContent cosmic glow>
          <DialogHeader>
            <DialogTitle>Cosmic Overlay</DialogTitle>
            <DialogDescription>Full cosmic experience</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
