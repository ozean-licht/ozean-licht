import type { Meta, StoryObj } from '@storybook/react'
import {
  Frame,
  FrameHeader,
  FrameTitle,
  FrameContent,
  FrameFooter,
} from './frame'
import { Button } from './button'
import { Play, Image, BarChart3, Map, Smartphone, Laptop, Watch } from 'lucide-react'

const meta: Meta<typeof Frame> = {
  title: 'CossUI/Frame',
  component: Frame,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Frame component for embedding and containing content with support for aspect ratios, variants, and glass morphism effects adapted for Ozean Licht design system.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Frame>

export const Default: Story = {
  render: () => (
    <Frame className="w-[600px]">
      <FrameHeader>
        <FrameTitle>Default Frame</FrameTitle>
      </FrameHeader>
      <FrameContent className="p-6">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This is a basic frame component with default styling. It provides a
          container for content with consistent borders and background.
        </p>
      </FrameContent>
    </Frame>
  ),
}

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Frame className="w-[600px]">
      <FrameHeader>
        <FrameTitle>Frame with Header and Footer</FrameTitle>
      </FrameHeader>
      <FrameContent className="p-6">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This frame demonstrates the full structure with header, content, and
          footer sections for maximum flexibility.
        </p>
      </FrameContent>
      <FrameFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save
        </Button>
      </FrameFooter>
    </Frame>
  ),
}

export const VideoEmbed: Story = {
  render: () => (
    <Frame className="w-[800px]" aspectRatio="16/9" variant="bordered">
      <FrameContent className="flex items-center justify-center bg-gradient-to-br from-[#00070F] to-[#055D75]/20">
        <div className="text-center space-y-2">
          <Play className="w-16 h-16 mx-auto text-primary" />
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            16:9 Video Player Container
          </p>
        </div>
      </FrameContent>
    </Frame>
  ),
}

export const ImageFrame: Story = {
  render: () => (
    <Frame className="w-[500px]" aspectRatio="4/3" variant="elevated">
      <FrameContent className="flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
        <div className="text-center space-y-2">
          <Image className="w-16 h-16 mx-auto text-primary" />
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            4:3 Image Container
          </p>
        </div>
      </FrameContent>
      <FrameFooter>
        <p className="text-xs text-[#C4C8D4] font-sans font-light">
          Image caption or metadata
        </p>
      </FrameFooter>
    </Frame>
  ),
}

