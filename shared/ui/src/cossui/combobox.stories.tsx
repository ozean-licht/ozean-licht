/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from "@storybook/react";
import React from "react";
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxIcon,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
  ComboboxEmpty,
  ComboboxClear,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
} from "./combobox";
import { Label } from "./label";

const meta: Meta = {
  title: "Tier 1: Primitives/CossUI/Combobox",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Combobox component from Coss UI adapted for Ozean Licht design system. A searchable select that combines an input with a filterable dropdown. Built on Base UI with glass morphism effects, supports single and multi-select modes, custom chip rendering, and keyboard navigation.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// Basic combobox
export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <ComboboxRoot>
        <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
          <ComboboxIcon />
          <ComboboxInput placeholder="Search fruits..." />
          <ComboboxTrigger />
        </div>
        <ComboboxPopup>
          <ComboboxList>
            <ComboboxItem value="apple">Apple</ComboboxItem>
            <ComboboxItem value="banana">Banana</ComboboxItem>
            <ComboboxItem value="orange">Orange</ComboboxItem>
            <ComboboxItem value="grape">Grape</ComboboxItem>
          </ComboboxList>
        </ComboboxPopup>
      </ComboboxRoot>
    </div>
  ),
};

// Single select with search
export const SingleSelectWithSearch: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="flex flex-col gap-4 w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="single-combobox">Select a framework</Label>
          <ComboboxRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <ComboboxIcon />
              <ComboboxInput
                id="single-combobox"
                placeholder="Type to search..."
              />
              {value && <ComboboxClear />}
              <ComboboxTrigger />
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxItem value="react">React</ComboboxItem>
                <ComboboxItem value="vue">Vue.js</ComboboxItem>
                <ComboboxItem value="angular">Angular</ComboboxItem>
                <ComboboxItem value="svelte">Svelte</ComboboxItem>
                <ComboboxItem value="nextjs">Next.js</ComboboxItem>
                <ComboboxItem value="nuxt">Nuxt.js</ComboboxItem>
                <ComboboxEmpty>No frameworks found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
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

// Multi-select with tags
export const MultiSelectWithTags: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <div className="flex flex-col gap-4 w-[500px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="multi-combobox">Select technologies</Label>
          <ComboboxRoot multiple value={value} onValueChange={setValue}>
            <div className="flex items-center gap-2 border border-border rounded-lg bg-card/70 backdrop-blur-md p-2">
              <ComboboxChips>
                {(item) => (
                  <ComboboxChip key={item.value}>
                    {item.value}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                )}
              </ComboboxChips>
              <div className="flex items-center flex-1 min-w-0">
                <ComboboxIcon />
                <ComboboxInput
                  id="multi-combobox"
                  placeholder="Add technologies..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {value.length > 0 && <ComboboxClear />}
                <ComboboxTrigger />
              </div>
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxItem value="React">React</ComboboxItem>
                <ComboboxItem value="TypeScript">TypeScript</ComboboxItem>
                <ComboboxItem value="JavaScript">JavaScript</ComboboxItem>
                <ComboboxItem value="Node.js">Node.js</ComboboxItem>
                <ComboboxItem value="Python">Python</ComboboxItem>
                <ComboboxItem value="PostgreSQL">PostgreSQL</ComboboxItem>
                <ComboboxItem value="Docker">Docker</ComboboxItem>
                <ComboboxItem value="Kubernetes">Kubernetes</ComboboxItem>
                <ComboboxEmpty>No technologies found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
        {value.length > 0 && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              Selected {value.length} item{value.length !== 1 ? "s" : ""}:{" "}
              <span className="font-medium text-primary">{value.join(", ")}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Grouped options
export const GroupedOptions: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="grouped-combobox">Select a language</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon />
            <ComboboxInput
              id="grouped-combobox"
              placeholder="Search languages..."
            />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxGroup>
                <ComboboxGroupLabel>Programming Languages</ComboboxGroupLabel>
                <ComboboxItem value="javascript">JavaScript</ComboboxItem>
                <ComboboxItem value="typescript">TypeScript</ComboboxItem>
                <ComboboxItem value="python">Python</ComboboxItem>
                <ComboboxItem value="rust">Rust</ComboboxItem>
              </ComboboxGroup>
              <ComboboxSeparator />
              <ComboboxGroup>
                <ComboboxGroupLabel>Markup Languages</ComboboxGroupLabel>
                <ComboboxItem value="html">HTML</ComboboxItem>
                <ComboboxItem value="xml">XML</ComboboxItem>
                <ComboboxItem value="markdown">Markdown</ComboboxItem>
              </ComboboxGroup>
              <ComboboxEmpty>No languages found</ComboboxEmpty>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="icon-combobox">Select a status</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </ComboboxIcon>
            <ComboboxInput id="icon-combobox" placeholder="Select status..." />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="active">🟢 Active</ComboboxItem>
              <ComboboxItem value="pending">🟡 Pending</ComboboxItem>
              <ComboboxItem value="completed">✅ Completed</ComboboxItem>
              <ComboboxItem value="failed">❌ Failed</ComboboxItem>
              <ComboboxItem value="archived">📦 Archived</ComboboxItem>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// Framework selector
export const FrameworkSelector: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>("react");
    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="framework-combobox">Choose your framework</Label>
          <ComboboxRoot value={value} onValueChange={setValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <ComboboxIcon />
              <ComboboxInput
                id="framework-combobox"
                placeholder="Search frameworks..."
              />
              {value && <ComboboxClear />}
              <ComboboxTrigger />
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxGroup>
                  <ComboboxGroupLabel>Frontend Frameworks</ComboboxGroupLabel>
                  <ComboboxItem value="react">React</ComboboxItem>
                  <ComboboxItem value="vue">Vue.js</ComboboxItem>
                  <ComboboxItem value="angular">Angular</ComboboxItem>
                  <ComboboxItem value="svelte">Svelte</ComboboxItem>
                </ComboboxGroup>
                <ComboboxSeparator />
                <ComboboxGroup>
                  <ComboboxGroupLabel>Backend Frameworks</ComboboxGroupLabel>
                  <ComboboxItem value="nextjs">Next.js</ComboboxItem>
                  <ComboboxItem value="express">Express.js</ComboboxItem>
                  <ComboboxItem value="django">Django</ComboboxItem>
                  <ComboboxItem value="rails">Ruby on Rails</ComboboxItem>
                </ComboboxGroup>
                <ComboboxEmpty>No frameworks found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
      </div>
    );
  },
};

