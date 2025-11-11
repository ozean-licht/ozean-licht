/**
 * System Administration Section Layout
 * Wrapper layout for all system admin pages (health, monitoring, configuration)
 */

export default function SystemLayout({
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
