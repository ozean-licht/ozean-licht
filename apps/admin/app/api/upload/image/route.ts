import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

// Validate required environment variables
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

// Security: Whitelist of allowed buckets
const ALLOWED_BUCKETS = ['course-images', 'user-avatars', 'content-media'];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Initialize MinIO client with error handling
let minioClient: Client;

try {
  minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  });
} catch (error) {
  throw new Error(`Failed to initialize MinIO client: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Validate URL format
function isValidUrl(url: string): boolean {
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
    const bucket = (formData.get('bucket') as string) || 'course-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Security: Validate bucket is in whitelist
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json(
        {
          error: 'Invalid bucket specified',
          allowedBuckets: ALLOWED_BUCKETS
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename with original extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${uuidv4()}.${ext}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // MinIO Operations with error handling
    try {
      // Ensure bucket exists
      const bucketExists = await minioClient.bucketExists(bucket);
      if (!bucketExists) {
        await minioClient.makeBucket(bucket);
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
        await minioClient.setBucketPolicy(bucket, JSON.stringify(policy));
      }

      // Upload to MinIO
      await minioClient.putObject(bucket, filename, buffer, buffer.length, {
        'Content-Type': file.type,
      });
    } catch (minioError) {
      const errorMessage = minioError instanceof Error ? minioError.message : 'Unknown MinIO error';
      throw new Error(`MinIO operation failed: ${errorMessage}`);
    }

    // Generate public URL
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const endpoint = process.env.MINIO_ENDPOINT!;
    const port = process.env.MINIO_PORT || '9000';

    // Use custom public URL if configured, otherwise construct from endpoint
    let publicUrl: string;

    if (process.env.MINIO_PUBLIC_URL) {
      publicUrl = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${filename}`;
    } else {
      publicUrl = `${protocol}://${endpoint}:${port}/${bucket}/${filename}`;
    }

    // Security: Validate generated URL before returning
    if (!isValidUrl(publicUrl)) {
      throw new Error('Generated URL is invalid. Check MinIO configuration.');
    }

    return NextResponse.json({
      url: publicUrl,
      filename,
      bucket,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    // Proper error logging without exposing sensitive details to client
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Log detailed error server-side (can be sent to logging service)
    if (process.env.NODE_ENV === 'development') {
      console.error('[Upload Error]', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
    }

    // Return safe error message to client
    return NextResponse.json(
      {
        error: error instanceof Error && error.message.includes('MinIO')
          ? 'Storage service error. Please try again later.'
          : 'Upload failed. Please try again.'
      },
      { status: 500 }
    );
  }
}
