# Code Review Report

**Generated**: 2025-12-05T22:18:33Z
**Reviewed Work**: Phase 10: Chat Widget (Customer-Facing) - Support Management System
**Git Diff Summary**: New untracked files - Widget SDK package (shared/widget/) + 5 API endpoints + Admin UI component
**Verdict**: FAIL

---

## Executive Summary

Phase 10 implements a comprehensive embeddable chat widget with real-time messaging, offline support, and HMAC authentication. The implementation demonstrates solid architectural patterns and type safety. However, **CRITICAL SECURITY BLOCKERS** prevent production deployment: wildcard CORS configuration exposes all widget endpoints to any domain, platform key validation is bypassed (MVP stub accepts any key), and session-based access control has logic gaps. Additionally, the widget bundle lacks Content Security Policy protection, and environment variable dependencies are undocumented.

---

## Quick Reference

| #   | Description                                                         | Risk Level | Recommended Solution                                  |
| --- | ------------------------------------------------------------------- | ---------- | ----------------------------------------------------- |
| 1   | Wildcard CORS on all widget endpoints                              | BLOCKER    | Implement domain whitelist from environment variable  |
| 2   | Platform key validation bypassed (MVP stub)                         | BLOCKER    | Implement database-backed key validation              |
| 3   | Session-based access control logic gaps                             | BLOCKER    | Fix conversation metadata session validation          |
| 4   | Missing environment variable documentation                          | HIGH       | Document all required env vars in README              |
| 5   | XSS risk in message content HTML stripping                          | HIGH       | Use DOMPurify library instead of regex                |
| 6   | HMAC secret not enforced as required                                | HIGH       | Make WIDGET_HMAC_SECRET mandatory in production       |
| 7   | Realtime channel name mismatch (private- vs public)                 | HIGH       | Fix channel naming convention or auth implementation  |
| 8   | No CSP headers for widget script delivery                           | MEDIUM     | Add CSP headers to widget.js endpoint                 |
| 9   | Error messages leak internal structure in dev mode                  | MEDIUM     | Remove detailed error messages in production builds   |
| 10  | Missing rate limiting on public endpoints                           | MEDIUM     | Implement rate limiting by session/IP                 |
| 11  | No validation of custom attributes size                             | MEDIUM     | Limit custom attributes to prevent DB bloat           |
| 12  | Attachment presigned URLs expire too quickly (5 min)                | MEDIUM     | Increase upload URL expiry to 15 minutes              |
| 13  | Session expiry hardcoded to 30 days                                 | LOW        | Make session expiry configurable                      |
| 14  | React bundled in widget increases size                              | LOW        | Consider Preact for smaller bundle size               |
| 15  | No analytics/telemetry for widget usage                             | LOW        | Add optional analytics hooks                          |
| 16  | Missing sourcemap configuration for debugging                       | LOW        | Configure sourcemap uploads to error tracking service |

---

## Issues by Risk Tier

### BLOCKER (Must Fix Before Merge)

#### Issue #1: Wildcard CORS Exposes All Widget Endpoints to XSS/CSRF

**Description**: All five widget API endpoints use `Access-Control-Allow-Origin: *`, allowing any website to make authenticated requests with stolen session IDs or platform keys. This creates a critical CSRF vulnerability where a malicious site can impersonate the widget and exfiltrate conversation data or send messages on behalf of users.

**Location**:
- Files:
  - `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/conversations/route.ts`
  - `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/conversations/[id]/messages/route.ts`
  - `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/identify/route.ts`
  - `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/attachments/upload/route.ts`
  - `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/attachments/[fileId]/confirm/route.ts`
- Lines: Multiple instances (e.g., conversations/route.ts:487, messages/route.ts:123, identify/route.ts:27)

**Offending Code**:
```typescript
// conversations/route.ts:487
response.headers.set('Access-Control-Allow-Origin', '*'); // TODO: Configure allowed origins

// All endpoints use similar pattern
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // TODO: Restrict to specific domains in production
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Widget-Platform-Key, X-Widget-Session-Id',
};
```

**Recommended Solutions**:
1. **Environment Variable Whitelist** (Preferred)
   - Create `WIDGET_ALLOWED_ORIGINS` environment variable with comma-separated domains
   - Implement origin validation function that checks request Origin header against whitelist
   - Return matching origin in `Access-Control-Allow-Origin` header (never `*`)
   - Example implementation:
   ```typescript
   function getCORSHeaders(origin: string | null): HeadersInit {
     const allowedOrigins = process.env.WIDGET_ALLOWED_ORIGINS?.split(',') || [];
     const isAllowed = origin && allowedOrigins.includes(origin);

     return {
       'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type, X-Widget-Platform-Key, X-Widget-Session-Id',
       'Access-Control-Allow-Credentials': 'false',
     };
   }
   ```
   - Rationale: Industry standard, flexible per environment, prevents CSRF

