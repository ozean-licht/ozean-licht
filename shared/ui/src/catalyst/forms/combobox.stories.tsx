import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import {
  Combobox,
  ComboboxOption,
  ComboboxLabel,
  ComboboxDescription,
} from './combobox';
import { Button } from '../navigation/button';

/**
 * Catalyst Combobox component built on Headless UI Combobox.
 *
 * **This is a Tier 1 Primitive** - Headless UI Combobox with Catalyst styling.
 * A searchable select component for filtering and selecting from a list of options.
 *
 * ## Headless UI Combobox Features
 * - **Accessible**: Full keyboard navigation, ARIA attributes, screen reader support
 * - **Searchable**: Built-in input field with filtering capabilities
 * - **Customizable**: Custom rendering for options with icons, avatars, descriptions
 * - **Keyboard Navigation**: Arrow keys, Enter to select, Escape to close
 * - **Virtual Scrolling**: Efficient rendering for large lists
 * - **Anchor Positioning**: Smart positioning relative to input (top/bottom)
 * - **Auto-close**: Closes on selection or clicking outside
 *
 * ## Component Structure
 * ```tsx
 * <Combobox
 *   options={array}
 *   displayValue={(value) => value.name}
 *   filter={(value, query) => custom logic}
 * >
 *   {(option) => (
 *     <ComboboxOption value={option}>
 *       <ComboboxLabel>{option.name}</ComboboxLabel>
 *       <ComboboxDescription>{option.description}</ComboboxDescription>
 *     </ComboboxOption>
 *   )}
 * </Combobox>
 * ```
 *
 * ## Common Use Cases
 * - **Country/State Selector**: Searchable location selection
 * - **User Search**: Find and select users with avatars
 * - **Tag Input**: Select tags from predefined list
 * - **Autocomplete**: Dynamic search with filtering
 * - **API Search**: Async search with loading states
 *
 * ## Key Props
 * - `options`: Array of items to select from
 * - `displayValue`: Function to extract display text from value
 * - `filter`: Optional custom filter function (default: case-insensitive substring match)
 * - `anchor`: Dropdown position ('top' | 'bottom')
 * - `placeholder`: Input placeholder text
 * - `value`: Controlled selected value
 * - `onChange`: Callback when selection changes
 * - `disabled`: Disable the combobox
 */
const meta = {
  title: 'Tier 1: Primitives/Catalyst/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A searchable select component with filtering and keyboard navigation. Built on Headless UI Combobox with Catalyst styling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const countries = [
  { id: 1, name: 'Austria', code: 'AT', continent: 'Europe' },
  { id: 2, name: 'Germany', code: 'DE', continent: 'Europe' },
  { id: 3, name: 'Switzerland', code: 'CH', continent: 'Europe' },
  { id: 4, name: 'Italy', code: 'IT', continent: 'Europe' },
  { id: 5, name: 'France', code: 'FR', continent: 'Europe' },
  { id: 6, name: 'Spain', code: 'ES', continent: 'Europe' },
  { id: 7, name: 'United Kingdom', code: 'GB', continent: 'Europe' },
  { id: 8, name: 'United States', code: 'US', continent: 'North America' },
  { id: 9, name: 'Canada', code: 'CA', continent: 'North America' },
  { id: 10, name: 'Australia', code: 'AU', continent: 'Oceania' },
  { id: 11, name: 'Japan', code: 'JP', continent: 'Asia' },
  { id: 12, name: 'South Korea', code: 'KR', continent: 'Asia' },
];

const users = [
  { id: 1, name: 'Anna Schmidt', email: 'anna@example.com', role: 'Admin' },
  { id: 2, name: 'Max Müller', email: 'max@example.com', role: 'Editor' },
  { id: 3, name: 'Lisa Weber', email: 'lisa@example.com', role: 'Viewer' },
  { id: 4, name: 'Tom Fischer', email: 'tom@example.com', role: 'Editor' },
  { id: 5, name: 'Sarah Becker', email: 'sarah@example.com', role: 'Admin' },
  { id: 6, name: 'Michael Wagner', email: 'michael@example.com', role: 'Viewer' },
];

const tags = [
  { id: 1, name: 'React', color: '#61DAFB' },
  { id: 2, name: 'TypeScript', color: '#3178C6' },
  { id: 3, name: 'JavaScript', color: '#F7DF1E' },
  { id: 4, name: 'Next.js', color: '#000000' },
  { id: 5, name: 'Tailwind CSS', color: '#06B6D4' },
  { id: 6, name: 'Node.js', color: '#339933' },
  { id: 7, name: 'PostgreSQL', color: '#4169E1' },
  { id: 8, name: 'Docker', color: '#2496ED' },
];

