import type { Meta, StoryObj } from '@storybook/react';
import { CTASection } from './CTASection';

/**
 * CTASection is a call-to-action section component with compelling message and action buttons.
 * Features glass morphism effects, optional video backgrounds, tags, and social media links.
 *
 * ## Features
 * - Large decorative title with subtitle badge
 * - Optional tag pills with glass morphism
 * - Prominent CTA button with link or click handler
 * - Optional responsive video backgrounds (desktop/tablet/mobile)
 * - Optional social media links with icons
 * - Glass morphism overlay for readability
 * - Rounded border design (40px radius)
 * - Centered content layout
 *
 * ## Usage
 * ```tsx
 * <CTASection
 *   title="Start Your Journey Today"
 *   subtitle="Limited Offer"
 *   tags={['Meditation', 'Yoga', 'Wellness']}
 *   ctaText="Join Now"
 *   ctaHref="/register"
 * />
 * ```
 */
const meta = {
  title: 'Tier 3: Compositions/Sections/CTASection',
  component: CTASection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Call-to-action section composition with video backgrounds, tags, and social links. Features Ozean Licht branding with glass morphism effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main heading text displayed prominently',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle displayed as a badge above the title',
    },
    tags: {
      control: 'object',
      description: 'Array of tag strings displayed as pills below the title',
    },
    ctaText: {
      control: 'text',
      description: 'Text for the call-to-action button',
    },
    ctaHref: {
      control: 'text',
      description: 'URL for the CTA button (if provided, button becomes a link)',
    },
    onCTAClick: {
      action: 'clicked',
      description: 'Click handler for the CTA button (used when ctaHref is not provided)',
    },
    videoSources: {
      control: 'object',
      description: 'Responsive video backgrounds for desktop, tablet, and mobile',
    },
    socialLinks: {
      control: 'object',
      description: 'Array of social media links with icons',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
} satisfies Meta<typeof CTASection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default CTA section with minimal configuration
 */
export const Default: Story = {
  args: {
    title: 'Start Your Journey Today',
    subtitle: 'Join Us',
    ctaText: 'Get Started',
    ctaHref: '/register',
  },
};

/**
 * CTA section with tags showcasing features or benefits
 */
export const WithTags: Story = {
  args: {
    title: 'Transform Your Life with Ozean Licht',
    subtitle: 'Discover Inner Peace',
    tags: ['Meditation', 'Yoga', 'Mindfulness', 'Spiritual Growth'],
    ctaText: 'Begin Your Journey',
    ctaHref: '/courses',
  },
};

/**
 * CTA section with click handler instead of href
 */
export const WithClickHandler: Story = {
  args: {
    title: 'Ready to Get Started?',
    subtitle: 'Free Trial Available',
    tags: ['No Credit Card Required', '14-Day Trial', 'Cancel Anytime'],
    ctaText: 'Start Free Trial',
    onCTAClick: () => alert('CTA button clicked!'),
  },
};

/**
 * CTA section with social media links
 */
export const WithSocialLinks: Story = {
  args: {
    title: 'Connect with Ozean Licht Community',
    subtitle: 'Follow Our Journey',
    ctaText: 'Join Community',
    ctaHref: '/community',
    socialLinks: [
      {
        name: 'Facebook',
        url: 'https://facebook.com/ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        iconBg: 'bg-[#1877F2]',
      },
      {
        name: 'Instagram',
        url: 'https://instagram.com/ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        ),
        iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      },
      {
        name: 'YouTube',
        url: 'https://youtube.com/@ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        ),
        iconBg: 'bg-[#FF0000]',
      },
    ],
  },
};

/**
 * Complete CTA section with all features
 */
export const Complete: Story = {
  args: {
    title: 'Join the Ozean Licht Community Today',
    subtitle: 'Special Launch Offer',
    tags: ['Meditation Courses', 'Live Sessions', 'Community Support', 'Expert Guidance'],
    ctaText: 'Start Your Journey',
    ctaHref: '/register',
    socialLinks: [
      {
        name: 'Facebook',
        url: 'https://facebook.com/ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        iconBg: 'bg-[#1877F2]',
      },
      {
        name: 'Instagram',
        url: 'https://instagram.com/ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        ),
        iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      },
    ],
  },
};

/**
 * Minimal CTA with only title and button
 */
export const Minimal: Story = {
  args: {
    title: 'Ready to Begin?',
    ctaText: 'Get Started',
    ctaHref: '/start',
  },
};

/**
 * CTA with long title demonstrating text balance
 */
export const LongTitle: Story = {
  args: {
    title: 'Embark on a Transformative Journey Toward Inner Peace, Spiritual Growth, and Holistic Wellness',
    subtitle: 'Your Path to Enlightenment',
    tags: ['Meditation', 'Mindfulness', 'Yoga', 'Energy Work', 'Spiritual Coaching'],
    ctaText: 'Start Transformation',
    ctaHref: '/transform',
  },
};

/**
 * CTA with custom styling
 */
export const CustomStyled: Story = {
  args: {
    title: 'Special Offer',
    subtitle: 'Limited Time',
    tags: ['50% Off', 'First Month Free', 'No Commitment'],
    ctaText: 'Claim Offer',
    ctaHref: '/offer',
    className: 'bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10',
  },
};

/**
 * CTA focused on community building
 */
export const Community: Story = {
  args: {
    title: 'Be Part of Something Bigger',
    subtitle: 'Join 10,000+ Members',
    tags: ['Global Community', 'Live Events', 'Expert Teachers', '24/7 Support'],
    ctaText: 'Join Community',
    ctaHref: '/community',
    socialLinks: [
      {
        name: 'Facebook',
        url: 'https://facebook.com/ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        iconBg: 'bg-[#1877F2]',
      },
      {
        name: 'Instagram',
        url: 'https://instagram.com/ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        ),
        iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
      },
      {
        name: 'YouTube',
        url: 'https://youtube.com/@ozeanlicht',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        ),
        iconBg: 'bg-[#FF0000]',
      },
    ],
  },
};

/**
 * CTA for course enrollment
 */
export const CourseEnrollment: Story = {
  args: {
    title: 'Transform Your Practice',
    subtitle: 'Advanced Meditation Course',
    tags: ['8 Weeks', 'Live Sessions', 'Certificate', 'Lifetime Access'],
    ctaText: 'Enroll Now',
    ctaHref: '/courses/advanced-meditation',
  },
};

/**
 * CTA with emphasis on free trial
 */
export const FreeTrial: Story = {
  args: {
    title: 'Try It Risk-Free',
    subtitle: '14-Day Free Trial',
    tags: ['No Credit Card', 'Full Access', 'Cancel Anytime', 'Money-Back Guarantee'],
    ctaText: 'Start Free Trial',
    ctaHref: '/trial',
  },
};

/**
 * All variants showcase in a grid
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-[var(--cosmic-dark)]">
      <CTASection
        title="Default Style"
        subtitle="Basic"
        ctaText="Get Started"
        ctaHref="#"
      />

      <CTASection
        title="With Tags"
        subtitle="Enhanced"
        tags={['Feature 1', 'Feature 2', 'Feature 3']}
        ctaText="Learn More"
        ctaHref="#"
      />

      <CTASection
        title="Complete Example"
        subtitle="Full Featured"
        tags={['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4']}
        ctaText="Join Now"
        ctaHref="#"
        socialLinks={[
          {
            name: 'Facebook',
            url: '#',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            ),
            iconBg: 'bg-[#1877F2]',
          },
          {
            name: 'Instagram',
            url: '#',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            ),
            iconBg: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
          },
        ]}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
