# Code Review Report

**Generated**: 2025-12-04T14:30:00Z
**Reviewed Work**: Video Management System Phase 2 - Encoding Pipeline
**Git Diff Summary**: 7 files changed, 2083 insertions(+), 28 deletions(-)
**Verdict**: ⚠️ FAIL

---

## Executive Summary

Phase 2 implements a comprehensive video encoding pipeline with BullMQ job queue, FFmpeg HLS encoding, S3 upload, HMAC-secured webhooks, and retry logic with Telegram alerts. The implementation demonstrates solid architecture and attention to security, but contains **3 critical blockers** and **7 high-risk issues** that must be addressed before production deployment. Most issues relate to missing environment configuration, unguarded database access, and incomplete error handling paths.

---

## Quick Reference

| #   | Description                                       | Risk Level | Recommended Solution                             |
| --- | ------------------------------------------------- | ---------- | ------------------------------------------------ |
| 1   | Missing ENCODING_WEBHOOK_SECRET configuration     | BLOCKER    | Add to .env and validation checks                |
| 2   | Unvalidated database operations in webhook        | BLOCKER    | Add try-catch around database calls              |
| 3   | Missing job database CRUD functions               | BLOCKER    | Implement getEncodingJobById in encoding-jobs.ts |
| 4   | Missing auth check in encode trigger endpoint     | HIGH       | Add auth() check before hasPermission()          |
| 5   | Webhook URL not set when creating jobs            | HIGH       | Set webhookUrl in createEncodingJob call         |
| 6   | No rate limiting on webhook endpoint              | HIGH       | Add rate limiting middleware                     |
| 7   | Missing input validation for file URLs            | HIGH       | Validate URL schemes and domains                 |
| 8   | Potential path traversal in uploader              | HIGH       | Sanitize S3 keys before upload                   |
| 9   | Missing TypeScript strict mode                    | HIGH       | Enable strict mode in tsconfig.json              |
| 10  | No cleanup on worker crash                        | HIGH       | Add process.on('uncaughtException') cleanup      |
| 11  | Hard-coded CDN URL in VideoPlayer                 | MEDIUM     | Use environment variable                         |
| 12  | Missing progress polling API endpoint             | MEDIUM     | Add GET /api/videos/[id]/encoding endpoint       |
| 13  | No video duration limit                           | MEDIUM     | Add max duration validation (e.g., 4 hours)      |
| 14  | Inconsistent error logging                        | MEDIUM     | Standardize error logging format                 |
| 15  | Missing webhook retry mechanism                   | MEDIUM     | Add exponential backoff for webhook failures     |
| 16  | No S3 bucket validation                           | MEDIUM     | Verify bucket exists on startup                  |
| 17  | Missing .env.example for worker                   | LOW        | Create example env file                          |
| 18  | No monitoring/metrics endpoints                   | LOW        | Add Prometheus metrics                           |
| 19  | Hard-coded timeout values                         | LOW        | Move to config                                   |

---

## Issues by Risk Tier

### 🚨 BLOCKERS (Must Fix Before Merge)

#### Issue #1: Missing ENCODING_WEBHOOK_SECRET Configuration

**Description**: The webhook endpoint requires `ENCODING_WEBHOOK_SECRET` environment variable for HMAC signature verification, but this variable is not documented, validated, or set in the codebase. This will cause all webhook requests to fail with 500 errors on startup.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/encoding/webhook/route.ts`
- Lines: `42-46`

**Offending Code**:
```typescript
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.ENCODING_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error('ENCODING_WEBHOOK_SECRET environment variable not configured');
  }
```

**Recommended Solutions**:
1. **Add Environment Variable** (Preferred)
   - Add `ENCODING_WEBHOOK_SECRET` to root `.env` file
   - Document in `example.env` with note: "32+ character random string"
   - Generate using: `openssl rand -hex 32`
   - Rationale: Required for webhook security, must be shared between worker and API

2. **Add Startup Validation**
   - Add validation in `apps/admin/lib/env.ts` using Zod schema
   - Fail fast on startup if missing in production
   - Trade-off: More code but prevents runtime errors

3. **Create Configuration Documentation**
   - Add to `tools/encoding-worker/README.md`
   - Add to `specs/video-management-system.md` (already present at line 1015)
   - Trade-off: Documentation only, doesn't prevent misconfiguration

---

#### Issue #2: Unvalidated Database Operations in Webhook Handler

**Description**: The webhook handler calls multiple database functions (`getEncodingJobById`, `updateVideo`, `completeJob`, `failJob`) without proper error handling. If any database operation fails due to connection issues, constraint violations, or other errors, the webhook will return 500 but may leave the job in an inconsistent state.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/encoding/webhook/route.ts`
- Lines: `153-339`

