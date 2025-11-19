import type { Meta, StoryObj } from '@storybook/react'
import React, { useState, useEffect } from 'react'
import { Progress, ProgressLabel, ProgressValue } from './progress'

const meta: Meta<typeof Progress> = {
  title: 'CossUI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Progress bar component from Coss UI adapted for Ozean Licht design system. Displays progress as a percentage with optional label and value. Uses Ozean Licht primary color (#0ec2bc) for the progress fill.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Current progress value',
      defaultValue: 50,
    },
    max: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Maximum progress value',
      defaultValue: 100,
    },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

/**
 * Basic progress bar with default styling
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <Progress value={args.value} max={args.max} />
    </div>
  ),
  args: {
    value: 50,
    max: 100,
  },
}

/**
 * Progress bar with label and value
 */
export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px]">
      <Progress value={65} max={100}>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>File Upload</ProgressLabel>
          <ProgressValue value={65} max={100} />
        </div>
      </Progress>
    </div>
  ),
}

/**
 * Progress states showing different completion percentages
 */
export const ProgressStates: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Not Started</ProgressLabel>
          <ProgressValue value={0} max={100} />
        </div>
        <Progress value={0} max={100} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>In Progress</ProgressLabel>
          <ProgressValue value={25} max={100} />
        </div>
        <Progress value={25} max={100} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Halfway Done</ProgressLabel>
          <ProgressValue value={50} max={100} />
        </div>
        <Progress value={50} max={100} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Almost Done</ProgressLabel>
          <ProgressValue value={75} max={100} />
        </div>
        <Progress value={75} max={100} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Complete</ProgressLabel>
          <ProgressValue value={100} max={100} />
        </div>
        <Progress value={100} max={100} />
      </div>
    </div>
  ),
}

/**
 * Animated progress bar that shows progression over time
 */
export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 500)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="w-[400px]">
        <Progress value={Math.min(100, progress)} max={100}>
          <div className="flex justify-between items-center mb-2">
            <ProgressLabel>Downloading...</ProgressLabel>
            <ProgressValue value={Math.min(100, progress)} max={100} />
          </div>
        </Progress>
      </div>
    )
  },
}

/**
 * Progress with custom max value (showing 35 out of 50)
 */
export const CustomMaxValue: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Tasks Completed</ProgressLabel>
          <span className="text-sm font-sans font-medium text-primary">
            35 / 50
          </span>
        </div>
        <Progress value={35} max={50} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Storage Used</ProgressLabel>
          <span className="text-sm font-sans font-medium text-primary">
            145 GB / 200 GB
          </span>
        </div>
        <Progress value={145} max={200} />
      </div>
    </div>
  ),
}

/**
 * Progress bars with status-based styling
 */
export const ProgressWithStatus: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Success</ProgressLabel>
          <span className="text-xs font-sans font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
            Complete
          </span>
        </div>
        <Progress value={100} max={100} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Warning</ProgressLabel>
          <span className="text-xs font-sans font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
            60% Complete
          </span>
        </div>
        <Progress value={60} max={100} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Critical</ProgressLabel>
          <span className="text-xs font-sans font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
            At Risk
          </span>
        </div>
        <Progress value={30} max={100} />
      </div>
    </div>
  ),
}

/**
 * Dashboard layout with multiple progress bars
 */
export const DashboardLayout: Story = {
  render: () => (
    <div className="w-[500px] bg-background/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-decorative font-semibold text-foreground mb-4">
          Project Progress Dashboard
        </h3>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Website Redesign</ProgressLabel>
          <ProgressValue value={87} max={100} />
        </div>
        <Progress value={87} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Mobile App Development</ProgressLabel>
          <ProgressValue value={45} max={100} />
        </div>
        <Progress value={45} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>API Integration</ProgressLabel>
          <ProgressValue value={72} max={100} />
        </div>
        <Progress value={72} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Testing & QA</ProgressLabel>
          <ProgressValue value={58} max={100} />
        </div>
        <Progress value={58} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Documentation</ProgressLabel>
          <ProgressValue value={100} max={100} />
        </div>
        <Progress value={100} max={100} />
      </div>
    </div>
  ),
}

/**
 * Real-world example: File upload with detailed information
 */
export const FileUpload: Story = {
  render: () => {
    const [uploadProgress, setUploadProgress] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 20
        })
      }, 300)

      return () => clearInterval(interval)
    }, [])

    const currentUploadProgress = Math.min(100, uploadProgress)

    return (
      <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-4">
        <div>
          <h4 className="text-sm font-decorative font-semibold text-foreground">
            Uploading project_data.zip
          </h4>
          <p className="text-xs text-foreground/60 mt-1">
            Size: 250 MB | Speed: 15 MB/s
          </p>
        </div>

        <Progress value={currentUploadProgress} max={100}>
          <div className="flex justify-between items-center mb-2">
            <ProgressLabel>Upload Progress</ProgressLabel>
            <ProgressValue value={currentUploadProgress} max={100} />
          </div>
        </Progress>

        <div className="flex justify-between text-xs text-foreground/60 pt-2">
          <span>{Math.round((currentUploadProgress / 100) * 250)} MB of 250 MB</span>
          <span>
            {currentUploadProgress === 100
              ? 'Complete!'
              : `${Math.round((100 - currentUploadProgress) * 16)}s remaining`}
          </span>
        </div>
      </div>
    )
  },
}

