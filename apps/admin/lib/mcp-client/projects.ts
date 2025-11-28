/**
 * Project Query Operations - Projects, Tasks, Templates, Sprints
 * Part of Airtable MCP Migration
 */

import { MCPGatewayClient } from './client';
import {
  Project,
  Task,
  ProcessTemplate,
  Sprint,
  ProjectListOptions,
  TaskListOptions,
  TemplateListOptions,
  SprintListOptions,
  ProjectListResult,
  TaskListResult,
  TemplateListResult,
  SprintListResult,
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  CreateSprintInput,
  UpdateSprintInput,
  ProjectStats,
  TaskStats,
  KanbanBoard,
  KanbanColumn,
  TemplateStep,
} from '../../types/projects';

// Database row types (snake_case)
interface ProjectRow {
  id: string;
  airtable_id: string | null;
  name: string;
  description: string | null;
  project_code: string | null;
  status: string;
  priority: string;
  project_type: string | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  budget_cents: number | null;
  currency: string;
  actual_cost_cents: number;
  progress_percent: number;
  owner_id: string | null;
  team_members: string[];
  tags: string[];
  entity_scope: string | null;
  template_id: string | null;
  parent_project_id: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
  task_count?: number;
  completed_task_count?: number;
  overdue_task_count?: number;
}

interface TaskRow {
  id: string;
  airtable_id: string | null;
  project_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  task_type: string;
  assignee_id: string | null;
  reporter_id: string | null;
  due_date: string | null;
  start_date: string | null;
  estimated_hours: number | null;
  actual_hours: number;
  order_index: number;
  parent_task_id: string | null;
  depends_on: string[];
  tags: string[];
  labels: string[];
  story_points: number | null;
  sprint_id: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  comment_count?: number;
  attachment_count?: number;
}

interface TemplateRow {
  id: string;
  airtable_id: string | null;
  name: string;
  description: string | null;
  category: string | null;
  template_type: string;
  steps: TemplateStep[];
  default_assignees: Record<string, string>;
  estimated_duration_hours: number | null;
  estimated_duration_days: number | null;
  is_active: boolean;
  is_public: boolean;
  usage_count: number;
  entity_scope: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

interface SprintRow {
  id: string;
  project_id: string;
  name: string;
  goal: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  velocity: number | null;
  created_at: string;
  updated_at: string;
  task_count?: number;
  completed_task_count?: number;
  total_story_points?: number;
  completed_story_points?: number;
}

/**
 * Project Queries Extension for MCPGatewayClient
 */
export class ProjectQueries {
  constructor(private client: MCPGatewayClient) {}

  // ============================================================================
  // Project Operations
  // ============================================================================

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    const sql = `
      SELECT p.id, p.airtable_id, p.name, p.description, p.project_code,
             p.status, p.priority, p.project_type, p.start_date, p.due_date,
             p.completed_at, p.budget_cents, p.currency, p.actual_cost_cents,
             p.progress_percent, p.owner_id, p.team_members, p.tags,
             p.entity_scope, p.template_id, p.parent_project_id,
             p.created_at, p.updated_at, p.metadata,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') as completed_task_count,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.due_date < CURRENT_DATE AND t.status != 'done') as overdue_task_count
      FROM projects p
      WHERE p.id = $1
    `;

    const rows = await this.client.query<ProjectRow>(sql, [id]);
    return rows.length > 0 ? this.mapProject(rows[0]) : null;
  }

