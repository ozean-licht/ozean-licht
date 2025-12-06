/**
 * Attachment Upload Confirmation API
 *
 * POST /api/messaging/attachments/[fileId]/confirm
 *
 * Confirms an upload and generates thumbnails for images.
 * Called after client-side upload completes to verify the file
 * and create necessary thumbnails.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { ATTACHMENT_CONFIG, getAttachmentType } from '@/lib/storage/messaging-config';
import { getS3StorageClient } from '@/lib/storage/s3-client';
import { generateThumbnails, isImageMimeType } from '@/lib/storage/thumbnails';

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
 * POST handler - Confirm upload and generate thumbnails
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { fileId } = params;

    // Parse request body
    let body: ConfirmUploadBody;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { conversationId, fileName, fileSize, mimeType } = body;

    // Validate required fields
    if (!conversationId || !fileName || !fileSize || !mimeType) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          required: ['conversationId', 'fileName', 'fileSize', 'mimeType'],
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (fileSize > ATTACHMENT_CONFIG.size.maxFileSize) {
      return NextResponse.json(
        {
          error: 'File size exceeds maximum allowed',
          maxSize: ATTACHMENT_CONFIG.size.maxFileSize,
        },
        { status: 400 }
      );
    }

    // Build the file path
    const filePath = `conversations/${conversationId}/${fileId}/original/${fileName}`;

    // Get storage client
    const storageClient = getS3StorageClient();

    // Check if file exists
    let fileExists = false;
    try {
      await storageClient.statFile({
        bucket: ATTACHMENT_CONFIG.bucketName,
        fileKey: filePath,
      });
      fileExists = true;
    } catch (error) {
      // File doesn't exist
      fileExists = false;
    }

    if (!fileExists) {
      return NextResponse.json(
        {
          error: 'File not found',
          message: 'The uploaded file could not be found in storage',
        },
        { status: 400 }
      );
    }

    // Determine attachment type
    const attachmentType = getAttachmentType(mimeType);

    // Generate thumbnails for images
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
          throw new Error('Failed to download original file');
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
        // eslint-disable-next-line no-console
        console.error('[Attachment Confirm] Thumbnail generation failed:', errorMessage);
        thumbnailWarning = `Thumbnail generation failed: ${errorMessage}`;
      }
    }

    // Get presigned download URL for the original file
    const downloadUrlResult = await storageClient.getFileUrl({
      bucket: ATTACHMENT_CONFIG.bucketName,
      fileKey: filePath,
      expirySeconds: ATTACHMENT_CONFIG.presignedUrls.downloadUrlExpiry,
    });

    // Return attachment object
    return NextResponse.json({
      attachment: {
        id: fileId,
        type: attachmentType,
        name: fileName,
        size: fileSize,
        mimeType,
        url: downloadUrlResult.url,
        ...(thumbnailUrl && { thumbnailUrl }),
      },
      ...(thumbnailWarning && { warning: thumbnailWarning }),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Attachment Confirm] Error:', error);

    // Return appropriate error message
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to confirm upload';

    return NextResponse.json(
      {
        error: 'Upload confirmation failed',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
