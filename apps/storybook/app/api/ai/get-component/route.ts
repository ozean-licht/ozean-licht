import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define allowed component directories (whitelist for security)
const projectRoot = path.resolve(process.cwd(), '../../..');
const allowedPaths = [
  path.join(projectRoot, 'shared/ui/src'),
  path.join(projectRoot, 'apps/admin/components'),
  path.join(projectRoot, 'apps/kids-ascension/components'),
  path.join(projectRoot, 'apps/ozean-licht/components'),
];

/**
 * Validates that a component path is safe to read from
 * Prevents path traversal attacks using canonical path resolution
 */
async function validateComponentPath(componentPath: string): Promise<{ valid: boolean; error?: string; canonicalPath?: string }> {
  try {
    // Resolve to absolute path first
    const absolutePath = path.resolve(componentPath);

    // Get canonical path (resolves symlinks and normalizes)
    const canonicalPath = await fs.realpath(absolutePath);

    // Check if canonical path is within allowed directories
    const isAllowed = allowedPaths.some(allowedPath => {
      const resolvedAllowedPath = path.resolve(allowedPath);
      return canonicalPath.startsWith(resolvedAllowedPath + path.sep) ||
             canonicalPath === resolvedAllowedPath;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Path not allowed: ${componentPath}. Must be within allowed directories.`
      };
    }

    // Check file extension
    const ext = path.extname(canonicalPath);
    if (!['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
      return {
        valid: false,
        error: `Invalid file extension: ${ext}. Only .tsx, .ts, .jsx, .js allowed`
      };
    }

    return { valid: true, canonicalPath };
  } catch (error: any) {
    return {
      valid: false,
      error: `Invalid path: ${error.message}`
    };
  }
}

/**
 * GET /api/ai/get-component
 * Fetches component source code for AI iteration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { componentPath } = body;

    if (!componentPath) {
      return NextResponse.json(
        { success: false, error: 'Component path is required' },
        { status: 400 }
      );
    }

    // Validate path before reading (now async)
    const validation = await validateComponentPath(componentPath);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 403 }
      );
    }

    // Read component file using canonical path
    const code = await fs.readFile(validation.canonicalPath!, 'utf-8');

    return NextResponse.json({ success: true, code });
  } catch (error: any) {
    console.error('Get component error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
