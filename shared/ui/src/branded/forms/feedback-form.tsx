'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { CtaButton } from '../cta-button'

// Import from cossui instead of local ui
import { Input } from '../../cossui/input'
import { Textarea } from '../../cossui/textarea'
import { Checkbox } from '../../cossui/checkbox'

export interface FeedbackFormData {
  firstName: string
  lastName: string
  email: string
  feedback: string
  agreeTerms: boolean
  agreePrivacy: boolean
}

export interface FeedbackFormProps {
  /**
   * Form title
   */
  title?: string
  /**
   * Form description
   */
  description?: string
  /**
   * Submit button text
   */
  submitButtonText?: string
  /**
   * Success message after submission
   */
  successMessage?: string
  /**
   * Terms checkbox label
   */
  termsLabel?: string
  /**
   * Privacy checkbox label
   */
  privacyLabel?: string
  /**
   * Callback when form is submitted
   */
  onSubmit?: (data: FeedbackFormData) => void | Promise<void>
  /**
   * Custom className for the form container
   */
  className?: string
}

export function FeedbackForm({
  title = 'Dein Feedback Ist Uns Wichtig',
  description = 'Hilf uns, Ozean Licht weiterzuentwickeln und noch besser auf die Bedürfnisse unserer Community einzugehen.\n\nOb du Verbesserungsvorschläge für unsere Systeme hast, dir etwas Besonderes aufgefallen ist oder du einfach deine ehrliche Erfahrung mit uns teilen möchtest – dieser Raum ist für deine Worte geschaffen. 💫',
  submitButtonText = 'Feedback Senden',
  successMessage = 'Vielen Dank für dein Feedback! Wir melden uns bald bei dir.',
  termsLabel = '*Ich erkläre mich bereit, mein Feedback veröffentlichen zu lassen.',
  privacyLabel = '*Ich habe die Datenschutzerklärung gelesen und erkläre mich damit einverstanden.',
  onSubmit,
  className = '',
}: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    firstName: '',
    lastName: '',
    email: '',
    feedback: '',
    agreeTerms: false,
    agreePrivacy: false,
  })

  const handleInputChange = (field: keyof FeedbackFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (onSubmit) {
      await onSubmit(formData)
    } else {
      console.log('Feedback submitted:', formData)
      alert(successMessage)
    }
  }

  return (
    <div
      className={`rounded-xl border bg-[#00151a] p-8 ${className}`}
      style={{ borderColor: '#052a2a' }}
    >
      <h2 className="font-cinzel-decorative text-3xl text-white text-center mb-8">{title}</h2>

      <p className="text-gray-300 text-center mb-8 leading-relaxed whitespace-pre-line">
        {description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-white font-montserrat-alt">
              Vorname *
            </label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              className="bg-[#001212]"
              style={{ borderColor: '#052a2a' }}
              placeholder="Dein Vorname"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-white font-montserrat-alt">
              Nachname *
            </label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              className="bg-[#001212]"
              style={{ borderColor: '#052a2a' }}
              placeholder="Dein Nachname"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-white font-montserrat-alt">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="bg-[#001212]"
            style={{ borderColor: '#052a2a' }}
            placeholder="deine@email.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="feedback" className="text-white font-montserrat-alt">
            Dein Feedback *
          </label>
          <Textarea
            id="feedback"
            value={formData.feedback}
            onChange={(e) => handleInputChange('feedback', e.target.value)}
            required
            rows={6}
            placeholder="Teile deine Gedanken, Erfahrungen und Vorschläge mit uns..."
            className="bg-[#001212]"
            style={{ borderColor: '#052a2a' }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
            />
            <label htmlFor="agreeTerms" className="text-white/70 font-montserrat-alt text-sm">
              {termsLabel}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreePrivacy"
              checked={formData.agreePrivacy}
              onCheckedChange={(checked) => handleInputChange('agreePrivacy', checked as boolean)}
            />
            <label htmlFor="agreePrivacy" className="text-white/70 font-montserrat-alt text-sm">
              {privacyLabel}
            </label>
          </div>
        </div>

        <div className="pt-6 text-center">
          <CtaButton type="submit">
            {submitButtonText}
            <Send className="w-4 h-4 ml-2" />
          </CtaButton>
        </div>
      </form>
    </div>
  )
}
