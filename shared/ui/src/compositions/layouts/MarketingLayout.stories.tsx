import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MarketingLayout } from './MarketingLayout';
import { HeroSection } from '../sections/HeroSection';
import { FeatureSection } from '../sections/FeatureSection';
import { CTASection } from '../sections/CTASection';
import { Menu, X, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

/**
 * MarketingLayout is a flexible layout composition for marketing sites and landing pages.
 * Features sticky header, flexible content area, and footer with Ozean Licht branding.
 *
 * ## Features
 * - Sticky header with glass morphism effect
 * - Flexible main content area for any composition
 * - Auto-positioned footer with border separator
 * - Full-height layout with proper flexbox structure
 * - Responsive design with mobile-first approach
 * - Integration with section compositions (Hero, Features, CTA)
 * - Ozean Licht cosmic dark theme with turquoise accents
 *
 * ## Usage
 * ```tsx
 * <MarketingLayout
 *   header={<YourHeader />}
 *   footer={<YourFooter />}
 * >
 *   <HeroSection title="Welcome" />
 *   <FeatureSection features={[...]} />
 *   <CTASection title="Get Started" />
 * </MarketingLayout>
 * ```
 *
 * ## Use Cases
 * - Landing pages with hero and feature sections
 * - Marketing sites with multiple content sections
 * - Public-facing pages with consistent branding
 * - Product pages with header navigation and footer
 */
const meta = {
  title: 'Tier 3: Compositions/Layouts/MarketingLayout',
  component: MarketingLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Marketing site layout composition with sticky header, flexible content area, and footer. Perfect for landing pages, marketing sites, and public-facing pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    header: {
      control: false,
      description: 'Header content (typically navigation bar)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    footer: {
      control: false,
      description: 'Footer content (typically links, copyright, social)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    children: {
      control: false,
      description: 'Main content area (sections, hero, features, etc)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the root container',
    },
  },
} satisfies Meta<typeof MarketingLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== Sample Components ====================

/**
 * Sample header with logo and navigation
 */
const SampleHeader = ({ variant = 'default' }: { variant?: 'default' | 'with-cta' | 'minimal' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ec2bc] to-[#0a8f8a] flex items-center justify-center">
            <span className="text-white font-bold text-sm">OL</span>
          </div>
          <span className="font-semibold text-lg text-[var(--foreground)]">Ozean Licht</span>
        </div>

        {/* Desktop Navigation */}
        {variant !== 'minimal' && (
          <nav className="hidden md:flex items-center gap-6">
            <a href="#courses" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Courses
            </a>
            <a href="#about" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              About
            </a>
            <a href="#community" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Community
            </a>
            <a href="#contact" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Contact
            </a>
            {variant === 'with-cta' && (
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0ec2bc] to-[#0a8f8a] text-white font-medium hover:opacity-90 transition-opacity">
                Sign In
              </button>
            )}
          </nav>
        )}

        {/* Mobile Menu Button */}
        {variant !== 'minimal' && (
          <button
            className="md:hidden p-2 text-[var(--foreground)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && variant !== 'minimal' && (
        <nav className="md:hidden mt-4 flex flex-col gap-3 py-4 border-t border-[var(--border)]">
          <a href="#courses" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Courses
          </a>
          <a href="#about" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            About
          </a>
          <a href="#community" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Community
          </a>
          <a href="#contact" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Contact
          </a>
          {variant === 'with-cta' && (
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0ec2bc] to-[#0a8f8a] text-white font-medium hover:opacity-90 transition-opacity w-full">
              Sign In
            </button>
          )}
        </nav>
      )}
    </div>
  );
};

/**
 * Sample footer with links and social media
 */