**Offending Code**:
```typescript
// Step 4: Verify job exists
const job = await getEncodingJobById(payload.jobId);
if (!job) {
  // ... error handling
}

// No try-catch around database operations
await updateJobProgress(payload.jobId, payload.progress);

await completeJob(
  payload.jobId,
  payload.outputUrl,
  payload.renditions || [],
  payload.thumbnailUrls || []
);

await updateVideo(payload.videoId, videoUpdates);
```

**Recommended Solutions**:
1. **Wrap Database Calls in Try-Catch** (Preferred)
   - Add try-catch around each database operation group
   - Log errors with context (jobId, videoId, operation)
   - Return appropriate HTTP status codes (502 for DB errors, 500 for unknown)
   - Rationale: Prevents partial updates, provides better error visibility

2. **Use Database Transaction**
   - Wrap `completeJob` + `updateVideo` in a single transaction
   - Rollback both if either fails
   - Trade-off: Requires transaction support in `lib/db/index.ts`, more complex

3. **Implement Idempotency**
   - Check if job is already in final state before updating
   - Prevent duplicate processing of webhook callbacks
   - Trade-off: More complex logic, but safer for retries

---

#### Issue #3: Missing Job Database CRUD Functions

**Description**: The webhook handler imports and calls `getEncodingJobById()` from `@/lib/db/encoding-jobs`, but this function is not actually exported or implemented in that module. This will cause a runtime error on the first webhook callback.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/encoding/webhook/route.ts`
- Lines: `20-24`
- File: `/opt/ozean-licht-ecosystem/apps/admin/lib/db/encoding-jobs.ts`
- Lines: `1-398` (entire file)

**Offending Code**:
```typescript
// webhook/route.ts
import {
  updateJobProgress,
  completeJob,
  failJob,
  getEncodingJobById,  // ❌ Not exported from encoding-jobs.ts
} from '@/lib/db/encoding-jobs';

// Later used at line 153:
const job = await getEncodingJobById(payload.jobId);
```

**Recommended Solutions**:
1. **Implement getEncodingJobById** (Preferred)
   - Add to `lib/db/encoding-jobs.ts`:
   ```typescript
   export async function getEncodingJobById(jobId: string): Promise<EncodingJob | null> {
     const pool = await getPool();
     const result = await pool.query(
       `SELECT * FROM encoding_jobs WHERE id = $1`,
       [jobId]
     );
     return result.rows[0] || null;
   }
   ```
   - Rationale: Required for webhook validation, straightforward implementation

2. **Use getActiveJobForVideo as Workaround**
   - Change webhook to accept videoId instead of jobId
   - Lookup job by videoId using existing function
   - Trade-off: Breaks webhook contract, requires worker changes

3. **Remove Job Verification Step**
   - Trust that jobId in webhook is valid (already HMAC-verified)
   - Directly update job without verification
   - Trade-off: Less safe, but simpler (NOT RECOMMENDED)

---

### ⚠️ HIGH RISK (Should Fix Before Merge)

#### Issue #4: Missing auth() Check in Encode Trigger Endpoint

**Description**: The encode trigger endpoint calls `hasPermission()` before calling `auth()`, which will throw an error because `hasPermission()` expects a session object that doesn't exist yet. This is a critical auth bypass vulnerability.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/videos/[id]/encode/route.ts`
- Lines: `57-77`

**Offending Code**:
```typescript
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    // ❌ No auth() check here!

    // Permission check - requires content.write to trigger encoding
    if (!hasPermission(session, 'content.write')) {  // session is undefined!
      return NextResponse.json(
        { error: 'Forbidden: content.write permission required' },
        { status: 403 }
      );
    }
```

**Recommended Solutions**:
1. **Add auth() Check First** (Preferred)
   ```typescript
   // Get authenticated session
   const session = await auth();
   if (!session) {
     return NextResponse.json(
       { error: 'Unauthorized' },
       { status: 401 }
     );
   }

   // Permission check
   if (!hasPermission(session, 'content.write')) {
     // ... 403 error
   }
   ```
   - Rationale: Standard auth pattern, prevents bypass

---

#### Issue #5: Webhook URL Not Set When Creating Jobs

