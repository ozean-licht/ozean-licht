import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { IterateRequest, IterateResponse } from '../../../../ai-mvp/types';

// Define allowed component directories (whitelist for security)
const projectRoot = path.resolve(process.cwd(), '../../..');
const allowedPaths = [
  path.join(projectRoot, 'shared/ui/src'),
  path.join(projectRoot, 'apps/admin/components'),
  path.join(projectRoot, 'apps/kids-ascension/components'),
  path.join(projectRoot, 'apps/ozean-licht/components'),
];

/**
 * Validates that a component path is safe to write to
 * Prevents path traversal attacks using canonical path resolution
 */
async function validateComponentPath(componentPath: string): Promise<{ valid: boolean; error?: string; canonicalPath?: string }> {
  try {
    // Resolve to absolute path first
    const absolutePath = path.resolve(componentPath);

    // Check if file exists, if not validate the parent directory
    let canonicalPath: string;
    try {
      canonicalPath = await fs.realpath(absolutePath);
    } catch {
      // File doesn't exist yet, validate parent directory
      const parentDir = path.dirname(absolutePath);
      const canonicalParent = await fs.realpath(parentDir);
      canonicalPath = path.join(canonicalParent, path.basename(absolutePath));
    }

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
 * Basic TypeScript syntax validation
 * Checks for obvious syntax errors before writing
 *
 * NOTE: This is a basic validation using regex patterns.
 * For production use, consider:
 * - Using TypeScript compiler API (ts.createSourceFile + ts.getPreEmitDiagnostics)
 * - Running in isolated context with VM2 or similar
 * - Adding file size limits (e.g., max 50KB)
 *
 * Current validation is sufficient for development AI iteration.
 */
function validateTypeScript(code: string): { valid: boolean; error?: string } {
  // Check for balanced braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    return { valid: false, error: 'Unbalanced braces in generated code' };
  }

  // Check for balanced parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return { valid: false, error: 'Unbalanced parentheses in generated code' };
  }

  // Check for balanced brackets
  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    return { valid: false, error: 'Unbalanced brackets in generated code' };
  }

  // Check for React import (required for TSX)
  if (!code.includes('import') || !code.includes('React')) {
    return { valid: false, error: 'Missing React import in generated code' };
  }

  // Check for export statement
  if (!code.includes('export')) {
    return { valid: false, error: 'Missing export statement in generated code' };
  }

  return { valid: true };
}

/**
 * Build prompt for Claude
 */
function buildPrompt(designSystem: string, currentCode: string, userPrompt: string): string {
  // Extract first 2000 chars of design system for context
  const designRules = designSystem.slice(0, 2000);

  return `You are modifying a React component. Follow these design rules strictly:

${designRules}

Current component code:
\`\`\`tsx
${currentCode}
\`\`\`

User request: ${userPrompt}

CRITICAL INSTRUCTIONS:
1. Return ONLY the complete updated component code
2. No explanations, no markdown formatting, no \`\`\`tsx blocks
3. Start with imports, end with export
4. Preserve existing functionality unless explicitly asked to change
5. Follow the Ozean Licht design system (oceanic cyan #0EA6C1, glass morphism, Montserrat font)

OUTPUT:`;
}

/**
 * Extract code from Claude response
 */
function extractCode(response: string): string {
  // Remove markdown code blocks if Claude included them
  let code = response.trim();

  // Remove ```tsx or ```typescript or ``` wrappers
  code = code.replace(/^```(?:tsx|typescript|ts|jsx|javascript|js)?\n/g, '');
  code = code.replace(/\n```$/g, '');

  return code.trim();
}

/**
 * POST /api/ai/iterate
 * Iterates on component with AI (Claude)
 *
 * RATE LIMITING:
 * This endpoint calls Claude API which incurs costs (~$0.01-0.05 per request).
 *
 * Recommended rate limiting for production:
 * - Per-IP: 10 requests per hour
 * - Per-session: 20 requests per day
 * - Global: 100 requests per day
 *
 * Implementation options:
 * 1. Next.js middleware with Redis/Upstash Rate Limit
 * 2. Vercel Edge Config rate limiting
 * 3. Database-based request tracking (user_id + timestamp)
 * 4. Cloudflare Workers rate limiting (if behind Cloudflare)
 *
 * For now, development-only usage (localhost) provides natural rate limiting.
 */
export async function POST(request: NextRequest) {
  try {
    const body: IterateRequest = await request.json();
    const { componentPath, currentCode, prompt } = body;

    if (!componentPath || !currentCode || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Component path, current code, and prompt are required' },
        { status: 400 }
      );
    }

    // Validate path before writing (now async)
    const pathValidation = await validateComponentPath(componentPath);
    if (!pathValidation.valid) {
      return NextResponse.json(
        { success: false, error: pathValidation.error },
        { status: 403 }
      );
    }

    // Check for Anthropic API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'ANTHROPIC_API_KEY not configured. Set it in .env.local' },
        { status: 500 }
      );
    }

    // Load design system
    const designSystemPath = path.join(projectRoot, 'design-system.md');
    let designSystem = '';
    try {
      designSystem = await fs.readFile(designSystemPath, 'utf-8');
    } catch (error) {
      console.warn('⚠ Design system not found, proceeding without it');
    }

    // Call Claude API directly (using fetch, same as MCP pattern)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: buildPrompt(designSystem, currentCode, prompt)
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    const data = await response.json();

    // Extract text from response
    const firstContent = data.content[0];
    const responseText = firstContent.type === 'text' ? firstContent.text : '';
    const newCode = extractCode(responseText);

    // Validate TypeScript syntax before writing
    const tsValidation = validateTypeScript(newCode);
    if (!tsValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `TypeScript validation failed: ${tsValidation.error}`
        },
        { status: 400 }
      );
    }

    // Write to file using canonical path - Next.js/Storybook HMR will automatically detect and reload
    await fs.writeFile(pathValidation.canonicalPath!, newCode, 'utf-8');

    // Small delay to ensure HMR picks up the change
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      message: 'Component updated successfully'
    } as IterateResponse);

  } catch (error: any) {
    console.error('AI iteration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      } as IterateResponse,
      { status: 500 }
    );
  }
}