2. **Database-Backed Origin Whitelist** (Alternative for multi-tenant)
   - Store allowed origins in `widget_platform_keys` table alongside platform keys
   - Cache in memory/Redis for performance
   - Trade-off: More complex but allows per-customer origin control

---

#### Issue #2: Platform Key Validation Bypassed - MVP Stub Accepts Any Key

**Description**: The `validatePlatformKey()` function in conversations endpoint is a no-op that accepts ANY non-empty string, completely bypassing authentication. This allows anyone to create conversations and send messages by simply providing any random string as `X-Widget-Platform-Key`.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/conversations/route.ts`
- Lines: 184-189

**Offending Code**:
```typescript
function validatePlatformKey(platformKey: string): boolean {
  // MVP: Accept any non-empty key
  // TODO: Query database for valid platform keys
  // const validKeys = await query('SELECT key FROM widget_platform_keys WHERE active = true');
  return platformKey.length > 0;
}
```

**Recommended Solutions**:
1. **Environment Variable Validation** (Preferred for immediate fix)
   - Check against `WIDGET_PLATFORM_KEY_OZEAN_LICHT` and `WIDGET_PLATFORM_KEY_KIDS_ASCENSION` env vars
   - Same pattern already used in `attachments/upload/route.ts` (lines 56-64)
   - Example:
   ```typescript
   function validatePlatformKey(platformKey: string): boolean {
     const validKeys = [
       process.env.WIDGET_PLATFORM_KEY_OZEAN_LICHT,
       process.env.WIDGET_PLATFORM_KEY_KIDS_ASCENSION,
     ].filter(Boolean);

     return validKeys.includes(platformKey);
   }
   ```
   - Rationale: Simple, consistent with other endpoints, no DB queries

2. **Database-Backed Validation** (Long-term solution)
   - Create `widget_platform_keys` table with columns: `key`, `platform`, `active`, `created_at`
   - Implement caching layer (Redis/in-memory) to avoid DB hit on every request
   - Validate key exists AND is active
   - Trade-off: More robust, allows key rotation, but adds DB dependency

3. **Hybrid Approach** (Recommended for production)
   - Use env vars for validation + add rate limiting by platform key
   - Store usage metrics in database for monitoring/billing
   - Rationale: Security without performance penalty

---

#### Issue #3: Session-Based Access Control Has Logic Gaps

**Description**: Multiple access control vulnerabilities exist in session validation:
1. `conversations/route.ts` does NOT check session when retrieving conversations - only verifies conversation exists via `verifyContactAccess()` which checks if contact's sessionId matches, but doesn't validate the request header sessionId
2. `attachments/upload/route.ts` and `confirm/route.ts` check `conversation.metadata.sessionId` but conversation creation doesn't set this metadata field
3. `messages/route.ts` has incomplete session validation - checks conversation type but metadata.sessionId check can be bypassed if metadata is null

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/conversations/route.ts`
- Lines: 387-403 (verifyContactAccess function)
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/attachments/upload/route.ts`
- Lines: 263-271 (metadata sessionId check)
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/conversations/[id]/messages/route.ts`
- Lines: 210-246 (verifySessionAccess function)

**Offending Code**:
```typescript
// conversations/route.ts:387 - Doesn't validate request sessionId matches conversation
async function verifyContactAccess(conversationId: string, sessionId: string): Promise<boolean> {
  const sql = `
    SELECT EXISTS (
      SELECT 1
      FROM conversations c
      JOIN contacts ct ON c.contact_id = ct.id
      WHERE c.id = $1
        AND ct.custom_attributes->>'sessionId' = $2
    ) as has_access
  `;
  const rows = await query<{ has_access: boolean }>(sql, [conversationId, sessionId]);
  return rows.length > 0 && rows[0].has_access;
}

// attachments/upload/route.ts:263 - Assumes metadata.sessionId exists
const conversationSessionId = conversation.metadata?.sessionId;
if (conversationSessionId !== sessionId) {
  return NextResponse.json(
    { error: 'You do not have access to this conversation' },
    { status: 403, headers: CORS_HEADERS }
  );
}

// Conversation creation NEVER sets metadata.sessionId!
// conversations/route.ts:322-355 - Creates conversation with metadata: '{}'
```

