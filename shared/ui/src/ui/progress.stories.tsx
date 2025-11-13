import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Progress } from './progress';
import { Label } from './label';
import * as React from 'react';

/**
 * Progress component for displaying completion status of a task or operation.
 * Built on Radix UI Progress primitive.
 *
 * ## Features
 * - Determinate progress (0-100%)
 * - Indeterminate state support
 * - Smooth transitions
 * - ARIA attributes for accessibility
 * - Customizable colors and sizes
 * - Works with labels for context
 *
 * ## Accessibility
 * - Uses `role="progressbar"` for screen readers
 * - Reports current value and max value via ARIA
 * - Label support with aria-labelledby
 * - Indeterminate state properly announced
 *
 * ## Usage
 * ```tsx
 * <Progress value={60} />
 * ```
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The progress value (0-100)',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default progress bar at 0%
 */
export const Default: Story = {
  args: {
    value: 0,
  },
};

/**
 * Progress at 25%
 */
export const TwentyFivePercent: Story = {
  args: {
    value: 25,
  },
};

/**
 * Progress at 50% (half complete)
 */
export const FiftyPercent: Story = {
  args: {
    value: 50,
  },
};

/**
 * Progress at 75%
 */
export const SeventyFivePercent: Story = {
  args: {
    value: 75,
  },
};

/**
 * Progress at 100% (complete)
 */
export const Complete: Story = {
  args: {
    value: 100,
  },
};

/**
 * Indeterminate progress (no value set)
 * Useful for operations where progress cannot be determined
 */
export const Indeterminate: Story = {
  args: {
    value: undefined,
  },
};

/**
 * Progress with label
 */
export const WithLabel: Story = {
  render: () => (
    <div className="w-full space-y-2">
      <Label htmlFor="file-upload">Uploading file...</Label>
      <Progress id="file-upload" value={60} />
    </div>
  ),
};

/**
 * Progress with percentage display
 */
export const WithPercentage: Story = {
  render: () => {
    const value = 65;

    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Installation progress</Label>
          <span className="text-muted-foreground">{value}%</span>
        </div>
        <Progress value={value} />
      </div>
    );
  },
};

/**
 * Progress with live value tracking
 */
export const WithLiveValue: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (value < 100) {
          setValue(value + 1);
        }
      }, 50);
      return () => clearTimeout(timer);
    }, [value]);

    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Processing...</Label>
          <span className="text-muted-foreground">{value}%</span>
        </div>
        <Progress value={value} />
      </div>
    );
  },
};

/**
 * Small progress bar
 */
export const Small: Story = {
  render: () => (
    <Progress value={60} className="h-2" />
  ),
};

/**
 * Large progress bar
 */
export const Large: Story = {
  render: () => (
    <Progress value={60} className="h-6" />
  ),
};

/**
 * Progress with custom color (Ozean Licht turquoise)
 */
export const OzeanLichtBranded: Story = {
  render: () => (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <Label>Course progress</Label>
        <span className="font-medium" style={{ color: '#0ec2bc' }}>75%</span>
      </div>
      <Progress
        value={75}
        className="[&>div]:bg-[#0ec2bc]"
      />
    </div>
  ),
};

/**
 * Progress with custom background and indicator colors
 */
export const CustomColors: Story = {
  render: () => (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label className="text-green-700">Success</Label>
        <Progress
          value={80}
          className="bg-green-100 [&>div]:bg-green-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-yellow-700">Warning</Label>
        <Progress
          value={45}
          className="bg-yellow-100 [&>div]:bg-yellow-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-red-700">Error</Label>
        <Progress
          value={90}
          className="bg-red-100 [&>div]:bg-red-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-blue-700">Info</Label>
        <Progress
          value={60}
          className="bg-blue-100 [&>div]:bg-blue-500"
        />
      </div>
    </div>
  ),
};

/**
 * File upload progress example
 */
export const FileUpload: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(13);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 10);
        }
      }, 500);
      return () => clearTimeout(timer);
    }, [progress]);

    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>document.pdf</Label>
          <span className="text-muted-foreground">
            {progress < 100 ? `${progress}%` : 'Complete ✓'}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {progress < 100 ? 'Uploading...' : 'Upload complete'}
        </p>
      </div>
    );
  },
};

