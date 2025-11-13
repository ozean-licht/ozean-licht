import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StackedLayout } from './stacked-layout';
import {
  Navbar,
  NavbarDivider,
  NavbarSection,
  NavbarSpacer,
  NavbarItem,
  NavbarLabel,
} from '../navigation/navbar';
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarDivider,
  SidebarSpacer,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
} from '../navigation/sidebar';
import {
  Home,
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BarChart3,
  Folder,
  MessageSquare,
  Bell,
  Search,
  Calendar,
  Mail,
  User,
  BookOpen,
  Package,
  Zap,
  HelpCircle,
  ChevronDown,
  Menu,
} from 'lucide-react';

/**
 * Catalyst StackedLayout - Vertical page layout component
 *
 * **This is a Tier 1 Primitive** - Catalyst UI layout built on Headless UI.
 * No Tier 2 branded version exists.
 *
 * ## Headless UI StackedLayout Features
 * - **Responsive Layout**: Mobile-first with responsive breakpoints
 * - **Mobile Sidebar**: Automatic mobile menu with slide-out drawer
 * - **Glass Morphism**: Beautiful backdrop blur on desktop
 * - **Flexible Structure**: Header navbar, main content area, optional footer
 * - **Stacked Architecture**: Vertical layout pattern ideal for marketing and content pages
 * - **Sticky Header**: Fixed navigation bar stays visible while scrolling
 * - **Accessible**: Proper dialog/drawer implementation for mobile menu
 * - **Touch Optimized**: Expandable touch areas for mobile interactions
 *
 * ## Component Structure
 * ```tsx
 * <StackedLayout
 *   navbar={
 *     <Navbar> // Horizontal navigation bar
 *       <NavbarSection>
 *         <NavbarItem /> // Nav links
 *       </NavbarSection>
 *     </Navbar>
 *   }
 *   sidebar={
 *     <Sidebar> // Mobile-only slide-out menu
 *       <SidebarBody>
 *         <SidebarSection>
 *           <SidebarItem /> // Mobile nav items
 *         </SidebarSection>
 *       </SidebarBody>
 *     </Sidebar>
 *   }
 * >
 *   {children} // Main page content
 * </StackedLayout>
 * ```
 *
 * ## Layout Behavior
 * - **Mobile (< lg)**: Shows hamburger menu, sidebar opens as dialog overlay
 * - **Desktop (≥ lg)**: Shows full navbar, sidebar hidden, content in rounded card
 * - **Background**: White on mobile, zinc-100/zinc-950 on desktop
 * - **Content Card**: White card with shadow and rounded corners on desktop
 * - **Max Width**: Content constrained to max-w-6xl for readability
 *
 * ## Use Cases
 * - Marketing landing pages with header navigation
 * - Blog posts and article pages
 * - Documentation pages with top navigation
 * - Content-focused pages without side navigation
 * - Full-height application layouts
 * - Pages that need mobile hamburger menu
 *
 * ## Ozean Licht Branding
 * This layout uses the primary turquoise color (#0ec2bc) through:
 * - NavbarItem hover and active states
 * - SidebarItem active indicators
 * - Mobile menu overlay backdrop
 * - All integrated through Catalyst's design tokens
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/StackedLayout',
  component: StackedLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A vertical stacked page layout with responsive navbar and mobile sidebar drawer. Perfect for marketing pages, blogs, and content-focused layouts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StackedLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icons for examples (inline SVG)
const SimpleHomeIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
    <path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 0 .75.75H13a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z" />
  </svg>
);

const SimpleUserIcon = () => (
  <svg data-slot="icon" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
  </svg>
);

/**
 * Default stacked layout with basic navigation.
 *
 * The most basic implementation showing the essential structure with navbar and content.
 */
