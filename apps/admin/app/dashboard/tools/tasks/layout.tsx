/**
 * Tasks Section Layout
 * Wrapper layout for all task management pages
 */

export default function TasksLayout({
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
