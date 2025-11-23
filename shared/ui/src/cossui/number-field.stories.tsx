/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { type Meta, type StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  NumberField as NumberFieldBase,
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from './number-field'
import { Label } from './label'

// Cast NumberField to allow flexibility without type conflicts
const NumberField = NumberFieldBase as any

const meta: Meta<typeof NumberFieldBase> = {
  title: 'Tier 1: Primitives/CossUI/NumberField',
  component: NumberField as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Number Field component from Coss UI adapted for Ozean Licht design system. Features increment/decrement buttons, step controls, min/max constraints, and support for decimal values with glass morphism effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant of the number field',
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Increment/decrement step value',
    },
    defaultValue: {
      control: 'number',
      description: 'Default value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
}

export default meta
type Story = StoryObj<typeof NumberField>

// Basic Stories - Size Variants
export const Default: Story = {
  render: () => <NumberField defaultValue={0} />,
}

export const Small: Story = {
  render: () => <NumberField size="sm" defaultValue={0} />,
}

export const Large: Story = {
  render: () => <NumberField size="lg" defaultValue={0} />,
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Label>Small (height: 28px)</Label>
        <NumberField size="sm" defaultValue={0} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Default (height: 32px)</Label>
        <NumberField size="default" defaultValue={0} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Large (height: 36px)</Label>
        <NumberField size="lg" defaultValue={0} />
      </div>
    </div>
  ),
}

// With Labels
export const WithLabel: Story = {
  render: () => (
    <NumberField
      label="Quantity"
      defaultValue={1}
      min={1}
      max={100}
    />
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <NumberField
      label="Age"
      helperText="Enter your age (must be 18 or older)"
      defaultValue={18}
      min={18}
      max={120}
    />
  ),
}

// Min/Max Constraints
export const WithMinMax: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <NumberField
        label="Age (18-120)"
        defaultValue={25}
        min={18}
        max={120}
        helperText="Age must be between 18 and 120"
      />
      <NumberField
        label="Quantity (1-10)"
        defaultValue={1}
        min={1}
        max={10}
        helperText="You can order between 1 and 10 items"
      />
    </div>
  ),
}

// Step Increments
export const StepByOne: Story = {
  render: () => (
    <NumberField
      label="Step by 1"
      defaultValue={0}
      step={1}
    />
  ),
}

export const StepByFive: Story = {
  render: () => (
    <NumberField
      label="Step by 5"
      defaultValue={0}
      step={5}
      helperText="Increments by 5"
    />
  ),
}

export const StepByTen: Story = {
  render: () => (
    <NumberField
      label="Step by 10"
      defaultValue={0}
      step={10}
      helperText="Increments by 10"
    />
  ),
}

export const DecimalStep: Story = {
  render: () => (
    <NumberField
      label="Decimal Value (0.1 steps)"
      defaultValue={0}
      step={0.1}
      helperText="Increments by 0.1"
    />
  ),
}

export const AllSteps: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <NumberField
        label="Step: 1"
        defaultValue={0}
        step={1}
      />
      <NumberField
        label="Step: 5"
        defaultValue={0}
        step={5}
      />
      <NumberField
        label="Step: 10"
        defaultValue={0}
        step={10}
      />
      <NumberField
        label="Step: 0.1 (Decimal)"
        defaultValue={0}
        step={0.1}
      />
      <NumberField
        label="Step: 0.01 (Cents)"
        defaultValue={0}
        step={0.01}
      />
    </div>
  ),
}

// Quantity Picker
export const QuantityPicker: Story = {
  render: () => (
    <NumberField
      label="Quantity"
      defaultValue={1}
      min={1}
      max={99}
      step={1}
      helperText="Select quantity (1-99)"
    />
  ),
}

// Price Input with Decimals
export const PriceInput: Story = {
  render: () => (
    <NumberField
      label="Price"
      prefix="$"
      defaultValue={9.99}
      min={0}
      step={0.01}
      helperText="Enter product price"
    />
  ),
}