export const Default: Story = {
  render: () => (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/">
              <div className="text-lg font-bold text-white">Brand</div>
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/" current>
              <NavbarLabel>Home</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/about">
              <NavbarLabel>About</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/contact">
              <NavbarLabel>Contact</NavbarLabel>
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current>
                <SimpleHomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/about">
                <SidebarLabel>About</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/contact">
                <SidebarLabel>Contact</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Welcome to Our Site
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          This is a basic stacked layout with a navbar at the top and content below.
          On mobile, the navbar shows a hamburger menu that opens a sidebar drawer.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Feature One
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Description of the first feature goes here.
            </p>
          </div>
          <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Feature Two
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Description of the second feature goes here.
            </p>
          </div>
          <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Feature Three
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Description of the third feature goes here.
            </p>
          </div>
        </div>
      </div>
    </StackedLayout>
  ),
};

/**
 * Marketing landing page layout.
 *
 * Full-featured marketing page with hero section, features, and call-to-action.
 */
export const MarketingPage: Story = {
  render: () => (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0ec2bc] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Ozean Licht</span>
              </div>
            </NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/features">
              <NavbarLabel>Features</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/pricing">
              <NavbarLabel>Pricing</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/docs">
              <NavbarLabel>Docs</NavbarLabel>
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/login">
              <NavbarLabel>Login</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/signup">
              <div className="px-3 py-1.5 bg-[#0ec2bc] text-white rounded-lg font-medium text-sm">
                Get Started
              </div>
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>Navigation</SidebarHeading>
              <SidebarItem href="/" current>
                <Home data-slot="icon" />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/features">
                <Zap data-slot="icon" />
                <SidebarLabel>Features</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/pricing">
                <Package data-slot="icon" />
                <SidebarLabel>Pricing</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/docs">
                <BookOpen data-slot="icon" />
                <SidebarLabel>Docs</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarDivider />
            <SidebarSection>
              <SidebarItem href="/login">
                <User data-slot="icon" />
                <SidebarLabel>Login</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/signup">
                <SidebarLabel>Sign Up</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white">
            Build Better Products
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            The modern platform for creating amazing user experiences.
            Fast, reliable, and beautiful.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-[#0ec2bc] text-white rounded-lg font-semibold hover:bg-[#0db3ad] transition-colors">
              Get Started Free
            </button>
            <button className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Everything You Need
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              All the tools to build and scale your product
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#0ec2bc]/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#0ec2bc]" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Lightning Fast
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Optimized for speed and performance. Your users will love it.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#0ec2bc]/10 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-[#0ec2bc]" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Beautiful UI
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Stunning components built with modern design principles.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#0ec2bc]/10 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-[#0ec2bc]" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Fully Customizable
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Adapt every aspect to match your brand perfectly.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12 bg-gradient-to-r from-[#0ec2bc]/10 to-blue-500/10 rounded-2xl">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Join thousands of teams building better products.
          </p>
          <button className="px-8 py-4 bg-[#0ec2bc] text-white rounded-lg font-semibold text-lg hover:bg-[#0db3ad] transition-colors">
            Start Building Today
          </button>
        </div>
      </div>
    </StackedLayout>
  ),
};

/**
 * Blog post layout.
 *
 * Typical blog article page with header, content, and sidebar for mobile.
 */
export const BlogPost: Story = {
  render: () => (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/">
              <div className="text-lg font-bold text-white">TechBlog</div>
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/articles">
              <NavbarLabel>Articles</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/tutorials">
              <NavbarLabel>Tutorials</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/about">
              <NavbarLabel>About</NavbarLabel>
            </NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search">
              <Search data-slot="icon" />
            </NavbarItem>
            <NavbarItem href="/newsletter">
              <Mail data-slot="icon" />
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>Categories</SidebarHeading>
              <SidebarItem href="/category/tech">
                <FileText data-slot="icon" />
                <SidebarLabel>Technology</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/category/design">
                <SidebarLabel>Design</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/category/business">
                <SidebarLabel>Business</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarDivider />
            <SidebarSection>
              <SidebarItem href="/search">
                <Search data-slot="icon" />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/newsletter">
                <Mail data-slot="icon" />
                <SidebarLabel>Newsletter</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <div className="not-prose mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            <span>Technology</span>
            <span>•</span>
            <span>January 15, 2025</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            The Future of Web Development
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Exploring the latest trends and technologies shaping modern web development.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-12 h-12 bg-[#0ec2bc] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">JD</span>
            </div>
            <div>
              <div className="font-semibold text-zinc-900 dark:text-white">
                Jane Developer
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Senior Engineer
              </div>
            </div>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop"
          alt="Code on screen"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <h2>Introduction</h2>
        <p>
          The web development landscape is constantly evolving. New frameworks, tools, and
          best practices emerge regularly, making it an exciting time to be a developer.
          In this article, we'll explore the key trends shaping the future of web development.
        </p>

        <h2>Modern Frameworks</h2>
        <p>
          React, Vue, and Svelte continue to dominate the frontend space, but new players
          are emerging. The focus has shifted towards performance, developer experience,
          and smaller bundle sizes.
        </p>

        <h3>Server Components</h3>
        <p>
          React Server Components represent a paradigm shift in how we think about
          rendering. By moving more logic to the server, we can reduce JavaScript sent
          to the client while maintaining rich interactivity where needed.
        </p>

        <h2>TypeScript Everywhere</h2>
        <p>
          TypeScript adoption has reached critical mass. It's no longer a question of
          "if" but "when" teams will adopt it. The benefits of type safety and better
          tooling are too significant to ignore.
        </p>

        <h2>Conclusion</h2>
        <p>
          The future of web development looks bright. With powerful new tools and
          frameworks, we can build better experiences faster than ever before. The key
          is staying curious and continuing to learn.
        </p>
      </article>

      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <span>❤️</span>
              <span className="text-zinc-900 dark:text-white">42</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <MessageSquare className="w-4 h-4" />
              <span className="text-zinc-900 dark:text-white">12 Comments</span>
            </button>
          </div>
          <button className="px-4 py-2 bg-[#0ec2bc] text-white rounded-lg font-medium hover:bg-[#0db3ad]">
            Share Article
          </button>
        </div>
      </div>
    </StackedLayout>
  ),
};

/**
 * Documentation page layout.
 *
 * Documentation site with navigation and content structure.
 */
export const DocumentationPage: Story = {
  render: () => (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0ec2bc]" />
                <span className="text-lg font-bold text-white">Docs</span>
              </div>
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/docs" current>
              <NavbarLabel>Documentation</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/api">
              <NavbarLabel>API Reference</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/guides">
              <NavbarLabel>Guides</NavbarLabel>
            </NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search">
              <Search data-slot="icon" />
            </NavbarItem>
            <NavbarItem href="https://github.com">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>Getting Started</SidebarHeading>
              <SidebarItem href="/docs/intro" current>
                <BookOpen data-slot="icon" />
                <SidebarLabel>Introduction</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/docs/install">
                <Package data-slot="icon" />
                <SidebarLabel>Installation</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/docs/quickstart">
                <Zap data-slot="icon" />
                <SidebarLabel>Quick Start</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>Components</SidebarHeading>
              <SidebarItem href="/docs/button">
                <SidebarLabel>Button</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/docs/form">
                <SidebarLabel>Form</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/docs/dialog">
                <SidebarLabel>Dialog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Introduction
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Welcome to the documentation. Learn how to get started and build amazing things.
          </p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex gap-3">
            <div className="text-blue-600 dark:text-blue-400">ℹ️</div>
            <div>
              <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Getting Help
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                Need assistance? Check out our community forum or join our Discord server.
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>What is this?</h2>
          <p>
            This is a comprehensive framework for building modern web applications.
            It provides everything you need to create beautiful, performant, and
            accessible user interfaces.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li><strong>Component Library</strong> - Pre-built, accessible components</li>
            <li><strong>TypeScript Support</strong> - Full type safety out of the box</li>
            <li><strong>Dark Mode</strong> - Built-in dark mode support</li>
            <li><strong>Responsive</strong> - Mobile-first responsive design</li>
            <li><strong>Customizable</strong> - Easy to theme and customize</li>
          </ul>

          <h2>Quick Example</h2>
          <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto">
            <code>{`import { Button } from '@/components/button'

export default function App() {
  return (
    <Button variant="primary">
      Click me
    </Button>
  )
}`}</code>
          </pre>

          <h2>Next Steps</h2>
          <p>
            Ready to get started? Follow our installation guide and build your first
            component in minutes.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <a
            href="/docs/install"
            className="px-6 py-3 bg-[#0ec2bc] text-white rounded-lg font-semibold hover:bg-[#0db3ad] transition-colors"
          >
            Installation Guide →
          </a>
          <a
            href="/examples"
            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            View Examples
          </a>
        </div>
      </div>
    </StackedLayout>
  ),
};

/**
 * Dashboard layout with user menu.
 *
 * Application dashboard using stacked layout pattern.
 */
export const DashboardLayout: Story = {
  render: () => (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/dashboard">
              <div className="text-lg font-bold text-white">Dashboard</div>
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/dashboard" current>
              <SimpleHomeIcon />
              <NavbarLabel>Home</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/analytics">
              <NavbarLabel>Analytics</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/projects">
              <NavbarLabel>Projects</NavbarLabel>
            </NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/notifications">
              <Bell data-slot="icon" />
            </NavbarItem>
            <NavbarItem href="/settings">
              <Settings data-slot="icon" />
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/profile">
              <SimpleUserIcon />
              <NavbarLabel>Profile</NavbarLabel>
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>Main</SidebarHeading>
              <SidebarItem href="/dashboard" current>
                <LayoutDashboard data-slot="icon" />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/analytics">
                <BarChart3 data-slot="icon" />
                <SidebarLabel>Analytics</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/projects">
                <Folder data-slot="icon" />
                <SidebarLabel>Projects</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarDivider />
            <SidebarSection>
              <SidebarItem href="/notifications">
                <Bell data-slot="icon" />
                <SidebarLabel>Notifications</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <Settings data-slot="icon" />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/profile">
                <User data-slot="icon" />
                <SidebarLabel>Profile</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Welcome back, Sarah!
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Here's what's happening with your projects today.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total Projects
              </div>
              <Folder className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">24</div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-2">
              +12% from last month
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Active Users
              </div>
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">1,429</div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-2">
              +8% from last month
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Messages
              </div>
              <MessageSquare className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">89</div>
            <div className="text-sm text-red-600 dark:text-red-400 mt-2">
              -4% from last month
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Revenue
              </div>
              <BarChart3 className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">$12.4k</div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-2">
              +18% from last month
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="p-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#0ec2bc]/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#0ec2bc]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">
                      New project created
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      2 hours ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-[#0ec2bc] text-white rounded-lg font-medium hover:bg-[#0db3ad] transition-colors text-left">
                Create New Project
              </button>
              <button className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left">
                Invite Team Member
              </button>
              <button className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-left">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </StackedLayout>
  ),
};

/**
 * Full height layout.
 *
 * Demonstrates a layout that takes full viewport height with scrollable content.
 */
export const FullHeight: Story = {
  render: () => (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/">
              <div className="text-lg font-bold text-white">App</div>
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current>
                <Home data-slot="icon" />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="min-h-[200vh] space-y-6">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Full Height Layout
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          This layout uses min-h-svh to fill the viewport height. Content is scrollable
          while the navbar remains visible. Scroll down to see more content.
        </p>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Section {i + 1}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Scrollable content section demonstrating full-height layout behavior.
            </p>
          </div>
        ))}
      </div>
    </StackedLayout>
  ),
};

