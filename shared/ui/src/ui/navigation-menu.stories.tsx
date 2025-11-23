import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from './navigation-menu';
import { CossUIButton as Button } from '../cossui';
import {
  FileText,
  Code,
  Palette,
  Settings,
  Users,
  BookOpen,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Layers,
  Package,
} from 'lucide-react';
import React from 'react';

/**
 * NavigationMenu component for building accessible navigation menus.
 * Built on Radix UI NavigationMenu primitive.
 *
 * ## Features
 * - Top-level navigation with dropdown panels
 * - Keyboard navigation (Arrow keys, Tab, Escape, Enter)
 * - Animated viewport transitions between panels
 * - Active state indicator with animated position
 * - Auto-positioning with collision detection
 * - Smooth entry/exit animations
 * - Click outside to close
 * - Focus management for accessibility
 * - Support for nested content in dropdowns
 * - Single or multiple level navigation
 *
 * ## Anatomy
 * ```tsx
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem>
 *       <NavigationMenuTrigger>Trigger</NavigationMenuTrigger>
 *       <NavigationMenuContent>
 *         <NavigationMenuLink>Link</NavigationMenuLink>
 *       </NavigationMenuContent>
 *     </NavigationMenuItem>
 *     <NavigationMenuItem>
 *       <NavigationMenuLink href="/page">Link</NavigationMenuLink>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 * ```
 *
 * ## Usage Notes
 * - Use NavigationMenuTrigger for items with dropdown content
 * - Use NavigationMenuLink directly for simple navigation links
 * - NavigationMenuViewport is automatically included in NavigationMenu root
 * - NavigationMenuIndicator shows which menu item is active
 * - The viewport animates smoothly between different content sizes
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of links for navigating websites, with dropdown panels for additional navigation options.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full min-h-[400px] flex items-start justify-center pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default navigation menu with simple links
 */
export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation menu with dropdown panels
 */
export const WithDropdowns: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Layers className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Ozean Licht Ecosystem
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Educational and content platforms for Austrian associations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/docs"
                  >
                    <div className="text-sm font-medium leading-none">Introduction</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn about the platform and its features.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/installation"
                  >
                    <div className="text-sm font-medium leading-none">Installation</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Set up your development environment.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/tutorials"
                  >
                    <div className="text-sm font-medium leading-none">Tutorials</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Step-by-step guides to get you started.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/primitives"
                  >
                    <div className="text-sm font-medium leading-none">Primitives</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Low-level UI components built on Radix UI.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/compositions"
                  >
                    <div className="text-sm font-medium leading-none">Compositions</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Complex components built from primitives.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/forms"
                  >
                    <div className="text-sm font-medium leading-none">Forms</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Form components with validation.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/layouts"
                  >
                    <div className="text-sm font-medium leading-none">Layouts</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Page layout templates and structures.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/documentation" className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation menu with icons in dropdown
 */
export const WithIcons: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Code className="mr-2 h-4 w-4" />
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/docs"
                  >
                    <FileText className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Documentation</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Complete guides and API references.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components"
                  >
                    <Package className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Components</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Browse our component library.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/design"
                  >
                    <Palette className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Design System</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Colors, typography, and design tokens.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/examples"
                  >
                    <BookOpen className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Examples</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Real-world examples and patterns.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Users className="mr-2 h-4 w-4" />
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/about"
                  >
                    <Briefcase className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">About Us</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Learn about our mission and values.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/team"
                  >
                    <Users className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Team</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Meet the people behind the platform.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/contact"
                  >
                    <Mail className="h-6 w-6 shrink-0" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium leading-none">Contact</div>
                      <p className="text-sm leading-snug text-muted-foreground">
                        Get in touch with our team.
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/blog" className={navigationMenuTriggerStyle()}>
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Complex navigation with mixed content types
 */
export const ComplexNavigation: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[600px] p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">For Developers</h3>
                  <ul className="space-y-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          href="/products/api"
                        >
                          <div className="font-medium">API Platform</div>
                          <p className="text-xs text-muted-foreground">
                            RESTful and GraphQL APIs
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          href="/products/sdk"
                        >
                          <div className="font-medium">SDK Libraries</div>
                          <p className="text-xs text-muted-foreground">
                            JavaScript, Python, and more
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          href="/products/cli"
                        >
                          <div className="font-medium">CLI Tools</div>
                          <p className="text-xs text-muted-foreground">
                            Command-line interface
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">For Businesses</h3>
                  <ul className="space-y-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          href="/products/enterprise"
                        >
                          <div className="font-medium">Enterprise Edition</div>
                          <p className="text-xs text-muted-foreground">
                            Advanced features and SLAs
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          href="/products/consulting"
                        >
                          <div className="font-medium">Consulting</div>
                          <p className="text-xs text-muted-foreground">
                            Expert guidance and support
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          href="/products/training"
                        >
                          <div className="font-medium">Training</div>
                          <p className="text-xs text-muted-foreground">
                            Workshops and certifications
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <NavigationMenuLink asChild>
                  <a
                    className="flex items-center justify-between rounded-md bg-muted p-3 text-sm hover:bg-accent hover:text-accent-foreground"
                    href="/products/all"
                  >
                    <span className="font-medium">View all products</span>
                    <Globe className="h-4 w-4" />
                  </a>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/solutions/education"
                  >
                    <div className="text-sm font-medium">Education</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Tools for educational institutions.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/solutions/nonprofit"
                  >
                    <div className="text-sm font-medium">Non-Profit</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Solutions for non-profit organizations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/solutions/enterprise"
                  >
                    <div className="text-sm font-medium">Enterprise</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Scalable solutions for large organizations.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/support" className={navigationMenuTriggerStyle()}>
            Support
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Ozean Licht branded navigation
 */
