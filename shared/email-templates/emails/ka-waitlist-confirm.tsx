import * as React from 'react'
import { Text, Button, Section } from '@react-email/components'
import EmailLayout from './components/layout'

interface KAWaitlistConfirmProps {
  confirmUrl: string
}

export default function KAWaitlistConfirm({ confirmUrl }: KAWaitlistConfirmProps) {
  const previewText = 'Bestätige deine E-Mail-Adresse für die Kids Ascension Warteliste'

  return (
    <EmailLayout brandName="Kids Ascension" previewText={previewText}>
      <Section>
        <Text style={heading}>Bestätige deine E-Mail-Adresse</Text>

        <Text style={paragraph}>
          Vielen Dank für dein Interesse an <strong>Kids Ascension</strong>!
        </Text>

        <Text style={paragraph}>
          Wir freuen uns, dich auf unserer Warteliste begrüßen zu dürfen. Um deine
          Anmeldung abzuschließen, bestätige bitte deine E-Mail-Adresse durch einen
          Klick auf den Button unten:
        </Text>

        <Section style={buttonContainer}>
          <Button href={confirmUrl} style={button}>
            E-Mail bestätigen
          </Button>
        </Section>

        <Text style={paragraph}>
          Oder kopiere diesen Link in deinen Browser:
        </Text>

        <Text style={linkText}>{confirmUrl}</Text>

        <Text style={infoBox}>
          <strong>ℹ️ Was ist Kids Ascension?</strong>
          <br />
          Kids Ascension ist eine 100% kostenlose Bildungsplattform für Kinder im
          Alter von 6-14 Jahren. Wir bieten hochwertige Video-Kurse und
          selbstgesteuertes Lernen - komplett kostenlos und ohne versteckte Kosten.
        </Text>

        <Text style={launchInfo}>
          🚀 <strong>Start:</strong> 1. März 2026
        </Text>

        <Text style={paragraph}>
          Wir senden dir eine Benachrichtigung, sobald die Plattform verfügbar ist!
        </Text>

        <Text style={signature}>
          Mit freundlichen Grüßen,
          <br />
          Das Kids Ascension Team
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Styles
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 24px'
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px'
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0'
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

const linkText = {
  fontSize: '14px',
  color: '#8898aa',
  wordBreak: 'break-all' as const,
  margin: '0 0 24px'
}

const infoBox = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '8px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#0c4a6e',
  margin: '24px 0'
}

const launchInfo = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#0ea5e9',
  textAlign: 'center' as const,
  margin: '24px 0'
}

const signature = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '32px 0 0'
}