**Recommended Solutions**:
1. **Fix Conversation Creation Metadata** (Critical first step)
   - Update `createSupportConversation()` to accept sessionId parameter
   - Store sessionId in metadata: `metadata: { sessionId }`
   - Example:
   ```typescript
   async function createSupportConversation(
     contactId: string,
     sessionId: string, // ADD THIS
     contactEmail?: string,
     contactName?: string,
     platform: Platform = 'ozean_licht'
   ): Promise<DBConversation> {
     const sql = `
       INSERT INTO conversations (
         type, status, platform, contact_id, contact_email, contact_name,
         channel, priority, metadata
       ) VALUES (
         'support', 'open', $1, $2, $3, $4, 'web_widget', 'normal', $5::jsonb
       )
       RETURNING *
     `;

     const rows = await query<DBConversation>(sql, [
       platform, contactId, contactEmail || null, contactName || null,
       JSON.stringify({ sessionId }) // FIX THIS
     ]);

     return rows[0];
   }
   ```
   - Rationale: Root cause fix that enables all other access controls

2. **Standardize Access Validation Across All Endpoints**
   - Create shared `verifyWidgetAccess(conversationId, sessionId)` helper
   - Use in all widget endpoints consistently
   - Check both conversation.type === 'support' AND metadata.sessionId === sessionId
   - Fail-safe: deny access if metadata missing
   - Rationale: Single source of truth prevents inconsistencies

3. **Add Paranoid Mode Validation**
   - In addition to metadata check, verify contact.custom_attributes.sessionId matches
   - Log mismatches for security monitoring
   - Trade-off: Double-check at cost of extra query, but catches data inconsistencies

---

### HIGH RISK (Should Fix Before Merge)

#### Issue #4: Missing Environment Variable Documentation

**Description**: Phase 10 introduces 3+ critical environment variables (`WIDGET_PLATFORM_KEY_OZEAN_LICHT`, `WIDGET_PLATFORM_KEY_KIDS_ASCENSION`, `WIDGET_HMAC_SECRET`) but they are not documented in any README or .env.example file. This will cause deployment failures and make the feature unusable until developers discover the undocumented requirements.

**Location**:
- Files:
  - `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/attachments/upload/route.ts` (lines 56-64)
  - `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/identify/route.ts` (line 22-23)
- No documentation found in: `apps/admin/.env.example`, `apps/admin/README.md`, `shared/widget/README.md`

**Offending Code**:
```typescript
// attachments/upload/route.ts:56-64
for (const platform of validPlatforms) {
  const envKey = `WIDGET_PLATFORM_KEY_${platform.toUpperCase()}`;
  const expectedKey = process.env[envKey]; // No fallback, no validation

  if (expectedKey && platformKey === expectedKey) {
    validPlatform = platform;
    break;
  }
}

// identify/route.ts:22-23
const WIDGET_PLATFORM_KEY = process.env.WIDGET_PLATFORM_KEY; // Optional?
const WIDGET_HMAC_SECRET = process.env.WIDGET_HMAC_SECRET; // Optional but security-critical
```

**Recommended Solutions**:
1. **Create Documentation in apps/admin/.env.example** (Preferred)
   - Add commented examples with clear descriptions
   ```bash
   # Widget Platform Authentication Keys
   # Generate with: openssl rand -hex 32
   WIDGET_PLATFORM_KEY_OZEAN_LICHT=your_secret_key_here_min_32_chars
   WIDGET_PLATFORM_KEY_KIDS_ASCENSION=your_secret_key_here_min_32_chars

   # Widget HMAC Secret for User Identity Verification (REQUIRED for production)
   # Generate with: openssl rand -hex 32
   WIDGET_HMAC_SECRET=your_hmac_secret_here_min_32_chars

   # Widget CORS Allowed Origins (comma-separated, required for production)
   WIDGET_ALLOWED_ORIGINS=https://ozean-licht.at,https://kids-ascension.com
   ```
   - Rationale: Standard practice, prevents deployment issues

2. **Add Runtime Validation on Startup**
   - Create validation script that checks required env vars exist
   - Log warnings for missing optional vars
   - Fail fast with clear error messages
   - Example:
   ```typescript
   // apps/admin/lib/config/widget-validation.ts
   export function validateWidgetConfig() {
     const required = [
       'WIDGET_PLATFORM_KEY_OZEAN_LICHT',
       'WIDGET_PLATFORM_KEY_KIDS_ASCENSION',
     ];

     const missing = required.filter(key => !process.env[key]);

     if (missing.length > 0) {
       throw new Error(`Missing required widget env vars: ${missing.join(', ')}`);
     }

     if (!process.env.WIDGET_HMAC_SECRET && process.env.NODE_ENV === 'production') {
       console.warn('WARNING: WIDGET_HMAC_SECRET not set - user identification will be insecure');
     }
   }
   ```
   - Rationale: Catches config errors before production deployment

