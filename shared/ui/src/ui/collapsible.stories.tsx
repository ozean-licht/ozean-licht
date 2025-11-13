import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './collapsible';
import { Button } from '../components/Button';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Settings,
  Filter,
  Menu,
  HelpCircle,
} from 'lucide-react';

/**
 * Collapsible primitive component built on Radix UI Collapsible.
 *
 * **This is a Tier 1 Primitive** - unstyled Radix UI component with minimal default styling.
 * No Tier 2 branded version exists - this component is a foundational primitive.
 *
 * ## Radix UI Collapsible Features
 * - **Accessible**: Proper ARIA attributes, keyboard navigation (Space/Enter to toggle)
 * - **Composable**: Build custom expandable sections with trigger and content
 * - **Smooth Animations**: Built-in CSS animations for opening/closing
 * - **Controlled/Uncontrolled**: Works with or without state management
 * - **Data Attributes**: Exposes [data-state] for custom styling
 * - **Disabled State**: Supports disabled triggers
 *
 * ## Component Structure
 * ```tsx
 * <Collapsible> // Root - manages open/closed state
 *   <CollapsibleTrigger /> // Button that toggles content visibility
 *   <CollapsibleContent> // Content that expands/collapses
 *     {children} // Your expandable content
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 *
 * ## Common Use Cases
 * - **FAQs**: Expandable question/answer sections
 * - **Filters**: Collapsible filter groups in sidebars
 * - **Sidebars**: Expandable navigation sections
 * - **Settings**: Grouped settings panels
 * - **Accordions**: Multiple collapsible sections (combine multiple Collapsibles)
 * - **Details**: Show/hide additional information
 *
 * ## Usage Notes
 * - Use `asChild` prop to render trigger as custom component
 * - Control state with `open` and `onOpenChange` props
 * - Use `disabled` prop to prevent interaction
 * - Animate with CSS using `data-state="open"` or `data-state="closed"`
 * - For mutually exclusive sections, use controlled state to close others
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An interactive component which expands/collapses content. Built on Radix UI Collapsible primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default collapsible with simple text content.
 *
 * The most basic collapsible implementation showing essential structure.
 */
export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Can I use this in my project?
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">
          Yes! This component is built on Radix UI primitives and is free to use in
          your projects.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

/**
 * Collapsible with rotating chevron icon.
 *
 * Shows animated icon rotation based on open/closed state.
 */
export const WithIcon: Story = {
  render: () => {
    const CollapsibleWithIcon = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-[350px] space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              How does it work?
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 text-sm">
              The Collapsible component uses Radix UI primitives to manage state and
              accessibility. When clicked, the trigger toggles the visibility of the
              content with smooth animations.
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    };

    return <CollapsibleWithIcon />;
  },
};

/**
 * Controlled state example.
 *
 * Demonstrates controlling the collapsible state programmatically.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledCollapsible = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div className="w-[350px] space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setIsOpen(true)} size="sm">
              Expand
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
              Collapse
            </Button>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="outline"
              size="sm"
            >
              Toggle
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            State: {isOpen ? 'Open' : 'Closed'}
          </p>
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Controlled Collapsible
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md border px-4 py-3 text-sm">
                This collapsible's state is controlled externally. You can programmatically
                open, close, or toggle it using the buttons above.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    };

    return <ControlledCollapsible />;
  },
};

/**
 * Multiple collapsibles (accordion-like behavior).
 *
 * Shows multiple independent collapsible sections or mutually exclusive ones.
 */
