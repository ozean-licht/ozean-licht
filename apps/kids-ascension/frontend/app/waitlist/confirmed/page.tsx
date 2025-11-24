'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WaitlistConfirmedPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const alreadyConfirmed = searchParams.get('already_confirmed') === 'true'
  const error = searchParams.get('error')

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const targetDate = new Date('2026-03-01T00:00:00Z').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Error states
  if (error === 'invalid_token') {
    return <ErrorPage message="Der Bestätigungslink ist ungültig. Bitte überprüfe deine E-Mail erneut." />
  }

  if (error === 'not_found') {
    return <ErrorPage message="Der Bestätigungslink wurde nicht gefunden. Möglicherweise ist er abgelaufen." />
  }

  if (error === 'server_error') {
    return <ErrorPage message="Ein technischer Fehler ist aufgetreten. Bitte versuche es später erneut." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/KidsAscension.webp"
            alt="Kids Ascension"
            width={120}
            height={120}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-cyan-200">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {alreadyConfirmed ? (
              <span className="text-gray-800">Du bist bereits dabei!</span>
            ) : (
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Herzlich willkommen! 🎉
              </span>
            )}
          </h1>

          {/* Email confirmation message */}
          {email && (
            <p className="text-center text-gray-600 mb-8">
              {alreadyConfirmed
                ? 'Deine E-Mail-Adresse wurde bereits bestätigt.'
                : 'Deine E-Mail-Adresse wurde erfolgreich bestätigt!'}
              <br />
              <span className="font-semibold text-cyan-700">{email}</span>
            </p>
          )}

          {/* Countdown */}
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-6 mb-8">
            <p className="text-center text-gray-800 font-semibold mb-4">
              Countdown zum Start
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-600">{timeLeft.days}</div>
                <div className="text-xs text-gray-600 mt-1">Tage</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-600">{timeLeft.hours}</div>
                <div className="text-xs text-gray-600 mt-1">Stunden</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-600">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-600 mt-1">Minuten</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-cyan-600">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-600 mt-1">Sekunden</div>
              </div>
            </div>
            <p className="text-center text-gray-700 font-bold mt-4">1. März 2026</p>
          </div>

          {/* What's next */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-gray-800 text-center">Was passiert jetzt?</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-lg">
                <span className="text-2xl">📧</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Bleib informiert</h3>
                  <p className="text-sm text-gray-600">
                    Wir senden dir Updates kurz vor dem Start der Plattform.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Früher Zugang</h3>
                  <p className="text-sm text-gray-600">
                    Als Wartelisten-Mitglied erhältst du als Erste(r) Zugang zur Plattform.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <span className="text-2xl">💯</span>
                <div>
                  <h3 className="font-semibold text-gray-800">100% Kostenlos</h3>
                  <p className="text-sm text-gray-600">
                    Alle Inhalte bleiben für immer kostenlos - keine versteckten Kosten.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social sharing */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-700 font-semibold mb-4">
              Teile Kids Ascension mit Freunden und Familie!
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          Selbstgesteuertes Lernen • Qualitätsinhalte • Immer kostenlos
        </p>
      </div>
    </div>
  )
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Etwas ist schiefgelaufen
          </h1>

          <p className="text-center text-gray-600 mb-8">{message}</p>

          <div className="flex justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all"
            >
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
