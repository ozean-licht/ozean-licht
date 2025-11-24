import * as React from 'react'
import { Text, Button, Section, Container, Body, Html, Head, Img, Link } from '@react-email/components'

interface KAWaitlistConfirmProps {
  confirmUrl: string
}

export default function KAWaitlistConfirm({ confirmUrl }: KAWaitlistConfirmProps) {
  const previewText = 'Bestätige deine E-Mail-Adresse für die Kids Ascension Warteliste'
  const logoUrl = 'https://framerusercontent.com/images/roSRkCMYnbq64NyHwaubaBsS9Ts.png?scale-down-to=512&width=542&height=299'

  return (
    <Html>
      <Head>
        <title>Kids Ascension - E-Mail bestätigen</title>
      </Head>
      <Body style={body}>
        {/* Preview text */}
        <div style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0, maxHeight: 0, maxWidth: 0 }}>
          {previewText}
        </div>

        <Container style={container}>
          <Section style={box}>
            {/* Logo */}
            <Section style={logoContainer}>
              <Img
                src={logoUrl}
                alt="Kids Ascension"
                width="200"
                height="110"
                style={logo}
              />
            </Section>

            <Text style={heading}>
              Jetzt bestätigen um informiert zu werden.
            </Text>

            <Section style={buttonContainer}>
              <Button href={confirmUrl} style={button}>
                E-Mail bestätigen
              </Button>
            </Section>

            {/* Footer */}
            <Section style={footer}>
              <Link href="https://kids-ascension.org" style={footerLink}>
                kids-ascension.org
              </Link>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const body = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '40px 0'
}

const container = {
  maxWidth: '600px',
  margin: '0 auto'
}

const box = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '48px 32px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e6ebf1'
}

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px'
}

const logo = {
  margin: '0 auto',
  borderRadius: '8px'
}

const heading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1a1a1a',
  textAlign: 'center' as const,
  margin: '0 0 32px',
  lineHeight: '28px'
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '0 0 32px'
}

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
  cursor: 'pointer',
  border: 'none'
}

const footer = {
  textAlign: 'center' as const,
  paddingTop: '24px',
  borderTop: '1px solid #e6ebf1'
}

const footerLink = {
  color: '#0ea5e9',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500'
}