**Description**: The `createEncodingJob()` function in `lib/db/encoding-jobs.ts` does not accept or set a `webhookUrl` parameter, but the worker expects `job.data.webhookUrl` to send progress updates. This means no webhooks will be sent, and the admin UI will never receive updates.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/videos/[id]/encode/route.ts`
- Lines: `118-122`
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/src/index.ts`
- Lines: `185-186`

**Offending Code**:
```typescript
// 4. Create encoding job record in database
const job = await createEncodingJob({
  videoId,
  inputFileUrl,
  outputBucket: validated.outputBucket,
  // ❌ webhookUrl not set!
});

// Worker expects webhookUrl:
async function sendProgressWebhook(
  jobData: VideoEncodingJobData,
  progress: number
): Promise<void> {
  if (!webhookConfig.enabled || !jobData.webhookUrl) {  // Always undefined!
    return;
  }
  // ...
}
```

**Recommended Solutions**:
1. **Add webhookUrl to createEncodingJob** (Preferred)
   ```typescript
   const job = await createEncodingJob({
     videoId,
     inputFileUrl,
     outputBucket: validated.outputBucket,
     webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/encoding/webhook`,
   });
   ```
   - Update `lib/db/encoding-jobs.ts` to accept `webhookUrl` parameter
   - Store in database for job tracking
   - Rationale: Enables webhook callbacks, proper architecture

2. **Configure webhookUrl in Worker**
   - Set `WEBHOOK_URL` environment variable in `docker-compose.yml`
   - Worker constructs callback URL dynamically
   - Trade-off: Less flexible, worker needs to know admin URL

---

#### Issue #6: No Rate Limiting on Public Webhook Endpoint

**Description**: The webhook endpoint is public (no auth required) and only protected by HMAC signature. Without rate limiting, an attacker who obtains the webhook secret can flood the endpoint with valid requests, causing database load and potential DoS.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/app/api/encoding/webhook/route.ts`
- Lines: `79-340`

**Offending Code**:
```typescript
/**
 * POST /api/encoding/webhook
 * Receive and process encoding worker updates
 */
export async function POST(request: NextRequest) {
  // No rate limiting middleware
  try {
    // Signature verification (but no rate limit)
    // ...
```

**Recommended Solutions**:
1. **Add IP-Based Rate Limiting** (Preferred)
   - Use `@upstash/ratelimit` or similar
   - Limit to 100 requests per minute per IP
   - Return 429 Too Many Requests on limit
   - Rationale: Prevents abuse, standard practice for webhooks

2. **Add Job-Based Deduplication**
   - Track last update timestamp per jobId
   - Reject duplicate updates within 1 second
   - Trade-off: More complex, but prevents duplicate processing

3. **Add IP Whitelist**
   - Only accept webhooks from worker container IP
   - Requires Docker networking configuration
   - Trade-off: Brittle, requires infrastructure changes

---

#### Issue #7: Missing Input Validation for File URLs

**Description**: The encode trigger endpoint accepts arbitrary URLs in `inputFileUrl` without validation. An attacker could provide a `file://` URL, `localhost` URL, or internal network URL to trigger SSRF attacks or access internal resources.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/lib/validations/video.ts`
- Lines: `408-415`
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/src/encoder.ts`
- Lines: `164-258`

**Offending Code**:
```typescript
export const triggerEncodingSchema = z.object({
  inputFileUrl: z
    .string()
    .url('Please enter a valid input file URL')  // ❌ Only checks URL format, not content
    .optional(),
  // ...
});

// Worker downloads without validation:
const request = protocol.get(url, (response) => {
  // No check for localhost, internal IPs, file:// scheme
});
```

**Recommended Solutions**:
1. **Add URL Whitelist Validation** (Preferred)
   ```typescript
   inputFileUrl: z
     .string()
     .url()
     .refine(
       (url) => {
         const parsed = new URL(url);
         const allowedHosts = ['vimeo.com', 'cdn.bunnycdn.com', 'storage.hetzner.cloud'];
         const deniedPatterns = ['localhost', '127.0.0.1', '192.168.', '10.', '172.16.'];

         return allowedHosts.some(host => parsed.hostname.endsWith(host)) &&
                !deniedPatterns.some(pattern => parsed.hostname.includes(pattern));
       },
       { message: 'Input file URL must be from approved CDN' }
     )
     .optional(),
   ```
   - Rationale: Prevents SSRF, clear security boundary

2. **Add Protocol Whitelist**
   - Only allow `https://` URLs (no `http://`, `file://`, `ftp://`)
   - Rationale: Simpler but less strict

---

