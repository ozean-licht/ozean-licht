# Plan: Kids Ascension Waitlist with Double Opt-In Email

## Task Description
Implement a functional waitlist system for Kids Ascension with double opt-in email verification using Resend and React Email. The system will:
- Capture email addresses from the landing page waitlist form
- Send a confirmation email with verification link
- Verify email addresses via token confirmation
- Send a welcome email after successful confirmation
- Store waitlist entries in the `kids_ascension_db` database
- Use shared email templates to prepare for future Ozean Licht newsletter functionality

## Objective
Create a production-ready waitlist system that:
1. Validates and stores email signups in a dedicated `waitlist` table
2. Implements double opt-in email flow using Resend API
3. Uses React Email templates stored in a shared package for future reusability
4. Provides success feedback to users after confirmation
5. Lays the foundation for migrating to MCP Gateway when Ozean Licht needs email functionality

## Problem Statement
The Kids Ascension landing page currently has a non-functional waitlist form. With the platform launching March 1, 2026, we need to:
- Start collecting interested users immediately (time-sensitive marketing)
- Ensure legitimate signups through double opt-in verification
- Build email infrastructure that can scale to both platforms (KA + OL)
- Avoid duplicate work by using shared email templates from the start

## Solution Approach
**Hybrid Strategy (Strategy 3):**
- **Phase 1 (Now):** Direct Resend integration in KA frontend for speed (ship in hours)
- **Shared Templates:** Create `shared/email-templates` package immediately for reusability
- **Easy Migration:** Design API layer to easily extract to MCP Gateway later
- **Future-Proof:** When Ozean Licht needs email, extract logic to `tools/mcp-gateway/src/services/resend/`

This approach balances speed (ship today) with architecture alignment (prepare for reuse).

## Relevant Files

### Existing Files to Modify
- **`apps/kids-ascension/frontend/app/page.tsx`** - Connect waitlist form to API
- **`apps/kids-ascension/frontend/prisma/schema.prisma`** - Add Waitlist model
- **`apps/kids-ascension/frontend/package.json`** - Add Resend and React Email dependencies
- **`apps/kids-ascension/frontend/lib/auth.ts`** - Reference for database connection patterns
- **`.env`** - Add RESEND_API_KEY and KIDS_ASCENSION_DB_URL

### New Files

#### Shared Email Templates Package
- **`shared/email-templates/package.json`** - New package for React Email templates
- **`shared/email-templates/tsconfig.json`** - TypeScript configuration
- **`shared/email-templates/emails/ka-waitlist-confirm.tsx`** - Confirmation email template
- **`shared/email-templates/emails/ka-waitlist-welcome.tsx`** - Welcome email template
- **`shared/email-templates/emails/components/layout.tsx`** - Shared email layout
- **`shared/email-templates/README.md`** - Documentation

#### Kids Ascension Backend
- **`apps/kids-ascension/frontend/lib/email/resend-client.ts`** - Resend SDK wrapper
- **`apps/kids-ascension/frontend/lib/email/waitlist-emails.ts`** - Waitlist email business logic
- **`apps/kids-ascension/frontend/lib/db/prisma-client.ts`** - Prisma client for KA database
- **`apps/kids-ascension/frontend/app/api/waitlist/subscribe/route.ts`** - Initial signup endpoint
- **`apps/kids-ascension/frontend/app/api/waitlist/confirm/[token]/route.ts`** - Email confirmation endpoint
- **`apps/kids-ascension/frontend/app/waitlist/confirmed/page.tsx`** - Confirmation success page
- **`apps/kids-ascension/frontend/types/waitlist.ts`** - TypeScript types

#### Database Migration
- **`apps/kids-ascension/frontend/prisma/migrations/XXX_create_waitlist_table.sql`** - SQL migration

## Implementation Phases

### Phase 1: Foundation (Database + Email Templates)
Set up the core infrastructure:
1. Create database schema for waitlist table
2. Create shared email templates package with React Email
3. Configure Prisma client for kids_ascension_db
4. Set up environment variables for Resend

