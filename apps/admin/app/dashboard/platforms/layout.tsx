/**
 * Platforms Section Layout
 * Wrapper layout for platform-specific admin pages
 * Note: This folder is reserved for future Ozean Licht platform features
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
