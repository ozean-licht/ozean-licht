/**
 * Platforms Section Layout
 * Wrapper layout for all platform-specific admin pages
 * Future: Kids Ascension, Ozean Licht platform management
 */

export default function PlatformsLayout({
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