#### Issue #8: Potential Path Traversal in S3 Uploader

**Description**: The `uploadHLSOutput` function constructs S3 keys using `path.join()` with user-controlled input, which could allow path traversal attacks (e.g., `../../sensitive/data`) if `s3KeyPrefix` is not sanitized.

**Location**:
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/src/uploader.ts`
- Lines: `342`

**Offending Code**:
```typescript
const s3Key = path.join(s3KeyPrefix, file).replace(/\\/g, '/');
// If s3KeyPrefix = "../../secrets" and file = "config.json"
// Result: "../../secrets/config.json" (escapes intended directory)
```

**Recommended Solutions**:
1. **Sanitize S3 Key Prefix** (Preferred)
   ```typescript
   // In uploader.ts or encoder.ts
   function sanitizeS3Key(key: string): string {
     return key
       .replace(/\.\./g, '') // Remove ..
       .replace(/^\/+/, '')  // Remove leading slashes
       .replace(/\/+/g, '/')  // Normalize multiple slashes
       .replace(/[^a-zA-Z0-9/_-]/g, '_'); // Replace unsafe chars
   }

   const safePrefix = sanitizeS3Key(s3KeyPrefix);
   const s3Key = path.join(safePrefix, file).replace(/\\/g, '/');
   ```
   - Rationale: Defense in depth, prevents directory traversal

2. **Use UUID-Based Keys Only**
   - Always use `jobId` (UUID) as prefix
   - Never accept user-provided prefixes
   - Trade-off: Less flexible but safer

---

#### Issue #9: Missing TypeScript Strict Mode

**Description**: The encoding worker's `tsconfig.json` does not enable strict mode, which allows potentially unsafe code patterns like implicit `any`, unchecked nulls, and loose property checks to pass compilation.

**Location**:
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/tsconfig.json`
- Lines: Not present (strict mode not enabled)

**Offending Code**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    // ❌ "strict": true, is missing
  }
}
```

**Recommended Solutions**:
1. **Enable Strict Mode** (Preferred)
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true
     }
   }
   ```
   - Fix resulting type errors (likely ~10-20 errors)
   - Rationale: Catches bugs at compile time, industry standard

---

#### Issue #10: No Cleanup on Worker Crash

**Description**: The worker registers cleanup handlers for SIGTERM/SIGINT but not for uncaughtException/unhandledRejection. If the worker crashes, temporary files and partial uploads may be left behind, filling disk space over time.

**Location**:
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/src/index.ts`
- Lines: `768-778`

**Offending Code**:
```typescript
// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  logger.fatal({ error }, 'Uncaught exception');
  process.exit(1);  // ❌ No cleanup before exit
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal({ reason }, 'Unhandled promise rejection');
  process.exit(1);  // ❌ No cleanup before exit
});
```

**Recommended Solutions**:
1. **Add Cleanup Before Exit** (Preferred)
   ```typescript
   process.on('uncaughtException', async (error: Error) => {
     logger.fatal({ error }, 'Uncaught exception');
     try {
       await worker.close();
       await cleanupAllTempFiles(); // Implement this
     } catch (cleanupError) {
       logger.error({ cleanupError }, 'Cleanup failed');
     }
     process.exit(1);
   });
   ```
   - Rationale: Prevents disk space leaks, graceful shutdown

---

### ⚡ MEDIUM RISK (Fix Soon)

#### Issue #11: Hard-Coded CDN URL in VideoPlayer

**Description**: The VideoPlayer component uses hard-coded color values for the Ozean Licht brand (`#0ec2bc`, `#00111A`) instead of using Tailwind theme colors. If the brand colors change or the component is reused elsewhere, these will need manual updates.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/videos/VideoPlayer.tsx`
- Lines: `410, 418, 436`

**Offending Code**:
```typescript
<div className="relative w-full overflow-hidden rounded-lg bg-[#00111A]">
  <Loader2 className="w-10 h-10 text-[#0ec2bc] animate-spin" />
  <Button className="border-[#0ec2bc] text-[#0ec2bc] hover:bg-[#0ec2bc]">
```

**Recommended Solutions**:
1. **Use Tailwind Theme Colors**
   ```typescript
   <div className="relative w-full overflow-hidden rounded-lg bg-background">
     <Loader2 className="w-10 h-10 text-primary animate-spin" />
     <Button className="border-primary text-primary hover:bg-primary">
   ```
   - Define `primary: '#0ec2bc'` in `tailwind.config.ts`
   - Rationale: Maintainable, follows design system

---

