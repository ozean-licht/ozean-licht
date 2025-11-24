import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kids Ascension - Coming Soon',
  description: 'Liberation through learning - Educational platform for children ages 6-14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
