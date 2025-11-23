/**
 * ScrollArea Component - Comprehensive Storybook Stories
 * Demonstrates Ozean Licht styling with vertical and horizontal scrolling
 * Features: Glass effect scrollbars, primary color (#0ec2bc), smooth transitions, accessibility
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { ScrollArea } from './scrollarea'
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from './card'

const meta: Meta<typeof ScrollArea> = {
  title: 'CossUI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ScrollArea component from Coss UI adapted for Ozean Licht design system. Features custom styled scrollbars with Ozean primary color (#0ec2bc), glass morphism effects, and smooth hover states. Built on Radix UI with accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

// ============================================================================
// BASIC VERTICAL SCROLLING
// ============================================================================

/**
 * Default vertical scrolling with Ozean Licht styling
 * Demonstrates the primary color (#0ec2bc) scrollbar with glass effect
 */
export const VerticalScrolling: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Vertical Scrolling</CardTitle>
        <CardDescription>Long text content with vertical scroll</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-64 w-full rounded-md border border-border/50 p-4">
          <div className="space-y-4 pr-4">
            <p className="text-sm text-foreground leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris.
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
              adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
              dolore magnam aliquam quaerat voluptatem.
            </p>
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

/**
 * Horizontal scrolling
 * Shows horizontal scroll bar with primary color styling
 */