**Duration:** 30-45 minutes

### Phase 2: Core Implementation (API Routes + Email Logic)
Build the backend functionality:
1. Install Resend SDK and React Email in KA frontend
2. Create Resend client wrapper with error handling
3. Implement `/api/waitlist/subscribe` endpoint (token generation + confirmation email)
4. Implement `/api/waitlist/confirm/[token]` endpoint (verification + welcome email)
5. Create email sending functions with template rendering

**Duration:** 1-2 hours

### Phase 3: Integration & Polish (Frontend + Testing)
Connect everything together:
1. Update landing page form with state management and API calls
2. Create confirmation success page
3. Add loading states and error handling to form
4. Test complete flow end-to-end
5. Add rate limiting and spam protection (optional but recommended)

**Duration:** 30-60 minutes

## Step by Step Tasks

### 1. Setup Environment Variables
- Add `RESEND_API_KEY` to `.env` file (obtain from Resend dashboard)
- Verify `DATABASE_URL_KA` is correctly configured for kids_ascension_db
- Add `NEXT_PUBLIC_BASE_URL` for email confirmation links (e.g., `http://localhost:3000` or `https://kids-ascension.dev`)

### 2. Create Shared Email Templates Package
- Create `shared/email-templates/` directory structure
- Initialize `package.json` with dependencies: `react-email`, `@react-email/components`
- Create `tsconfig.json` for TypeScript support
- Build email layout component with Kids Ascension branding
- Create `ka-waitlist-confirm.tsx` template with confirmation button
- Create `ka-waitlist-welcome.tsx` template with welcome message
- Add build script to compile React Email templates

### 3. Create Database Schema
- Open `apps/kids-ascension/frontend/prisma/schema.prisma`
- Add `Waitlist` model with fields:
  - `id` (UUID, primary key)
  - `email` (String, unique, indexed)
  - `status` (Enum: PENDING, CONFIRMED, UNSUBSCRIBED)
  - `token` (String, unique, indexed) - for email confirmation
  - `ipAddress` (String, optional) - for spam detection
  - `userAgent` (String, optional) - for analytics
  - `confirmedAt` (DateTime, optional)
  - `createdAt` (DateTime, auto)
  - `updatedAt` (DateTime, auto)
- Add `WaitlistStatus` enum (PENDING, CONFIRMED, UNSUBSCRIBED)
- Run `pnpm --filter @ka/web db:push` to apply schema changes

### 4. Install Dependencies
- Add to `apps/kids-ascension/frontend/package.json`:
  - `resend` (latest) - Resend SDK
  - `@shared/email-templates` (workspace:*) - Shared templates
  - `crypto` (built-in Node.js) - Token generation
- Run `pnpm install` from root to install new dependencies
- Verify installation with `pnpm --filter @ka/web list`

### 5. Create Prisma Client for Kids Ascension DB
- Create `apps/kids-ascension/frontend/lib/db/prisma-client.ts`
- Export singleton Prisma client connected to `DATABASE_URL_KA`
- Add connection pool configuration for production
- Handle graceful shutdown for Next.js hot reload

### 6. Create Resend Client Wrapper
- Create `apps/kids-ascension/frontend/lib/email/resend-client.ts`
- Initialize Resend client with API key from environment
- Add error handling and logging
- Export typed client instance

### 7. Create Email Sending Functions
- Create `apps/kids-ascension/frontend/lib/email/waitlist-emails.ts`
- Implement `sendConfirmationEmail(email, token)`:
  - Render `ka-waitlist-confirm` template
  - Generate confirmation URL with token
  - Send via Resend client
  - Return success/failure status
- Implement `sendWelcomeEmail(email)`:
  - Render `ka-waitlist-welcome` template
  - Send via Resend client
  - Return success/failure status
- Add error logging and retry logic

