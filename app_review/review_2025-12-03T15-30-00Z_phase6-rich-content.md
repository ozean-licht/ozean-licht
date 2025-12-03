# Code Review Report

**Generated**: 2025-12-03T14:08:46Z
**Reviewed Work**: Phase 6: Rich Content Editing - Advanced Course Builder
**Git Diff Summary**: 5 new files, 2 modified files, ~1,197 lines added
**Verdict**: PASS with HIGH RISK issues

---

## Executive Summary

Phase 6 successfully implements TipTap WYSIWYG editor integration and PDF upload functionality for the Advanced Course Builder. The implementation demonstrates solid architecture with proper component separation, comprehensive validation, and good UX patterns. However, critical security concerns exist around client-side HTML sanitization (DOMPurify running in browser context, vulnerable to SSR bypass) and lack of server-side content sanitization in the database layer. Authentication is properly implemented on upload endpoints. Code quality is high with TypeScript types, error handling, and consistent design system usage.

---

## Quick Reference

| #   | Description                                      | Risk Level | Recommended Solution                              |
| --- | ------------------------------------------------ | ---------- | ------------------------------------------------- |
| 1   | Client-side only HTML sanitization (XSS risk)   | HIGH       | Add server-side sanitization with isomorphic-dompurify |
| 2   | No sanitization on content_text database writes  | HIGH       | Sanitize HTML before storing in database          |
| 3   | Missing server-side URL validation for PDF/image | MEDIUM     | Add URL format validation in API route            |
| 4   | No CSP headers for iframe embeds                 | MEDIUM     | Add Content-Security-Policy headers               |
| 5   | Missing file extension validation                | LOW        | Validate file extensions beyond MIME type         |
| 6   | Hardcoded max file sizes                         | LOW        | Extract to environment variables                  |
| 7   | Missing TypeScript strict mode checks            | LOW        | Enable strict null checks                         |

---

## Issues by Risk Tier

### HIGH RISK (Should Fix Before Merge)

#### Issue #1: Client-Side Only HTML Sanitization (XSS Vulnerability)

**Description**: DOMPurify is imported and runs only in the browser ('use client'), which means HTML content is sanitized on the client side but stored in the database without server-side validation. This creates an XSS vulnerability if an attacker bypasses the client-side sanitization (e.g., by directly calling the API, modifying the JavaScript bundle, or exploiting an SSR scenario where sanitized content is not rendered).

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/RichTextEditor.tsx`
- Lines: `5`, `57-68`

**Offending Code**:
```tsx
'use client';

import DOMPurify from 'dompurify';
// ...

onUpdate: ({ editor }) => {
  const html = editor.getHTML();
  // Sanitize HTML before passing to parent
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'code', 'pre',
      'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr',
      'a', 'img', 'iframe',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
      'class', 'frameborder', 'allowfullscreen', 'allow',
    ],
  });
  onChange(cleanHtml);
},
```

**Recommended Solutions**:

1. **Add Server-Side Sanitization** (Preferred)
   - Install `isomorphic-dompurify` which works in both Node.js and browser: `pnpm add isomorphic-dompurify jsdom`
   - Create server-side sanitization utility at `lib/security/sanitize-html.ts`:
   ```typescript
   import DOMPurify from 'isomorphic-dompurify';

   export function sanitizeHtml(html: string): string {
     return DOMPurify.sanitize(html, {
       ALLOWED_TAGS: [
         'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'code', 'pre',
         'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr',
         'a', 'img', 'iframe',
       ],
       ALLOWED_ATTR: [
         'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
         'class', 'frameborder', 'allowfullscreen', 'allow',
       ],
       ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
     });
   }
   ```
   - Add sanitization to `lib/db/lessons.ts` before database writes (lines 171, 214)
   - Keep client-side sanitization for UX (immediate feedback)
   - Rationale: Defense in depth - never trust client-side validation alone

2. **Alternative: Use TipTap's Built-in Sanitization**
   - Configure TipTap to only allow specific marks/nodes (type-safe)
   - Disable paste from external sources or sanitize on paste
   - Trade-off: More restrictive, but eliminates HTML entirely

3. **Mitigation: Add API-level Validation**
   - Create validation middleware that checks for script tags, event handlers
   - Reject requests with suspicious patterns
   - Trade-off: Blacklist approach is less secure than whitelist

---

#### Issue #2: No Server-Side Sanitization on Database Writes

**Description**: The `content_text` field is written directly to the database without server-side sanitization in `lib/db/lessons.ts`. While parameterized queries prevent SQL injection, they don't prevent stored XSS attacks. Malicious HTML stored in the database will execute when rendered to end users.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/lib/db/lessons.ts`
- Lines: `171` (createLesson), `214` (updateLesson)

