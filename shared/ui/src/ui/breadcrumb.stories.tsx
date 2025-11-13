import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from '../components/Button';
import { Home, ChevronRight, Slash, Folder, FileText, Settings, Users } from 'lucide-react';

/**
 * Breadcrumb navigation component built on semantic HTML nav and list elements.
 *
 * **This is a Tier 1 Primitive** - unstyled navigation component with minimal default styling.
 * No Tier 2 branded version exists for this component.
 *
 * ## Breadcrumb Navigation Features
 * - **Accessible**: Proper ARIA attributes (aria-label="breadcrumb"), semantic HTML structure
 * - **Composable**: Build custom breadcrumbs with BreadcrumbItem, BreadcrumbLink, BreadcrumbPage
 * - **Flexible Separators**: Default ChevronRight or custom separators
 * - **Collapsible**: Use BreadcrumbEllipsis for long paths
 * - **Responsive**: Flexbox layout with wrapping support
 * - **Current Page Indicator**: BreadcrumbPage marks current location with aria-current="page"
 *
 * ## Component Structure
 * ```tsx
 * <Breadcrumb> // Root nav element with aria-label="breadcrumb"
 *   <BreadcrumbList> // Ordered list (ol) container
 *     <BreadcrumbItem> // List item (li) wrapper
 *       <BreadcrumbLink /> // Clickable link (a) for navigation
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator /> // Visual separator (default: ChevronRight)
 *     <BreadcrumbItem>
 *       <BreadcrumbLink /> // Another navigation link
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage /> // Current page (span with aria-current="page")
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 *
 * ## Usage Patterns
 * - **Simple Navigation**: Home > Category > Subcategory > Page
 * - **With Icons**: Add icons to links and pages for visual clarity
 * - **Collapsed Paths**: Use BreadcrumbEllipsis with DropdownMenu for long paths
 * - **Custom Separators**: Override default ChevronRight with Slash, chevrons, or custom elements
 * - **Responsive Design**: Automatically wraps on smaller screens
 *
 * ## Accessibility Notes
 * - BreadcrumbPage uses aria-current="page" to indicate current location
 * - BreadcrumbPage uses aria-disabled="true" to prevent interaction
 * - BreadcrumbSeparator uses aria-hidden="true" to hide from screen readers
 * - BreadcrumbLink supports asChild prop for custom routing integration (e.g., Next.js Link)
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays the path to the current resource using a hierarchy of links. Helps users understand their location and navigate back through the hierarchy.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default breadcrumb with simple text navigation.
 *
 * The most basic breadcrumb implementation showing a three-level hierarchy.
 */
export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Breadcrumb with icons for enhanced visual hierarchy.
 *
 * Icons help users quickly identify different levels and types of navigation.
 */
export const WithIcons: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects" className="flex items-center gap-1.5">
            <Folder className="h-4 w-4" />
            Projects
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects/web-app" className="flex items-center gap-1.5">
            <Folder className="h-4 w-4" />
            Web App
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            README.md
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Breadcrumb with ellipsis for collapsed middle items.
 *
 * Use BreadcrumbEllipsis to indicate hidden intermediate levels in long paths.
 */
export const WithEllipsis: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Responsive breadcrumb that collapses on mobile.
 *
 * Demonstrates mobile-first responsive behavior with ellipsis for smaller screens.
 */
export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-[300px] sm:max-w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:block">
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem className="hidden sm:block">
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p className="text-xs text-muted-foreground mt-4">
        Resize window to see responsive behavior (hidden items on mobile)
      </p>
    </div>
  ),
};

/**
 * Breadcrumb with dropdown menu for collapsed items.
 *
 * Interactive ellipsis that expands to show hidden path segments in a dropdown.
 */
export const WithDropdown: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <a href="/docs">Documentation</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/docs/primitives">Primitives</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/docs/primitives/navigation">Navigation</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/primitives/navigation/breadcrumb">
            Breadcrumb
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Examples</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Breadcrumb with custom separators.
 *
 * Override the default ChevronRight separator with Slash or other icons.
 */
export const CustomSeparators: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Slash separator:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Text separator:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="text-muted-foreground">•</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="text-muted-foreground">•</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Greater than symbol:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="text-muted-foreground">&gt;</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="text-muted-foreground">&gt;</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
};

/**
 * Long path breadcrumb with many levels.
 *
 * Demonstrates breadcrumb behavior with deep navigation hierarchies.
 */
export const LongPath: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/organization">Organization</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/organization/repositories">Repositories</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/organization/repositories/project">Project</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/organization/repositories/project/src">src</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/organization/repositories/project/src/components">
            components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Button.tsx</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Long path with smart collapsing.
 *
 * Show first item, ellipsis for middle items, and last 2-3 items for better UX.
 */
