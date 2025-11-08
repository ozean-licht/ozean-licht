/**
 * NextAuth API Route Handler for Kids Ascension
 *
 * This file exports the NextAuth handlers for the /api/auth/* routes.
 * It uses the configuration defined in lib/auth.ts.
 */

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