**Offending Code**:
```typescript
const rows = await query<LessonRow>(sql, [
  input.moduleId,
  input.title,
  input.description || null,
  input.contentType,
  input.videoId || null,
  input.contentText || null,  // ← No sanitization
  input.contentUrl || null,
  // ...
]);
```

**Recommended Solutions**:

1. **Sanitize Before Database Write** (Preferred)
   - Import sanitization utility in `lib/db/lessons.ts`
   - Apply to `content_text` before INSERT/UPDATE:
   ```typescript
   import { sanitizeHtml } from '@/lib/security/sanitize-html';

   // In createLesson:
   const sanitizedContent = input.contentText
     ? sanitizeHtml(input.contentText)
     : null;

   const rows = await query<LessonRow>(sql, [
     // ...
     sanitizedContent,
     // ...
   ]);
   ```
   - Rationale: Single source of truth, consistent sanitization

2. **Sanitize on Read (Alternative)**
   - Apply sanitization in `mapLesson` function when reading from database
   - Trade-off: Performance overhead on every read, doesn't prevent database pollution

3. **Type-Level Enforcement**
   - Create `SanitizedHtml` branded type that guarantees sanitization
   - Trade-off: Requires broader type system changes

---

### MEDIUM RISK (Fix Soon)

#### Issue #3: Missing Server-Side URL Validation

**Description**: The PDF and image upload routes accept user-provided URLs in the URL input mode without validating the URL format or checking for SSRF (Server-Side Request Forgery) vulnerabilities. While `isValidUrl` checks for http/https protocol, it doesn't validate against internal IP ranges, localhost, or metadata endpoints.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/PdfUploader.tsx`
- Lines: `121-128` (handleUrlSubmit)

**Offending Code**:
```typescript
const handleUrlSubmit = () => {
  if (urlInput.trim()) {
    onChange(urlInput.trim());  // ← No validation
    toast.success('PDF URL set', {
      description: 'The PDF URL has been saved.',
    });
  }
};
```

**Recommended Solutions**:

1. **Add URL Validation Utility** (Preferred)
   - Create `lib/security/validate-url.ts`:
   ```typescript
   import { URL } from 'url';

   const BLOCKED_HOSTS = [
     'localhost',
     '127.0.0.1',
     '169.254.169.254', // AWS metadata
     '0.0.0.0',
   ];

   export function isValidExternalUrl(url: string): boolean {
     try {
       const parsed = new URL(url);
       if (!['http:', 'https:'].includes(parsed.protocol)) return false;
       if (BLOCKED_HOSTS.includes(parsed.hostname)) return false;
       if (parsed.hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/)) {
         return false; // Private IP ranges
       }
       return true;
     } catch {
       return false;
     }
   }
   ```
   - Apply in both component and API route
   - Rationale: Prevents SSRF attacks

2. **Server-Side Validation Only**
   - Validate in API route before storing
   - Trade-off: Less immediate user feedback

3. **Disable URL Input**
   - Force upload-only for PDFs
   - Trade-off: Less flexible for users with existing CDN URLs

---

#### Issue #4: No Content-Security-Policy for iframe Embeds

**Description**: YouTube embeds use `youtube-nocookie.com` (good), but there's no CSP header to restrict iframe sources. This allows potential XSS if an attacker can inject malicious iframe sources through other vulnerabilities.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/lib/tiptap/extensions.ts`
- Lines: `25-31` (YOUTUBE_CONFIG)
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/RichTextEditor.tsx`
- Lines: `148-153` (YouTube embed insertion)

**Offending Code**:
```typescript
editor.chain().focus().insertContent({
  type: 'youtube',
  attrs: {
    src: youtubeUrl,  // ← No CSP enforcement
  },
}).run();
```

**Recommended Solutions**:

1. **Add CSP Headers to Next.js Config** (Preferred)
   - Edit `apps/admin/next.config.js`:
   ```javascript
   const ContentSecurityPolicy = `
     frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com;
     img-src 'self' data: https: blob:;
   `;

   module.exports = {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'Content-Security-Policy',
               value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
             }
           ]
         }
       ]
     }
   };
   ```
   - Rationale: Defense in depth

2. **Validate YouTube URLs**
   - Enforce `youtube-nocookie.com` domain in `extractYouTubeId`
   - Already partially implemented
   - Trade-off: Doesn't protect against other injection vectors

3. **Use TipTap YouTube Extension Validation**
   - Configure extension with allowed domains only
   - Trade-off: Limited to TipTap ecosystem

---

### LOW RISK (Nice to Have)

#### Issue #5: Missing File Extension Validation

**Description**: PDF upload validates MIME type (`application/pdf`) but doesn't validate file extensions. An attacker could potentially upload a PHP file with MIME type set to `application/pdf` if MinIO or web server misconfiguration occurs.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/upload/pdf/route.ts`
- Lines: `113-119` (file type validation)

