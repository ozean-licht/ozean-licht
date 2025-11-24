'use client'

import Link from 'next/link'
import { SpanDesign } from '../span-design'
import { CourseCardModern } from '../course-card-modern'
import { CtaButton } from '../cta-button'

export interface Course {
  slug: string
  title: string
  description: string
  price: number
  is_public: boolean
  thumbnail_url_desktop?: string
  thumbnail_url_mobile?: string
  course_code: number
  created_at: string
  updated_at: string
}

export interface CoursePreviewProps {
  /**
   * Array of courses to display (4 recommended for 2x2 grid)
   */
  courses?: Course[]
  /**
   * Title for the section
   */
  title?: string
  /**
   * Description text below the title
   */
  description?: string
  /**
   * Text for the "view all" button
   */
  viewAllText?: string
  /**
   * URL for the "view all" button link
   */
  viewAllHref?: string
  /**
   * Message when no courses are available
   */
  emptyMessage?: string
  /**
   * Custom className for the section
   */
  className?: string
}

export function CoursePreview({
  courses = [],
  title = 'Unsere aktuellen Weiterbildungskurse',
  description = 'Sollte es einmal finanziell knapp sein - die meisten von uns kenn das - mach dir keine Sorgen. Wir finden eine Lösung. Spreche mich offen und EHRLICH darauf an und ich schaue was ich für dich tun kann, denn jeder soll die Möglichkeit haben glücklich zu sein!',
  viewAllText = 'Alle Kurse sehen',
  viewAllHref = '/courses',
  emptyMessage = 'Aktuell sind keine Kurse verfügbar. Schau bald wieder vorbei!',
  className = '',
}: CoursePreviewProps) {
  return (
    <section className={`w-full py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <SpanDesign>Einblick & Vorschau</SpanDesign>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel-decorative text-white mb-6 text-balance">
            {title}
          </h2>
          <p className="text-white/70 font-montserrat-alt text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Modern course cards in 2x2 grid */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {courses.map((course) => (
              <CourseCardModern key={course.course_code} course={course} />
            ))}
          </div>
        )}

        {/* Show message if no courses available */}
        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-white/70 text-lg mb-8">{emptyMessage}</div>
          </div>
        )}

        <div className="text-center">
          <Link href={viewAllHref}>
            <CtaButton>{viewAllText}</CtaButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
