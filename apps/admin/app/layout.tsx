import type { Metadata } from 'next'
import { Montserrat, Montserrat_Alternates, Cinzel, Cinzel_Decorative } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/providers/ThemeProvider'
import { ToastProvider } from '@/lib/providers/ToastProvider'
import { SessionProvider } from '@/lib/providers/SessionProvider'

// Configure Google Fonts
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-alt',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-decorative',
  display: 'swap',
})

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${montserratAlternates.variable} ${cinzel.variable} ${cinzelDecorative.variable} font-sans antialiased bg-[#00070F]`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            {children}
            <ToastProvider />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
