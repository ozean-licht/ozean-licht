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
 */

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