const SampleFooter = ({ variant = 'default' }: { variant?: 'default' | 'minimal' | 'extended' }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {variant === 'extended' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-3">About</h3>
            <ul className="space-y-2">
              <li><a href="#mission" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Our Mission</a></li>
              <li><a href="#team" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Team</a></li>
              <li><a href="#careers" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#blog" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Blog</a></li>
              <li><a href="#guides" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Guides</a></li>
              <li><a href="#faq" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-3">Support</h3>
            <ul className="space-y-2">
              <li><a href="#help" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Help Center</a></li>
              <li><a href="#contact" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Contact Us</a></li>
              <li><a href="#status" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Privacy</a></li>
              <li><a href="#terms" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Terms</a></li>
              <li><a href="#cookies" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm">Cookies</a></li>
            </ul>
          </div>
        </div>
      )}

      <div className={`flex flex-col ${variant === 'extended' ? 'md:flex-row' : 'md:flex-row'} items-center justify-between gap-4 ${variant === 'extended' ? 'pt-8 border-t border-[var(--border)]' : ''}`}>
        {/* Copyright */}
        <p className="text-sm text-[var(--muted-foreground)]">
          © 2025 Ozean Licht. All rights reserved.
        </p>

        {/* Social Links */}
        {variant !== 'minimal' && (
          <div className="flex items-center gap-4">
            <a href="#facebook" className="text-[var(--muted-foreground)] hover:text-[#0ec2bc] transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#twitter" className="text-[var(--muted-foreground)] hover:text-[#0ec2bc] transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#instagram" className="text-[var(--muted-foreground)] hover:text-[#0ec2bc] transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#youtube" className="text-[var(--muted-foreground)] hover:text-[#0ec2bc] transition-colors" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Sample icons for feature sections
 */
const SparkleIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const LightningIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
  </svg>
);

const HeartIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

// ==================== Story Variants ====================

/**
 * Basic layout with minimal header and footer
 */
export const Default: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader variant="minimal" />}
      footer={<SampleFooter variant="minimal" />}
    >
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Welcome to Ozean Licht</h1>
        <p className="text-center text-[var(--muted-foreground)] max-w-2xl mx-auto">
          This is a basic marketing layout with minimal header and footer. Add your content sections here.
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Complete marketing page with hero section
 */
export const WithHeroSection: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader variant="with-cta" />}
      footer={<SampleFooter />}
    >
      <HeroSection
        title="Transform Your Consciousness"
        subtitle="New Course Available"
        description="Discover ancient wisdom and modern techniques for spiritual growth and personal transformation."
        ctaText="Start Your Journey"
        secondaryCTAText="Learn More"
      />
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-[var(--muted-foreground)]">
          Additional content sections can go here
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Landing page with hero and features
 */
export const LandingPage: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader variant="with-cta" />}
      footer={<SampleFooter variant="extended" />}
    >
      <HeroSection
        title="Unlock Your Potential"
        subtitle="Premium Platform"
        description="Join thousands of seekers on a transformative journey of self-discovery and spiritual growth."
        ctaText="Get Started Free"
        secondaryCTAText="View Demo"
      />
      <FeatureSection
        title="Everything You Need"
        subtitle="Platform Features"
        features={[
          {
            title: 'Guided Meditations',
            description: 'Access hundreds of guided meditations for every level and intention.',
            icon: SparkleIcon,
          },
          {
            title: 'Live Sessions',
            description: 'Join daily live sessions with experienced teachers from around the world.',
            icon: LightningIcon,
          },
          {
            title: 'Community Support',
            description: 'Connect with like-minded individuals on the same spiritual path.',
            icon: HeartIcon,
          },
        ]}
        columns={3}
      />
      <CTASection
        title="Ready to Begin Your Journey?"
        subtitle="Join our community today"
        ctaText="Start Free Trial"
      />
    </MarketingLayout>
  ),
};

/**
 * Marketing page with extended footer
 */
export const WithExtendedFooter: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader />}
      footer={<SampleFooter variant="extended" />}
    >
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold text-center mb-6">About Ozean Licht</h1>
        <p className="text-center text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
          Ozean Licht is an Austrian association dedicated to spiritual growth and transformation.
          We provide courses, workshops, and community resources for seekers worldwide.
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Layout without header (content starts at top)
 */
