/**
 * Task Attachments API
 * GET /api/tasks/[id]/attachments - List attachments for task
 * POST /api/tasks/[id]/attachments - Upload attachment to task
 *
 * Phase 11 of Project Management MVP
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { v4 as uuidv4 } from 'uuid';
import { Client } from 'minio';
import {
  getAttachmentsByTaskId,
  createAttachment,
  getTaskAttachmentCount,
} from '@/lib/db/attachments';
import { getTaskById } from '@/lib/db/tasks';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Validate required environment variables
const REQUIRED_ENV_VARS = ['MINIO_ENDPOINT', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY'] as const;
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

// Attachment bucket - add to allowed buckets
const ATTACHMENT_BUCKET = 'task-attachments';

// File size limits
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB for attachments

// Allowed file types for attachments (broader than images)
const ALLOWED_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Text
  'text/plain',
  'text/csv',
  'text/markdown',
  // Archives
  'application/zip',
  'application/x-zip-compressed',
  // Code
  'application/json',
  'application/xml',
  'text/html',
  'text/css',
  'text/javascript',
];

// Initialize MinIO client (lazy)
let minioClient: Client | null = null;

function getMinioClient(): Client {
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required MinIO environment variables: ${missingEnvVars.join(', ')}`);
  }

  if (!minioClient) {
    minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }
  return minioClient;
}

// Dangerous file signatures to block (executables, scripts that could be disguised)
const BLOCKED_SIGNATURES: Array<{ signature: number[]; description: string }> = [
  { signature: [0x4D, 0x5A], description: 'Windows executable (EXE/DLL)' },
  { signature: [0x7F, 0x45, 0x4C, 0x46], description: 'Linux executable (ELF)' },
  { signature: [0xCA, 0xFE, 0xBA, 0xBE], description: 'Java class file' },
  { signature: [0xFE, 0xED, 0xFA, 0xCE], description: 'Mach-O executable (32-bit)' },
  { signature: [0xFE, 0xED, 0xFA, 0xCF], description: 'Mach-O executable (64-bit)' },
  { signature: [0xCF, 0xFA, 0xED, 0xFE], description: 'Mach-O executable (reverse)' },
];

/**
 * Validate file content by checking for blocked file signatures (magic bytes)
 * Returns null if valid, or error message if blocked
 */
function validateFileContent(buffer: Buffer): string | null {
  for (const { signature, description } of BLOCKED_SIGNATURES) {
    const matches = signature.every((byte, index) => buffer[index] === byte);
    if (matches) {
      return `Blocked file type detected: ${description}`;
    }
  }
  return null;
}

/**
 * GET /api/tasks/[id]/attachments
 * Fetch all attachments for a task
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const [attachments, count] = await Promise.all([
      getAttachmentsByTaskId(id, limit),
      getTaskAttachmentCount(id),
    ]);

    return NextResponse.json({
      attachments,
      count,
    });
  } catch (error) {
    console.error('[Attachments API] Failed to fetch attachments:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch attachments',
        details: message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks/[id]/attachments
 * Upload a new attachment to a task
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Verify task exists
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'File type not allowed',
          details: `Allowed types: ${ALLOWED_TYPES.slice(0, 5).join(', ')}...`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          details: `Maximum file size is 25MB. Uploaded file is ${Math.round(file.size / 1024 / 1024)}MB`,
        },
        { status: 400 }
      );
    }

    // Generate unique file key
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const fileKey = `tasks/${id}/${uuidv4()}${ext ? `.${ext}` : ''}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Server-side validation: check for blocked file signatures (magic bytes)
    const contentError = validateFileContent(buffer);
    if (contentError) {
      return NextResponse.json(
        {
          error: 'Invalid file content',
          details: contentError,
        },
        { status: 400 }
      );
    }

    // Upload to MinIO
    const client = getMinioClient();

    // Ensure bucket exists
    const bucketExists = await client.bucketExists(ATTACHMENT_BUCKET);
    if (!bucketExists) {
      await client.makeBucket(ATTACHMENT_BUCKET);
      // Set bucket policy for private access (no public read)
    }

    // Upload file
    await client.putObject(ATTACHMENT_BUCKET, fileKey, buffer, buffer.length, {
      'Content-Type': file.type,
      'x-amz-meta-task-id': id,
      'x-amz-meta-original-name': encodeURIComponent(file.name),
    });

    // Generate URL
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const endpoint = process.env.MINIO_ENDPOINT!;
    const port = process.env.MINIO_PORT || '9000';

    let fileUrl: string;
    if (process.env.MINIO_PUBLIC_URL) {
      fileUrl = `${process.env.MINIO_PUBLIC_URL}/${ATTACHMENT_BUCKET}/${fileKey}`;
    } else {
      fileUrl = `${protocol}://${endpoint}:${port}/${ATTACHMENT_BUCKET}/${fileKey}`;
    }

    // Create database record
    const attachment = await createAttachment({
      task_id: id,
      file_name: file.name,
      file_url: fileUrl,
      file_key: fileKey,
      bucket: ATTACHMENT_BUCKET,
      file_type: file.type,
      file_size_bytes: file.size,
      uploaded_by: session.user.id || undefined,
      uploaded_by_name: session.user.name || undefined,
      uploaded_by_email: session.user.email || undefined,
    });

    // Get updated count
    const count = await getTaskAttachmentCount(id);

    return NextResponse.json({ attachment, count }, { status: 201 });
  } catch (error) {
    console.error('[Attachments API] Failed to upload attachment:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to upload attachment',
        details: message,
      },
      { status: 500 }
    );
  }
}
