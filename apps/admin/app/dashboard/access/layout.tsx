/**
 * Access Management Section Layout
 * Wrapper layout for all access management pages (users, permissions, roles)
 */

export default function AccessLayout({
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