#### Issue #12: Missing Progress Polling API Endpoint

**Description**: The `EncodingProgress` component attempts to poll `/api/videos/${videoId}/encoding` for job status updates (line 197), but this endpoint doesn't exist. The component will log errors every 3 seconds.

**Location**:
- File: `/opt/ozean-licht-ecosystem/apps/admin/components/videos/EncodingProgress.tsx`
- Lines: `197`

**Offending Code**:
```typescript
const response = await fetch(`/api/videos/${videoId}/encoding`);
// ❌ This endpoint doesn't exist
```

**Recommended Solutions**:
1. **Create GET /api/videos/[id]/encoding Endpoint**
   - Return current job status for video
   - Include progress, status, renditions
   - Rationale: Required for UI polling

---

#### Issue #13: No Video Duration Limit

**Description**: There is no validation on video duration before encoding. A malicious user could upload a 24-hour video, consuming excessive worker resources and S3 storage.

**Location**:
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/src/encoder.ts`
- Lines: `267-299` (getVideoDuration function)

**Offending Code**:
```typescript
export async function getVideoDuration(inputPath: string): Promise<number> {
  // ...
  resolve(duration);  // ❌ No check if duration is reasonable
}
```

**Recommended Solutions**:
1. **Add Duration Limit Validation**
   ```typescript
   const MAX_VIDEO_DURATION = 4 * 60 * 60; // 4 hours in seconds

   if (duration > MAX_VIDEO_DURATION) {
     throw new EncodingError(
       `Video duration ${duration}s exceeds maximum ${MAX_VIDEO_DURATION}s`,
       'VIDEO_TOO_LONG',
       false
     );
   }
   ```
   - Rationale: Prevents resource abuse, reasonable limit

---

#### Issue #14: Inconsistent Error Logging

**Description**: Error logging uses different formats across files: `console.log` in webhook, `logger.error` in worker, `console.error` in encoder. This makes it difficult to aggregate and analyze errors in production.

**Location**: Multiple files

**Recommended Solutions**:
1. **Standardize on Structured Logging**
   - Use `pino` logger everywhere (admin + worker)
   - Remove all `console.log`, `console.error` calls
   - Rationale: Better log aggregation, easier debugging

---

#### Issue #15: Missing Webhook Retry Mechanism

**Description**: The worker sends webhooks but does not retry if the admin API is temporarily unavailable (network error, API restart, etc.). Failed webhooks are silently logged, leading to jobs completing without database updates.

**Location**:
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/src/index.ts`
- Lines: `165-176`

**Offending Code**:
```typescript
} catch (error) {
  logger.error(
    {
      error: error instanceof Error ? error.message : String(error),
      jobId: payload.jobId,
      url,
    },
    'Failed to send webhook'
  );
  // Don't throw - webhook failures shouldn't fail the job
  // ❌ But also no retry, job will complete without DB update
}
```

**Recommended Solutions**:
1. **Add Exponential Backoff Retry**
   ```typescript
   const maxRetries = 3;
   const delays = [1000, 3000, 9000]; // 1s, 3s, 9s

   for (let attempt = 0; attempt < maxRetries; attempt++) {
     try {
       const response = await fetch(url, { ... });
       if (response.ok) return;
       throw new Error(`HTTP ${response.status}`);
     } catch (error) {
       if (attempt === maxRetries - 1) {
         logger.error('Webhook retry exhausted');
         return;
       }
       await sleep(delays[attempt]);
     }
   }
   ```
   - Rationale: Handles transient failures, improves reliability

---

#### Issue #16: No S3 Bucket Validation

**Description**: The worker tests S3 connection on startup but does not verify that the target bucket exists or is writable. Jobs will fail during upload phase after spending 10-60 minutes encoding.

**Location**:
- File: `/opt/ozean-licht-ecosystem/tools/encoding-worker/src/uploader.ts`
- Lines: `84-104`

**Offending Code**:
```typescript
export async function testS3Connection(): Promise<boolean> {
  try {
    const client = getS3Client();
    const command = new HeadBucketCommand({
      Bucket: storageConfig.bucket,
    });
    await client.send(command);
    // ✅ Tests bucket access
    return true;
  } catch (error) {
    // ❌ But doesn't test write permission
    return false;
  }
}
```

**Recommended Solutions**:
1. **Add Write Permission Test**
   ```typescript
   // After HeadBucketCommand:
   const testKey = `.health-check-${Date.now()}`;
   await uploadFile('/tmp/test.txt', testKey);
   await deleteObject(testKey);
   ```
   - Rationale: Catches permission errors early