/**
 * Default combobox with basic country selection.
 *
 * The most basic implementation with searchable countries list.
 */
export const Default: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={countries}
            displayValue={(country) => country?.name}
            placeholder="Select a country..."
            aria-label="Country"
          >
            {(country) => (
              <ComboboxOption value={country}>
                <ComboboxLabel>{country.name}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Selected: {selected.name} ({selected.code})
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Combobox with descriptions.
 *
 * Shows options with both label and description text.
 */
export const WithDescriptions: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(users[0]);

      return (
        <div className="w-96">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={users}
            displayValue={(user) => user?.name}
            placeholder="Search users..."
            aria-label="User"
          >
            {(user) => (
              <ComboboxOption value={user}>
                <ComboboxLabel>{user.name}</ComboboxLabel>
                <ComboboxDescription>{user.email}</ComboboxDescription>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Selected: {selected.name} - {selected.role}
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Custom option rendering with colors.
 *
 * Shows how to add icons, badges, or custom styling to options.
 */
export const CustomOptions: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(tags[0]);

      return (
        <div className="w-80">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={tags}
            displayValue={(tag) => tag?.name}
            placeholder="Select a technology..."
            aria-label="Technology tag"
          >
            {(tag) => (
              <ComboboxOption value={tag}>
                <div className="flex items-center gap-3">
                  <div
                    className="size-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                    aria-hidden="true"
                  />
                  <ComboboxLabel>{tag.name}</ComboboxLabel>
                </div>
              </ComboboxOption>
            )}
          </Combobox>
          <div className="mt-3 flex items-center gap-2">
            <div
              className="size-6 rounded-full"
              style={{ backgroundColor: selected.color }}
              aria-hidden="true"
            />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {selected.name}
            </p>
          </div>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Custom filter function.
 *
 * Demonstrates custom filtering logic beyond default substring matching.
 */
export const CustomFilter: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      // Custom filter: search by name OR country code
      const customFilter = (country: typeof countries[0], query: string) => {
        const normalizedQuery = query.toLowerCase();
        return (
          country.name.toLowerCase().includes(normalizedQuery) ||
          country.code.toLowerCase().includes(normalizedQuery)
        );
      };

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={countries}
            displayValue={(country) => country?.name}
            filter={customFilter}
            placeholder="Search by name or code..."
            aria-label="Country"
          >
            {(country) => (
              <ComboboxOption value={country}>
                <ComboboxLabel>{country.name}</ComboboxLabel>
                <ComboboxDescription>{country.code}</ComboboxDescription>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Try typing: "AT", "Austria", "US", "Japan"
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Grouped options.
 *
 * Shows how to organize options into groups with headers.
 */
export const WithGroups: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      // Group countries by continent
      const groupedCountries = countries.reduce((acc, country) => {
        if (!acc[country.continent]) {
          acc[country.continent] = [];
        }
        acc[country.continent].push(country);
        return acc;
      }, {} as Record<string, typeof countries>);

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={countries}
            displayValue={(country) => country?.name}
            placeholder="Select a country..."
            aria-label="Country"
          >
            {(country) => {
              // Check if this is the first country in its continent
              const continentCountries = groupedCountries[country.continent];
              const isFirstInGroup =
                continentCountries && continentCountries[0].id === country.id;

              return (
                <>
                  {isFirstInGroup && (
                    <div className="px-3.5 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {country.continent}
                    </div>
                  )}
                  <ComboboxOption value={country}>
                    <ComboboxLabel>{country.name}</ComboboxLabel>
                    <ComboboxDescription>{country.code}</ComboboxDescription>
                  </ComboboxOption>
                </>
              );
            }}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Selected: {selected.name}
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Async search simulation.
 *
 * Demonstrates pattern for async search with loading state.
 */
export const AsyncSearch: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState<typeof countries[0] | null>(null);
      const [options, setOptions] = useState(countries);
      const [loading, setLoading] = useState(false);

      // Simulate async search
      const handleSearch = async (query: string) => {
        if (query === '') {
          setOptions(countries);
          return;
        }

        setLoading(true);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const filtered = countries.filter((country) =>
          country.name.toLowerCase().includes(query.toLowerCase())
        );

        setOptions(filtered);
        setLoading(false);
      };

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={options}
            displayValue={(country) => country?.name}
            placeholder="Search countries..."
            aria-label="Country"
            filter={() => true} // Disable default filter since we handle it in handleSearch
          >
            {(country) => (
              <ComboboxOption value={country}>
                <ComboboxLabel>{country.name}</ComboboxLabel>
                <ComboboxDescription>{country.code}</ComboboxDescription>
              </ComboboxOption>
            )}
          </Combobox>
          {loading && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Searching...
            </p>
          )}
          {selected && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Selected: {selected.name}
            </p>
          )}
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Disabled state.
 *
 * Shows the combobox in disabled state.
 */
export const Disabled: Story = {
  render: () => {
    const [selected, setSelected] = useState(countries[0]);

    return (
      <div className="w-72">
        <Combobox
          value={selected}
          onChange={setSelected}
          options={countries}
          displayValue={(country) => country?.name}
          placeholder="Select a country..."
          aria-label="Country"
          disabled
        >
          {(country) => (
            <ComboboxOption value={country}>
              <ComboboxLabel>{country.name}</ComboboxLabel>
            </ComboboxOption>
          )}
        </Combobox>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          This combobox is disabled and cannot be interacted with.
        </p>
      </div>
    );
  },
};

/**
 * With autofocus.
 *
 * Input automatically receives focus on mount.
 */
export const WithAutoFocus: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={countries}
            displayValue={(country) => country?.name}
            placeholder="Start typing..."
            aria-label="Country"
            autoFocus
          >
            {(country) => (
              <ComboboxOption value={country}>
                <ComboboxLabel>{country.name}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Input is focused automatically
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Top-anchored dropdown.
 *
 * Dropdown opens above the input instead of below.
 */
export const TopAnchored: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      return (
        <div className="w-72 mt-64">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={countries}
            displayValue={(country) => country?.name}
            placeholder="Select a country..."
            aria-label="Country"
            anchor="top"
          >
            {(country) => (
              <ComboboxOption value={country}>
                <ComboboxLabel>{country.name}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Dropdown opens above the input
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Empty state.
 *
 * Shows message when no options match the search query.
 */
export const EmptyState: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState<typeof countries[0] | null>(null);

      // Filter to create intentionally empty state
      const filteredCountries = countries.filter((c) =>
        c.name.toLowerCase().includes('xyz')
      );

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={filteredCountries}
            displayValue={(country) => country?.name}
            placeholder="Search (no results)..."
            aria-label="Country"
          >
            {(country) => (
              <ComboboxOption value={country}>
                <ComboboxLabel>{country.name}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            No matching countries found. The dropdown remains open but empty.
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Controlled state example.
 *
 * Shows how to control combobox value externally with buttons.
 */
export const ControlledState: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      return (
        <div className="space-y-4">
          <div className="w-72">
            <Combobox
              value={selected}
              onChange={setSelected}
              options={countries}
              displayValue={(country) => country?.name}
              placeholder="Select a country..."
              aria-label="Country"
            >
              {(country) => (
                <ComboboxOption value={country}>
                  <ComboboxLabel>{country.name}</ComboboxLabel>
                </ComboboxOption>
              )}
            </Combobox>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              plain
              onClick={() => setSelected(countries[0])}
              disabled={selected === countries[0]}
            >
              Select Austria
            </Button>
            <Button
              plain
              onClick={() => setSelected(countries[7])}
              disabled={selected === countries[7]}
            >
              Select USA
            </Button>
            <Button
              plain
              onClick={() => setSelected(countries[10])}
              disabled={selected === countries[10]}
            >
              Select Japan
            </Button>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Current: {selected.name} ({selected.code})
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Large option list.
 *
 * Demonstrates performance with many options using virtual scrolling.
 */
export const LargeList: Story = {
  render: () => {
    const ComboboxExample = () => {
      // Generate 1000 items
      const largeList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`,
      }));

      const [selected, setSelected] = useState(largeList[0]);

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={largeList}
            displayValue={(item) => item?.name}
            placeholder="Search 1000 items..."
            aria-label="Item"
          >
            {(item) => (
              <ComboboxOption value={item}>
                <ComboboxLabel>{item.name}</ComboboxLabel>
                <ComboboxDescription>{item.description}</ComboboxDescription>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Selected: {selected.name}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Virtual scrolling handles 1000+ items efficiently
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Ozean Licht themed combobox.
 *
 * Demonstrates the Ozean Licht turquoise color (#0ec2bc) with custom styling.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      return (
        <div className="w-72">
          <div className="mb-4">
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: '#0ec2bc' }}
            >
              Select Your Country
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Choose from our list of supported countries
            </p>
          </div>

          <Combobox
            value={selected}
            onChange={setSelected}
            options={countries}
            displayValue={(country) => country?.name}
            placeholder="Search countries..."
            aria-label="Country"
            className="[&:focus-within]:after:ring-[#0ec2bc]"
          >
            {(country) => (
              <ComboboxOption value={country} className="data-focus:bg-[#0ec2bc]">
                <div className="flex items-center justify-between w-full">
                  <ComboboxLabel>{country.name}</ComboboxLabel>
                  <span className="text-xs text-zinc-500">{country.code}</span>
                </div>
              </ComboboxOption>
            )}
          </Combobox>

          <div
            className="mt-4 p-3 rounded-lg"
            style={{
              backgroundColor: 'rgba(14, 194, 188, 0.1)',
              borderLeft: '3px solid #0ec2bc',
            }}
          >
            <p className="text-sm font-medium" style={{ color: '#0ec2bc' }}>
              Selected Country
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
              {selected.name} ({selected.code}) - {selected.continent}
            </p>
          </div>
        </div>
      );
    };

    return <ComboboxExample />;
  },
};

/**
 * Form integration example.
 *
 * Shows combobox integrated in a form with submit handler.
 */
export const FormIntegration: Story = {
  render: () => {
    const FormExample = () => {
      const [country, setCountry] = useState(countries[0]);
      const [user, setUser] = useState(users[0]);
      const [submitted, setSubmitted] = useState<string | null>(null);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(`Country: ${country.name}, User: ${user.name}`);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4 w-96">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Country
            </label>
            <Combobox
              value={country}
              onChange={setCountry}
              options={countries}
              displayValue={(c) => c?.name}
              placeholder="Select country..."
              aria-label="Country"
            >
              {(c) => (
                <ComboboxOption value={c}>
                  <ComboboxLabel>{c.name}</ComboboxLabel>
                  <ComboboxDescription>{c.code}</ComboboxDescription>
                </ComboboxOption>
              )}
            </Combobox>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Assign to User
            </label>
            <Combobox
              value={user}
              onChange={setUser}
              options={users}
              displayValue={(u) => u?.name}
              placeholder="Select user..."
              aria-label="User"
            >
              {(u) => (
                <ComboboxOption value={u}>
                  <ComboboxLabel>{u.name}</ComboboxLabel>
                  <ComboboxDescription>
                    {u.role} - {u.email}
                  </ComboboxDescription>
                </ComboboxOption>
              )}
            </Combobox>
          </div>

          <Button type="submit" color="turquoise">
            Submit Form
          </Button>

          {submitted && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                Form submitted: {submitted}
              </p>
            </div>
          )}
        </form>
      );
    };

    return <FormExample />;
  },
};

/**
 * Interactive test with play function.
 *
 * Tests combobox search and keyboard navigation using Storybook interactions.
 */
export const InteractiveTest: Story = {
  render: () => {
    const ComboboxExample = () => {
      const [selected, setSelected] = useState(countries[0]);

      return (
        <div className="w-72">
          <Combobox
            value={selected}
            onChange={setSelected}
            options={countries}
            displayValue={(country) => country?.name}
            placeholder="Search countries..."
            aria-label="Country"
            data-testid="test-combobox"
          >
            {(country) => (
              <ComboboxOption value={country} data-testid={`option-${country.code}`}>
                <ComboboxLabel>{country.name}</ComboboxLabel>
                <ComboboxDescription>{country.code}</ComboboxDescription>
              </ComboboxOption>
            )}
          </Combobox>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400" data-testid="selected-text">
            Selected: {selected.name}
          </p>
        </div>
      );
    };

    return <ComboboxExample />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    // Find and click the combobox input
    const input = canvas.getByPlaceholderText('Search countries...') as HTMLInputElement;
    await userEvent.click(input);

    // Wait for dropdown to open
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Type to filter
    await userEvent.type(input, 'Ger');

    // Wait for filtering
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Clear input
    await userEvent.clear(input);

    // Type another search
    await userEvent.type(input, 'Japan');

    // Wait for filtering
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};
