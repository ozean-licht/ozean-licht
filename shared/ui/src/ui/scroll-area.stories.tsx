import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollArea, ScrollBar } from './scroll-area';

/**
 * ScrollArea primitive component built on Radix UI ScrollArea.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with custom scrollbar styling.
 * No Tier 2 branded version exists - this component serves both primitive and branded use cases.
 *
 * ## Radix UI ScrollArea Features
 * - **Custom Scrollbars**: Replaces native scrollbars with styled versions
 * - **Cross-Browser**: Consistent scrollbar appearance across all browsers
 * - **Accessible**: Maintains native scroll behavior and keyboard navigation
 * - **Flexible**: Supports vertical, horizontal, or both scroll directions
 * - **Composable**: Combine with other components for complex layouts
 * - **Touch Support**: Works seamlessly with touch devices
 *
 * ## Component Structure
 * ```tsx
 * <ScrollArea> // Root container with overflow hidden
 *   <ScrollAreaViewport> // Scrollable viewport (automatic)
 *     {children} // Your scrollable content
 *   </ScrollAreaViewport>
 *   <ScrollBar orientation="vertical" /> // Vertical scrollbar (default)
 *   <ScrollBar orientation="horizontal" /> // Horizontal scrollbar (optional)
 *   <ScrollAreaCorner /> // Corner where scrollbars meet (automatic)
 * </ScrollArea>
 * ```
 *
 * ## Usage Notes
 * - ScrollArea includes a default vertical ScrollBar automatically
 * - Add horizontal ScrollBar explicitly for horizontal scrolling
 * - Set container height/width to enable scrolling
 * - Content must exceed container dimensions to show scrollbars
 * - Scrollbars auto-hide when not in use (CSS transition)
 *
 * ## Common Use Cases
 * - Sidebar menus with long navigation lists
 * - Chat windows with message history
 * - Code blocks with syntax highlighting
 * - Image galleries with thumbnail grids
 * - Data tables with many rows/columns
 * - Terms and conditions with long text
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A custom scrollbar component that replaces native browser scrollbars with styled versions. Built on Radix UI ScrollArea primitive for consistent cross-browser behavior.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default vertical scroll example.
 *
 * The most basic ScrollArea implementation with vertical scrolling only.
 */
export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-80 rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-medium leading-none">The Ocean of Light</h4>
        <p className="text-sm text-muted-foreground">
          The ocean represents the vastness of consciousness, where each wave is a
          thought, each ripple an emotion. In the depths below, silence speaks louder
          than any word.
        </p>
        <p className="text-sm text-muted-foreground">
          As we dive deeper into the waters of awareness, we discover treasures long
          forgotten. Ancient wisdom flows through currents of time, connecting past,
          present, and future in a single drop of water.
        </p>
        <p className="text-sm text-muted-foreground">
          The light penetrates the surface, dancing with shadows in an eternal ballet.
          Each beam carries stories from distant stars, reminding us that we are all
          stardust floating in an infinite sea.
        </p>
        <p className="text-sm text-muted-foreground">
          In stillness, we find motion. In darkness, we find light. The paradox of
          existence unfolds in every moment, waiting for those brave enough to look
          within.
        </p>
        <p className="text-sm text-muted-foreground">
          The journey inward is the longest journey, yet it takes no time at all.
          Space collapses when consciousness expands, revealing that everything we
          seek has always been here, now, within.
        </p>
      </div>
    </ScrollArea>
  ),
};

/**
 * Horizontal scroll example.
 *
 * Shows horizontal scrolling with explicit ScrollBar component.
 */
export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="shrink-0 rounded-md bg-slate-100 p-8 text-center"
            style={{ width: '200px' }}
          >
            <h4 className="text-sm font-medium">Card {i + 1}</h4>
            <p className="mt-2 text-xs text-muted-foreground">
              Scroll horizontally to see more
            </p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

/**
 * Both directions scroll.
 *
 * Demonstrates scrolling in both vertical and horizontal directions simultaneously.
 */