// Country selector with flags
export const CountrySelectorWithFlags: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="country-combobox">Select a country</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </ComboboxIcon>
            <ComboboxInput
              id="country-combobox"
              placeholder="Search countries..."
            />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="us">🇺🇸 United States</ComboboxItem>
              <ComboboxItem value="uk">🇬🇧 United Kingdom</ComboboxItem>
              <ComboboxItem value="de">🇩🇪 Germany</ComboboxItem>
              <ComboboxItem value="fr">🇫🇷 France</ComboboxItem>
              <ComboboxItem value="at">🇦🇹 Austria</ComboboxItem>
              <ComboboxItem value="ch">🇨🇭 Switzerland</ComboboxItem>
              <ComboboxItem value="it">🇮🇹 Italy</ComboboxItem>
              <ComboboxItem value="es">🇪🇸 Spain</ComboboxItem>
              <ComboboxItem value="nl">🇳🇱 Netherlands</ComboboxItem>
              <ComboboxItem value="se">🇸🇪 Sweden</ComboboxItem>
              <ComboboxEmpty>No countries found</ComboboxEmpty>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// Tag input style
export const TagInputStyle: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(["React", "TypeScript"]);
    return (
      <div className="w-[500px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tag-combobox">Add tags</Label>
          <ComboboxRoot multiple value={value} onValueChange={setValue}>
            <div className="min-h-[100px] border border-border rounded-lg bg-card/70 backdrop-blur-md p-2">
              <ComboboxChips>
                {(item) => (
                  <ComboboxChip key={item.value}>
                    {item.value}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                )}
              </ComboboxChips>
              <div className="flex items-center gap-2 mt-2">
                <ComboboxInput
                  id="tag-combobox"
                  placeholder="Add a tag..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                />
              </div>
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxItem value="React">React</ComboboxItem>
                <ComboboxItem value="TypeScript">TypeScript</ComboboxItem>
                <ComboboxItem value="JavaScript">JavaScript</ComboboxItem>
                <ComboboxItem value="CSS">CSS</ComboboxItem>
                <ComboboxItem value="HTML">HTML</ComboboxItem>
                <ComboboxItem value="Node.js">Node.js</ComboboxItem>
                <ComboboxItem value="Python">Python</ComboboxItem>
                <ComboboxEmpty>No tags found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
      </div>
    );
  },
};

