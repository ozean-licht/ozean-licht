/**
 * Projects Components
 *
 * Components for the project management dashboard including:
 * - MyTasksWidget: Display tasks assigned to current user
 * - ProjectCard: Project summary card with progress
 * - ProcessTemplatesWidget: Process template browser
 * - PriorityDot: Visual priority indicator for tasks
 * - TaskListItem: Compact expandable task row component
 * - TaskList: Container for task list with tab navigation
 * - CommentThread: Threaded comment display
 * - CommentForm: Comment input form
 *
 * Phase 2 Content Production Components:
 * - ContentTypeSelector: Content type dropdown
 * - WorkflowStatusPicker: Workflow status dropdown with colors
 * - ContentItemCard: Display card for content items
 * - RoleAssignmentPicker: User+role assignment manager
 * - ChecklistEditor: Checklist item editor
 * - TaskGuidePanel: Collapsible SOP/instructions panel
 * - TaskForm: Task creation/edit form
 * - ProjectForm: Project creation/edit form
 *
 * Phase 4 Approvals & Publishing Components:
 * - CategoryPicker: Hierarchical category tree selector
 * - LabelManager: Entity label management with add/remove
 * - ApprovalGate: Approval status display and decision UI
 * - PublishScheduler: Multi-platform publish scheduling
 */

// Existing components
export { default as MyTasksWidget } from './MyTasksWidget';
export { default as ProjectCard } from './ProjectCard';
export type { Project } from './ProjectCard';
export { default as ProcessTemplatesWidget } from './ProcessTemplatesWidget';
export type { ProcessTemplate } from './ProcessTemplatesWidget';
export { default as PriorityDot, derivePriority, getPriorityFromTask } from './PriorityDot';
export type { PriorityLevel } from './PriorityDot';
export { default as TaskListItem } from './TaskListItem';
export type { TaskItem } from './TaskListItem';
export { default as TaskList } from './TaskList';
export type { TabValue } from './TaskList';
export { default as CommentThread } from './CommentThread';
export { default as CommentForm } from './CommentForm';

// Phase 2 Content Production Components
export { default as ContentTypeSelector } from './ContentTypeSelector';
export { default as WorkflowStatusPicker } from './WorkflowStatusPicker';
export { default as ContentItemCard } from './ContentItemCard';
export { default as RoleAssignmentPicker } from './RoleAssignmentPicker';
export { default as ChecklistEditor } from './ChecklistEditor';
export { default as TaskGuidePanel } from './TaskGuidePanel';
export { default as TaskForm } from './TaskForm';
export { default as ProjectForm } from './ProjectForm';

// Phase 4 Approvals & Publishing Components
export { default as CategoryPicker } from './CategoryPicker';
export { default as LabelManager } from './LabelManager';
export { default as ApprovalGate } from './ApprovalGate';
export { default as PublishScheduler } from './PublishScheduler';

// Phase 5 Polish Components
export { default as ActivityLog } from './ActivityLog';
export type { ActivityItem } from './ActivityLog';

// Phase 7 Edit Modals
export { default as TaskEditModal } from './TaskEditModal';
export { default as ProjectEditModal } from './ProjectEditModal';
