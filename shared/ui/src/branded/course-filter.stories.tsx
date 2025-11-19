import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';
import { CourseFilter } from './course-filter';

/**
 * CourseFilter - Category filter dropdown for courses.
 *
 * **This is a Tier 2 Branded Component** - styled with Ozean Licht oceanic cyan theme.
 *
 * ## Features
 * - **shadcn/ui Select**: Built on Radix UI Select primitive
 * - **10 Categories**: All, LCQ, Basis, Aufbau, Fortgeschritten, Master, Interview, Q&A, Kostenlos, Intensiv
 * - **Controlled State**: useState for selected filter
 * - **Callback Support**: onFilterChange callback for parent component
 * - **Dark Theme**: Custom dark styling with Ozean colors
 *
 * ## Categories
 * - **all** - Alle Kurse
 * - **lcq** - LCQ - Channeling Events
 * - **basis** - Basis
 * - **aufbau** - Aufbau
 * - **fortgeschritten** - Fortgeschritten
 * - **master** - Master
 * - **interview** - Interview
 * - **q&a** - Q&A
 * - **kostenlos** - Kostenlos
 * - **intensiv** - Intensiv
 *
 * ## Usage
 * Use for filtering course lists by category on the Ozean Licht platform.
 */
const meta = {
  title: 'Tier 2: Branded/CourseFilter',
  component: CourseFilter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A course category filter dropdown with 10 predefined categories and dark theme styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onFilterChange: {
      description: 'Callback fired when filter selection changes',
      action: 'filterChanged',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onFilterChange: fn(),
  },
} satisfies Meta<typeof CourseFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default course filter.
 */
export const Default: Story = {
  args: {},
};

/**
 * With custom className.
 */
export const CustomClassName: Story = {
  args: {
    className: 'my-4',
  },
};

/**
 * Filter in dark background context.
 */
export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-background p-8 rounded-lg">
      <CourseFilter />
    </div>
  ),
};

/**
 * Filter with callback example.
 */
export const WithCallback: Story = {
  render: function WithCallbackExample() {
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

    return (
      <div className="space-y-4">
        <CourseFilter onFilterChange={setSelectedCategory} />
        <div className="text-white text-sm">
          Selected: <span className="text-primary font-medium">{selectedCategory}</span>
        </div>
      </div>
    );
  },
};

/**
 * Multiple filters in a row.
 */
export const MultipleFilters: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <CourseFilter />
      <div className="flex items-center gap-4">
        <span className="text-white font-montserrat-alt text-sm">Preis:</span>
        <select className="bg-card border border-border text-white rounded px-3 py-2">
          <option>Alle Preise</option>
          <option>Kostenlos</option>
          <option>€1 - €50</option>
          <option>€51 - €100</option>
          <option>€100+</option>
        </select>
      </div>
    </div>
  ),
};

/**
 * In a course listing header.
 */
export const InCourseHeader: Story = {
  render: () => (
    <div className="bg-background p-6 rounded-lg max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-cinzel-decorative">Alle Kurse</h2>
        <CourseFilter />
      </div>
      <p className="text-muted-foreground">
        Wähle eine Kategorie um die Kurse zu filtern...
      </p>
    </div>
  ),
};
