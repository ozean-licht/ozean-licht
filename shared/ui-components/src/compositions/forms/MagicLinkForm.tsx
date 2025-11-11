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
import type { MagicLinkFormProps } from '../types'

const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type MagicLinkFormData = z.infer<typeof magicLinkSchema>

export function MagicLinkForm({
  onSuccess,
  onError,
  className,
}: MagicLinkFormProps) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  })

  const onSubmit = async (_data: MagicLinkFormData) => {
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
        <CardTitle className="text-2xl font-light">Magic Link Anmeldung</CardTitle>
        <CardDescription>
          Erhalte einen sicheren Anmeldelink per E-Mail. Kein Passwort erforderlich.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {success ? (
          <Alert className="border-green-500 bg-green-500/10">
            <AlertDescription className="text-green-400">
              Ein Magic Link wurde an deine E-Mail-Adresse gesendet. Überprüfe dein Postfach.
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
              {isLoading ? 'Wird gesendet...' : 'Magic Link Senden'}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-[var(--muted-foreground)]">
          <a href="/login" className="text-primary hover:underline font-medium">
            Mit Passwort anmelden
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

MagicLinkForm.displayName = 'MagicLinkForm'