// Async options loading (simulated)
export const AsyncOptionsLoading: Story = {
  render: () => {
    const [options, setOptions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
      if (inputValue.length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);
      const timer = setTimeout(() => {
        const mockResults = [
          "React Developer",
          "React Native Engineer",
          "React Architect",
          "Frontend React Specialist",
          "Senior React Developer",
        ].filter((job) =>
          job.toLowerCase().includes(inputValue.toLowerCase())
        );
        setOptions(mockResults);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }, [inputValue]);

    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="async-combobox">Search jobs</Label>
          <ComboboxRoot onInputValueChange={setInputValue}>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <ComboboxIcon />
              <ComboboxInput
                id="async-combobox"
                placeholder="Type to search jobs..."
              />
              <ComboboxTrigger />
            </div>
            <ComboboxPopup>
              <ComboboxList>
                {loading ? (
                  <div className="py-6 px-3 text-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <>
                    {options.map((option) => (
                      <ComboboxItem key={option} value={option}>
                        {option}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>
                      Type at least 2 characters to search
                    </ComboboxEmpty>
                  </>
                )}
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
      </div>
    );
  },
};

// Custom option rendering
export const CustomOptionRendering: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-combobox">Select a team member</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon />
            <ComboboxInput
              id="custom-combobox"
              placeholder="Search team members..."
            />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="john">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                    JD
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">John Doe</span>
                    <span className="text-xs text-muted-foreground">
                      john@example.com
                    </span>
                  </div>
                </div>
              </ComboboxItem>
              <ComboboxItem value="jane">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                    JS
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">Jane Smith</span>
                    <span className="text-xs text-muted-foreground">
                      jane@example.com
                    </span>
                  </div>
                </div>
              </ComboboxItem>
              <ComboboxItem value="bob">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                    BJ
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">Bob Johnson</span>
                    <span className="text-xs text-muted-foreground">
                      bob@example.com
                    </span>
                  </div>
                </div>
              </ComboboxItem>
              <ComboboxEmpty>No team members found</ComboboxEmpty>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// Selected items as chips
export const SelectedItemsAsChips: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([
      "JavaScript",
      "TypeScript",
      "React",
    ]);
    return (
      <div className="w-[500px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="chips-combobox">Skills</Label>
          <ComboboxRoot multiple value={value} onValueChange={setValue}>
            <div className="min-h-[80px] border border-border rounded-lg bg-card/70 backdrop-blur-md p-3">
              <ComboboxChips>
                {(item) => (
                  <ComboboxChip
                    key={item.value}
                    className="bg-[#0ec2bc]/10 border-[#0ec2bc]/50"
                  >
                    {item.value}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                )}
              </ComboboxChips>
              <div className="flex items-center gap-2 mt-2">
                <ComboboxIcon />
                <ComboboxInput
                  id="chips-combobox"
                  placeholder="Add skills..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                />
                {value.length > 0 && <ComboboxClear />}
              </div>
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxItem value="JavaScript">JavaScript</ComboboxItem>
                <ComboboxItem value="TypeScript">TypeScript</ComboboxItem>
                <ComboboxItem value="React">React</ComboboxItem>
                <ComboboxItem value="Vue">Vue</ComboboxItem>
                <ComboboxItem value="Angular">Angular</ComboboxItem>
                <ComboboxItem value="Node.js">Node.js</ComboboxItem>
                <ComboboxItem value="Python">Python</ComboboxItem>
                <ComboboxEmpty>No skills found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
      </div>
    );
  },
};

// Clear all button
export const WithClearAllButton: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([
      "React",
      "TypeScript",
      "Node.js",
    ]);
    return (
      <div className="w-[500px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="clear-combobox">Technologies</Label>
            {value.length > 0 && (
              <button
                onClick={() => setValue([])}
                className="text-xs text-primary hover:text-primary/80"
              >
                Clear all ({value.length})
              </button>
            )}
          </div>
          <ComboboxRoot multiple value={value} onValueChange={setValue}>
            <div className="min-h-[80px] border border-border rounded-lg bg-card/70 backdrop-blur-md p-3">
              <ComboboxChips>
                {(item) => (
                  <ComboboxChip key={item.value}>
                    {item.value}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                )}
              </ComboboxChips>
              <div className="flex items-center gap-2 mt-2">
                <ComboboxIcon />
                <ComboboxInput
                  id="clear-combobox"
                  placeholder="Add technologies..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                />
              </div>
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxItem value="React">React</ComboboxItem>
                <ComboboxItem value="TypeScript">TypeScript</ComboboxItem>
                <ComboboxItem value="Node.js">Node.js</ComboboxItem>
                <ComboboxItem value="Python">Python</ComboboxItem>
                <ComboboxItem value="PostgreSQL">PostgreSQL</ComboboxItem>
                <ComboboxEmpty>No technologies found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
      </div>
    );
  },
};

