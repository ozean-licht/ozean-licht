/**
 * Project Types - Projects, Tasks, Templates, Sprints
 * Part of Airtable MCP Migration
 */

// Entity scope for multi-tenant support
export type ProjectEntityScope = 'ozean_licht' | 'kids_ascension' | 'shared';

// Project status
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'archived';

// Priority levels
export type Priority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';

// Task status
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'blocked' | 'cancelled';

// Task type
export type TaskType = 'task' | 'bug' | 'feature' | 'improvement' | 'documentation' | 'research';

// Template type
export type TemplateType = 'project' | 'workflow' | 'checklist' | 'sprint';

// Sprint status
export type SprintStatus = 'planning' | 'active' | 'completed' | 'cancelled';

// Activity type
export type TaskActivityType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'assigned'
  | 'unassigned'
  | 'commented'
  | 'attachment_added'
  | 'attachment_removed'
  | 'due_date_changed'
  | 'priority_changed'
  | 'time_logged';

/**
 * Project entity
 */
export interface Project {
  id: string;
  airtableId?: string;
  name: string;
  description?: string;
  projectCode?: string;
  status: ProjectStatus;
  priority: Priority;
  projectType?: string;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  budgetCents?: number;
  currency: string;
  actualCostCents: number;
  progressPercent: number;
  ownerId?: string;
  teamMembers: string[];
  tags: string[];
  entityScope?: ProjectEntityScope;
  templateId?: string;
  parentProjectId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
  // Computed/joined fields
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  taskCount?: number;
  completedTaskCount?: number;
  overdueTaskCount?: number;
}

/**
 * Task entity
 */
export interface Task {
  id: string;
  airtableId?: string;
  projectId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  taskType: TaskType;
  assigneeId?: string;
  reporterId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours: number;
  orderIndex: number;
  parentTaskId?: string;
  dependsOn: string[];
  tags: string[];
  labels: string[];
  storyPoints?: number;
  sprintId?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  // Computed/joined fields
  project?: Project;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  reporter?: {
    id: string;
    name: string;
    email: string;
  };
  subtasks?: Task[];
  commentCount?: number;
  attachmentCount?: number;
}

/**
 * Process template entity
 */
export interface ProcessTemplate {
  id: string;
  airtableId?: string;
  name: string;
  description?: string;
  category?: string;
  templateType: TemplateType;
  steps: TemplateStep[];
  defaultAssignees: Record<string, string>;
  estimatedDurationHours?: number;
  estimatedDurationDays?: number;
  isActive: boolean;
  isPublic: boolean;
  usageCount: number;
  entityScope?: ProjectEntityScope;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * Template step
 */
export interface TemplateStep {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  estimatedHours?: number;
  assigneeRole?: string;
  dependencies?: string[];
  taskType?: TaskType;
  checklist?: string[];
}

/**
 * Task comment entity
 */
export interface TaskComment {
  id: string;
  taskId: string;
  userId?: string;
  content: string;
  parentCommentId?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Computed/joined fields
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  replies?: TaskComment[];
}

/**
 * Task attachment entity
 */
export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSizeBytes?: number;
  uploadedBy?: string;
  createdAt: string;
}

/**
 * Task time entry entity
 */
export interface TaskTimeEntry {
  id: string;
  taskId: string;
  userId?: string;
  description?: string;
  durationMinutes: number;
  startedAt?: string;
  endedAt?: string;
  isBillable: boolean;
  createdAt: string;
  // Computed/joined fields
  user?: {
    id: string;
    name: string;
  };
}

/**
 * Task activity entity
 */
export interface TaskActivity {
  id: string;
  taskId: string;
  userId?: string;
  activityType: TaskActivityType;
  oldValue?: string;
  newValue?: string;
  details?: Record<string, unknown>;
  createdAt: string;
  // Computed/joined fields
  user?: {
    id: string;
    name: string;
  };
}

/**
 * Sprint entity
 */
export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal?: string;
  status: SprintStatus;
  startDate?: string;
  endDate?: string;
  velocity?: number;
  createdAt: string;
  updatedAt: string;
  // Computed/joined fields
  taskCount?: number;
  completedTaskCount?: number;
  totalStoryPoints?: number;
  completedStoryPoints?: number;
}

