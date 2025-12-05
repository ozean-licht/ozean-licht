/**
 * Messaging Attachments Upload API
 * POST /api/messaging/attachments/upload
 *
 * Generates presigned upload URL for file attachments in messaging system.
 * Uses direct S3 upload with presigned URLs for better performance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { ATTACHMENT_CONFIG, isAllowedMimeType } from '@/lib/storage/messaging-config';
import { getConversationById } from '@/lib/db/conversations';
import { isParticipant } from '@/lib/db/participants';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

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
 * Sanitize filename to prevent path traversal attacks
 * Removes dangerous characters while preserving extension
 *
 * @param filename - Original filename
 * @returns Sanitized filename
 */
function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  let sanitized = filename.replace(/[\/\\:\0]/g, '');

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
 * POST handler - Generate presigned upload URL
 *
 * @param request - Next.js request
 * @returns Presigned upload URL with metadata
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Parse and validate request body
    let body: UploadRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
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
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (fileSize > ATTACHMENT_CONFIG.size.maxFileSize) {
      return NextResponse.json(
        {
          error: 'File size exceeds maximum allowed size',
          maxSize: ATTACHMENT_CONFIG.size.maxFileSize,
          provided: fileSize,
        },
        { status: 400 }
      );
    }

    if (fileSize <= 0) {
      return NextResponse.json(
        { error: 'File size must be greater than 0' },
        { status: 400 }
      );
    }

    // 5. Validate MIME type
    if (!isAllowedMimeType(mimeType)) {
      return NextResponse.json(
        {
          error: 'File type not allowed',
          allowedTypes: Object.values(ATTACHMENT_CONFIG.mimeTypes).flat(),
        },
        { status: 400 }
      );
    }

    // 6. Verify conversation exists
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // 7. Check user has access to conversation (is a participant)
    const hasAccess = await isParticipant(conversationId, userId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have access to this conversation' },
        { status: 403 }
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
        'uploaded-by': userId,
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
    return NextResponse.json({
      fileId,
      uploadUrl,
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      confirmUrl: `/api/messaging/attachments/${fileId}/confirm`,
      sanitizedFileName, // Return sanitized name to client
    });
  } catch (error) {
    // Log error server-side
    console.error('[Attachments Upload API] Error:', error);

    // Return safe error message to client
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to generate upload URL';

    return NextResponse.json(
      {
        error: 'Failed to generate upload URL',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