---

#### Issue #5: XSS Risk in Message Content HTML Stripping via Regex

**Description**: Message content sanitization uses a naive regex `content.replace(/<[^>]*>/g, '')` which is vulnerable to bypass via malformed HTML tags, encoded entities, and JavaScript protocol handlers. Attackers can craft payloads like `<img src=x onerror=alert(1)>` or `<svg/onload=alert(1)>` that may bypass the regex depending on rendering context.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/conversations/[id]/messages/route.ts`
- Line: 476

**Offending Code**:
```typescript
// Sanitize content - strip HTML tags to prevent XSS
const sanitizedContent = content ? content.replace(/<[^>]*>/g, '') : null;
```

**Recommended Solutions**:
1. **Use DOMPurify Library** (Preferred)
   - Install: `npm install isomorphic-dompurify`
   - Sanitize with strict whitelist (no HTML allowed):
   ```typescript
   import DOMPurify from 'isomorphic-dompurify';

   const sanitizedContent = content
     ? DOMPurify.sanitize(content, {
         ALLOWED_TAGS: [], // No HTML tags allowed
         ALLOWED_ATTR: [],
         KEEP_CONTENT: true // Keep text content
       })
     : null;
   ```
   - Rationale: Industry-standard library, handles edge cases, actively maintained

2. **Plain Text Extraction** (Alternative)
   - Convert to DOM, extract text content only:
   ```typescript
   import { JSDOM } from 'jsdom';

   const sanitizedContent = content
     ? new JSDOM(content).window.document.body.textContent || ''
     : null;
   ```
   - Trade-off: Heavier dependency but 100% safe

3. **Escape Instead of Strip** (Simplest)
   - HTML-encode all special characters:
   ```typescript
   const sanitizedContent = content
     ? content
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#x27;')
     : null;
   ```
   - Rationale: Simple, no dependencies, preserves original content

---

#### Issue #6: HMAC Secret Not Enforced as Required in Production

**Description**: The `WIDGET_HMAC_SECRET` environment variable is optional, and identity verification silently skips HMAC validation if the secret is not configured. This means user identity can be spoofed in production if admins forget to set the variable. The identify endpoint should REQUIRE HMAC in production environments.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/identify/route.ts`
- Lines: 22-23, 248-262

**Offending Code**:
```typescript
// Line 22-23 - Optional secret
const WIDGET_HMAC_SECRET = process.env.WIDGET_HMAC_SECRET;

// Lines 248-262 - Conditional validation (skips if secret missing)
if (hmac && WIDGET_HMAC_SECRET) {
  const expectedHmac = generateHmac(email, WIDGET_HMAC_SECRET);
  if (hmac !== expectedHmac) {
    // ... reject
  }
}
// If no HMAC_SECRET, validation is skipped entirely!
```

**Recommended Solutions**:
1. **Make HMAC Required in Production** (Preferred)
   ```typescript
   const WIDGET_HMAC_SECRET = process.env.WIDGET_HMAC_SECRET;

   // Validate on startup (in middleware or route)
   if (process.env.NODE_ENV === 'production' && !WIDGET_HMAC_SECRET) {
     throw new Error('WIDGET_HMAC_SECRET is required in production');
   }

   // In POST handler - require HMAC in production
   if (process.env.NODE_ENV === 'production') {
     if (!hmac) {
       return NextResponse.json(
         { error: 'HMAC is required for user identification' },
         { status: 400, headers: CORS_HEADERS }
       );
     }

     if (!WIDGET_HMAC_SECRET) {
       console.error('CRITICAL: WIDGET_HMAC_SECRET not configured');
       return NextResponse.json(
         { error: 'Server configuration error' },
         { status: 500, headers: CORS_HEADERS }
       );
     }
   }
   ```
   - Rationale: Prevents identity spoofing in production

2. **Add Warning for Anonymous Identification**
   - Log security warning when HMAC not provided:
   ```typescript
   if (!hmac) {
     console.warn('[Widget Identify] Anonymous identification without HMAC', {
       email,
       sessionId,
       environment: process.env.NODE_ENV,
     });
   }
   ```
   - Rationale: Visibility into security posture

---

#### Issue #7: Realtime Channel Name Mismatch - Private vs Public Channels

