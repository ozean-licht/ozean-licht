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
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Deine E-Mail-Adresse"
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-cyan-700 font-semibold py-3 rounded-lg hover:bg-cyan-50 transition-all shadow-md hover:shadow-lg"
              >
                Benachrichtige mich
              </button>
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