export const NoHeader: Story = {
  render: () => (
    <MarketingLayout footer={<SampleFooter />}>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold text-center mb-6">No Header Layout</h1>
        <p className="text-center text-[var(--muted-foreground)] max-w-2xl mx-auto">
          This layout has no header, allowing content to start at the very top of the page.
          Useful for special landing pages or immersive experiences.
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Layout without footer (minimal page)
 */
export const NoFooter: Story = {
  render: () => (
    <MarketingLayout header={<SampleHeader />}>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold text-center mb-6">No Footer Layout</h1>
        <p className="text-center text-[var(--muted-foreground)] max-w-2xl mx-auto">
          This layout has no footer. Useful for single-page experiences or when you want
          to control the footer separately.
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Layout with only content (no header or footer)
 */
export const ContentOnly: Story = {
  render: () => (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold text-center mb-6">Content Only</h1>
        <p className="text-center text-[var(--muted-foreground)] max-w-2xl mx-auto">
          This layout has neither header nor footer. Perfect for embedded content
          or when you need complete control over the layout structure.
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Multi-section marketing page
 */
export const MultiSection: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader variant="with-cta" />}
      footer={<SampleFooter variant="extended" />}
    >
      <HeroSection
        title="Welcome to Ozean Licht"
        subtitle="Austrian Spiritual Community"
        description="Your journey to enlightenment begins here"
        ctaText="Join Today"
      />

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Our Mission</h2>
        <p className="text-center text-[var(--muted-foreground)] max-w-3xl mx-auto">
          We believe in the power of spiritual growth to transform lives and create a more
          conscious world. Our platform provides tools, guidance, and community for seekers
          at every stage of their journey.
        </p>
      </section>

      <FeatureSection
        title="What We Offer"
        subtitle="Platform Features"
        features={[
          {
            title: 'Courses & Workshops',
            description: 'Comprehensive learning programs designed by expert teachers.',
            icon: SparkleIcon,
          },
          {
            title: 'Live Events',
            description: 'Regular online and in-person gatherings for practice and connection.',
            icon: LightningIcon,
          },
          {
            title: 'Supportive Community',
            description: 'A warm, welcoming space to share your journey with others.',
            icon: HeartIcon,
          },
        ]}
        columns={3}
      />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Based in Vienna, Austria</h2>
          <p className="text-[var(--muted-foreground)] mb-8">
            Founded in the heart of Europe, we bring together ancient wisdom traditions
            with modern understanding to serve seekers worldwide.
          </p>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-[#0ec2bc] mb-2">10K+</div>
              <div className="text-sm text-[var(--muted-foreground)]">Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0ec2bc] mb-2">500+</div>
              <div className="text-sm text-[var(--muted-foreground)]">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0ec2bc] mb-2">50+</div>
              <div className="text-sm text-[var(--muted-foreground)]">Teachers</div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Begin Your Transformation"
        subtitle="Join our growing community"
        ctaText="Get Started"
      />
    </MarketingLayout>
  ),
};

/**
 * Cosmic theme variant with background
 */
export const CosmicTheme: Story = {
  render: () => (
    <div className="bg-gradient-to-br from-[#0a1628] via-[#0d1f3a] to-[#0a1628]">
      <MarketingLayout
        header={<SampleHeader variant="with-cta" />}
        footer={<SampleFooter />}
      >
        <HeroSection
          title="Cosmic Consciousness"
          subtitle="Advanced Practice"
          description="Explore the depths of universal awareness and connect with the infinite."
          ctaText="Begin Journey"
          secondaryCTAText="Learn More"
          backgroundImage="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop"
        />
        <div className="container mx-auto px-4 py-24">
          <p className="text-center text-white/70 max-w-2xl mx-auto">
            This variant uses the Ozean Licht cosmic dark theme with turquoise accents
            and glass morphism effects throughout.
          </p>
        </div>
      </MarketingLayout>
    </div>
  ),
};

/**
 * Kids Ascension educational layout
 */
export const KidsAscension: Story = {
  render: () => (
    <MarketingLayout
      header={
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">KA</span>
              </div>
              <span className="font-semibold text-lg text-[var(--foreground)]">Kids Ascension</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#courses" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Courses</a>
              <a href="#parents" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">For Parents</a>
              <a href="#about" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">About</a>
            </nav>
          </div>
        </div>
      }
      footer={<SampleFooter variant="minimal" />}
    >
      <HeroSection
        title="Learn, Grow, Ascend"
        subtitle="Educational Excellence"
        description="Empowering young minds through innovative and engaging learning experiences."
        ctaText="Explore Courses"
        secondaryCTAText="Parents Guide"
      />
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Kids Ascension provides a safe, fun, and effective learning environment for children
          to develop their full potential.
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Long scrolling page with multiple sections
 */
export const LongScrolling: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader variant="with-cta" />}
      footer={<SampleFooter variant="extended" />}
    >
      <HeroSection
        title="Comprehensive Spiritual Platform"
        subtitle="Everything You Need"
        description="From beginner to advanced practitioner, we support your entire journey."
        ctaText="Start Free"
        secondaryCTAText="View Plans"
      />

      {[1, 2, 3, 4].map((section) => (
        <section key={section} className="container mx-auto px-4 py-16 border-t border-[var(--border)]">
          <h2 className="text-3xl font-bold text-center mb-6">Section {section}</h2>
          <p className="text-center text-[var(--muted-foreground)] max-w-2xl mx-auto">
            This is section {section} of a long scrolling page. Notice how the header remains
            sticky at the top as you scroll, and the footer stays at the bottom.
          </p>
        </section>
      ))}

      <CTASection
        title="Ready to Transform?"
        subtitle="Start your journey today"
        ctaText="Join Now"
      />
    </MarketingLayout>
  ),
};

/**
 * Mobile-optimized view
 */
export const MobileView: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader variant="with-cta" />}
      footer={<SampleFooter />}
    >
      <HeroSection
        title="Mobile First"
        subtitle="Responsive Design"
        description="Experience perfect layouts on any device, from mobile to desktop."
        ctaText="Try Now"
      />
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-[var(--muted-foreground)]">
          This layout is optimized for mobile devices with touch-friendly navigation
          and responsive typography.
        </p>
      </div>
    </MarketingLayout>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Custom styled layout
 */
