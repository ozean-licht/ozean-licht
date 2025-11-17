import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
import { Button } from './button';

/**
 * Card primitive component from shadcn/ui.
 *
 * **This is a Tier 1 Primitive** - unstyled shadcn component with minimal default styling.
 * For Ozean Licht branded cards with glass morphism and cosmic effects, see Tier 2 Branded/Card.
 *
 * ## shadcn Card Features
 * - **Flexible Composition**: Build custom cards using Card, CardHeader, CardTitle, CardDescription, CardContent, and CardFooter
 * - **Semantic Structure**: Each sub-component serves a specific purpose with appropriate styling
 * - **Responsive**: Built with mobile-first responsive design
 * - **Customizable**: Easy to override styles with className prop
 * - **Accessible**: Proper HTML semantics with div elements that can be enhanced with ARIA attributes
 *
 * ## Component Structure
 * ```tsx
 * <Card> // Root container with border, shadow, and rounded corners
 *   <CardHeader> // Optional header section with flex-col layout
 *     <CardTitle /> // Title with 2xl font size, semibold weight
 *     <CardDescription /> // Subtitle with muted foreground color
 *   </CardHeader>
 *   <CardContent> // Main content area with padding
 *     {children} // Your content
 *   </CardContent>
 *   <CardFooter> // Optional footer with flex layout for actions
 *     {actions} // Buttons or other action elements
 *   </CardFooter>
 * </Card>
 * ```
 *
 * ## Usage Notes
 * - All sub-components are optional - use only what you need
 * - CardHeader automatically adds space-y-1.5 between title and description
 * - CardContent has pt-0 to connect smoothly with header
 * - CardFooter uses flex layout ideal for button groups
 * - All components forward refs for advanced use cases
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card container component for grouping related content. Built with simple div elements and Tailwind CSS classes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default basic card.
 *
 * The most minimal card implementation showing just the Card wrapper.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p className="text-sm">
          This is a basic card with just content. No header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with header.
 *
 * Shows the common pattern of header with title and description.
 */
export const WithHeader: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card demonstrates the header section with a title and description.
          The header automatically adds appropriate spacing.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card with footer.
 *
 * Shows footer with action buttons.
 */
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Confirm Action</CardTitle>
        <CardDescription>Are you sure you want to proceed?</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This action will make changes to your account settings.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Complete card with all parts.
 *
 * Demonstrates using all available card sub-components together.
 */
export const Complete: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Complete Card Example</CardTitle>
        <CardDescription>
          This card has all possible sections: header, content, and footer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            This demonstrates a complete card structure with header, content,
            and footer sections all working together.
          </p>
          <p className="text-sm text-muted-foreground">
            Each section has appropriate spacing and can be customized with
            className props.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Secondary
        </Button>
        <Button size="sm">Primary</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card without header.
 *
 * Shows that header is optional - sometimes just content is enough.
 */
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <p className="font-semibold">No Header Needed</p>
          <p className="text-sm text-muted-foreground">
            Not every card needs a formal header. Sometimes you can style
            your content directly for a more compact design.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Multiple cards in a grid.
 *
 * Shows how cards work in layout contexts like grids.
 */
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Card One</CardTitle>
          <CardDescription>First card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the first card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card Two</CardTitle>
          <CardDescription>Second card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the second card.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card Three</CardTitle>
          <CardDescription>Third card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for the third card.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive card with hover effect.
 *
 * Shows how to add custom hover effects using Tailwind classes.
 */
export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px] cursor-pointer transition-all hover:shadow-lg hover:scale-105">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover over me to see effects</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card has custom hover effects added via className. The card
          scales slightly and increases its shadow on hover.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          Click Me
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card as a clickable link.
 *
 * Demonstrates making the entire card clickable.
 */
export const ClickableCard: Story = {
  render: () => {
    const [clicked, setClicked] = useState(false);

    return (
      <div className="space-y-4">
        <Card
          className="w-[350px] cursor-pointer transition-colors hover:bg-accent"
          onClick={() => setClicked(!clicked)}
          data-testid="clickable-card"
        >
          <CardHeader>
            <CardTitle>Clickable Card</CardTitle>
            <CardDescription>Click anywhere on this card</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              The entire card is clickable. Current state:{' '}
              <span className="font-semibold">
                {clicked ? 'Clicked' : 'Not clicked'}
              </span>
            </p>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          Tip: Use asChild pattern or wrap with an anchor for real links
        </p>
      </div>
    );
  },
};

/**
 * Card with custom styling.
 *
 * Shows how to override default styles with className.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <Card className="w-[350px] border-2 border-blue-500 shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-700">Custom Border & Background</CardTitle>
          <CardDescription>Override default styles easily</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            This card uses custom border colors and background colors via className.
          </p>
        </CardContent>
      </Card>

      <Card className="w-[350px] border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">Green Theme</CardTitle>
          <CardDescription className="text-green-600">
            Completely customized colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-800">
            All styling can be overridden using Tailwind classes.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Stats dashboard card.
 *
 * Common pattern for displaying statistics.
 */