### 8. Create TypeScript Types
- Create `apps/kids-ascension/frontend/types/waitlist.ts`
- Define `WaitlistEntry` interface
- Define `WaitlistSubscribeRequest` and `WaitlistSubscribeResponse`
- Define `WaitlistConfirmRequest` and `WaitlistConfirmResponse`
- Export all types

### 9. Implement Subscribe API Route
- Create `apps/kids-ascension/frontend/app/api/waitlist/subscribe/route.ts`
- Implement `POST /api/waitlist/subscribe`:
  - Validate email format with Zod schema
  - Check if email already exists in database
  - If exists and confirmed, return appropriate message
  - If exists and pending, regenerate token and resend confirmation
  - If new, generate secure random token (32 bytes, hex)
  - Insert into database with status=PENDING
  - Send confirmation email
  - Return success response with appropriate message
- Add rate limiting (optional): max 3 requests per email per hour
- Add IP-based spam protection (optional)
- Handle all error cases with appropriate HTTP status codes

### 10. Implement Confirmation API Route
- Create `apps/kids-ascension/frontend/app/api/waitlist/confirm/[token]/route.ts`
- Implement `GET /api/waitlist/confirm/[token]`:
  - Extract token from URL params
  - Query database for waitlist entry with matching token
  - If not found, return 404 error
  - If already confirmed, redirect to success page with message
  - If pending and token valid:
    - Update status to CONFIRMED
    - Set confirmedAt timestamp
    - Send welcome email
    - Redirect to confirmation success page
- Add token expiration check (optional): tokens expire after 48 hours
- Handle all error cases gracefully

### 11. Create Confirmation Success Page
- Create `apps/kids-ascension/frontend/app/waitlist/confirmed/page.tsx`
- Display success message with Kids Ascension branding
- Show countdown to launch (March 1, 2026)
- Include social media links (optional)
- Add call-to-action: "Share with friends"
- Match design language of landing page

### 12. Update Landing Page Form
- Open `apps/kids-ascension/frontend/app/page.tsx`
- Add state management with `useState`:
  - `email` - form input value
  - `loading` - submission state
  - `message` - success/error message
  - `messageType` - 'success' or 'error'
- Implement `handleSubmit` function:
  - Prevent default form submission
  - Validate email client-side
  - Set loading state
  - POST to `/api/waitlist/subscribe`
  - Handle response (show success/error message)
  - Clear form on success
- Add loading spinner during submission
- Add success/error message display below form
- Improve form UX with disabled state during loading

### 13. Add Error Handling and Logging
- Create `apps/kids-ascension/frontend/lib/logger.ts` (optional)
- Add structured logging to all API routes
- Log email sending attempts and failures
- Add Sentry integration for production error tracking (optional)

### 14. Test Complete Flow End-to-End
- Start local development: `pnpm --filter @ka/web dev`
- Test signup flow:
  1. Submit email via landing page form
  2. Verify database entry created with status=PENDING
  3. Check email inbox for confirmation email
  4. Click confirmation link
  5. Verify redirect to success page
  6. Verify database updated to status=CONFIRMED
  7. Check email inbox for welcome email
- Test edge cases:
  - Duplicate email signup (should resend confirmation)
  - Invalid email format (should show error)
  - Invalid/expired token (should show error)
  - Already confirmed email (should show appropriate message)

### 15. Add Rate Limiting and Security (Optional but Recommended)
- Install `@vercel/kv` or use in-memory rate limiting
- Add IP-based rate limiting: max 5 signups per IP per hour
- Add email-based rate limiting: max 3 confirmation resends per hour
- Add CAPTCHA integration for additional spam protection (optional)

### 16. Documentation and Handoff Prep
- Document email template customization process in `shared/email-templates/README.md`
- Add API endpoint documentation to `apps/kids-ascension/README.md`
- Document migration path to MCP Gateway in plan notes
- List Resend dashboard URL and API key location

## Testing Strategy

