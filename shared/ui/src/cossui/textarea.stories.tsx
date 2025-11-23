/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Textarea as TextareaBase } from './textarea'
import { Label } from './label'

// Cast Textarea to allow for custom props without type conflicts
const Textarea = TextareaBase as any

const meta: Meta<typeof TextareaBase> = {
  title: 'Tier 1: Primitives/CossUI/Textarea',
  component: Textarea as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Textarea component from Coss UI adapted for Ozean Licht design system. Features glass morphism effects, adjustable heights, resize controls, and support for form integrations with real-world examples.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when textarea is empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text lines (height)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default text content',
    },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

// ============================================================================
// BASIC STORIES
// ============================================================================

/**
 * Default textarea component with standard glass effect styling.
 * Shows the minimal height of 60px with no preset rows.
 */
export const Default: Story = {
  render: () => <Textarea placeholder="Enter your message here..." />,
}

/**
 * Small textarea with 3 visible rows, suitable for brief comments.
 */
export const SmallTextarea: Story = {
  render: () => (
    <Textarea
      rows={3}
      placeholder="Write a short comment..."
    />
  ),
}

/**
 * Medium textarea with 5 visible rows, ideal for standard form inputs.
 */
export const MediumTextarea: Story = {
  render: () => (
    <Textarea
      rows={5}
      placeholder="Enter your message here..."
    />
  ),
}

/**
 * Large textarea with 10 visible rows, perfect for longer content.
 */
export const LargeTextarea: Story = {
  render: () => (
    <Textarea
      rows={10}
      placeholder="Write your detailed description here..."
    />
  ),
}

// ============================================================================
// HEIGHT VARIATIONS
// ============================================================================

/**
 * Display multiple textarea height variants for size comparison.
 */
export const HeightVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label>3 Rows (Small)</Label>
        <Textarea rows={3} placeholder="Small textarea - 3 rows" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>5 Rows (Medium)</Label>
        <Textarea rows={5} placeholder="Medium textarea - 5 rows" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>8 Rows (Large)</Label>
        <Textarea rows={8} placeholder="Large textarea - 8 rows" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>10 Rows (Extra Large)</Label>
        <Textarea rows={10} placeholder="Extra large textarea - 10 rows" />
      </div>
    </div>
  ),
}

// ============================================================================
// PLACEHOLDER VARIATIONS
// ============================================================================

/**
 * Different placeholder text examples for various use cases.
 */
export const PlaceholderVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label>With Placeholder</Label>
        <Textarea rows={4} placeholder="This is a helpful placeholder text" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Without Placeholder</Label>
        <Textarea rows={4} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Long Placeholder</Label>
        <Textarea
          rows={4}
          placeholder="This is a longer placeholder that provides more detailed guidance about what users should enter in this textarea field..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Hint-style Placeholder</Label>
        <Textarea rows={4} placeholder="e.g., Describe your experience in 3-5 sentences" />
      </div>
    </div>
  ),
}

// ============================================================================
// STATE VARIATIONS
// ============================================================================

/**
 * Disabled state for textareas that are not editable.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-sm">Disabled (Small)</Label>
        <Textarea
          id="disabled-sm"
          rows={3}
          placeholder="This textarea is disabled"
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-md">Disabled (Medium)</Label>
        <Textarea
          id="disabled-md"
          rows={5}
          placeholder="This textarea is disabled"
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-lg">Disabled (Large)</Label>
        <Textarea
          id="disabled-lg"
          rows={8}
          placeholder="This textarea is disabled"
          disabled
        />
      </div>
    </div>
  ),
}

/**
 * Disabled with pre-filled content to show read-only state.
 */
export const DisabledWithContent: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <Label htmlFor="disabled-content">Read-only Message</Label>
      <Textarea
        id="disabled-content"
        rows={5}
        defaultValue="This is a read-only message that cannot be edited. It contains important information that the user should be aware of but cannot modify."
        disabled
      />
    </div>
  ),
}

// ============================================================================
// RESIZE VARIATIONS
// ============================================================================

/**
 * Display resize behavior examples using Tailwind CSS classes.
 */
export const ResizeVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label>No Resize (resize-none)</Label>
        <Textarea
          rows={5}
          placeholder="Cannot be resized in any direction"
          className="resize-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Vertical Resize Only (resize-y)</Label>
        <Textarea
          rows={5}
          placeholder="Can only be resized vertically"
          className="resize-y"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Horizontal Resize Only (resize-x)</Label>
        <Textarea
          rows={5}
          placeholder="Can only be resized horizontally"
          className="resize-x"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Full Resize (resize) - Default</Label>
        <Textarea
          rows={5}
          placeholder="Can be resized in any direction"
          className="resize"
        />
      </div>
    </div>
  ),
}

// ============================================================================
// WITH LABELS
// ============================================================================

