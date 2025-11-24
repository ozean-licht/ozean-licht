'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Vortex } from '../components/vortex'

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/waitlist/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setMessageType('success')
        setMessage(data.message)
        if (!data.alreadyConfirmed) {
          setEmail('') // Clear form only if new signup
        }
      } else {
        setMessageType('error')
        setMessage(data.message)
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Vortex
        containerClassName="min-h-screen"
        baseHue={180}
        rangeSpeed={2}
        particleCount={600}
        className="flex flex-col items-center justify-center min-h-screen py-8"
      >
        {/* Logo - Outside and above the form */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/KidsAscension.webp"
            alt="Kids Ascension"
            width={140}
            height={140}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>

        <div className="max-w-md w-full mx-4">
          <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 text-center border-2 border-cyan-300">
          {/* Brand Name */}
          <h1 className="text-4xl mb-2">
            <span className="font-bold text-white">Kids</span>{' '}
            <span className="font-medium text-cyan-100">Ascension</span>
          </h1>

          <p className="text-xl text-cyan-100 font-semibold mb-6">
            Kids Ascension öffnet bald!
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-xs text-cyan-100 mt-1">Tage</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-xs text-cyan-100 mt-1">Stunden</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-xs text-cyan-100 mt-1">Minuten</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-xs text-cyan-100 mt-1">Sekunden</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-cyan-50">
              Für weitere Infos klicke{' '}
              <a href="#" className="text-white font-semibold underline hover:text-cyan-100">
                hier
              </a>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4">
              Warteliste beitreten
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Deine E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-cyan-700 font-semibold py-3 rounded-lg hover:bg-cyan-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Wird gesendet...
                  </>
                ) : (
                  'Benachrichtige mich'
                )}
              </button>

              {/* Success/Error Message */}
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    messageType === 'success'
                      ? 'bg-green-500/20 text-white border border-green-400/50'
                      : 'bg-red-500/20 text-white border border-red-400/50'
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>

          <p className="text-sm text-cyan-100 mt-6">
            Selbstgesteuertes Lernen • Qualitätsinhalte • Immer kostenlos
          </p>
          </div>
        </div>
      </Vortex>
    </div>
  )
}