export const PriceInputEuro: Story = {
  render: () => (
    <NumberField
      label="Price (EUR)"
      prefix="€"
      defaultValue={9.99}
      min={0}
      step={0.01}
      helperText="Enter price in euros"
    />
  ),
}

// Percentage Input
export const PercentageInput: Story = {
  render: () => (
    <NumberField
      label="Discount"
      suffix="%"
      defaultValue={10}
      min={0}
      max={100}
      step={5}
      helperText="Enter discount percentage (0-100%)"
    />
  ),
}

export const TaxRate: Story = {
  render: () => (
    <NumberField
      label="Tax Rate"
      suffix="%"
      defaultValue={20}
      min={0}
      max={100}
      step={0.5}
      helperText="Enter tax rate percentage"
    />
  ),
}

// Age Input
export const AgeInput: Story = {
  render: () => (
    <NumberField
      label="Age"
      defaultValue={25}
      min={0}
      max={120}
      step={1}
      helperText="Enter your age"
    />
  ),
}

export const AdultAgeInput: Story = {
  render: () => (
    <NumberField
      label="Age (18+)"
      defaultValue={18}
      min={18}
      max={120}
      step={1}
      helperText="Must be 18 or older"
    />
  ),
}

// Rating Input
export const RatingInput: Story = {
  render: () => (
    <NumberField
      label="Rating"
      defaultValue={5}
      min={1}
      max={10}
      step={1}
      helperText="Rate from 1 to 10"
    />
  ),
}

export const StarRating: Story = {
  render: () => (
    <NumberField
      label="Star Rating"
      suffix="★"
      defaultValue={5}
      min={1}
      max={5}
      step={1}
      helperText="Give a star rating (1-5)"
    />
  ),
}

// Temperature Control
export const TemperatureControl: Story = {
  render: () => (
    <NumberField
      label="Temperature"
      suffix="°C"
      defaultValue={20}
      min={-10}
      max={40}
      step={0.5}
      helperText="Set temperature in Celsius"
    />
  ),
}

export const TemperatureFahrenheit: Story = {
  render: () => (
    <NumberField
      label="Temperature"
      suffix="°F"
      defaultValue={68}
      min={14}
      max={104}
      step={1}
      helperText="Set temperature in Fahrenheit"
    />
  ),
}

// Volume Control
export const VolumeControl: Story = {
  render: () => (
    <NumberField
      label="Volume"
      suffix="%"
      defaultValue={50}
      min={0}
      max={100}
      step={5}
      helperText="Adjust volume level"
    />
  ),
}

// Weight Input
export const WeightInput: Story = {
  render: () => (
    <NumberField
      label="Weight"
      suffix="kg"
      defaultValue={70}
      min={0}
      max={500}
      step={0.1}
      helperText="Enter weight in kilograms"
    />
  ),
}

export const WeightPounds: Story = {
  render: () => (
    <NumberField
      label="Weight"
      suffix="lbs"
      defaultValue={150}
      min={0}
      max={1000}
      step={0.5}
      helperText="Enter weight in pounds"
    />
  ),
}

// Height Input
export const HeightInput: Story = {
  render: () => (
    <NumberField
      label="Height"
      suffix="cm"
      defaultValue={170}
      min={50}
      max={250}
      step={1}
      helperText="Enter height in centimeters"
    />
  ),
}

// Distance Input
export const DistanceInput: Story = {
  render: () => (
    <NumberField
      label="Distance"
      suffix="km"
      defaultValue={5}
      min={0}
      max={1000}
      step={0.1}
      helperText="Enter distance in kilometers"
    />
  ),
}

// Duration Input
export const DurationMinutes: Story = {
  render: () => (
    <NumberField
      label="Duration"
      suffix="min"
      defaultValue={30}
      min={0}
      max={1440}
      step={5}
      helperText="Enter duration in minutes"
    />
  ),
}