export const CustomStyled: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader />}
      footer={<SampleFooter />}
      className="bg-gradient-to-b from-purple-900/20 to-blue-900/20"
    >
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold text-center mb-6">Custom Styling</h1>
        <p className="text-center text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Use the className prop to apply custom background gradients, colors, or other
          styles to the root container.
        </p>
      </div>
    </MarketingLayout>
  ),
};

/**
 * Showcase all layout variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-px bg-[var(--muted)]">
      <div className="bg-[var(--background)]">
        <MarketingLayout
          header={<SampleHeader variant="minimal" />}
          footer={<SampleFooter variant="minimal" />}
        >
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Minimal Variant</h2>
            <p className="text-[var(--muted-foreground)] text-sm">Basic header and footer</p>
          </div>
        </MarketingLayout>
      </div>

      <div className="bg-[var(--background)]">
        <MarketingLayout
          header={<SampleHeader />}
          footer={<SampleFooter />}
        >
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Default Variant</h2>
            <p className="text-[var(--muted-foreground)] text-sm">Standard header with navigation and social footer</p>
          </div>
        </MarketingLayout>
      </div>

      <div className="bg-[var(--background)]">
        <MarketingLayout
          header={<SampleHeader variant="with-cta" />}
          footer={<SampleFooter variant="extended" />}
        >
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Extended Variant</h2>
            <p className="text-[var(--muted-foreground)] text-sm">Full navigation with CTA and extended footer links</p>
          </div>
        </MarketingLayout>
      </div>
    </div>
  ),
};

/**
 * Sticky header demonstration
 */
export const StickyHeaderDemo: Story = {
  render: () => (
    <MarketingLayout
      header={<SampleHeader variant="with-cta" />}
      footer={<SampleFooter />}
    >
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">Sticky Header Demo</h1>
          <p className="text-[var(--muted-foreground)]">
            Scroll down to see the header stick to the top with glass morphism effect
          </p>
        </div>

        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Content Section {i}</h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        ))}
      </div>
    </MarketingLayout>
  ),
};
