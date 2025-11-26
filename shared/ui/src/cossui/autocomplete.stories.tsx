/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from "@storybook/react";
import React from "react";
import {
  CossUIAutocompleteRoot,
  CossUIAutocompleteInput,
  CossUIAutocompleteTrigger,
  CossUIAutocompleteIcon,
  CossUIAutocompletePopup,
  CossUIAutocompleteList,
  CossUIAutocompleteItem,
  CossUIAutocompleteGroup,
  CossUIAutocompleteGroupLabel,
  CossUIAutocompleteSeparator,
  CossUIAutocompleteEmpty,
  CossUIAutocompleteClear,
  CossUIAutocompleteChips,
  CossUIAutocompleteChip,
  CossUIAutocompleteChipRemove,
} from "./autocomplete";
import { Label } from "./label";

const meta: Meta = {
  title: "Tier 1: Primitives/CossUI/Autocomplete",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Autocomplete component based on Base UI Combobox, adapted for Ozean Licht design system. A searchable input that filters suggestions as you type. Features glass morphism effects, proper focus management, correct popup positioning, keyboard navigation, single/multi-select modes, and custom rendering. Built with accessibility in mind.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// Sample data for stories
const fruits = [
  { value: "apple", label: "Apple", category: "Popular" },
  { value: "banana", label: "Banana", category: "Popular" },
  { value: "orange", label: "Orange", category: "Popular" },
  { value: "grape", label: "Grape", category: "Popular" },
  { value: "mango", label: "Mango", category: "Tropical" },
  { value: "pineapple", label: "Pineapple", category: "Tropical" },
  { value: "papaya", label: "Papaya", category: "Tropical" },
  { value: "strawberry", label: "Strawberry", category: "Berries" },
  { value: "blueberry", label: "Blueberry", category: "Berries" },
  { value: "raspberry", label: "Raspberry", category: "Berries" },
  { value: "watermelon", label: "Watermelon", category: "Melons" },
  { value: "cantaloupe", label: "Cantaloupe", category: "Melons" },
];

const frameworks = [
  { value: "react", label: "React", description: "A JavaScript library for building user interfaces" },
  { value: "vue", label: "Vue.js", description: "The Progressive JavaScript Framework" },
  { value: "angular", label: "Angular", description: "Platform for building mobile and desktop web applications" },
  { value: "svelte", label: "Svelte", description: "Cybernetically enhanced web apps" },
  { value: "nextjs", label: "Next.js", description: "The React Framework for Production" },
  { value: "nuxt", label: "Nuxt.js", description: "The Intuitive Vue Framework" },
  { value: "remix", label: "Remix", description: "Full stack web framework" },
  { value: "astro", label: "Astro", description: "The all-in-one web framework" },
  { value: "solid", label: "SolidJS", description: "Simple and performant reactivity" },
];

const countries = [
  { value: "us", label: "United States", emoji: "🇺🇸" },
  { value: "uk", label: "United Kingdom", emoji: "🇬🇧" },
  { value: "ca", label: "Canada", emoji: "🇨🇦" },
  { value: "au", label: "Australia", emoji: "🇦🇺" },
  { value: "de", label: "Germany", emoji: "🇩🇪" },
  { value: "fr", label: "France", emoji: "🇫🇷" },
  { value: "jp", label: "Japan", emoji: "🇯🇵" },
  { value: "cn", label: "China", emoji: "🇨🇳" },
  { value: "in", label: "India", emoji: "🇮🇳" },
  { value: "br", label: "Brazil", emoji: "🇧🇷" },
];

/**
 * Basic autocomplete with simple string suggestions
 */
export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <CossUIAutocompleteRoot>
        <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
          <CossUIAutocompleteIcon />
          <CossUIAutocompleteInput placeholder="Search fruits..." />
          <CossUIAutocompleteTrigger />
        </div>
        <CossUIAutocompletePopup>
          <CossUIAutocompleteList>
            <CossUIAutocompleteItem value="apple">Apple</CossUIAutocompleteItem>
            <CossUIAutocompleteItem value="banana">Banana</CossUIAutocompleteItem>
            <CossUIAutocompleteItem value="orange">Orange</CossUIAutocompleteItem>
            <CossUIAutocompleteItem value="grape">Grape</CossUIAutocompleteItem>
            <CossUIAutocompleteItem value="mango">Mango</CossUIAutocompleteItem>
          </CossUIAutocompleteList>
        </CossUIAutocompletePopup>
      </CossUIAutocompleteRoot>
    </div>
  ),
};

