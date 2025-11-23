/**
 * Autocomplete Component - Ozean Licht Edition
 * Based on Base UI Popover with custom combobox pattern
 * Implements WCAG combobox pattern with keyboard navigation
 */

import * as React from 'react'
import { Popover } from '@base-ui-components/react/popover'
import { cn } from '../utils/cn'

/**
 * Autocomplete Context for managing shared state
 */
interface AutocompleteContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  value: string
  setValue: (value: string) => void
  inputValue: string
  setInputValue: (value: string) => void
  highlightedIndex: number
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void
  options: React.ReactElement[]
  registerOption: (element: React.ReactElement) => void
}

const AutocompleteContext = React.createContext<AutocompleteContextValue | null>(null)

const useAutocompleteContext = () => {
  const context = React.useContext(AutocompleteContext)
  if (!context) {
    throw new Error('Autocomplete components must be used within AutocompleteRoot')
  }
  return context
}

/**
 * Autocomplete Root Component
 * Manages state and keyboard navigation
 */
interface AutocompleteRootProps {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const AutocompleteRoot = ({
  children,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: AutocompleteRootProps) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [inputValue, setInputValue] = React.useState(controlledValue || defaultValue)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [options, setOptions] = React.useState<React.ReactElement[]>([])

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen

  const setValue = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [controlledValue, onValueChange]
  )

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  const registerOption = React.useCallback((element: React.ReactElement) => {
    setOptions((prev) => [...prev, element])
  }, [])

  const contextValue: AutocompleteContextValue = {
    open,
    setOpen,
    value,
    setValue,
    inputValue,
    setInputValue,
    highlightedIndex,
    setHighlightedIndex,
    options,
    registerOption,
  }

  return (
    <AutocompleteContext.Provider value={contextValue}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        {children}
      </Popover.Root>
    </AutocompleteContext.Provider>
  )
}

/**
 * Autocomplete Input Component
 * Text input with combobox ARIA attributes
 */
interface AutocompleteInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  onInputChange?: (value: string) => void
}

const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ className, onInputChange, onKeyDown, onFocus, ...restProps }, forwardedRef) => {
    const { open, setOpen, inputValue, setInputValue, highlightedIndex, setHighlightedIndex, options } =
      useAutocompleteContext()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onInputChange?.(newValue)
      if (!open) {
        setOpen(true)
      }
      setHighlightedIndex(-1) // Reset highlight when typing
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!open) {
          setOpen(true)
        } else {
          setHighlightedIndex((prev: number) => Math.min(prev + 1, options.length - 1))
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev: number) => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (open && highlightedIndex >= 0 && options[highlightedIndex]) {
          const option = options[highlightedIndex]
          const value = option.props.value || ''
          const label = option.props.children || value
          setInputValue(typeof label === 'string' ? label : value)
          setOpen(false)
          setHighlightedIndex(-1)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        setHighlightedIndex(-1)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(e)
      if (inputValue) {
        setOpen(true)
      }
    }

    return (
      <Popover.Trigger
        ref={forwardedRef}
        render={(triggerProps, triggerRef) => (
          <input
            {...triggerProps}
            {...restProps}
            ref={triggerRef as unknown as React.Ref<HTMLInputElement>}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls="autocomplete-list"
            aria-activedescendant={
              highlightedIndex >= 0 ? `autocomplete-option-${highlightedIndex}` : undefined
            }
            className={cn(
              'flex w-full max-w-[480px] rounded-md border border-border bg-card/50 backdrop-blur-8 px-3 py-2',
              'h-10 text-sm font-sans text-foreground shadow-sm transition-all',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ec2bc] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'hover:border-[#0ec2bc]/30',
              className
            )}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
          />
        )}
      />
    )
  }
)
AutocompleteInput.displayName = 'AutocompleteInput'

/**
 * Autocomplete List Component
 * Container for autocomplete options
 */
interface AutocompleteListProps {
  children: React.ReactNode
  className?: string
  sideOffset?: number
  emptyMessage?: string
}

