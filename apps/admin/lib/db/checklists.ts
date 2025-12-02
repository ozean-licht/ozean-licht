/**
 * Checklists Database Queries
 *
 * Database queries for checklist templates and task checklists.
 * Part of Project Management MVP v2.0 - Content Production Focus
 */

import { query, execute } from './index';

// ============================================
// TYPES
// ============================================

export interface ChecklistItem {
  id: string;
  title: string;
  required?: boolean;
  order: number;
  checked?: boolean;
  checked_by?: string;
  checked_at?: string;
}

export interface DBChecklistTemplate {
  id: string;
  name: string;
  description: string | null;
  task_type: string | null;
  content_type_id: string | null;
  items: ChecklistItem[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  content_type_name?: string;
  usage_count?: number;
}

export interface DBTaskChecklist {
  id: string;
  task_id: string;
  template_id: string | null;
  title: string | null;
  items: ChecklistItem[];
  progress_percent: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  task_name?: string;
  template_name?: string;
}

// ============================================
// CHECKLIST TEMPLATES
// ============================================

/**
 * Get all checklist templates
 */
export async function getAllChecklistTemplates(filters: {
  taskType?: string;
  contentTypeId?: string;
  isActive?: boolean;
} = {}): Promise<DBChecklistTemplate[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters.taskType) {
    conditions.push(`ct.task_type = $${paramIndex++}`);
    params.push(filters.taskType);
  }

  if (filters.contentTypeId) {
    conditions.push(`ct.content_type_id = $${paramIndex++}`);
    params.push(filters.contentTypeId);
  }