/**
 * Textarea with associated Label component.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <Label htmlFor="with-label">Your Message</Label>
      <Textarea
        id="with-label"
        rows={5}
        placeholder="Type your message here..."
      />
    </div>
  ),
}

/**
 * Textarea with label and additional description text.
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <Label htmlFor="with-description">Additional Notes</Label>
      <Textarea
        id="with-description"
        rows={5}
        placeholder="Add any additional notes or comments..."
      />
      <p className="text-xs text-muted-foreground">
        Optional: Provide any additional information that might be helpful.
      </p>
    </div>
  ),
}

// ============================================================================
// WITH HELPER TEXT
// ============================================================================

/**
 * Textarea with helper text providing guidance to users.
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <Label htmlFor="with-helper">Product Feedback</Label>
      <Textarea
        id="with-helper"
        rows={6}
        placeholder="Tell us what you think about our product..."
      />
      <p className="text-xs text-muted-foreground">
        Your feedback helps us improve. Please be as detailed as possible.
      </p>
    </div>
  ),
}

/**
 * Textarea with multiple helper hints.
 */
export const WithDetailedHelpers: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <Label htmlFor="detailed-helper">Essay Topic</Label>
      <Textarea
        id="detailed-helper"
        rows={8}
        placeholder="Write your essay here..."
      />
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Tips for writing:</p>
        <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
          <li>Use clear and concise language</li>
          <li>Organize your thoughts into paragraphs</li>
          <li>Proofread before submitting</li>
        </ul>
      </div>
    </div>
  ),
}

// ============================================================================
// WITH CHARACTER COUNT
// ============================================================================

/**
 * Interactive textarea with character counter.
 */
export const WithCharacterCount: Story = {
  render: () => {
    const [text, setText] = useState('')
    const maxChars = 200
    const remaining = maxChars - text.length

    return (
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        <Label htmlFor="char-count">Bio (max 200 characters)</Label>
        <Textarea
          id="char-count"
          rows={4}
          placeholder="Tell us about yourself..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxChars}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {text.length} / {maxChars} characters
          </p>
          <p
            className={`text-xs font-medium ${
              remaining < 20
                ? 'text-orange-500'
                : remaining < 10
                  ? 'text-red-500'
                  : 'text-green-500'
            }`}
          >
            {remaining} remaining
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// FOCUS STATE
// ============================================================================

/**
 * Demonstrate focus state with auto-focus.
 */
export const FocusState: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="focused">Auto-Focused Textarea</Label>
        <Textarea
          id="focused"
          rows={4}
          autoFocus
          placeholder="This textarea is auto-focused"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="unfocused">Regular Textarea</Label>
        <Textarea
          id="unfocused"
          rows={4}
          placeholder="Click the textarea above to see the focus state transition"
        />
      </div>
    </div>
  ),
}

// ============================================================================
// FORM EXAMPLES
// ============================================================================

/**
 * Real-world comment form example.
 */
export const CommentForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Leave a Comment</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Share your thoughts on this article
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="comment-name">Name</Label>
        <input
          id="comment-name"
          type="text"
          placeholder="Your name"
          className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="comment-email">Email (will not be published)</Label>
        <input
          id="comment-email"
          type="email"
          placeholder="your@email.com"
          className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="comment-text">Comment</Label>
        <Textarea
          id="comment-text"
          rows={5}
          placeholder="Write your comment here..."
        />
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Post Comment
      </button>
    </div>
  ),
}

/**
 * Feedback form for collecting user opinions.
 */
export const FeedbackForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Send us Your Feedback</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Help us improve by sharing your experience
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="feedback-rating">How would you rate your experience?</Label>
        <select className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <option>Select a rating...</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Average</option>
          <option>Poor</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="feedback-text">Tell us more (optional)</Label>
        <Textarea
          id="feedback-text"
          rows={6}
          placeholder="What could we improve? What did you like? Any suggestions?"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="follow-up"
          className="w-4 h-4"
        />
        <Label htmlFor="follow-up" className="font-normal text-xs">
          I would like to receive a follow-up response
        </Label>
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Submit Feedback
      </button>
    </div>
  ),
}

/**
 * Contact form combining textareas for different purposes.
 */
export const ContactForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Contact Us</h2>
        <p className="text-sm text-muted-foreground mt-1">
          We'd love to hear from you. Send us a message!
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="contact-first">First Name</Label>
          <input
            id="contact-first"
            type="text"
            placeholder="John"
            className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="contact-last">Last Name</Label>
          <input
            id="contact-last"
            type="text"
            placeholder="Doe"
            className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">Email Address</Label>
        <input
          id="contact-email"
          type="email"
          placeholder="john@example.com"
          className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <input
          id="contact-subject"
          type="text"
          placeholder="What is this about?"
          className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="Write your message here..."
        />
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        Send Message
      </button>
    </div>
  ),
}

/**
 * Task description/notes form.
 */
export const TaskForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Create Task</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add a new task to your project
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-title">Task Title</Label>
        <input
          id="task-title"
          type="text"
          placeholder="e.g., Fix homepage layout issue"
          className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          rows={6}
          placeholder="Describe the task in detail. Include steps to reproduce, expected behavior, and any other relevant information."
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="task-priority">Priority</Label>
          <select className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Label htmlFor="task-duedate">Due Date</Label>
          <input
            id="task-duedate"
            type="date"
            className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button className="h-8 px-4 rounded-md border border-border bg-card/50 text-foreground text-sm font-medium transition-all hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Cancel
        </button>
        <button className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Create Task
        </button>
      </div>
    </div>
  ),
}

