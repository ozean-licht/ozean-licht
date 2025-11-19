import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CourseCard } from './course-card';
import type { Course } from '../types/course';

/**
 * CourseCard - Course card with glass effect and hover animations.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **Glass Morphism**: Glassmorphic card with backdrop blur
 * - **Hover Effects**: Scale animation on image, glow on card
 * - **Price Badge**: Floating price badge with glass effect
 * - **Category Tags**: Color-coded tags for course categories (LCQ, Master, Basis, etc.)
 * - **Sparkle Icon**: Animated sparkle icon on hover
 * - **Responsive**: Adapts to different screen sizes
 *
 * ## Tag Colors
 * - **LCQ**: Yellow
 * - **Master**: Rose/Red
 * - **Basis**: Blue
 * - **Aufbau**: Pink
 * - **Fortgeschritten**: Purple
 * - **Interview / Q&A**: Cyan
 * - **Kostenlos**: Teal/Green
 * - **Intensiv**: Red
 *
 * ## Usage
 * Use for displaying course cards in grids or lists on the Ozean Licht platform.
 */
const meta = {
  title: 'Tier 2: Branded/CourseCard',
  component: CourseCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A course card component with glass morphism, hover animations, and color-coded category tags.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Card variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCourse: Course = {
  slug: 'sample-course',
  title: 'Die Kraft der Meditation',
  subtitle: 'Entdecke innere Ruhe',
  description: 'Lerne die Grundlagen der Meditation und finde deinen Weg zu innerer Ruhe und Gelassenheit.',
  price: 49,
  is_public: true,
  thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=337&fit=crop',
  course_code: 1001,
  tags: ['Basis', 'Kostenlos'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Default course card.
 */
export const Default: Story = {
  args: {
    course: mockCourse,
  },
};

/**
 * Course with LCQ tag (yellow).
 */
export const LCQCourse: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'LCQ Channeling Event',
      tags: ['LCQ'],
      price: 99,
    },
  },
};

/**
 * Course with Master tag (rose).
 */
export const MasterCourse: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Master Level Awakening',
      tags: ['Master', 'Fortgeschritten'],
      price: 299,
    },
  },
};

/**
 * Free course with Kostenlos tag (teal).
 */
export const FreeCourse: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Kostenloser Einführungskurs',
      tags: ['Kostenlos', 'Basis'],
      price: 0,
    },
  },
};

/**
 * Course with multiple tags.
 */
export const MultipleTags: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Umfassender Transformationskurs',
      tags: ['Master', 'Intensiv', 'Fortgeschritten'],
      price: 399,
    },
  },
};

/**
 * Course without thumbnail (fallback).
 */
export const NoThumbnail: Story = {
  args: {
    course: {
      ...mockCourse,
      thumbnail_url_desktop: undefined,
      thumbnail_url_mobile: undefined,
      title: 'Kurs ohne Vorschaubild',
    },
  },
};

/**
 * Long title example.
 */
export const LongTitle: Story = {
  args: {
    course: {
      ...mockCourse,
      title: 'Ein sehr langer Kurstitel der über mehrere Zeilen gehen könnte und zeigt wie die Karte damit umgeht',
      description: 'Eine sehr lange Beschreibung die ebenfalls über mehrere Zeilen gehen könnte und demonstriert wie der Text abgeschnitten wird wenn er zu lang ist.',
    },
  },
};

/**
 * Compact variant.
 */
export const Compact: Story = {
  args: {
    course: mockCourse,
    variant: 'compact',
  },
};

/**
 * Grid of course cards.
 */
export const CourseGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px]">
      <CourseCard course={{ ...mockCourse, title: 'Meditation Basics', tags: ['Basis'] }} />
      <CourseCard course={{ ...mockCourse, title: 'Advanced Channeling', tags: ['Master', 'LCQ'], price: 199 }} />
      <CourseCard course={{ ...mockCourse, title: 'Q&A Session', tags: ['Q&A'], price: 29 }} />
      <CourseCard course={{ ...mockCourse, title: 'Free Introduction', tags: ['Kostenlos'], price: 0 }} />
      <CourseCard course={{ ...mockCourse, title: 'Intensive Workshop', tags: ['Intensiv', 'Fortgeschritten'], price: 299 }} />
      <CourseCard course={{ ...mockCourse, title: 'Interview Special', tags: ['Interview'], price: 49 }} />
    </div>
  ),
};