// Input types for CRUD operations

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  projectType?: string;
  startDate?: string;
  dueDate?: string;
  budgetCents?: number;
  currency?: string;
  ownerId?: string;
  teamMembers?: string[];
  tags?: string[];
  entityScope?: ProjectEntityScope;
  templateId?: string;
  parentProjectId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  projectType?: string;
  startDate?: string;
  dueDate?: string;
  budgetCents?: number;
  currency?: string;
  ownerId?: string;
  teamMembers?: string[];
  tags?: string[];
  entityScope?: ProjectEntityScope;
  metadata?: Record<string, unknown>;
}

export interface CreateTaskInput {
  projectId?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  taskType?: TaskType;
  assigneeId?: string;
  reporterId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  orderIndex?: number;
  parentTaskId?: string;
  dependsOn?: string[];
  tags?: string[];
  labels?: string[];
  storyPoints?: number;
  sprintId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  taskType?: TaskType;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  orderIndex?: number;
  parentTaskId?: string;
  dependsOn?: string[];
  tags?: string[];
  labels?: string[];
  storyPoints?: number;
  sprintId?: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  category?: string;
  templateType?: TemplateType;
  steps: TemplateStep[];
  defaultAssignees?: Record<string, string>;
  estimatedDurationHours?: number;
  estimatedDurationDays?: number;
  isActive?: boolean;
  isPublic?: boolean;
  entityScope?: ProjectEntityScope;
  metadata?: Record<string, unknown>;
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  category?: string;
  templateType?: TemplateType;
  steps?: TemplateStep[];
  defaultAssignees?: Record<string, string>;
  estimatedDurationHours?: number;
  estimatedDurationDays?: number;
  isActive?: boolean;
  isPublic?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateCommentInput {
  taskId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}

export interface CreateTimeEntryInput {
  taskId: string;
  description?: string;
  durationMinutes: number;
  startedAt?: string;
  endedAt?: string;
  isBillable?: boolean;
}

export interface CreateSprintInput {
  projectId: string;
  name: string;
  goal?: string;
  status?: SprintStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateSprintInput {
  name?: string;
  goal?: string;
  status?: SprintStatus;
  startDate?: string;
  endDate?: string;
}

// List options

export interface ProjectListOptions {
  entityScope?: ProjectEntityScope;
  status?: ProjectStatus;
  priority?: Priority;
  ownerId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface TaskListOptions {
  projectId?: string;
  status?: TaskStatus;
  priority?: Priority;
  taskType?: TaskType;
  assigneeId?: string;
  sprintId?: string;
  parentTaskId?: string;
  hasParent?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface TemplateListOptions {
  entityScope?: ProjectEntityScope;
  category?: string;
  templateType?: TemplateType;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface SprintListOptions {
  projectId: string;
  status?: SprintStatus;
  limit?: number;
  offset?: number;
}

// Paginated results

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type ProjectListResult = PaginatedResult<Project>;
export type TaskListResult = PaginatedResult<Task>;
export type TemplateListResult = PaginatedResult<ProcessTemplate>;
export type SprintListResult = PaginatedResult<Sprint>;

// Stats types

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  totalBudget: number;
  totalSpent: number;
}

export interface TaskStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  totalEstimatedHours: number;
  totalActualHours: number;
}

// Kanban types

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  totalTasks: number;
}

// Display helpers

export function getProjectStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    planning: 'blue',
    active: 'green',
    on_hold: 'yellow',
    completed: 'teal',
    cancelled: 'red',
    archived: 'gray',
  };
  return colors[status] || 'gray';
}

export function getTaskStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    backlog: 'gray',
    todo: 'blue',
    in_progress: 'yellow',
    review: 'purple',
    done: 'green',
    blocked: 'red',
    cancelled: 'gray',
  };
  return colors[status] || 'gray';
}

export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'gray',
    medium: 'blue',
    high: 'orange',
    urgent: 'red',
    critical: 'red',
  };
  return colors[priority] || 'gray';
}