export const CodePreview: Story = {
  render: () => (
    <Frame className="w-[700px]" variant="glass">
      <FrameHeader className="flex items-center justify-between">
        <FrameTitle>Code Preview</FrameTitle>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
      </FrameHeader>
      <FrameContent className="p-4 font-mono text-sm">
        <pre className="text-[#C4C8D4]">
          <code>{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`}</code>
        </pre>
      </FrameContent>
    </Frame>
  ),
}

export const DashboardWidget: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6 bg-background rounded-lg">
      <Frame variant="glass" padding="lg">
        <div className="space-y-4">
          <h4 className="font-alt text-sm font-medium text-white">
            Active Users
          </h4>
          <div className="text-4xl font-decorative text-primary">2,543</div>
          <p className="text-xs text-green-500">↑ 12% from last week</p>
        </div>
      </Frame>

      <Frame variant="glass" padding="lg">
        <div className="space-y-4">
          <h4 className="font-alt text-sm font-medium text-white">Revenue</h4>
          <div className="text-4xl font-decorative text-primary">$45.2k</div>
          <p className="text-xs text-green-500">↑ 8% from last week</p>
        </div>
      </Frame>

      <Frame variant="glass" padding="lg">
        <div className="space-y-4">
          <h4 className="font-alt text-sm font-medium text-white">
            Conversion
          </h4>
          <div className="text-4xl font-decorative text-primary">3.24%</div>
          <p className="text-xs text-red-500">↓ 2% from last week</p>
        </div>
      </Frame>

      <Frame variant="glass" padding="lg">
        <div className="space-y-4">
          <h4 className="font-alt text-sm font-medium text-white">Projects</h4>
          <div className="text-4xl font-decorative text-primary">17</div>
          <p className="text-xs text-yellow-500">→ Same as last week</p>
        </div>
      </Frame>
    </div>
  ),
}

export const ChartContainer: Story = {
  render: () => (
    <Frame className="w-[800px]" variant="elevated">
      <FrameHeader>
        <FrameTitle>Analytics Overview</FrameTitle>
      </FrameHeader>
      <FrameContent className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <BarChart3 className="w-16 h-16 mx-auto text-primary" />
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Chart visualization would appear here
          </p>
          <div className="flex gap-4 justify-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[#C4C8D4]">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-[#C4C8D4]">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[#C4C8D4]">Sessions</span>
            </div>
          </div>
        </div>
      </FrameContent>
      <FrameFooter className="flex justify-between items-center">
        <p className="text-xs text-[#C4C8D4]">Last updated: 2 minutes ago</p>
        <Button variant="ghost" size="sm">
          Refresh
        </Button>
      </FrameFooter>
    </Frame>
  ),
}

export const MapContainer: Story = {
  render: () => (
    <Frame className="w-[700px]" aspectRatio="16/9" variant="bordered">
      <FrameHeader>
        <FrameTitle>Location Map</FrameTitle>
      </FrameHeader>
      <FrameContent className="flex items-center justify-center bg-gradient-to-br from-[#00070F] via-[#055D75]/10 to-[#00070F]">
        <div className="text-center space-y-2">
          <Map className="w-16 h-16 mx-auto text-primary" />
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Interactive map would appear here
          </p>
        </div>
      </FrameContent>
    </Frame>
  ),
}

export const SixteenByNine: Story = {
  name: '16:9 Aspect Ratio',
  render: () => (
    <Frame className="w-[640px]" aspectRatio="16/9" variant="default">
      <FrameContent className="flex items-center justify-center bg-card/30">
        <div className="text-center">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            16:9 Aspect Ratio
          </p>
          <p className="text-xs text-[#C4C8D4]/60 mt-1">640×360px</p>
        </div>
      </FrameContent>
    </Frame>
  ),
}

export const FourByThree: Story = {
  name: '4:3 Aspect Ratio',
  render: () => (
    <Frame className="w-[640px]" aspectRatio="4/3" variant="default">
      <FrameContent className="flex items-center justify-center bg-card/30">
        <div className="text-center">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            4:3 Aspect Ratio
          </p>
          <p className="text-xs text-[#C4C8D4]/60 mt-1">640×480px</p>
        </div>
      </FrameContent>
    </Frame>
  ),
}

export const SquareFrame: Story = {
  render: () => (
    <Frame className="w-[400px]" aspectRatio="1/1" variant="default">
      <FrameContent className="flex items-center justify-center bg-card/30">
        <div className="text-center">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            1:1 Square Aspect Ratio
          </p>
          <p className="text-xs text-[#C4C8D4]/60 mt-1">400×400px</p>
        </div>
      </FrameContent>
    </Frame>
  ),
}

export const BorderedVariant: Story = {
  render: () => (
    <Frame className="w-[600px]" variant="bordered" padding="lg">
      <div className="space-y-2">
        <h4 className="font-alt text-base font-medium text-white">
          Bordered Variant
        </h4>
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This frame uses the bordered variant with a stronger border color for
          emphasis. The border uses the primary color with reduced opacity.
        </p>
      </div>
    </Frame>
  ),
}

export const ElevatedVariant: Story = {
  render: () => (
    <div className="p-8 bg-background rounded-lg">
      <Frame className="w-[600px]" variant="elevated" padding="lg">
        <div className="space-y-2">
          <h4 className="font-alt text-base font-medium text-white">
            Elevated Variant
          </h4>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            This frame appears elevated with a shadow effect. The shadow uses
            the primary color to create a subtle glow that enhances depth.
          </p>
        </div>
      </Frame>
    </div>
  ),
}

export const GlassVariant: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-[#055D75]/20 rounded-lg">
      <Frame className="w-[600px]" variant="glass" padding="lg">
        <div className="space-y-2">
          <h4 className="font-alt text-base font-medium text-white">
            Glass Variant
          </h4>
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            This frame uses a glass morphism effect with backdrop blur and
            semi-transparent background. Perfect for overlays and modern UI
            designs.
          </p>
        </div>
      </Frame>
    </div>
  ),
}

export const PaddingSizes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6 bg-background rounded-lg">
      <Frame variant="bordered" padding="none" className="w-full">
        <div className="p-3 bg-primary/5">
          <p className="text-xs text-[#C4C8D4]">No padding (padding="none")</p>
        </div>
      </Frame>

      <Frame variant="bordered" padding="sm" className="w-full">
        <p className="text-xs text-[#C4C8D4]">Small padding (padding="sm")</p>
      </Frame>

      <Frame variant="bordered" padding="md" className="w-full">
        <p className="text-xs text-[#C4C8D4]">Medium padding (padding="md")</p>
      </Frame>

      <Frame variant="bordered" padding="lg" className="w-full">
        <p className="text-xs text-[#C4C8D4]">Large padding (padding="lg")</p>
      </Frame>

      <Frame variant="bordered" padding="xl" className="w-full col-span-2">
        <p className="text-xs text-[#C4C8D4]">
          Extra large padding (padding="xl")
        </p>
      </Frame>
    </div>
  ),
}

export const NestedFrames: Story = {
  render: () => (
    <Frame className="w-[700px]" variant="elevated">
      <FrameHeader>
        <FrameTitle>Outer Frame</FrameTitle>
      </FrameHeader>
      <FrameContent className="p-6 space-y-4">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          Frames can be nested for complex layouts and hierarchical content
          structures.
        </p>

        <Frame variant="glass" padding="md">
          <div className="space-y-2">
            <h5 className="font-alt text-sm font-medium text-white">
              Nested Frame 1
            </h5>
            <p className="text-xs text-[#C4C8D4] font-sans font-light">
              This is the first nested frame with glass effect.
            </p>
          </div>
        </Frame>

        <Frame variant="bordered" padding="md">
          <div className="space-y-2">
            <h5 className="font-alt text-sm font-medium text-white">
              Nested Frame 2
            </h5>
            <p className="text-xs text-[#C4C8D4] font-sans font-light">
              This is the second nested frame with bordered variant.
            </p>
          </div>
        </Frame>
      </FrameContent>
    </Frame>
  ),
}

export const ResponsiveFrame: Story = {
  render: () => (
    <Frame className="w-full max-w-4xl" variant="glass">
      <FrameHeader>
        <FrameTitle>Responsive Frame</FrameTitle>
      </FrameHeader>
      <FrameContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded bg-card/30 border border-[#0E282E]">
            <p className="text-xs text-[#C4C8D4]">Grid Item 1</p>
          </div>
          <div className="p-4 rounded bg-card/30 border border-[#0E282E]">
            <p className="text-xs text-[#C4C8D4]">Grid Item 2</p>
          </div>
          <div className="p-4 rounded bg-card/30 border border-[#0E282E]">
            <p className="text-xs text-[#C4C8D4]">Grid Item 3</p>
          </div>
          <div className="p-4 rounded bg-card/30 border border-[#0E282E]">
            <p className="text-xs text-[#C4C8D4]">Grid Item 4</p>
          </div>
          <div className="p-4 rounded bg-card/30 border border-[#0E282E]">
            <p className="text-xs text-[#C4C8D4]">Grid Item 5</p>
          </div>
          <div className="p-4 rounded bg-card/30 border border-[#0E282E]">
            <p className="text-xs text-[#C4C8D4]">Grid Item 6</p>
          </div>
        </div>
      </FrameContent>
      <FrameFooter>
        <p className="text-xs text-[#C4C8D4] font-sans font-light">
          Resize the viewport to see responsive behavior (1 → 2 → 3 columns)
        </p>
      </FrameFooter>
    </Frame>
  ),
}

export const AccessibleFrame: Story = {
  render: () => (
    <Frame
      className="w-[600px]"
      variant="elevated"
      aria-label="Important notification frame"
    >
      <FrameHeader>
        <FrameTitle id="frame-title">Accessible Frame</FrameTitle>
      </FrameHeader>
      <FrameContent className="p-6" aria-labelledby="frame-title">
        <p className="text-sm text-[#C4C8D4] font-sans font-light">
          This frame demonstrates proper ARIA attributes for accessibility. It
          includes role="region", aria-label, and proper heading structure for
          screen readers.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-[#C4C8D4] list-disc list-inside">
          <li>Semantic HTML structure</li>
          <li>ARIA labels and roles</li>
          <li>Keyboard navigation support</li>
          <li>Screen reader friendly</li>
        </ul>
      </FrameContent>
      <FrameFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" aria-label="Dismiss notification">
          Dismiss
        </Button>
        <Button variant="primary" size="sm" aria-label="View details">
          View Details
        </Button>
      </FrameFooter>
    </Frame>
  ),
}

export const ProductShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-background rounded-lg">
      <Frame variant="glass" aspectRatio="1/1">
        <FrameContent className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
          <div className="text-center">
            <Smartphone className="w-16 h-16 mb-2 mx-auto text-primary" />
            <p className="text-sm text-white font-alt">Product A</p>
          </div>
        </FrameContent>
        <FrameFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-sm text-[#C4C8D4]">$299</span>
            <Button variant="primary" size="sm">
              Buy Now
            </Button>
          </div>
        </FrameFooter>
      </Frame>

      <Frame variant="glass" aspectRatio="1/1">
        <FrameContent className="flex items-center justify-center bg-gradient-to-br from-green-500/10 to-transparent">
          <div className="text-center">
            <Laptop className="w-16 h-16 mb-2 mx-auto text-primary" />
            <p className="text-sm text-white font-alt">Product B</p>
          </div>
        </FrameContent>
        <FrameFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-sm text-[#C4C8D4]">$599</span>
            <Button variant="primary" size="sm">
              Buy Now
            </Button>
          </div>
        </FrameFooter>
      </Frame>

      <Frame variant="glass" aspectRatio="1/1">
        <FrameContent className="flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-transparent">
          <div className="text-center">
            <Watch className="w-16 h-16 mb-2 mx-auto text-primary" />
            <p className="text-sm text-white font-alt">Product C</p>
          </div>
        </FrameContent>
        <FrameFooter>
          <div className="flex justify-between items-center w-full">
            <span className="text-sm text-[#C4C8D4]">$399</span>
            <Button variant="primary" size="sm">
              Buy Now
            </Button>
          </div>
        </FrameFooter>
      </Frame>
    </div>
  ),
}