---

### 💡 LOW RISK (Nice to Have)

#### Issue #17: Missing .env.example for Worker

**Description**: The encoding worker has no `.env.example` file documenting required environment variables. Developers will need to read the code or docker-compose to understand configuration.

**Location**: `/opt/ozean-licht-ecosystem/tools/encoding-worker/.env.example` (missing)

**Recommended Solutions**:
1. **Create .env.example File**
   - Copy all environment variables from `docker-compose.yml`
   - Add comments explaining each variable
   - Rationale: Improves developer experience

---

#### Issue #18: No Monitoring/Metrics Endpoints

**Description**: The worker has no metrics endpoints for monitoring job queue size, processing time, failure rates, etc. This makes it difficult to diagnose performance issues or capacity problems in production.

**Location**: Worker has no metrics

**Recommended Solutions**:
1. **Add Prometheus Metrics**
   - Use `prom-client` package
   - Expose metrics on port 9090
   - Track: jobs processed, failures, encoding duration, queue depth
   - Rationale: Production observability

---

#### Issue #19: Hard-Coded Timeout Values

**Description**: Several timeout values are hard-coded in the code instead of being configurable via environment variables (e.g., download timeout 5 minutes, webhook timeout 10 seconds).

**Location**: Multiple files

**Recommended Solutions**:
1. **Move Timeouts to Config**
   - Add to `config.ts`: `DOWNLOAD_TIMEOUT_MS`, `WEBHOOK_TIMEOUT_MS`
   - Use in encoder and webhook sender
   - Rationale: Easier tuning without code changes

---

## Verification Checklist

- [ ] All blockers addressed
- [ ] ENCODING_WEBHOOK_SECRET configured in .env
- [ ] getEncodingJobById implemented in lib/db/encoding-jobs.ts
- [ ] Database operations wrapped in try-catch in webhook handler
- [ ] auth() check added to encode trigger endpoint
- [ ] webhookUrl set when creating encoding jobs
- [ ] Input URL validation prevents SSRF attacks
- [ ] S3 key sanitization prevents path traversal
- [ ] High-risk issues reviewed and resolved or accepted
- [ ] Rate limiting added to webhook endpoint
- [ ] TypeScript strict mode enabled and errors fixed
- [ ] Worker cleanup handlers updated
- [ ] Progress polling endpoint implemented
- [ ] Video duration limits enforced
- [ ] Tests cover new functionality
- [ ] Documentation updated for API changes

---

## Final Verdict

**Status**: ⚠️ FAIL

**Reasoning**: The implementation demonstrates excellent architecture and attention to detail in many areas (HMAC signatures, retry logic, progress tracking, comprehensive error handling). However, there are **3 critical blockers** that will prevent the system from functioning correctly:

1. Missing `ENCODING_WEBHOOK_SECRET` configuration will cause webhooks to fail
2. Unimplemented `getEncodingJobById` function will cause runtime errors
3. Missing auth check creates a potential security vulnerability

Additionally, **7 high-risk issues** pose significant security and reliability concerns that should be addressed before production deployment.

**Next Steps**:

1. **Immediate (Blockers)**:
   - Add `ENCODING_WEBHOOK_SECRET` to `.env` and validate on startup
   - Implement `getEncodingJobById()` in `lib/db/encoding-jobs.ts`
   - Add proper try-catch error handling around database operations in webhook
   - Add `auth()` check before `hasPermission()` in encode endpoint

2. **Before Merge (High Risk)**:
   - Set `webhookUrl` when creating encoding jobs
   - Add rate limiting to webhook endpoint (use `@upstash/ratelimit`)
   - Add URL whitelist validation for `inputFileUrl` to prevent SSRF
   - Sanitize S3 key prefixes to prevent path traversal
   - Enable TypeScript strict mode and fix type errors
   - Add cleanup handlers for uncaught exceptions

3. **Post-Merge (Medium Risk)**:
   - Create GET `/api/videos/[id]/encoding` endpoint for polling
   - Add video duration limits (4-hour max)
   - Implement webhook retry with exponential backoff
   - Add S3 write permission test on startup
   - Standardize error logging across codebase

4. **Future Improvements (Low Risk)**:
   - Create `.env.example` for worker
   - Add Prometheus metrics for monitoring
   - Move hard-coded timeouts to configuration

---

**Report File**: `/opt/ozean-licht-ecosystem/app_review/review_2025-12-04T14-30-00Z_vms-phase2.md`