const AutocompleteList = React.forwardRef<HTMLDivElement, AutocompleteListProps>(
  ({ children, className, sideOffset = 4, emptyMessage = 'No results found' }, forwardedRef) => {
    const { inputValue } = useAutocompleteContext()

    // Count visible children
    const childArray = React.Children.toArray(children)
    const visibleChildren = childArray.filter((child) => {
      if (React.isValidElement(child) && child.props.value) {
        return true
      }
      return false
    })

    const isEmpty = visibleChildren.length === 0 && inputValue.length > 0

    return (
      <Popover.Portal>
        <Popover.Positioner sideOffset={sideOffset}>
          <Popover.Popup
            ref={forwardedRef}
            id="autocomplete-list"
            role="listbox"
            className={cn(
              'z-50 w-full min-w-[var(--anchor-width)] max-h-[300px] overflow-y-auto rounded-lg',
              'bg-[#00111A]/95 backdrop-blur-16 border border-[#0ec2bc]/20',
              'shadow-lg shadow-[#0ec2bc]/10 p-1',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
              className
            )}
          >
            {isEmpty ? (
              <div className="px-3 py-6 text-center text-sm font-sans text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              children
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    )
  }
)
AutocompleteList.displayName = 'AutocompleteList'

/**
 * Autocomplete Option Component
 * Individual selectable option
 */
interface AutocompleteOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
  disabled?: boolean
  keywords?: string[] // Additional keywords for filtering
}

const AutocompleteOption = React.forwardRef<HTMLDivElement, AutocompleteOptionProps>(
  ({ value, children, disabled = false, keywords = [], className, onClick, ...props }, forwardedRef) => {
    const { inputValue, setInputValue, setOpen, highlightedIndex, setHighlightedIndex, registerOption } =
      useAutocompleteContext()

    const optionRef = React.useRef<HTMLDivElement>(null)
    const [index, setIndex] = React.useState(-1)

    // Register this option with the context
    React.useEffect(() => {
      const element = <AutocompleteOption value={value}>{children}</AutocompleteOption>
      registerOption(element)
      setIndex((prev: number) => prev + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Scroll highlighted option into view
    React.useEffect(() => {
      if (index === highlightedIndex && optionRef.current) {
        optionRef.current.scrollIntoView({ block: 'nearest' })
      }
    }, [highlightedIndex, index])

    // Filter logic - check if option matches input
    const textContent = typeof children === 'string' ? children : value
    const searchTerms = [textContent.toLowerCase(), value.toLowerCase(), ...keywords.map((k) => k.toLowerCase())]
    const matches = searchTerms.some((term) => term.includes(inputValue.toLowerCase()))

    if (!matches && inputValue.length > 0) {
      return null
    }

    const isHighlighted = index === highlightedIndex

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      onClick?.(e)
      setInputValue(textContent)
      setOpen(false)
      setHighlightedIndex(-1)
    }

    const handleMouseEnter = () => {
      if (!disabled) {
        setHighlightedIndex(index)
      }
    }

    // Highlight matching text
    const highlightMatch = (text: string, query: string) => {
      if (!query) return text
      const lowerText = text.toLowerCase()
      const lowerQuery = query.toLowerCase()
      const startIndex = lowerText.indexOf(lowerQuery)

      if (startIndex === -1) return text

      const beforeMatch = text.slice(0, startIndex)
      const match = text.slice(startIndex, startIndex + query.length)
      const afterMatch = text.slice(startIndex + query.length)

      return (
        <>
          {beforeMatch}
          <span className="font-medium text-[#0ec2bc]">{match}</span>
          {afterMatch}
        </>
      )
    }

    return (
      <div
        ref={forwardedRef || optionRef}
        role="option"
        aria-selected={isHighlighted}
        aria-disabled={disabled}
        id={`autocomplete-option-${index}`}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2',
          'text-sm font-sans font-light text-[#C4C8D4]',
          'outline-none transition-colors',
          isHighlighted && !disabled && 'bg-[#0ec2bc]/10 text-[#0ec2bc]',
          !isHighlighted && !disabled && 'hover:bg-[#0ec2bc]/5 hover:text-[#C4C8D4]',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {typeof children === 'string' ? highlightMatch(children, inputValue) : children}
      </div>
    )
  }
)
AutocompleteOption.displayName = 'AutocompleteOption'

/**
 * Autocomplete Group Component
 * Groups related options with a label
 */
interface AutocompleteGroupProps {
  label?: string
  children: React.ReactNode
  className?: string
}

const AutocompleteGroup = ({ label, children, className }: AutocompleteGroupProps) => {
  return (
    <div className={cn('py-1', className)}>
      {label && (
        <div className="px-3 py-1.5 text-xs font-alt font-medium text-[#0ec2bc]/70">
          {label}
        </div>
      )}
      {children}
    </div>
  )
}
AutocompleteGroup.displayName = 'AutocompleteGroup'

/**
 * Autocomplete Separator Component
 */
const AutocompleteSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
))
AutocompleteSeparator.displayName = 'AutocompleteSeparator'

export {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteOption,
  AutocompleteGroup,
  AutocompleteSeparator,
}