  if (filters.isActive !== undefined) {
    conditions.push(`ct.is_active = $${paramIndex++}`);
    params.push(filters.isActive);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      ct.id, ct.name, ct.description, ct.task_type, ct.content_type_id,
      ct.items, ct.is_active, ct.created_by, ct.created_at, ct.updated_at,
      ctype.name as content_type_name,
      COUNT(tc.id)::int as usage_count
    FROM checklist_templates ct
    LEFT JOIN content_types ctype ON ctype.id = ct.content_type_id
    LEFT JOIN task_checklists tc ON tc.template_id = ct.id
    ${whereClause}
    GROUP BY ct.id, ctype.name
    ORDER BY ct.name ASC
  `;

  return query<DBChecklistTemplate>(sql, params);
}

/**
 * Get a checklist template by ID
 */
export async function getChecklistTemplateById(id: string): Promise<DBChecklistTemplate | null> {
  const sql = `
    SELECT
      ct.id, ct.name, ct.description, ct.task_type, ct.content_type_id,
      ct.items, ct.is_active, ct.created_by, ct.created_at, ct.updated_at,
      ctype.name as content_type_name
    FROM checklist_templates ct
    LEFT JOIN content_types ctype ON ctype.id = ct.content_type_id
    WHERE ct.id = $1
  `;

  const rows = await query<DBChecklistTemplate>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Get checklist template for a content type
 */
export async function getDefaultChecklistForContentType(
  contentTypeId: string
): Promise<DBChecklistTemplate | null> {
  const sql = `
    SELECT
      ct.id, ct.name, ct.description, ct.task_type, ct.content_type_id,
      ct.items, ct.is_active, ct.created_by, ct.created_at, ct.updated_at
    FROM checklist_templates ct
    WHERE ct.content_type_id = $1 AND ct.is_active = true
    ORDER BY ct.created_at ASC
    LIMIT 1
  `;

  const rows = await query<DBChecklistTemplate>(sql, [contentTypeId]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a checklist template
 */
export async function createChecklistTemplate(data: {
  name: string;
  description?: string;
  task_type?: string;
  content_type_id?: string;
  items: ChecklistItem[];
  created_by?: string;
}): Promise<DBChecklistTemplate> {
  const sql = `
    INSERT INTO checklist_templates (name, description, task_type, content_type_id, items, created_by)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, description, task_type, content_type_id, items, is_active, created_by, created_at, updated_at
  `;

  const rows = await query<DBChecklistTemplate>(sql, [
    data.name,
    data.description || null,
    data.task_type || null,
    data.content_type_id || null,
    JSON.stringify(data.items),
    data.created_by || null,
  ]);

  return rows[0];
}

/**
 * Update a checklist template
 */
export async function updateChecklistTemplate(
  id: string,
  data: Partial<Pick<DBChecklistTemplate, 'name' | 'description' | 'task_type' | 'content_type_id' | 'items' | 'is_active'>>
): Promise<DBChecklistTemplate | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  const fieldMappings: Array<{ key: keyof typeof data; column: string; isJson?: boolean }> = [
    { key: 'name', column: 'name' },
    { key: 'description', column: 'description' },
    { key: 'task_type', column: 'task_type' },
    { key: 'content_type_id', column: 'content_type_id' },
    { key: 'items', column: 'items', isJson: true },
    { key: 'is_active', column: 'is_active' },
  ];

  for (const { key, column, isJson } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(isJson ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (setClauses.length === 0) return null;

  setClauses.push('updated_at = NOW()');
  params.push(id);

  const sql = `
    UPDATE checklist_templates
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, name, description, task_type, content_type_id, items, is_active, created_by, created_at, updated_at
  `;

  const rows = await query<DBChecklistTemplate>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Delete a checklist template (soft delete)
 */
export async function deleteChecklistTemplate(id: string): Promise<boolean> {
  const result = await execute(
    'UPDATE checklist_templates SET is_active = false WHERE id = $1',
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

// ============================================
// TASK CHECKLISTS
// ============================================

/**
 * Get all checklists for a task
 */
export async function getTaskChecklists(taskId: string): Promise<DBTaskChecklist[]> {
  const sql = `
    SELECT
      tc.id, tc.task_id, tc.template_id, tc.title, tc.items, tc.progress_percent,
      tc.created_at, tc.updated_at,
      t.name as task_name,
      ct.name as template_name
    FROM task_checklists tc
    LEFT JOIN tasks t ON t.id = tc.task_id
    LEFT JOIN checklist_templates ct ON ct.id = tc.template_id
    WHERE tc.task_id = $1
    ORDER BY tc.created_at ASC
  `;

  return query<DBTaskChecklist>(sql, [taskId]);
}

/**
 * Get a task checklist by ID
 */
export async function getTaskChecklistById(id: string): Promise<DBTaskChecklist | null> {
  const sql = `
    SELECT
      tc.id, tc.task_id, tc.template_id, tc.title, tc.items, tc.progress_percent,
      tc.created_at, tc.updated_at,
      t.name as task_name,
      ct.name as template_name
    FROM task_checklists tc
    LEFT JOIN tasks t ON t.id = tc.task_id
    LEFT JOIN checklist_templates ct ON ct.id = tc.template_id
    WHERE tc.id = $1
  `;

  const rows = await query<DBTaskChecklist>(sql, [id]);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Create a task checklist
 */
export async function createTaskChecklist(data: {
  task_id: string;
  template_id?: string;
  title?: string;
  items?: ChecklistItem[];
}): Promise<DBTaskChecklist> {
  // If template_id provided, get items from template
  let items = data.items || [];

  if (data.template_id && !data.items) {
    const template = await getChecklistTemplateById(data.template_id);
    if (template) {
      items = template.items.map((item) => ({
        ...item,
        checked: false,
        checked_by: undefined,
        checked_at: undefined,
      }));
    }
  }

  const sql = `
    INSERT INTO task_checklists (task_id, template_id, title, items, progress_percent)
    VALUES ($1, $2, $3, $4, 0)
    RETURNING id, task_id, template_id, title, items, progress_percent, created_at, updated_at
  `;

  const rows = await query<DBTaskChecklist>(sql, [
    data.task_id,
    data.template_id || null,
    data.title || null,
    JSON.stringify(items),
  ]);

  return rows[0];
}

/**
 * Create a task checklist from a template
 */
export async function createTaskChecklistFromTemplate(
  taskId: string,
  templateId: string
): Promise<DBTaskChecklist> {
  return createTaskChecklist({ task_id: taskId, template_id: templateId });
}

/**
 * Update a task checklist
 */
export async function updateTaskChecklist(
  id: string,
  data: Partial<Pick<DBTaskChecklist, 'title' | 'items'>>
): Promise<DBTaskChecklist | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    params.push(data.title);
  }

  if (data.items !== undefined) {
    setClauses.push(`items = $${paramIndex++}`);
    params.push(JSON.stringify(data.items));

    // Calculate progress
    const checkedCount = data.items.filter((item) => item.checked).length;
    const totalCount = data.items.length;
    const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

    setClauses.push(`progress_percent = $${paramIndex++}`);
    params.push(progressPercent);
  }

  if (setClauses.length === 0) return null;

  setClauses.push('updated_at = NOW()');
  params.push(id);

  const sql = `
    UPDATE task_checklists
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, task_id, template_id, title, items, progress_percent, created_at, updated_at
  `;

  const rows = await query<DBTaskChecklist>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Toggle a checklist item
 */
export async function toggleChecklistItem(
  checklistId: string,
  itemId: string,
  userId: string
): Promise<DBTaskChecklist | null> {
  const checklist = await getTaskChecklistById(checklistId);
  if (!checklist) return null;

  const updatedItems = checklist.items.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        checked: !item.checked,
        checked_by: !item.checked ? userId : undefined,
        checked_at: !item.checked ? new Date().toISOString() : undefined,
      };
    }
    return item;
  });

  return updateTaskChecklist(checklistId, { items: updatedItems });
}

/**
 * Check/uncheck a specific checklist item
 */
export async function setChecklistItemChecked(
  checklistId: string,
  itemId: string,
  checked: boolean,
  userId?: string
): Promise<DBTaskChecklist | null> {
  const checklist = await getTaskChecklistById(checklistId);
  if (!checklist) return null;

  const updatedItems = checklist.items.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        checked,
        checked_by: checked ? userId : undefined,
        checked_at: checked ? new Date().toISOString() : undefined,
      };
    }
    return item;
  });

  return updateTaskChecklist(checklistId, { items: updatedItems });
}

/**
 * Delete a task checklist
 */
export async function deleteTaskChecklist(id: string): Promise<boolean> {
  const result = await execute('DELETE FROM task_checklists WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Get checklist progress for a task
 */
export async function getTaskChecklistProgress(taskId: string): Promise<{
  total_items: number;
  checked_items: number;
  progress_percent: number;
}> {
  const checklists = await getTaskChecklists(taskId);

  let totalItems = 0;
  let checkedItems = 0;

  for (const checklist of checklists) {
    totalItems += checklist.items.length;
    checkedItems += checklist.items.filter((item) => item.checked).length;
  }

  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return {
    total_items: totalItems,
    checked_items: checkedItems,
    progress_percent: progressPercent,
  };
}