export const OzeanLichtBranded: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            <span className="font-semibold text-[#0ec2bc]">Home</span>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
            Platforms
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]"
                    href="/kids-ascension"
                  >
                    <div className="text-sm font-medium">Kids Ascension</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Educational platform for children and families.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]"
                    href="/ozean-licht"
                  >
                    <div className="text-sm font-medium">Ozean Licht</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Content and community platform.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]"
                    href="/docs"
                  >
                    <FileText className="mb-2 h-5 w-5 text-[#0ec2bc]" />
                    <div className="text-sm font-medium">Documentation</div>
                    <p className="text-xs leading-snug text-muted-foreground">
                      Complete guides and references.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent focus:text-[#0ec2bc]"
                    href="/blog"
                  >
                    <BookOpen className="mb-2 h-5 w-5 text-[#0ec2bc]" />
                    <div className="text-sm font-medium">Blog</div>
                    <p className="text-xs leading-snug text-muted-foreground">
                      Latest news and updates.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Vertical navigation menu
 */
export const VerticalOrientation: Story = {
  render: () => (
    <NavigationMenu orientation="vertical" className="max-w-none">
      <NavigationMenuList className="flex-col space-x-0 space-y-1">
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
            <FileText className="mr-2 h-4 w-4" />
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuTrigger className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Team
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[200px] p-2">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    href="/team/members"
                  >
                    Members
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    href="/team/roles"
                  >
                    Roles
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    href="/team/permissions"
                  >
                    Permissions
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink href="/projects" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
            <Briefcase className="mr-2 h-4 w-4" />
            Projects
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink href="/settings" className={navigationMenuTriggerStyle() + " w-full justify-start"}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Minimal navigation with just text links
 */
export const Minimal: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/features" className={navigationMenuTriggerStyle()}>
            Features
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation with call-to-action button
 */
export const WithCTAButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      href="/products/pro"
                    >
                      <div className="text-sm font-medium">Professional</div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        For professional teams.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      href="/products/enterprise"
                    >
                      <div className="text-sm font-medium">Enterprise</div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        For large organizations.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Button variant="cta" size="sm">
        Get Started
      </Button>
    </div>
  ),
};

/**
 * Interactive test with play function
 * Tests navigation menu interactions and keyboard navigation
 */
export const InteractiveTest: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList data-testid="nav-list">
        <NavigationMenuItem>
          <NavigationMenuTrigger data-testid="products-trigger">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent data-testid="products-content">
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                    href="/product-a"
                    data-testid="product-a-link"
                  >
                    Product A
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                    href="/product-b"
                    data-testid="product-b-link"
                  >
                    Product B
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/about"
            className={navigationMenuTriggerStyle()}
            data-testid="about-link"
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Get the trigger button
    const productsTrigger = canvas.getByTestId('products-trigger');

    // Click to open the menu
    await userEvent.click(productsTrigger);

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Content should be visible
    const productsContent = body.getByTestId('products-content');
    await expect(productsContent).toBeInTheDocument();

    // Products should be accessible
    const productALink = body.getByTestId('product-a-link');
    await expect(productALink).toBeInTheDocument();

    // Click outside to close (click on About link)
    const aboutLink = canvas.getByTestId('about-link');
    await userEvent.click(aboutLink);

    // Wait for close animation
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};

/**
 * Complete example with all features
 */
export const CompleteExample: Story = {
  render: () => (
    <div className="flex w-full items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="font-bold text-[#0ec2bc]">Ozean Licht</div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
                Getting Started
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#0ec2bc]/20 to-[#0ec2bc]/10 p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Layers className="h-6 w-6 text-[#0ec2bc]" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Ozean Licht
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Educational platforms for Austrian associations.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent"
                        href="/intro"
                      >
                        <div className="text-sm font-medium leading-none">Introduction</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn about our mission and platforms.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent"
                        href="/setup"
                      >
                        <div className="text-sm font-medium leading-none">Setup Guide</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get started with your account.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent"
                        href="/tutorials"
                      >
                        <div className="text-sm font-medium leading-none">Tutorials</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Step-by-step learning resources.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="data-[state=open]:text-[#0ec2bc]">
                Platforms
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent"
                        href="/kids-ascension"
                      >
                        <div className="text-sm font-medium">Kids Ascension</div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Educational content for children.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-[#0ec2bc] focus:bg-accent"
                        href="/ozean-licht"
                      >
                        <div className="text-sm font-medium">Ozean Licht Platform</div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Community and content hub.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
        <Button variant="cta" size="sm">
          Get Started
        </Button>
      </div>
    </div>
  ),
};