export const StatsCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader className="pb-3">
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-4xl">$45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          +20.1% from last month
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Profile card example.
 *
 * Shows card used for user profile display.
 */
export const ProfileCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">John Doe</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>john.doe@example.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span>San Francisco, CA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Joined:</span>
            <span>January 2024</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Form card example.
 *
 * Shows card used as a container for forms.
 */
export const FormCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Cancel
        </Button>
        <Button size="sm" className="flex-1">
          Create Account
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * List card example.
 *
 * Shows card containing a list of items.
 */
export const ListCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { action: 'Created new project', time: '2 hours ago' },
            { action: 'Updated profile', time: '5 hours ago' },
            { action: 'Uploaded document', time: '1 day ago' },
            { action: 'Joined team meeting', time: '2 days ago' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span>{item.action}</span>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Notification card.
 *
 * Alert-style card for notifications.
 */
export const NotificationCard: Story = {
  render: () => (
    <Card className="w-[380px] border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <CardTitle className="text-base">New Update Available</CardTitle>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>
        <CardDescription>Version 2.0.0 is now available</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This update includes new features, bug fixes, and performance improvements.
          Update now to get the latest features.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm">
          Later
        </Button>
        <Button size="sm">Update Now</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with image.
 *
 * Shows card with image content.
 */
export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-[200px] bg-gradient-to-br from-purple-400 via-pink-500 to-red-500" />
      <CardHeader>
        <CardTitle>Beautiful Gradient</CardTitle>
        <CardDescription>Card with image header</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Images can be placed before the header for a visual card design.
          The card container handles overflow correctly.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Compact card.
 *
 * Smaller card with reduced padding.
 */
export const Compact: Story = {
  render: () => (
    <Card className="w-[250px]">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-lg">Compact Card</CardTitle>
        <CardDescription className="text-xs">Reduced spacing</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs">
          This card uses reduced padding for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button size="sm" className="h-8 text-xs w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Loading card state.
 *
 * Shows card with loading skeleton content.
 */
export const Loading: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Card without borders.
 *
 * Shows borderless variant for seamless designs.
 */
export const NoBorder: Story = {
  render: () => (
    <Card className="w-[350px] border-0 shadow-none">
      <CardHeader>
        <CardTitle>Borderless Card</CardTitle>
        <CardDescription>No border or shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          This card has its border and shadow removed for a cleaner look.
          Useful for dense layouts or nested cards.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Interactive test with play function.
 *
 * Tests card click interactions using Storybook play function.
 */
export const InteractiveTest: Story = {
  render: () => {
    const InteractiveTestCard = () => {
      const [count, setCount] = useState(0);

      return (
        <Card className="w-[350px]" data-testid="test-card">
          <CardHeader>
            <CardTitle>Interactive Test Card</CardTitle>
            <CardDescription>Testing card interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Button has been clicked: <span data-testid="count">{count}</span> times
            </p>
            <Button
              size="sm"
              data-testid="increment-button"
              onClick={() => setCount(count + 1)}
            >
              Increment
            </Button>
          </CardContent>
        </Card>
      );
    };

    return <InteractiveTestCard />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the card
    const card = canvas.getByTestId('test-card');
    await expect(card).toBeInTheDocument();

    // Initial count should be 0
    const count = canvas.getByTestId('count');
    await expect(count).toHaveTextContent('0');

    // Click increment button
    const button = canvas.getByTestId('increment-button');
    await userEvent.click(button);

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Count should be 1
    await expect(count).toHaveTextContent('1');

    // Click again
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Count should be 2
    await expect(count).toHaveTextContent('2');
  },
};

/**
 * All card variations showcase.
 *
 * Gallery showing different card patterns and use cases.
 */
export const AllVariations: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Basic */}
      <Card>
        <CardHeader>
          <CardTitle>Basic</CardTitle>
          <CardDescription>Simple card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Basic card structure</p>
        </CardContent>
      </Card>

      {/* With Footer */}
      <Card>
        <CardHeader>
          <CardTitle>With Footer</CardTitle>
          <CardDescription>Actions in footer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Card with footer buttons</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="w-full">
            Action
          </Button>
        </CardFooter>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Revenue</CardDescription>
          <CardTitle className="text-3xl">$12,345</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">+12.5% from last month</p>
        </CardContent>
      </Card>

      {/* Interactive */}
      <Card className="cursor-pointer transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
          <CardDescription>Hover effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Hover to see effect</p>
        </CardContent>
      </Card>

      {/* Colored */}
      <Card className="border-purple-500 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-700">Colored</CardTitle>
          <CardDescription className="text-purple-600">
            Custom colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-800">Custom styling</p>
        </CardContent>
      </Card>

      {/* Compact */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Compact</CardTitle>
          <CardDescription className="text-xs">Less padding</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-xs">Reduced spacing</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