export const LongPathCollapsed: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Show hidden path</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <a href="/organization">Organization</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/organization/repositories">Repositories</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/organization/repositories/project">Project</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/organization/repositories/project/src">src</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/organization/repositories/project/src/components">
            components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Button.tsx</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Interactive breadcrumb with click handlers.
 *
 * Demonstrates using onClick handlers for client-side routing (e.g., React Router, Next.js).
 */
export const Interactive: Story = {
  render: () => {
    const InteractiveBreadcrumb = () => {
      const [currentPath, setCurrentPath] = useState('/docs/components/breadcrumb');

      const handleNavigation = (path: string) => {
        setCurrentPath(path);
      };

      return (
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/');
                  }}
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/docs');
                  }}
                >
                  Docs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/docs/components');
                  }}
                >
                  Components
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="text-sm text-muted-foreground">
            Current path: <code className="text-foreground">{currentPath}</code>
          </div>
        </div>
      );
    };

    return <InteractiveBreadcrumb />;
  },
};

/**
 * Different application contexts.
 *
 * Shows breadcrumbs in various real-world scenarios.
 */
export const ApplicationContexts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium mb-2">E-commerce Product Page:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories/electronics">Electronics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories/electronics/laptops">Laptops</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>MacBook Pro 16"</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Admin Dashboard Settings:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Users
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Documentation Site:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/getting-started">Getting Started</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Installation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed breadcrumb.
 *
 * Demonstrates using the Ozean Licht turquoise color (#0ec2bc) for branding.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Turquoise accent on current page:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/documentation">Documentation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ color: '#0ec2bc', fontWeight: 500 }}>
                Current Page
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Turquoise separators:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator style={{ color: '#0ec2bc' }}>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator style={{ color: '#0ec2bc' }}>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage style={{ color: '#0ec2bc', fontWeight: 500 }}>
                Details
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Full turquoise theme:</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="flex items-center gap-1.5"
                style={{ color: '#0ec2bc' }}
              >
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator style={{ color: '#0ec2bc' }} />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services" style={{ color: '#0ec2bc' }}>
                Services
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator style={{ color: '#0ec2bc' }} />
            <BreadcrumbItem>
              <BreadcrumbPage style={{ color: '#0ec2bc', fontWeight: 600 }}>
                Consulting
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
};

/**
 * Accessibility test with play function.
 *
 * Tests breadcrumb structure and ARIA attributes using Storybook interactions.
 */
export const AccessibilityTest: Story = {
  render: () => (
    <Breadcrumb data-testid="breadcrumb">
      <BreadcrumbList data-testid="breadcrumb-list">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" data-testid="home-link">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator data-testid="separator-1" />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs" data-testid="docs-link">
            Docs
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator data-testid="separator-2" />
        <BreadcrumbItem>
          <BreadcrumbPage data-testid="current-page">Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test breadcrumb nav has proper aria-label
    const breadcrumb = canvas.getByTestId('breadcrumb');
    await expect(breadcrumb.tagName).toBe('NAV');
    await expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb');

    // Test list is an ordered list
    const list = canvas.getByTestId('breadcrumb-list');
    await expect(list.tagName).toBe('OL');

    // Test current page has aria-current
    const currentPage = canvas.getByTestId('current-page');
    await expect(currentPage).toHaveAttribute('aria-current', 'page');
    await expect(currentPage).toHaveAttribute('aria-disabled', 'true');

    // Test links are clickable
    const homeLink = canvas.getByTestId('home-link');
    await expect(homeLink.tagName).toBe('A');
    await expect(homeLink).toHaveAttribute('href', '/');

    // Test separators are aria-hidden
    const separator1 = canvas.getByTestId('separator-1');
    await expect(separator1).toHaveAttribute('aria-hidden', 'true');
    await expect(separator1).toHaveAttribute('role', 'presentation');
  },
};

/**
 * asChild prop demonstration.
 *
 * Shows how to use asChild with custom routing components (e.g., Next.js Link).
 */
export const AsChildPattern: Story = {
  render: () => {
    // Simulated Next.js Link component
    const NextLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href} className="custom-link">
        {children}
      </a>
    );

    return (
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/">Home</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NextLink href="/docs">Docs</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-xs text-muted-foreground">
          Uses asChild prop to render Next.js Link components (or any custom link component)
        </p>
      </div>
    );
  },
};

/**
 * Only current page (minimal breadcrumb).
 *
 * Shows breadcrumb with just the current page for simple contexts.
 */
export const SingleItem: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Two-level breadcrumb.
 *
 * Common pattern for simple parent-child navigation.
 */
export const TwoLevels: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
