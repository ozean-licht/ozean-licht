/**
 * Autocomplete Component - Ozean Licht Edition
 * Custom implementation with WCAG combobox pattern
 * Implements keyboard navigation and proper focus management
 */

import * as React from 'react'
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

  const contextValue: AutocompleteContextValue = {
    open,
    setOpen,
    value,
    setValue,
    inputValue,
    setInputValue,
    highlightedIndex,
    setHighlightedIndex,
  }

  return (
    <AutocompleteContext.Provider value={contextValue}>
      <div className="relative inline-block w-full">
        {children}
      </div>
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
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ className, onInputChange, onKeyDown, onFocus, onBlur, ...restProps }, forwardedRef) => {
    const { open, setOpen, inputValue, setInputValue, highlightedIndex, setHighlightedIndex } =
      useAutocompleteContext()

    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onInputChange?.(newValue)
      if (!open && newValue.length > 0) {
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
          setHighlightedIndex(0)
        } else {
          // Find the listbox
          const listbox = document.getElementById('autocomplete-list')
          if (!listbox) return

          const visibleOptions = Array.from(listbox.querySelectorAll('[role="option"]'))
          const maxIndex = visibleOptions.length - 1
          setHighlightedIndex((prev: number) => (prev < maxIndex ? prev + 1 : prev))
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (open) {
          setHighlightedIndex((prev: number) => (prev > 0 ? prev - 1 : -1))
        }
      } else if (e.key === 'Enter') {
        if (open && highlightedIndex >= 0) {
          e.preventDefault()
          // Find the listbox
          const listbox = document.getElementById('autocomplete-list')
          if (!listbox) return

          const visibleOptions = Array.from(listbox.querySelectorAll('[role="option"]'))
          if (visibleOptions[highlightedIndex]) {
            const option = visibleOptions[highlightedIndex] as HTMLElement
            option.click()
          }
        }
      } else if (e.key === 'Escape') {
        if (open) {
          e.preventDefault()
          setOpen(false)
          setHighlightedIndex(-1)
        }
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(e)
      if (inputValue.length > 0) {
        setOpen(true)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e)
      // Delay closing to allow option clicks
      setTimeout(() => {
        setOpen(false)
        setHighlightedIndex(-1)
      }, 200)
    }

    return (
      <input
        ref={(node) => {
          inputRef.current = node
          if (typeof forwardedRef === 'function') {
            forwardedRef(node)
          } else if (forwardedRef) {
            ;(forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node
          }
        }}
        {...restProps}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        aria-activedescendant={
          highlightedIndex >= 0 ? `autocomplete-option-${highlightedIndex}` : undefined
        }
        autoComplete="off"
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
        onBlur={handleBlur}
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
    const { inputValue, open } = useAutocompleteContext()

    // Count visible children
    const childArray = React.Children.toArray(children)
    const visibleChildren = childArray.filter((child) => {
      if (React.isValidElement(child) && child.props.value) {
        return true
      }
      return false
    })

    const isEmpty = visibleChildren.length === 0 && inputValue.length > 0

    if (!open) return null

    return (
      <div
        ref={forwardedRef}
        id="autocomplete-list"
        role="listbox"
        onMouseDown={(e) => {
          // Prevent focus loss when clicking in the popup
          e.preventDefault()
        }}
        className={cn(
          'absolute z-50 w-full max-w-[480px] max-h-[300px] overflow-y-auto rounded-lg',
          'bg-[#00111A]/95 backdrop-blur-16 border border-[#0ec2bc]/20',
          'shadow-lg shadow-[#0ec2bc]/10 p-1',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
          className
        )}
        style={{
          top: `calc(100% + ${sideOffset}px)`,
          left: 0,
        }}
      >
        {isEmpty ? (
          <div className="px-3 py-6 text-center text-sm font-sans text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
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
    const { inputValue, setInputValue, setOpen, highlightedIndex, setHighlightedIndex } =
      useAutocompleteContext()

    const optionRef = React.useRef<HTMLDivElement>(null)
    const [currentIndex, setCurrentIndex] = React.useState(-1)

    // Filter logic - check if option matches input
    const textContent = typeof children === 'string' ? children : value
    const searchTerms = [textContent.toLowerCase(), value.toLowerCase(), ...keywords.map((k) => k.toLowerCase())]
    const matches = searchTerms.some((term) => term.includes(inputValue.toLowerCase()))

    if (!matches && inputValue.length > 0) {
      return null
    }

    // Calculate this option's index among visible siblings
    React.useLayoutEffect(() => {
      const element = optionRef.current
      if (!element || !element.parentElement) return

      const siblings = Array.from(element.parentElement.querySelectorAll('[role="option"]'))
      const index = siblings.indexOf(element)
      setCurrentIndex(index)
    })

    // Scroll highlighted option into view
    React.useEffect(() => {
      if (currentIndex === highlightedIndex && optionRef.current) {
        optionRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }, [highlightedIndex, currentIndex])

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      e.preventDefault()
      e.stopPropagation()
      onClick?.(e)
      setInputValue(textContent)
      setTimeout(() => {
        setOpen(false)
        setHighlightedIndex(-1)
      }, 0)
    }

    const handleMouseEnter = () => {
      if (!disabled && currentIndex >= 0) {
        setHighlightedIndex(currentIndex)
      }
    }

    const handleMouseLeave = () => {
      // Optional: clear highlight when mouse leaves
      // setHighlightedIndex(-1)
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

    const isHighlighted = currentIndex >= 0 && currentIndex === highlightedIndex

    return (
      <div
        ref={(node) => {
          optionRef.current = node
          if (typeof forwardedRef === 'function') {
            forwardedRef(node)
          } else if (forwardedRef) {
            ;(forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          }
        }}
        role="option"
        id={`autocomplete-option-${currentIndex}`}
        aria-selected={isHighlighted}
        aria-disabled={disabled}
        data-index={currentIndex}
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
        onMouseLeave={handleMouseLeave}
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
