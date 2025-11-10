// Mock Supabase client for demo mode - preserves ALL UI/design from OLD
import { mockCourses, mockUser } from './mock-data/courses'

// Mock auth methods
const mockAuth = {
  getUser: async () => ({
    data: { user: mockUser },
    error: null,
  }),
  signOut: async () => ({
    error: null,
  }),
  signInWithPassword: async (credentials: any) => ({
    data: { user: mockUser, session: null },
    error: null,
  }),
  signUp: async (credentials: any) => ({
    data: { user: mockUser, session: null },
    error: null,
  }),
  setSession: async (params: any) => ({
    data: { session: null, user: mockUser },
    error: null,
  }),
  onAuthStateChange: (callback: any) => {
    // Call callback once with mock user
    setTimeout(() => callback('SIGNED_IN', { user: mockUser }), 0)
    return { data: { subscription: { unsubscribe: () => {} } } }
  },
  resetPasswordForEmail: async (email: string, options?: any) => ({
    data: {},
    error: null,
  }),
  updateUser: async (updates: any) => ({
    data: { user: mockUser },
    error: null,
  }),
}

// Mock query builder
class MockQueryBuilder {
  private data: any[]
  private filters: any = {}
  private limitValue?: number
  private isSingle = false

  constructor(data: any[]) {
    this.data = data
  }

  from(table: string) {
    return this
  }

  select(columns: string, options?: any) {
    return this
  }

  eq(column: string, value: any) {
    this.filters[column] = value
    return this
  }

  order(column: string, options: any) {
    return this
  }

  limit(count: number) {
    this.limitValue = count
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  in(column: string, values: any[]) {
    // Mock in filter
    return this
  }

  not(column: string, operator: string, value: any) {
    // Mock not filter
    return this
  }

  async then(resolve: (value: any) => void) {
    let result = [...this.data]

    // Apply filters
    if (this.filters.is_public !== undefined) {
      result = result.filter((item: any) => item.is_public === this.filters.is_public)
    }
    if (this.filters.slug !== undefined) {
      result = result.filter((item: any) => item.slug === this.filters.slug)
    }

    // Apply limit
    if (this.limitValue) {
      result = result.slice(0, this.limitValue)
    }

    // Return single or array
    if (this.isSingle) {
      return resolve({ data: result[0] || null, error: null })
    }

    return resolve({ data: result, error: null })
  }
}

// Mock Supabase client
export const mockSupabase = {
  auth: mockAuth,
  from: (table: string) => {
    if (table === 'courses') {
      return new MockQueryBuilder(mockCourses)
    }
    return new MockQueryBuilder([])
  },
}

// Export mock functions matching OLD supabase.ts API
export async function getCoursesFromEdge(limit: number = 50): Promise<any[]> {
  const courses = mockCourses
    .filter(c => c.is_public)
    .slice(0, limit)

  console.log(`✅ Mock: Loaded ${courses.length} courses`)
  return courses
}

export async function getCourseFromEdge(slug: string): Promise<any | null> {
  const course = mockCourses.find(c => c.slug === slug && c.is_public)
  console.log(`✅ Mock: Loaded course: ${course?.title || 'Not found'}`)
  return course || null
}

export async function getCoursesFromAirtable(limit: number = 50) {
  return getCoursesFromEdge(limit)
}

export async function getCoursesWithReliableImages(limit: number = 50) {
  return getCoursesFromEdge(limit)
}

export async function getCourseWithReliableImages(slug: string) {
  return getCourseFromEdge(slug)
}

export async function getCoursesForPartnerDeal(): Promise<any[]> {
  const courses = mockCourses.filter(c => c.is_public && (c.price || 0) >= 100)
  console.log(`✅ Mock: Loaded ${courses.length} Partner Deal courses`)
  return courses
}

export function createFallbackImageUrl(title: string) {
  const shortTitle = title.substring(0, 25)
  const svg = `<svg width="600" height="337" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="337" fill="#001212"/>
    <rect x="20" y="20" width="560" height="297" fill="#00D4FF" rx="12"/>
    <text x="300" y="168" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" dy=".3em">${shortTitle}...</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Export mock supabase as default for components
export const supabase = mockSupabase
export function createBrowserSupabaseClient() {
  return mockSupabase
}
export function createSupabaseClient() {
  return mockSupabase
}

// Mock blog functions
export async function getBlogsFromEdge(limit: number = 10): Promise<any[]> {
  console.log(`✅ Mock: getBlogsFromEdge called with limit ${limit}`)
  return [] // No blogs in demo
}
