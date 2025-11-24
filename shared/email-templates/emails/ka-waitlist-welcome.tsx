import * as React from 'react'
import { Text, Button, Section, Container, Body, Html, Head, Img, Link } from '@react-email/components'

export default function KAWaitlistWelcome() {
  const previewText = 'Willkommen bei Kids Ascension! Deine E-Mail wurde bestätigt.'
  const launchDate = new Date('2026-03-01T00:00:00Z')
  const now = new Date()
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const logoUrl = 'https://framerusercontent.com/images/roSRkCMYnbq64NyHwaubaBsS9Ts.png?scale-down-to=512&width=542&height=299'

  return (
    <Html>
      <Head>
        <title>Kids Ascension - Willkommen!</title>
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

        <Text style={paragraph}>
          Deine E-Mail-Adresse wurde erfolgreich bestätigt. Du bist jetzt offiziell
          auf unserer Warteliste und wirst zu den Ersten gehören, die Zugang zur
          Plattform erhalten!
        </Text>

        <Section style={countdownBox}>
          <Text style={countdownTitle}>Countdown zum Start</Text>
          <Text style={countdownNumber}>{daysUntilLaunch}</Text>
          <Text style={countdownLabel}>Tage bis zum Launch</Text>
          <Text style={countdownDate}>1. März 2026</Text>
        </Section>

        <Section style={ctaSection}>
          <Text style={ctaText}>
            Teile Kids Ascension mit Freunden und Familie!
          </Text>
          <Button href="https://kids-ascension.org" style={button}>
            Link Kopieren
          </Button>
        </Section>

        <Text style={notificationInfo}>
          📧 <strong>Wir halten dich auf dem Laufenden:</strong>
          <br />
          Du erhältst von uns eine E-Mail, sobald die Plattform live geht. In der
          Zwischenzeit arbeiten wir fleißig daran, dir das beste Lernerlebnis zu bieten.
        </Text>

            <Text style={signature}>
              Mit freundlichen Grüßen,
              <br />
              Das Kids Ascension Team
              <br />
              <em style={{ color: '#8898aa', fontSize: '14px' }}>
                Gemeinsam für eine bessere Bildung
              </em>
            </Text>

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

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 24px'
}

const subheading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '32px 0 16px'
}

const countdownBox = {
  backgroundColor: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
  background: '#0ea5e9',
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '32px 0'
}

const countdownTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#ffffff',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px'
}

const countdownNumber = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '8px 0'
}

const countdownLabel = {
  fontSize: '16px',
  color: '#ffffff',
  opacity: 0.9,
  margin: '0 0 16px'
}

const countdownDate = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0'
}

const featureItem = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 20px',
  paddingLeft: '8px'
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '40px 0'
}

const ctaText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 16px'
}

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  cursor: 'pointer'
}

const notificationInfo = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #86efac',
  borderRadius: '8px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#14532d',
  margin: '32px 0'
}

const signature = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  textAlign: 'center' as const,
  margin: '40px 0 0'
}

const footer = {
  textAlign: 'center' as const,
  paddingTop: '24px',
  borderTop: '1px solid #e6ebf1',
  marginTop: '32px'
}

const footerLink = {
  color: '#0ea5e9',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500'
}
