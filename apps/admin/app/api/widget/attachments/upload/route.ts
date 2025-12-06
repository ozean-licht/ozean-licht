/**
 * Widget Attachment Upload API
 * POST /api/widget/attachments/upload
 *
 * Generates presigned upload URL for file attachments in widget conversations.
 * Validates widget headers for authentication instead of NextAuth session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ATTACHMENT_CONFIG, isAllowedMimeType } from '@/lib/storage/messaging-config';
import { getConversationById } from '@/lib/db/conversations';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { getWidgetCORSHeaders, validatePlatformKey } from '@/lib/widget/cors';

/**
 * Request body type
 */
interface UploadRequestBody {
  conversationId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Widget authentication validation
 * Validates X-Widget-Platform-Key and X-Widget-Session-Id headers
 *
 * @param request - Next.js request
 * @returns Validation result with platform and sessionId if valid
 */
async function validateWidgetAuth(
  request: NextRequest
): Promise<
  | { valid: true; platform: string; sessionId: string }
  | { valid: false; error: string }
> {
  // Extract headers
  const platformKey = request.headers.get('X-Widget-Platform-Key');
  const sessionId = request.headers.get('X-Widget-Session-Id');

  // Check presence
  if (!platformKey || !sessionId) {
    return {
      valid: false,
      error: 'Missing widget authentication headers',
    };
  }

  // Validate platform key against environment variables using shared helper
  const platformValidation = validatePlatformKey(platformKey);
  if (!platformValidation.valid || !platformValidation.platform) {
    return {
      valid: false,
      error: 'Invalid platform key',
    };
  }

  // Validate session ID format (should be a UUID)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    return {
      valid: false,
      error: 'Invalid session ID format',
    };
  }

  return {
    valid: true,
    platform: platformValidation.platform,
    sessionId,
  };
}

/**
 * Sanitize filename to prevent path traversal attacks
 * Removes dangerous characters while preserving extension
 *
 * @param filename - Original filename
 * @returns Sanitized filename
 */
function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  let sanitized = filename.replace(/[/\\:\0]/g, '');

  // Remove any leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');

  // If filename is empty after sanitization, use a default
  if (!sanitized) {
    sanitized = 'file';
  }

  // Limit filename length (255 is max for most filesystems)
  // Reserve space for extension
  const maxLength = 200;
  if (sanitized.length > maxLength) {
    const lastDot = sanitized.lastIndexOf('.');
    if (lastDot > 0) {
      const extension = sanitized.slice(lastDot);
      const nameWithoutExt = sanitized.slice(0, lastDot);
      sanitized = nameWithoutExt.slice(0, maxLength - extension.length) + extension;
    } else {
      sanitized = sanitized.slice(0, maxLength);
    }
  }

  return sanitized;
}

/**
 * Create S3 client for presigned URL generation
 * Follows the same pattern as lib/storage/s3-client.ts
 */
function createS3Client(): S3Client {
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = parseInt(process.env.MINIO_PORT || '9000', 10);
  const useSSL = process.env.MINIO_USE_SSL === 'true';
  const protocol = useSSL ? 'https' : 'http';
  const endpointUrl = `${protocol}://${endpoint}:${port}`;

  return new S3Client({
    endpoint: endpointUrl,
    region: process.env.MINIO_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || '',
      secretAccessKey: process.env.MINIO_SECRET_KEY || '',
    },
    forcePathStyle: true, // Required for MinIO
  });
}

/**
 * OPTIONS handler - Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getWidgetCORSHeaders(request.headers.get('Origin')),
  });
}

/**
 * POST handler - Generate presigned upload URL
 *
 * @param request - Next.js request
 * @returns Presigned upload URL with metadata
 */
export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get('Origin');
  const corsHeaders = getWidgetCORSHeaders(requestOrigin);

  try {
    // 1. Validate widget headers
    const authResult = await validateWidgetAuth(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401, headers: corsHeaders }
      );
    }

    // Type narrowing confirmed - authResult is now { valid: true, platform, sessionId }
    const { sessionId } = authResult;

    // 2. Parse and validate request body
    let body: UploadRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { conversationId, fileName, fileSize, mimeType } = body;

    // 3. Validate required fields
    if (!conversationId || !fileName || !fileSize || !mimeType) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['conversationId', 'fileName', 'fileSize', 'mimeType'],
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Validate file size (max 25MB)
    if (fileSize > ATTACHMENT_CONFIG.size.maxFileSize) {
      return NextResponse.json(
        {
          error: 'File size exceeds maximum allowed size',
          maxSize: ATTACHMENT_CONFIG.size.maxFileSize,
          maxSizeMB: Math.floor(ATTACHMENT_CONFIG.size.maxFileSize / (1024 * 1024)),
          provided: fileSize,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    if (fileSize <= 0) {
      return NextResponse.json(
        { error: 'File size must be greater than 0' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 5. Validate MIME type (images, PDF, docs)
    if (!isAllowedMimeType(mimeType)) {
      return NextResponse.json(
        {
          error: 'File type not allowed',
          allowedTypes: Object.values(ATTACHMENT_CONFIG.mimeTypes).flat(),
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 6. Verify conversation exists
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // 7. Verify session has access to conversation
    // For widget conversations (type='support'), check if the conversation
    // was created by this session or is accessible via metadata
    if (conversation.type !== 'support') {
      return NextResponse.json(
        { error: 'This conversation is not a widget conversation' },
        { status: 403, headers: corsHeaders }
      );
    }

    // Check if session has access to this conversation
    // The conversation metadata should contain the sessionId
    const conversationSessionId = conversation.metadata?.sessionId;
    if (conversationSessionId !== sessionId) {
      return NextResponse.json(
        { error: 'You do not have access to this conversation' },
        { status: 403, headers: corsHeaders }
      );
    }

    // 8. Sanitize filename to prevent path traversal attacks
    const sanitizedFileName = sanitizeFilename(fileName);

    // 9. Generate unique file ID
    const fileId = randomUUID();

    // 10. Create storage path: conversations/{conversationId}/{fileId}/original/{fileName}
    const filePath = `conversations/${conversationId}/${fileId}/original/${sanitizedFileName}`;

    // 11. Generate presigned upload URL
    const s3Client = createS3Client();

    // Create PutObjectCommand for presigned URL
    const putCommand = new PutObjectCommand({
      Bucket: ATTACHMENT_CONFIG.bucketName,
      Key: filePath,
      ContentType: mimeType,
      ContentLength: fileSize,
      Metadata: {
        'uploaded-by': 'widget',
        'session-id': sessionId,
        'conversation-id': conversationId,
        'file-id': fileId,
        'original-filename': sanitizedFileName,
        'user-provided-filename': fileName,
      },
    });

    // Generate presigned URL (valid for 5 minutes)
    const uploadUrl = await getSignedUrl(
      s3Client,
      putCommand,
      { expiresIn: ATTACHMENT_CONFIG.presignedUrls.uploadUrlExpiry }
    );

    // 12. Return response with upload URL and metadata
    return NextResponse.json(
      {
        fileId,
        uploadUrl,
        method: 'PUT',
        headers: {
          'Content-Type': mimeType,
        },
        confirmUrl: `/api/widget/attachments/${fileId}/confirm`,
        sanitizedFileName, // Return sanitized name to client
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    // Log error server-side
    console.error('[Widget Attachments Upload API] Error:', error);

    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500, headers: getWidgetCORSHeaders(request.headers.get('Origin')) }
    );
  }
}
