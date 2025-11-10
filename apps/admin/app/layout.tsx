import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/providers/ThemeProvider'
import { ToastProvider } from '@/lib/providers/ToastProvider'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Ozean Licht Ecosystem',
  description: 'Unified admin dashboard for Kids Ascension and Ozean Licht platforms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
