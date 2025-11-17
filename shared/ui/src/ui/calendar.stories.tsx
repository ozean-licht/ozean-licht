import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';
import { Label } from './label';
import * as React from 'react';

/**
 * Calendar component for date selection.
 * Built on react-day-picker with enhanced styling and features.
 *
 * ## Features
 * - Single date selection
 * - Date range selection
 * - Multiple date selection
 * - Disabled dates
 * - Multiple months display
 * - Dropdown month/year selection
 * - Week numbers
 * - Controlled and uncontrolled modes
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Custom date formatters
 * - Min/max date constraints
 * - Custom day rendering
 *
 * ## Date Selection Modes
 * - **Single**: Select one date (default)
 * - **Range**: Select a start and end date
 * - **Multiple**: Select multiple individual dates
 *
 * ## Keyboard Navigation
 * - Arrow Keys: Navigate between days
 * - Enter/Space: Select focused date
 * - PageUp/PageDown: Navigate between months
 * - Home/End: Navigate to start/end of week
 * - Escape: Close calendar (when in popover)
 *
 * ## Accessibility
 * - Full keyboard navigation support
 * - ARIA labels for screen readers
 * - Focus management
 * - Semantic HTML structure
 *
 * ## Usage with Forms
 * Typically used inside a Popover component for date picker inputs:
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline">Pick a date</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <Calendar mode="single" selected={date} onSelect={setDate} />
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A date picker component that allows users to select dates from a calendar interface.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode for the calendar',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Show days outside the current month',
    },
    captionLayout: {
      control: 'radio',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
      description: 'Layout for the month caption',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all dates',
    },
    numberOfMonths: {
      control: 'number',
      description: 'Number of months to display',
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default calendar with single date selection
 */
export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};

/**
 * Calendar with no initial selection
 */
export const NoSelection: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};

/**
 * Date range selection mode
 */
export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          className="rounded-md border"
          numberOfMonths={2}
        />
        {range?.from && (
          <div className="rounded-md border border-[#0ec2bc]/20 bg-[#0ec2bc]/5 p-3">
            <p className="text-sm text-muted-foreground">
              Selected range:{' '}
              <span className="font-semibold text-[#0ec2bc]">
                {range.from.toLocaleDateString()}
                {range.to ? ` - ${range.to.toLocaleDateString()}` : ' (select end date)'}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Multiple date selection mode
 */
export const MultipleSelection: Story = {
  render: () => {
    const [dates, setDates] = React.useState<Date[] | undefined>([]);

    return (
      <div className="space-y-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md border"
        />
        {dates && dates.length > 0 && (
          <div className="rounded-md border border-[#0ec2bc]/20 bg-[#0ec2bc]/5 p-3">
            <p className="text-sm font-medium text-[#0ec2bc] mb-2">
              Selected dates ({dates.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {dates.map((date, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-[#0ec2bc] px-2 py-1 text-xs font-medium text-white"
                >
                  {date.toLocaleDateString()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Calendar with disabled dates (past dates)
 */
export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    const today = new Date();

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Select a future date</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Past dates are disabled
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => date < today}
          className="rounded-md border"
        />
      </div>
    );
  },
};

/**
 * Calendar with specific disabled dates
 */
export const WithSpecificDisabledDates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();

    // Disable weekends
    const disabledDates = (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    };

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Select a weekday</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Weekends are disabled
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDates}
          className="rounded-md border"
        />
      </div>
    );
  },
};

/**
 * Calendar with date range constraints
 */
export const WithDateRangeConstraint: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Select a date within next 30 days</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Only dates between today and next month are available
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => date < today || date > nextMonth}
          className="rounded-md border"
        />
      </div>
    );
  },
};

/**
 * Calendar with multiple months
 */
export const MultipleMonths: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        className="rounded-md border"
      />
    );
  },
};

/**
 * Calendar with three months
 */
export const ThreeMonths: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        numberOfMonths={3}
        className="rounded-md border"
      />
    );
  },
};

/**
 * Calendar with dropdown month and year selection
 */
export const WithDropdowns: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const currentYear = new Date().getFullYear();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        fromYear={currentYear - 100}
        toYear={currentYear + 10}
        className="rounded-md border"
      />
    );
  },
};

/**
 * Calendar with month dropdown only
 */
export const WithMonthDropdown: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown-months"
        className="rounded-md border"
      />
    );
  },
};

/**
 * Calendar with year dropdown only
 */
export const WithYearDropdown: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const currentYear = new Date().getFullYear();

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown-years"
        fromYear={currentYear - 10}
        toYear={currentYear + 10}
        className="rounded-md border"
      />
    );
  },
};

/**
 * Calendar with week numbers
 */
export const WithWeekNumbers: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showWeekNumber
        className="rounded-md border"
      />
    );
  },
};

/**
 * Calendar without outside days
 */
export const WithoutOutsideDays: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showOutsideDays={false}
        className="rounded-md border"
      />
    );
  },
};

/**
 * Fully disabled calendar
 */
export const Disabled: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled
        className="rounded-md border opacity-50"
      />
    );
  },
};

/**
 * Calendar with custom starting month
 */
export const CustomStartMonth: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Event booking calendar</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Opens 6 months in the future
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={sixMonthsFromNow}
          className="rounded-md border"
        />
      </div>
    );
  },
};

/**
 * Ozean Licht branded calendar with turquoise accents
 */
