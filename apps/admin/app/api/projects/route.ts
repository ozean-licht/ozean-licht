/**
 * Projects API - List and Create
 * GET /api/projects - List projects with filters
 * POST /api/projects - Create new project
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getAllProjects, createProject, getProjectStats } from '@/lib/db/projects';

/**
 * GET /api/projects
 * List all projects with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const projectType = searchParams.get('projectType') || undefined;
    const intervalType = searchParams.get('intervalType') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc';
    const includeStats = searchParams.get('includeStats') === 'true';

    // Fetch projects with filters
    const result = await getAllProjects({
      status,
      projectType,
      intervalType,
      search,
      limit,
      offset,
      orderBy,
      orderDirection,
    });

    // Optionally include aggregate stats
    let stats = undefined;
    if (includeStats) {
      stats = await getProjectStats();
    }

    return NextResponse.json({
      projects: result.projects,
      total: result.total,
      limit,
      offset,
      stats,
    });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create the project
    const project = await createProject({
      title: body.title,
      description: body.description,
      project_type: body.project_type,
      interval_type: body.interval_type,
      status: body.status || 'planning',
      start_date: body.start_date,
      target_date: body.target_date,
      used_template: body.used_template || false,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