  /**
   * List projects with filters and pagination
   */
  async listProjects(options: ProjectListOptions = {}): Promise<ProjectListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`p.entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.status) {
      conditions.push(`p.status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.priority) {
      conditions.push(`p.priority = $${paramIndex++}`);
      params.push(options.priority);
    }

    if (options.ownerId) {
      conditions.push(`p.owner_id = $${paramIndex++}`);
      params.push(options.ownerId);
    }

    if (options.search) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Validate pagination bounds
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    const offset = Math.max(options.offset || 0, 0);
    // Allowlist for ORDER BY columns to prevent SQL injection
    const PROJECT_SORTABLE_COLUMNS: Record<string, string> = {
      created_at: 'created_at',
      updated_at: 'updated_at',
      name: 'name',
      due_date: 'due_date',
      priority: 'priority',
      status: 'status',
    };
    const orderBy = PROJECT_SORTABLE_COLUMNS[options.orderBy || 'created_at'] || 'created_at';
    const orderDir = options.orderDirection === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM projects p ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT p.id, p.airtable_id, p.name, p.description, p.project_code,
             p.status, p.priority, p.project_type, p.start_date, p.due_date,
             p.completed_at, p.budget_cents, p.currency, p.actual_cost_cents,
             p.progress_percent, p.owner_id, p.team_members, p.tags,
             p.entity_scope, p.template_id, p.parent_project_id,
             p.created_at, p.updated_at, p.metadata,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') as completed_task_count,
             (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.due_date < CURRENT_DATE AND t.status != 'done') as overdue_task_count
      FROM projects p
      ${whereClause}
      ORDER BY p.${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<ProjectRow>(sql, params);

    return {
      data: rows.map(row => this.mapProject(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectInput): Promise<Project> {
    const sql = `
      INSERT INTO projects (
        name, description, status, priority, project_type, start_date, due_date,
        budget_cents, currency, owner_id, team_members, tags, entity_scope,
        template_id, parent_project_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, airtable_id, name, description, project_code,
                status, priority, project_type, start_date, due_date,
                completed_at, budget_cents, currency, actual_cost_cents,
                progress_percent, owner_id, team_members, tags,
                entity_scope, template_id, parent_project_id,
                created_at, updated_at, metadata
    `;

    const rows = await this.client.query<ProjectRow>(sql, [
      data.name,
      data.description || null,
      data.status || 'planning',
      data.priority || 'medium',
      data.projectType || null,
      data.startDate || null,
      data.dueDate || null,
      data.budgetCents || null,
      data.currency || 'EUR',
      data.ownerId || null,
      JSON.stringify(data.teamMembers || []),
      JSON.stringify(data.tags || []),
      data.entityScope || null,
      data.templateId || null,
      data.parentProjectId || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapProject(rows[0]);
  }

  /**
   * Update a project
   */
  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateProjectInput, string]> = [
      ['name', 'name'],
      ['description', 'description'],
      ['status', 'status'],
      ['priority', 'priority'],
      ['projectType', 'project_type'],
      ['startDate', 'start_date'],
      ['dueDate', 'due_date'],
      ['budgetCents', 'budget_cents'],
      ['currency', 'currency'],
      ['ownerId', 'owner_id'],
      ['entityScope', 'entity_scope'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | null);
      }
    }

    if (data.teamMembers !== undefined) {
      updates.push(`team_members = $${paramIndex++}`);
      params.push(JSON.stringify(data.teamMembers));
    }

    if (data.tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      params.push(JSON.stringify(data.tags));
    }

    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    // Set completed_at when status changes to completed
    if (data.status === 'completed') {
      updates.push(`completed_at = COALESCE(completed_at, NOW())`);
    }

    params.push(id);

    const sql = `
      UPDATE projects
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, name, description, project_code,
                status, priority, project_type, start_date, due_date,
                completed_at, budget_cents, currency, actual_cost_cents,
                progress_percent, owner_id, team_members, tags,
                entity_scope, template_id, parent_project_id,
                created_at, updated_at, metadata
    `;

    const rows = await this.client.query<ProjectRow>(sql, params);
    return this.mapProject(rows[0]);
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    await this.client.execute('DELETE FROM projects WHERE id = $1', [id]);
  }

  /**
   * Get project stats
   */
  async getProjectStats(entityScope?: string): Promise<ProjectStats> {
    const scopeCondition = entityScope ? 'WHERE entity_scope = $1' : '';
    const params = entityScope ? [entityScope] : [];

    const sql = `
      SELECT
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE status = 'active') as active_projects,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_projects,
        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status NOT IN ('completed', 'cancelled')) as overdue_projects,
        COALESCE(SUM(budget_cents), 0) as total_budget,
        COALESCE(SUM(actual_cost_cents), 0) as total_spent
      FROM projects
      ${scopeCondition}
    `;

    const rows = await this.client.query<{
      total_projects: string;
      active_projects: string;
      completed_projects: string;
      overdue_projects: string;
      total_budget: string;
      total_spent: string;
    }>(sql, params);

    return {
      totalProjects: parseInt(rows[0].total_projects, 10),
      activeProjects: parseInt(rows[0].active_projects, 10),
      completedProjects: parseInt(rows[0].completed_projects, 10),
      overdueProjects: parseInt(rows[0].overdue_projects, 10),
      totalBudget: parseInt(rows[0].total_budget, 10),
      totalSpent: parseInt(rows[0].total_spent, 10),
    };
  }

  // ============================================================================
  // Task Operations
  // ============================================================================

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    const sql = `
      SELECT t.id, t.airtable_id, t.project_id, t.title, t.description,
             t.status, t.priority, t.task_type, t.assignee_id, t.reporter_id,
             t.due_date, t.start_date, t.estimated_hours, t.actual_hours,
             t.order_index, t.parent_task_id, t.depends_on, t.tags, t.labels,
             t.story_points, t.sprint_id, t.created_at, t.updated_at,
             t.started_at, t.completed_at,
             (SELECT COUNT(*) FROM task_comments c WHERE c.task_id = t.id) as comment_count,
             (SELECT COUNT(*) FROM task_attachments a WHERE a.task_id = t.id) as attachment_count
      FROM tasks t
      WHERE t.id = $1
    `;

    const rows = await this.client.query<TaskRow>(sql, [id]);
    return rows.length > 0 ? this.mapTask(rows[0]) : null;
  }

  /**
   * List tasks with filters and pagination
   */
  async listTasks(options: TaskListOptions = {}): Promise<TaskListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.projectId) {
      conditions.push(`t.project_id = $${paramIndex++}`);
      params.push(options.projectId);
    }

    if (options.status) {
      conditions.push(`t.status = $${paramIndex++}`);
      params.push(options.status);
    }

    if (options.priority) {
      conditions.push(`t.priority = $${paramIndex++}`);
      params.push(options.priority);
    }

    if (options.taskType) {
      conditions.push(`t.task_type = $${paramIndex++}`);
      params.push(options.taskType);
    }

    if (options.assigneeId) {
      conditions.push(`t.assignee_id = $${paramIndex++}`);
      params.push(options.assigneeId);
    }

    if (options.sprintId) {
      conditions.push(`t.sprint_id = $${paramIndex++}`);
      params.push(options.sprintId);
    }

    if (options.parentTaskId) {
      conditions.push(`t.parent_task_id = $${paramIndex++}`);
      params.push(options.parentTaskId);
    }

    if (options.hasParent !== undefined) {
      conditions.push(options.hasParent ? 't.parent_task_id IS NOT NULL' : 't.parent_task_id IS NULL');
    }

    if (options.search) {
      conditions.push(`(t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Validate pagination bounds
    const limit = Math.min(Math.max(options.limit || 50, 1), 100);
    const offset = Math.max(options.offset || 0, 0);
    // Allowlist for ORDER BY columns to prevent SQL injection
    const TASK_SORTABLE_COLUMNS: Record<string, string> = {
      created_at: 'created_at',
      updated_at: 'updated_at',
      title: 'title',
      due_date: 'due_date',
      priority: 'priority',
      status: 'status',
      order_index: 'order_index',
    };
    const orderBy = TASK_SORTABLE_COLUMNS[options.orderBy || 'created_at'] || 'created_at';
    const orderDir = options.orderDirection === 'asc' ? 'ASC' : 'DESC';

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM tasks t ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT t.id, t.airtable_id, t.project_id, t.title, t.description,
             t.status, t.priority, t.task_type, t.assignee_id, t.reporter_id,
             t.due_date, t.start_date, t.estimated_hours, t.actual_hours,
             t.order_index, t.parent_task_id, t.depends_on, t.tags, t.labels,
             t.story_points, t.sprint_id, t.created_at, t.updated_at,
             t.started_at, t.completed_at,
             (SELECT COUNT(*) FROM task_comments c WHERE c.task_id = t.id) as comment_count,
             (SELECT COUNT(*) FROM task_attachments a WHERE a.task_id = t.id) as attachment_count
      FROM tasks t
      ${whereClause}
      ORDER BY t.${orderBy} ${orderDir}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<TaskRow>(sql, params);

    return {
      data: rows.map(row => this.mapTask(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskInput): Promise<Task> {
    const sql = `
      INSERT INTO tasks (
        project_id, title, description, status, priority, task_type,
        assignee_id, reporter_id, due_date, start_date, estimated_hours,
        order_index, parent_task_id, depends_on, tags, labels,
        story_points, sprint_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, airtable_id, project_id, title, description,
                status, priority, task_type, assignee_id, reporter_id,
                due_date, start_date, estimated_hours, actual_hours,
                order_index, parent_task_id, depends_on, tags, labels,
                story_points, sprint_id, created_at, updated_at,
                started_at, completed_at
    `;

    const rows = await this.client.query<TaskRow>(sql, [
      data.projectId || null,
      data.title,
      data.description || null,
      data.status || 'todo',
      data.priority || 'medium',
      data.taskType || 'task',
      data.assigneeId || null,
      data.reporterId || null,
      data.dueDate || null,
      data.startDate || null,
      data.estimatedHours || null,
      data.orderIndex || 0,
      data.parentTaskId || null,
      JSON.stringify(data.dependsOn || []),
      JSON.stringify(data.tags || []),
      JSON.stringify(data.labels || []),
      data.storyPoints || null,
      data.sprintId || null,
    ]);

    return this.mapTask(rows[0]);
  }

  /**
   * Update a task
   */
  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateTaskInput, string]> = [
      ['title', 'title'],
      ['description', 'description'],
      ['status', 'status'],
      ['priority', 'priority'],
      ['taskType', 'task_type'],
      ['assigneeId', 'assignee_id'],
      ['dueDate', 'due_date'],
      ['startDate', 'start_date'],
      ['estimatedHours', 'estimated_hours'],
      ['orderIndex', 'order_index'],
      ['parentTaskId', 'parent_task_id'],
      ['storyPoints', 'story_points'],
      ['sprintId', 'sprint_id'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | null);
      }
    }

    if (data.dependsOn !== undefined) {
      updates.push(`depends_on = $${paramIndex++}`);
      params.push(JSON.stringify(data.dependsOn));
    }

    if (data.tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      params.push(JSON.stringify(data.tags));
    }

    if (data.labels !== undefined) {
      updates.push(`labels = $${paramIndex++}`);
      params.push(JSON.stringify(data.labels));
    }

    // Set started_at when status changes to in_progress
    if (data.status === 'in_progress') {
      updates.push(`started_at = COALESCE(started_at, NOW())`);
    }

    // Set completed_at when status changes to done
    if (data.status === 'done') {
      updates.push(`completed_at = COALESCE(completed_at, NOW())`);
    }

    params.push(id);

    const sql = `
      UPDATE tasks
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, project_id, title, description,
                status, priority, task_type, assignee_id, reporter_id,
                due_date, start_date, estimated_hours, actual_hours,
                order_index, parent_task_id, depends_on, tags, labels,
                story_points, sprint_id, created_at, updated_at,
                started_at, completed_at
    `;

    const rows = await this.client.query<TaskRow>(sql, params);
    return this.mapTask(rows[0]);
  }

  /**
   * Update task status
   */
  async updateTaskStatus(id: string, status: string): Promise<Task> {
    return this.updateTask(id, { status: status as any });
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    await this.client.execute('DELETE FROM tasks WHERE id = $1', [id]);
  }

  /**
   * Get task stats
   */
  async getTaskStats(projectId?: string): Promise<TaskStats> {
    const projectCondition = projectId ? 'WHERE project_id = $1' : '';
    const params = projectId ? [projectId] : [];

    const sql = `
      SELECT
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'todo') as todo_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'done') as completed_tasks,
        COUNT(*) FILTER (WHERE status = 'blocked') as blocked_tasks,
        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'done') as overdue_tasks,
        COALESCE(SUM(estimated_hours), 0) as total_estimated_hours,
        COALESCE(SUM(actual_hours), 0) as total_actual_hours
      FROM tasks
      ${projectCondition}
    `;

    const rows = await this.client.query<{
      total_tasks: string;
      todo_tasks: string;
      in_progress_tasks: string;
      completed_tasks: string;
      blocked_tasks: string;
      overdue_tasks: string;
      total_estimated_hours: string;
      total_actual_hours: string;
    }>(sql, params);

    return {
      totalTasks: parseInt(rows[0].total_tasks, 10),
      todoTasks: parseInt(rows[0].todo_tasks, 10),
      inProgressTasks: parseInt(rows[0].in_progress_tasks, 10),
      completedTasks: parseInt(rows[0].completed_tasks, 10),
      blockedTasks: parseInt(rows[0].blocked_tasks, 10),
      overdueTasks: parseInt(rows[0].overdue_tasks, 10),
      totalEstimatedHours: parseFloat(rows[0].total_estimated_hours),
      totalActualHours: parseFloat(rows[0].total_actual_hours),
    };
  }

  /**
   * Get Kanban board view
   */
  async getKanbanBoard(projectId?: string): Promise<KanbanBoard> {
    const projectCondition = projectId ? 'WHERE t.project_id = $1' : '';
    const params = projectId ? [projectId] : [];

    const sql = `
      SELECT t.id, t.airtable_id, t.project_id, t.title, t.description,
             t.status, t.priority, t.task_type, t.assignee_id, t.reporter_id,
             t.due_date, t.start_date, t.estimated_hours, t.actual_hours,
             t.order_index, t.parent_task_id, t.depends_on, t.tags, t.labels,
             t.story_points, t.sprint_id, t.created_at, t.updated_at,
             t.started_at, t.completed_at
      FROM tasks t
      ${projectCondition}
      ORDER BY t.order_index ASC, t.created_at DESC
    `;

    const rows = await this.client.query<TaskRow>(sql, params);
    const tasks = rows.map(row => this.mapTask(row));

    // Group tasks by status
    const columns: KanbanColumn[] = [
      { id: 'backlog', title: 'Backlog', tasks: [] },
      { id: 'todo', title: 'To Do', tasks: [] },
      { id: 'in_progress', title: 'In Progress', tasks: [] },
      { id: 'review', title: 'Review', tasks: [] },
      { id: 'done', title: 'Done', tasks: [] },
      { id: 'blocked', title: 'Blocked', tasks: [] },
      { id: 'cancelled', title: 'Cancelled', tasks: [] },
    ];

    for (const task of tasks) {
      const column = columns.find(col => col.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    }

    return {
      columns,
      totalTasks: tasks.length,
    };
  }

  // ============================================================================
  // Template Operations
  // ============================================================================

  /**
   * Get template by ID
   */
  async getTemplateById(id: string): Promise<ProcessTemplate | null> {
    const sql = `
      SELECT id, airtable_id, name, description, category, template_type,
             steps, default_assignees, estimated_duration_hours,
             estimated_duration_days, is_active, is_public, usage_count,
             entity_scope, created_by, created_at, updated_at, metadata
      FROM process_templates
      WHERE id = $1
    `;

    const rows = await this.client.query<TemplateRow>(sql, [id]);
    return rows.length > 0 ? this.mapTemplate(rows[0]) : null;
  }

  /**
   * List templates with filters and pagination
   */
  async listTemplates(options: TemplateListOptions = {}): Promise<TemplateListResult> {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options.entityScope) {
      conditions.push(`entity_scope = $${paramIndex++}`);
      params.push(options.entityScope);
    }

    if (options.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(options.category);
    }

    if (options.templateType) {
      conditions.push(`template_type = $${paramIndex++}`);
      params.push(options.templateType);
    }

    if (options.isActive !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      params.push(options.isActive);
    }

    if (options.search) {
      conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM process_templates ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT id, airtable_id, name, description, category, template_type,
             steps, default_assignees, estimated_duration_hours,
             estimated_duration_days, is_active, is_public, usage_count,
             entity_scope, created_by, created_at, updated_at, metadata
      FROM process_templates
      ${whereClause}
      ORDER BY name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<TemplateRow>(sql, params);

    return {
      data: rows.map(row => this.mapTemplate(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new template
   */
  async createTemplate(data: CreateTemplateInput): Promise<ProcessTemplate> {
    const sql = `
      INSERT INTO process_templates (
        name, description, category, template_type, steps, default_assignees,
        estimated_duration_hours, estimated_duration_days, is_active, is_public,
        entity_scope, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, airtable_id, name, description, category, template_type,
                steps, default_assignees, estimated_duration_hours,
                estimated_duration_days, is_active, is_public, usage_count,
                entity_scope, created_by, created_at, updated_at, metadata
    `;

    const rows = await this.client.query<TemplateRow>(sql, [
      data.name,
      data.description || null,
      data.category || null,
      data.templateType || 'project',
      JSON.stringify(data.steps),
      JSON.stringify(data.defaultAssignees || {}),
      data.estimatedDurationHours || null,
      data.estimatedDurationDays || null,
      data.isActive ?? true,
      data.isPublic ?? false,
      data.entityScope || null,
      JSON.stringify(data.metadata || {}),
    ]);

    return this.mapTemplate(rows[0]);
  }

  /**
   * Update a template
   */
  async updateTemplate(id: string, data: UpdateTemplateInput): Promise<ProcessTemplate> {
    const updates: string[] = [];
    const params: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const fields: Array<[keyof UpdateTemplateInput, string]> = [
      ['name', 'name'],
      ['description', 'description'],
      ['category', 'category'],
      ['templateType', 'template_type'],
      ['estimatedDurationHours', 'estimated_duration_hours'],
      ['estimatedDurationDays', 'estimated_duration_days'],
      ['isActive', 'is_active'],
      ['isPublic', 'is_public'],
    ];

    for (const [key, column] of fields) {
      if (data[key] !== undefined) {
        updates.push(`${column} = $${paramIndex++}`);
        params.push(data[key] as string | number | boolean | null);
      }
    }

    if (data.steps !== undefined) {
      updates.push(`steps = $${paramIndex++}`);
      params.push(JSON.stringify(data.steps));
    }

    if (data.defaultAssignees !== undefined) {
      updates.push(`default_assignees = $${paramIndex++}`);
      params.push(JSON.stringify(data.defaultAssignees));
    }

    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      params.push(JSON.stringify(data.metadata));
    }

    params.push(id);

    const sql = `
      UPDATE process_templates
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, airtable_id, name, description, category, template_type,
                steps, default_assignees, estimated_duration_hours,
                estimated_duration_days, is_active, is_public, usage_count,
                entity_scope, created_by, created_at, updated_at, metadata
    `;

    const rows = await this.client.query<TemplateRow>(sql, params);
    return this.mapTemplate(rows[0]);
  }

  // ============================================================================
  // Sprint Operations
  // ============================================================================

  /**
   * List sprints for a project
   */
  async listSprints(options: SprintListOptions): Promise<SprintListResult> {
    const conditions: string[] = ['s.project_id = $1'];
    const params: (string | number)[] = [options.projectId];
    let paramIndex = 2;

    if (options.status) {
      conditions.push(`s.status = $${paramIndex++}`);
      params.push(options.status);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    // Count query
    const countSql = `SELECT COUNT(*) as count FROM sprints s ${whereClause}`;
    const countRows = await this.client.query<{ count: string }>(countSql, params);
    const total = parseInt(countRows[0].count, 10);

    // Data query
    const sql = `
      SELECT s.id, s.project_id, s.name, s.goal, s.status,
             s.start_date, s.end_date, s.velocity,
             s.created_at, s.updated_at,
             (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id) as task_count,
             (SELECT COUNT(*) FROM tasks t WHERE t.sprint_id = s.id AND t.status = 'done') as completed_task_count,
             (SELECT COALESCE(SUM(story_points), 0) FROM tasks t WHERE t.sprint_id = s.id) as total_story_points,
             (SELECT COALESCE(SUM(story_points), 0) FROM tasks t WHERE t.sprint_id = s.id AND t.status = 'done') as completed_story_points
      FROM sprints s
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const rows = await this.client.query<SprintRow>(sql, params);

    return {
      data: rows.map(row => this.mapSprint(row)),
      total,
      limit,
      offset,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Create a new sprint
   */
  async createSprint(data: CreateSprintInput): Promise<Sprint> {
    const sql = `
      INSERT INTO sprints (
        project_id, name, goal, status, start_date, end_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, project_id, name, goal, status,
                start_date, end_date, velocity,
                created_at, updated_at
    `;

    const rows = await this.client.query<SprintRow>(sql, [
      data.projectId,
      data.name,
      data.goal || null,
      data.status || 'planning',
      data.startDate || null,
      data.endDate || null,
    ]);

    return this.mapSprint(rows[0]);
  }

  /**
   * Update a sprint
   */
  async updateSprint(id: string, data: UpdateSprintInput): Promise<Sprint> {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(data.name);
    }
    if (data.goal !== undefined) {
      updates.push(`goal = $${paramIndex++}`);
      params.push(data.goal);
    }
    if (data.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(data.status);
    }
    if (data.startDate !== undefined) {
      updates.push(`start_date = $${paramIndex++}`);
      params.push(data.startDate);
    }
    if (data.endDate !== undefined) {
      updates.push(`end_date = $${paramIndex++}`);
      params.push(data.endDate);
    }

    params.push(id);

    const sql = `
      UPDATE sprints
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, project_id, name, goal, status,
                start_date, end_date, velocity,
                created_at, updated_at
    `;

    const rows = await this.client.query<SprintRow>(sql, params);
    return this.mapSprint(rows[0]);
  }

  // ============================================================================
  // Mapping Functions
  // ============================================================================

  private mapProject(row: ProjectRow): Project {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      name: row.name,
      description: row.description || undefined,
      projectCode: row.project_code || undefined,
      status: row.status as Project['status'],
      priority: row.priority as Project['priority'],
      projectType: row.project_type || undefined,
      startDate: row.start_date || undefined,
      dueDate: row.due_date || undefined,
      completedAt: row.completed_at || undefined,
      budgetCents: row.budget_cents || undefined,
      currency: row.currency,
      actualCostCents: row.actual_cost_cents,
      progressPercent: row.progress_percent,
      ownerId: row.owner_id || undefined,
      teamMembers: row.team_members,
      tags: row.tags,
      entityScope: row.entity_scope as Project['entityScope'],
      templateId: row.template_id || undefined,
      parentProjectId: row.parent_project_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      metadata: row.metadata || undefined,
      taskCount: row.task_count,
      completedTaskCount: row.completed_task_count,
      overdueTaskCount: row.overdue_task_count,
    };
  }

  private mapTask(row: TaskRow): Task {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      projectId: row.project_id || undefined,
      title: row.title,
      description: row.description || undefined,
      status: row.status as Task['status'],
      priority: row.priority as Task['priority'],
      taskType: row.task_type as Task['taskType'],
      assigneeId: row.assignee_id || undefined,
      reporterId: row.reporter_id || undefined,
      dueDate: row.due_date || undefined,
      startDate: row.start_date || undefined,
      estimatedHours: row.estimated_hours || undefined,
      actualHours: row.actual_hours,
      orderIndex: row.order_index,
      parentTaskId: row.parent_task_id || undefined,
      dependsOn: row.depends_on,
      tags: row.tags,
      labels: row.labels,
      storyPoints: row.story_points || undefined,
      sprintId: row.sprint_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      startedAt: row.started_at || undefined,
      completedAt: row.completed_at || undefined,
      commentCount: row.comment_count,
      attachmentCount: row.attachment_count,
    };
  }

  private mapTemplate(row: TemplateRow): ProcessTemplate {
    return {
      id: row.id,
      airtableId: row.airtable_id || undefined,
      name: row.name,
      description: row.description || undefined,
      category: row.category || undefined,
      templateType: row.template_type as ProcessTemplate['templateType'],
      steps: row.steps,
      defaultAssignees: row.default_assignees,
      estimatedDurationHours: row.estimated_duration_hours || undefined,
      estimatedDurationDays: row.estimated_duration_days || undefined,
      isActive: row.is_active,
      isPublic: row.is_public,
      usageCount: row.usage_count,
      entityScope: row.entity_scope as ProcessTemplate['entityScope'],
      createdBy: row.created_by || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      metadata: row.metadata || undefined,
    };
  }

  private mapSprint(row: SprintRow): Sprint {
    return {
      id: row.id,
      projectId: row.project_id,
      name: row.name,
      goal: row.goal || undefined,
      status: row.status as Sprint['status'],
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
      velocity: row.velocity || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      taskCount: row.task_count,
      completedTaskCount: row.completed_task_count,
      totalStoryPoints: row.total_story_points,
      completedStoryPoints: row.completed_story_points,
    };
  }
}