export const OzeanLichtBranded: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Wähle ein Datum</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Ozean Licht Kalender mit Türkis-Akzent
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border [&_.rdp-day_button[data-selected-single=true]]:bg-[#0ec2bc] [&_.rdp-day_button[data-selected-single=true]]:text-white [&_.rdp-day_button[data-selected-single=true]]:hover:bg-[#0db3ad]"
        />
        {date && (
          <div className="rounded-md border border-[#0ec2bc]/20 bg-[#0ec2bc]/5 p-3">
            <p className="text-sm text-muted-foreground">
              Ausgewähltes Datum:{' '}
              <span className="font-semibold text-[#0ec2bc]">
                {date.toLocaleDateString('de-AT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Date range selection with Ozean Licht branding
 */
export const OzeanLichtRangeSelection: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Wähle einen Zeitraum</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Für Kursbuchungen oder Veranstaltungen
          </p>
        </div>
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className="rounded-md border [&_.rdp-day_button[data-range-start=true]]:bg-[#0ec2bc] [&_.rdp-day_button[data-range-start=true]]:text-white [&_.rdp-day_button[data-range-end=true]]:bg-[#0ec2bc] [&_.rdp-day_button[data-range-end=true]]:text-white [&_.rdp-day_button[data-range-middle=true]]:bg-[#0ec2bc]/20 [&_.rdp-day_button[data-range-middle=true]]:text-[#0ec2bc]"
        />
        {range?.from && (
          <div className="rounded-md border border-[#0ec2bc]/20 bg-[#0ec2bc]/5 p-3">
            <p className="text-sm text-muted-foreground">
              Ausgewählter Zeitraum:{' '}
              <span className="font-semibold text-[#0ec2bc]">
                {range.from.toLocaleDateString('de-AT')}
                {range.to ? ` - ${range.to.toLocaleDateString('de-AT')}` : ' (Enddatum wählen)'}
              </span>
            </p>
            {range.from && range.to && (
              <p className="text-xs text-muted-foreground mt-1">
                Dauer: {Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))} Tage
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Booking calendar example with disabled past dates and weekends
 */
export const BookingCalendar: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDisabled = (date: Date) => {
      // Disable past dates
      if (date < today) return true;

      // Disable weekends
      const day = date.getDay();
      return day === 0 || day === 6;
    };

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Book a consultation</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Available Monday-Friday, future dates only
          </p>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={isDisabled}
          className="rounded-md border [&_.rdp-day_button[data-selected-single=true]]:bg-[#0ec2bc] [&_.rdp-day_button[data-selected-single=true]]:text-white"
        />
        {date && (
          <div className="space-y-2">
            <div className="rounded-md border border-[#0ec2bc]/20 bg-[#0ec2bc]/5 p-3">
              <p className="text-sm font-medium text-[#0ec2bc] mb-1">
                Selected appointment date
              </p>
              <p className="text-sm text-muted-foreground">
                {date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <button className="w-full rounded-md bg-[#0ec2bc] px-4 py-2 text-sm font-medium text-white hover:bg-[#0db3ad] focus:outline-none focus:ring-2 focus:ring-[#0ec2bc] focus:ring-offset-2">
              Continue to time selection
            </button>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Vacation planner with range selection and excluded dates
 */
export const VacationPlanner: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
      from: undefined,
      to: undefined,
    });

    // Example: Company holidays (Christmas 2024)
    const companyHolidays = [
      new Date(2024, 11, 24), // Dec 24
      new Date(2024, 11, 25), // Dec 25
      new Date(2024, 11, 26), // Dec 26
      new Date(2024, 11, 31), // Dec 31
      new Date(2025, 0, 1),   // Jan 1
    ];

    const isDisabled = (date: Date) => {
      return companyHolidays.some(
        (holiday) =>
          holiday.getDate() === date.getDate() &&
          holiday.getMonth() === date.getMonth() &&
          holiday.getFullYear() === date.getFullYear()
      );
    };

    const calculateWorkdays = () => {
      if (!range?.from || !range?.to) return 0;

      let count = 0;
      const current = new Date(range.from);

      while (current <= range.to) {
        const day = current.getDay();
        const isWeekend = day === 0 || day === 6;
        const isHoliday = isDisabled(current);

        if (!isWeekend && !isHoliday) {
          count++;
        }

        current.setDate(current.getDate() + 1);
      }

      return count;
    };

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Plan your vacation</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Company holidays are highlighted and cannot be selected
          </p>
        </div>
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          disabled={isDisabled}
          className="rounded-md border [&_.rdp-day_button[data-range-start=true]]:bg-[#0ec2bc] [&_.rdp-day_button[data-range-start=true]]:text-white [&_.rdp-day_button[data-range-end=true]]:bg-[#0ec2bc] [&_.rdp-day_button[data-range-end=true]]:text-white [&_.rdp-day_button[data-range-middle=true]]:bg-[#0ec2bc]/20"
        />
        {range?.from && range?.to && (
          <div className="rounded-md border border-[#0ec2bc]/20 bg-[#0ec2bc]/5 p-3 space-y-2">
            <div>
              <p className="text-sm font-medium text-[#0ec2bc] mb-1">
                Vacation summary
              </p>
              <p className="text-sm text-muted-foreground">
                {range.from.toLocaleDateString()} - {range.to.toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total days:</span>
              <span className="font-semibold">
                {Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Workdays:</span>
              <span className="font-semibold text-[#0ec2bc]">{calculateWorkdays()}</span>
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * All calendar states showcase
 */
export const AllStates: Story = {
  render: () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-3">Default State</h3>
          <Calendar
            mode="single"
            className="rounded-md border"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">With Selection</h3>
          <Calendar
            mode="single"
            selected={today}
            className="rounded-md border"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Disabled State</h3>
          <Calendar
            mode="single"
            disabled
            className="rounded-md border opacity-50"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">With Dropdowns</h3>
          <Calendar
            mode="single"
            selected={today}
            captionLayout="dropdown"
            fromYear={2020}
            toYear={2030}
            className="rounded-md border"
          />
        </div>
      </div>
    );
  },
};