export const HorizontalScrolling: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Horizontal Scrolling</CardTitle>
        <CardDescription>Wide content requiring horizontal scroll</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="w-full rounded-md border border-border/50 p-4">
          <div className="w-max space-y-3">
            <div className="flex gap-4 pb-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-32 w-48 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center"
                >
                  <span className="text-sm font-medium text-primary">Item {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

/**
 * Both vertical and horizontal scrolling
 * Demonstrates a table-like layout requiring both scroll directions
 */
export const BothDirectionsScrolling: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Both Directions Scrolling</CardTitle>
        <CardDescription>Large data grid with vertical and horizontal scroll</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-64 w-full rounded-md border border-border/50 p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border/30 px-4 py-2 text-left text-sm font-semibold text-primary bg-primary/5">
                  ID
                </th>
                <th className="border border-border/30 px-4 py-2 text-left text-sm font-semibold text-primary bg-primary/5">
                  Name
                </th>
                <th className="border border-border/30 px-4 py-2 text-left text-sm font-semibold text-primary bg-primary/5">
                  Email
                </th>
                <th className="border border-border/30 px-4 py-2 text-left text-sm font-semibold text-primary bg-primary/5">
                  Status
                </th>
                <th className="border border-border/30 px-4 py-2 text-left text-sm font-semibold text-primary bg-primary/5">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 15 }).map((_, i) => (
                <tr key={i} className="hover:bg-card/50 transition-colors">
                  <td className="border border-border/20 px-4 py-2 text-sm text-foreground">
                    {String(i + 1).padStart(3, '0')}
                  </td>
                  <td className="border border-border/20 px-4 py-2 text-sm text-foreground">
                    User {i + 1}
                  </td>
                  <td className="border border-border/20 px-4 py-2 text-sm text-foreground">
                    user{i + 1}@example.com
                  </td>
                  <td className="border border-border/20 px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        i % 3 === 0
                          ? 'bg-green-500/20 text-green-500'
                          : i % 3 === 1
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive'}
                    </span>
                  </td>
                  <td className="border border-border/20 px-4 py-2 text-sm text-foreground">
                    2024-{String((i % 12) + 1).padStart(2, '0')}-{String((i % 28) + 1).padStart(2, '0')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// DIFFERENT CONTENT HEIGHTS
// ============================================================================

/**
 * Small height scroll area - compact view
 * Demonstrates scrollbar behavior in constrained space
 */
export const SmallHeightScroll: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Compact Scroll Area (150px)</CardTitle>
        <CardDescription>Small height with scrollbar always visible</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-[150px] w-full rounded-md border border-border/50 p-4">
          <div className="space-y-2 pr-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-card/50 border border-border/30 hover:bg-card/70 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Short description for item number {i + 1}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

/**
 * Large height scroll area - tall viewport
 * Shows scrollbar with plenty of content
 */
export const LargeHeightScroll: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Large Scroll Area (500px)</CardTitle>
        <CardDescription>Tall viewport with extensive content</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-[500px] w-full rounded-md border border-border/50 p-4">
          <div className="space-y-4 pr-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-card/30 border border-border/30">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Extended content for item {i + 1} with additional details and information
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// CODE BLOCKS
// ============================================================================

/**
 * Code block with syntax highlighting effect
 * Demonstrates scrollable code content with styling
 */
export const CodeBlockScroll: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Code Block Scroll</CardTitle>
        <CardDescription>Scrollable code snippet with highlighting</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-80 w-full rounded-md border border-border/50 bg-black/20 p-4">
          <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap pr-4">
{`import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Tags
        </h4>
        {TAGS.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}

const TAGS = Array.from({ length: 50 }).map(
  (_, i, a) => \`v1.\${a.length - i - 1}\`
)`}
          </pre>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// IMAGE GALLERY
// ============================================================================

/**
 * Horizontal image gallery
 * Demonstrates scrolling through image thumbnails
 */
export const ImageGalleryScroll: Story = {
  render: () => (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Image Gallery Scroll</CardTitle>
        <CardDescription>Horizontally scrollable image gallery with smooth scrollbar</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="w-full rounded-md border border-border/50 p-4">
          <div className="flex gap-4 pb-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-48 w-64 rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-card/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/50 group-hover:text-primary transition-colors">
                      {i + 1}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium">Gallery Item {i + 1}</p>
                    <p className="text-xs text-white/70">High quality image</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// DATA TABLES
// ============================================================================

/**
 * Data table with multiple rows requiring vertical scroll
 * Shows scrollable table content with alternating row styles
 */
export const DataTableScroll: Story = {
  render: () => (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Data Table</CardTitle>
        <CardDescription>Scrollable product inventory table</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-96 w-full rounded-md border border-border/50 p-4">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-8">
              <tr>
                <th className="border-b border-border/30 px-4 py-3 text-left text-sm font-semibold text-primary">
                  Product
                </th>
                <th className="border-b border-border/30 px-4 py-3 text-left text-sm font-semibold text-primary">
                  SKU
                </th>
                <th className="border-b border-border/30 px-4 py-3 text-right text-sm font-semibold text-primary">
                  Stock
                </th>
                <th className="border-b border-border/30 px-4 py-3 text-right text-sm font-semibold text-primary">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }).map((_, i) => (
                <tr
                  key={i}
                  className={`border-b border-border/20 hover:bg-primary/5 transition-colors ${
                    i % 2 === 0 ? 'bg-card/20' : 'bg-transparent'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-foreground">Product {i + 1}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    SKU{String(i + 1000).padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground font-medium">
                    {Math.floor(Math.random() * 500) + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-primary font-semibold">
                    ${(Math.random() * 500 + 10).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// CHAT MESSAGES
// ============================================================================

/**
 * Chat conversation with scrollable message history
 * Demonstrates conversation-style scrolling
 */
export const ChatMessagesScroll: Story = {
  render: () => (
    <Card className="w-[500px] h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat Messages</CardTitle>
        <CardDescription>Scrollable conversation thread</CardDescription>
      </CardHeader>
      <CardPanel className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 w-full rounded-md border border-border/50 p-4">
          <div className="space-y-4 pr-4">
            {Array.from({ length: 15 }).map((_, i) => {
              const isUser = i % 2 === 0
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs rounded-lg px-4 py-3 ${
                      isUser
                        ? 'bg-primary/20 border border-primary/30 text-foreground'
                        : 'bg-card/50 border border-border/30 text-foreground'
                    }`}
                  >
                    <p className="text-sm">
                      {isUser
                        ? `This is my message number ${(i + 1) / 2}`
                        : `This is a response to message ${(i / 2).toFixed(0)}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {String(i + 1).padStart(2, '0')}:{String((i % 60).padStart(2, '0'))}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// DOCUMENTATION PANELS
// ============================================================================

/**
 * Documentation panel with nested sections
 * Shows how ScrollArea works with complex document structures
 */
export const DocumentationPanel: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
        <CardDescription>API reference with scrollable content</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-96 w-full rounded-md border border-border/50 p-6">
          <div className="space-y-6 pr-4">
            {['Overview', 'Installation', 'Getting Started', 'Advanced Usage', 'API Reference', 'Examples', 'Troubleshooting'].map(
              (section, sIdx) => (
                <div key={sIdx}>
                  <h3 className="text-sm font-semibold text-primary mb-2">{section}</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, pIdx) => (
                      <p key={pIdx} className="text-xs text-muted-foreground leading-relaxed">
                        This is section {section} with paragraph {pIdx + 1}. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                      </p>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// SETTINGS LISTS
// ============================================================================

/**
 * Settings list with toggles and options
 * Demonstrates scrollable list of interactive settings items
 */
export const SettingsListScroll: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Settings List</CardTitle>
        <CardDescription>Scrollable configuration options</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-80 w-full rounded-md border border-border/50 p-4">
          <div className="space-y-3 pr-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30 hover:bg-card/70 hover:border-primary/30 transition-all"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Setting {i + 1}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configuration option number {i + 1}
                  </p>
                </div>
                <div className="flex-shrink-0 w-10 h-6 rounded-full bg-primary/30 border border-primary/20"></div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// CUSTOM SCROLLBAR STYLING
// ============================================================================

/**
 * Custom styled scrollbar visibility
 * Highlights the primary color (#0ec2bc) scrollbar with glass effect
 */
export const CustomScrollbarStyling: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Thin Scrollbar (Default)</CardTitle>
          <CardDescription>Standard 2.5px width with Ozean primary color</CardDescription>
        </CardHeader>
        <CardPanel>
          <ScrollArea className="h-64 w-full rounded-md border border-border/50 bg-gradient-to-b from-card/50 to-transparent p-4">
            <div className="space-y-3 pr-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                >
                  <span className="text-sm text-foreground">Item {i + 1} - Hover over scrollbar to see glass effect</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scrollbar with Glass Effect</CardTitle>
          <CardDescription>Primary color (#0ec2bc) with backdrop blur and smooth hover state</CardDescription>
        </CardHeader>
        <CardPanel>
          <ScrollArea className="h-64 w-full rounded-md border border-border/50 p-4 bg-gradient-to-br from-background/50 via-primary/5 to-background/50">
            <div className="space-y-2 pr-4">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="text-xs text-muted-foreground py-2 border-b border-border/20 last:border-0">
                  Line {String(i + 1).padStart(2, '0')}: The scrollbar displays with glass morphism effect
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardPanel>
      </Card>
    </div>
  ),
}

// ============================================================================
// HOVER STATES
// ============================================================================

/**
 * Interactive demo showing hover state transitions
 * Scrollbar becomes brighter and larger on hover
 */
export const HoverStateDemo: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Hover State Transitions</CardTitle>
        <CardDescription>
          Hover over the scrollbar to see the glass effect intensify
        </CardDescription>
      </CardHeader>
      <CardPanel className="space-y-4">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-primary font-medium">
            Scrollbar Features:
          </p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4">
            <li>• Base: bg-primary/70 with glass effect (backdrop-blur-12)</li>
            <li>• Hover: bg-primary/90 with enhanced shadow and border glow</li>
            <li>• Active: Increased opacity with scale-110 transform</li>
            <li>• Smooth transitions: 150ms duration</li>
          </ul>
        </div>

        <ScrollArea className="h-64 w-full rounded-md border border-border/50 p-4">
          <div className="space-y-3 pr-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-gradient-to-r from-card/50 to-primary/5 border border-border/30 hover:border-primary/50 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try hovering the scrollbar while scrolling to see the glass effect
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// ACCESSIBILITY FEATURES
// ============================================================================

/**
 * Accessibility demonstration
 * Shows keyboard navigation and ARIA attributes support
 */
export const AccessibilityFeatures: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Accessibility Features</CardTitle>
        <CardDescription>
          Keyboard navigable with full screen reader support
        </CardDescription>
      </CardHeader>
      <CardPanel className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-600 font-medium mb-2">
            Accessibility Features:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 ml-4">
            <li>• Keyboard scroll support (Up, Down, Left, Right, Home, End)</li>
            <li>• ARIA attributes for screen readers</li>
            <li>• Touch support for mobile devices</li>
            <li>• Focus management and visible focus indicators</li>
            <li>• Semantic HTML structure</li>
          </ul>
        </div>

        <ScrollArea
          className="h-64 w-full rounded-md border border-border/50 p-4"
          role="region"
          aria-label="Scrollable content region"
        >
          <div className="space-y-4 pr-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-card/50 border border-border/30">
                <h4 className="text-sm font-semibold text-primary mb-2">
                  Accessible Item {i + 1}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This content is fully keyboard navigable. Use Tab to navigate, Arrow keys
                  to scroll, and screen readers will announce all content properly.
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-muted-foreground">
          <strong className="text-foreground">Try:</strong> Tab through the page and use arrow keys to scroll
        </div>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// INTERACTIVE CONTROLS DEMO
// ============================================================================

/**
 * Interactive demo with height and width controls
 * Allows testing different scroll area dimensions
 */
export const InteractiveControls: Story = {
  render: () => {
    const [height, setHeight] = React.useState(300)
    const [width, setWidth] = React.useState(500)

    return (
      <div className="space-y-6 w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Scroll Area Demo</CardTitle>
            <CardDescription>
              Adjust width and height to see how scrollbars adapt
            </CardDescription>
          </CardHeader>
          <CardPanel className="space-y-6">
            {/* Controls */}
            <div className="space-y-4 p-4 rounded-lg bg-card/50 border border-border/30">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Height: {height}px
                </label>
                <input
                  type="range"
                  min="150"
                  max="600"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-border/30 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Width: {width}px
                </label>
                <input
                  type="range"
                  min="250"
                  max="800"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-2 bg-border/30 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-lg bg-card/30 border border-border/20 flex justify-center overflow-auto">
              <ScrollArea
                style={{ width: `${width}px`, height: `${height}px` }}
                className="rounded-md border border-border/50 p-4"
              >
                <div className="space-y-4 pr-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 hover:border-primary/50 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground">
                        Content Item {i + 1}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Adjust the width and height controls above to see how the scroll area adapts
                      </p>
                    </div>
                  ))}
                  <div className="text-center py-4 text-xs text-muted-foreground border-t border-border/30">
                    End of content • Current size: {width}×{height}px
                  </div>
                </div>
              </ScrollArea>
            </div>
          </CardPanel>
        </Card>
      </div>
    )
  },
}

// ============================================================================
// NESTED SCROLL AREAS
// ============================================================================

/**
 * Multiple nested scroll areas
 * Demonstrates how independent scroll areas work together
 */
export const NestedScrollAreas: Story = {
  render: () => (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Nested Scroll Areas</CardTitle>
        <CardDescription>Multiple independent scrollable regions</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Categories</h4>
            <ScrollArea className="h-64 w-full rounded-md border border-border/50 p-3">
              <div className="space-y-2 pr-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <button
                    key={i}
                    className="w-full text-left p-3 rounded-lg text-sm font-medium text-foreground bg-card/50 hover:bg-primary/20 border border-border/30 hover:border-primary/50 transition-all"
                  >
                    Category {i + 1}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Items in Category</h4>
            <ScrollArea className="h-64 w-full rounded-md border border-border/50 p-3">
              <div className="space-y-2 pr-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-card/50 border border-border/30 hover:bg-card/70 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                    <p className="text-xs text-muted-foreground">Item description</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// MIXED CONTENT TYPES
// ============================================================================

/**
 * Scroll area with mixed content types
 * Shows how ScrollArea handles diverse content (text, lists, inputs, etc.)
 */
export const MixedContentTypes: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Mixed Content Types</CardTitle>
        <CardDescription>Various content types in one scroll area</CardDescription>
      </CardHeader>
      <CardPanel>
        <ScrollArea className="h-96 w-full rounded-md border border-border/50 p-6">
          <div className="space-y-6 pr-4">
            {/* Text Section */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">Text Content</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* List Section */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">Features</h3>
              <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                <li>• Primary color scrollbar (#0ec2bc)</li>
                <li>• Glass morphism effect with backdrop blur</li>
                <li>• Smooth hover and active states</li>
                <li>• Both vertical and horizontal scrolling</li>
                <li>• Full keyboard accessibility</li>
              </ul>
            </div>

            {/* Card-like Section */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">Details</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-card/50 border border-border/30">
                  <p className="text-xs font-medium text-foreground">Detail 1</p>
                  <p className="text-xs text-muted-foreground mt-1">Description for detail 1</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-border/30">
                  <p className="text-xs font-medium text-foreground">Detail 2</p>
                  <p className="text-xs text-muted-foreground mt-1">Description for detail 2</p>
                </div>
              </div>
            </div>

            {/* Code Section */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">Code Example</h3>
              <pre className="text-xs bg-black/30 p-3 rounded-lg text-green-400 font-mono border border-border/30 overflow-auto">
{`<ScrollArea>
  <div className="p-4">
    Your content here
  </div>
</ScrollArea>`}
              </pre>
            </div>

            {/* End Marker */}
            <div className="text-center pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                End of scrollable content
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardPanel>
    </Card>
  ),
}

// ============================================================================
// SCROLLBAR POSITION INDICATOR
// ============================================================================

/**
 * ScrollArea with position indicator
 * Visual feedback showing scroll position
 */
export const ScrollPositionIndicator: Story = {
  render: () => {
    const [scrollPosition, setScrollPosition] = React.useState(0)

    return (
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Scroll Position Indicator</CardTitle>
          <CardDescription>Track scroll position in real-time</CardDescription>
        </CardHeader>
        <CardPanel className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
            <span className="text-xs font-medium text-foreground">
              Scroll Progress
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round(scrollPosition)}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-border/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-200"
              style={{ width: `${scrollPosition}%` }}
            ></div>
          </div>

          <ScrollArea
            className="h-64 w-full rounded-md border border-border/50 p-4"
            onScroll={(e) => {
              const element = e.currentTarget
              const scrollPercentage =
                (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100 || 0
              setScrollPosition(Math.min(100, Math.max(0, scrollPercentage)))
            }}
          >
            <div className="space-y-4 pr-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gradient-to-r from-card/50 to-primary/5 border border-border/30"
                >
                  <p className="text-sm font-medium text-foreground">Item {i + 1}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scroll down to see the progress indicator update
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardPanel>
      </Card>
    )
  },
}
