/**
 * Shared Types for Admin Dashboard (Client-Safe)
 *
 * This file contains database model types that are safe to import in client components.
 * It contains NO server-side imports (no pg, no database queries).
 *
 * Import from this file in client components to avoid bundling server code.
 */

// ============================================================================
// Task Types
// ============================================================================

export interface DBTask {
  id: string;
  name: string;
  description: string | null;
  project_id: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string | null;
  // Additional computed/joined fields
  task_code?: string;
  project_title?: string;
  assignee_name?: string;
  assignee_email?: string;
  comment_count?: number;
  attachment_count?: number;
  time_spent_minutes?: number;
  estimated_minutes?: number | null;
  parent_task_id?: string | null;
  subtask_count?: number;
  completed_subtask_count?: number;
  sprint_id?: string | null;
  sprint_name?: string;
}

// ============================================================================
// Project Types
// ============================================================================

export interface DBProject {
  id: string;
  title: string;
  description: string | null;
  status: 'active' | 'paused' | 'completed' | 'archived';
  created_at: string;
  updated_at: string | null;
  // Computed fields
  task_count?: number;
  completed_task_count?: number;
  progress?: number;
}

// ============================================================================
// Comment Types
// ============================================================================

export interface DBComment {
  id: string;
  content: string;
  author_id: string | null;
  author_name: string | null;
  author_email: string | null;
  project_id: string | null;
  task_id: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string | null;
  // Computed fields
  reply_count?: number;
  children?: DBComment[];
}

// ============================================================================
// Attachment Types
// ============================================================================

export interface DBAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_key: string | null;
  bucket: string;
  file_type: string | null;
  file_size_bytes: number | null;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  uploaded_by_email: string | null;
  created_at: string;
  // Joined fields
  task_name?: string;
  task_code?: string;
  project_id?: string;
  project_title?: string;
}

// ============================================================================
// Time Entry Types
// ============================================================================

export interface DBTimeEntry {
  id: string;
  task_id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  duration_minutes: number;
  description: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  // Joined fields
  task_name?: string;
  task_code?: string;
  project_id?: string;
  project_title?: string;
}

// ============================================================================
// Sprint Types
// ============================================================================

export interface DBSprint {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  goal: string | null;
  created_at: string;
  updated_at: string | null;
  // Computed fields
  task_count?: number;
  completed_task_count?: number;
  progress?: number;
}

// ============================================================================
// Template Types
// ============================================================================

export interface DBProcessTemplate {
  id: string;
  name: string;
  description: string | null;
  template_data: unknown;
  created_at: string;
  updated_at: string | null;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface TaskFilters {
  projectId?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  sprintId?: string;
  parentTaskId?: string | null;
  limit?: number;
  offset?: number;
}

export interface ProjectFilters {
  status?: string;
  limit?: number;
  offset?: number;
}

export interface CommentFilters {
  projectId?: string;
  taskId?: string;
  parentId?: string | null;
  limit?: number;
  offset?: number;
}

export interface AttachmentFilters {
  taskId?: string;
  uploadedBy?: string;
  projectId?: string;
  fileType?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export type TaskStatus = DBTask['status'];
export type TaskPriority = DBTask['priority'];
export type ProjectStatus = DBProject['status'];
export type SprintStatus = DBSprint['status'];
