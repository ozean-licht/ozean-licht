/**
 * Widget Attachment Upload Confirmation API
 *
 * POST /api/widget/attachments/[fileId]/confirm
 *
 * Confirms an upload and generates thumbnails for images.
 * Called after widget client-side upload completes to verify the file
 * and create necessary thumbnails.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ATTACHMENT_CONFIG, getAttachmentType } from '@/lib/storage/messaging-config';
import { getS3StorageClient } from '@/lib/storage/s3-client';
import { generateThumbnails, isImageMimeType } from '@/lib/storage/thumbnails';
import { getConversationById } from '@/lib/db/conversations';
import { getWidgetCORSHeaders, validatePlatformKey } from '@/lib/widget/cors';

/**
 * Request body interface
 */
interface ConfirmUploadBody {
  conversationId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Route params interface
 */
interface RouteParams {
  params: Promise<{ fileId: string }>;
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
 * OPTIONS handler - Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getWidgetCORSHeaders(request.headers.get('Origin')),
  });
}

/**
 * POST handler - Confirm upload and generate thumbnails
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
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

    // 2. Get fileId from params
    const { fileId } = await params;

    // Validate fileId format (should be a UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID format' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Parse request body
    let body: ConfirmUploadBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { conversationId, fileName, fileSize, mimeType } = body;

    // 4. Validate required fields
    if (!conversationId || !fileName || !fileSize || !mimeType) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['conversationId', 'fileName', 'fileSize', 'mimeType'],
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 5. Validate file size
    if (fileSize > ATTACHMENT_CONFIG.size.maxFileSize) {
      return NextResponse.json(
        {
          error: 'File size exceeds maximum allowed',
          maxSize: ATTACHMENT_CONFIG.size.maxFileSize,
          maxSizeMB: Math.floor(ATTACHMENT_CONFIG.size.maxFileSize / (1024 * 1024)),
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
    if (conversation.type !== 'support') {
      return NextResponse.json(
        { error: 'This conversation is not a widget conversation' },
        { status: 403, headers: corsHeaders }
      );
    }

    const conversationSessionId = conversation.metadata?.sessionId;
    if (conversationSessionId !== sessionId) {
      return NextResponse.json(
        { error: 'You do not have access to this conversation' },
        { status: 403, headers: corsHeaders }
      );
    }

    // 8. Build the file path
    const filePath = `conversations/${conversationId}/${fileId}/original/${fileName}`;

    // 9. Get storage client
    const storageClient = getS3StorageClient();

    // 10. Verify file exists in S3 (HEAD request)
    let fileExists = false;
    try {
      await storageClient.statFile({
        bucket: ATTACHMENT_CONFIG.bucketName,
        fileKey: filePath,
      });
      fileExists = true;
    } catch {
      // File doesn't exist
      fileExists = false;
    }

    if (!fileExists) {
      return NextResponse.json(
        {
          error: 'File not found in storage',
          message: 'The uploaded file could not be found. Please try uploading again.',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 11. Determine attachment type
    const attachmentType = getAttachmentType(mimeType);

    // 12. For images, generate thumbnail (or skip for MVP)
    let thumbnailUrl: string | undefined;
    let thumbnailWarning: string | undefined;

    if (isImageMimeType(mimeType)) {
      try {
        // Download the original file
        const fileUrlResult = await storageClient.getFileUrl({
          bucket: ATTACHMENT_CONFIG.bucketName,
          fileKey: filePath,
          expirySeconds: ATTACHMENT_CONFIG.presignedUrls.uploadUrlExpiry,
        });

        // Fetch the file buffer
        const response = await fetch(fileUrlResult.url);
        if (!response.ok) {
          throw new Error('Failed to download original file for thumbnail generation');
        }
        const fileBuffer = Buffer.from(await response.arrayBuffer());

        // Generate thumbnails
        thumbnailUrl = await generateThumbnails(
          ATTACHMENT_CONFIG.bucketName,
          filePath,
          fileBuffer
        );

        // If no thumbnail URL was returned, it means generation failed
        if (!thumbnailUrl) {
          thumbnailWarning = 'Thumbnail generation failed - image will display without preview';
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[Widget Attachment Confirm] Thumbnail generation failed:', errorMessage);
        thumbnailWarning = `Thumbnail generation failed: ${errorMessage}`;
      }
    }

    // 13. Generate presigned download URL
    const downloadUrlResult = await storageClient.getFileUrl({
      bucket: ATTACHMENT_CONFIG.bucketName,
      fileKey: filePath,
      expirySeconds: ATTACHMENT_CONFIG.presignedUrls.downloadUrlExpiry,
    });

    // 14. Return attachment object
    const attachmentResponse = {
      id: fileId,
      type: attachmentType,
      name: fileName,
      size: fileSize,
      mimeType,
      url: downloadUrlResult.url,
      ...(thumbnailUrl && { thumbnailUrl }),
    };

    return NextResponse.json(
      {
        attachment: attachmentResponse,
        ...(thumbnailWarning && { warning: thumbnailWarning }),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[Widget Attachment Confirm] Error:', error);

    return NextResponse.json(
      { error: 'Upload confirmation failed' },
      { status: 500, headers: getWidgetCORSHeaders(request.headers.get('Origin')) }
    );
  }
}