export function getTaskTypeIcon(type: TaskType): string {
  const icons: Record<TaskType, string> = {
    task: 'check-square',
    bug: 'bug',
    feature: 'star',
    improvement: 'trending-up',
    documentation: 'file-text',
    research: 'search',
  };
  return icons[type] || 'check-square';
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// =============================================================================
// Phase 12: Notifications & Collaboration
// =============================================================================

// Notification type
export type NotificationType =
  | 'mention'
  | 'assignment'
  | 'comment'
  | 'task_update'
  | 'project_update'
  | 'due_date'
  | 'system';

// Email digest frequency
export type EmailDigestFrequency = 'none' | 'instant' | 'daily' | 'weekly';

/**
 * Notification entity
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  isRead: boolean;
  entityType?: 'task' | 'project' | 'comment';
  entityId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  // Joined fields
  actor?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Notification preferences entity
 */
export interface NotificationPreferences {
  userId: string;
  inApp: boolean;
  emailDigest: EmailDigestFrequency;
  mentionNotify: boolean;
  assignmentNotify: boolean;
  commentNotify: boolean;
  taskUpdateNotify: boolean;
  projectUpdateNotify: boolean;
  dueDateNotify: boolean;
  systemNotify: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notification list result
 */
export interface NotificationListResult {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

/**
 * Get notification type icon
 */
export function getNotificationTypeIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    mention: 'at-sign',
    assignment: 'user-plus',
    comment: 'message-circle',
    task_update: 'check-square',
    project_update: 'folder',
    due_date: 'clock',
    system: 'bell',
  };
  return icons[type] || 'bell';
}

/**
 * Get notification type color
 */
export function getNotificationTypeColor(type: NotificationType): string {
  const colors: Record<NotificationType, string> = {
    mention: 'blue',
    assignment: 'green',
    comment: 'purple',
    task_update: 'yellow',
    project_update: 'teal',
    due_date: 'orange',
    system: 'gray',
  };
  return colors[type] || 'gray';
}

// =============================================================================
// Phase 13: Advanced Views
// =============================================================================

/**
 * Filter state for saved filters
 */
export interface FilterState {
  projectId?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  sprintId?: string;
  taskType?: TaskType;
  search?: string;
  tab?: 'active' | 'overdue' | 'planned' | 'done';
}

/**
 * Saved filter preset
 */
export interface FilterPreset {
  id: string;
  name: string;
  filter: FilterState;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Column definition for customizable views
 */
export interface ColumnDefinition {
  id: string;
  label: string;
  accessor: keyof Task | string;
  sortable?: boolean;
  width?: number;
  visible?: boolean;
}

/**
 * Default task columns
 */
export const DEFAULT_TASK_COLUMNS: ColumnDefinition[] = [
  { id: 'title', label: 'Title', accessor: 'title', sortable: true, visible: true },
  { id: 'status', label: 'Status', accessor: 'status', sortable: true, visible: true },
  { id: 'priority', label: 'Priority', accessor: 'priority', sortable: true, visible: true },
  { id: 'assignee', label: 'Assignee', accessor: 'assignee', sortable: true, visible: true },
  { id: 'dueDate', label: 'Due Date', accessor: 'dueDate', sortable: true, visible: true },
  { id: 'project', label: 'Project', accessor: 'project', sortable: true, visible: true },
  { id: 'taskType', label: 'Type', accessor: 'taskType', sortable: true, visible: false },
  { id: 'estimatedHours', label: 'Estimated', accessor: 'estimatedHours', sortable: true, visible: false },
  { id: 'actualHours', label: 'Actual Hours', accessor: 'actualHours', sortable: true, visible: false },
  { id: 'storyPoints', label: 'Story Points', accessor: 'storyPoints', sortable: true, visible: false },
  { id: 'createdAt', label: 'Created', accessor: 'createdAt', sortable: true, visible: false },
  { id: 'updatedAt', label: 'Updated', accessor: 'updatedAt', sortable: true, visible: false },
];

/**
 * Timeline bar for Gantt view
 */
export interface TimelineTask {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  status: TaskStatus;
  priority: Priority;
  assignee?: { id: string; name: string };
  progress?: number;
  dependencies?: string[];
}

/**
 * Export format options
 */
export type ExportFormat = 'csv' | 'json';

/**
 * Export field configuration
 */
export interface ExportField {
  key: string;
  label: string;
  formatter?: (value: unknown) => string;
}