// Custom Increment/Decrement Buttons
export const CustomButtons: Story = {
  render: () => {
    const [value, setValue] = useState(0)
    return (
      <div className="flex flex-col gap-2 w-full max-w-[480px]">
        <Label>Custom Buttons</Label>
        <NumberFieldRoot defaultValue={value} onValueChange={(details: any) => setValue(details.valueAsNumber)}>
          <NumberFieldDecrement>−</NumberFieldDecrement>
          <NumberFieldInput placeholder="Enter number" />
          <NumberFieldIncrement>+</NumberFieldIncrement>
        </NumberFieldRoot>
        <p className="text-xs text-muted-foreground">Current value: {value}</p>
      </div>
    )
  },
}

// Disabled State
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <NumberField
        label="Disabled (Small)"
        size="sm"
        defaultValue={5}
        disabled
      />
      <NumberField
        label="Disabled (Default)"
        defaultValue={10}
        disabled
      />
      <NumberField
        label="Disabled (Large)"
        size="lg"
        defaultValue={15}
        disabled
      />
    </div>
  ),
}

// Read-only State
export const ReadOnly: Story = {
  render: () => (
    <NumberField
      label="Read-only Value"
      defaultValue={42}
      readOnly
      helperText="This value cannot be changed"
    />
  ),
}

// With Units
export const WithUnits: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <NumberField
        label="Price"
        prefix="$"
        defaultValue={99.99}
        step={0.01}
      />
      <NumberField
        label="Discount"
        suffix="%"
        defaultValue={15}
        max={100}
      />
      <NumberField
        label="Temperature"
        suffix="°C"
        defaultValue={22}
        step={0.5}
      />
      <NumberField
        label="Weight"
        suffix="kg"
        defaultValue={75.5}
        step={0.1}
      />
      <NumberField
        label="Distance"
        suffix="km"
        defaultValue={10}
        step={0.1}
      />
    </div>
  ),
}

// Compact Size Variants
export const CompactSize: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Label>Quantity:</Label>
      <NumberField
        size="sm"
        defaultValue={1}
        min={1}
        max={10}
        className="w-32"
      />
    </div>
  ),
}

// Glass Effect Variants
export const WithGlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background via-card to-primary/20 rounded-lg space-y-6">
      <NumberField
        label="Age"
        defaultValue={25}
        min={0}
        max={120}
        className="glass-card"
      />
      <NumberField
        label="Price"
        prefix="$"
        defaultValue={49.99}
        step={0.01}
        className="glass-card-strong"
      />
      <NumberField
        label="Discount"
        suffix="%"
        defaultValue={20}
        max={100}
        className="glass-subtle"
      />
    </div>
  ),
}

// Form Integration - Shopping Cart
export const ShoppingCartForm: Story = {
  render: () => {
    const [quantity, setQuantity] = useState(1)
    const pricePerItem = 29.99
    const total = quantity * pricePerItem

    return (
      <div className="flex flex-col gap-4 w-full p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border max-w-md">
        <div>
          <h2 className="text-lg font-alt font-medium text-foreground">Product Details</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Premium Widget - ${pricePerItem.toFixed(2)}
          </p>
        </div>

        <NumberField
          label="Quantity"
          defaultValue={quantity}
          min={1}
          max={99}
          step={1}
          onValueChange={(details: any) => setQuantity(details.valueAsNumber)}
          helperText={`${quantity} item${quantity !== 1 ? 's' : ''} selected`}
        />

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-foreground">${total.toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Add to Cart
        </button>
      </div>
    )
  },
}

