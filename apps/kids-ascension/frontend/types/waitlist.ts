/**
 * TypeScript Types for Waitlist System
 */

import { WaitlistStatus } from '.prisma/client-ka'

export { WaitlistStatus }

// Database model type
export interface WaitlistEntry {
  id: string
  email: string
  status: WaitlistStatus
  token: string
  ipAddress: string | null
  userAgent: string | null
  confirmedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// API Request/Response types
export interface WaitlistSubscribeRequest {
  email: string
}

export interface WaitlistSubscribeResponse {
  success: boolean
  message: string
  alreadyConfirmed?: boolean
}

export interface WaitlistConfirmResponse {
  success: boolean
  message: string
  email?: string
}

// Error types
export class WaitlistError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'WaitlistError'
  }
}