### Unit Tests
- **Email Template Rendering** - Verify React Email templates render correctly
- **Token Generation** - Ensure tokens are cryptographically secure and unique
- **Database Operations** - Test CRUD operations on waitlist table
- **Email Validation** - Test Zod schemas with valid/invalid emails

### Integration Tests
- **API Route Tests:**
  - POST `/api/waitlist/subscribe` with valid email → 200 + database entry
  - POST `/api/waitlist/subscribe` with invalid email → 400 error
  - POST `/api/waitlist/subscribe` with duplicate email → appropriate handling
  - GET `/api/waitlist/confirm/[valid-token]` → 302 redirect + status update
  - GET `/api/waitlist/confirm/[invalid-token]` → 404 error

### End-to-End Tests (Manual)
1. **Happy Path:**
   - User submits email → receives confirmation email → clicks link → sees success page → receives welcome email
2. **Duplicate Signup:**
   - User submits same email twice → receives resent confirmation
3. **Invalid Token:**
   - User accesses invalid confirmation URL → sees error page
4. **Already Confirmed:**
   - User clicks confirmation link twice → sees "already confirmed" message

### Email Deliverability Tests
- Test with multiple email providers (Gmail, Outlook, ProtonMail)
- Verify emails don't land in spam folder
- Check email rendering on mobile and desktop clients
- Validate all links work correctly

## Acceptance Criteria

1. **Database:**
   - ✅ Waitlist table exists in `kids_ascension_db` with all required fields
   - ✅ Unique constraints on email and token columns
   - ✅ Indexes on email, token, and status for query performance

2. **Email Templates:**
   - ✅ Shared email templates package exists at `shared/email-templates/`
   - ✅ Confirmation email template renders correctly with Kids Ascension branding
   - ✅ Welcome email template renders correctly with launch countdown
   - ✅ Templates are reusable (prepared for OL future use)

3. **API Endpoints:**
   - ✅ POST `/api/waitlist/subscribe` accepts email and creates pending entry
   - ✅ Confirmation email sent successfully via Resend
   - ✅ GET `/api/waitlist/confirm/[token]` verifies token and updates status
   - ✅ Welcome email sent after successful confirmation
   - ✅ All edge cases handled gracefully (duplicates, invalid tokens, etc.)

4. **Frontend:**
   - ✅ Landing page form connected to API with proper state management
   - ✅ Loading states shown during submission
   - ✅ Success/error messages displayed to user
   - ✅ Confirmation success page displays after email verification

5. **Email Deliverability:**
   - ✅ Confirmation emails delivered within 30 seconds
   - ✅ Welcome emails delivered within 30 seconds
   - ✅ Emails render correctly on major email clients
   - ✅ No emails flagged as spam

6. **Security:**
   - ✅ Tokens are cryptographically secure (32+ byte random values)
   - ✅ Email validation prevents injection attacks
   - ✅ Rate limiting prevents abuse (optional but recommended)
   - ✅ Environment variables properly secured (not committed to git)

7. **Code Quality:**
   - ✅ TypeScript types defined for all data structures
   - ✅ Error handling implemented throughout
   - ✅ Logging added for debugging and monitoring
   - ✅ Code follows existing project conventions

## Validation Commands

Execute these commands to validate the implementation:

### 1. Database Schema Validation
```bash
# Check Prisma schema is valid
pnpm --filter @ka/web prisma validate

# Generate Prisma client
pnpm --filter @ka/web prisma generate

# Push schema to database
pnpm --filter @ka/web db:push

# Verify table exists in database
psql postgresql://postgres:PASSWORD@localhost:5432/kids-ascension-db -c "\d waitlist"
```

### 2. Dependencies Installation Check
```bash
# Verify Resend is installed
pnpm --filter @ka/web list | grep resend

# Verify React Email is installed in shared templates
pnpm --filter @shared/email-templates list | grep react-email

# Check for missing dependencies
pnpm install
```

### 3. TypeScript Compilation
```bash
# Check for TypeScript errors
pnpm --filter @ka/web typecheck

# Build the project
pnpm --filter @ka/web build
```

