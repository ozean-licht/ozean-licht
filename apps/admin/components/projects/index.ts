/**
 * Projects Components
 *
 * Components for the project management dashboard including:
 * - MyTasksWidget: Display tasks assigned to current user
 * - ProjectCard: Project summary card with progress
 * - ProcessTemplatesWidget: Process template browser
 */

export { default as MyTasksWidget } from './MyTasksWidget';
export { default as ProjectCard } from './ProjectCard';
export type { Project } from './ProjectCard';
export { default as ProcessTemplatesWidget } from './ProcessTemplatesWidget';
export type { ProcessTemplate } from './ProcessTemplatesWidget';
