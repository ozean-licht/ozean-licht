'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/Card'
import { Button } from '../../components/Button'
import { Input, Label } from '../../components/Input'
import { Alert, AlertDescription } from '../../ui/alert'
import { cn } from '../../utils/cn'
import type { PasswordResetFormProps } from '../types'

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ResetFormData = z.infer<typeof resetSchema>

export function PasswordResetForm({
  onSuccess,
  onError,
  className,
}: PasswordResetFormProps) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (_data: ResetFormData) => {
    setError('')
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      onError?.(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="default" className={cn('w-full max-w-md shadow-lg', className)}>
      <CardHeader className="space-y-4 text-center">
        <CardTitle className="text-2xl font-light">Passwort Zurücksetzen</CardTitle>
        <CardDescription>
          Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {success ? (
          <Alert className="border-green-500 bg-green-500/10">
            <AlertDescription className="text-green-400">
              Eine E-Mail zum Zurücksetzen deines Passworts wurde gesendet. Bitte überprüfe dein Postfach.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="deine@mail.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="text-lg py-3">
              {isLoading ? 'Wird gesendet...' : 'Link Senden'}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-[var(--muted-foreground)]">
          <a href="/login" className="text-primary hover:underline font-medium">
            Zurück zur Anmeldung
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

PasswordResetForm.displayName = 'PasswordResetForm'