### 4. Email Template Rendering Test
```bash
# Build email templates (if separate build step exists)
cd shared/email-templates && pnpm build

# Preview email templates (if React Email CLI is set up)
pnpm --filter @shared/email-templates email dev
```

### 5. Start Development Server
```bash
# Start Kids Ascension frontend
pnpm --filter @ka/web dev

# Verify server is running
curl http://localhost:3000/api/waitlist/subscribe -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

### 6. Database Query Tests
```bash
# Check if waitlist entry was created
psql postgresql://postgres:PASSWORD@localhost:5432/kids-ascension-db -c "SELECT * FROM waitlist WHERE email = 'test@example.com';"

# Check waitlist count
psql postgresql://postgres:PASSWORD@localhost:5432/kids-ascension-db -c "SELECT status, COUNT(*) FROM waitlist GROUP BY status;"
```

### 7. API Endpoint Tests
```bash
# Test subscribe endpoint
curl -X POST http://localhost:3000/api/waitlist/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com"}'

# Test confirmation endpoint (replace TOKEN with actual token from database)
curl -X GET http://localhost:3000/api/waitlist/confirm/TOKEN -L
```

### 8. Email Deliverability Test
```bash
# Use Resend dashboard to check email logs
# Navigate to: https://resend.com/emails

# Check for errors in email sending
grep -r "email error" apps/kids-ascension/frontend/.next/
```

### 9. End-to-End Flow Test (Manual)
1. Open browser to `http://localhost:3000`
2. Enter valid email address in waitlist form
3. Click "Benachrichtige mich" button
4. Verify success message appears
5. Check email inbox for confirmation email
6. Click confirmation link in email
7. Verify redirect to success page at `/waitlist/confirmed`
8. Check email inbox for welcome email
9. Query database to confirm status changed to CONFIRMED

### 10. Code Quality Checks
```bash
# Run linter
pnpm --filter @ka/web lint

# Check for security vulnerabilities
pnpm audit
```

## Notes

### Environment Variables Required
Add these to `.env` file:
```bash
# Resend API Key (obtain from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Kids Ascension Database URL (should already exist)
DATABASE_URL_KA=postgresql://postgres:PASSWORD@localhost:5432/kids-ascension-db

# Base URL for email links (adjust for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_BASE_URL=https://kids-ascension.dev  # Production
```

### Resend Configuration
1. Sign up for Resend account: https://resend.com
2. Verify domain (kids-ascension.dev) for production
3. Use `onboarding@resend.dev` sender for development/testing
4. Production sender: `noreply@kids-ascension.dev` (after domain verification)
5. Monitor email logs in Resend dashboard

### Future Migration to MCP Gateway
When Ozean Licht needs email functionality, extract to MCP Gateway:

**Migration Path:**
1. Create `tools/mcp-gateway/src/services/resend/handler.ts`
2. Move email sending logic from `lib/email/` to MCP handler
3. Update KA frontend to use MCP client instead of direct Resend
4. Both platforms use centralized MCP email service
5. Templates remain in `shared/email-templates/` (already positioned correctly)

**Code Change:**
```typescript
// Before (Direct)
import { resend } from '@/lib/email/resend-client'
await resend.emails.send({...})

// After (MCP Gateway)
import { mcpClient } from '@/lib/mcp-client'
await mcpClient.callTool('resend', 'send', {...})
```

### Long-Term Newsletter Strategy: Listmonk
For full-featured newsletter management across both platforms:

**Why Listmonk:**
- Self-hosted (aligns with ecosystem infrastructure philosophy)
- Open source and free
- Advanced features: segmentation, A/B testing, analytics
- Multi-list management (perfect for KA + OL)
- Template management and scheduling
- Import/export subscriber lists
- Runs on Docker (integrates with existing Coolify setup)