// Max selections limit
export const MaxSelectionsLimit: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    const maxSelections = 3;

    const handleValueChange = (newValue: string[]) => {
      if (newValue.length <= maxSelections) {
        setValue(newValue);
      }
    };

    return (
      <div className="w-[500px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="max-combobox">Select up to 3 interests</Label>
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxSelections}
            </span>
          </div>
          <ComboboxRoot multiple value={value} onValueChange={handleValueChange}>
            <div className="min-h-[80px] border border-border rounded-lg bg-card/70 backdrop-blur-md p-3">
              <ComboboxChips>
                {(item) => (
                  <ComboboxChip key={item.value}>
                    {item.value}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                )}
              </ComboboxChips>
              <div className="flex items-center gap-2 mt-2">
                <ComboboxIcon />
                <ComboboxInput
                  id="max-combobox"
                  placeholder={
                    value.length >= maxSelections
                      ? "Maximum reached"
                      : "Add interests..."
                  }
                  disabled={value.length >= maxSelections}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                />
              </div>
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxItem value="Technology">Technology</ComboboxItem>
                <ComboboxItem value="Design">Design</ComboboxItem>
                <ComboboxItem value="Music">Music</ComboboxItem>
                <ComboboxItem value="Sports">Sports</ComboboxItem>
                <ComboboxItem value="Travel">Travel</ComboboxItem>
                <ComboboxItem value="Food">Food</ComboboxItem>
                <ComboboxEmpty>No interests found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
          {value.length >= maxSelections && (
            <p className="text-xs text-muted-foreground">
              Maximum selection limit reached. Remove an item to add another.
            </p>
          )}
        </div>
      </div>
    );
  },
};

// Disabled options
export const DisabledOptions: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-combobox">Select a plan</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon />
            <ComboboxInput id="disabled-combobox" placeholder="Choose a plan..." />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="free">Free - $0/month</ComboboxItem>
              <ComboboxItem value="starter">Starter - $9/month</ComboboxItem>
              <ComboboxItem value="pro">Pro - $29/month</ComboboxItem>
              <ComboboxItem value="enterprise" disabled>
                Enterprise - Contact us (Coming soon)
              </ComboboxItem>
              <ComboboxEmpty>No plans found</ComboboxEmpty>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// Glass effect variants
export const GlassEffectVariants: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6 min-w-[400px]">
      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Subtle Glass Effect</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/50 backdrop-blur-md">
            <ComboboxIcon />
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="option1">Option 1</ComboboxItem>
              <ComboboxItem value="option2">Option 2</ComboboxItem>
              <ComboboxItem value="option3">Option 3</ComboboxItem>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Strong Glass Effect</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-primary/30 rounded-lg bg-card/80 backdrop-blur-lg">
            <ComboboxIcon />
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="option1">Option 1</ComboboxItem>
              <ComboboxItem value="option2">Option 2</ComboboxItem>
              <ComboboxItem value="option3">Option 3</ComboboxItem>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-foreground/90">Primary Border</Label>
        <ComboboxRoot>
          <div className="flex items-center border-2 border-primary/50 rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon />
            <ComboboxInput placeholder="Search..." />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="option1">Option 1</ComboboxItem>
              <ComboboxItem value="option2">Option 2</ComboboxItem>
              <ComboboxItem value="option3">Option 3</ComboboxItem>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// Keyboard navigation example
