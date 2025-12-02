/**
 * Templates API - List process templates
 * GET /api/templates - List templates with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllTemplates, getTemplateTypes, getTemplateById } from '@/lib/db/templates';

/**
 * GET /api/templates
 *
 * List templates with optional filtering and pagination.
 * Supports fetching a single template by ID or a filtered list.
 *
 * Query Parameters:
 * - id: Get single template by UUID
 * - templateType: Filter by template_type (e.g., 'Kurs', 'Post', 'Blog')
 * - status: Filter by status ('active', 'inactive', 'archived', 'draft')
 * - search: Search in name and description (case-insensitive)
 * - limit: Maximum results per page (default: 100, max: 1000)
 * - offset: Number of results to skip for pagination (default: 0)
 * - includeTypes: Include template type aggregations (default: false)
 *
 * Response:
 * - Single template: { template: DBProcessTemplate }
 * - List: { templates: DBProcessTemplate[], total: number, limit: number, offset: number, types?: TemplateTypeCount[] }
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check - all authenticated users can view templates
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    // If id is provided, get single template
    const id = searchParams.get('id');
    if (id) {
      try {
        const template = await getTemplateById(id);
        if (!template) {
          return NextResponse.json(
            { error: 'Template not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ template });
      } catch (error) {
        console.error('Failed to fetch template:', error);
        return NextResponse.json(
          { error: 'Failed to fetch template' },
          { status: 500 }
        );
      }
    }

    // Parse filters for list
    const templateType = searchParams.get('templateType') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const includeTypes = searchParams.get('includeTypes') === 'true';

    // Fetch templates with filters
    const result = await getAllTemplates({
      templateType,
      status,
      search,
      limit: Math.min(limit, 1000), // Cap at 1000
      offset,
    });

    // Optionally include template type aggregations
    let types = undefined;
    if (includeTypes) {
      types = await getTemplateTypes();
    }

    return NextResponse.json({
      templates: result.templates,
      total: result.total,
      limit,
      offset,
      types,
    });
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
