import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpanDesign } from "@/components/span-design"
import { CourseListWithFilter } from "@/components/course-list-with-filter"
import { getCourses } from "@/lib/api/courses"

interface Course {
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

async function loadCourses(): Promise<Course[]> {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[CoursesPage] Loading courses...')
    }
    const courses = await getCourses(50)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[CoursesPage] Loaded ${courses.length} courses`)
    }
    return courses
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[CoursesPage] Failed to load courses:', error.message)
    }
    return []
  }
}

export default async function CoursesPage() {
  const courses = await loadCourses()

  // Ensure we have an array
  const safeCourses = Array.isArray(courses) ? courses : []

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      {/* Courses Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header Container with consistent spacing */}
          <div className="space-y-5 mb-16">
            <SpanDesign>Unsere Kurse</SpanDesign>

            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-white leading-tight">
              Entdecke unsere<br />
              Weiterbildungskurse
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty text-muted-foreground font-light">
              Erweitere dein Bewusstsein und entdecke neue Möglichkeiten mit unseren umfassenden Kursen zu Metaphysik, Quanten-Transformation und kosmischem Wissen.
            </p>
          </div>

          {/* Course List with Filter - Client Component */}
          {safeCourses.length > 0 ? (
            <CourseListWithFilter courses={safeCourses} />
          ) : (
            <div className="text-center py-16">
              <div className="text-white/70 text-lg">
                Aktuell sind keine Kurse verfügbar. Schau bald wieder vorbei!
                <br />
                <small className="text-white/50 mt-2 block">
                  Debug: {courses?.length || 0} Kurse empfangen, {safeCourses.length} sicher verarbeitet
                </small>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
