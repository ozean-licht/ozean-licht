'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card'
import { Button } from '../../components/Button'
import { Input, Label } from '../../components/Input'
import { Alert, AlertDescription } from '../../ui/alert'
import { Checkbox } from '../../ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { RegisterFormProps } from '../types'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm({
  onSuccess,
  onError,
  redirectUrl = '/dashboard',
  showLoginLink = true,
  requireTerms = true,
  className,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError('')
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onSuccess?.(data)
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
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
        <CardTitle className="text-2xl font-light">Konto Erstellen</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Dein Name" {...register('name')} error={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="deine@mail.com" {...register('email')} error={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mindestens 8 Zeichen"
                {...register('password')}
                error={errors.password?.message}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Passwort wiederholen"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          {requireTerms && (
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" {...register('acceptTerms')} />
              <label htmlFor="terms" className="text-sm text-[var(--muted-foreground)]">
                Ich akzeptiere die{' '}
                <a href="/terms" className="text-primary hover:underline">
                  AGB
                </a>
              </label>
            </div>
          )}
          {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="text-lg py-3">
            {isLoading ? 'Wird erstellt...' : 'Registrieren'}
          </Button>
        </form>

        {showLoginLink && (
          <div className="text-center text-xs text-[var(--muted-foreground)]">
            Bereits ein Konto?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Jetzt anmelden
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

RegisterForm.displayName = 'RegisterForm'