**Description**: The RealtimeClient subscribes to `private-widget-conversation-{id}` channels but these are private channels in Pusher/Soketi that require authentication. The widget has no authorization endpoint to generate channel auth signatures, which means real-time messages will not be received. Either the channel should be public (`widget-conversation-{id}`) or a `/api/widget/pusher/auth` endpoint must be implemented.

**Location**:
- File: `/opt/ozean-licht-ecosystem/shared/widget/src/realtime.ts`
- Lines: 196, 205

**Offending Code**:
```typescript
// Line 196
const channelName = `private-widget-conversation-${conversationId}`;

// Line 205 - Subscribes to private channel without auth
const channel = this.pusher.subscribe(channelName);
// This will FAIL because private- channels require authorization
```

**Recommended Solutions**:
1. **Change to Public Channel** (Preferred for widget use case)
   ```typescript
   // Use public channel name (no private- prefix)
   const channelName = `widget-conversation-${conversationId}`;

   // Pusher will allow subscription without auth
   const channel = this.pusher.subscribe(channelName);
   ```
   - Update backend Soketi trigger to use matching channel name
   - Rationale: Simpler, no auth endpoint needed, widget conversations are public to participants

2. **Implement Pusher Auth Endpoint** (If privacy required)
   - Create `/api/widget/pusher/auth` endpoint
   - Validate session has access to conversation
   - Return Pusher auth signature:
   ```typescript
   // apps/admin/app/api/widget/pusher/auth/route.ts
   export async function POST(req: NextRequest) {
     const { socket_id, channel_name } = await req.json();
     const sessionId = req.headers.get('X-Widget-Session-Id');

     // Extract conversation ID from channel name
     const conversationId = channel_name.replace('private-widget-conversation-', '');

     // Verify access
     const hasAccess = await verifySessionAccess(conversationId, sessionId);
     if (!hasAccess) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
     }

     // Generate auth signature
     const pusher = new Pusher({ /* config */ });
     const auth = pusher.authenticate(socket_id, channel_name);

     return NextResponse.json(auth);
   }
   ```
   - Configure Pusher client with authEndpoint
   - Trade-off: More secure but adds complexity

---

### MEDIUM RISK (Fix Soon)

#### Issue #8: No CSP Headers for Widget Script Delivery

**Description**: The widget JavaScript bundle is served without Content-Security-Policy headers, making it vulnerable to tampering if the CDN is compromised. Additionally, the embed code in `WidgetEmbedGenerator.tsx` doesn't include subresource integrity (SRI) hashes.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/support/WidgetEmbedGenerator.tsx`
- Lines: 65-80 (generateEmbedCode function)

**Offending Code**:
```typescript
const generateEmbedCode = (): string => {
  return `<script>
  (function(w,d,s,o,f,js,fjs){
    // ... loader code ...
    js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  })(window,document,'script','ozeanSupport','https://admin.ozean-licht.at/widget.js');
  // No integrity attribute!
</script>`;
};
```

**Recommended Solutions**:
1. **Add SRI Integrity Hashes to Embed Code**
   - Generate SRI hash during build: `openssl dgst -sha384 -binary widget.js | openssl base64 -A`
   - Update embed code:
   ```typescript
   js.src=f;
   js.integrity='sha384-<HASH_HERE>';
   js.crossOrigin='anonymous';
   ```
   - Store hash in environment variable or fetch from API
   - Rationale: Prevents tampered widget from executing

2. **Serve Widget with CSP Headers**
   - Create Next.js middleware or API route to serve widget.js with CSP:
   ```typescript
   // apps/admin/middleware.ts
   export function middleware(request: NextRequest) {
     if (request.nextUrl.pathname === '/widget.js') {
       const response = NextResponse.next();
       response.headers.set(
         'Content-Security-Policy',
         "default-src 'self'; script-src 'self'; connect-src 'self' https://admin.ozean-licht.at https://realtime.ozean-licht.dev"
       );
       return response;
     }
   }
   ```
   - Rationale: Defense in depth

---

#### Issue #9: Error Messages Leak Internal Structure in Development Mode

