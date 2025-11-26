/**
 * Projects Section Layout
 * Wrapper layout for all project management pages
 */

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  )
}