export const BothDirections: Story = {
  render: () => (
    <ScrollArea className="h-72 w-96 rounded-md border">
      <div className="p-4">
        <table className="w-max border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Department</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }, (_, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-2 text-sm">User {i + 1}</td>
                <td className="px-4 py-2 text-sm">user{i + 1}@example.com</td>
                <td className="px-4 py-2 text-sm">Developer</td>
                <td className="px-4 py-2 text-sm">Engineering</td>
                <td className="px-4 py-2 text-sm">Active</td>
                <td className="px-4 py-2 text-sm">Vienna, Austria</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

/**
 * Long text content example.
 *
 * Common use case for terms of service, privacy policies, or article content.
 */
export const WithLongContent: Story = {
  render: () => (
    <ScrollArea className="h-96 w-full max-w-2xl rounded-md border p-6">
      <article className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold mb-4">Understanding Consciousness</h1>

        <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
        <p className="text-muted-foreground mb-4">
          Consciousness remains one of the most fascinating and elusive concepts in
          both philosophy and neuroscience. It encompasses our subjective experiences,
          our awareness of ourselves and the world around us, and the mysterious quality
          of what it feels like to be alive and aware.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">The Nature of Awareness</h2>
        <p className="text-muted-foreground mb-4">
          When we examine consciousness, we encounter what philosophers call the
          "hard problem" - explaining how physical processes in the brain give rise
          to subjective experiences. Why does the processing of visual information
          create the experience of seeing the color blue? Why does any physical
          process have an inner, subjective dimension at all?
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Layers of Consciousness</h2>
        <p className="text-muted-foreground mb-4">
          Consciousness appears to operate on multiple levels simultaneously. At the
          most basic level, we have sensory awareness - the raw data of sight, sound,
          touch, taste, and smell. Above this, we have emotional awareness - the
          feelings that color our experiences. Higher still, we find cognitive
          awareness - our thoughts, beliefs, and mental models of reality.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">The Observer Effect</h2>
        <p className="text-muted-foreground mb-4">
          One of the most intriguing aspects of consciousness is its relationship to
          observation. In quantum mechanics, the act of observation appears to affect
          the observed system. This raises profound questions: Does consciousness
          play a fundamental role in the structure of reality itself? Or is this
          correlation merely coincidental?
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">The Illusion of Self</h2>
        <p className="text-muted-foreground mb-4">
          Many contemplative traditions suggest that the sense of a separate,
          independent self is itself an illusion created by consciousness. What we
          experience as "I" may be more accurately described as a process rather
          than an entity - a flowing stream of experiences without a fixed experiencer.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">Conclusion</h2>
        <p className="text-muted-foreground mb-4">
          As we continue to explore consciousness through both scientific inquiry and
          direct contemplative practice, we may discover that the boundaries between
          observer and observed, between mind and matter, are far more fluid than our
          everyday experience suggests. The ocean of consciousness may be deeper and
          more mysterious than we ever imagined.
        </p>
      </article>
    </ScrollArea>
  ),
};

/**
 * Image gallery example.
 *
 * Demonstrates scrollable grid of images/thumbnails.
 */
export const WithImages: Story = {
  render: () => (
    <ScrollArea className="h-96 w-full max-w-2xl rounded-md border p-4">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🌊</div>
              <p className="text-xs text-muted-foreground">Image {i + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/**
 * Code block with syntax highlighting.
 *
 * Common pattern for displaying code snippets with scrollable overflow.
 */
export const CodeBlock: Story = {
  render: () => (
    <ScrollArea className="h-72 w-full max-w-2xl rounded-md border">
      <div className="p-4 bg-slate-950 text-slate-50">
        <pre className="text-sm font-mono">
          <code>{`import { ScrollArea, ScrollBar } from './scroll-area';

export function CodeExample() {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <div className="p-4">
        {data.map((item) => (
          <div key={item.id} className="border-b py-2">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}`}</code>
        </pre>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

/**
 * Chat window example.
 *
 * Demonstrates a typical chat interface with scrollable message history.
 */
export const ChatWindow: Story = {
  render: () => {
    const messages = [
      { id: 1, sender: 'Alice', content: 'Hey, how are you?', time: '10:30' },
      { id: 2, sender: 'You', content: 'I\'m doing great! Just working on some code.', time: '10:31' },
      { id: 3, sender: 'Alice', content: 'Nice! What are you building?', time: '10:32' },
      { id: 4, sender: 'You', content: 'A component library with Storybook. It\'s pretty interesting!', time: '10:33' },
      { id: 5, sender: 'Alice', content: 'That sounds cool. Are you using any specific framework?', time: '10:34' },
      { id: 6, sender: 'You', content: 'Yeah, React with TypeScript and Radix UI primitives.', time: '10:35' },
      { id: 7, sender: 'Alice', content: 'Radix UI is excellent for accessibility!', time: '10:36' },
      { id: 8, sender: 'You', content: 'Absolutely! The composability is really powerful too.', time: '10:37' },
      { id: 9, sender: 'Alice', content: 'Have you tried their ScrollArea component yet?', time: '10:38' },
      { id: 10, sender: 'You', content: 'Actually, I\'m documenting it right now in Storybook! 😄', time: '10:39' },
    ];

    return (
      <div className="w-96 rounded-lg border bg-background shadow-lg">
        <div className="border-b p-4">
          <h3 className="font-semibold">Chat with Alice</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>

        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'You' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender === 'You'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      message.sender === 'You'
                        ? 'text-blue-100'
                        : 'text-slate-500'
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>
    );
  },
};

/**
 * Sidebar navigation menu.
 *
 * Shows a typical sidebar with scrollable navigation links.
 */
export const SidebarMenu: Story = {
  render: () => {
    const menuItems = [
      { category: 'Getting Started', items: ['Introduction', 'Installation', 'Quick Start', 'Configuration'] },
      { category: 'Components', items: ['Button', 'Input', 'Select', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Dialog', 'Sheet', 'Popover', 'Dropdown Menu', 'Context Menu', 'Tooltip'] },
      { category: 'Forms', items: ['Form', 'Form Field', 'Form Control', 'Form Label', 'Form Message', 'Form Description'] },
      { category: 'Layout', items: ['Container', 'Grid', 'Flex', 'Stack', 'Separator', 'Divider'] },
      { category: 'Navigation', items: ['Breadcrumb', 'Pagination', 'Tabs', 'Menu Bar', 'Command'] },
      { category: 'Feedback', items: ['Alert', 'Toast', 'Progress', 'Skeleton', 'Spinner'] },
      { category: 'Advanced', items: ['ScrollArea', 'Accordion', 'Collapsible', 'Carousel', 'Calendar', 'Date Picker'] },
    ];

    return (
      <div className="w-64 rounded-lg border bg-background shadow-lg">
        <div className="border-b p-4">
          <h3 className="font-semibold">Documentation</h3>
        </div>

        <ScrollArea className="h-96">
          <div className="p-4 space-y-4">
            {menuItems.map((section) => (
              <div key={section.category}>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  {section.category}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="block text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  },
};

/**
 * Custom height variations.
 *
 * Shows different height configurations for various use cases.
 */
export const CustomHeight: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-medium mb-2">Small (h-48)</h4>
        <ScrollArea className="h-48 w-80 rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}: This is a scrollable list item
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Medium (h-72)</h4>
        <ScrollArea className="h-72 w-80 rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}: This is a scrollable list item
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Large (h-96)</h4>
        <ScrollArea className="h-96 w-80 rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}: This is a scrollable list item
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed example.
 *
 * Demonstrates the ScrollArea with Ozean Licht turquoise accent color (#0ec2bc).
 */
export const OzeanLichtThemed: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <ScrollArea className="h-96 rounded-lg border-2 border-[#0ec2bc] p-6">
        <article className="space-y-6">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: '#0ec2bc' }}
            >
              Ozean Licht - Ocean of Light
            </h1>
            <p className="text-sm text-muted-foreground">
              A journey through consciousness and awareness
            </p>
          </div>

          <section className="space-y-4">
            <h2
              className="text-xl font-semibold"
              style={{ color: '#0ec2bc' }}
            >
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ozean Licht is dedicated to exploring the depths of consciousness and
              sharing transformative content that illuminates the path to greater
              awareness. Like light penetrating the ocean, our work seeks to bring
              clarity to the mysterious waters of human experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2
              className="text-xl font-semibold"
              style={{ color: '#0ec2bc' }}
            >
              Core Values
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span
                  className="mr-2 mt-1 text-xl"
                  style={{ color: '#0ec2bc' }}
                >
                  •
                </span>
                <div>
                  <h3 className="font-medium">Authenticity</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe in genuine exploration and honest sharing of insights.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span
                  className="mr-2 mt-1 text-xl"
                  style={{ color: '#0ec2bc' }}
                >
                  •
                </span>
                <div>
                  <h3 className="font-medium">Compassion</h3>
                  <p className="text-sm text-muted-foreground">
                    Every journey is unique, and we honor each individual's path.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span
                  className="mr-2 mt-1 text-xl"
                  style={{ color: '#0ec2bc' }}
                >
                  •
                </span>
                <div>
                  <h3 className="font-medium">Curiosity</h3>
                  <p className="text-sm text-muted-foreground">
                    We approach the unknown with wonder and open-mindedness.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span
                  className="mr-2 mt-1 text-xl"
                  style={{ color: '#0ec2bc' }}
                >
                  •
                </span>
                <div>
                  <h3 className="font-medium">Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Insights are valuable only when integrated into daily life.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2
              className="text-xl font-semibold"
              style={{ color: '#0ec2bc' }}
            >
              Our Approach
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We combine ancient wisdom with modern understanding, creating bridges
              between contemplative traditions and contemporary life. Through various
              media formats - articles, videos, podcasts, and interactive experiences -
              we make profound insights accessible to everyone.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The ocean metaphor guides our work: just as the ocean contains infinite
              depths and diversity, so too does consciousness. We invite you to dive
              deep, explore freely, and discover the light that shines within the
              depths of your own awareness.
            </p>
          </section>

          <div
            className="mt-8 p-4 rounded-md border-2"
            style={{ borderColor: '#0ec2bc', backgroundColor: 'rgba(14, 194, 188, 0.05)' }}
          >
            <p className="text-sm text-center font-medium" style={{ color: '#0ec2bc' }}>
              Scroll to explore more about our journey through the ocean of light
            </p>
          </div>
        </article>
      </ScrollArea>

      <style>{`
        /* Custom scrollbar styling for Ozean Licht theme */
        [data-radix-scroll-area-viewport] {
          scrollbar-color: #0ec2bc transparent;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
          background-color: #0ec2bc;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
          background-color: #0da59f;
        }
      `}</style>
    </div>
  ),
};
