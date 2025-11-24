'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { CoursePreview, type Course, type CoursePreviewProps } from './course-preview'

/**
 * # CoursePreview Component
 *
 * A section component that displays a curated grid of courses with header text and a call-to-action button.
 *
 * ## Features
 *
 * - **Flexible Course Grid** - Displays courses in a responsive 2x2 grid (1 column on mobile, 2 on desktop)
 * - **Customizable Header** - Title, description, and section label with SpanDesign
 * - **View All Button** - CTA button with configurable text and href
 * - **Empty State** - Shows custom message when no courses are available
 * - **Modern Design** - Oceanic cyan theme with Ozean Licht branding
 *
 * ## Layout Structure
 *
 * ```
 * ┌─────────────────────────────────────────┐
 * │     SpanDesign (Einblick & Vorschau)   │
 * │          H2 Title (Cinzel Decorative)   │
 * │      P Description (Montserrat Alt)     │
 * ├─────────────────────────────────────────┤
 * │   Course Card   │   Course Card        │
 * │   (Modern)      │   (Modern)           │
 * ├─────────────────┼──────────────────────┤
 * │   Course Card   │   Course Card        │
 * │   (Modern)      │   (Modern)           │
 * ├─────────────────────────────────────────┤
 * │      CTA Button (View All Courses)      │
 * └─────────────────────────────────────────┘
 * ```
 *
 * ## Usage
 *
 * Use this component to showcase featured courses on landing pages, course hubs, or dashboard sections.
 * Each course uses the CourseCardModern component for consistent styling.
 */
const meta = {
  title: 'Tier 2: Branded/Content/CoursePreview',
  component: CoursePreview,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#00070F' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'A section component displaying a curated grid of courses with header, course cards, and call-to-action button. Designed for Ozean Licht platform with oceanic cyan theme.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    courses: {
      description: 'Array of courses to display (4 recommended for 2x2 grid)',
      control: 'object',
    },
    title: {
      description: 'Title for the section',
      control: 'text',
    },
    description: {
      description: 'Description text below the title',
      control: 'text',
    },
    viewAllText: {
      description: 'Text for the "view all" button',
      control: 'text',
    },
    viewAllHref: {
      description: 'URL for the "view all" button link',
      control: 'text',
    },
    emptyMessage: {
      description: 'Message when no courses are available',
      control: 'text',
    },
    className: {
      description: 'Custom className for the section',
      control: 'text',
    },
  },
} satisfies Meta<typeof CoursePreview>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Realistic mock course data based on Ozean Licht spiritual themes
 */
