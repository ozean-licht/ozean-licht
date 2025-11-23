import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination'
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from './card'
import { Button } from './button'

const meta: Meta<typeof Pagination> = {
  title: 'CossUI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pagination component from Coss UI (Base UI) adapted for Ozean Licht design system. Features glass morphism effects with primary color accents, SVG arrow icons, and comprehensive accessibility support for navigating large datasets.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Pagination>

/**
 * Basic Pagination Story
 * Simple pagination with 5 pages
 */
export const BasicPagination: Story = {
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
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
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
}

/**
 * Pagination with Ellipsis Story
 * Shows pagination with many pages (common in data-heavy applications)
 */
export const WithEllipsis: Story = {
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
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            6
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">7</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">12</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * First Page State Story
 * Shows pagination when on the first page with disabled previous button
 */
export const FirstPageState: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" disabled />
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
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Last Page State Story
 * Shows pagination when on the last page with disabled next button
 */
export const LastPageState: Story = {
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
          <PaginationLink href="#" isActive>
            4
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" disabled />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Active Page Highlighting Story
 * Demonstrates the primary color active state with glow effect
 */
export const ActivePageHighlighting: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">
          The active page shows primary color (#0ec2bc) background with glow effect
        </p>
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
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
}

/**
 * Disabled Pagination Story
 * Shows all navigation options in a disabled state
 */
export const DisabledState: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">
          Disabled state with reduced opacity - useful for loading states
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" disabled>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive disabled>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" disabled>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" disabled>
                4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" disabled />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
}

/**
 * Without Navigation Buttons Story
 * Simple page number selection without previous/next buttons
 */
export const WithoutNavigationButtons: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Simple Pagination Story
 * Minimal pagination with just previous and next buttons
 */
export const SimplePagination: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <span className="text-sm font-medium text-[#C4C8D4]">Page 2 of 10</span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Complex Pagination Story
 * Full-featured pagination with ellipsis and many pages
 */
export const ComplexPagination: Story = {
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
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">8</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">9</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            10
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">11</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">12</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">13</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">48</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">49</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Table Pagination Example Story
 * Shows pagination in context with a data table
 */
export const TablePaginationExample: Story = {
  render: () => (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Data Table with Pagination</CardTitle>
        <CardDescription>Browse through 50 total records</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-primary text-xs font-medium">ID</th>
                <th className="text-left p-3 text-primary text-xs font-medium">Name</th>
                <th className="text-left p-3 text-primary text-xs font-medium">Status</th>
                <th className="text-left p-3 text-primary text-xs font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-3 text-[#C4C8D4]">{i + 1}</td>
                  <td className="p-3 text-[#C4C8D4]">Record {i + 1}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                      Active
                    </span>
                  </td>
                  <td className="p-3 text-[#C4C8D4] text-xs">Nov {20 - i}, 2024</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-[#C4C8D4] mb-4">
          Showing 1 to 5 of 50 records
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" disabled />
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
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardPanel>
    </Card>
  ),
}

/**
 * Search Results Pagination Example Story
 * Shows pagination for search results with metadata
 */
export const SearchResultsPagination: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Search Results</CardTitle>
        <CardDescription>Found 245 results for "ocean design system"</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="space-y-3 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
              <h4 className="font-medium text-foreground text-sm">Result {i + 1}</h4>
              <p className="text-xs text-[#C4C8D4] mt-1">
                This is a sample search result with relevant content snippet and metadata.
              </p>
              <p className="text-xs text-primary mt-2">example.com/result-{i + 1}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-[#C4C8D4] mb-4">
          Showing results 1-3 of 245
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" disabled />
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
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">82</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardPanel>
    </Card>
  ),
}

/**
 * Blog Post Pagination Example Story
 * Pagination for blog posts with titles and dates
 */
export const BlogPostPagination: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Blog Posts</CardTitle>
        <CardDescription>Latest articles from our blog</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="space-y-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className="border-b border-border/50 pb-4 last:border-b-0">
              <h3 className="font-medium text-foreground text-sm mb-1">
                Understanding Design Systems and Component Libraries
              </h3>
              <p className="text-xs text-[#C4C8D4] mb-2">
                Dive deep into building scalable component systems for modern applications.
              </p>
              <p className="text-xs text-primary">November {20 - i}, 2024</p>
            </article>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" disabled />
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
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardPanel>
    </Card>
  ),
}

/**
 * Product Listing Pagination Example Story
 * E-commerce style pagination with product grid
 */
export const ProductListingPagination: Story = {
  render: () => (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Browse our collection of premium products</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border text-center"
            >
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-primary text-sm font-medium">Product {i + 1}</span>
              </div>
              <p className="text-sm font-medium text-foreground">Product {i + 1}</p>
              <p className="text-xs text-primary mt-1">$99.99</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-[#C4C8D4] mb-4">
          Showing 1-6 of 48 products
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" disabled />
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
              <PaginationLink href="#">6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">7</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">8</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardPanel>
    </Card>
  ),
}

/**
 * Two Pages Only Story
 * Pagination with just 2 pages
 */
export const TwoPages: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" disabled />
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
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Single Page Story
 * Pagination with only one page (all buttons disabled)
 */
export const SinglePage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive disabled>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" disabled />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Large Page Count Story
 * Pagination with 100+ pages showing ellipsis usage
 */
export const LargePageCount: Story = {
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
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">48</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">49</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            50
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">51</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">52</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">99</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">100</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

/**
 * Mobile Friendly Layout Story
 * Compact pagination optimized for mobile screens
 */
export const MobileFriendlyLayout: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-xs text-[#C4C8D4] mb-3">Mobile-optimized layout (max-width: 320px)</p>
      <Pagination>
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious href="#" />
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
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
}

/**
 * Glass Effect Demonstration Story
 * Shows the glass morphism effect with backdrop blur
 */
export const GlassEffectDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">
          Glass effect with backdrop blur, primary border, and glow on hover
        </p>
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
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">
          Hover over buttons to see the glow effect and border transition
        </p>
        <div className="p-4 bg-gradient-to-br from-card/40 via-background to-primary/5 rounded-lg border border-primary/20 backdrop-blur-12">
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
                <PaginationLink href="#" isActive>
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  ),
}

/**
 * Interactive Page Selection Story
 * Demonstrates controlled pagination with React state
 */
export const InteractivePageSelection: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5)
    const totalPages = 10
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Current Page: {currentPage} of {totalPages}</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              First Page
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Last Page
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentPage(1)}
            >
              Reset to Page 1
            </Button>
          </div>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                disabled={currentPage === 1}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(Math.max(1, currentPage - 1))
                }}
              />
            </PaginationItem>
            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                disabled={currentPage === totalPages}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  },
}

