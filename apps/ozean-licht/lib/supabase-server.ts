// DEMO MODE - Server-side supabase is stubbed
// In demo mode, we use mock data only

import { mockSupabase } from './supabase-mock'

// Re-export mock supabase for server-side usage
export function createServerSupabaseClient() {
  return mockSupabase
}

export const supabase = mockSupabase