/**
 * Single select with search and clear button
 * Demonstrates proper focus management and popup positioning
 */
export const SingleSelectWithSearch: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="framework-autocomplete">Select a framework</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="framework-autocomplete"
                placeholder="Type to search..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {frameworks.map((framework) => (
                  <CossUIAutocompleteItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
        {value && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              Selected: <span className="font-medium text-primary">{value}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Autocomplete with grouped suggestions
 * Groups items by category with labels and separators
 */
export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    const categories = Array.from(new Set(fruits.map((f) => f.category)));

    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fruit-autocomplete">Select a fruit</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="fruit-autocomplete"
                placeholder="Search fruits..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {categories.map((category, idx) => (
                  <React.Fragment key={category}>
                    {idx > 0 && <CossUIAutocompleteSeparator />}
                    <CossUIAutocompleteGroup>
                      <CossUIAutocompleteGroupLabel>{category}</CossUIAutocompleteGroupLabel>
                      {fruits
                        .filter((f) => f.category === category)
                        .map((fruit) => (
                          <CossUIAutocompleteItem key={fruit.value} value={fruit.value}>
                            {fruit.label}
                          </CossUIAutocompleteItem>
                        ))}
                    </CossUIAutocompleteGroup>
                  </React.Fragment>
                ))}
                <CossUIAutocompleteEmpty>No fruits found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * Multi-select autocomplete with chips
 * Allows selecting multiple values displayed as removable chips
 */
