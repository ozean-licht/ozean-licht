import * as React from 'react'
import { Text, Button, Section } from '@react-email/components'
import EmailLayout from './components/layout'

export default function KAWaitlistWelcome() {
  const previewText = 'Willkommen bei Kids Ascension! Deine E-Mail wurde bestätigt.'
  const launchDate = new Date('2026-03-01T00:00:00Z')
  const now = new Date()
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <EmailLayout brandName="Kids Ascension" previewText={previewText}>
      <Section>
        <Text style={heading}>🎉 Willkommen bei Kids Ascension!</Text>

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

        <Text style={subheading}>Was erwartet dich?</Text>

        <Text style={featureItem}>
          📚 <strong>Hochwertige Video-Kurse</strong>
          <br />
          Professionell produzierte Lerninhalte in Lehrer-Qualität
        </Text>

        <Text style={featureItem}>
          🎯 <strong>Selbstgesteuertes Lernen</strong>
          <br />
          Kinder lernen in ihrem eigenen Tempo, wann und wo sie möchten
        </Text>

        <Text style={featureItem}>
          💯 <strong>100% Kostenlos</strong>
          <br />
          Keine versteckten Kosten, keine Abonnements - für immer gratis
        </Text>

        <Text style={featureItem}>
          🌟 <strong>Altersgruppengerecht</strong>
          <br />
          Speziell entwickelt für Kinder zwischen 6 und 14 Jahren
        </Text>

        <Section style={ctaSection}>
          <Text style={ctaText}>
            Teile Kids Ascension mit Freunden und Familie!
          </Text>
          <Button href="https://kids-ascension.dev" style={button}>
            Zur Warteliste-Seite
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
      </Section>
    </EmailLayout>
  )
}

// Styles
const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  textAlign: 'center' as const,
  margin: '0 0 24px'
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
