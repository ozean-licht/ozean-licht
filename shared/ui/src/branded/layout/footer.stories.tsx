import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './footer'

const meta = {
  title: 'Branded/Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default footer with all features enabled
 */
export const Default: Story = {
  args: {
    showSocialLinks: true,
    copyrightYear: 2025,
  },
}

/**
 * Footer without social media links
 */
export const WithoutSocialLinks: Story = {
  args: {
    showSocialLinks: false,
    copyrightYear: 2025,
  },
}

/**
 * Footer with custom copyright year
 */
export const CustomYear: Story = {
  args: {
    showSocialLinks: true,
    copyrightYear: 2024,
  },
}

/**
 * Minimal footer
 */
export const Minimal: Story = {
  args: {
    showSocialLinks: false,
  },
}