// ============================================================================
// GLASS EFFECT VARIANTS
// ============================================================================

/**
 * Textarea with glass effect background context.
 */
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6">
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        <Label className="text-foreground/90">Message</Label>
        <Textarea
          rows={5}
          placeholder="Type your message with glass effect background..."
          className="glass-card"
        />
      </div>
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        <Label className="text-foreground/90">Description</Label>
        <Textarea
          rows={6}
          placeholder="Enhanced glass effect with stronger background..."
          className="glass-card-strong"
        />
      </div>
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        <Label className="text-foreground/90">Notes</Label>
        <Textarea
          rows={4}
          placeholder="Subtle glass effect for less prominent fields..."
          className="glass-subtle"
        />
      </div>
    </div>
  ),
}

// ============================================================================
// VALIDATION STATES
// ============================================================================

/**
 * Textarea with validation feedback.
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="valid-textarea">Valid Response</Label>
        <Textarea
          id="valid-textarea"
          rows={4}
          placeholder="This is a valid response..."
          defaultValue="This is a well-formed and complete response that meets all requirements."
          className="border-green-500/50 focus-visible:ring-green-500"
        />
        <p className="text-xs text-green-500">Response looks good!</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="invalid-textarea">Invalid Response</Label>
        <Textarea
          id="invalid-textarea"
          rows={4}
          placeholder="This is an invalid response..."
          defaultValue="x"
          className="border-red-500/50 focus-visible:ring-red-500"
        />
        <p className="text-xs text-red-500">Response is too short. Please provide at least 10 characters.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="warning-textarea">Warning State</Label>
        <Textarea
          id="warning-textarea"
          rows={4}
          placeholder="This needs more detail..."
          defaultValue="This response is acceptable but could use more detail."
          className="border-yellow-500/50 focus-visible:ring-yellow-500"
        />
        <p className="text-xs text-yellow-500">Consider providing more specific examples.</p>
      </div>
    </div>
  ),
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Textarea with proper accessibility attributes.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-textarea-1">
          Question <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="accessible-textarea-1"
          rows={5}
          placeholder="Please answer the question..."
          aria-required="true"
          aria-label="Answer to the survey question"
          aria-describedby="question-description"
        />
        <p id="question-description" className="text-xs text-muted-foreground">
          Provide a detailed answer to help us understand your perspective.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="accessible-textarea-2">
          Additional Comments <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Textarea
          id="accessible-textarea-2"
          rows={4}
          placeholder="Add any additional comments..."
          aria-label="Additional comments field"
          aria-describedby="comments-description"
        />
        <p id="comments-description" className="text-xs text-muted-foreground">
          This field is optional but helpful for improving our services.
        </p>
      </div>

      <button
        type="submit"
        className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90"
      >
        Submit Survey
      </button>
    </div>
  ),
}

// ============================================================================
// ADVANCED EXAMPLES
// ============================================================================

/**
 * Product description editor with formatting hints.
 */
export const ProductDescriptionEditor: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
      <div>
        <h2 className="text-lg font-alt font-medium text-foreground">Product Description</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Write a compelling product description
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="product-desc">Description</Label>
          <span className="text-xs text-muted-foreground">Recommended: 50-200 words</span>
        </div>
        <Textarea
          id="product-desc"
          rows={8}
          placeholder="Describe your product's features, benefits, and unique selling points..."
        />
      </div>

      <div className="bg-background/50 rounded-md p-4 border border-border/50">
        <h3 className="text-sm font-medium text-foreground mb-3">Formatting Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Focus on customer benefits, not just features</li>
          <li>• Use simple, clear language</li>
          <li>• Highlight unique aspects of the product</li>
          <li>• Include key product specifications</li>
          <li>• Make it scannable with short paragraphs</li>
        </ul>
      </div>

      <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90">
        Save Description
      </button>
    </div>
  ),
}

/**
 * Newsletter signup with message preview.
 */
export const NewsletterForm: Story = {
  render: () => {
    const [message, setMessage] = useState('')

    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <div>
          <h2 className="text-lg font-alt font-medium text-foreground">Subscribe to Newsletter</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Get the latest updates delivered to your inbox
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="newsletter-email">Email Address</Label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="your@email.com"
            className="flex h-8 w-full rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="newsletter-interests">Topics of Interest</Label>
          <Textarea
            id="newsletter-interests"
            rows={4}
            placeholder="Select topics you're interested in (e.g., Technology, Design, Business)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {message && (
          <div className="p-3 bg-background/50 rounded-md border border-primary/20">
            <p className="text-xs font-medium text-primary mb-2">Preview:</p>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{message}</p>
          </div>
        )}

        <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90">
          Subscribe
        </button>
      </div>
    )
  },
}
