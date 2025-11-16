/**
 * Type definitions for Storybook Auth Wrapper
 */

export interface AuthUser {
  id: string
  email: string
  adminUserId: string
  adminRole: string
}

export interface LoginCredentials {
  email: string
  password: string
}