export const MultipleCollapsibles: Story = {
  render: () => {
    const MultipleCollapsiblesDemo = () => {
      const [openSections, setOpenSections] = useState<string[]>([]);

      const toggleSection = (section: string) => {
        setOpenSections((prev) =>
          prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]
        );
      };

      const sections = [
        {
          id: 'section1',
          question: 'What is Radix UI?',
          answer:
            'Radix UI is an open-source component library optimized for fast development, easy maintenance, and accessibility.',
        },
        {
          id: 'section2',
          question: 'How is it different from other libraries?',
          answer:
            'Radix UI provides unstyled, accessible components that give you full control over styling while handling complex interactions and accessibility.',
        },
        {
          id: 'section3',
          question: 'Can I use it with Tailwind CSS?',
          answer:
            'Yes! Radix UI components work perfectly with Tailwind CSS. You have complete freedom to style them however you want.',
        },
      ];

      return (
        <div className="w-[350px] space-y-2">
          {sections.map((section) => {
            const isOpen = openSections.includes(section.id);
            return (
              <Collapsible
                key={section.id}
                open={isOpen}
                onOpenChange={() => toggleSection(section.id)}
                className="space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {section.question}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="rounded-md border px-4 py-3 text-sm">
                    {section.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      );
    };

    return <MultipleCollapsiblesDemo />;
  },
};

/**
 * Nested content with rich formatting.
 *
 * Demonstrates collapsible with complex nested content.
 */
export const NestedContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[450px] space-y-2"
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            View Component Documentation
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md border px-4 py-4 space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Installation</h3>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                npm install @radix-ui/react-collapsible
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Fully accessible with ARIA attributes</li>
                <li>Keyboard navigation support</li>
                <li>Smooth animations</li>
                <li>Controlled and uncontrolled modes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">API Reference</h3>
              <p className="text-muted-foreground">
                See the full API documentation at{' '}
                <a
                  href="https://radix-ui.com"
                  className="text-blue-600 underline"
                >
                  radix-ui.com
                </a>
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

/**
 * FAQ example with help circle icons.
 *
 * Common FAQ pattern with question/answer format.
 */
export const FAQExample: Story = {
  render: () => {
    const FAQDemo = () => {
      const [openItems, setOpenItems] = useState<number[]>([0]);

      const faqs = [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.',
        },
        {
          question: 'How long does shipping take?',
          answer:
            'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight options are available at checkout.',
        },
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day money-back guarantee. Items must be unused and in original packaging. Return shipping is free for defective items.',
        },
        {
          question: 'Do you offer customer support?',
          answer:
            'Yes! Our support team is available 24/7 via email, chat, and phone. Premium customers get priority support with dedicated account managers.',
        },
      ];

      return (
        <div className="w-[450px] space-y-3">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(index);
            return (
              <Collapsible
                key={index}
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenItems(
                    open
                      ? [...openItems, index]
                      : openItems.filter((i) => i !== index)
                  )
                }
                className="space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left font-normal h-auto py-3 px-4 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium">{faq.question}</span>
                    </span>
                    <Plus
                      className={`h-4 w-4 flex-shrink-0 transition-all duration-200 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-3 ml-7 text-sm text-muted-foreground bg-gray-50 rounded-md">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      );
    };

    return <FAQDemo />;
  },
};

/**
 * Filter section for sidebars.
 *
 * Shows collapsible filter groups commonly used in e-commerce or data apps.
 */
export const FilterSection: Story = {
  render: () => {
    const FilterDemo = () => {
      const [openFilters, setOpenFilters] = useState<string[]>(['category', 'price']);

      const toggleFilter = (filter: string) => {
        setOpenFilters((prev) =>
          prev.includes(filter)
            ? prev.filter((f) => f !== filter)
            : [...prev, filter]
        );
      };

      return (
        <div className="w-[300px] space-y-4 border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <Collapsible
            open={openFilters.includes('category')}
            onOpenChange={() => toggleFilter('category')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-2 h-8 font-normal"
              >
                Category
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openFilters.includes('category') ? 'rotate-90' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 space-y-2">
                {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openFilters.includes('price')}
            onOpenChange={() => toggleFilter('price')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-2 h-8 font-normal"
              >
                Price Range
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openFilters.includes('price') ? 'rotate-90' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 space-y-2">
                {['Under $25', '$25 - $50', '$50 - $100', 'Over $100'].map((range) => (
                  <label key={range} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{range}</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openFilters.includes('brand')}
            onOpenChange={() => toggleFilter('brand')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-2 h-8 font-normal"
              >
                Brand
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openFilters.includes('brand') ? 'rotate-90' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 space-y-2">
                {['Apple', 'Samsung', 'Sony', 'LG'].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    };

    return <FilterDemo />;
  },
};

/**
 * Sidebar navigation section.
 *
 * Demonstrates collapsible navigation groups for app sidebars.
 */
export const SidebarSection: Story = {
  render: () => {
    const SidebarDemo = () => {
      const [openSections, setOpenSections] = useState<string[]>(['settings']);

      const toggleSection = (section: string) => {
        setOpenSections((prev) =>
          prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]
        );
      };

      return (
        <div className="w-[280px] border rounded-lg p-3 space-y-1">
          <div className="px-3 py-2 mb-2">
            <h3 className="font-semibold text-sm">Dashboard</h3>
          </div>

          <Collapsible
            open={openSections.includes('settings')}
            onOpenChange={() => toggleSection('settings')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-3 h-9 font-normal hover:bg-gray-100"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openSections.includes('settings') ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-1 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-8 text-sm font-normal"
                >
                  General
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-8 text-sm font-normal"
                >
                  Security
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-8 text-sm font-normal"
                >
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-8 text-sm font-normal"
                >
                  Privacy
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openSections.includes('content')}
            onOpenChange={() => toggleSection('content')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-3 h-9 font-normal hover:bg-gray-100"
              >
                <span className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  Content
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openSections.includes('content') ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-1 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-8 text-sm font-normal"
                >
                  Posts
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-8 text-sm font-normal"
                >
                  Pages
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 h-8 text-sm font-normal"
                >
                  Media
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    };

    return <SidebarDemo />;
  },
};

/**
 * Disabled state example.
 *
 * Shows how to disable collapsible interaction.
 */
export const DisabledState: Story = {
  render: () => (
    <div className="w-[350px] space-y-4">
      <Collapsible className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Enabled Collapsible
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md border px-4 py-3 text-sm">
            This collapsible is enabled and can be toggled.
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible disabled className="space-y-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled
          >
            Disabled Collapsible
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md border px-4 py-3 text-sm">
            This content is not accessible because the collapsible is disabled.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

/**
 * Animation demo with different transitions.
 *
 * Shows various animation styles for opening/closing.
 */
export const AnimationDemo: Story = {
  render: () => {
    const AnimationDemoComponent = () => {
      const [openItems, setOpenItems] = useState<string[]>([]);

      const toggleItem = (item: string) => {
        setOpenItems((prev) =>
          prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
      };

      return (
        <div className="w-[400px] space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Plus/Minus Icon</h3>
            <Collapsible
              open={openItems.includes('plus-minus')}
              onOpenChange={() => toggleItem('plus-minus')}
              className="space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Toggle Content
                  {openItems.includes('plus-minus') ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md border px-4 py-3 text-sm">
                  Content with plus/minus icon indicator.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Rotating Chevron</h3>
            <Collapsible
              open={openItems.includes('rotating')}
              onOpenChange={() => toggleItem('rotating')}
              className="space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Toggle Content
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openItems.includes('rotating') ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md border px-4 py-3 text-sm">
                  Content with rotating chevron down icon.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Chevron Right to Down</h3>
            <Collapsible
              open={openItems.includes('chevron-right')}
              onOpenChange={() => toggleItem('chevron-right')}
              className="space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Toggle Content
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openItems.includes('chevron-right') ? 'rotate-90' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md border px-4 py-3 text-sm">
                  Content with chevron right that rotates to down.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      );
    };

    return <AnimationDemoComponent />;
  },
};

/**
 * Ozean Licht themed examples.
 *
 * Demonstrates the Ozean Licht turquoise color (#0ec2bc) with collapsibles.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const OzeanLichtDemo = () => {
      const [openItems, setOpenItems] = useState<string[]>(['features']);

      const toggleItem = (item: string) => {
        setOpenItems((prev) =>
          prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
      };

      return (
        <div className="w-[400px] space-y-3">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: '#0ec2bc' }}
          >
            Ozean Licht Platform
          </h2>

          <Collapsible
            open={openItems.includes('features')}
            onOpenChange={() => toggleItem('features')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                style={{
                  borderColor: '#0ec2bc',
                  color: openItems.includes('features') ? '#0ec2bc' : undefined,
                }}
              >
                Platform Features
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openItems.includes('features') ? 'rotate-180' : ''
                  }`}
                  style={{ color: '#0ec2bc' }}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                className="rounded-md border px-4 py-3 text-sm"
                style={{ borderColor: '#0ec2bc20', backgroundColor: '#0ec2bc10' }}
              >
                <ul className="space-y-2">
                  <li style={{ color: '#0ec2bc' }}>✓ Content Management</li>
                  <li style={{ color: '#0ec2bc' }}>✓ Educational Resources</li>
                  <li style={{ color: '#0ec2bc' }}>✓ Community Features</li>
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openItems.includes('pricing')}
            onOpenChange={() => toggleItem('pricing')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                style={{
                  borderColor: '#0ec2bc',
                  color: openItems.includes('pricing') ? '#0ec2bc' : undefined,
                }}
              >
                Pricing Options
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openItems.includes('pricing') ? 'rotate-180' : ''
                  }`}
                  style={{ color: '#0ec2bc' }}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                className="rounded-md border px-4 py-3 text-sm"
                style={{ borderColor: '#0ec2bc20', backgroundColor: '#0ec2bc10' }}
              >
                <div className="space-y-2">
                  <div>
                    <strong style={{ color: '#0ec2bc' }}>Free Tier:</strong> Basic features
                  </div>
                  <div>
                    <strong style={{ color: '#0ec2bc' }}>Pro Tier:</strong> Advanced features
                  </div>
                  <div>
                    <strong style={{ color: '#0ec2bc' }}>Enterprise:</strong> Custom solutions
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openItems.includes('support')}
            onOpenChange={() => toggleItem('support')}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                style={{
                  borderColor: '#0ec2bc',
                  color: openItems.includes('support') ? '#0ec2bc' : undefined,
                }}
              >
                Support & Resources
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openItems.includes('support') ? 'rotate-180' : ''
                  }`}
                  style={{ color: '#0ec2bc' }}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div
                className="rounded-md border px-4 py-3 text-sm"
                style={{ borderColor: '#0ec2bc20', backgroundColor: '#0ec2bc10' }}
              >
                <p>
                  Contact our support team 24/7 for assistance with any platform
                  features or questions about your account.
                </p>
                <Button
                  className="mt-3 w-full"
                  style={{ backgroundColor: '#0ec2bc', color: 'white' }}
                >
                  Contact Support
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    };

    return <OzeanLichtDemo />;
  },
};

/**
 * Interactive test with play function.
 *
 * Tests collapsible open/close and keyboard navigation using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          data-testid="collapsible-trigger"
        >
          Toggle Test Content
          <ChevronDown className="h-4 w-4" data-testid="chevron-icon" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent data-testid="collapsible-content">
        <div className="rounded-md border px-4 py-3 text-sm">
          This is the collapsible content that should appear when opened.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initially, content should not be visible
    const content = canvas.queryByTestId('collapsible-content');

    // Click trigger to open
    const trigger = canvas.getByTestId('collapsible-trigger');
    await userEvent.click(trigger);

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Click trigger again to close
    await userEvent.click(trigger);

    // Wait for close animation
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};