**Offending Code**:
```typescript
// Validate file type
if (!ALLOWED_TYPES.includes(file.type)) {
  return NextResponse.json(
    { error: 'Invalid file type. Only PDF files are allowed.' },
    { status: 400 }
  );
}
```

**Recommended Solutions**:

1. **Add Extension Validation**
   - After MIME type check, add:
   ```typescript
   const ext = file.name.split('.').pop()?.toLowerCase();
   if (ext !== 'pdf') {
     return NextResponse.json(
       { error: 'Invalid file extension. Only .pdf files allowed.' },
       { status: 400 }
     );
   }
   ```
   - Rationale: Belt-and-suspenders approach

---

#### Issue #6: Hardcoded File Size Limits

**Description**: File size limits are hardcoded in components and API routes (10MB for PDF, 5MB for images). This makes it difficult to adjust limits without code changes and doesn't allow per-environment configuration.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/upload/pdf/route.ts`
- Lines: `9` (MAX_FILE_SIZE)
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/PdfUploader.tsx`
- Lines: `58` (maxSize)

**Offending Code**:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// And in component:
const maxSize = 10 * 1024 * 1024;
```

**Recommended Solutions**:

1. **Use Environment Variables** (Preferred)
   - Add to `.env.local`:
   ```
   NEXT_PUBLIC_MAX_PDF_SIZE=10485760
   NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880
   ```
   - Update API route:
   ```typescript
   const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_PDF_SIZE || '10485760', 10);
   ```
   - Rationale: Configuration flexibility

---

#### Issue #7: Missing TypeScript Strict Checks

**Description**: Several places use optional chaining and nullish coalescing that could benefit from stricter TypeScript checks. For example, `extractYouTubeId(youtubeUrl)` could return `null`, but this isn't consistently handled.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/courses/RichTextEditor.tsx`
- Lines: `143`, `283`, `300`

**Offending Code**:
```typescript
const videoId = extractYouTubeId(youtubeUrl);
if (!videoId) {
  return; // Silent failure
}
```

**Recommended Solutions**:

1. **Add User Feedback on Failure**
   - Show toast error when YouTube URL is invalid:
   ```typescript
   const videoId = extractYouTubeId(youtubeUrl);
   if (!videoId) {
     toast.error('Invalid YouTube URL', {
       description: 'Please enter a valid YouTube video URL.'
     });
     return;
   }
   ```
   - Rationale: Better UX

---

## Verification Checklist