**Description**: Multiple endpoints return detailed error messages including internal paths, database errors, and stack traces when `NODE_ENV=development`. While this is helpful for debugging, if development builds are accidentally deployed to production, it leaks sensitive information about the system architecture.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/attachments/upload/route.ts`
- Lines: 333-334

**Offending Code**:
```typescript
return NextResponse.json(
  {
    error: 'Failed to generate upload URL',
    details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
  },
  { status: 500, headers: CORS_HEADERS }
);
```

**Recommended Solutions**:
1. **Remove Development-Specific Error Details**
   ```typescript
   // Always use generic errors in public endpoints
   return NextResponse.json(
     { error: 'Failed to generate upload URL' },
     { status: 500, headers: CORS_HEADERS }
   );

   // Log detailed errors server-side only
   console.error('[Widget Upload API] Error:', error);
   ```
   - Rationale: Never trust NODE_ENV for security decisions

2. **Use Structured Error Codes**
   ```typescript
   return NextResponse.json(
     {
       error: 'Failed to generate upload URL',
       code: 'UPLOAD_URL_GENERATION_FAILED',
       // No details, but code allows client-side error handling
     },
     { status: 500, headers: CORS_HEADERS }
   );
   ```
   - Rationale: Client gets actionable error codes without leaking internals

---

#### Issue #10: Missing Rate Limiting on Public Widget Endpoints

**Description**: All five widget endpoints are publicly accessible with no rate limiting, allowing abuse scenarios: conversation flooding (create thousands of conversations), message spam (DOS via message creation), and attachment upload exhaustion (fill storage with junk files). An attacker can generate unlimited sessionIds to bypass per-session limits.

**Location**:
- Files: All `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/**/*.ts` endpoints
- No rate limiting middleware detected

**Recommended Solutions**:
1. **Implement Rate Limiting Middleware with upstash/ratelimit**
   ```typescript
   // lib/middleware/widget-rate-limit.ts
   import { Ratelimit } from '@upstash/ratelimit';
   import { Redis } from '@upstash/redis';

   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
     analytics: true,
   });

   export async function checkWidgetRateLimit(
     identifier: string, // sessionId or IP
   ): Promise<{ success: boolean }> {
     const { success } = await ratelimit.limit(identifier);
     return { success };
   }
   ```
   - Apply to each widget endpoint before processing
   - Use sessionId as identifier (with IP as fallback)
   - Rationale: Prevents abuse without blocking legitimate usage

2. **Different Limits Per Endpoint**
   - Conversations: 5 creates per hour per sessionId
   - Messages: 60 per minute per conversation
   - Attachments: 10 uploads per hour per sessionId
   - Rationale: Tailored limits match legitimate usage patterns

---

#### Issue #11: No Validation of Custom Attributes Size

**Description**: The `customAttributes` field accepts arbitrary JSON objects with no size limits. An attacker could send megabytes of data in this field, causing database bloat, memory exhaustion, and potential DOS. PostgreSQL JSONB columns have practical limits but will accept very large objects.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/conversations/route.ts`
- Lines: 564 (accepts customAttributes without validation)

**Offending Code**:
```typescript
const {
  contactEmail,
  contactName,
  platform = 'ozean_licht',
  customAttributes = {}, // No size validation!
} = body;

// Later passed directly to database
const contact = await findOrCreateContact(
  sessionId,
  contactEmail,
  contactName,
  platform,
  customAttributes // Could be gigabytes
);
```

**Recommended Solutions**:
1. **Add Size Limit Validation**
   ```typescript
   const MAX_CUSTOM_ATTRIBUTES_SIZE = 10 * 1024; // 10KB

   if (customAttributes) {
     const attributesSize = JSON.stringify(customAttributes).length;
     if (attributesSize > MAX_CUSTOM_ATTRIBUTES_SIZE) {
       return NextResponse.json(
         {
           error: 'Custom attributes too large',
           maxSize: MAX_CUSTOM_ATTRIBUTES_SIZE,
           provided: attributesSize
         },
         { status: 400, headers: CORS_HEADERS }
       );
     }
   }
   ```
   - Rationale: Prevents storage DOS

2. **Validate Attribute Structure**
   ```typescript
   // Only allow specific keys
   const ALLOWED_CUSTOM_KEYS = ['source', 'referrer', 'userAgent', 'language'];

   if (customAttributes) {
     const invalidKeys = Object.keys(customAttributes).filter(
       key => !ALLOWED_CUSTOM_KEYS.includes(key)
     );

     if (invalidKeys.length > 0) {
       return NextResponse.json(
         { error: 'Invalid custom attribute keys', invalidKeys },
         { status: 400, headers: CORS_HEADERS }
       );
     }
   }
   ```
   - Rationale: Strict whitelist prevents misuse

---

#### Issue #12: Attachment Presigned Upload URLs Expire Too Quickly

**Description**: Presigned upload URLs expire in 5 minutes (`ATTACHMENT_CONFIG.presignedUrls.uploadUrlExpiry`), which may be insufficient for users with slow connections or large files. If a user starts uploading a 20MB file on a 1Mbps connection (would take ~3 minutes), they might encounter URL expiry errors mid-upload.