const mockCourses: Course[] = [
  {
    slug: 'meditation-basics',
    title: 'Meditation für Anfänger',
    description:
      'Entdecke die Kraft der Stille und lerne, deinen Geist zu beruhigen. Ein fundamentaler Kurs für alle, die ihre innere Ruhe finden möchten.',
    price: 149,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=337&fit=crop',
    course_code: 1,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
  {
    slug: 'energy-work-advanced',
    title: 'Energetische Arbeit Fortgeschritten',
    description:
      'Vertiefe deine Fähigkeiten in Energieheilung und lerne, deine eigene Energie sowie die anderer zu manipulieren und zu heilen.',
    price: 299,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&h=337&fit=crop',
    course_code: 2,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-11-18T00:00:00Z',
  },
  {
    slug: 'consciousness-expansion',
    title: 'Bewusstseinserweiterung & Spiritualität',
    description:
      'Erkunde die tiefsten Ebenen deines Bewusstseins und entwickle ein umfassendes Verständnis für spirituelle Wahrheiten und kosmische Realitäten.',
    price: 199,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=337&fit=crop',
    course_code: 3,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-11-19T00:00:00Z',
  },
  {
    slug: 'manifestation-reality',
    title: 'Manifestation & Realitätsgestaltung',
    description:
      'Lerne die Gesetze der Anziehung und Manifestation kennen. Gestalte bewusst deine Realität und erschaffe das Leben deiner Träume.',
    price: 249,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1516321318423-f06a4cf82f72?w=600&h=337&fit=crop',
    course_code: 4,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-11-17T00:00:00Z',
  },
]

const moreMockCourses: Course[] = [
  {
    slug: 'healing-light-transmission',
    title: 'Heilende Lichttransmission',
    description:
      'Eine transformative Praxis, die dir zeigt, wie du Heilungslicht durch deinen Körper fließen lässt und andere heilst.',
    price: 199,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=337&fit=crop',
    course_code: 5,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
  {
    slug: 'chakra-system-mastery',
    title: 'Chakra-System Meisterschaft',
    description:
      'Meistere das menschliche Chakra-System und lerne, wie du Blockaden auflöst und Energiefluss harmonisierst.',
    price: 299,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=337&fit=crop',
    course_code: 6,
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-11-16T00:00:00Z',
  },
  {
    slug: 'cosmic-connection',
    title: 'Kosmische Verbindung & Galaktisches Bewusstsein',
    description:
      'Verbinde dich mit kosmischen Energien und erlange Zugang zu galaktischem Bewusstsein für tiefe spirituelle Erkenntnisse.',
    price: 349,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&h=337&fit=crop',
    course_code: 7,
    created_at: '2024-03-25T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    slug: 'soul-purpose-discovery',
    title: 'Seelenauftrag & Lebenszweck Entdeckung',
    description:
      'Entdecke deine wahre Seelenaufgabe und deinen tieferen Lebenszweck. Lerne, wie du in Ausrichtung mit deinen höchsten Werten lebst.',
    price: 179,
    is_public: true,
    thumbnail_url_desktop: 'https://images.unsplash.com/photo-1516321318423-f06a4cf82f72?w=600&h=337&fit=crop',
    course_code: 8,
    created_at: '2024-01-30T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
]

/**
 * Default - Complete course preview section with 4 featured courses in 2x2 grid
 *
 * Shows the typical layout with:
 * - Branded header with SpanDesign accent
 * - Four course cards in a responsive grid
 * - View All button for accessing full course catalog
 */
export const Default: Story = {
  args: {
    courses: mockCourses,
    title: 'Unsere aktuellen Weiterbildungskurse',
    description:
      'Sollte es einmal finanziell knapp sein - die meisten von uns kenn das - mach dir keine Sorgen. Wir finden eine Lösung. Spreche mich offen und EHRLICH darauf an und ich schaue was ich für dich tun kann, denn jeder soll die Möglichkeit haben glücklich zu sein!',
    viewAllText: 'Alle Kurse sehen',
    viewAllHref: '/courses',
  },
}

/**
 * Empty State - Shows message when no courses are available
 *
 * Displays the empty state message and still shows the CTA button
 * to encourage users to check back later or explore other sections.
 */
export const EmptyState: Story = {
  args: {
    courses: [],
    title: 'Kommende Kurse',
    description:
      'Wir arbeiten an neuen und inspirierenden Kursen für deine spirituelle Entwicklung. Schaue bald wieder vorbei!',
    emptyMessage: 'Aktuell sind keine Kurse verfügbar. Schau bald wieder vorbei!',
    viewAllText: 'Zur Kurs-Übersicht',
    viewAllHref: '/courses',
  },
}

/**
 * Single Course - Preview with just one course
 *
 * Useful for highlighting a featured or newly released course
 * while still maintaining the full section layout.
 */
export const SingleCourse: Story = {
  args: {
    courses: [mockCourses[0]],
    title: 'Unser aktueller Kurs im Fokus',
    description: 'Tauche tief in unseren Meditation-Fundamentalkurs ein und beginn deine transformative Reise.',
    viewAllText: 'Mehr Kurse erkunden',
    viewAllHref: '/courses',
  },
}

/**
 * Two Courses - Preview with two featured courses
 *
 * Perfect for highlighting two related or complementary courses
 * that work well together as a learning path.
 */
export const TwoCourses: Story = {
  args: {
    courses: [mockCourses[0], mockCourses[1]],
    title: 'Deine Lernpfade',
    description: 'Starte mit den Grundlagen und vertiefe dann dein Wissen mit unseren Fortgeschrittenen Kursen.',
    viewAllText: 'Gesamtes Katalog sehen',
    viewAllHref: '/courses',
  },
}

/**
 * Six Courses - Extended preview showing scrollable section
 *
 * Demonstrates how the section handles more than 4 courses
 * (though 4 is the recommended default for a 2x2 grid).
 */
export const SixCourses: Story = {
  args: {
    courses: [...mockCourses, ...moreMockCourses.slice(0, 2)],
    title: 'Deine spirituelle Lernreise',
    description:
      'Wähle aus unserem umfassenden Angebot an Kursen, die dir helfen, dein spirituelles Potential zu entfalten.',
    viewAllText: 'Alle verfügbaren Kurse',
    viewAllHref: '/courses',
  },
}

/**
 * Custom Title & Description - Personalized section messaging
 *
 * Shows how the component adapts to different messaging
 * and context (e.g., personalized learning paths).
 */
export const CustomTitleDescription: Story = {
  args: {
    courses: mockCourses,
    title: 'Deine persönlich empfohlenen Kurse',
    description:
      'Basierend auf deinen Interessen und deinem spirituellen Profil haben wir diese Kurse speziell für dich ausgewählt. Sie passen perfekt zu deiner bisherigen Entwicklung.',
    viewAllText: 'Alle Empfehlungen sehen',
    viewAllHref: '/personalized-recommendations',
  },
}

/**
 * Different View All Href - Variable call-to-action navigation
 *
 * Demonstrates how viewAllHref can be customized for different sections
 * (e.g., category-specific course browsing, filtered views, etc.).
 */
export const CustomViewAllHref: Story = {
  args: {
    courses: mockCourses,
    title: 'Anfänger-Kurse',
    description:
      'Ideal für Anfänger. Diese Kurse bauen eine solide Grundlage für deine spirituelle Praxis und bieten sanfte Einführungen zu den wichtigsten Konzepten.',
    viewAllText: 'Alle Anfänger-Kurse',
    viewAllHref: '/courses?level=beginner',
  },
}

/**
 * Free Courses - Section highlighting free learning options
 *
 * Shows a section with free and low-cost courses to demonstrate
 * the platform's commitment to accessibility.
 */
export const FreeCourses: Story = {
  args: {
    courses: [
      {
        slug: 'meditation-introduction-free',
        title: 'Einführung in Meditation - Kostenlos',
        description:
          'Dein kostenloses Starterpaket mit grundlegenden Meditationstechniken und Atemübungen für innere Ruhe.',
        price: 0,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=337&fit=crop',
        course_code: 101,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
      {
        slug: 'breathing-techniques-free',
        title: 'Atemtechniken zur Energiestabilisierung - Kostenlos',
        description: 'Lerne einfache aber mächtige Atemtechniken, um deine Energie zu stabilisieren und zu zentrieren.',
        price: 0,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&h=337&fit=crop',
        course_code: 102,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
      {
        slug: 'chakra-basics-free',
        title: 'Chakra-Grundlagen - Kostenlos',
        description: 'Eine Einführung in die sieben Chakren und ihre Rolle in deinem energetischen Körper.',
        price: 0,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=337&fit=crop',
        course_code: 103,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
      {
        slug: 'energy-awareness-free',
        title: 'Energiebewusstsein wecken - Kostenlos',
        description: 'Erhöhe dein Energiebewusstsein und lerne, deine Ausstrahlung zu fühlen und zu verstehen.',
        price: 0,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1516321318423-f06a4cf82f72?w=600&h=337&fit=crop',
        course_code: 104,
        created_at: '2024-01-25T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
    ],
    title: 'Kostenlose Kurse zum Einstieg',
    description:
      'Wir glauben, dass Spiritualität für alle zugänglich sein sollte. Starte mit diesen kostenlosen Kursen und erkunde dein inneres Potential.',
    viewAllText: 'Alle kostenlosen Kurse',
    viewAllHref: '/courses?price=free',
  },
}

/**
 * Premium Courses - High-end spiritual mastery programs
 *
 * Showcases premium and exclusive courses for advanced practitioners
 * seeking deep transformation and specialized knowledge.
 */
export const PremiumCourses: Story = {
  args: {
    courses: [
      {
        slug: 'master-healer-program',
        title: 'Master Healer Program',
        description:
          'Ein umfassendes Programm für angehende Heiler. Meistere fortgeschrittene Heilungstechniken und lerne, Heilungsräume zu halten.',
        price: 499,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=337&fit=crop',
        course_code: 201,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
      {
        slug: 'galactic-consciousness-training',
        title: 'Galaktisches Bewusstseins-Training',
        description:
          'Ein tiefgehendes Training zur Aktivierung galaktischen Bewusstseins und der Verbindung mit kosmischen Realitäten.',
        price: 599,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&h=337&fit=crop',
        course_code: 202,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
      {
        slug: 'soul-alignment-coaching',
        title: 'Soul Alignment Coaching',
        description:
          'Eins-zu-eins Coaching zur Findung und Ausrichtung deines authentischen Seelenwegs mit persönlichen Transmissionen.',
        price: 699,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=337&fit=crop',
        course_code: 203,
        created_at: '2024-03-01T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
      {
        slug: 'sacred-geometry-mastery',
        title: 'Heilige Geometrie Meisterschaft',
        description:
          'Verstehe die mathematischen Gesetze des Universums und lerne, heilige Geometrie für Transformation zu nutzen.',
        price: 449,
        is_public: true,
        thumbnail_url_desktop: 'https://images.unsplash.com/photo-1516321318423-f06a4cf82f72?w=600&h=337&fit=crop',
        course_code: 204,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-11-20T00:00:00Z',
      },
    ],
    title: 'Premium Meisterschaft Programme',
    description:
      'Für ernsthafte Praktizierende und Heiler. Diese exklusiven Programme bieten tiefe Einsichten, intensive Trainings und persönliche Anleitung für maximale Transformation.',
    viewAllText: 'Alle Premium-Programme',
    viewAllHref: '/courses?tier=premium',
  },
}

/**
 * Medium Price Range - Mid-tier courses for serious practitioners
 *
 * Shows courses in the €150-€350 range that offer substantial depth
 * without the premium pricing, ideal for committed learners.
 */
export const MediumPriceCourses: Story = {
  args: {
    courses: moreMockCourses,
    title: 'Intensive Lernprogramme',
    description:
      'Tiefgehendes Lernen mit umfassenden Inhalten. Diese Kurse bieten substanzielles Wissen für transformativen Fortschritt in deiner spirituellen Praxis.',
    viewAllText: 'Mehr intensive Kurse',
    viewAllHref: '/courses?level=intermediate',
  },
}

/**
 * With Custom Styling - Section with custom background or styling
 *
 * Demonstrates how className prop can be used to customize
 * the section's appearance (e.g., background, borders, etc.).
 */
export const WithCustomStyling: Story = {
  args: {
    courses: mockCourses,
    title: 'Unsere aktuellen Weiterbildungskurse',
    description:
      'Sollte es einmal finanziell knapp sein - die meisten von uns kenn das - mach dir keine Sorgen. Wir finden eine Lösung. Spreche mich offen und EHRLICH darauf an.',
    viewAllText: 'Alle Kurse sehen',
    viewAllHref: '/courses',
    className: 'bg-gradient-to-b from-[#001a1a] to-[#00070F]',
  },
}

/**
 * Responsive Grid Demonstration - Shows how grid adapts to screen sizes
 *
 * Demonstrates the responsive behavior:
 * - Mobile: 1 column
 * - Tablet (md): 2 columns
 * - Desktop: 2 columns in grid (4 courses total in 2x2)
 */
export const ResponsiveDemo: Story = {
  args: {
    courses: mockCourses,
    title: 'Responsive Kurs-Gitter Demo',
    description:
      'Verändere die Größe deines Browsers, um zu sehen wie sich das Gitter responsive anpasst. Auf mobilen Geräten zeigt sich 1 Spalte, auf Tablets und Desktops 2 Spalten.',
    viewAllText: 'Vollständiger Katalog',
    viewAllHref: '/courses',
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
}

/**
 * Multiple Sections Stack - Multiple CoursePreview sections
 *
 * Shows how multiple CoursePreview sections can be stacked
 * on a page, each with different courses and messaging.
 */
export const MultipleSectionsStack: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="bg-[#00070F]">
      {/* Section 1: Beginner Courses */}
      <CoursePreview
        courses={[mockCourses[0], mockCourses[2]]}
        title="Für Anfänger geeignet"
        description="Starte deine spirituelle Reise mit diesen grundlegenden Kursen, die speziell für Anfänger konzipiert sind."
        viewAllText="Alle Anfänger-Kurse"
        viewAllHref="/courses?level=beginner"
      />

      {/* Divider */}
      <div className="border-t border-[#0E282E] my-8" />

      {/* Section 2: Advanced Courses */}
      <CoursePreview
        courses={[mockCourses[1], mockCourses[3]]}
        title="Für Fortgeschrittene"
        description="Vertiefe dein Wissen und meistere fortgeschrittene Techniken mit diesen spezialisierten Kursen."
        viewAllText="Alle Fortgeschrittenen-Kurse"
        viewAllHref="/courses?level=advanced"
      />

      {/* Divider */}
      <div className="border-t border-[#0E282E] my-8" />

      {/* Section 3: Free Courses */}
      <CoursePreview
        courses={[]}
        title="Kostenlose Ressourcen"
        description="Erkunde unsere kostenlose Kurse und lerne die Grundlagen ohne finanzielle Investition."
        emptyMessage="Aktuell sind keine kostenlosen Kurse verfügbar, aber wir arbeiten an neuen!"
        viewAllText="Alle kostenlosen Inhalte"
        viewAllHref="/courses?price=free"
      />
    </div>
  ),
}

/**
 * Landing Page Hero Section - Full-width integration example
 *
 * Shows how CoursePreview integrates into a complete landing page
 * with hero section and additional content.
 */
export const LandingPageIntegration: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="bg-[#00070F] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-block px-4 py-2 rounded-full bg-[#0ec2bc]/10 border border-[#0ec2bc]/20">
            <span className="text-[#0ec2bc] text-sm font-montserrat-alt">Willkommen zu Ozean Licht</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-cinzel-decorative text-white mb-6 text-balance">
            Deine spirituelle Transformation beginnt hier
          </h1>
          <p className="text-xl text-white/70 font-montserrat-alt max-w-2xl mx-auto mb-12">
            Lerne von erfahrenen Meistern und entdecke dein volles spirituelles Potential durch unsere transformativen Kurse.
          </p>
          <button className="px-8 py-3 rounded-lg bg-[#0ec2bc] text-[#00070F] font-semibold hover:bg-[#0ec2bc]/80 transition-colors">
            Jetzt beginnen
          </button>
        </div>

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#0ec2bc]/20 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0ec2bc]/10 rounded-full blur-3xl opacity-20" />
        </div>
      </section>

      {/* Course Preview Section */}
      <CoursePreview
        courses={mockCourses}
        title="Beliebte Kurse"
        description="Entdecke unsere am häufigsten gebuchten und höchstbewerteten Kurse, mit denen tausende von Menschen ihre spirituelle Reise transformiert haben."
        viewAllText="Alle Kurse durchsuchen"
        viewAllHref="/courses"
      />

      {/* CTA Footer Section */}
      <section className="relative w-full py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-cinzel-decorative text-white mb-6">Bereit für Transformation?</h2>
          <p className="text-lg text-white/70 font-montserrat-alt mb-8">
            Verbinde dich mit unserer Community und starte deine Reise zu Bewusstseinserweiterung und innerer Erleuchtung.
          </p>
          <button className="px-8 py-3 rounded-lg bg-[#0ec2bc] text-[#00070F] font-semibold hover:bg-[#0ec2bc]/80 transition-colors">
            Kostenlos registrieren
          </button>
        </div>
      </section>
    </div>
  ),
}