// Form Integration - Recipe Portions
export const RecipePortionsForm: Story = {
  render: () => {
    const [portions, setPortions] = useState(4)
    const baseRecipe = {
      flour: 250,
      eggs: 2,
      milk: 300,
    }

    return (
      <div className="flex flex-col gap-4 w-full p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border max-w-md">
        <div>
          <h2 className="text-lg font-alt font-medium text-foreground">Recipe Scaler</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pancake Recipe
          </p>
        </div>

        <NumberField
          label="Number of Portions"
          defaultValue={portions}
          min={1}
          max={20}
          step={1}
          onValueChange={(details: any) => setPortions(details.valueAsNumber)}
          helperText="Adjust recipe for desired portions"
        />

        <div className="pt-4 border-t border-border space-y-2">
          <h3 className="text-sm font-medium text-foreground">Ingredients:</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Flour:</span>
              <span>{((baseRecipe.flour / 4) * portions).toFixed(0)}g</span>
            </div>
            <div className="flex justify-between">
              <span>Eggs:</span>
              <span>{Math.ceil((baseRecipe.eggs / 4) * portions)}</span>
            </div>
            <div className="flex justify-between">
              <span>Milk:</span>
              <span>{((baseRecipe.milk / 4) * portions).toFixed(0)}ml</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

// Form Integration - Donation Form
export const DonationForm: Story = {
  render: () => {
    const [amount, setAmount] = useState(50)
    const presetAmounts = [10, 25, 50, 100]

    return (
      <div className="flex flex-col gap-4 w-full p-6 bg-card/50 backdrop-blur-8 rounded-lg border border-border max-w-md">
        <div>
          <h2 className="text-lg font-alt font-medium text-foreground">Make a Donation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Support our cause with a one-time donation
          </p>
        </div>

        <div className="flex gap-2">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`flex-1 h-8 px-3 rounded-md text-sm font-medium transition-all ${
                amount === preset
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card/70 text-primary border border-primary/30 hover:bg-primary/10'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        <NumberField
          label="Custom Amount"
          prefix="$"
          defaultValue={amount}
          min={1}
          step={1}
          onValueChange={(details: any) => setAmount(details.valueAsNumber)}
          helperText="Enter a custom donation amount"
        />

        <button className="w-full h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Donate ${amount}
        </button>
      </div>
    )
  },
}

// Accessibility Example
export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <NumberField
        label={
          <>
            Age <span className="text-red-500">*</span>
          </>
        }
        defaultValue={25}
        min={18}
        max={120}
        helperText="You must be at least 18 years old"
      />
      <NumberField
        label={
          <>
            Quantity <span className="text-red-500">*</span>
          </>
        }
        defaultValue={1}
        min={1}
        max={10}
        helperText="Select between 1 and 10 items"
      />
    </div>
  ),
}

// Validation States
export const ValidationStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 w-full max-w-[480px]">
        <Label htmlFor="valid-number">Valid Age</Label>
        <NumberFieldRoot
          id="valid-number"
          defaultValue={25}
          min={18}
          max={120}
          className="border-green-500/50 focus-within:ring-green-500"
        >
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldRoot>
        <p className="text-xs text-green-500">Age is valid</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[480px]">
        <Label htmlFor="invalid-number">Invalid Quantity</Label>
        <NumberFieldRoot
          id="invalid-number"
          defaultValue={0}
          min={1}
          max={10}
          className="border-red-500/50 focus-within:ring-red-500"
        >
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldRoot>
        <p className="text-xs text-red-500">Quantity must be at least 1</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[480px]">
        <Label htmlFor="warning-number">High Price Warning</Label>
        <NumberFieldRoot
          id="warning-number"
          defaultValue={999}
          min={0}
          step={0.01}
          className="border-yellow-500/50 focus-within:ring-yellow-500"
        >
          <NumberFieldDecrement />
          <span className="text-sm text-muted-foreground px-2">$</span>
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldRoot>
        <p className="text-xs text-yellow-500">Price is unusually high, please verify</p>
      </div>
    </div>
  ),
}

// Interactive Example
export const InteractiveExample: Story = {
  render: () => {
    const [value, setValue] = useState(50)

    return (
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <NumberField
          label="Adjust Value"
          defaultValue={value}
          min={0}
          max={100}
          step={1}
          onValueChange={(details: any) => setValue(details.valueAsNumber)}
          helperText={`Current value: ${value}`}
        />
        <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">Value Display:</div>
          <div className="text-4xl font-alt font-bold text-primary">{value}</div>
        </div>
      </div>
    )
  },
}
