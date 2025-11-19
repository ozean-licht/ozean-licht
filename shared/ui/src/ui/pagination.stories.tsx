import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination primitive component built on shadcn/ui.
 *
 * **This is a Tier 1 Primitive** - base pagination component with minimal default styling.
 * No Tier 2 branded version exists - this is the foundation for pagination navigation.
 *
 * ## Pagination Features
 * - **Accessible**: Proper ARIA labels, navigation semantics, current page indication
 * - **Responsive**: Adapts to different screen sizes with mobile-friendly controls
 * - **Composable**: Build custom pagination with individual components
 * - **Icon Support**: Uses lucide-react icons for navigation arrows
 * - **State Management**: Support for controlled and uncontrolled patterns
 * - **Ellipsis Support**: Shows truncation indicators for large page ranges
 *
 * ## Component Structure
 * ```tsx
 * <Pagination> // Root - nav element with pagination semantics
 *   <PaginationContent> // ul wrapper for pagination items
 *     <PaginationItem> // li wrapper for individual items
 *       <PaginationPrevious /> // Previous page button
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink isActive /> // Page number link
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationEllipsis /> // Truncation indicator
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext /> // Next page button
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 *
 * ## Usage Notes
 * - PaginationLink accepts `isActive` prop to highlight current page
 * - PaginationPrevious/Next are pre-styled with icons and text
 * - Use aria-label for accessibility on pagination links
 * - PaginationEllipsis indicates truncated page ranges
 * - All components support className for custom styling
 *
 * ## Common Use Cases
 * - **Table Pagination**: Navigate through data table pages
 * - **Search Results**: Page through search result sets
 * - **Blog Posts**: Navigate article archives
 * - **Product Listings**: Browse product catalog pages
 * - **Image Galleries**: Navigate through image collections
 */
const meta = {
  title: 'Tier 1: Primitives/shadcn/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A navigation component for paginated content. Provides accessible, composable pagination controls with support for ellipsis, disabled states, and active page indication.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default pagination with basic page numbers.
 *
 * Shows the most common pagination pattern with Previous, page numbers, and Next.
 */
export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * First page state with disabled Previous button.
 *
 * Shows how to disable the Previous button when on the first page.
 */
export const FirstPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled="true"
            className="pointer-events-none opacity-50"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * Last page state with disabled Next button.
 *
 * Shows how to disable the Next button when on the last page.
 */
export const LastPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled="true"
            className="pointer-events-none opacity-50"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * Many pages with ellipsis truncation.
 *
 * Shows how to use PaginationEllipsis to indicate truncated page ranges.
 * Common pattern: show first, last, current, and adjacent pages with ellipsis for gaps.
 */
export const ManyPages: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">6</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">20</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * Controlled state with page tracking.
 *
 * Demonstrates managing pagination state with React state.
 * Shows how to build a fully functional pagination component.
 */
export const ControlledState: Story = {
  render: () => {
    const ControlledPagination = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const totalPages = 10;

      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };

      const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
          // Show all pages
          for (let i = 1; i <= totalPages; i++) {
            pages.push(
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i);
                  }}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        } else {
          // Show first page
          pages.push(
            <PaginationItem key={1}>
              <PaginationLink
                href="#"
                isActive={currentPage === 1}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
          );

          // Show ellipsis if current page is far from start
          if (currentPage > 3) {
            pages.push(
              <PaginationItem key="ellipsis-start">
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Show pages around current page
          const start = Math.max(2, currentPage - 1);
          const end = Math.min(totalPages - 1, currentPage + 1);

          for (let i = start; i <= end; i++) {
            pages.push(
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i);
                  }}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }

          // Show ellipsis if current page is far from end
          if (currentPage < totalPages - 2) {
            pages.push(
              <PaginationItem key="ellipsis-end">
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Show last page
          pages.push(
            <PaginationItem key={totalPages}>
              <PaginationLink
                href="#"
                isActive={currentPage === totalPages}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          );
        }

        return pages;
      };

      return (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Current Page: <span className="font-semibold">{currentPage}</span> / {totalPages}
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {renderPageNumbers()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      );
    };

    return <ControlledPagination />;
  },
};

/**
 * Pagination with page information display.
 *
 * Shows total items, items per page, and current range.
 * Common pattern for data tables and search results.
 */
export const WithPageInfo: Story = {
  render: () => {
    const PageInfoPagination = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const totalItems = 247;
      const itemsPerPage = 20;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      const startItem = (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, totalItems);

      return (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">{startItem}</span> to{' '}
              <span className="font-semibold">{endItem}</span> of{' '}
              <span className="font-semibold">{totalItems}</span> results
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
              {currentPage + 1 < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage + 2 <= totalPages) setCurrentPage(currentPage + 2);
                    }}
                  >
                    {currentPage + 2}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage + 2 < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      );
    };

    return <PageInfoPagination />;
  },
};

/**
 * Simple variant with only Previous and Next buttons.
 *
 * Minimal pagination for simple navigation without page numbers.
 * Good for mobile views or simple linear navigation.
 */
export const SimpleVariant: Story = {
  render: () => {
    const SimplePagination = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const totalPages = 5;

      return (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      );
    };

    return <SimplePagination />;
  },
};

/**
 * Responsive pagination with mobile considerations.
 *
 * Shows fewer page numbers on mobile, more on desktop.
 * Demonstrates responsive design patterns.
 */
export const Responsive: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-2">Desktop View (5+ pages visible)</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem className="hidden md:block">
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem className="hidden md:block">
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Mobile View (current page only)</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
};

/**
 * Ozean Licht themed pagination.
 *
 * Demonstrates using Ozean Licht turquoise color (#0ec2bc) for active states.
 * Shows how to apply brand colors to pagination components.
 */
export const OzeanLichtThemed: Story = {
  render: () => {
    const ThemedPagination = () => {
      const [currentPage, setCurrentPage] = useState(3);
      const totalPages = 10;

      return (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm" style={{ color: '#0ec2bc' }}>
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  style={{
                    borderColor: currentPage === 1 ? undefined : '#0ec2bc',
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  style={{
                    backgroundColor: '#0ec2bc',
                    borderColor: '#0ec2bc',
                    color: 'white',
                  }}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">{totalPages}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  style={{
                    borderColor: currentPage === totalPages ? undefined : '#0ec2bc',
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Using Ozean Licht turquoise (#0ec2bc) for active page and hover states
            </p>
          </div>
        </div>
      );
    };

    return <ThemedPagination />;
  },
};

/**
 * Icon-only navigation variant.
 *
 * Minimal pagination using only icon buttons without text labels.
 * Compact design for tight spaces.
 */
export const IconOnly: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#" size="icon" aria-label="Go to previous page">
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="icon" aria-label="Go to next page">
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * Custom styled pagination.
 *
 * Shows how to customize pagination with different styles and colors.
 */
export const CustomStyled: Story = {
  render: () => (
    <Pagination>
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="rounded-full border-2 hover:bg-primary/10"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" className="rounded-full">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive
            className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" className="rounded-full">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            className="rounded-full border-2 hover:bg-primary/10"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