/**
 * Download progress example
 */
export const Download: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);
    const totalSize = 45.6; // MB

    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (progress < 100) {
          setProgress(progress + 2);
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [progress]);

    const downloaded = ((progress / 100) * totalSize).toFixed(1);

    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Downloading software update...</Label>
          <span className="text-muted-foreground">
            {downloaded} MB / {totalSize} MB
          </span>
        </div>
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress}% complete</span>
          <span>{progress < 100 ? 'Time remaining: ~2 min' : 'Download complete'}</span>
        </div>
      </div>
    );
  },
};

/**
 * Course progress tracker
 */
export const CourseProgress: Story = {
  render: () => {
    const completedLessons = 12;
    const totalLessons = 20;
    const progress = (completedLessons / totalLessons) * 100;

    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Course: React Fundamentals</Label>
          <span className="font-medium" style={{ color: '#0ec2bc' }}>
            {completedLessons}/{totalLessons} lessons
          </span>
        </div>
        <Progress
          value={progress}
          className="[&>div]:bg-[#0ec2bc]"
        />
        <p className="text-xs text-muted-foreground">
          {Math.round(progress)}% complete - {totalLessons - completedLessons} lessons remaining
        </p>
      </div>
    );
  },
};

/**
 * Installation steps progress
 */
export const InstallationSteps: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const totalSteps = 5;
    const progress = (currentStep / totalSteps) * 100;

    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (currentStep < totalSteps) {
          setCurrentStep(currentStep + 1);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }, [currentStep]);

    const steps = [
      'Verifying system requirements',
      'Downloading dependencies',
      'Installing packages',
      'Configuring environment',
      'Finalizing setup'
    ];

    return (
      <div className="w-full space-y-3">
        <div className="flex justify-between text-sm">
          <Label>Installation in progress</Label>
          <span className="text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="space-y-1">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-xs ${
                index < currentStep
                  ? 'text-green-600 line-through'
                  : index === currentStep
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {index < currentStep ? '✓' : index === currentStep ? '▶' : '○'} {step}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Multiple progress bars (dashboard example)
 */
export const MultipleProgress: Story = {
  render: () => (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Storage used</Label>
          <span className="text-muted-foreground">7.2 GB / 10 GB</span>
        </div>
        <Progress value={72} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Memory usage</Label>
          <span className="text-muted-foreground">4.8 GB / 8 GB</span>
        </div>
        <Progress value={60} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>CPU usage</Label>
          <span className="text-muted-foreground">45%</span>
        </div>
        <Progress value={45} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Bandwidth</Label>
          <span className="text-muted-foreground">850 GB / 1 TB</span>
        </div>
        <Progress value={85} />
      </div>
    </div>
  ),
};

/**
 * Profile completion tracker
 */
export const ProfileCompletion: Story = {
  render: () => {
    const completedFields = 6;
    const totalFields = 10;
    const progress = (completedFields / totalFields) * 100;

    return (
      <div className="w-full space-y-3">
        <div className="flex justify-between text-sm">
          <Label>Profile completion</Label>
          <span className="font-medium" style={{ color: '#0ec2bc' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress
          value={progress}
          className="h-3 [&>div]:bg-[#0ec2bc]"
        />
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-green-600">✓ Basic information</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Profile picture</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Contact details</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">✓ Bio</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Skills</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Work experience</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Education</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">○ Certifications</span>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * All progress states showcase
 */
export const AllStates: Story = {
  render: () => (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <Label className="text-base">0% - Not started</Label>
        <Progress value={0} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">25% - Getting started</Label>
        <Progress value={25} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">50% - Half way</Label>
        <Progress value={50} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">75% - Almost there</Label>
        <Progress value={75} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">100% - Complete</Label>
        <Progress value={100} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Indeterminate - Unknown progress</Label>
        <Progress value={undefined} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Small size (h-2)</Label>
        <Progress value={60} className="h-2" />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Default size (h-4)</Label>
        <Progress value={60} />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Large size (h-6)</Label>
        <Progress value={60} className="h-6" />
      </div>

      <div className="space-y-2">
        <Label className="text-base">Custom color (Ozean Licht turquoise)</Label>
        <Progress value={60} className="[&>div]:bg-[#0ec2bc]" />
      </div>
    </div>
  ),
};
