import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { hasValidExtension } from '@/lib/utils/sanitize';

// Security: Whitelist of allowed buckets for PDFs
const ALLOWED_BUCKETS = ['course-pdfs', 'content-documents'];

// Use environment variable for max file size, default to 10MB
const MAX_FILE_SIZE = parseInt(process.env.PDF_MAX_SIZE_MB || '10', 10) * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf'];
const ALLOWED_EXTENSIONS = ['.pdf'];

// Lazy initialization of MinIO client
let minioClient: Client | null = null;

/**
 * Parse MinIO endpoint - extracts hostname from URL if protocol is included
 */
function parseMinioEndpoint(endpoint: string): { host: string; port: number; useSSL: boolean } {
  let host = endpoint;
  let port = parseInt(process.env.MINIO_PORT || '9000', 10);
  let useSSL = process.env.MINIO_USE_SSL === 'true';

  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    try {
      const url = new URL(endpoint);
      host = url.hostname;
      if (url.port) {
        port = parseInt(url.port, 10);
      }
      useSSL = url.protocol === 'https:';
    } catch {
      host = endpoint.replace(/^https?:\/\//, '').split(':')[0];
    }
  } else if (endpoint.includes(':')) {
    const parts = endpoint.split(':');
    host = parts[0];
    port = parseInt(parts[1], 10) || port;
  }

  return { host, port, useSSL };
}

function getMinioClient(): Client {
  if (minioClient) {
    return minioClient;
  }

  const requiredEnvVars = {
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  };

  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required MinIO environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  const { host, port, useSSL } = parseMinioEndpoint(process.env.MINIO_ENDPOINT!);

  minioClient = new Client({
    endPoint: host,
    port,
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  });

  return minioClient;
}

// Note: For internal MinIO URLs, we use a simpler validation
// since we're generating them ourselves and not accepting user input
function isValidGeneratedUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'course-pdfs';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Security: Validate bucket is in whitelist
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json(
        {
          error: 'Invalid bucket specified',
          allowedBuckets: ALLOWED_BUCKETS,
        },
        { status: 400 }
      );
    }

    // Validate file type (MIME type)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Security: Validate file extension to prevent bypass
    if (!hasValidExtension(file.name, ALLOWED_EXTENSIONS)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Only .pdf files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSizeMB}MB.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uuidv4()}-${originalName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // MinIO Operations
    try {
      const client = getMinioClient();

      // Ensure bucket exists
      const bucketExists = await client.bucketExists(bucket);
      if (!bucketExists) {
        await client.makeBucket(bucket);
        // Set bucket policy for public read access
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };
        await client.setBucketPolicy(bucket, JSON.stringify(policy));
      }

      // Upload to MinIO
      await client.putObject(bucket, filename, buffer, buffer.length, {
        'Content-Type': file.type,
        'Content-Disposition': `inline; filename="${originalName}"`,
      });
    } catch (minioError) {
      const errorMessage =
        minioError instanceof Error ? minioError.message : 'Unknown MinIO error';
      throw new Error(`MinIO operation failed: ${errorMessage}`);
    }

    // Generate public URL
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const endpoint = process.env.MINIO_ENDPOINT!;
    const port = process.env.MINIO_PORT || '9000';

    let publicUrl: string;

    if (process.env.MINIO_PUBLIC_URL) {
      publicUrl = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${filename}`;
    } else {
      publicUrl = `${protocol}://${endpoint}:${port}/${bucket}/${filename}`;
    }

    // Validate generated URL
    if (!isValidGeneratedUrl(publicUrl)) {
      throw new Error('Generated URL is invalid. Check MinIO configuration.');
    }

    return NextResponse.json({
      url: publicUrl,
      filename,
      originalName,
      bucket,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    if (process.env.NODE_ENV === 'development') {
      console.error('[PDF Upload Error]', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.includes('MinIO')
            ? 'Storage service error. Please try again later.'
            : 'Upload failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