**Migration Timeline:**
1. **Phase 1 (Now):** Resend for simple transactional emails (waitlist confirmation, welcome emails)
2. **Phase 2 (Pre-Launch):** Continue using Resend for transactional, begin Listmonk evaluation
3. **Phase 3 (Post-Launch):** Deploy Listmonk to `newsletter.ozean-licht.dev` for:
   - Kids Ascension newsletter (educational content, feature updates)
   - Ozean Licht newsletter (course announcements, community updates)
   - Migrate waitlist subscribers to Listmonk lists
   - Keep Resend for transactional emails (password resets, confirmations)

**Architecture:**
```
Resend (Transactional)     Listmonk (Marketing)
     ↓                            ↓
  - Waitlist confirm        - Weekly newsletter
  - Welcome emails          - Course announcements
  - Password resets         - Feature updates
  - Account emails          - Community highlights
```

**Deployment:**
- Add Listmonk to Coolify: `http://newsletter.ozean-licht.dev`
- PostgreSQL database: reuse existing multi-tenant setup
- MCP Gateway service: `mcp-listmonk` for API access
- Template migration: Move React Email templates to Listmonk

**Integration Points:**
- Export waitlist to Listmonk CSV import
- Sync user preferences between platforms
- Unified unsubscribe management
- Analytics dashboard in admin panel

### Email Template Customization
Email templates support:
- Dynamic content via props (name, confirmUrl, etc.)
- Kids Ascension branding (turquoise/blue colors)
- Responsive design for mobile/desktop
- Inline CSS for maximum compatibility

To customize:
1. Edit templates in `shared/email-templates/emails/`
2. Use React Email components from `@react-email/components`
3. Test rendering with `pnpm email dev` in templates directory
4. Reference React Email docs: https://react.email

### Rate Limiting (Optional Enhancement)
Consider implementing rate limiting if spam becomes an issue:
- **IP-based:** Max 5 signups per IP per hour
- **Email-based:** Max 3 confirmation resends per email per hour
- **CAPTCHA:** Add hCaptcha or reCAPTCHA for additional protection

Libraries:
- `@upstash/ratelimit` - Redis-based rate limiting
- `lru-cache` - In-memory rate limiting (development)

### Performance Considerations
- Email sending is async - don't block response
- Use database connection pooling (Prisma default)
- Add indexes on frequently queried columns (email, token, status)
- Consider queueing email sending for high volume (future enhancement)

### Analytics and Monitoring
- Track waitlist growth in database
- Monitor email delivery rates in Resend dashboard
- Log signup sources (referral tracking, UTM parameters)
- Set up alerts for email sending failures

### Kids Ascension Launch Date
- Target launch: March 1, 2026
- Current countdown displayed on landing page
- Waitlist will be notified 1 week before launch
- Consider automated email campaign closer to launch date

### Legal Considerations
- Add GDPR-compliant privacy notice to form
- Include unsubscribe link in all emails (future enhancement)
- Store minimal user data (email only for now)
- Document data retention policy

### Dependencies Added
```json
// apps/kids-ascension/frontend/package.json
{
  "dependencies": {
    "resend": "^4.0.0",
    "@shared/email-templates": "workspace:*"
  }
}

// shared/email-templates/package.json
{
  "dependencies": {
    "react-email": "^3.0.0",
    "@react-email/components": "^0.0.25"
  }
}
```

### Database Statistics Queries
Useful queries for monitoring waitlist growth:

```sql
-- Total signups by status
SELECT status, COUNT(*) FROM waitlist GROUP BY status;

-- Signups per day (last 7 days)
SELECT DATE(created_at) as date, COUNT(*)
FROM waitlist
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Confirmation rate
SELECT
  COUNT(*) FILTER (WHERE status = 'CONFIRMED') * 100.0 / COUNT(*) as confirmation_rate
FROM waitlist;

-- Recent unconfirmed signups (for follow-up)
SELECT email, created_at
FROM waitlist
WHERE status = 'PENDING'
AND created_at >= NOW() - INTERVAL '48 hours'
ORDER BY created_at DESC;
```
