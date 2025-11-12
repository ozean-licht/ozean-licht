'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card'
import { Button } from '../../components/Button'
import { Input, Label, Textarea } from '../../components/Input'
import { Alert, AlertDescription } from '../../ui/alert'
import { cn } from '../../utils/cn'
import type { ContactFormProps } from '../types'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm({
  onSuccess,
  onError,
  className,
}: ContactFormProps) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setError('')
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess(true)
      onSuccess?.(data)
      reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      onError?.(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="default" className={cn('w-full max-w-2xl shadow-lg', className)}>
      <CardHeader className="space-y-4 text-center">
        <CardTitle className="text-2xl font-light">Kontaktiere Uns</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Dein Name" {...register('name')} error={errors.name?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="deine@mail.com" {...register('email')} error={errors.email?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Betreff (Optional)</Label>
            <Input id="subject" placeholder="Worum geht es?" {...register('subject')} error={errors.subject?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht</Label>
            <Textarea
              id="message"
              placeholder="Deine Nachricht..."
              rows={6}
              {...register('message')}
              error={errors.message?.message}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-500/10">
              <AlertDescription className="text-green-400">
                Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="text-lg py-3">
            {isLoading ? 'Wird gesendet...' : 'Nachricht Senden'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

ContactForm.displayName = 'ContactForm'