export const MultiSelect: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([]);

    return (
      <div className="flex flex-col gap-4 w-[500px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="multi-framework">Select frameworks</Label>
          <CossUIAutocompleteRoot
            multiple
            value={values}
            onValueChange={(newValues) => setValues(newValues as string[])}
          >
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="multi-framework"
                placeholder="Type to search..."
              />
              {values.length > 0 && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {frameworks.map((framework) => (
                  <CossUIAutocompleteItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>

        {values.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#C4C8D4]">Selected ({values.length}):</p>
            <CossUIAutocompleteChips>
              {values.map((value) => {
                const framework = frameworks.find((f) => f.value === value);
                return (
                  <CossUIAutocompleteChip key={value}>
                    {framework?.label || value}
                    <CossUIAutocompleteChipRemove
                      onClick={() => setValues(values.filter((v) => v !== value))}
                    />
                  </CossUIAutocompleteChip>
                );
              })}
            </CossUIAutocompleteChips>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Custom rendering with descriptions
 * Shows how to render custom content in items
 */
export const CustomRendering: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="w-[500px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="custom-autocomplete">Choose a framework</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="custom-autocomplete"
                placeholder="Search frameworks..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {frameworks.map((framework) => (
                  <CossUIAutocompleteItem key={framework.value} value={framework.value}>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{framework.label}</span>
                      <span className="text-xs text-[#C4C8D4]/70">{framework.description}</span>
                    </div>
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * With icons/emojis in items
 * Demonstrates rendering icons alongside text
 */
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="country-autocomplete">Select a country</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </CossUIAutocompleteIcon>
              <CossUIAutocompleteInput
                id="country-autocomplete"
                placeholder="Search countries..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {countries.map((country) => (
                  <CossUIAutocompleteItem key={country.value} value={country.value}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{country.emoji}</span>
                      <span>{country.label}</span>
                    </span>
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No countries found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * Loading state
 * Shows loading indicator while fetching suggestions
 */
export const LoadingState: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState(frameworks);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      if (query.length > 0) {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const filtered = frameworks.filter((f) =>
            f.label.toLowerCase().includes(query.toLowerCase())
          );
          setItems(filtered);
          setLoading(false);
        }, 500);
      } else {
        setItems(frameworks);
      }
    };

    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="loading-autocomplete">Search with loading</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="loading-autocomplete"
                placeholder="Type to search..."
                onChange={handleInputChange}
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {loading ? (
                  <div className="flex items-center justify-center py-6 gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm text-[#C4C8D4]">Loading...</span>
                  </div>
                ) : (
                  <>
                    {items.map((framework) => (
                      <CossUIAutocompleteItem key={framework.value} value={framework.value}>
                        {framework.label}
                      </CossUIAutocompleteItem>
                    ))}
                    <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
                  </>
                )}
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * Empty state
 * Shows custom message when no suggestions match
 */
export const EmptyState: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="empty-autocomplete">Search (will show empty)</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="empty-autocomplete"
                placeholder="Type 'xyz' to see empty state..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {/* Empty list to demonstrate empty state */}
                <CossUIAutocompleteEmpty>
                  <div className="flex flex-col items-center gap-2 py-4">
                    <svg
                      className="h-8 w-8 text-[#C4C8D4]/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-[#C4C8D4]/70">No results found</p>
                    <p className="text-xs text-[#C4C8D4]/50">Try a different search term</p>
                  </div>
                </CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * Disabled state
 * Shows autocomplete in disabled state
 */
export const DisabledState: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-autocomplete">Disabled autocomplete</Label>
        <CossUIAutocompleteRoot disabled>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md opacity-50">
            <CossUIAutocompleteIcon />
            <CossUIAutocompleteInput
              id="disabled-autocomplete"
              placeholder="This is disabled..."
              disabled
            />
            <CossUIAutocompleteTrigger disabled />
          </div>
          <CossUIAutocompletePopup>
            <CossUIAutocompleteList>
              <CossUIAutocompleteItem value="disabled">This won't show</CossUIAutocompleteItem>
            </CossUIAutocompleteList>
          </CossUIAutocompletePopup>
        </CossUIAutocompleteRoot>
      </div>
    </div>
  ),
};

/**
 * With disabled items
 * Shows some items disabled in the list
 */
export const WithDisabledItems: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled-items">Frameworks (some disabled)</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="disabled-items"
                placeholder="Search frameworks..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                <CossUIAutocompleteItem value="react">React</CossUIAutocompleteItem>
                <CossUIAutocompleteItem value="vue" disabled>
                  Vue.js (Coming soon)
                </CossUIAutocompleteItem>
                <CossUIAutocompleteItem value="angular">Angular</CossUIAutocompleteItem>
                <CossUIAutocompleteItem value="svelte" disabled>
                  Svelte (Coming soon)
                </CossUIAutocompleteItem>
                <CossUIAutocompleteItem value="nextjs">Next.js</CossUIAutocompleteItem>
                <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * Form integration
 * Demonstrates using autocomplete in a form
 */
export const FormIntegration: Story = {
  render: () => {
    const [framework, setFramework] = React.useState<string | null>(null);
    const [country, setCountry] = React.useState<string | null>(null);
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    };

    return (
      <form onSubmit={handleSubmit} className="w-[400px] space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="form-framework">Favorite framework *</Label>
          <CossUIAutocompleteRoot value={framework} onValueChange={setFramework}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="form-framework"
                placeholder="Select a framework..."
                required
              />
              {framework && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {frameworks.slice(0, 5).map((fw) => (
                  <CossUIAutocompleteItem key={fw.value} value={fw.value}>
                    {fw.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="form-country">Country *</Label>
          <CossUIAutocompleteRoot value={country} onValueChange={setCountry}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="form-country"
                placeholder="Select a country..."
                required
              />
              {country && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {countries.map((c) => (
                  <CossUIAutocompleteItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{c.emoji}</span>
                      <span>{c.label}</span>
                    </span>
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No countries found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-white rounded-lg font-sans font-medium hover:bg-primary/90 transition-colors active:scale-95"
        >
          Submit
        </button>

        {submitted && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              Form submitted! Framework: <span className="font-medium text-primary">{framework}</span>, Country: <span className="font-medium text-primary">{country}</span>
            </p>
          </div>
        )}
      </form>
    );
  },
};

/**
 * Keyboard navigation demo
 * Demonstrates keyboard shortcuts and navigation
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="flex flex-col gap-4 w-[500px]">
        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <h3 className="text-sm font-medium text-primary mb-2">Keyboard Shortcuts:</h3>
          <ul className="text-xs text-[#C4C8D4] space-y-1">
            <li>• <kbd className="px-1.5 py-0.5 bg-[#000F1F] rounded border border-border">↑</kbd> / <kbd className="px-1.5 py-0.5 bg-[#000F1F] rounded border border-border">↓</kbd> - Navigate items</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-[#000F1F] rounded border border-border">Enter</kbd> - Select highlighted item</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-[#000F1F] rounded border border-border">Esc</kbd> - Close popup</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-[#000F1F] rounded border border-border">Home</kbd> / <kbd className="px-1.5 py-0.5 bg-[#000F1F] rounded border border-border">End</kbd> - Jump to first/last item</li>
            <li>• Type to filter suggestions</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="keyboard-autocomplete">Try keyboard navigation</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="keyboard-autocomplete"
                placeholder="Click here and use arrow keys..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {frameworks.map((framework) => (
                  <CossUIAutocompleteItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>

        {value && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              Selected: <span className="font-medium text-primary">{value}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Accessible autocomplete
 * Demonstrates ARIA labels and screen reader support
 */
export const AccessibilityDemo: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="flex flex-col gap-4 w-[500px]">
        <div className="p-4 rounded-lg bg-card/50 border border-border">
          <h3 className="text-sm font-medium text-primary mb-2">Accessibility Features:</h3>
          <ul className="text-xs text-[#C4C8D4] space-y-1">
            <li>• Proper ARIA labels and roles</li>
            <li>• Screen reader announcements for selection</li>
            <li>• Focus visible indicators</li>
            <li>• Keyboard navigation support</li>
            <li>• Status messages for screen readers</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="accessible-autocomplete">Accessible autocomplete</Label>
          <CossUIAutocompleteRoot
            value={value}
            onValueChange={setValue}
            aria-label="Framework selection"
          >
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon aria-hidden="true" />
              <CossUIAutocompleteInput
                id="accessible-autocomplete"
                placeholder="Search frameworks..."
                aria-describedby="autocomplete-description"
              />
              {value && <CossUIAutocompleteClear aria-label="Clear selection" />}
              <CossUIAutocompleteTrigger aria-label="Toggle suggestions" />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {frameworks.map((framework) => (
                  <CossUIAutocompleteItem
                    key={framework.value}
                    value={framework.value}
                    aria-label={`${framework.label} - ${framework.description}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{framework.label}</span>
                      <span className="text-xs text-[#C4C8D4]/70">{framework.description}</span>
                    </div>
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No frameworks found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
          <p id="autocomplete-description" className="text-xs text-[#C4C8D4]/70">
            Type to search and filter frameworks. Use arrow keys to navigate.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Compact size variant
 * Smaller autocomplete for tight spaces
 */
export const CompactSize: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="w-[300px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="compact-autocomplete" className="text-xs">
            Compact autocomplete
          </Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-md bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon className="px-1.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </CossUIAutocompleteIcon>
              <CossUIAutocompleteInput
                id="compact-autocomplete"
                placeholder="Search..."
                className="h-8 text-xs"
              />
              {value && (
                <CossUIAutocompleteClear className="h-8">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </CossUIAutocompleteClear>
              )}
              <CossUIAutocompleteTrigger className="h-8 px-1.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CossUIAutocompleteTrigger>
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {fruits.slice(0, 6).map((fruit) => (
                  <CossUIAutocompleteItem
                    key={fruit.value}
                    value={fruit.value}
                    className="py-1.5 px-2 text-xs"
                  >
                    {fruit.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty className="py-4 text-xs">
                  No fruits found
                </CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * Large size variant
 * Larger autocomplete for emphasis
 */
export const LargeSize: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="w-[500px]">
        <div className="flex flex-col gap-3">
          <Label htmlFor="large-autocomplete" className="text-lg">
            Large autocomplete
          </Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-xl bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon className="px-4">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </CossUIAutocompleteIcon>
              <CossUIAutocompleteInput
                id="large-autocomplete"
                placeholder="Search frameworks..."
                className="h-14 text-base"
              />
              {value && <CossUIAutocompleteClear className="h-14 px-4" />}
              <CossUIAutocompleteTrigger className="h-14 px-4" />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {frameworks.map((framework) => (
                  <CossUIAutocompleteItem
                    key={framework.value}
                    value={framework.value}
                    className="py-3 px-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-base">{framework.label}</span>
                      <span className="text-xs text-[#C4C8D4]/70">{framework.description}</span>
                    </div>
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty className="py-8">
                  No frameworks found
                </CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * With side offset
 * Demonstrates controlling popup offset from trigger
 */
export const WithSideOffset: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    const [offset, setOffset] = React.useState(8);

    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <div className="flex items-center gap-2">
          <Label htmlFor="offset-slider" className="text-sm">
            Popup offset: {offset}px
          </Label>
          <input
            id="offset-slider"
            type="range"
            min="0"
            max="32"
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="offset-autocomplete">Autocomplete</Label>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="offset-autocomplete"
                placeholder="Search..."
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup sideOffset={offset}>
              <CossUIAutocompleteList>
                {fruits.slice(0, 6).map((fruit) => (
                  <CossUIAutocompleteItem key={fruit.value} value={fruit.value}>
                    {fruit.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No fruits found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>
      </div>
    );
  },
};

/**
 * Controlled vs Uncontrolled
 * Shows both controlled and uncontrolled usage
 */
export const ControlledVsUncontrolled: Story = {
  render: () => {
    const [controlledValue, setControlledValue] = React.useState<string | null>(null);

    return (
      <div className="flex flex-col gap-6 w-[500px]">
        {/* Controlled */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="controlled">Controlled autocomplete</Label>
          <CossUIAutocompleteRoot value={controlledValue} onValueChange={setControlledValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="controlled"
                placeholder="Search..."
              />
              {controlledValue && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {fruits.slice(0, 6).map((fruit) => (
                  <CossUIAutocompleteItem key={fruit.value} value={fruit.value}>
                    {fruit.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No fruits found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
          {controlledValue && (
            <p className="text-xs text-[#C4C8D4]">Value: {controlledValue}</p>
          )}
        </div>

        {/* Uncontrolled */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="uncontrolled">Uncontrolled autocomplete</Label>
          <CossUIAutocompleteRoot defaultValue="banana">
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="uncontrolled"
                placeholder="Search..."
              />
              <CossUIAutocompleteClear />
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {fruits.slice(0, 6).map((fruit) => (
                  <CossUIAutocompleteItem key={fruit.value} value={fruit.value}>
                    {fruit.label}
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No fruits found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
          <p className="text-xs text-[#C4C8D4]">Default value: banana (check component state)</p>
        </div>
      </div>
    );
  },
};

/**
 * Real-world example: Tag selector
 * Complex example with tags and multi-select
 */
export const TagSelector: Story = {
  render: () => {
    const tags = [
      { value: "javascript", label: "JavaScript", color: "#F7DF1E" },
      { value: "typescript", label: "TypeScript", color: "#3178C6" },
      { value: "react", label: "React", color: "#61DAFB" },
      { value: "vue", label: "Vue", color: "#4FC08D" },
      { value: "angular", label: "Angular", color: "#DD0031" },
      { value: "svelte", label: "Svelte", color: "#FF3E00" },
      { value: "node", label: "Node.js", color: "#339933" },
      { value: "python", label: "Python", color: "#3776AB" },
      { value: "rust", label: "Rust", color: "#000000" },
      { value: "go", label: "Go", color: "#00ADD8" },
    ];

    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

    return (
      <div className="flex flex-col gap-4 w-[600px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tag-selector">Select technologies</Label>
          <CossUIAutocompleteRoot
            multiple
            value={selectedTags}
            onValueChange={(values) => setSelectedTags(values as string[])}
          >
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="tag-selector"
                placeholder="Add tags..."
              />
              {selectedTags.length > 0 && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup>
              <CossUIAutocompleteList>
                {tags.map((tag) => (
                  <CossUIAutocompleteItem key={tag.value} value={tag.value}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.label}</span>
                    </span>
                  </CossUIAutocompleteItem>
                ))}
                <CossUIAutocompleteEmpty>No tags found</CossUIAutocompleteEmpty>
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[#C4C8D4]">Selected tags ({selectedTags.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagValue) => {
                const tag = tags.find((t) => t.value === tagValue);
                return tag ? (
                  <div
                    key={tag.value}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#000F1F] border border-[#0ec2bc]/30 text-sm"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.label}</span>
                    <button
                      onClick={() => setSelectedTags(selectedTags.filter((v) => v !== tag.value))}
                      className="text-[#C4C8D4]/50 hover:text-[#C4C8D4] transition-colors"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * All features combined
 * Kitchen sink example with all features enabled
 */
export const AllFeatures: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const categories = Array.from(new Set(fruits.map((f) => f.category)));

    const handleInputChange = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    };

    return (
      <div className="flex flex-col gap-4 w-[500px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="all-features">Complete autocomplete</Label>
          <p className="text-xs text-[#C4C8D4]/70">
            Features: search, groups, clear, keyboard navigation, loading state
          </p>
          <CossUIAutocompleteRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <CossUIAutocompleteIcon />
              <CossUIAutocompleteInput
                id="all-features"
                placeholder="Search fruits..."
                onChange={handleInputChange}
              />
              {value && <CossUIAutocompleteClear />}
              <CossUIAutocompleteTrigger />
            </div>
            <CossUIAutocompletePopup sideOffset={8}>
              <CossUIAutocompleteList>
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : (
                  <>
                    {categories.map((category, idx) => (
                      <React.Fragment key={category}>
                        {idx > 0 && <CossUIAutocompleteSeparator />}
                        <CossUIAutocompleteGroup>
                          <CossUIAutocompleteGroupLabel>{category}</CossUIAutocompleteGroupLabel>
                          {fruits
                            .filter((f) => f.category === category)
                            .map((fruit) => (
                              <CossUIAutocompleteItem key={fruit.value} value={fruit.value}>
                                {fruit.label}
                              </CossUIAutocompleteItem>
                            ))}
                        </CossUIAutocompleteGroup>
                      </React.Fragment>
                    ))}
                    <CossUIAutocompleteEmpty>
                      <div className="flex flex-col items-center gap-2 py-4">
                        <svg className="h-8 w-8 text-[#C4C8D4]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-[#C4C8D4]/70">No fruits found</p>
                      </div>
                    </CossUIAutocompleteEmpty>
                  </>
                )}
              </CossUIAutocompleteList>
            </CossUIAutocompletePopup>
          </CossUIAutocompleteRoot>
        </div>

        {value && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              Selected: <span className="font-medium text-primary">{value}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
};