**Location**:
- File: `/opt/ozean-licht-ecosystem/lib/storage/messaging-config.ts` (inferred from usage)
- Referenced in: `/opt/ozean-licht-ecosystem/apps/admin/app/api/widget/attachments/upload/route.ts` line 305

**Offending Code**:
```typescript
// Generate presigned URL (valid for 5 minutes)
const uploadUrl = await getSignedUrl(
  s3Client,
  putCommand,
  { expiresIn: ATTACHMENT_CONFIG.presignedUrls.uploadUrlExpiry } // 300 seconds
);
```

**Recommended Solutions**:
1. **Increase Expiry to 15 Minutes**
   ```typescript
   // messaging-config.ts
   presignedUrls: {
     uploadUrlExpiry: 900, // 15 minutes (was 300)
     downloadUrlExpiry: 3600, // 1 hour
   }
   ```
   - Rationale: Sufficient for slow connections, minimal security impact (URL is single-use)

2. **Implement Upload Resume/Refresh Endpoint**
   - Add `/api/widget/attachments/{fileId}/refresh-upload-url` endpoint
   - Client can request new presigned URL if first expires
   - Trade-off: More complex but handles edge cases

---

### LOW RISK (Nice to Have)

#### Issue #13: Session Expiry Hardcoded to 30 Days

**Description**: Widget session expiry is hardcoded to 30 days in `shared/widget/src/index.ts` line 221. Different platforms might want different retention policies (e.g., GDPR compliance may require shorter sessions, or long-term courses may want longer sessions).

**Location**:
- File: `/opt/ozean-licht-ecosystem/shared/widget/src/index.ts`
- Line: 221

**Offending Code**:
```typescript
const MAX_SESSION_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

if (age < MAX_SESSION_AGE && data.platform === config?.platform) {
  sessionId = data.sessionId || generateSessionId();
  conversationId = data.conversationId || null;
} else {
  sessionId = generateSessionId();
}
```

**Recommended Solutions**:
1. **Make Session Expiry Configurable in WidgetConfig**
   ```typescript
   // types.ts
   export interface WidgetConfig {
     // ... existing fields ...
     sessionExpiryDays?: number; // Default: 30
   }

   // index.ts
   function loadSessionData(): void {
     const sessionExpiryMs = (config?.sessionExpiryDays || 30) * 24 * 60 * 60 * 1000;

     if (age < sessionExpiryMs && data.platform === config?.platform) {
       // ... restore session
     }
   }
   ```
   - Rationale: Flexibility per deployment

---

#### Issue #14: React Bundled in Widget Increases Bundle Size

**Description**: The widget bundles full React (18.2.0) + ReactDOM, resulting in a larger JavaScript payload (~130KB+ minified+gzipped). For an embeddable widget that loads on every page, this impacts page load performance. Preact (3KB) provides the same API with 97% smaller size.

**Location**:
- File: `/opt/ozean-licht-ecosystem/shared/widget/package.json`
- Lines: 27-40 (React dependencies)

**Offending Code**:
```json
"dependencies": {
  "idb": "^8.0.0",
  "pusher-js": "^8.4.0-rc2"
},
"devDependencies": {
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "@vitejs/plugin-react": "^4.2.1",
  "react": "^18.2.0",  // ~100KB
  "react-dom": "^18.2.0" // ~30KB
}
```

**Recommended Solutions**:
1. **Switch to Preact with Compatibility Layer**
   ```bash
   npm install preact preact-compat
   npm uninstall react react-dom
   ```
   ```javascript
   // vite.config.ts
   export default defineConfig({
     resolve: {
       alias: {
         'react': 'preact/compat',
         'react-dom': 'preact/compat'
       }
     }
   });
   ```
   - Rationale: 3KB vs 130KB, same API, faster load

2. **Code Splitting** (Alternative)
   - Lazy load React components only when widget opens
   - Initial bundle is just launcher button
   - Trade-off: Complexity vs size savings

---

#### Issue #15: No Analytics/Telemetry for Widget Usage

**Description**: The widget has no built-in analytics hooks to track usage metrics like: widget loads, open/close events, messages sent, errors encountered, or conversion rates. These metrics are valuable for product optimization and customer success.

**Location**:
- File: `/opt/ozean-licht-ecosystem/shared/widget/src/index.ts`
- No analytics integration found

