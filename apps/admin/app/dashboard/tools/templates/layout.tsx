/**
 * Templates Section Layout
 * Wrapper layout for all process template pages
 */

export default function TemplatesLayout({
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
