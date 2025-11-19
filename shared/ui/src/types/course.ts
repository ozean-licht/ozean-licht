/**
 * Course type definition for Ozean Licht platform
 * Used across branded components and compositions
 */
export interface Course {
  slug: string
  title: string
  subtitle?: string
  description: string
  price: number
  is_public: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code: number
  tags?: string[]
  created_at: string
  updated_at: string
}