**Recommended Solutions**:
1. **Add Optional Analytics Hooks to WidgetConfig**
   ```typescript
   export interface WidgetConfig {
     // ... existing fields ...
     onEvent?: (event: WidgetEvent) => void;
   }

   // Usage in embed code:
   ozeanSupport('init', {
     platformKey: '...',
     onEvent: (event) => {
       // Customer can send to their analytics
       gtag('event', event.type, event.data);
     }
   });
   ```
   - Rationale: Privacy-friendly, customers control data

2. **Internal Telemetry Endpoint** (Alternative)
   - Create `/api/widget/telemetry` endpoint
   - Widget sends anonymous metrics
   - Opt-out via config flag
   - Trade-off: Centralized insights but privacy concerns

---

#### Issue #16: Missing Sourcemap Configuration for Production Debugging

**Description**: The Vite build generates sourcemaps (`sourcemap: true`) but there's no configuration to upload them to an error tracking service or restrict access. Sourcemaps in production can expose source code, but without them debugging is impossible.

**Location**:
- File: `/opt/ozean-licht-ecosystem/shared/widget/vite.config.ts`
- Line: 22

**Offending Code**:
```typescript
build: {
  // ...
  minify: 'terser',
  sourcemap: true, // Generates .map files but no upload/protection
}
```

**Recommended Solutions**:
1. **Upload Sourcemaps to Sentry/Rollbar, Don't Serve Publicly**
   ```typescript
   // vite.config.ts
   import { sentryVitePlugin } from '@sentry/vite-plugin';

   export default defineConfig({
     plugins: [
       react(),
       sentryVitePlugin({
         org: 'ozean-licht',
         project: 'widget',
         authToken: process.env.SENTRY_AUTH_TOKEN,
       }),
     ],
     build: {
       sourcemap: 'hidden', // Generate but don't reference in bundle
     }
   });
   ```
   - Rationale: Error tracking with source code security

2. **Separate Sourcemaps from Public Bundle**
   - Store .map files in private location
   - Only error tracking service has access
   - Trade-off: Requires infrastructure setup

---

## Verification Checklist

- [ ] All BLOCKER issues addressed
- [ ] CORS restricted to whitelisted domains
- [ ] Platform key validation implemented
- [ ] Session access control fixed with metadata
- [ ] Environment variables documented in .env.example
- [ ] XSS sanitization replaced with DOMPurify or HTML encoding
- [ ] HMAC required in production environment
- [ ] Realtime channel naming fixed (public vs private)
- [ ] Rate limiting implemented on public endpoints
- [ ] Custom attributes size validated
- [ ] Widget bundle built and tested in production mode
- [ ] Error messages sanitized for production
- [ ] Integration tests pass for widget flow
- [ ] Security audit completed

---

## Final Verdict

**Status**: FAIL

**Reasoning**: Phase 10 demonstrates excellent architectural design with comprehensive type safety, offline support, and real-time capabilities. However, **THREE CRITICAL SECURITY BLOCKERS** prevent production deployment:

1. **Wildcard CORS** (`Access-Control-Allow-Origin: *`) exposes all widget endpoints to CSRF attacks from any domain
2. **Platform key validation bypassed** - MVP stub accepts any string, allowing unauthorized access
3. **Session access control gaps** - conversation metadata doesn't store sessionId, breaking authorization

Additionally, **4 HIGH RISK issues** require attention: missing environment variable documentation will cause deployment failures, XSS sanitization via regex is vulnerable to bypasses, HMAC secret should be mandatory in production, and realtime channels have naming mismatches that break message delivery.

The implementation shows strong engineering practices (TypeScript types, error handling, offline queue, presigned URLs) but the security fundamentals must be hardened before merge.

**Next Steps**:
1. **IMMEDIATE (Blockers)**:
   - Implement CORS domain whitelist from `WIDGET_ALLOWED_ORIGINS` env var
   - Fix platform key validation to check against env vars (same pattern as attachments endpoint)
   - Update conversation creation to store sessionId in metadata and standardize access checks

2. **BEFORE MERGE (High Risk)**:
   - Document all environment variables in `apps/admin/.env.example`
   - Replace HTML regex stripping with DOMPurify or HTML encoding
   - Make WIDGET_HMAC_SECRET required when NODE_ENV=production
   - Fix realtime channel names (remove `private-` prefix or implement auth endpoint)

3. **POST-MERGE (Medium/Low)**:
   - Add rate limiting middleware
   - Implement CSP headers for widget.js delivery
   - Add bundle size optimization (consider Preact)
   - Set up sourcemap upload to error tracking service

---

**Report File**: `/opt/ozean-licht-ecosystem/app_review/review_2025-12-05T22-18-33Z_phase10-widget.md`