/**
 * Ozean Licht themed layout.
 *
 * Showcases the Ozean Licht turquoise branding (#0ec2bc) throughout the layout.
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <NavbarItem href="/">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0ec2bc] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">Ozean Licht</span>
              </div>
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/" current>
              <NavbarLabel>Platform</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/content">
              <NavbarLabel>Content</NavbarLabel>
            </NavbarItem>
            <NavbarItem href="/community">
              <NavbarLabel>Community</NavbarLabel>
            </NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search">
              <Search data-slot="icon" />
            </NavbarItem>
            <NavbarItem href="/notifications">
              <Bell data-slot="icon" />
            </NavbarItem>
            <NavbarDivider />
            <NavbarItem href="/profile">
              <div className="w-7 h-7 bg-gradient-to-br from-[#0ec2bc] to-[#087E78] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">OL</span>
              </div>
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <div className="px-2 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-[#0ec2bc] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#0ec2bc' }}>
                    Ozean Licht
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Content Platform</p>
              </div>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarHeading style={{ color: '#0ec2bc' }}>Navigation</SidebarHeading>
              <SidebarItem href="/" current>
                <Home data-slot="icon" />
                <SidebarLabel>Platform</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/content">
                <FileText data-slot="icon" />
                <SidebarLabel>Content</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/community">
                <Users data-slot="icon" />
                <SidebarLabel>Community</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarDivider />
            <SidebarSection>
              <SidebarItem href="/search">
                <Search data-slot="icon" />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/notifications">
                <Bell data-slot="icon" />
                <SidebarLabel>Notifications</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0ec2bc]/10 border border-[#0ec2bc]/20 rounded-full">
            <Zap className="w-4 h-4" style={{ color: '#0ec2bc' }} />
            <span className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
              Ozean Licht Content Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white">
            Illuminate Your Content
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A modern content platform for Austrian associations, powered by the ocean's light.
          </p>
          <button
            className="px-8 py-4 text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg hover:shadow-[#0ec2bc]/30"
            style={{ backgroundColor: '#0ec2bc' }}
          >
            Explore Platform
          </button>
        </div>

        {/* Features with Turquoise Accents */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 border border-[#0ec2bc]/20 rounded-lg hover:border-[#0ec2bc]/40 transition-colors">
            <div className="w-12 h-12 bg-[#0ec2bc]/10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" style={{ color: '#0ec2bc' }} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Rich Content
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create and manage beautiful content with our modern editor.
            </p>
          </div>

          <div className="p-6 border border-[#0ec2bc]/20 rounded-lg hover:border-[#0ec2bc]/40 transition-colors">
            <div className="w-12 h-12 bg-[#0ec2bc]/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6" style={{ color: '#0ec2bc' }} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Community
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Connect with members and grow your community engagement.
            </p>
          </div>

          <div className="p-6 border border-[#0ec2bc]/20 rounded-lg hover:border-[#0ec2bc]/40 transition-colors">
            <div className="w-12 h-12 bg-[#0ec2bc]/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" style={{ color: '#0ec2bc' }} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Analytics
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Track your content performance with detailed insights.
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="p-8 rounded-2xl border-2"
          style={{
            backgroundColor: 'rgba(14, 194, 188, 0.05)',
            borderColor: 'rgba(14, 194, 188, 0.2)',
          }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 bg-[#0ec2bc] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Ozean Licht Theme Notes
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                This layout showcases the Ozean Licht turquoise brand color (#0ec2bc)
                applied throughout navigation, accents, buttons, and interactive elements.
                The color represents the ocean's light and energy.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Color Palette */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Color System
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{ backgroundColor: '#0ec2bc' }} />
              <div className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                Primary: #0ec2bc
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-[#0ec2bc]/10 rounded-lg border border-[#0ec2bc]/20" />
              <div className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                Primary/10: Backgrounds
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-[#0ec2bc]/20 rounded-lg border border-[#0ec2bc]/30" />
              <div className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                Primary/20: Borders
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-br from-[#0ec2bc] to-[#087E78] rounded-lg" />
              <div className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                Gradient: to-darker
              </div>
            </div>
          </div>
        </div>
      </div>
    </StackedLayout>
  ),
};
