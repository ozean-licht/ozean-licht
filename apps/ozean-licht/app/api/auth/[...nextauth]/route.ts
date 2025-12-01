/**
 * NextAuth API Route Handler
 *
 * Handles all authentication routes (/api/auth/*)
 */

import { handlers } from '@/lib/auth/config';

export const { GET, POST } = handlers;