export const KeyboardNavigationDemo: Story = {
  render: () => (
    <div className="w-[500px]">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-alt font-medium text-foreground mb-2">
            Keyboard Navigation
          </h3>
          <p className="text-sm text-muted-foreground">
            Try using these keyboard shortcuts:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• <kbd className="px-1 py-0.5 bg-card border border-border rounded text-[10px]">↓</kbd> / <kbd className="px-1 py-0.5 bg-card border border-border rounded text-[10px]">↑</kbd> Navigate options</li>
            <li>• <kbd className="px-1 py-0.5 bg-card border border-border rounded text-[10px]">Enter</kbd> Select highlighted option</li>
            <li>• <kbd className="px-1 py-0.5 bg-card border border-border rounded text-[10px]">Esc</kbd> Close dropdown</li>
            <li>• <kbd className="px-1 py-0.5 bg-card border border-border rounded text-[10px]">Home</kbd> / <kbd className="px-1 py-0.5 bg-card border border-border rounded text-[10px]">End</kbd> Jump to first/last</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="keyboard-combobox">Try keyboard navigation</Label>
          <ComboboxRoot autoHighlight keepHighlight>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <ComboboxIcon />
              <ComboboxInput
                id="keyboard-combobox"
                placeholder="Type or use keyboard..."
              />
              <ComboboxTrigger />
            </div>
            <ComboboxPopup>
              <ComboboxList>
                <ComboboxGroup>
                  <ComboboxGroupLabel>Fruits</ComboboxGroupLabel>
                  <ComboboxItem value="apple">Apple</ComboboxItem>
                  <ComboboxItem value="banana">Banana</ComboboxItem>
                  <ComboboxItem value="orange">Orange</ComboboxItem>
                </ComboboxGroup>
                <ComboboxSeparator />
                <ComboboxGroup>
                  <ComboboxGroupLabel>Vegetables</ComboboxGroupLabel>
                  <ComboboxItem value="carrot">Carrot</ComboboxItem>
                  <ComboboxItem value="broccoli">Broccoli</ComboboxItem>
                  <ComboboxItem value="lettuce">Lettuce</ComboboxItem>
                </ComboboxGroup>
                <ComboboxEmpty>No items found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
      </div>
    </div>
  ),
};

// Form integration
export const FormIntegration: Story = {
  render: () => {
    const [framework, setFramework] = React.useState<string | null>("react");
    const [skills, setSkills] = React.useState<string[]>(["JavaScript"]);

    return (
      <div className="w-[500px] p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div>
          <h2 className="text-lg font-alt font-medium text-foreground">
            Developer Profile
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us about your technical expertise
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="form-framework">Primary Framework</Label>
            <ComboboxRoot value={framework} onValueChange={setFramework}>
              <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
                <ComboboxIcon />
                <ComboboxInput
                  id="form-framework"
                  placeholder="Select framework..."
                />
                {framework && <ComboboxClear />}
                <ComboboxTrigger />
              </div>
              <ComboboxPopup>
                <ComboboxList>
                  <ComboboxItem value="react">React</ComboboxItem>
                  <ComboboxItem value="vue">Vue.js</ComboboxItem>
                  <ComboboxItem value="angular">Angular</ComboboxItem>
                  <ComboboxItem value="svelte">Svelte</ComboboxItem>
                </ComboboxList>
              </ComboboxPopup>
            </ComboboxRoot>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="form-skills">Technical Skills</Label>
            <ComboboxRoot multiple value={skills} onValueChange={setSkills}>
              <div className="min-h-[80px] border border-border rounded-lg bg-card/70 backdrop-blur-md p-3">
                <ComboboxChips>
                  {(item) => (
                    <ComboboxChip key={item.value}>
                      {item.value}
                      <ComboboxChipRemove />
                    </ComboboxChip>
                  )}
                </ComboboxChips>
                <div className="flex items-center gap-2 mt-2">
                  <ComboboxIcon />
                  <ComboboxInput
                    id="form-skills"
                    placeholder="Add skills..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                  />
                </div>
              </div>
              <ComboboxPopup>
                <ComboboxList>
                  <ComboboxItem value="JavaScript">JavaScript</ComboboxItem>
                  <ComboboxItem value="TypeScript">TypeScript</ComboboxItem>
                  <ComboboxItem value="React">React</ComboboxItem>
                  <ComboboxItem value="Node.js">Node.js</ComboboxItem>
                  <ComboboxItem value="Python">Python</ComboboxItem>
                </ComboboxList>
              </ComboboxPopup>
            </ComboboxRoot>
          </div>

          <button className="mt-4 w-full h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            Save Profile
          </button>
        </div>
      </div>
    );
  },
};