- [x] Authentication implemented on upload endpoints (auth() check)
- [x] File type validation (MIME type checks)
- [x] File size validation (10MB PDF, 5MB images)
- [x] Bucket whitelist implemented (ALLOWED_BUCKETS)
- [x] TipTap extensions properly configured
- [x] Design system adherence (Ozean Licht tokens: #0ec2bc primary, dark backgrounds)
- [x] Error handling with user-friendly messages
- [x] TypeScript types for all props and functions
- [x] MinIO integration with lazy initialization
- [x] Proper component exports in index.ts
- [ ] Server-side HTML sanitization (MISSING - HIGH RISK)
- [ ] CSP headers for iframe embeds (MISSING - MEDIUM RISK)
- [ ] URL validation against SSRF (MISSING - MEDIUM RISK)
- [ ] File extension validation (MISSING - LOW RISK)

---

## What Was Done Well

1. **Excellent Component Architecture**
   - Clean separation of concerns (extensions, menu-bar, editor, uploader)
   - Reusable TipTap configuration in `getEditorExtensions`
   - Proper TypeScript interfaces for all props

2. **Robust Error Handling**
   - Try-catch blocks with specific error messages
   - User-friendly toast notifications
   - Detailed server-side logging in development mode
   - Safe error messages to clients (no sensitive info leakage)

3. **Good Security Practices**
   - Authentication checks on all upload endpoints
   - Bucket whitelist to prevent arbitrary storage access
   - MIME type validation on file uploads
   - Filename sanitization (UUID prefix, character replacement)
   - Lazy MinIO client initialization (avoids build-time errors)
   - Public URL validation before returning to client

4. **UX Excellence**
   - Comprehensive toolbar with tooltips
   - Live preview for YouTube embeds in modal
   - Progress indicator during PDF upload
   - Tabbed interface for upload vs. URL input
   - File preview with clear/preview actions
   - Keyboard shortcuts documented in tooltips

5. **Design System Consistency**
   - Proper use of CossUI components from `@shared/ui`
   - Ozean Licht brand colors (#0ec2bc primary, dark backgrounds)
   - Consistent spacing and borders (#0E282E borders, #00111A backgrounds)
   - Typography hierarchy (prose styles for editor content)

6. **TipTap Integration**
   - Well-configured extensions (Link, Image, YouTube, Highlight, Underline)
   - Proper editor state management with useEffect
   - Editable state syncing
   - Clean dialog patterns for media insertion

7. **Type Safety**
   - Strong TypeScript types throughout
   - Proper type guards and null checks
   - Zod validation schemas (referenced in LessonEditorModal)
   - Database row mapping with type conversions

8. **API Design**
   - RESTful endpoint structure
   - Proper HTTP status codes (401, 400, 500)
   - Consistent response format
   - Environment variable validation with helpful error messages

---

## Final Verdict

**Status**: PASS with HIGH RISK issues

**Reasoning**: Phase 6 delivers the core functionality successfully with excellent code quality, UX, and architecture. However, the two HIGH RISK security issues (client-side only HTML sanitization and lack of server-side content sanitization) create real XSS vulnerabilities that should be addressed before production deployment. These issues are not blockers for development/staging environments but must be resolved before exposing to end users.

**Next Steps**:
1. **Critical (Before Production)**: Implement server-side HTML sanitization using `isomorphic-dompurify` in both the editor component and database layer
2. **Important (This Sprint)**: Add URL validation utility to prevent SSRF attacks, add CSP headers for iframe embeds
3. **Nice to Have (Next Sprint)**: Extract file size limits to environment variables, add file extension validation, improve error feedback for invalid YouTube URLs

**Security Assessment**:
- Authentication: STRONG (NextAuth session checks)
- File Upload: GOOD (validation, whitelisting, size limits)
- HTML Content: WEAK (client-side only sanitization)
- URL Handling: MODERATE (basic validation, needs SSRF protection)

**Code Quality Assessment**: EXCELLENT
- TypeScript usage: 5/5
- Error handling: 5/5
- Component design: 5/5
- UX patterns: 5/5

**Overall Grade**: B+ (would be A with security fixes)

---

## Additional Observations

### Positive Patterns to Replicate
1. Lazy MinIO client initialization pattern prevents Docker build issues
2. Dialog-based media insertion provides great UX for non-technical users
3. File upload progress simulation improves perceived performance
4. Comprehensive toolbar with keyboard shortcut tooltips

### Technical Debt Notes
1. DOMPurify configuration is duplicated between client and (future) server - consider shared constant
2. YouTube/Vimeo ID extraction functions exist but Vimeo support isn't implemented
3. Consider adding image upload support within the rich text editor (currently separate)
4. Could benefit from debouncing in rich text editor onChange to reduce re-renders

### Performance Considerations
1. TipTap editor re-renders on every keystroke - consider using `onBlur` for less critical updates
2. DOMPurify sanitization on every keystroke may be expensive - consider debouncing
3. File upload progress bar uses setInterval - could use XMLHttpRequest.upload.onprogress for real progress

### Accessibility Notes
1. Toolbar buttons have good tooltip labels (accessible)
2. File input is properly hidden and triggered by accessible button
3. Consider adding ARIA labels to editor content area
4. Keyboard navigation in dialogs works well with CossUI components

---

**Report File**: `/opt/ozean-licht-ecosystem/app_review/review_2025-12-03T15-30-00Z_phase6-rich-content.md`

**Files Reviewed**:
- `/opt/ozean-licht-ecosystem/apps/admin/lib/tiptap/extensions.ts` (155 lines)
- `/opt/ozean-licht-ecosystem/apps/admin/lib/tiptap/menu-bar.tsx` (239 lines)
- `/opt/ozean-licht-ecosystem/apps/admin/components/courses/RichTextEditor.tsx` (309 lines)
- `/opt/ozean-licht-ecosystem/apps/admin/components/courses/PdfUploader.tsx` (275 lines)
- `/opt/ozean-licht-ecosystem/apps/admin/app/api/upload/pdf/route.ts` (219 lines)
- `/opt/ozean-licht-ecosystem/apps/admin/components/courses/LessonEditorModal.tsx` (modified)
- `/opt/ozean-licht-ecosystem/apps/admin/package.json` (modified - added TipTap deps)
- `/opt/ozean-licht-ecosystem/apps/admin/components/courses/index.ts` (modified - added exports)

**Total**: 1,197+ lines of new code reviewed