/**
 * Real-world example: Task completion tracking
 */
export const TaskCompletion: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-decorative font-semibold text-foreground">
              Sprint 47 - Mobile App
            </h4>
            <p className="text-xs text-foreground/60 mt-1">
              19 of 25 tasks completed
            </p>
          </div>
          <span className="text-sm font-sans font-medium text-primary">76%</span>
        </div>
        <Progress value={19} max={25} />
      </div>

      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-decorative font-semibold text-foreground">
              Feature: Dark Mode
            </h4>
            <p className="text-xs text-foreground/60 mt-1">
              12 of 16 subtasks completed
            </p>
          </div>
          <span className="text-sm font-sans font-medium text-primary">75%</span>
        </div>
        <Progress value={12} max={16} />
      </div>

      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-decorative font-semibold text-foreground">
              Bug Fixes
            </h4>
            <p className="text-xs text-foreground/60 mt-1">
              45 of 47 issues resolved
            </p>
          </div>
          <span className="text-sm font-sans font-medium text-primary">96%</span>
        </div>
        <Progress value={45} max={47} />
      </div>
    </div>
  ),
}

/**
 * Skill level visualization
 */
export const SkillLevels: Story = {
  render: () => (
    <div className="w-[400px] bg-card/50 backdrop-blur-8 border border-border rounded-lg p-6 space-y-5">
      <h3 className="text-lg font-decorative font-semibold text-foreground">
        Developer Skills
      </h3>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>TypeScript</ProgressLabel>
          <ProgressValue value={95} max={100} />
        </div>
        <Progress value={95} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>React</ProgressLabel>
          <ProgressValue value={88} max={100} />
        </div>
        <Progress value={88} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Node.js</ProgressLabel>
          <ProgressValue value={82} max={100} />
        </div>
        <Progress value={82} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>Docker</ProgressLabel>
          <ProgressValue value={70} max={100} />
        </div>
        <Progress value={70} max={100} />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center mb-2">
          <ProgressLabel>DevOps</ProgressLabel>
          <ProgressValue value={65} max={100} />
        </div>
        <Progress value={65} max={100} />
      </div>
    </div>
  ),
}

/**
 * Minimal progress bar without any decorations
 */
export const Minimal: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      <Progress value={25} max={100} />
      <Progress value={50} max={100} />
      <Progress value={75} max={100} />
    </div>
  ),
}

/**
 * Large progress bars with more prominent styling
 */
export const Large: Story = {
  render: () => (
    <div className="w-[400px]">
      <Progress
        value={65}
        max={100}
        className="space-y-3"
        style={{ marginTop: 0 }}
      >
        <div className="flex justify-between items-center mb-3">
          <ProgressLabel className="text-base">Large Progress Bar</ProgressLabel>
          <ProgressValue value={65} max={100} className="text-base" />
        </div>
      </Progress>
      <div
        role="progressbar"
        aria-valuenow={65}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-4 w-full overflow-hidden rounded-full bg-card/70 backdrop-blur-8 border border-border"
      >
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out shadow-lg shadow-primary/30"
          style={{ width: '65%' }}
        />
      </div>
    </div>
  ),
}

/**
 * Progress bars in different contexts with surrounding content
 */
export const InContext: Story = {
  render: () => (
    <div className="w-[450px] space-y-4">
      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-5">
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-decorative font-semibold text-foreground">
            Course: Advanced React Patterns
          </h4>
          <p className="text-xs text-foreground/60">
            You're making great progress! Keep going.
          </p>
        </div>
        <Progress value={64} max={100}>
          <div className="flex justify-between items-center mb-2">
            <ProgressLabel className="text-xs">Module 8 of 12</ProgressLabel>
            <ProgressValue value={64} max={100} className="text-xs" />
          </div>
        </Progress>
        <p className="text-xs text-foreground/50 mt-3">
          Next: Advanced Hooks Patterns
        </p>
      </div>

      <div className="bg-card/50 backdrop-blur-8 border border-border rounded-lg p-5">
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-decorative font-semibold text-foreground">
            Personal Goal: Run 50 km this month
          </h4>
          <p className="text-xs text-foreground/60">
            You've run 32 km so far. Almost there!
          </p>
        </div>
        <Progress value={32} max={50}>
          <div className="flex justify-between items-center mb-2">
            <ProgressLabel className="text-xs">32 / 50 km</ProgressLabel>
            <span className="text-xs font-sans font-medium text-primary">64%</span>
          </div>
        </Progress>
      </div>
    </div>
  ),
}
