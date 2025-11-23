import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Tier 1: Primitives/CossUI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pagination component for navigating through pages of content. Built with semantic HTML and ARIA attributes for accessibility. Supports custom link components via render prop pattern.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Pagination>

/**
 * Basic Pagination
 * Simple pagination with numbered pages
 */
export const Basic: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * With Ellipsis
 * Pagination with ellipsis to indicate skipped pages
 */
export const WithEllipsis: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Icon Only Controls
 * Pagination with icon-only Previous/Next buttons
 */
export const IconOnly: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious showLabel={false} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext showLabel={false} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Many Pages (Start Position)
 * Pagination at the start of a long list
 */
export const ManyPagesStart: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>100</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Many Pages (Middle Position)
 * Pagination in the middle of a long list
 */
export const ManyPagesMiddle: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>48</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>49</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>50</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>51</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>52</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>100</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Many Pages (End Position)
 * Pagination at the end of a long list
 */
export const ManyPagesEnd: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>96</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>97</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>98</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>99</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>100</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Compact Variant (5 Pages)
 * Pagination with all pages visible
 */
export const CompactFivePages: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Compact Variant (10 Pages)
 * Pagination with all pages visible
 */
export const CompactTenPages: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink isActive={page === 5}>{page}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Previous/Next Only
 * Minimal pagination with only navigation controls
 */
export const PreviousNextOnly: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <span className="text-[#C4C8D4] text-sm font-sans px-4">
            Page 5 of 20
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Interactive Pagination
 * Fully functional pagination with state management
 */
export const Interactive: Story = {
  render: function InteractivePagination() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 10

    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-[#C4C8D4] font-sans">
            Current Page: <span className="text-primary font-medium">{currentPage}</span>
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  },
}

/**
 * Interactive with Smart Ellipsis
 * Pagination that shows/hides page numbers intelligently
 */
export const InteractiveWithSmartEllipsis: Story = {
  render: function SmartEllipsisPagination() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 100

    const getPageNumbers = () => {
      const pages: (number | 'ellipsis')[] = []
      const showEllipsisStart = currentPage > 4
      const showEllipsisEnd = currentPage < totalPages - 3

      if (currentPage <= 4) {
        // Near start
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
          pages.push(i)
        }
        if (totalPages > 5) {
          pages.push('ellipsis')
          pages.push(totalPages)
        }
      } else if (currentPage >= totalPages - 3) {
        // Near end
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Middle
        pages.push(1)
        if (showEllipsisStart) pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        if (showEllipsisEnd) pages.push('ellipsis')
        pages.push(totalPages)
      }

      return pages
    }

    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-[#C4C8D4] font-sans">
            Page <span className="text-primary font-medium">{currentPage}</span> of{' '}
            <span className="text-primary font-medium">{totalPages}</span>
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  },
}

/**
 * Table Pagination
 * Pagination designed for data tables with row count info
 */
export const TablePagination: Story = {
  render: function TablePaginationDemo() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 15
    const rowsPerPage = 10
    const totalRows = 150

    const startRow = (currentPage - 1) * rowsPerPage + 1
    const endRow = Math.min(currentPage * rowsPerPage, totalRows)

    return (
      <div className="space-y-4 w-full max-w-2xl">
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-[#C4C8D4] font-sans font-light">
            Showing <span className="font-medium text-primary">{startRow}</span> to{' '}
            <span className="font-medium text-primary">{endRow}</span> of{' '}
            <span className="font-medium text-primary">{totalRows}</span> results
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  showLabel={false}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <span className="text-[#C4C8D4] text-sm px-1">of</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  showLabel={false}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    )
  },
}

/**
 * Responsive Design
 * Different layouts for mobile vs desktop
 */
export const ResponsiveDesign: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-white font-sans font-medium mb-4">Desktop View</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h3 className="text-white font-sans font-medium mb-4">Mobile View</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious showLabel={false} />
            </PaginationItem>
            <PaginationItem>
              <span className="text-[#C4C8D4] text-sm font-sans px-2">2 / 10</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext showLabel={false} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
}

/**
 * Multilingual Support
 * Pagination with different languages to test text overflow
 */
export const MultilingualSupport: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-sans font-medium mb-3 text-sm">English</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious>Previous</PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext>Next</PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h3 className="text-white font-sans font-medium mb-3 text-sm">German</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious>Vorherige</PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext>Nächste</PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h3 className="text-white font-sans font-medium mb-3 text-sm">Spanish</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious>Anterior</PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext>Siguiente</PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h3 className="text-white font-sans font-medium mb-3 text-sm">French</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious>Précédent</PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext>Suivant</PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
}

/**
 * Glass Effect Variant
 * Pagination with enhanced glass morphism
 */
export const GlassEffect: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-background to-card rounded-lg">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className="glass-card-strong" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="glass-card">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive className="glass-card-strong">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="glass-card">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="glass-card">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext className="glass-card-strong" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
}

/**
 * Accessibility Demo
 * Shows ARIA attributes and keyboard navigation
 */
export const AccessibilityDemo: Story = {
  render: function AccessibilityPaginationDemo() {
    const [currentPage, setCurrentPage] = useState(3)
    const totalPages = 5

    return (
      <div className="space-y-4">
        <div className="bg-card/30 border border-border rounded-lg p-4 backdrop-blur-8">
          <h3 className="text-white font-sans font-medium mb-2">
            Accessibility Features:
          </h3>
          <ul className="text-[#C4C8D4] text-sm font-sans font-light space-y-1 list-disc list-inside">
            <li>Semantic HTML with proper ARIA attributes</li>
            <li>aria-current="page" on active page</li>
            <li>aria-label on navigation buttons</li>
            <li>Keyboard navigation support (Tab, Enter, Space)</li>
            <li>Screen reader announcements</li>
            <li>Focus visible indicators</li>
          </ul>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  },
}

/**
 * Disabled States
 * Shows various disabled states
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-sans font-medium mb-3 text-sm">
          First Page (Previous Disabled)
        </h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h3 className="text-white font-sans font-medium mb-3 text-sm">
          Last Page (Next Disabled)
        </h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext disabled />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <h3 className="text-white font-sans font-medium mb-3 text-sm">
          Single Page (Both Disabled)
        </h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext disabled />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
}

/**
 * Loading State
 * Pagination with loading indicator
 */
export const LoadingState: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink disabled className="opacity-50">
            ...
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Custom Styling
 * Pagination with custom colors and sizing
 */
export const CustomStyling: Story = {
  render: () => (
    <Pagination>
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious className="rounded-full h-10 px-5" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="rounded-full h-10 w-10">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive className="rounded-full h-10 w-10">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="rounded-full h-10 w-10">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext className="rounded-full h-10 px-5" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}