// Large options list with scrolling
export const LargeOptionsList: Story = {
  render: () => {
    const countries = [
      "Argentina",
      "Australia",
      "Austria",
      "Belgium",
      "Brazil",
      "Canada",
      "China",
      "Denmark",
      "Finland",
      "France",
      "Germany",
      "Greece",
      "India",
      "Indonesia",
      "Ireland",
      "Italy",
      "Japan",
      "Mexico",
      "Netherlands",
      "New Zealand",
      "Norway",
      "Poland",
      "Portugal",
      "Russia",
      "Singapore",
      "South Africa",
      "South Korea",
      "Spain",
      "Sweden",
      "Switzerland",
      "Thailand",
      "Turkey",
      "United Kingdom",
      "United States",
      "Vietnam",
    ];

    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="large-combobox">Select a country</Label>
          <ComboboxRoot>
            <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
              <ComboboxIcon />
              <ComboboxInput
                id="large-combobox"
                placeholder="Search countries..."
              />
              <ComboboxTrigger />
            </div>
            <ComboboxPopup>
              <ComboboxList>
                {countries.map((country) => (
                  <ComboboxItem key={country} value={country}>
                    {country}
                  </ComboboxItem>
                ))}
                <ComboboxEmpty>No countries found</ComboboxEmpty>
              </ComboboxList>
            </ComboboxPopup>
          </ComboboxRoot>
        </div>
      </div>
    );
  },
};

// Compact variant
export const CompactVariant: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="compact-combobox" className="text-xs">
          Compact Size
        </Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-md bg-card/70 backdrop-blur-md">
            <ComboboxIcon>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </ComboboxIcon>
            <ComboboxInput
              id="compact-combobox"
              placeholder="Search..."
              className="h-8 text-xs"
            />
            <ComboboxTrigger className="h-8" />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="xs" className="py-1.5 text-xs">
                Extra Small
              </ComboboxItem>
              <ComboboxItem value="sm" className="py-1.5 text-xs">
                Small
              </ComboboxItem>
              <ComboboxItem value="md" className="py-1.5 text-xs">
                Medium
              </ComboboxItem>
              <ComboboxItem value="lg" className="py-1.5 text-xs">
                Large
              </ComboboxItem>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// Priority selector with colors
export const PrioritySelectorWithColors: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="priority-combobox">Select priority</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon />
            <ComboboxInput
              id="priority-combobox"
              placeholder="Choose priority level..."
            />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxItem value="critical">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Critical</span>
                </div>
              </ComboboxItem>
              <ComboboxItem value="high">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span>High</span>
                </div>
              </ComboboxItem>
              <ComboboxItem value="medium">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>Medium</span>
                </div>
              </ComboboxItem>
              <ComboboxItem value="low">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Low</span>
                </div>
              </ComboboxItem>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};

// Time zone selector
export const TimeZoneSelector: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="timezone-combobox">Select timezone</Label>
        <ComboboxRoot>
          <div className="flex items-center border border-border rounded-lg bg-card/70 backdrop-blur-md">
            <ComboboxIcon>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </ComboboxIcon>
            <ComboboxInput
              id="timezone-combobox"
              placeholder="Search timezones..."
            />
            <ComboboxTrigger />
          </div>
          <ComboboxPopup>
            <ComboboxList>
              <ComboboxGroup>
                <ComboboxGroupLabel>Europe</ComboboxGroupLabel>
                <ComboboxItem value="cet">CET (UTC+1)</ComboboxItem>
                <ComboboxItem value="eet">EET (UTC+2)</ComboboxItem>
                <ComboboxItem value="wet">WET (UTC+0)</ComboboxItem>
              </ComboboxGroup>
              <ComboboxSeparator />
              <ComboboxGroup>
                <ComboboxGroupLabel>Americas</ComboboxGroupLabel>
                <ComboboxItem value="est">EST (UTC-5)</ComboboxItem>
                <ComboboxItem value="cst">CST (UTC-6)</ComboboxItem>
                <ComboboxItem value="mst">MST (UTC-7)</ComboboxItem>
                <ComboboxItem value="pst">PST (UTC-8)</ComboboxItem>
              </ComboboxGroup>
              <ComboboxSeparator />
              <ComboboxGroup>
                <ComboboxGroupLabel>Asia Pacific</ComboboxGroupLabel>
                <ComboboxItem value="jst">JST (UTC+9)</ComboboxItem>
                <ComboboxItem value="kst">KST (UTC+9)</ComboboxItem>
                <ComboboxItem value="ist">IST (UTC+5:30)</ComboboxItem>
              </ComboboxGroup>
              <ComboboxEmpty>No timezones found</ComboboxEmpty>
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxRoot>
      </div>
    </div>
  ),
};
