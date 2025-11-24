import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CourseCardModern } from './course-card-modern';
import type { Course } from '../types/course';

/**
 * CourseCardModern - Modern course card with reliable image loading.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Reliable Image Loading**: Custom ReliableImage component with fallback
 * - **SVG Fallback**: Generates SVG fallback images if thumbnail fails to load
 * - **Loading State**: Shows spinner while image loads
 * - **Price Badge**: Floating price badge with blur effect
 * - **Meta Information**: Shows availability and lifetime access indicators
 * - **CTA Button**: Uses PrimaryButton component
 *
 * ## Image Handling
 * - Tries thumbnail_url_desktop first
 * - Falls back to thumbnail_url_mobile
 * - Generates SVG fallback with course title if both fail
 * - Shows loading spinner during image load
 *
 * ## Usage
 * Use for modern course card display with robust image handling on Ozean Licht platform.
 */
const meta = {
  title: 'Tier 2: Branded/CourseCardModern',
  component: CourseCardModern,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modern course card with reliable image loading, SVG fallbacks, and glassmorphic design.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CourseCardModern>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCourse: Course = {
  slug: 'modern-course',
  title: 'Spirituelle Transformation',
  description: 'Entdecke transformative Inhalte für dein spirituelles Wachstum und deine persönliche Entwicklung. Dieser Kurs bietet dir alle Werkzeuge.',
  price: 79,
  is_public: true,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=337&fit=crop',
  course_code: 2001,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Default modern course card.
 */
export const Default: Story = {
  args: {
    course: mockCourse,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Course with working image URL.
 */
export const WithImage: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Meditation & Achtsamkeit',
      thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=337&fit=crop',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Course without image (shows SVG fallback).
 */
export const WithoutImage: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Kurs ohne Bild',
      thumbnail_url_desktop: undefined,
      thumbnail_url_mobile: undefined,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Free course (price = 0).
 */
export const FreeCourse: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Kostenloser Einführungskurs',
      price: 0,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Premium course (high price).
 */
export const PremiumCourse: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Premium Master Class',
      description: 'Eine exklusive Master Class für fortgeschrittene Teilnehmer mit umfassenden Inhalten und persönlicher Betreuung.',
      price: 499,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Long title and description.
 */
export const LongContent: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Ein sehr langer Kurstitel der zeigt wie die Karte mit viel Text umgeht und ob alles richtig dargestellt wird',
      description: 'Eine sehr ausführliche Beschreibung die deutlich mehr als 120 Zeichen enthält und demonstriert wie der Text nach 120 Zeichen abgeschnitten wird mit drei Punkten am Ende um anzuzeigen dass es noch mehr Text gibt.',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Short description.
 */
export const ShortDescription: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Kurzer Kurs',
      description: 'Kurze Beschreibung.',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * No description (uses fallback).
 */
export const NoDescription: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Kurs ohne Beschreibung',
      description: undefined,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Grid of modern course cards.
 */
export const CourseGrid: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto px-8 py-12">
      <CourseCardModern course={{ ...mockCourse, title: 'Meditation Basics', price: 49 }} />
      <CourseCardModern course={{ ...mockCourse, title: 'Advanced Channeling', price: 199 }} />
      <CourseCardModern course={{ ...mockCourse, title: 'Free Introduction', price: 0 }} />
      <CourseCardModern course={{ ...mockCourse, title: 'Master Class', price: 399 }} />
      <CourseCardModern course={{ ...mockCourse, title: 'Q&A Session', price: 29 }} />
      <CourseCardModern course={{ ...mockCourse, title: 'Weekend Workshop', price: 149 }} />
    </div>
  ),
};
