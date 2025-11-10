import type { Course } from "@/types"
import { SpanDesign } from "@/components/layout/span-design"
import { CourseCardModern } from "@/components/layout/course-card-modern"
import { PrimaryButton } from "@/components/primary-button"
import { mockCourses } from "@/lib/mock-data"
import Link from "next/link"

export function CoursePreview() {
  // Get first 4 courses for preview
  const courses = mockCourses.slice(0, 4)

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <SpanDesign>Einblick & Vorschau</SpanDesign>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel-decorative text-white mb-6 text-balance">
            {"Unsere aktuellen Weiterbildungskurse"}
          </h2>
          <p className="text-white/70 font-montserrat-alt text-lg max-w-2xl mx-auto">
            Sollte es einmal finanziell knapp sein - die meisten von uns kenn das - mach dir keine Sorgen. Wir finden
            eine Lösung. Spreche mich offen und EHRLICH darauf an und ich schaue was ich für dich tun kann, denn jeder
            soll die Möglichkeit haben glücklich zu sein!
          </p>
        </div>

        {/* Modern Course Cards in 2x2 Grid */}
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
            <div className="text-white/70 text-lg mb-8">
              Aktuell sind keine Kurse verfügbar. Schau bald wieder vorbei!
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/courses">
            <PrimaryButton>Alle Kurse sehen</PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
