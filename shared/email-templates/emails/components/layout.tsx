import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Hr,
  Link
} from '@react-email/components'

interface EmailLayoutProps {
  children: React.ReactNode
  previewText?: string
  brandName: 'Kids Ascension' | 'Ozean Licht'
}

export default function EmailLayout({
  children,
  previewText = '',
  brandName = 'Kids Ascension'
}: EmailLayoutProps) {
  const brandConfig = {
    'Kids Ascension': {
      primaryColor: '#0ea5e9', // Cyan
      secondaryColor: '#3b82f6', // Blue
      logoUrl: 'https://kids-ascension.dev/images/KidsAscension.webp',
      websiteUrl: 'https://kids-ascension.dev'
    },
    'Ozean Licht': {
      primaryColor: '#0ec2bc', // Turquoise
      secondaryColor: '#0ea5e9',
      logoUrl: 'https://ozean-licht.dev/logo.png',
      websiteUrl: 'https://ozean-licht.dev'
    }
  }

  const config = brandConfig[brandName]

  return (
    <Html>
      <Head />
      {previewText && (
        <div
          style={{
            display: 'none',
            overflow: 'hidden',
            lineHeight: '1px',
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0
          }}
        >
          {previewText}
        </div>
      )}
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src={config.logoUrl}
              alt={brandName}
              width="80"
              height="80"
              style={logo}
            />
            <Text style={brandTitle}>{brandName}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {brandName}. Alle Rechte vorbehalten.
            </Text>
            <Text style={footerText}>
              <Link href={config.websiteUrl} style={footerLink}>
                {config.websiteUrl}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px'
}

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const
}

const logo = {
  margin: '0 auto',
  borderRadius: '8px'
}

const brandTitle = {
  margin: '16px 0 0',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1a1a1a'
}

const content = {
  padding: '0 24px'
}

const divider = {
  borderColor: '#e6ebf1',
  margin: '32px 0'
}

const footer = {
  padding: '0 24px',
  textAlign: 'center' as const
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '4px 0'
}

const footerLink = {
  color: '#8898aa',
  textDecoration: 'underline'
}