/**
 * Arrow Icons Display Story
 * Shows the SVG arrow icons used in navigation
 */
export const ArrowIconsDisplay: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">SVG Arrow Icons - No Emojis Used</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#">Previous</PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-[#C4C8D4]">Page 1</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#">Next</PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">Left and Right Arrow SVG Icons</p>
        <div className="flex gap-8 items-center">
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Left Arrow</p>
            <svg
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Right Arrow</p>
            <svg
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Ellipsis Icon</p>
            <svg
              className="h-6 w-6 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="6" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="18" cy="12" r="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * Accessibility Features Story
 * Demonstrates ARIA labels and semantic structure
 */
export const AccessibilityFeatures: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">
          Pagination with proper ARIA labels and semantic HTML structure
        </p>
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
          <p className="text-xs font-medium text-foreground mb-2">Accessibility Features:</p>
          <ul className="text-xs text-[#C4C8D4] space-y-1 list-disc list-inside">
            <li>Semantic <code className="bg-card/50 px-1 rounded">&lt;nav&gt;</code> element with aria-label</li>
            <li>Semantic <code className="bg-card/50 px-1 rounded">&lt;ul&gt;</code> and <code className="bg-card/50 px-1 rounded">&lt;li&gt;</code> elements</li>
            <li>aria-current="page" on active link</li>
            <li>aria-label on Previous and Next buttons</li>
            <li>aria-hidden on decorative ellipsis icon</li>
            <li>Screen reader text for more pages indicator</li>
            <li>Focus-visible ring for keyboard navigation</li>
            <li>Disabled state prevents pointer events</li>
          </ul>
        </div>
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
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
}

/**
 * Primary Color Accents Story
 * Showcases the primary color (#0ec2bc) in active and hover states
 */
export const PrimaryColorAccents: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="p-4 bg-card/50 backdrop-blur-8 rounded-lg border border-border">
        <p className="text-xs font-medium text-foreground mb-2">Color Palette:</p>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="w-12 h-12 bg-primary rounded-lg mb-2 border-2 border-primary/40"></div>
            <p className="text-xs font-medium text-foreground">#0ec2bc</p>
            <p className="text-xs text-[#C4C8D4]">Primary</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary/60 rounded-lg mb-2 border-2 border-primary/60"></div>
            <p className="text-xs font-medium text-foreground">Primary/60</p>
            <p className="text-xs text-[#C4C8D4]">Hover Border</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg mb-2 border-2 border-primary/20"></div>
            <p className="text-xs font-medium text-foreground">Primary/20</p>
            <p className="text-xs text-[#C4C8D4]">Shadow</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-card/70 rounded-lg mb-2 border-2 border-primary/40"></div>
            <p className="text-xs font-medium text-foreground">Card/70</p>
            <p className="text-xs text-[#C4C8D4]">Default BG</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">
          Active page shows primary background with shadow glow
        </p>
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
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
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
      </div>
    </div>
  ),
}

/**
 * Hover Glow Effects Story
 * Demonstrates the glow effect on hover states
 */
export const HoverGlowEffects: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-xs font-medium text-foreground mb-2">Hover Effects:</p>
        <ul className="text-xs text-[#C4C8D4] space-y-1 list-disc list-inside">
          <li>Inactive buttons: Border and background opacity increase on hover</li>
          <li>Inactive buttons: Shadow glow (primary/20) appears on hover</li>
          <li>Active buttons: Background opacity changes with stronger glow</li>
          <li>All states: Smooth 200ms transition animation</li>
          <li>Focus: Ring-2 with primary color and offset</li>
        </ul>
      </div>

      <div>
        <p className="text-xs text-[#C4C8D4] mb-3">
          Hover over the buttons below to see the glow effect
        </p>
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
              <PaginationLink href="#" isActive>
                3
              </PaginationLink>
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
      </div>
    </div>
  ),
}

/**
 * State Combination Story
 * Shows various state combinations for reference
 */
export const StateCombinations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium text-foreground text-sm mb-3">Default (Inactive) Button</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <h3 className="font-medium text-foreground text-sm mb-3">Active Button (Current Page)</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <h3 className="font-medium text-foreground text-sm mb-3">Disabled Button</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" disabled>
                2
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <h3 className="font-medium text-foreground text-sm mb-3">Previous Button States</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-[#C4C8D4] mb-2">Enabled Previous</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div>
            <p className="text-xs text-[#C4C8D4] mb-2">Disabled Previous (First Page)</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" disabled />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground text-sm mb-3">Next Button States</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-[#C4C8D4] mb-2">Enabled Next</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div>
            <p className="text-xs text-[#C4C8D4] mb-2">Disabled Next (Last Page)</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationNext href="#" disabled />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground text-sm mb-3">Ellipsis Indicator</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
}
