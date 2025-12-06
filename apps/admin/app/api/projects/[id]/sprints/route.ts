/**
 * Project Sprints API
 * GET /api/projects/[id]/sprints - List sprints for a project
 * POST /api/projects/[id]/sprints - Create a sprint for a project
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getSprintsByProjectId, createSprint } from '@/lib/db/sprints';
import { getProjectById } from '@/lib/db/projects';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]/sprints
 * List all sprints for a project
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: projectId } = await params;

    // Verify project exists
    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Fetch sprints for the project
    const sprints = await getSprintsByProjectId(projectId);

    return NextResponse.json({ sprints });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch sprints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/sprints
 * Create a new sprint for a project
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
    const { id: projectId } = await params;
    const body = await request.json();

    // Verify project exists
    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Sprint name is required' },
        { status: 400 }
      );
    }

    // Create the sprint
    const sprint = await createSprint({
      project_id: projectId,
      name: body.name.trim(),
      goal: body.goal?.trim() || undefined,
      status: body.status || 'planning',
      start_date: body.startDate || body.start_date || undefined,
      end_date: body.endDate || body.end_date || undefined,
    });

    return NextResponse.json({ sprint }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create sprint:', error);
    return NextResponse.json(
      { error: 'Failed to create sprint' },
      { status: 500 }
    );
  }
}
